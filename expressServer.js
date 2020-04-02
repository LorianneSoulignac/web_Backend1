const express = require('express');
const app = express();
const fs = require('fs');
const pug = require("pug");
const path = require("path");


const port = 3000;

const compiledFunction = pug.compileFile('data_displayer.pug');

app.use(express.json());


app.use(express.static(path.join(__dirname, 'img')));

app.get('/', (req, res) => {

    let dataToTemplate = [];
    let receiveData = [];
    let tmpData = [];

    fs.readFile('data.csv', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        receiveData.push(data.toString());
        console.log(receiveData[0]);
        tmpData = receiveData[0].split('\r\n');
        for (let i = 0; i < tmpData.length; i++) {
            dataToTemplate.push(tmpData[i].split(';'));
            dataToTemplate[i].pop();
        }

        const generatedTemplate = compiledFunction({
            data: dataToTemplate,
        });
        res.send(generatedTemplate)

    })
});

app.get('/cities', (req, res) => {

    let dataToTemplate = [];
    let receiveData = [];
    let tmpData = [];

    fs.readFile('cities.json', 'utf8', (err, data) => {
        if (err) {
            app.use(function(req, res, next) {
                res.status(404).send("Sorry can't find that!")
            });

        } else {
            datas = JSON.parse(data);

            res.send(datas);
        }
    })
});

app.post('/city', (req, res) => {

    let dataToTemplate = [];
    let receiveData = [];
    let tmpData = [];
    console.log(req);
    fs.readFile('cities.json', 'utf8', (err, data) => {
        if (err) {
            let donnees = JSON.parse('{"cities": []}');
            fs.writeFile('cities.json', donnees, function(erreur) {
                if (erreur) {
                    res.status(404).send("Sorry there is an error");
                }
            });

        } else {
            let datas = JSON.parse(data);
            let isCity = datas.cities;
            console.log(req.body);
            let newCity = { "id": isCity.length.toString(), "name": req.body.name };
            let isCityExist = false;
            for (let i = 0; i < isCity.length; i++) {
                if (newCity.name.toUpperCase() === isCity[i].name.toUpperCase()) {
                    isCityExist = true;
                    break;
                }
            }
            if (!isCityExist) {
                let newDonnees = datas.cities.push(newCity);
                fs.writeFile('cities.json', JSON.stringify(newDonnees), function(erreur) {
                    if (erreur) {
                        res.status(404).send("Sorry there is an error");
                    }
                });
            } else {
                res.status(500).send("Sorry this city already exist");
            }
            res.status(200).send(datas);
        }
    })
});




app.listen(3000, function() {
    console.log(`Your server is running on port ${port}`)
})