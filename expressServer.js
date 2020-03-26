const express = require('express');
const app = express();
const fs = require('fs');
const pug = require("pug");
const path = require("path");

const port = 3000;

const compiledFunction = pug.compileFile('data_displayer.pug');

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

app.use(express.static(path.join(__dirname, 'img')));


app.listen(3000, function() {
    console.log(`Your server is running on port ${port}`)
})