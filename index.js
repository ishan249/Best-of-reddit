const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const express = require('express');
const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs");
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.listen(4008, function() {
  console.log("server is listening");
});

app.post("/showContent",function(req, res) {
  let subredditName = req.body.initialInput;
  console.log(subredditName);
  request(`https://www.reddit.com/${subredditName}/hot/`, {timeout: 20000},function(err, resp, body) {

    console.log(resp.statusCode);
    if (!err && resp.statusCode === 200) {
      var $ = cheerio.load(body);

      // Defination of Arrays storing values

      let links = new Array();
      let headings = new Array();
      let upvotes = new Array();
      let comments = new Array();

      //Loop extracting heading of the post

      $('h3').each(function() {
        var post = $(this)[0].children[0].data;
        headings.push(post);
      });

      // Loop extracting links to the post
      $('.SQnoC3ObvgnGjWt90zD9Z').each(function() {
        var post = $(this).attr('href');
        var link = `https://www.reddit.com${post}`;
        links.push(link);
      });

      // Loop extracting the upvotes

      $('._3a2ZHWaih05DgAOtvu6cIo').each(function() {
        var post1 = $(this)[0].children[0].data;
        upvotes.push(post1);
      });

      // Loop extracting comments
      $('.FHCV02u6Cp2zYL0fhQPsO').each(function() {
        var post1 = $(this)[0].children[0].data;
        comments.push(post1);
      });

      
      // rendering array values to showContent.ejs file

      res.render('showContent', {
        'headingsData': headings,
        'linksData': links,
        'upvotesData': upvotes,
        'commentsData': comments
      });
    }
  });
});

// Code written by ISHAN PATEL (ishan249)
