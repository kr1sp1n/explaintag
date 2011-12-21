express = require "express"
app = module.exports = express.createServer()
port = process.env.PORT or 3000

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

app.listen port
console.log "listening on port #{app.address().port} in #{app.settings.env} mode"
