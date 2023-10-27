Book.deleteMany().then(console.log('deleted'));

booksData.forEach(item => {
  delete item.id;
  new Book({...item}).save()
});
