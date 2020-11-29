const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
//model
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must have less or equal than 10 characters'],
      minlength: [10, 'A tour must have less or equal than 10 characters'],
      // validate: validator.isAlpha,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'a tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'a tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a diff'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.45,
      min: [1, 'rating must be above 1.0'],
      max: [5, 'Rating must be 5.0'],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        //this only points to current doc on New document creation
        //this will not work on update
        validator: function (val) {
          return val < this.price;
        },
        message: 'discount ({VALUE}) price should be below regular price',
      },
    },
    summary: {
      type: String,
      //removes white spaces from big and ending
      trim: true,
      required: [true, 'A tour must have a des'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    //diff dates for the same tours
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Virtual Functions
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//mongoose middleware: Document - run before save / create
//this : current doc - being saved
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//mongoose middleware: Query - run before save / create
//this : current query
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = new Date();
  next();
});

//after the query executed
tourSchema.post(/^find/, function (doc, next) {
  // console.log(doc);
  // console.log(`Query took ${new Date() - this.start} ms`);
  next();
});

//aggregation middleware - runs before aggregation
tourSchema.pre('aggregate', function (next) {
  //big of array
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });
//schema

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
