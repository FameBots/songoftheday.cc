const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  webhookUrl: {
    type: mongoose.SchemaTypes.String,
    required: false,
  },
});

module.exports = mongoose.model(`WebhooksSongOftheDay`, Schema);