"use strict";

const express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	compression = require("compression"),
	fs = require("fs"),
	cors = require("cors"),
	fetch = require('node-fetch'),
	url = require('url'),
	readline = require('readline'),
  byline = require('byline')

const corsOptions = {
  origin: true,
  optionsSuccessStatus: 200,
}



app.options('*', cors());

app.use(compression());
app.use(bodyParser.json({"limit":"1mb"}));
app.use(bodyParser.urlencoded({"extended": true}));
app.use(express.static("./public_html"));

const server = app.listen(8081, function () {
	console.log("Listening on port 8081");
});


//{"time": predictionTime, "thinking": timeSpent, "pUser": p/100, "pMarket": randomMarket.probability, "id": randomMarket.id, "bet": null}
//{"time":1702697005444,"thinking":10446,"pUser":0.03,"pMarket":0.05019543923082225,"id":"EOfELKA9NNOP1Wq8vjPp","bet":null}
//?obj={"time":1702697005444,"thinking":10446,"pUser":0.03,"pMarket":0.05019543923082225,"id":"EOfELKA9NNOP1Wq8vjPp","bet":null}
app.get('/', (req, res) => {
	try {
		var que = url.parse(req.url, true).query;
		let q;
		for (var k in que) {
			q = JSON.parse(k)
		}
		var user = q.userId;
		if(q.type == "bet") {
			//Prediction of user should include bet

			const data = fs.readFileSync('predictions.json', 'utf8');
			let obj = JSON.parse(data);


			if(obj[user] === undefined) {
				//Uh oh
				throw new Error("Bet does not exist")
			}
			const pos = obj[user].map(e => e.id).indexOf(q.id);
			obj[user][pos].bet = q.bet
			fs.writeFileSync("predictions.json", JSON.stringify(obj));
			res.send('Success')
		} else if(q.type == "save") {
			//Save prediction
			const data = fs.readFileSync('predictions.json', 'utf8');
			let obj = JSON.parse(data);
			let idd = q.id;
			delete q['type']
			if(obj[user] === undefined) {
				obj[user] = [q]
			} else {
				obj[user].push(q)
			}

			fs.writeFileSync('predictions.json', JSON.stringify(obj));
			res.send("Success!")
		} else if (q.type == "export") {
			//Just export the bets for userId
			const data = fs.readFileSync('predictions.json', 'utf8');
			let obj = JSON.parse(data)
			if(obj[user] === undefined) {
				res.send([])
			} else {
				res.send(obj[user])
			}
		}
	} catch (ex) {
	  console.error(ex);
		res.send('Failure')
	}
})
