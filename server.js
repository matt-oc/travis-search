const http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var seneca = require('seneca')()
var app = express();
var info;
var input;

app.set('view engine','ejs');
//basic handler and router
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'fonts')));
//routes

app.get("/",function(req,res){
  res.render('index');
})

app.get("/about",function(req,res){
  res.render("about");
})
app.post("/search",function(req,res){
  var query = req.body.query
  if (query){
    seneca.client(44005).act('{"role":"travis","cmd":"get",'+'"name":' + query + '}', function (err, data) {
      
      var result = '';
      
      if (err) {
        this.log.error(err)
        return
      }
      else {
        if(!data || data == null){
          res.render('results', {result:data, input:query, github:""})
        }
        
        else if(data.type == "fail"){
          res.render('results', {result:"onNpm", input:query, github:""})
        }
        else{
        var gitUrl = data.giturl.substring(4);
          info = data;
          input = query;
          res.render('results', {result:data, input:query, github:gitUrl})
        }
      }
    })
  }
  else {
    res.render('results',{result:"invalid", input:"empty", github:""})
  }
})
app.post("/raw",function(req,res){
  res.render('raw', {raw:info, input:input})
  
})
app.get('*', function(req, res){
  res.send('page not found, please go back', 404);
});
// Create server
http.createServer(app).listen(7050);
console.log("Server is listening on port: 7050");

require('seneca')()
.use('/travis.js')
.client({ host:'localhost', pin:{role:'travis', cmd:'*'}})
.listen(44005)
.repl(43005)
console.log("Travis server listening");

