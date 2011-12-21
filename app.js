(function() {
  var app, express, port;
  express = require("express");
  app = module.exports = express.createServer();
  port = process.env.PORT || 3000;
  app.configure(function() {
    app.set("views", __dirname + "/views");
    app.set("view engine", "jade");
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    return app.use(express.static(__dirname + "/public"));
  });
  app.configure("development", function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });
  app.configure("production", function() {
    return app.use(express.errorHandler());
  });
  app.get("/", function(req, res) {
    return res.render("index", {
      title: "Express"
    });
  });
  app.listen(port);
  console.log("listening on port " + (app.address().port) + " in " + app.settings.env + " mode");
}).call(this);
