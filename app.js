(function() {
  var app, db, delete_node, express, neo, neodb, port;
  express = require("express");
  app = module.exports = express.createServer();
  port = process.env.PORT || 3000;
  neo = require("neo4j");
  neodb = process.env.NEO4J_URL || "http://localhost:7474";
  db = new neo.GraphDatabase(neodb);
  app.configure(function() {
    app.set("views", __dirname + "/views");
    app.set("view engine", "jade");
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + "/public"));
    return app.set("view options", {
      pretty: true
    });
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
      title: "ExplainTag"
    });
  });
  delete_node = function(id) {
    return x * x;
  };
  app["delete"]("/db", function(req, res) {
    var food, _i, _len, _ref;
    _ref = ['toast', 'cheese', 'wine'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      food = _ref[_i];
      eat(food);
    }
    return res.send("yo");
  });
  app.post("/hashtags", function(req, res) {
    var definition, indexed_node, node, node_data, value;
    value = req.param('value');
    definition = req.param('definition');
    if (value != null) {
      node_data = {
        type: 'hashtag',
        value: value,
        definition: definition
      };
      node = db.createNode(node_data);
      node.save();
      node.index('hashtags', 'value', value);
      indexed_node = db.getIndexedNode('hashtags', 'value', value);
      console.log(indexed_node.toString());
    }
    return res.send(definition);
  });
  app.listen(port);
  console.log("listening on port " + (app.address().port) + " in " + app.settings.env + " mode");
}).call(this);
