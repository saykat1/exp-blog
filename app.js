require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const config = require("config")
const chalk = require("chalk")

// IMPORT ROUTER AND MIDDLEWARE
const setRoute = require("./routers/router")
const setMiddleware = require("./middlewares/middleware")

// CREATE EXPRESS APP
const app = express()

// DATABASE CONNECTION STRING
const connectionURI = `mongodb+srv://${config.get("db-username")}:${config.get(
  "db-password"
)}@cluster0.btkty.mongodb.net/${config.get(
  "db-username"
)}?retryWrites=true&w=majority`

// `mongodb+srv://testDB:1234@cluster0.btkty.mongodb.net/testDB?retryWrites=true&w=majority`

// SETUP DEFAULT VIEW ENGINE
app.set("view engine", "ejs")
app.set("views", "views")

// USING MIDDLEWARE FROM MIDDLEWARE DIRECTORY
setMiddleware(app)
// USING ROUTE FROM ROUTERS DIRECTORY
setRoute(app)

// 404 ERROR
// when don't match with any route then this middleware will fire
app.use((req, res, next) => {
  // res.render("pages/error/404.ejs", { flashMessage: {} }) // not professional way
  // create 404 error
  const error = new Error("404 page not found!")
  error.status = 404
  next(error)
})
app.use((error, req, res, next) => {
  if (error.status === 404) {
    return res.render("pages/error/404.ejs", {
      flashMessage: {},
    })
  }
  res.render("pages/error/500.ejs", {
    flashMessage: {},
  })
  console.log(chalk.red.inverse(error.message))
  console.log(error)
})

// LISTEN DEVELOPMENT SERVER
const PORT = process.env.PORT || 8080
mongoose
  .connect(connectionURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("Connection Success")
      console.log(`Server is running on port:${PORT}`)
    })
  })
  .catch((err) => {
    console.log("Connection Failed")
    return console.log("Error" + err)
  })