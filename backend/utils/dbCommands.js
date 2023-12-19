
const Work = require('./models/Work');
Work.deleteMany()
  .then(console.log('deleted'))
  .catch(error => console.log(error));

booksData.forEach(item => {
  delete item.id;
  new Book({...item}).save()
});
