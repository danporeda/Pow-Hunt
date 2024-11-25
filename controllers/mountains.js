const Mountain = require('../models/mountain');

module.exports.index = async (req, res) => {
  const mountains = await Mountain.find({});
  res.render('mountains/index', { mountains });
};

module.exports.renderNewForm = (req, res) => {
  res.render('mountains/new')
};

module.exports.createMountain = async (req, res, next) => {
  const { mountain } = req.body;
  if (!mountain.image) {
    mountain.image = 'https://images.megapixl.com/725/7253122.jpg'
  };
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
  if (!req.body.mountain.image) {
   req.body.mountain.image = 'https://images.megapixl.com/725/7253122.jpg';
  }
  const updatedMountain = await Mountain.findByIdAndUpdate(id, { ...req.body.mountain });
  req.flash('success', `Successfully updated ${updatedMountain.name}`);
  res.redirect(`/mountains/${id}`);
};

module.exports.deleteMountain = async (req, res) => {
  const { id } = req.params;
  const mountain = await Mountain.findByIdAndDelete(id);
  req.flash('success', `Successfully deleted ${mountain.name}`)
  res.redirect('/mountains');
};