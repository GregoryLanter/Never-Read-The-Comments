//console.log("start");
var express = require("express");
//var mongojs = require("mongojs");
var cheerio = require("cheerio");
var axios = require("axios");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var db = require("./models");
var path = require("path")

// Listen on port 3000
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static(path.join(__dirname, "/public")));
// Hook mongojs configuration to the db variable
// Connect to the Mongo DB

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/hockeyNews";
console.log(MONGODB_URI);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");


// Main route
app.get("/", function (req, res) {
  res.render("scraped", "");
});

// Retrieve data from the db
app.get("/showSaved", function (req, res) {
  // Find all results from the scrapedData collection in the db
  db.Article.find({}, function (error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      let articleObj = {
        articles: found
      }
      res.render("saved", articleObj);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function (req, res) {
  var dataObj;
  // Make a request via axios to grab the HTML body from the site of your choice
  axios.get("https://thehockeynews.com/").then(function (response) {
    var $ = cheerio.load(response.data);
    var results = [];
    const articleArr = [];
    let count =0;
    $(".posts-grid--article").each(function (i, element) {
      let title = "";
      let blurb = "";
      let href = "";
      count +=1;
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
        url: href,
        count: count
      }
      articleArr.push(articleObj);

    });
    dataObj = {
      articles: articleArr,
      count: count
    }
    res.render("scraped", dataObj);
  });
});
app.post("/api/save/", function (req, res) {
  console.log("begin");
  console.log(req.body);
  console.log("end");

  var article = new db.Article(req.body);

  article.save(function (err, art) {
    if (err) return console.error(err);
    console.log(art.title + " saved to article collection.");
    res.json(art);
  });

  app.post("/api/saveNote/:id", function (req, res) {
    console.log("begin");
    console.log(req.body);
    console.log("end");

    //var note = new db.Note(req.body);

    db.Note.create(req.body)
      .then(function (dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  /*    // a document instance
      var book1 = new Book({ name: 'Introduction to Mongoose', price: 10, quantity: 25 });
 
      // save model to database
      book1.save(function (err, book) {
        if (err) return console.error(err);
        console.log(book.name + " saved to bookstore collection.");
      });

  db.Article.insertOne(req.body, function(err, res){
    if (err) throw err;
    console.log("1 document inserted");
    res.json(dbDogs);
  }); */
});
app.delete("/api/remove/", function (req, res) {
  console.log("begin");
  console.log(req.body);
  console.log("end");

  var article = new db.Article(req.body);

  article.save(function (err, art) {
    if (err) return console.error(err);
    console.log(art.title + " saved to bookstore collection.");
    res.json(art);
  });
});
app.listen(PORT, function () {
  console.log("Anodepp running on port 3000!");
});
app.get("/getNotes/:id", function (req, res) {
  db.Article.findOne({_id: req.params.id})
  .populate("Note.notes")
  .then(function(dbArticle){
    console.log(dbArticle);
    res.json(dbArticle);
  })

  .catch(function(err){
    res.json(err)
  })
});
