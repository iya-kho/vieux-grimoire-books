const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageURL: { type: String, required: false },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: { type: String, required: false },
      grade: { type: Number, required: false },
    },
  ],
  averageRating: { type: Number, required: true}
});

module.exports = mongoose.model('Book', bookSchema);