import fs from 'fs';
import pg from 'pg';

const folder = './species';

const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'webflorayfauna',
    password: '1234',
    port: 5432,
};

async function runImporter() {
    const client = new pg.Client(config);
    await client.connect();

    try {
        const files = fs.readdirSync(folder);
        
        for (const file of files) {
            if (!file.endsWith('.json')) continue;
            
            const data = fs.readFileSync(`${folder}/${file}`, 'utf8');
            const species = JSON.parse(data);
            
            const table = species['category'] === 'animalia' ? 'fauna' : 'flora';
            const reino = species['reino-2'] ? species['reino-2'] : species['reino'];
            const subreino = species['reino-2'] ? species['reino'] : null;
            const caracteristicas = species['images'] ? species['images'].join(',') : '';

            const query = {
                text: `INSERT INTO ${table} (nombre, nombreCientifico, descripcion, img, orden, familia, genero, distribucionuy, escala, reino, subreino, caracteristicas) 
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                values: [
                    species.name,
                    species.cientific_name,
                    species.description,
                    species.image,
                    species.orden,
                    species.familia,
                    species['género'] || species.genero,
                    species.map_image,
                    species.scale,
                    reino,
                    subreino,
                    caracteristicas
                ],
            };

            await client.query(query);
            console.log(`Imported: ${species.name} into ${table}`);
        }
        
        console.log('Migration finished successfully!');
    } catch (err) {
        console.error('Error during migration:', err);
    } finally {
        await client.end();
    }
}

runImporter();
