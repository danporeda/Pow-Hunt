const express = require('express');
const router = express.Router();
const mountains = require('../controllers/mountains');
const catchAsync = require('../utils/catchAsync');
const Mountain = require('../models/mountain');
const { isLoggedIn, validateMountain, isAuthor } = require('../middleware');

router.get('/', catchAsync(mountains.index))

router.get('/new', isLoggedIn, mountains.renderNewForm)

router.post('/', isLoggedIn, validateMountain, catchAsync(mountains.createMountain))

router.get('/:id', catchAsync(mountains.showMountains))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(mountains.renderEditForm))

router.put('/:id', isLoggedIn, validateMountain, isAuthor, catchAsync(mountains.updateMountain))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(mountains.deleteMountain))

module.exports = router;