const express = require("express")
const moviesData = require("./Movie Data/data.json")

const server = express();
const PORT = 8081;

function Movies(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

server.get("/", homePageHandler)
server.get("/favorite", favoritePageHandler)

server.use(serverErrorHandler)
server.use(clientErrorHnadler)

function homePageHandler(req, res){
    let newMovies = new Movies(
        moviesData.title,
        moviesData.poster_path,
        moviesData.overview
    )
    res.json(newMovies)
}

function favoritePageHandler(req, res){
    res.send("Welcome to Favorite Page")
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