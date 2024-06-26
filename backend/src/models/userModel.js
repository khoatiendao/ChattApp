const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        require: true,
        minlength: 1,
        maxlength: 50
    },
    email: {
        type: String,
        require: true,
        minlength: 3,
        maxlength: 200,
        unique: true
    },
    password: {
        type: String,
        require: true,
        minlength: 1,
        maxlength: 1024
    },
}, 
{
    timestamps: true,
    versionKey: false    
}
);

const userModels = mongoose.model("User", userSchema);

module.exports = userModels;