const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  left: { type: mongoose.Schema.Types.Mixed, default: null },
  right: { type: mongoose.Schema.Types.Mixed, default: null },
  value: { type: String, default: null }
});

const ruleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ast: { type: nodeSchema, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rule', ruleSchema);
