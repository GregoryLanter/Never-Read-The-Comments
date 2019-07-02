var express = require("express");
var mongojs = require("mongojs");
var cheerio = require("cheerio");
var axios = require("axios");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var db = require("./models");
// Listen on port 3000
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "hockeyNews";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/hockeyNews", { useNewUrlParser: true });

//var db = mongojs(databaseUrl, collections);
//db.on("error", function (error) {
//  console.log("Database Error:", error);
//});

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");


// Main route (simple Hello World Message)
app.get("/", function (req, res) {
  res.send("Hello world");
});

// Retrieve data from the db
app.get("/all", function (req, res) {
  // Find all results from the scrapedData collection in the db
  db.scrapedData.find({}, function (error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      let articleObj = {
        articles: found
      }
      console.log(articleObj);
      res.render("article", articleObj);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function (req, res) {
  var dataObj;
  // Make a request via axios to grab the HTML body from the site of your choice
  axios.get("https://thehockeynews.com/").then(function (response) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);

    // An empty array to save the data that we'll scrape
    var results = [];
    // Select each element in the HTML body from which you want information.
    // NOTE: Cheerio selectors function similarly to jQuery's selectors,
    // but be sure to visit the package's npm page to see how it works
    //<p class="o-Ingredients__a-Ingredient">1 egg</p>
    const articleArr = [];
    $(".posts-grid--article").each(function (i, element) {

      let title = "";
      let blurb = "";
      let href = "";
      for (let child = 0; child < element.children.length; child++) {
        if (element.children[child].name === "a") { //&& element.children[child].attribs.class === "posts-grid--article"){
          href = element.children[child].attribs.href;
        }

        if (element.children[child].name === "h3" && element.children[child].attribs.class === "posts-grid--title") {
          title = element.children[child].children[0].children[0].data;
        }
        if (element.children[child].name === "p" && (element.children[child].attribs.class === "homepage--post-lede homepage--post-lede_grid" || element.children[child].attribs.class === "homepage--post-lede homepage--post-lede_grid homepage--post-lede_special")) {
          blurb = element.children[child].children[0].data;
        }
      }
      let articleObj = {
        title: title,
        blurb: blurb,
        url: href
      }
      articleArr.push(articleObj);
      /*db.scrapedData.insert({
        title: title,
        blurb: blurb,
        url: href
      },
        function (err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
            console.log(inserted);
          }
        });*/
    });
    dataObj = {
      articles: articleArr
    }
    res.render("article", dataObj);
  });
});



app.listen(PORT, function () {
  console.log("App running on port 3000!");
});
