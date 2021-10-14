const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 5000;
const STATIC_PATH = path.join(__dirname, 'public');

app.use(express.static(STATIC_PATH));

app.get('*', (req, res) => res.redirect('/'));

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));