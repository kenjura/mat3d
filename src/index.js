const express       = require('express');
const fs            = require('fs');

console.log('mat server is starting...');

const port = process.env.PORT || 3040;

// Create a new Express application.
var app = express();


app.get('/favicon.*',(req,res) => res.send(null));

// static files
app.use(express.static('./'));

// general error handler
app.use((err, req, res, next) => {
  console.error('GENERAL ERROR',err);
  res.status(500).send('It is pitch black. You are likely to be eaten by a grue.');
})

app.listen(port, err => {
  console.log(`app is running on port ${port}`);
});
