const fs = require('fs');
const Book = require('../models/Book');

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.statusCode(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.getBestRatedBooks = (req, res, next) => {
  Book.find()
    .then(books => {
      const bestRatedBooks = books.sort((a, b) => b.averageRating - a.averageRating).slice(0, 3);
      res.status(200).json(bestRatedBooks);
    })
    .catch(error => res.statusCode(400).json({ error }));
};

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  if (bookObject.ratings[0].grade === 0) {
    bookObject.ratings = [];
    bookObject.averageRating = 0;
  }

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });

  book
    .save()
    .then(() => {
      res.status(201).json({ message: 'Object created!' });
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: 'Unauthorized request' });
      } else {
        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Object modified!' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: 'Unauthorized request' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Object deleted!' });
            })
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

exports.rateBook = (req, res, next) => {
  const rating = { ...req.body }.rating;
  if (rating > 5 || rating < 0) {
    res.status(403).json({ message: 'Wrong grade' });
  } else {
    Book.findOne({ _id: req.params.id })
      .then(book => {
        const usersVoted = [...book.ratings].map(item => item.userId);
        if (usersVoted.includes(req.auth.userId)) {
          res.status(403).json({ message: 'User can only vote once' });
        } else {
          const newRatings = [...book.ratings, { userId: req.auth.userId, grade: rating }];

          const getAverageRating = ratings => {
            const grades = ratings.map(item => item.grade);
            const sum = grades.reduce((acc, curValue) => acc + curValue);
            const averageNote = sum / grades.length;

            return averageNote;
          };

          const newAverageRating = getAverageRating(newRatings);

          book.ratings = newRatings;
          book.averageRating = newAverageRating;

          Book.updateOne(
            { _id: req.params.id },
            { ratings: newRatings, averageRating: newAverageRating, _id: req.params.id }
          )
            .then(() => res.status(200).json(book))
            .catch(error => res.status(401).json({ error }));
        }
      })
      .catch(error => {
        res.status(500).json({ error });
      });
  }
};
