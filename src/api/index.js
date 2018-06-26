var express = require('express');
var router = express.Router();


router.post('/screenshot', function (req, res) {




    var phantom = require("phantom");
    var _ph, _page, _outObj;
    var zoom = 2;

    phantom.create().then(function (ph) {
        _ph = ph;
        return _ph.createPage();
    }).then(function (page) {
        _page = page;
        page.property('viewportSize', { width: 800, height: 600 });
        page.property('zoomFactor', zoom);
        var rect = {
            top: 0,
            left: 0,
            width: 800,
            height: 600
        };
        var clipRect = {
            top: rect.top * zoom,
            left: rect.left * zoom,
            width: rect.width * zoom,
            height: rect.height * zoom
        };
        page.property('clipRect', clipRect);
        return _page.open('https://stackoverflow.com/');
    }).then(function (status) {
        console.log(status);



        _page.render('./output/stack.png');

        fs = require('fs')

        var s = fs.createReadStream('./output/stack.png');
        s.on('open', function () {
            res.set('Content-Type', 'image/png');
            s.pipe(res);
        });
        s.on('error', function (err) {
            res.status(500).send(err);
        });

        _page.close();
        _ph.exit();
    }).catch(function (e) {
        res.status(500).send(e);
    });


});

module.exports = router;