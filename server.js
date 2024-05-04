const express = require("express")
const moviesData = require("./Movie Data/data.json")
const axios = require("axios")
const cors = require("cors")
const pg = require("pg")
require("dotenv").config();

const server = express();
const PORT = 3000;
const client =new pg.Client("postgressql://localhost:5432/movieslibrary")

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
server.use(express.json())

server.get("/", homePageHandler)
server.get("/favorite", favoritePageHandler)
server.get("/search", searchHandler)
server.get("/trendingMovies", trendingMoviesHandler)
server.get("/popularMovies", popularMoviesHandler)
server.get("/trendingTVs", trendingTVsHandler)
server.post("/addMovie", addMovieHandler)
server.get("/getMovies",getMoviesHandler)
server.get("*", clientErrorHnadler)
server.use(serverErrorHandler)

function homePageHandler(req, res){
    try{
        let newMovies = new Movies(1,
            moviesData.title,
            moviesData.release_date,
            moviesData.poster_path,
            moviesData.overview
        )
        res.json(newMovies)
    }
    catch(error){
        serverErrorHandler(error, req, res)
    }
}

function favoritePageHandler(req, res){
    try{
        res.send("Welcome to Favorite Page")
    }
    catch(error){
        serverErrorHandler(error, req, res)
    }
    
}

function searchHandler(req, res) {
    try{
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
            .catch((error) => {
                serverErrorHandler(error, req, res)
            })
    }
    catch(error){
        serverErrorHandler(error, req, res)
    }
}

function trendingMoviesHandler(req, res) {
    try{
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
            .catch((error) => {
                serverErrorHandler(error, req, res)
            })
    }
    catch(error){
        serverErrorHandler(error, req, res)
    }
}

function popularMoviesHandler(req, res) {
    try{
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
            .catch((error) => {
                serverErrorHandler(error, req, res)
            })
    }
    catch(error){
        serverErrorHandler(error, req, res)
    }
}

function trendingTVsHandler(req, res) {
    try{
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
            .catch((error) => {
                serverErrorHandler(error, req, res)
            })
    }
    catch(error){
        serverErrorHandler(error, req, res)
    }
}

function addMovieHandler(req, res) {
    const movie = req.body 
    const sql = "INSERT INTO movies(movie_title, movie_release_date, movie_poster_path, movie_overview) VALUES($1, $2, $3, $4) RETURNING *;"
    const values = [movie.title, movie.release_date, movie.poster_path, movie.overview]
    client.query(sql, values)
        .then((data) => {
            res.send("your data was added")
        })
        .catch((error) =>{
            serverErrorHandler(error, req, res)
        })
}

function getMoviesHandler(req, res) {
    try{
        const sql = "SELECT * FROM movies;"
        client.query(sql)
        .then((data) => {
            res.send(data.rows)
        })
        .catch((error) => {
            serverErrorHandler(error, req, res)
        })
    }
    catch(error){
        serverErrorHandler(error, req, res)
    }
}

function serverErrorHandler(error, req, res) {
    res.status(500).json({
        Status: 500,
        ResponseText: "Internal Server Error 500",
        Error: error
    })
}

function clientErrorHnadler(req, res) {
    res.status(404).json({
        Status: 404,
        ResponseText: "Page Not found 404"
    })
}

client.connect()
.then(() => {
    server.listen(PORT, () => {
        console.log("You're listening to PORT: ", PORT);
    })
})

