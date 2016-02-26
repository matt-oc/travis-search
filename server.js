const http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//basic handler and router
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//routes

app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
})

app.post("/form",function(req,res){
  var query = req.body.query
  res.send("The query entered was: " + query)
})

// Create server
http.createServer(app).listen(7050);
console.log("Server is listening on port: 7050");
 