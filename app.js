(function() {
  var add_node_to_index, app, create_node, create_relationship, delete_node, delete_relationship, express, neo4j_url, port, print, rest, twit, twitter;
  express = require("express");
  app = module.exports = express.createServer();
  port = process.env.PORT || 3000;
  neo4j_url = process.env.NEO4J_URL || "http://localhost:7474";
  rest = require("restler");
  twitter = require('twitter');
  twit = new twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
  });
  twit.stream('user', {
    track: 'explaintag'
  }, function(stream) {
    return stream.on('data', function(data) {
      console.log(data);
      if ((data.user != null) && data.user.screen_name !== "ExplainTag") {
        return twit.updateStatus('@' + data.user.screen_name + " morjen!", function(data) {
          return console.log(data);
        });
      }
    });
  });
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
  print = function(err, res) {
    return console.log(res);
  };
  create_relationship = function(from, to, callback) {
    return rest.post(from + '/relationships', {
      data: {
        "to": to,
        "type": "EXPLAINED_BY"
      }
    }).on('complete', function(data, response) {
      return callback(null, data);
    });
  };
  create_node = function(data, callback) {
    return rest.post(neo4j_url + '/db/data/node', {
      data: data
    }).on('complete', function(data, response) {
      return callback(null, data);
    });
  };
  delete_node = function(id) {
    return rest.del(neo4j_url + '/db/data/node/' + id).on("complete", function(data) {});
  };
  delete_relationship = function(id) {
    return rest.del(neo4j_url + '/db/data/relationship/' + id).on("complete", function(data) {});
  };
  add_node_to_index = function(node_url, index_name, key, value) {
    var d, url;
    url = neo4j_url + '/db/data/index/node/' + index_name;
    console.log(url);
    d = {
      "uri": node_url,
      "key": key,
      "value": value
    };
    return rest.post(url, {
      data: JSON.stringify(d),
      headers: {
        'Content-Type': 'application/json'
      }
    }).on('complete', function(data, response) {
      return console.log(data);
    });
  };
  app["delete"]("/db", function(req, res) {
    var id;
    for (id = 0; id <= 200; id++) {
      delete_relationship(id);
    }
    for (id = 0; id <= 200; id++) {
      delete_node(id);
    }
    return res.send("yo");
  });
  app.post("/tags", function(req, res) {
    var explanation_value, tag_data, tag_value;
    tag_value = req.param('tag');
    explanation_value = req.param('explanation');
    if (tag_value != null) {
      tag_data = {
        type: 'tag',
        value: tag_value
      };
      create_node(tag_data, function(err, tag_node) {
        var explanation_data;
        add_node_to_index(tag_node.self, 'tags', 'value', tag_value);
        if (explanation_value != null) {
          explanation_data = {
            type: 'explanation',
            value: explanation_value
          };
          return create_node(explanation_data, function(err, explanation_node) {
            add_node_to_index(explanation_node.self, 'explanations', 'value', explanation_value);
            return create_relationship(tag_node.self, explanation_node.self, function(err, data) {
              return console.log(data);
            });
          });
        }
      });
    }
    return res.send(explanation_value);
  });
  app.listen(port);
  console.log("listening on port " + (app.address().port) + " in " + app.settings.env + " mode");
}).call(this);
