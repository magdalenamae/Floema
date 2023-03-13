
require('dotenv').config()

const express = require('express')
const app = express()
const path = require('path')
const port = 3000

const Prismic = require('@prismicio/client')
const PrismicDom = require('prismic-dom')
const { response } = require('express')

const handleLinkResolver = doc => {
    if(doc.tyoe == 'page') {
        return 'hello'
    }
}

app.use((req, res, next) => {
    res.locals.ctx = {
        endpoint: process.env.PRISMIC_ENDPOINT,
        linkResolver: handleLinkResolver
    }
})

const initApi = req => {
    return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
        acessToken: process.env.PRISMIC_ACCESS_TOKEN,
        req
    })
}
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('pages/home')
})

app.get('/about', (req, res) => {
    initApi(req).then(api => {
        api.query(
            Prismic.predicate.any('document.type',[ 'meta','about'])
        ).then(response => {
            const { results } = response
            console.log(results, response)
            res.render('pages/about')
        })
    })
})

app.get('/collections', (req, res) => {
    res.render('pages/collections')
})

app.get('/detail/:uid', (req, res) => {
    res.render('pages/detail')
})


app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`)
})