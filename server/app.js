const express = require('express');
const app = express();
const dogRouter = require("./routes/dogs")
require("express-async-errors")
require("dotenv").config()

app.use("/static", express.static("assets"))
app.use(express.json())
app.use("/dogs", dogRouter)

const logger = (req, res, next) => {
  console.log(req.method)
  console.log(req.url)

  res.on("finish", () => {
    console.log(res.statusCode)
  })

  next()
}


app.use(logger)

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

const error = (req, res, next) => {
  const error = new Error ("Something Went Wrong")
  console.log(error)
  if (process.env.NODE_ENV === "development"){
    res.json({
      message: "Something Went Wrong",
      status : error.status || 500,
      stack: error.stack
    })
  }else{
    res.json({
      message: "Something Went Wrong",
      status: error.status || 500
    })
  }
}

app.use(error)



const port = process.env.PORT;
console.log(process.env.NODE_ENV === "development")
app.listen(port, () => console.log('Server is listening on port', port));