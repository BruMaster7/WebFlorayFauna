const { execSync } = require('child_process');

const renderExternalUrl = process.argv[2];

if (!renderExternalUrl || !renderExternalUrl.startsWith('postgres')) {
    console.error('----------------------------------------------------');
    console.error('⚠️ ERROR: Falta la External Database URL o es inválida.');
    console.error('----------------------------------------------------');
    process.exit(1);
}

try {
    console.log('\n===============================================');
    console.log('🚀 INICIANDO MIGRACIÓN DE DATOS HACIA RENDER 🚀');
    console.log('===============================================\n');

    console.log('⏳ 1. Preparando extracción de datos de la base de datos local "webflorayfauna"...');

    // Comando para hacer el dump de la DB local
    // --clean : Limpia las tablas destino si existen
    // --no-owner --no-privileges : Evita errores de permisos en bases de datos administradas (como Render)
    const dumpCmd = 'PGPASSWORD="1234" pg_dump -U postgres -h localhost -p 5432 -d webflorayfauna --no-owner --no-privileges --clean';

    console.log('🌐 2. Conectando con la base de datos de Render y subiendo información...');

    // Hacemos el dump local y lo enviamos (pipe) instantáneamente a psql hacia Render
    const fullCmd = `${dumpCmd} | psql "${renderExternalUrl}"`;

    execSync(fullCmd, { stdio: 'inherit' });

    console.log('\n✅ ¡MIGRACIÓN COMPLETADA CON ÉXITO!');
    console.log('Tus plantas y animales ya están en la nube de Render listos para ser usados.\n');

} catch (error) {
    console.error('\n❌ Ocurrió un error durante la migración.');
    console.error('Por favor verifica que de la External Database URL sea correcta y que tu base de datos local esté corriendo.');
}
