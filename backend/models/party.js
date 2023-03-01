const mongoose = require("mongoose");

const PartySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  partyDate: {
    type: Date,
    default: Date.now,
  },
  photos: {
    type: Array,
  },
  privacy: {
    type: Boolean,
    default: false,
  },
  userId:{
    type: mongoose.ObjectId
  }
});

const Party = mongoose.model('party', PartySchema);

module.exports = Party;