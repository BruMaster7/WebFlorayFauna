const mysql = require('mysql');
const util = require('util');


function get_connection() {
  const connection = mysql.createConnection({
      host: 'localhost',
      database: 'webflorayfauna',
      user: 'root',
      password: '1234',
      port: 3306,
  });

  connection.query = util.promisify(connection.query).bind(connection);

  return connection;
}

async function get_animals() {
  const connection = get_connection()
  const animals = await connection.query('SELECT * FROM fauna');
  connection.end();
  return animals;
}

async function get_flora() {
  const connection = get_connection()
  const flora = await connection.query('SELECT * FROM flora');
  connection.end();
  return flora;
}


const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);


app.get('/', async (request, response) => { 'request is declared'
    response.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
    response.end(JSON.stringify(await get_animals()));
});

app.get('/flora', async (request, response) => { 'request is declared'
    response.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
    response.end(JSON.stringify(await get_flora()));
});

const PORT = 3001
server.listen(PORT)

console.log(`server is running on port ${PORT}`)
