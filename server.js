//no related to express
//saved on process
require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));

//global
//start the server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

//test