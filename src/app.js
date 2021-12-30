const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


//set path 
const pubclicdir = path.join(__dirname, '../public')
const viewsdir = path.join(__dirname, '../template/views')
const partialsdir = path.join(__dirname, '../template/partials')


app.use(express.static(pubclicdir))


app.set('view engine', 'hbs')
app.set('views', viewsdir)
hbs.registerPartials(partialsdir)

app.get('', (req, res) => {
    res.render('index', {
        title: 'index.html',
        by: 'Bhanu'
    })
})
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'ABOUT',
        by: 'Bhanu'
    })
})
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'HELP',
        by: 'Bhanu'
    })
})
app.get('/weather', (req, resp) => {
    console.log(req.query)
    if (!req.query.address) {
        return resp.send({
            error: 'send address param'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return resp.send({
                error
            })
        }
        console.log(latitude, longitude, location)
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return resp.send({
                    error
                })
            }

            console.log(location)
            console.log(forecastData)
            resp.send({
                address: req.query.address,
                location,
                forecast: forecastData
            })
        })
    })


})
app.get('/help/*', (req, res) => {
    res.render('pagenotfound', {
        text: 'help artical  not found',

    })
})
app.get('*', (req, res) => {
    res.render('pagenotfound', {
        text: 'page not found',

    })
})

app.listen(3000, () => {
    console.log('server started')
})