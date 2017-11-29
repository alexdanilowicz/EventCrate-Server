import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import exampleRoutes from './routes/exampleRoutes';

// initialize
dotenv.config();
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

app.set('view engine', 'ejs');
// app.use(express.static('static'));
// enables static assets from folder static
// app.set('views', path.join(__dirname, '../app/views'));
// this just allows us to render ejs from the ../app/views directory

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//hook up MongDB
let uri;

if ( !process.env.DB_USERNAME || !process.env.PASSWORD ){
  // local development
  uri = 'mongodb://localhost/testdev';
}
else {
  // hook up to actual database
}

let db = mongoose.connect(uri, {
  useMongoClient: true,
});

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log("MongoDB connection successful to " + uri);
});

// default index route
app.get('/', (req, res) => {
  res.send('Default Route');
});

// register our routes
exampleRoutes(app);

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9000;
app.listen(port);
console.log(`Server listening on port ${port}`);
