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
	console.log(l)
	//try{
	//
	var speeches={1:"If you were to purchase flood insurance, you would save about $"+l.netSaved+"*.\n\n*This is of course not necessarily accurate due to the small amount of collcted data"}
	return res.send(speeches)//For testing
	//}
	//catch(e){
	//	return res.send({zipcode:"Your zip code is not within our database. Sorry about that."})
	//}
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
