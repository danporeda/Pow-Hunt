const express = require('express');
const router = express.Router();
const mountains = require('../controllers/mountains');
const catchAsync = require('../utils/catchAsync');
const Mountain = require('../models/mountain');
const { isLoggedIn, validateMountain, isAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
  .get(catchAsync(mountains.index))
  .post(isLoggedIn, validateMountain, upload.array('image'), catchAsync(mountains.createMountain));

router.get('/new', isLoggedIn, mountains.renderNewForm);

router.route('/:id')
  .get(catchAsync(mountains.showMountains))
  .put(isLoggedIn, isAuthor, upload.array('image'), validateMountain, catchAsync(mountains.updateMountain))
  .delete(isLoggedIn, isAuthor, catchAsync(mountains.deleteMountain));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(mountains.renderEditForm));

module.exports = router;