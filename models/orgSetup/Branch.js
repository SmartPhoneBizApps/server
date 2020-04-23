const mongoose = require("mongoose");
const geocoder = require("../../utils/geocoder");

const BranchSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [200, "Name can not be more than 50 characters"],
  },
  description: {
    type: String,
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid URL with HTTP or HTTPS",
    ],
  },
  phone: {
    type: String,
    maxlength: [20, "Phone number can not be longer than 20 characters"],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },

  averageRating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [10, "Rating must can not be more than 10"],
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
BranchSchema.statics.getAverageCost = async function (companyId) {
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

// Geocode & create location field
BranchSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  // Do not save address in DB
  //this.address = undefined;
  next();
});

// Call getAverageCost after save
BranchSchema.post("save", function () {
  this.constructor.getAverageCost(this.company);
});

// Call getAverageCost before remove
BranchSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.company);
});

module.exports = mongoose.model("Branch", BranchSchema);
