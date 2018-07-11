require("dotenv").config();

var keys = require("LIRI-Node-App/keys.js");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var fileSys = require("fs");
var request = require("request");
var spotifyKeys = new Spotify(keys.spotify);
var twitterKeys = new Twitter(keys.twitter);


var myTweets = function() {
    var params = {screen_name: "KatT40228721"};
    twitterKeys.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++){
                console.log("Kat tweeted: " + tweets[i].text + "\nTweet created at: " +
            tweets[i].created_at);
            }
        }
    });
}

// Function for retrieving Artist Names from Spotify
var getArtists = function(artist) {
    return artist.name;
}

// Function for getting song info
var getSpotify = function(songTitle) {
    if (songTitle == undefined) {
        spotifyKeys.search({ type: 'track', query: 'The Sign' }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            } else {
                var songs = data.tracks.items;
                console.log('----------------------------------------');
                console.log('Artist(s): ' + songs[5].artists.map(getArtists));
                console.log('Song Name: ' + '"' + songs[5].name + '"');
                console.log('Preview: ' + songs[5].preview_url);
                console.log('Album: ' + songs[5].album.name);
                console.log('----------------------------------------');
            }
        });
    } else {
        spotifyKeys.search({ type: 'track', query: songTitle }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
            var songs = data.tracks.items;
            for (var i = 0; i < songs.length; i++) {
                console.log(i+1);
                console.log('Artist(s): ' + songs[i].artists.map(getArtists));
                console.log('Song Name: ' + '"' + songs[i].name + '"');
                console.log('Preview: ' + songs[i].preview_url);
                console.log('Album: ' + songs[i].album.name);
                console.log('----------------------------------------');
            }
          });
    }

}

// Function for getting movie info
var getMovie = function(movieTitle) {
    request('http://www.omdbapi.com/?apikey=trilogy&t=' + movieTitle + '&tomatoes=true&r=json', function (error, response, body) {
        if(!error && response.statusCode == 200) {
            var jsonData = JSON.parse(body);

            console.log('Title: ' + jsonData.Title);
            console.log('Year Released: ' + jsonData.Year);
            console.log('IMDb Rating: ' + jsonData.imdbRating);
            console.log('Rotten Tomatoes Rating: ' + jsonData.Ratings[1].Value);
            console.log('Country: ' + jsonData.Country);
            console.log('Language: '+ jsonData.Language);
            console.log('Plot Synopsis: ' + jsonData.Plot);
            console.log('Cast: ' + jsonData.Actors);
        }
      });
}

var doWhat = function() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
        if (err) throw err;
        var randomTxtArr = data.split(',');

        if (randomTxtArr.length == 2) {
            commandLiri(randomTxtArr[0], randomTxtArr[1]);
        } else if (dataArr.length == 1) {
            commandLiri(randomTxtArr[0]);
        }
      });
    
}

// Function containing switch statements to determine which command to run
var commandLiri = function(caseData, functionData) {
    switch(caseData) {
        case 'my-tweets':
            getTweets();
            break;
        case 'spotify-this-song':
                getSpotify(functionData);
            break;
        case 'movie-this':
            if (functionData == undefined) {
                getMovie("Mr. Nobody");
            } else {
            getMovie(functionData);
            }
            break;
        case 'do-what-it-says':
            doWhat();
            break;
        default:
        console.log("I'm sorry, I don't recognize that command");
    }
}

var runLiri = function(argOne, argTwo) {
    commandLiri(argOne, argTwo);
};

runLiri(process.argv[2], process.argv[3]);