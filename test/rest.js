var sys = require('util'),
    rest = require('restler');

rest.get('http://www.web.de').on('complete', function(data) {
  sys.puts(data);
});