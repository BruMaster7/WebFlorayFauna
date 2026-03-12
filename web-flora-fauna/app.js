const { Client } = require('pg');

const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'webflorayfauna',
    password: '1234',
    port: 5432,
};

async function get_animals() {
  const client = new Client(config);
  await client.connect();
  const res = await client.query('SELECT * FROM fauna');
  await client.end();
  return res.rows;
}

async function get_flora() {
  const client = new Client(config);
  await client.connect();
  const res = await client.query('SELECT * FROM flora');
  await client.end();
  return res.rows;
}

const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

app.get('/', async (request, response) => {
    try {
        const animals = await get_animals();
        response.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
        response.end(JSON.stringify(animals));
    } catch (err) {
        console.error(err);
        response.writeHead(500);
        response.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
});

app.get('/flora', async (request, response) => {
    try {
        const flora = await get_flora();
        response.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
        response.end(JSON.stringify(flora));
    } catch (err) {
        console.error(err);
        response.writeHead(500);
        response.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
});

const PORT = 3001;
server.listen(PORT);

console.log(`server is running on port ${PORT}`);
