'use strict'

var Travis = require('travis-ci')
var Request = require('request')
var _ = require('lodash')
var tr = new Travis({
  version: '2.0.0'
})

module.exports = function travis () {
  var seneca = this

  var options = seneca.util.deepextend({
    registry: 'http://registry.npmjs.org/'
  })

  seneca.add('role:travis,cmd:extract', cmd_extract)
  seneca.add('role:travis,cmd:get', cmd_get)
  seneca.add('role:travis,cmd:parse', cmd_parse)

  function cmd_get (args, done) {
    var name = args.name
    

    var url = options.registry + name
    Request.get(url, function (err, res, body) {
      if (err) {
        return done(err)
      }
      else if (_.isEmpty(JSON.parse(body))) {
        return done(err)
      }
      var data = JSON.parse(body)
      seneca.act('role:travis,cmd:extract', {data: data}, function (err, data) {
        if (err) {
          return done(err)
        }
        var gitData = cmd_parse(data)
        if (gitData){
        var user = gitData[1]
        var reponame = gitData[2]
      }
        if (!user) {
          return done(null,{type:"fail"})
        }
        else {
          getRepo(user,reponame,data, function(build){
            done(null,build)
          })
        }
      })
    })
  }
}

function getRepo(user, reponame, data, cb){
  var res1
  var res2 
  
  tr.repos(user, reponame).get(function (err, res) {
    if (err) {
          cb(err)
        }
    res1 = res
    
  })
  tr.repos(user, reponame).builds.get(function (err, res) {
    if (err) {
          cb(err);
  }
    res2 = res
    
    if (res1 && res2.builds[0]){
    var build = Object.assign(res1.repo, res2.builds[0].config, data)
  }
  else if(res1){
    build = Object.assign(res1.repo, data)
  }
  else {
    build = null;
  }
    cb(build);
  })
}

function cmd_extract (args, done) {
  var data = args.data
  var dist_tags = data['dist-tags'] || {}
  var latest = ((data.versions || {})[dist_tags.latest]) || {}
  var repository = latest.repository || {}
  var out = {
    giturl: repository.url
  }

  done(null, out)
}

function cmd_parse (args) {
  var m = /[\/:]([^\/:]+?)[\/:]([^\/]+?)(\.git)*$/.exec(args.giturl)
  if (m) {
    return (m)
  }
  else {
    return null
  }
}
