const mongoose = require("mongoose");

const AppSchema = new mongoose.Schema({
  applicationID: {
    type: String,
    required: [true, "Please add applicationID"],
    unique: true,
    trim: true,
    maxlength: [20, "Name can not be more than 20 characters"],
  },
  descriptions: [
    {
      Language: {
        type: String,
        default: "EN",
      },
      appDescription: {
        type: String,
      },
      area: {
        type: String,
      },
      module: {
        type: String,
      },
    },
  ],

  dataStore: {
    type: String,
  },
  type: { type: String },
  icon: {
    type: String,
  },
  inUse: {
    type: Boolean,
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
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Static method to get avg of course tuitions
AppSchema.statics.getAverageCost = async function (companyId) {
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
AppSchema.post("save", function () {
  this.constructor.getAverageCost(this.company);
});

// Call getAverageCost before remove
AppSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.company);
});

module.exports = mongoose.model("App", AppSchema);
