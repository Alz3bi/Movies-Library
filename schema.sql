CREATE TABLE movies(
    movie_id serial primary key,
    movie_title varchar(255),
    movie_release_date varchar(255),
    movie_poster_path varchar(255),
    movie_overview varchar(255),
    movie_comments varchar(255)
);