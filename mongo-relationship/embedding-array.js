const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/playground', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));

const authorScheme = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model('Author', authorScheme);

const Course = mongoose.model(
  'Course',
  new mongoose.Schema({
    name: String,
    authors: [authorScheme],
  })
);

async function createAuthor(name, bio, website) {
  const author = new Author({
    name,
    bio,
    website,
  });

  const result = await author.save();
  console.log(result);
}

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}
async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId);
  author.remove();
  course.save();
}

async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find();

  console.log(courses);
}

async function updateAuthor(courseId) {
  //use $unset to remove some property or sub-document (value set to empty string)
  const course = await Course.update(
    { _id: courseId },
    {
      $set: {
        'author.name': 'Asher',
      },
    }
  );

  // const course = await Course.findById(courseId);
  // course.author.name = 'Asher Kaligski';
  //course.save();
}

// createCourse('Node Course', [
//   new Author({ name: 'Asher' }),
//   new Author({ name: 'Mosh' }),
//   new Author({ name: 'Dan' }),
// ]);

//updateAuthor('5eb869fb8c8e925a3e860eaf');

//addAuthor('5eb8c53da2dd4b19a8f879f8', new Author({ name: 'Mosh' }));

removeAuthor('5eb8c53da2dd4b19a8f879f8', '5eb8c61ec79d0f1f2071abfd');
