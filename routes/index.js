var express = require('express');
var uuid = require('node-uuid');
var router = express.Router();
//Mongo DB setup
var mongoose = require('mongoose');
var mongosettings = {
  user: 'sam',
  pass: ''
}
var schema = new mongoose.Schema({ name: 'string', id: 'string' });
var user = mongoose.model('user', schema);
mongoose.connect("ehsandev.com/GameHost",mongosettings)
/* GET home page. */
router.get('/', function(req, res) {
    res.render('index.html');
});
router.get('/register', function(req, res) {
	var newid = uuid.v1();
	var username = "Test";
	var useToRegister = new user({name:username,id:newid})
	useToRegister.save(function (err) {
  	if (err) return handleError(err);
  		// saved!
	})
	console.log(newid);
    res.render('register.jade', {id:  newid});
});
module.exports = router;