var sentiment = require('sentiment');
var trainedData = require('./training.js');
module.exports = function(text) {
  return sentiment(text, trainedData);
}