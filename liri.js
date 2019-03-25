require('dotenv').config();

var keys = require('./keys.js');

var axios = require('axios');
var moment = require('moment');
var Spotify = require('node-spotify-api');
var fs = require('fs');

var action = process.argv[2];
var nameInput = process.argv.slice(3).join(' ');

function concertThis() {
    var concertThis = "https://rest.bandsintown.com/artists/" + nameInput + "/events?app_id=codingbootcamp&date=all";
    axios.get(concertThis).then(response => {
        var info = response.data;
        for (var i=0; i<5; i++) {
        console.log("-------- Concert #" + [i+1] + ": --------");
        console.log("Name of the venue: " + info[i].venue.name);
        console.log("Location: " + info[i].venue.city + ", " + info[i].venue.country);
        var date = moment(info[i].datetime).format('MMMM Do');
        console.log("Date: " + date);
        logData();
        }
    }).catch(err => console.log(err))
};

function spotifyThisSong() {
    var spotify = new Spotify(keys.spotify);
    spotify.search({type: 'track', query: nameInput, limit: '1'}, function(err, response) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        console.log("--- Artists: " + response.tracks.items[0].artists[0].name); 
        console.log("--- Name of the Song: " + response.tracks.items[0].name);
        console.log("--- Album: " + response.tracks.items[0].album.name);
        console.log("--- Preview URL: " + response.tracks.items[0].preview_url);
        logData();
    });
};

function movieThis() {
    axios.get("http://www.omdbapi.com/?t=" + nameInput + "&y=&plot=short&apikey=trilogy").then(response => {
        console.log("--- Movie title: " + response.data.Title);
        console.log("--- Year of release: " + response.data.Year);
        console.log("--- IMDB Rating: " + response.data.imdbRating);
        console.log("--- Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
        console.log("--- Country of production: " + response.data.Country);
        console.log("--- Language: " + response.data.Language);
        console.log("--- Actors: " + response.data.Actors);
        console.log("--- Plot: " + response.data.Plot);
        logData();
    });
}
function logData() {
    fs.appendFile('log.txt', "\n" + action + " " + nameInput, (error, data) => {
    if (error) {
        return console.log(error)
    }
    console.log("Your search for logged in log.txt")
    })
}

if (action === "concert-this") {
    concertThis();
}  else if (action === "spotify-this-song" && nameInput === '') {
    var spotify = new Spotify(keys.spotify);
    spotify.search({type: 'track', query: 'The Sign', limit: '10'}, function(err, response) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        console.log("--- Artists: " + response.tracks.items[9].artists[0].name); 
        console.log("--- Name of the Song: " + response.tracks.items[9].name);
        console.log("--- Album: " + response.tracks.items[9].album.name);
        console.log("--- Preview URL: " + response.tracks.items[9].preview_url);
        logData();
    });

} else if (action === "spotify-this-song") {
    spotifyThisSong();
}  else if (action === "movie-this" && nameInput === '') {
    console.log("---- YOU SKIPPED THE NAME OF THE MOVIE, SO I PICKED ONE FOR YOU! ----")
    nameInput = 'Mr Nobody';
    movieThis();
} else if (action === "movie-this") {
    movieThis();
    logData();
} else if (action === "do-what-it-says") {
    fs.readFile('./random.txt', 'utf8', (err, data) => {
        if (err) {
         return console.log(err);
        }
        var randomPick = Math.floor((Math.random() * 26) + 1);
        var splitTask = data.split(';');
        var randomSearch = splitTask[randomPick];
        
        var splitData = randomSearch.split(',');
        action = splitData[0];
        nameInput = splitData[1];
        console.log("---------- THE RANDOM PICK IS: " + action.toUpperCase() + " " + nameInput.toUpperCase() + " ----------");
        if (action === "concert-this") {
            concertThis();
        } else if (action === "spotify-this-song") {
            spotifyThisSong();
        } else if (action === "movie-this"){
            movieThis();
        }
    }) 
} else {
    console.log("Please enter a valid action: concert-this / spotify-this-song / movie-this / do-what-it-says");
}
