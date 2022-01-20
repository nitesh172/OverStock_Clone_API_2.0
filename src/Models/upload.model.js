const mongoose = require("mongoose")


var Schema = mongoose.Schema;

var uploadSchema = new Schema({
    uploadPic: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('upload', uploadSchema );