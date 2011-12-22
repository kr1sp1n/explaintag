express = require "express"
app = module.exports = express.createServer()
port = process.env.PORT or 3000
neo4j_url = process.env.NEO4J_URL or "http://localhost:7474"
rest = require "restler"
twitter = require 'twitter'
twit = new twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
})

#twit.get '/statuses/mentions.json', {include_entities:true, since_id:'149728963965632500'}, (data) ->
#  console.log(data)

#twit.verifyCredentials (data)->
#  console.log(data)

twit.stream 'user', {track:'explaintag'}, (stream) ->
  stream.on 'data', (data) ->
    console.log(data)
    if data.user? && data.user.screen_name!="ExplainTag"
      twit.updateStatus '@' + data.user.screen_name + " morjen!", (data) ->
        console.log(data)

app.configure ->
  app.set "views", __dirname + "/views"
  app.set "view engine", "jade"
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use express.static(__dirname + "/public")
  app.set "view options", {pretty: true}

app.configure "development", ->
  app.use express.errorHandler(
    dumpExceptions: true
    showStack: true
  )

app.configure "production", ->
  app.use express.errorHandler()
 
app.get "/", (req, res) ->
  res.render "index",
    title: "ExplainTag"

print = (err, res) ->
  #console.log(err || (res && res.self) || res)
  console.log(res)

create_relationship = (from, to, callback) ->
  rest.post(from+'/relationships', {
    data: {"to" : to, "type" : "EXPLAINED_BY"}
  }).on 'complete', (data, response) ->
    callback(null, data)

create_node = (data, callback) ->
  rest.post(neo4j_url+'/db/data/node', {
    data: data
  }).on 'complete', (data, response) ->
    callback(null, data)

delete_node = (id) ->
  rest.del(neo4j_url+'/db/data/node/'+id).on "complete", (data) ->
    #console.log data.exception

delete_relationship = (id) ->
  rest.del(neo4j_url+'/db/data/relationship/'+id).on "complete", (data) ->
    #console.log data.exception

add_node_to_index = (node_url, index_name, key, value) ->
  url = neo4j_url+'/db/data/index/node/'+index_name

  console.log url

  d = { "uri" : node_url, "key" : key, "value" : value }
  rest.post(url, {
    data: JSON.stringify(d),
    headers: {
      'Content-Type': 'application/json'
    }
  }).on 'complete', (data, response) ->
    console.log(data)

app.delete "/db", (req, res) ->
  delete_relationship id for id in [0..200]
  delete_node id for id in [0..200]
  res.send "yo"

app.post "/tags", (req, res) ->
  tag_value = req.param('tag')
  explanation_value = req.param('explanation')

  if tag_value?
    tag_data =
      type: 'tag'
      value: tag_value

    create_node tag_data, (err, tag_node) ->
      add_node_to_index(tag_node.self, 'tags', 'value', tag_value)
      if explanation_value?
        explanation_data =
          type: 'explanation'
          value: explanation_value
        create_node explanation_data, (err, explanation_node) ->
          add_node_to_index(explanation_node.self, 'explanations', 'value', explanation_value)
          create_relationship tag_node.self, explanation_node.self, (err, data) ->
            console.log(data)



    #node = db.createNode node_data
    #node.save()
    #node.index 'hashtags', 'value', value
    #indexed_node = db.getIndexedNode 'hashtags', 'value', value

  res.send explanation_value

app.listen port
console.log "listening on port #{app.address().port} in #{app.settings.env} mode"
