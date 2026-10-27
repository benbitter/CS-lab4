const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'csrf-get.html'));
});

app.listen(PORT, () => {
  console.log('Northstar delivery notice demo');
  console.log('Home: http://localhost:' + PORT + '/');
  console.log('GET demo: http://localhost:' + PORT + '/csrf-get.html');
});
