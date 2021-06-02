const express = require('express');
const servestatic = require('serve-static')
const path = require('path');

const app = express();

app.use('/', servestatic(path.join(__dirname, '/dist')));

const port = process.env.PORT || 8000;
app.listen(port);