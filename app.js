(function() {
  var app, express, neo, neodb, port;
  express = require("express");
  app = module.exports = express.createServer();
  port = process.env.PORT || 3000;
  neo = require("neo4j");
  neodb = process.env.NEO4J_URL || "http://localhost:7474";
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
  app.post("/hashtags/", function(req, res) {
    var db, db_ht, ht;
    console.log("hashtag");
    db = new neo.GraphDatabase(neodb);
    ht = {
      value: req.body.value,
      type: "hashtag",
      definition: req.body.definition
    };
    db_ht = db.createNode(ht);
    console.log("created " + (console.dir(ht)));
    db_ht.index("hashtags", "value", ht.value);
    db_ht.save();
    return res.send("index", {
      title: "Express"
    });
  });
  app.listen(port);
  console.log("listening on port " + (app.address().port) + " in " + app.settings.env + " mode");
}).call(this);
