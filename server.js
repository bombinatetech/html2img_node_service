var express = require('express');
var fs = require('fs');
var Request = require("request");
var app = express();
app.set('view engine', 'ejs');
const nodeHtmlToImage = require('node-html-to-image')

app.get('/healthcheck', function (req, res) {
    res.send("html to img")
});

app.get('/convertHtml2image', function (req, res) {
    let userId = req.query.user_id || 0;
    let lang = req.query.language || 0;
    nodeHtmlToImage({
        output: `banner-${lang}-${userId}.png`,
        html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>Banner</title><style>.container{background-color:rgb(255, 233, 154);padding:1rem}.row{width:100%;display:flex;flex-direction:row;align-items:center;justify-content:center}[class^="col-"]{padding:0 1rem}.img{box-shadow: 3px 3px 8px grey;border-radius:50%;width:6rem;height:6em;object-fit:cover}p{margin:2px 0;font-size:1.6rem;color:gray;font-weight:700;font-family:sans-serif}</style></head><body><div id="html-content" class="container"><div class="row"><div class="col-2"><img id="img" class="img" src={{image}} alt="image"/></div><div class="col-10"><p><span id="name">{{name}}</span> is a Top Answerer.</p><p>Recorded <span id="count">{{count}}</span> answers today.</p></div></div></div></body></html>',
        content: {
            name: req.query.name,
            count: req.query.count,
            image: req.query.image
        }
    })
        .then(() => {
            var formData = {
                name: 'content_file',
                content_file: {
                    value: fs.createReadStream(`banner-${lang}-${userId}.png`),
                    options: {
                        filename: `banner-${lang}-${userId}.png`,
                        contentType: 'image/png'
                    }
                }
            };

            Request.post({
                "headers": {
                    "Content-Type": "multipart/form-data",
                    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGVja19zYWx0X2tleSI6dHJ1ZSwiYW5zd2VyZXJUeXBlIjowLCJzYWx0IjoiWXRlbmRFcjEyMzQ1dGdibm9wdWd5dWZndmpoYmtvcHV5dHJlc2RyZnR5Z3VpIiwibmJmIjoxNTg0NDMxMzU5LCJ1c2VyX2lkIjoiNWI3ZjIzYjc0YTRmZTYwYTE2MGU3NmRiIiwicGhvbmUiOiI3MDAwNTg2MjQ5IiwiZ2VuZXJhdGVkX2F0IjoxNTg0NDMxMzU5Mjk4LCJjdXJyZW50X2xhbmd1YWdlIjowLCJjcmVhdGVkX2F0IjoxNTE0NTE0NDg0LCJpZCI6MTE4OTU0LCJleHAiOjE1OTIyMDczNTksImlhdCI6MTU4NDQzMTM1OX0.Tvb61e7G6dYGWQGopBhMBbSDCGqozL8SyODcoRmAYpI"
                },
                "url": "https://api.oktalk.com/web/channels/owner/topics/image/upload",
                "formData": formData
            }, (error, response, body) => {
                if (error) {
                    return console.log("Error: ", error);
                }
                var resp = JSON.parse(body)
                res.json(resp);
            });

        })
})

app.listen(5000);