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

// Middleware para CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', async (request, response) => {
    try {
        const animals = await get_animals();
        response.writeHead(200, {'Content-Type': 'application/json'});
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
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(flora));
    } catch (err) {
        console.error(err);
        response.writeHead(500);
        response.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
});

app.get('/search', async (request, response) => {
    const query = request.query.q;
    if (!query) {
        response.writeHead(400);
        return response.end(JSON.stringify({ error: 'Query parameter "q" is required' }));
    }

    try {
        const client = new Client(config);
        await client.connect();
        
        const sql = `
            (SELECT *, 'animalia' as type FROM fauna WHERE nombre ILIKE $1 OR nombrecientifico ILIKE $1 OR descripcion ILIKE $1)
            UNION
            (SELECT *, 'flora' as type FROM flora WHERE nombre ILIKE $1 OR nombrecientifico ILIKE $1 OR descripcion ILIKE $1)
        `;
        const res = await client.query(sql, [`%${query}%`]);
        await client.end();
        
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(res.rows));
    } catch (err) {
        console.error(err);
        response.writeHead(500);
        response.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
});

const PORT = 3001;
server.listen(PORT);

console.log(`server is running on port ${PORT}`);
