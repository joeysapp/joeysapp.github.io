var express = require('express');
var app = express();
var path = require('path');


app.use('/src', express.static(path.join(__dirname, 'src')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname +'/index.html'));
});

app.listen(8000, () => {
  console.log('App listening on port 8000');
});