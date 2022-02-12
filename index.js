const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/authRoutes');

//MongoDb connection
try {
  mongoose.connect(process.env.mongoURI, {
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

app.use(authRoutes);

app.listen(PORT);
