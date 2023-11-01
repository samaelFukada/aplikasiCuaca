const express = require('express')
const hbs = require('hbs')
const path = require('path')
const geocode = require('./utils/geocode')
const forecast = require('./utils/prediksiCuaca')
const getBerita = require('./utils/berita')
const beritaUtils = require('./utils/berita');

// console.log(__dirname)
// console.log(__filename)
// console.log(path.join(__dirname, '../public'))

const app = express()
const port = process.env.PORT || 3000
//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//handlebars engine and view location
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index',{
        title: 'Aplikasi Cek Cuaca',
        name: 'Ahmad Reginald Syahiran'
    })
})

app.get('/tentang', (req, res) => {
    res.render('tentang', {
        title: 'Tentang Saya',
        name: 'Ahmad Reginald Syahiran'
    })
})


app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
        title: 'Bantuan',
        teksBantuan: 'Bantuan apa yang anda butuhkan?',
        name: 'Ahmad Reginald Syahiran'
    })
})



app.get('/infocuaca', (req, res) => {
    if(!req.query.address){
        return res.send({
            error:'Kamu harus memasukan lokasi yang ingin dicari'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error){
                return res.send({error})
            }
            res.send({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address: req.query.address
            })
        })
    })
})

app.get('/berita', async (req, res) => {
    const query = 'terbaru';

    try {
        const articles = await beritaUtils.getBerita(query);

        res.render('berita', {
            title: 'Berita',
            articles: articles,
            name: 'Ahmad Reginald Syahiran'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal mengambil berita', details: error.message });
    }
});





app.get('/bantuan/*', (req, res) => {
    res.render('404',{
        title: '404',
        name: 'Ahmad Reginald Syahiran',
        pesanError: 'Belum ada artikel bantuan tersedia'
    })
})

app.get('*', (req, res) => {
    res.render('404',{
        title: '404',
        name: 'Ahmad Reginald Syahiran',
        pesanError: 'Halaman tidak ditemukan'
    })
})



app.listen(port, () => {
    console.log('Server is running on port '+ port)
})

