//Intialize Express 
const express=require('express');
const app = express();
//Intialize cors for cross origin resource sharing
const cors=require('cors');
app.use(cors());
//Database connetcion
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const { query } = require('express');
mongoose.connect('mongodb://localhost:27017/SearchEngineDB', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Database Connected")
});

const searchedData = require('./models/Search');
app.get("/search", async (req, res) => {
  try {
    if(req.query.searchedText){
        let results;
        results= await db.collection("SearchData").find({ $text: {$search: req.query.searchedText}});
        console.log(results)
        res.send(results);
    }
    else{
      res.send([])
    }
  } catch (error) {
    console.log(error)
    res.send(error)
  }      
})

app.get('/', async (req, res)=>
{
    const result = await db.collection("SearchData").findOne({id:1})
    res.json(result)
})

app.listen(8080,()=>{
    console.log("Port 8080 : Activated as Server");
})