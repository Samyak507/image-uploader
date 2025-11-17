const express = require('express');
const cors = require('cors');
const routes = require('./routes');


const app = express();
app.use(cors({ origin: 'http://localhost:5173' })); // frontend (vite) default port
app.use(express.json());


app.use('/', routes);


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Mini Image Gallery backend listening on ${port}`));


module.exports = app; // exported for tests