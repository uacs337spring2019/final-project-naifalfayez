/**
Naif Alfayez
CSC 337
Final project: Arabic letters server where the data about the letters
is saved to be used in the webpage.
**/


const express = require("express");
const app = express();
const fs = require("fs");

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", 
			"Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(express.static('public'));
//

app.post('/', jsonParser, function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	let folder =  req.query.title;
	
	let comment = req.body.comment;

	let line = comment+"\n";
	

	fs.appendFile("letters/"+folder+"/info.txt", line , function(err) {
		if(err) {
			console.log(err);
			res.status(400);
		}
		res.send("works!");
	});
});


app.get('/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");

	let mode = req.query.mode;
	let title = req.query.title;
	console.log(mode);
	console.log(title);
	// returns an error if one of the parameters is missing
	if(mode == undefined || title == undefined) {
		res.status(400);
		res.send("Missing required parameters");
	}

	
	switch (mode) {

		case "all":
			res.send(JSON.stringify(letters()));
			break;

		case "description":
			res.send(JSON.stringify(description(title)));
			break;

		case "info":
			res.send(JSON.stringify(info(title)));
			break;

		default:
			res.status(400);
			res.send(JSON.stringify("Missing required parameters"));

	}
});



/** This function gets the info (comments) about a letter 
* @param {String} title of the file 
* @returns {Object} messages
*/ 
function info (title) {
	let file = fs.readFileSync("letters/"+title+"/info.txt", 'utf8');
	let lines = file.split("\n");
	let messages = [];
	for (let i = 0; i < lines.length; i++) {
		if (lines[i]) {
			let message = lines[i];
			messages.push(message);
		}
	}
	let obj = {"messages" : messages};
	return obj;


}

/** This function gets all the letters 
* @returns {Object} letters
*/
function letters () {
	let files = fs.readdirSync("letters/");
	let letters = [];
	for (let i = 1; i < files.length; i++) {
		
		let file = fs.readFileSync("letters/"+i+"/description.txt", 'utf8');
		let lines = file.split("\n");
		
		let letter = {
			"number":lines[0].trim(),
			"name":lines[1].trim(),
		};
		letters.push(letter);
	}
	let obj = {"letters" : letters};
	return obj;
}


/** This function gets the data for each letter
* @param {String} title of the file 
* @returns {Object} info
*/
function description(title) {
	let file = fs.readFileSync("letters/"+title+"/description.txt", 'utf8');
	let lines = file.split("\n");
	let info = {
		"number":lines[0].trim(),
		"title":lines[1].trim(),
		"english":lines[2].trim(),
		"pronunciation":lines[3].trim(),
		"value":lines[4].trim()
	};	
	return info;
}

app.listen(process.env.PORT);
