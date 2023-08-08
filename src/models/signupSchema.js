const mongoose = require('mongoose');
//const passportLocalMongoose = require('passport-local-mongoose');

const signupSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String,
  },
}, { timestamps: true });


//signupSchema.plugin(passportLocalMongoose);

const SignupModel = mongoose.model('Signups', signupSchema);

module.exports = SignupModel;