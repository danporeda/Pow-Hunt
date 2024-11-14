const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportlocalMongoose = require('passport-local-mongoose');
const passport = require('passport');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  }
});
UserSchema.plugin(passportlocalMongoose);