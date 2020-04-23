const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: [true, "Please add applicationID"],
    unique: true,
    trim: true,
    maxlength: [30, "Name can not be more than 30 characters"],
  },
  descriptions: [
    {
      Language: {
        type: String,
        default: "EN",
      },
      RoleDescription: {
        type: String,
      },
      iconToolTip: {
        type: String,
      },
      area: {
        type: String,
      },
    },
  ],

  icon: {
    type: String,
  },
  inUse: {
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
    default: "Active",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Static method to get avg of course tuitions
RoleSchema.statics.getAverageCost = async function (companyId) {
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
RoleSchema.post("save", function () {
  this.constructor.getAverageCost(this.company);
});

// Call getAverageCost before remove
RoleSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.company);
});

module.exports = mongoose.model("Role", RoleSchema);
