const mongoose = require('mongoose');
mongoose
  .connect('mongodb://localhost/mongo-exercise', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.log('Error to connect to MongoDB ', err));

const courseSchema = mongoose.Schema({
  tags: [String],
  date: Date,
  name: String,
  author: String,
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model('Course', courseSchema);

async function getCourses() {
  return await Course.find({ isPublished: true }).sort({ name: 1 });
  // .select({ name: 1, author: 1 });
}

async function run() {
  const courses = await getCourses();
  console.log(courses);
}

//run();

async function updateCourse(id) {
  const result = await Course.findByIdAndUpdate(
    id,
    {
      $set: {
        author: 'Jack',
        isPublished: false,
      },
    },
    { new: true }
  );
  //   const result = await Course.updateOne(
  //     { _id: id },
  //     {
  //       $set: {
  //         author: 'Mosh',
  //         isPublished: false,
  //       },
  //     }
  //   );

  console.log(result);
}
// async function updateCourse(id) {
//   const course = await Course.findById(id);
//   if (!course) return;
//   // course.isPublished = true;
//   // course.author = 'Another Author';

//   course.set({
//     isPublished: true,
//     author: 'Another Author',
//   });

//   const result = await course.save();
//   console.log(result);
// }

// updateCourse('5a68fdd7bee8ea64649c2777');

async function removeCourse(id) {
  //   const result = await Course.deleteOne({ _id: id });
  const course = await Course.findByIdAndRemove(id);
  console.log(course);
}

removeCourse('5a68fdd7bee8ea64649c2777');
