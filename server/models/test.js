const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = new Schema({
    title: { type: String, required: true},
    duration: { type: String, required: true},
    numOfQuestion: { type: String, required: true},
    totalMark: { type: String, required: true},
    passingMark: { type: String, required: true},
    startDate: { type: String, required: true},
    endDate: { type: String, required: true},
    description: { type: String, required: true},
},{timestamps: true})

const Test = mongoose.model('Test', testSchema);
module.exports= Test;