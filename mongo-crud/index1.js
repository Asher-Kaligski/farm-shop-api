const mongoose = require('mongoose');
mongoose
  .connect('mongodb://localhost/playground', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.log('Error to connect to MongoDB ', err));

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 255 },
  author: String,
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'network'],
    lowercase: true,
    trim: true,
  },
  //tags: [String],
  tags: {
    type: Array,
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: 'A course should have at least 1 tag.',
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  //if Published is true --> the price is required
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
    min: 10,
    max: 20,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
  },
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course = new Course({
    name: 'Angular Course',
    category: '-',
    author: 'Asher',
    // tags: ['angular', 'frontend'],
    isPublished: true,
  });

  try {
    await course.validate();
    // const result = await course.save();
    // console.log(result);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field]);
    }
  }
}

// async function getCourses() {
//   //eq (equal)
//   //ne (not equal)
//   // gt (greater than)
//   // gte (greater than or equal)
//   // lt (less than)
//   // lte (less than or equal)
//   // in
//   // nin (not in)

//   /////////////////Logical operators
//   //or
//   //and

//   const courses = await Course
//     // .find({ author: "Asher", isPublished: true })
//     // .find({ price: { $gt: 10, $lte: 20 } })
//     //.find({ price: { $in: [10, 15, 20] } })

//     // .find()
//     // .or([{ author: 'Asher' }, { isPublished: true }])

//     //Starts with
//     .find({ author: /^As/ })

//     //Ends with
//     .find({ author: /Kaligski$/i })

//     //Contains Asher (i key sensitive --> uppercase/lowercase)
//     .find({ author: /.*Asher.*/i })

//     .limit(10)
//     .sort({ name: 1 })
//     .select({ name: 1, tags: 1 });
//   console.log(courses);
// }

async function getCourses() {
  //eq (equal)
  //ne (not equal)
  // gt (greater than)
  // gte (greater than or equal)
  // lt (less than)
  // lte (less than or equal)
  // in
  // nin (not in)

  /////////////////Logical operators
  //or
  //and

  const pageNumber = 2;
  const pageSize = 10;

  const courses = await Course.find({ isPublished: true })

    ///Count
    // .limit(10)
    // .sort({ name: 1 })
    // .countDocuments();

    //Pagination
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ name: 1 });
  // .countDocuments();
  console.log(courses);
}

// async function updateCourse(id) {}

// updateCourse(id);

//getCourses();

createCourse();
