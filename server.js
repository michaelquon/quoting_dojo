//Installed Express
const express = require('express');
const app = express();
//Installed ejs
const ejsLint = require('ejs-lint');
app.set('view engine', 'ejs');
//Installed Mongoose
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/quoting_dojo');
//Installed BodyParts
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
//Installed Moment
const moment = require('moment')
//Set my Paths
const path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
//Creating our DB Model.
var QuoteSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 1, maxlength: 100},
    quote: {type: String, required: true, minlength: 1}}, 
    {timestamps: true});

mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote');

app.get('/', function(req,res){
    res.render('index');
});
app.post('/quotes', function(req,res){
    var newQuote = new Quote(req.body)
    newQuote.save(function(err){
        if(err){
            console.log(newQuote.errors)
            res.render('index', {errors: newQuote.errors})
        }
        else{
            console.log('quote was added successfully')
            res.redirect('/quotes')
        }
    })
});

app.get('/quotes', function(req, res){
    Quote.find({}, function(err, quotes){
        if(err){
            res.render('quote', {errors: Quote.errors, moment:moment})
        }
        else{
            var allQuotes = []
            for(let i = 0; i < quotes.length; i++){
                allQuotes.push(quotes[i]);
            }
            // console.log(allQuotes);
            res.render('quotes', {quotes: allQuotes, moment: moment});
        }
    });
});
app.listen(8000, function () {
    console.log("listening on port 8000");
});


