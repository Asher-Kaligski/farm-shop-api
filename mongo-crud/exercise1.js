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
  return await Course.find({
    isPublished: true,
    tags: { $in: ['backend', 'frontend'] },
  })
    .sort({ price: -1 })
    .select({ name: 1, author: 1, price: 1 });
}

async function run() {
  const courses = await getCourses();
  console.log(courses);
}

run();
