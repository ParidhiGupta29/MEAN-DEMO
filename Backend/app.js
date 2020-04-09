const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users')

const app = express();

mongoose.connect('mongodb://localhost/node-angular')
  .then(() => {
    console.log("connected to DATABASE");
  })
  .catch(() => {
    console.log("connection failed")
  })

// mongoose.connection
//   .once('open',()=>{
//     console.log('Connected')
//   })
//   .on('error',(err)=>{
//     console.log("Erroe",err);
//   })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", express.static(path.join('Backend/images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-type,Accept,Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,PUT,OPTIONS")
  next();
});

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);


module.exports = app;
