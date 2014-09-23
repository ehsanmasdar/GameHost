var express = require('express');
var uuid = require('node-uuid');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res) {
    res.render('index.html');
});
router.get('/register', function(req, res) {
	var newid = uuid.v1();
	console.log(newid);
    res.render('register.html', {id:  "blah"});
});
module.exports = router;