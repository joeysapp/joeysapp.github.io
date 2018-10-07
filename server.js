const express = require('express');
const app = express();
const path = require('path');

app.use('/src', express.static(path.join(__dirname, 'src')))
app.get('/', (req, res) => res.sendFile(__dirname+'/index.html'));

app.listen(3000, () => console.log('Example app listening on port 3000!'))