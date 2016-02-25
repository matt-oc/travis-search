function search(input){
var seneca = require('seneca')()

seneca.client(44005).act('{"role":"travis","cmd":"get","name":input}', function (err, data) {
  if (err) {
    this.log.error(err)
    return
  }

  else {
    console.log(data);
  }
})
}
