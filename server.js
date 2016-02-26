const http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var seneca = require('seneca')()
var app = express();

//basic handler and router
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'fonts')));
//routes

app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
})

app.get("/about",function(req,res){
  res.sendFile(__dirname + "/about.html");
})
app.post("/form",function(req,res){
  var query = req.body.query
  

  seneca.client(44005).act('{"role":"travis","cmd":"get",'+'"name":' + query + '}', function (err, data) {
    if (err) {
      this.log.error(err)
      return
    }
    else if (data == null){
      res.send("There were no matching entries")
    }
    else {
      var jsonPretty = JSON.stringify(data,null,2);  
      res.send("The query entered was: " + jsonPretty)
    }
  })
  
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
 