process.on('uncaughtException', function (err) {
    // prevent node process from crashing
    console.error(err.stack);
});


// init express web server
let express = require('express');
let app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


// ping :D
app.get('/ping', function (req, res) {
    res.send(process.env);
});

// import api route and apply basic auth to it
let basicAuth = require('express-basic-auth');
var api = require('./api');
app.use('/api', basicAuth({
    users: { 'someuser': 'somepassword' },
    challenge: true,
    realm: 'static-user-access',
    unauthorizedResponse: { message: 'unauthorized' }
}), api);


// Error Routs (ALWAYS Keep this as the last routes)
// The 404 Route 
app.use('*', function (req, res) {
    res.status(404).send({ text: 'not found' });
});

// The 500 Route
app.use(function (error, req, res, next) {
    console.error(error.stack);
    res.status(error.status || 500).send({ text: error.stack.split('\n')[0] });
});

// start server
let port = process.env.PORT || 5001;
app.listen(port, function () {
    console.log(`listening on port ${port}!`);
});

