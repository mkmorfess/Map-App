const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const routes = require("./controller/routes.js");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes);

app.use(express.static("map-app/build"))

app.get("/", function(req, res) {
	res.sendFile(path.join(__dirname, "./map-app/build/index.html"));
});

app.listen(PORT, function(){
	console.log("Server Running on port: " + PORT);
});