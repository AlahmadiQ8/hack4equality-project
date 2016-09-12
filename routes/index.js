var express = require('express');
var router  = express.Router();
var OpenTok = require('opentok');
var debug   = require('debug')('index')
var fs      = require("fs");
var Promise = require("bluebird");

OpenTok.prototype.createSessionAsync = Promise.promisify(OpenTok.prototype.createSession);
const apiKey    = process.env.OPENTOK_KEY;
const apiSecret = process.env.OPENTOK_SECRET;
var opentok     = new OpenTok(apiKey, apiSecret);

var UserSession = require('../models').UserSession;




// ======================================
// GET index
//
function index(req, res) {
  UserSession.find({}).exec()
  .then(function(userSessions){
    res.render('index', { title: 'Express', userSessions: userSessions});
  })
}

router.get('/', index);


// ======================================
// POST /create-session 
//
router.post('/create-session', function(req, res, next) {

  nickname = req.body.nickname;

  UserSession.findOne({'nickname': nickname}).exec()
  .then(function(doc){
    if (doc){
      debug('session already exists');
      return new Promise.resolve(doc.sessionId);
    } else {
      debug('no session found.. creating new one');
      return opentok.createSessionAsync({mediaMode:"routed"}).then(function(sessionObj){
        UserSession.create(
          {'nickname': nickname, 'sessionId': sessionObj.sessionId},
          function(error, doc){
            if (error){
              debug(error)
              throw err;
            }
          }
        );
        return new Promise.resolve(sessionObj.sessionId);
      }).catch(function(error) {
        debug(error);
        throw error;
      });
    }
  }).then(function(sessionId){
    var token = opentok.generateToken(sessionId, {
      role:       'publisher',
      expireTime: (new Date().getTime() / 1000)+(7 * 24 * 60 * 60), // in one week
      data:       'name='+nickname  
    });

    var serverData = { 
      'apiKey': apiKey,
      'sessionId': sessionId,
      'token': token,
    }
    res.locals.serverData = JSON.stringify(serverData);
    next()
  })
}, index)

module.exports = router;