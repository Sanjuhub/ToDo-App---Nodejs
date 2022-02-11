const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const keys = require('./config/keys');
const PORT = process.env.PORT || 5000;
//MongoDb connection
try {
  mongoose.connect(keys.mongoURIRemote, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (err) {
  console.log(err.message);
}

mongoose.connection
  .once('open', () => {
    console.log('database connected');
  })
  .on('disconnected', () => {
    console.log('database disconnected');
  });

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  ///..other options
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Server is up and running on PORT 5000');
});

app.listen(PORT);
