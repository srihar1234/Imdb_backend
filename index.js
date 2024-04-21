
const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;


mongoose.connect('mongodb://localhost:27017/imdb', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;


const movieSchema = new mongoose.Schema({
  title: String,
  release_date: String,
  vote_average: Number,
  overview: String,
  backdrop_path: String
});


const Movie = mongoose.model('Movie', movieSchema);

app.get('/api/popular-movies', async (req, res) => {
  try {
    // Fetch data from TMDB API
    const response = await axios.get('https://api.themoviedb.org/3/movie/popular?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US');
    const data = response.data;

    // Save fetched data to database
    await Movie.insertMany(data.results);

    // Return data to the client
    res.json(data.results);
  } catch (error) {
    console.error('Error fetching and saving popular movies:', error);
    res.status(500).json({ error: 'Error fetching and saving popular movies' });
  }
});

// app.get('/movies/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//       const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`);
//       const data = response.data;
//       res.json(data);
//   } catch (error) {
//       console.error('Error fetching movie data:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
