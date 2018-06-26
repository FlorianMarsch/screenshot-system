var express = require('express');
var router = express.Router();


router.post('/screenshot', function (req, res) {




    var phantom = require("phantom");
    var _ph, _page, _outObj;

    phantom.create().then(function (ph) {
        _ph = ph;
        return _ph.createPage();
    }).then(function (page) {
        _page = page;
        return _page.open('https://stackoverflow.com/');
    }).then(function (status) {
        console.log(status);

        _page.render('./output/stack.png');

        res.status(200).send({ "saved": "successfully" });
        _page.close();
        _ph.exit();
    }).catch(function (e) {
        es.status(500).send(e);
    });


});

module.exports = router;