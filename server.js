const http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var seneca = require('seneca')()
var app = express();

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
app.post("/form",function(req,res){
  var query = req.body.query
  console.log(query);
  //if (query){
  seneca.client(44005).act('{"role":"travis","cmd":"get",'+'"name":' + query + '}', function (err, data) {
    var result = '';
    if (err) {
      this.log.error(err)
      return
    }
    else if (data == null){
      res.render('results',{result:"There were no matching entries"})
    }
    else {
      
      if (data){
      result = JSON.stringify(data,null,"   "); 
    //  var formatted = format(data)
    } 
      res.render('results', {result:result, input:query})
    }
  })
//}
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
 
  function display(data) {
     var resp = "";
     var prop = null;
     var dataJSON = JSON.parse(data);

     for (prop in dataJSON) {
         if (patternJSON.hasOwnProperty(prop)) {
             resp += "obj" + "." + prop + " = " + dataJSON[prop] + "\n";
         }
     }
     return resp;
 }