const mongoose = require("mongoose");
const geocoder = require("../../utils/geocoder");

const AreaSchema = new mongoose.Schema({
  areaName: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [200, "Name can not be more than 50 characters"],
  },
  description: {
    type: String,
  },
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "New",
  },
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: "Company",
    required: true,
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Static method to get avg of course tuitions
AreaSchema.statics.getAverageCost = async function (companyId) {
  const obj = await this.aggregate([
    {
      $match: { company: companyId },
    },
    {
      $group: {
        _id: "$company",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);

  try {
    await this.model("Company").findByIdAndUpdate(companyId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
AreaSchema.post("save", function () {
  this.constructor.getAverageCost(this.company);
});

// Call getAverageCost before remove
AreaSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.company);
});

module.exports = mongoose.model("Area", AreaSchema);
