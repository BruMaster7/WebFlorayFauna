import mysql from 'mysql';
import util from 'util';
// Importar librerias

export function getConnection() {
    // Conecta con la base de datos SQL
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

