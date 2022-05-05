const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema ({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get(function(req, res){
        Article.find({}, function(err, foundArticles){  // is "{}" needed?
            if (!err){
                res.send(foundArticles);
            } else{
                res.send(err);
            }
        });
    })
    .post(function(req, res){
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save(function(err){
            if (!err){
                console.log("Success add");
                res.send("Successfully added a new article.");
            } else{
                res.send(err);
            }
        });
     
    })
    .delete(function(req, res){
        Article.deleteMany(function(err){
            if (!err){
                res.send("Successfully deleted all articles");
            } else{
                res.send(err);
            }
        });
    });

/* Requests Targetting a Specific Article */

app.route("/articles/:articleTitle")
    .get(function(req, res){
        Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
            if (foundArticle){
                res.send(foundArticle);
            } else{
                res.send("No articles matching that title was found.");
            }
        });
    })
    .put(function(req, res){
        Article.replaceOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            function(err){
                if (!err){
                    res.send("Successfully updated article.");
                } else{
                    res.send(err);
                }
        });
    })
    .patch(function(req, res){
        Article.updateOne(
            {title: req.params.articleTitle},
            req.body,
            function(err){
                if (!err){
                    res.send("Successfully patch updated article.");
                } else{
                    res.send(err);
                }
        });
    })
    .delete(function(req, res){
        Article.deleteOne({title: req.params.articleTitle}, function(err){
            if (!err){
                res.send("Successfully deleted article.");
            } else{
                res.send(err);
            }
        });
    });

app.listen(3000, function(){
    console.log("Server started at port 3000");
});