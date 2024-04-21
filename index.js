const express = require('express');
const cors = require('cors');
const PORT = 5000;
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
    origin:"*"
}))

const { MongoClient } = require('mongodb');
const url = process.env.DATABASE_URL;

app.get("/movies", async (req, res) => {
  try {
      const request = req.body;
      const connection = await MongoClient.connect(url);
      const db = connection.db("imdb");
      const movies = await db.collection("films").find({}).toArray();
      if (movies.length>0){
          res.json(movies);
      }
      else{
          res.send("no movies");
      }
      await connection.close();
  }
  catch (err) {
      res.send(err);
  }
});

app.post("/add/movie", async (req, res) => {
    try {
      const movieData = req.body;
      console.log('Received movie data:', movieData);
      const connection = await MongoClient.connect(url);
      const db = connection.db("imdb");
      const result = await db.collection("films").insertOne(movieData);
      if (result) {
        res.status(201).send("Movie added successfully");
      } else {
        res.status(500).send("Failed to add movie");
      }
      await connection.close();
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to add movie");
    }
  });
  
  app.get('/specific/movie/:id', async (req, res) => {
    try{
      const index = parseInt(req.params.id);
      const connection = await MongoClient.connect(url);
      const db = connection.db("imdb");
      const movies = await db.collection("films").find({}).toArray();
      if (index >= 0 && index < movies.length) {
      const movie = movies[index];
      res.json(movie);
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
    await connection.close();
    }
    catch(err){
      res.send(err);
    }
  });

  app.put('/update/movie/:id', async (req, res) => {
    try {
      const index = parseInt(req.params.id);
      const newData = req.body;
      console.log(newData);
  
      const connection = await MongoClient.connect(url);
      const db = connection.db("imdb");
      const collection = db.collection("films");
  
      const movies = await collection.find({}).toArray();
  
      if (index < 0 || index >= movies.length) {
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      const updatedMovie = await collection.findOneAndUpdate(
        { id: movies[index].id },
        { $set: newData },
        { returnOriginal: false }
      );
  
      res.json(updatedMovie.value);
    } catch (err) {
      console.error('Error updating movie:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
