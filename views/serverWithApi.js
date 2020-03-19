var express = require('express');
const https = require('https')
var fs = require('fs');

const app = express();
const PORT = 5000;

app.set('view engine', 'ejs');

app.get('/convertHtml2image', (req, res) => {
    // res.status(200).send({
    //     name: req.query.name,
    //     count: req.query.count,
    //     image: req.query.image
    // })
    fs.readFile("views/banner.html", 'UTF-8', function (error, pgResp) {
        console.log(pgResp);
        // resp.end();
    });
    res.render('banner', { qs: req.query })
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});

const data = JSON.stringify({
    html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>Banner</title><style>.container{background-color:rgb(255,252,209);width:100%;padding:2rem}.row{width:100%;display:flex;flex-direction:row;align-items:center;justify-content:center}[class^="col-"]{padding:0 1.5rem}.col-2{width:16.666}.col-10{width:83.33}.img{border-radius:50%;width:13rem;height:13em;object-fit:cover}p{margin:10px 0;font-size:2.7rem;color:red;font-weight:700;font-family:sans-serif}</style></head><body><div id="html-content" class="container"><div class="row"><div class="col-2"><img id="img" class="img" src={{image}} alt="image"/></div><div class="col-10"><p><span id="name">{{name}}</span> is a Top Answerer.</p><p>Recorded <span id="count">{{count}}</span> answers today.</p></div></div></div></body></html>',
    content: {
        name: "req.query.name",
        count: " req.query.count",
        image: "req.query.image"
    }
})

const apiId = "a5c6b14c-c826-4489-9464-57ff0319a2e1"
const apiKey = "d8eea83d-d105-43fb-8dc0-cd68bc38f7e7"

const options = {
    hostname: 'hcti.io',
    port: 443,
    path: '/v1/image',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + new Buffer(apiId + ':' + apiKey).toString('base64')
    }
}

const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', (d) => {
        const image = JSON.parse(d)
        console.log(image["url"])
    })
})

req.on('error', (error) => {
    console.error(error)
})

req.write(data)
req.end()