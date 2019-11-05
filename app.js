var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var sanitizer = require("express-sanitizer");


mongoose.connect("mongodb://localhost/rest");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitizer());
app.use(methodOverride("_method"));


var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR !");
        }
        else{
            res.render("index.ejs", {blogs: blogs});
        }
    });
});

app.get("/blogs/new", function(req, res){
    res.render("new.ejs");
});

app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new.ejs");
        } else{
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } 
        else{
            res.render("show.ejs", {blog: foundBlog});
        }
        
    });
});

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit.ejs", {blog: foundBlog});
        }
    });
    
});

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
            if(err){
                res.redirect("/blogs");
            } else{
                res.redirect("/blogs/" + req.params.id);
            }
    });
});

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
        res.redirect("/blogs");
      } else{
          res.redirect("/blogs");
      }
    });
});

app.listen(3300, function(req, res){
    console.log("Server has Started .. !!");
});