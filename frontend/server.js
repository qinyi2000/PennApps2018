const path = require('path');
const express = require('express');
var multer = require('multer');
var upload = multer();
const app = express();
app.use(upload.array());
const port = process.env.PORT || 5000;
const loc = require("./location_cost")

app.post('/api/getcost', (req, res) => {
	zipcode = req.body["zipcode"]
	homesize = req.body["homeprice"]
	var l = loc.main(zipcode, homesize)
	if(l!=-1){
	var speeches={1:"If you were to purchase flood insurance, you would save about $"+l.netSaved+"*. over the course of 30 years.\n\n*This is of course not necessarily accurate due to the small amount of collcted data", 2:"There are likely to be about "+l.forecast+" floods in your area over 30 years.", 3:"The cost to you without insurance would be $"+l.cost+"."}}
	else{
	var speeches={1:"Your zip code isn't in our database. Sorry about that.",2:"Your zip code isn't in our database. Sorry about that.",3:"Your zip code isn't in our database. Sorry about that."}
	}
	return res.send(speeches)//For testing
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files, useless for this application
  app.use(express.static(path.join(__dirname, 'client/public')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/public', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
