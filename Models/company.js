const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },

  headquarter: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  region: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  updateDate: {
    type: Date,
    default: Date.now,
  },
  numberofsubsidiaries: {
    type: Number,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  noOfEmployees: {
    type: Number,
    required: true,
  },
  companyEmployees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  ],
});

const CompanyModels = mongoose.model("Company", CompanySchema);
module.exports = CompanyModels;
