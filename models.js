var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var UserSessionSchema = new mongoose.Schema({
  nickname: String,
  sessionId: String, 
  stored_at: { type: Date, default: Date.now },
})

exports.UserSession = mongoose.model('UserSession', UserSessionSchema);