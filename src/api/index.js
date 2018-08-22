var express = require('express');
var router = express.Router();
var phantom = require("phantom");

router.post('/screenshot', function (req, res) {


    console.log("render image ", req.body);


    var _ph, _page, _outObj;
    var zoom = 2;

    phantom.create().then(function (ph) {
        _ph = ph;
        return _ph.createPage();
    }).then(function (page) {
        _page = page;
        var viewportSize = req.body.viewportSize || { width: 800, height: 600 };
        zoom = req.body.zoom || 2;
        page.property('viewportSize', viewportSize);
        page.property('zoomFactor', zoom);



        var url = req.body.url || 'https://stackoverflow.com/';

        console.log("open ", url);
        return _page.open(url);
    }).then(function (status) {
        console.log(status);

        var rect = req.body.rect || {
            top: 0,
            left: 0,
            width: 800,
            height: 600
        };

        var rectanglePromise = new Promise(function (resolve, reject) {
            resolve(rect);
        });
        if (req.body.querySelector) {


            rectanglePromise = _page.evaluate(function (querySelector) {
                var element;
                element = document.querySelector(querySelector);
                return element.getBoundingClientRect();
            }, req.body.querySelector);

            console.log("apply query selector", rectanglePromise);
        }

        rectanglePromise.then(function (rectangle) {
            var clipRect = {
                top: rectangle.top * zoom,
                left: rectangle.left * zoom,
                width: rectangle.width * zoom,
                height: rectangle.height * zoom
            };
            console.log("crop image ", clipRect);
            _page.property('clipRect', clipRect);
        }).then(function () {




            var tempfile = require('tempfile');

            var filename = tempfile('.png');
            console.log("use", filename);

            var render = _page.render(filename);

            render.then(function () {

                fs = require('fs')

                var s = fs.createReadStream(filename);
                s.on('open', function () {
                    res.set('Content-Type', 'image/png');
                    s.pipe(res);
                });
                s.on('error', function (err) {
                    res.status(500).send(err);
                });

                _page.close().then(function () {
                    _ph.exit();
                });

            }).catch(function (e) {
                res.status(500).send(e);
            });

            return filename;
        }).catch(function (e) {
            console.log(e);
            res.status(500).send(e);
        });
    }).catch(function (e) {
        console.log(e);
        res.status(500).send(e);
    });


});

module.exports = router;