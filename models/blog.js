var mongoose = require('mongoose');
const { urlencoded } = require('express');
var Schema = mongoose.Schema;

mongoose.connect(
    "mongodb+srv://zapprep:JQDn7rmFYHRQxPmo@cluster0-lwbbj.mongodb.net/test",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);
var blogSchema = new Schema({
    title: String,
    name: String,
    description: String,
    image: String,
})

module.exports = mongoose.model('Blog', blogSchema)