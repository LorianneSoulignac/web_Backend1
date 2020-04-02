const fs = require('fs')
const http = require("http");
const pug = require("pug");

const compiledFunction = pug.compileFile('data_displayer.pug');
const port = 3000;

const server = http.createServer((req, res) => {
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
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(generatedTemplate)

    })


});

server.listen(port, () => {
    console.log(`Serveur running at port ${port}`)
});