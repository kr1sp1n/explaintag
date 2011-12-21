express = require "express"
app = module.exports = express.createServer()
port = process.env.PORT or 3000
neo = require "neo4j"
neodb = process.env.NEO4J_URL or "http://localhost:7474"

app.configure ->
  app.set "views", __dirname + "/views"
  app.set "view engine", "jade"
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use express.static(__dirname + "/public")

app.configure "development", ->
  app.use express.errorHandler(
    dumpExceptions: true
    showStack: true
  )

app.configure "production", ->
  app.use express.errorHandler()

app.get "/", (req, res) ->
  res.render "index",
    title: "Express"

app.post "/hashtags/", (req, res) ->
  console.log("hashtag")
  db = new neo.GraphDatabase(neodb)
  ht =
    value: req.body.value
    type: "hashtag"

  db_ht = db.createNode ht
  console.log("created #{console.dir(ht)}")
  db_ht.index "hashtags", "value", ht.value

app.listen port
console.log "listening on port #{app.address().port} in #{app.settings.env} mode"
