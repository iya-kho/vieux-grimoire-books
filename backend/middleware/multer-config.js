const multer = require('multer');
const SharpMulter = require('sharp-multer');

function setNewFileName(originalName, options) {
  const name = originalName.split(' ').join('_') + Date.now() + '.' + options.fileFormat;
  return name;
}

const storage = SharpMulter({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  imageOptions: {
    fileFormat: 'webp',
    quality: 80,
  },
  filename: setNewFileName,
});

module.exports = multer({ storage: storage }).single('image');
