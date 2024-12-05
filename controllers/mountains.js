const Mountain = require('../models/mountain');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
  const mountains = await Mountain.find({});
  res.render('mountains/index', { mountains });
};

module.exports.renderNewForm = (req, res) => {
  res.render('mountains/new')
};

module.exports.createMountain = async (req, res, next) => {
  const { mountain } = req.body;
  if (req.files.length === 0) {
    mountain.images = [
      {
        url: 'https://images.megapixl.com/725/7253122.jpg',
        filename: 'stockImg' + Math.random().toString().slice(2)
      }
    ];
  } else {
    mountain.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  }
  mountain.author = req.user._id;
  const newMountain = new Mountain(mountain);
  await newMountain.save();
  req.flash('success', 'Successfully created a new mountain!')
  res.redirect(`/mountains/${newMountain._id}`);
}

module.exports.showMountains = async (req, res) => {
  const mountain = await Mountain.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author');
  if (!mountain) {
    req.flash('error', 'Cannot find that mountain');
    return res.redirect('/mountains');
  }
  res.render('mountains/show', { mountain });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const mountain = await Mountain.findById(id);
  if (!mountain) {
    req.flash('error', 'Cannot find that mountain');
    return res.redirect('/mountains');
  }
  res.render('mountains/edit', { mountain });
};

module.exports.updateMountain = async (req, res) => {
  const { id } = req.params;
  const updatedMountain = await Mountain.findByIdAndUpdate(id, { ...req.body.mountain });
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  updatedMountain.images.push(...imgs);
  await updatedMountain.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await updatedMountain.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }
  req.flash('success', `Successfully updated ${updatedMountain.name}`);
  res.redirect(`/mountains/${id}`);
};

module.exports.deleteMountain = async (req, res) => {
  const { id } = req.params;
  const mountain = await Mountain.findByIdAndDelete(id);
  req.flash('success', `Successfully deleted ${mountain.name}`)
  res.redirect('/mountains');
};