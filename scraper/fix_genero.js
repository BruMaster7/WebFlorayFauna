import fs from 'fs';
import pg from 'pg';

// Config for local DB
const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'webflorayfauna',
    password: '1234',
    port: 5432,
};

const folder = './species';

async function fixGenero() {
    const client = new pg.Client(config);
    await client.connect();

    const files = fs.readdirSync(folder);
    let updated = 0;
    let skipped = 0;

    for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const data = fs.readFileSync(`${folder}/${file}`, 'utf8');
        const species = JSON.parse(data);

        const genero = species['género'] || species.genero;
        if (!genero) {
            skipped++;
            continue;
        }

        const table = species['category'] === 'animalia' ? 'fauna' : 'flora';
        const nombre = species.name;

        const res = await client.query(
            `UPDATE ${table} SET genero = $1 WHERE nombre = $2`,
            [genero, nombre]
        );

        if (res.rowCount > 0) {
            console.log(`✅ Updated ${nombre} (${table}): genero = ${genero}`);
            updated++;
        } else {
            console.log(`⚠️  Not found in DB: ${nombre}`);
            skipped++;
        }
    }

    await client.end();
    console.log(`\nDone! Updated: ${updated}, Skipped/not found: ${skipped}`);
}

fixGenero().catch(console.error);
