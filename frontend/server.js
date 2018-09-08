const path = require('path');
const express = require('express');
var multer = require('multer');
var upload = multer();
const app = express();
app.use(upload.array());
const port = process.env.PORT || 5000;

//So what you'll want to do here is to update the below app.post() call to process the zipcode, read in in the first line, and replace the object with an object containing whatever the frontend needs, in this case the cost most likely. Try not to change the return parameter name, will you? ;)

app.post('/api/getcost', (req, res) => {
	zipcode = req.body["zipcode"]
	homecost = req.body["homeprice"]
	return res.send({zipcode:zipcode})//For testing
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
