var express = require('express');
var app = express();
app.set('view engine', 'ejs');

// app.get('/convertHtml2image/name/:name/count/:count/image/:image', function (req, res) {
//     res.render('banner', { name: req.params.name, count: req.params.count, image: req.params.image })
//     // res.sendFile(__dirname + '/banner.html')
//     // res.send("name: " + req.params.name + ", \n score: " + req.params.score + ", image: " + req.params.image)
// })

app.get('/convertHtml2image1', function (req, res) {
    res.render('banner', { qs: req.query })
})

app.listen(5000);