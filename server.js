var express = require('express');
var fs = require('fs');
var path = require('path');
var http = require('http');
var Request = require("request");
var FormData = require('form-data');
var FileAPI = require('file-api')
    , File = FileAPI.File, FileList = FileAPI.FileList, FileReader = FileAPI.FileReader;
var app = express();
app.set('view engine', 'ejs');
const nodeHtmlToImage = require('node-html-to-image')

app.get('/convertHtml2image1', function (req, res) {
    nodeHtmlToImage({
        output: './banner.png',
        html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>Banner</title><style>.container{background-color:rgb(255,252,209);width:100%;padding:2rem}.row{width:100%;display:flex;flex-direction:row;align-items:center;justify-content:center}[class^="col-"]{padding:0 1.5rem}.col-2{width:16.666}.col-10{width:83.33}.img{border-radius:50%;width:13rem;height:13em;object-fit:cover}p{margin:10px 0;font-size:2.7rem;color:red;font-weight:700;font-family:sans-serif}</style></head><body><div id="html-content" class="container"><div class="row"><div class="col-2"><img id="img" class="img" src={{image}} alt="image"/></div><div class="col-10"><p><span id="name">{{name}}</span> is a Top Answerer.</p><p>Recorded <span id="count">{{count}}</span> answers today.</p></div></div></div></body></html>',
        content: {
            name: req.query.name,
            count: req.query.count,
            image: req.query.image
        }
    })
        .then(() => {
            fs.readFile(`banner.png`, "base64", function read(err, data) {
                // fs.readFileSync(`banner.png`, function read(err, data) {
                if (err) {
                    throw err;
                }

                var file = data;
                // var file = new File({
                //     buffer: data,
                //     name: "banner.png",
                //     type: "image/png",
                //     jsdom: true,
                //     async: true,
                // });
                // console.log("file: ", file);

                var formData = new FormData();
                formData.append('content_file', file);
                console.log("formData: ", formData);

                Request.post({
                    "headers": {
                        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGVja19zYWx0X2tleSI6dHJ1ZSwiYW5zd2VyZXJUeXBlIjowLCJzYWx0IjoiWXRlbmRFcjEyMzQ1dGdibm9wdWd5dWZndmpoYmtvcHV5dHJlc2RyZnR5Z3VpIiwibmJmIjoxNTg0NDMxMzU5LCJ1c2VyX2lkIjoiNWI3ZjIzYjc0YTRmZTYwYTE2MGU3NmRiIiwicGhvbmUiOiI3MDAwNTg2MjQ5IiwiZ2VuZXJhdGVkX2F0IjoxNTg0NDMxMzU5Mjk4LCJjdXJyZW50X2xhbmd1YWdlIjowLCJjcmVhdGVkX2F0IjoxNTE0NTE0NDg0LCJpZCI6MTE4OTU0LCJleHAiOjE1OTIyMDczNTksImlhdCI6MTU4NDQzMTM1OX0.Tvb61e7G6dYGWQGopBhMBbSDCGqozL8SyODcoRmAYpI"
                    },
                    "url": "https://api.oktalk.com/web/channels/owner/topics/image/upload",
                    "body": formData
                }, (error, response, body) => {
                    if (error) {
                        return console.log("Error: ", error);
                    }
                    // res.send("image_url: " + "response.url")
                    res.send("output: " + error + ", " + JSON.stringify(response) + ", " + body)
                });
            });
        })
})

app.listen(5000);