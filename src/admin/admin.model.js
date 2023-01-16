const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    isVerified: {
        type: String,
        default: "admin",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);