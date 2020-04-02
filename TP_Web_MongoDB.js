const express = require('express');
const app = express();
const mongoose = require("mongoose");
const pug = require("pug");
const path = require("path");
const fs = require('fs');


const port = 3001;

const compiledFunction = pug.compileFile('data_displayer.pug');

mongoose.connect("mongodb://localhost/TP_Web", { useNewUrlParser: true });
const db = mongoose.connection;

const citiesSchema = new mongoose.Schema({
    name: String
});

const Cities = mongoose.model('cities', citiesSchema);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'img')));

app.get('/cities', (req, res) => {
    Cities.find(function(err, cities) {
        if (err) return console.error(err);
        const generatedTemplate = compiledFunction({
            towns: cities
        });
        res.send(generatedTemplate);
    })
});

app.put("/city/:id", (req, res) => {
    Cities.findByIdAndUpdate(req.params.id, { name: req.body.name }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.status(200).send(result);
        }
    })
});

app.delete("/city/:id", (req, res) => {
    Cities.findByIdAndDelete(req.params.id, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.status(200).send(result);
        }
    })
});

app.post('/city', (req, res) => {
    const newCity = new Cities({ name: req.body.name });
    newCity.save(function(err) {
        if (err) return console.error(err);
        res.status(200).send("<h1>The city is added</h1><a href='/cities'>Retour à la liste</a>");
    });

})



app.listen(3001, function() {
    console.log(`Your server is running on port ${port}`)
})