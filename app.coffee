express = require "express"
app = module.exports = express.createServer()
port = process.env.PORT or 3000
neo = require "neo4j"
neodb = process.env.NEO4J_URL or "http://localhost:7474"
db = new neo.GraphDatabase(neodb)

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

delete_node = (id) -> 
  x * x

app.delete "/db", (req, res) ->

  eat food for food in ['toast', 'cheese', 'wine']

  res.send "yo"

app.post "/hashtags", (req, res) ->
  value = req.param('value')
  definition = req.param('definition')

  if value?
    node_data =
      type: 'hashtag'
      value: value
      definition: definition

    node = db.createNode node_data
    node.save()
    node.index 'hashtags', 'value', value
    indexed_node = db.getIndexedNode 'hashtags', 'value', value

    console.log(indexed_node.toString())

  #
  #console.log("created #{console.dir(ht)}")
  #db_ht.index "hashtags", "value", ht.value
  #

  res.send definition

app.listen port
console.log "listening on port #{app.address().port} in #{app.settings.env} mode"
