//no related to express
//saved on process
const fs = require('fs');
require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

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

//Read Json File -convert json to js object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//import data to the database
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data loaded successfully !');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//delete all data from collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data deleted successfully !');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] == '--import') {
  importData();
} else if (process.argv[2] == '--delete') {
  deleteData();
}

console.log(process.argv);
