const request = require('postman-request')

const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('9125c50ea5074780bef72740b27935bd'); // Gantilah YOUR_NEWSAPI_API_KEY dengan API key Anda

async function getBerita(query) {
    try {
        const response = await newsapi.v2.everything({
            q: query,
            language: 'id', // Gantilah dengan bahasa yang sesuai
           
        });

        return response.articles;
    } catch (error) {
        console.error(error);
        throw new Error('Gagal mengambil berita dari News API');
    }
}

module.exports = {
    getBerita,
};
