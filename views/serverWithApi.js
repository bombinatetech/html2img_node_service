var express = require('express');
const https = require('https')
var fs = require('fs');
var ejs = require('ejs');

const app = express();
const PORT = 5000;

app.set('view engine', 'ejs');

app.get('/convertHtml2image', (req, resp) => {
    ejs.renderFile('views/banner.ejs', { qs: req.query }, function (err, str) {
        console.log("html: ", str);
        const data = JSON.stringify({
            html: str,
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
                // console.log(image["url"])
                resp.send(image["url"])
            })
        })

        req.on('error', (error) => {
            console.error(error)
        })

        req.write(data)
        req.end()
    });
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});