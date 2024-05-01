const express = require("express")
const moviesData = require("./Movie Data/data.json")
const axios = require("axios")
const cors = require("cors")
require("dotenv").config();

const server = express();
const PORT = 8081;

function Movies(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}
function tvShows(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}
server.use(cors())

server.get("/", homePageHandler)
server.get("/favorite", favoritePageHandler)
server.get("/search", searchHandler)
server.get("/trendingMovies", trendingMoviesHandler)
server.get("/popularMovies", popularMoviesHandler)
server.get("/trendingTVs", trendingTVsHandler)
server.use(serverErrorHandler)
server.use(clientErrorHnadler)

function homePageHandler(req, res){
    let newMovies = new Movies(1,
        moviesData.title,
        moviesData.release_date,
        moviesData.poster_path,
        moviesData.overview
    )
    res.json(newMovies)
}

function favoritePageHandler(req, res){
    res.send("Welcome to Favorite Page")
}

function searchHandler(req, res) {
    const search = "spider"
    let apiKey = process.env.apiKey;
    let url = `https://api.themoviedb.org/3/search/movie?query=${search}&api_key=${apiKey}`
    axios.get(url)
        .then(axiosResult => {
            let mapResult = axiosResult.data.results.map(movie => {
                newMovie = new Movies(movie.id, movie.original_title, movie.release_date, movie.backdrop_path, movie.overview)
                return newMovie
            })
            res.send(mapResult);
        })
}

function trendingMoviesHandler(req, res) {
    let apiKey = process.env.apiKey;
    let url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`

    axios.get(url)
        .then(axiosResult => {
            let mapResult = axiosResult.data.results.map(movie => {
                newMovie = new Movies(movie.id, movie.original_title, movie.release_date, movie.backdrop_path, movie.overview)
                return newMovie
            })
            res.send(mapResult);
        })
}

function popularMoviesHandler(req, res) {
    let apiKey = process.env.apiKey;
    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`

    axios.get(url)
        .then(axiosResult => {
            let mapResult = axiosResult.data.results.map(movie => {
                newMovie = new Movies(movie.id, movie.original_title, movie.release_date, movie.backdrop_path, movie.overview)
                return newMovie
            })
            res.send(mapResult);
        })
}

function trendingTVsHandler(req, res) {
    let apiKey = process.env.apiKey;
    let url = `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}`

    axios.get(url)
        .then(axiosResult => {
            let mapResult = axiosResult.data.results.map(show => {
                newtv = new tvShows(show.id, show.original_name, show.first_air_date, show.backdrop_path, show.overview)
                return newtv
            })
            res.send(mapResult);
        })
}

function serverErrorHandler(error, req, res, next) {
    res.status(500).json({
        Status: 500,
        ResponseText: "Internal Server Error 500"
    })
}

function clientErrorHnadler(error, req, res, next) {
    res.status(404).json({
        Status: 404,
        ResponseText: "Page Not found 404"
    })
}

server.listen(PORT, () => {
    console.log("You're listening to PORT: ", PORT);
})