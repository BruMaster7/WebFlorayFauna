import axios from 'axios';
import { load } from 'cheerio';
import fs from 'fs';


const WEB_URL = 'http://manosanta.com.uy/contenidos/ceibal/public/ciencias-naturales';
const INDEX_URL = `${WEB_URL}/indice-alfabetico`;
const BASE_IMAGE_URL = 'http://manosanta.com.uy/contenidos/ceibal';
const LETTERS = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'm', 'n', 'n2', 'o', 'p', 'q', 'r', 's',
    't', 'v', 'y', 'z'
];

for (const letter of LETTERS) {
    const webContent = await axios.get(`${INDEX_URL}/${letter}.html`);


    const $ = load(webContent.data);
    const allUrls = $('.column ul li a');
    for (const entry of allUrls) {
        const speciesContent = await axios.get(`${WEB_URL}/${entry.attribs.href.slice(3,)}`);
        const $ = load(speciesContent.data);
        const tokenData = $('#tokenData ul li');
        const images = $('#tokenData ul li.noPadding img');
        const speciesData = {
            'name': $('h1').text(),
            'cientific_name': $('h4').text(),
            'description': $('.content p').text(),
            'image': `${BASE_IMAGE_URL}/${$('#image img')[0].attribs.src.replace(/\.\.\//g, '')}`,
            'category': $('body')[0].attribs.class,
            'orden': tokenData[0].children[1].data.trim(),
            'familia': tokenData[1].children[1].data.trim(),
            'género': tokenData[2].children[2].children[0].data,
            'scale': `${BASE_IMAGE_URL}/${images[0].attribs.src.replace(/\.\.\//g, '')}`,
            'map_image': `${BASE_IMAGE_URL}/${images[1].attribs.src.replace(/\.\.\//g, '')}`,
            'images': [],
            'reino': $('#tabMenu li').text(),
            'reino-2': $('#tabMenu li.noTab').text()
        };
        if (speciesData['reino-2']) speciesData['reino'] = speciesData['reino'].replace(speciesData['reino-2'], '');
        for (const image of $('#tokenData ul li.last img')) {
            speciesData['images'].push(`${BASE_IMAGE_URL}/${image.attribs.src.replace(/\.\.\//g, '')}`);
        }
        fs.writeFile(
            `species/${speciesData['name']}.json`,
            JSON.stringify(speciesData, null, 4),
            function(err) { if (err) console.log(`${WEB_URL}/${entry.attribs.href.slice(3,)}`); }
        );
    }
}
