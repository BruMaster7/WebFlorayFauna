import { getConnection } from './mysqlconnection.js';
import fs from 'fs';
import axios from 'axios';
import { promisify } from 'util';
import stream from 'stream';

const connection = getConnection();
const tables = ['fauna', 'flora'];
const columns = ['img', 'caracteristicas'];

const caracteristicas = [];
const specieimgs = [];

const finished = promisify(stream.finished);

async function downloadImgs(imgs, folder) {
    for (const image of imgs) {
        await downloadImg(image, `${folder}/${image.split('/').slice(-1)}`);
    }
} 

async function downloadImg(url, filename) {
    const writer = fs.createWriteStream(filename);
    const response = await axios.get(url, {responseType: 'stream'});
    response.data.pipe(writer);
    return finished(writer);
}



for (const table of tables) { // const table in tables devuelve [0], [1], con "of" devuelve la string de cada elemento del array.
    const results = await connection.query(`SELECT ${columns.join(',')} FROM ${table}`);
    for (const result of results) {
        specieimgs.push(result.img);
        for (const img of result.caracteristicas.split(',')) {
            if (!caracteristicas.includes(img) && img != '') {
                caracteristicas.push(img);
            }
        }
    }
}

await downloadImgs(specieimgs, './speciesimg');
await downloadImgs(caracteristicas, './caracteristicas');




