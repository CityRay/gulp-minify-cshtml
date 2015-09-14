'use strict';

var Transform = require('readable-stream/transform');
var rs = require('replacestream');

module.exports = function(options) {
  return new Transform({
    objectMode: true,
    transform: function(file, enc, callback) {
      if (file.isNull()) {
        return callback(null, file);
      }

      function doReplace() {
        
        if (file.isStream()) {
          file.contents = file.contents.pipe(rs());
          return callback(null, file);
        }

        if (file.isBuffer()) {
          
          var temp = String(file.contents);
          
          if (options && options.comments) {
            temp = temp.replace(/<!--[\s\S]*?-->/g, '');
          }
          
          if (options || options.razorComments) {
            temp = temp.replace(/@\*[\s\S]*?\*@/g, '');
          }
          
          if (options || options.whitespace) {
            temp = temp.replace(/>[\s]*\<(?!(\/pre))/gi, '><');
          }
          
          file.contents = new Buffer(temp);
          
          return callback(null, file);
        }

        callback(null, file);
      }

      doReplace();
    }
  });
};
