import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// create new Schema
const exampleSchema = new Schema({
  createdAt: { type: Date },
});

let Example = mongoose.model('Example', exampleSchema);

module.exports = Example;
