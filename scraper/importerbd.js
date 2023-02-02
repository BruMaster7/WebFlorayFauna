import fs from 'fs';
import { getConnection } from './mysqlconnection';

// Importo las librerias que voy a usar


const folder = './species'; // Variable con la direccion de la carpeta
const insertStatement = 'INSERT INTO ${table} (nombre, nombreCientifico, descripcion, img, orden, familia, genero, distribucionuy, escala, reino, subreino, caracteristicas) VALUES (${values})'; // Reemplazo por el valor de la variable table manualmente (string normal sin comillas invertidas + funcion replace]) 

fs.readdir(folder, loadFiles); // llama a la funcion para cargar los archivos

function loadFiles (err, files) {
    //Carga los archivos
    if (err) throw err;
    const connection = getConnection();
    for(const file of files) {
        //console.log(file);
        const data = fs.readFileSync(`${folder}/${file}`);
        const species = parseFile(data);
        insertBD(species, connection);
    }
    connection.end();
}

function parseFile (data) {
    // Convierte los archivos de strings (texto plano) a un object de JavaScript
    const species = JSON.parse(data);
    //console.log(species);
    return species;

}



function insertBD (species, connection) {
    const table = species['category'] === 'animalia' ? 'fauna' : 'flora'; //Basicamente un if-else segun la categoria, coloca en la tabla fauna o flora
    const reino = species['reino-2'] ? species['reino-2'] : species['reino']; // Si el valor de reino 2 es nulo, entonces el reino es igual a reino 1
    const subreino = species['reino-2'] ? species['reino'] : null;
    const caracteristicas = species['images'].join(',');
    const values = `'${species.name}', '${species.cientific_name}', '${species.description}', '${species.image}', '${species.orden}', '${species.familia}', '${species.genero}', '${species.map_image}', '${species.scale}', '${reino}', '${subreino}', '${caracteristicas}'`;
    connection.query(insertStatement.replace('${table}', table).replace('${values}', values));

}