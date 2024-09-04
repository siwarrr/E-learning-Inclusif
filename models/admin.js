const mongoose = require('mongoose');
const User = require('./user');

const AdminSchema = new mongoose.Schema({

});

module.exports = User.discriminator('Admin', AdminSchema);