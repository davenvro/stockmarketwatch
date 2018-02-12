var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var myAlphaVantageKey = "0RQ8JASXQO855L1L";
var getJSON = require("get-json");
var myStockSymbols = [];

app.use(express.static("public"));

app.get("/", function (request, response) {
    console.log("remote address: " + request.connection.remoteAddress.toString());
    response.sendFile(__dirname + "/home.html");
});

app.get("/style.css", function (request, response) {
    response.sendFile(__dirname + "/style.css");
});

app.get("/client.js", function (request, response) {
    response.sendFile(__dirname + "/client.js");
});

app.get("/game.js", function (request, response) {
    response.sendFile(__dirname + "/game.js");
});

app.get("/header.html", function (request, response) {
    response.sendFile(__dirname + "/header.html");
});

app.get("/stocklist.html", function (request, response) {
    var myCompanies = "<h1>Companies</h1>";
    myStockSymbols.map(function (objItem) {
        myCompanies += "<div id='" + objItem + "' class='boxUnit'>" +
            "<h2>" + objItem + " <a class='delLink'><i class='fas fa-trash-alt'></i></a></h2>" +
            "</div>"
    });
    response.end(myCompanies);
});

app.get("/stockgraph.html", function (request, response) {
    response.end("<h1>Stock Market</h1>");
});

app.get(/\/images\/.*$/, function (request, response) {
    imgFile = request.url.replace(/^.*\/images\//, "");
    response.sendFile(__dirname + "/images/" + imgFile);
});

io.on('connection', function (socket) {
    socket.on("chat message", function (msg) {
        console.log("received message: " + msg);
        io.local.emit("chat message", msg);
    });
});

app.get("/addstockcode", function (request, response) {
    var stockCode = request.query.stockcode;
    console.log("add: " + stockCode);
    if (myStockSymbols.indexOf(stockCode.toUpperCase()) >= 0) {
        response.send("Already in the list");
    } else {
        getJSON("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + stockCode +
            "&outputsize=full&apikey=" + myAlphaVantageKey, function (err, result) {
                if (err) {
                    response.send("");
                } else {
                    if (result["Error Message"]) {
                        response.send("");
                    } else {
                        myStockSymbols.push(stockCode.toUpperCase());
                        response.send(JSON.stringify(result));
                    }
                }
            });
    }
});

app.get("/delstockcode", function (request, response) {
    var stockCode = request.query.stockcode;
    console.log("delete: " + stockCode);
    if (myStockSymbols.indexOf(stockCode.toUpperCase()) >= 0) {
        myStockSymbols.splice(myStockSymbols.indexOf(stockCode.toUpperCase()), 1)
        response.end("");
    }
});

// listen for requests :)
server.listen(8081, function () {
    console.log("Your app is listening on port " + server.address().port);
});
