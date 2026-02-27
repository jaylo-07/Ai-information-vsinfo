const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    subject:{
      type : String,
      required: true
    },
    workEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      require: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactUs", contactUsSchema);
