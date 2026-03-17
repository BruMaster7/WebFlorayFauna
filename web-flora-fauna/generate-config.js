const fs = require('fs');

const apiUrl = process.env.API_URL || 'https://apiflorayfauna.onrender.com/';

const configContent = `const CONFIG = {
    API_URL: '${apiUrl}'
};
`;

try {
    fs.writeFileSync('./config.js', configContent);
    console.log('✅ config.js generated successfully with API_URL:', apiUrl);
} catch (err) {
    console.error('❌ Error writing config.js:', err);
    process.exit(1);
}
