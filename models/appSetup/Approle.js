const mongoose = require("mongoose");

const ApproleSchema = new mongoose.Schema({
  appRole: {
    type: mongoose.Schema.ObjectId,
    ref: "Role",
    required: [true, "Please add RoleID"],
    unique: true,
  },
  role: {
    type: String,
    default: true,
  },
  inUse: {
    type: String,
    default: true,
  },
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  status: {
    type: String,
    default: "Active",
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
    },
  ],
  Apps: [
    {
      app: {
        type: mongoose.Schema.ObjectId,
        ref: "App",
      },
      applicationID: {
        type: String,
      },
      icon: {
        type: String,
      },
      status: {
        type: String,
      },
      dataStore: {
        type: String,
      },
      userSpecific: {
        type: Boolean,
      },
      frameType: {
        type: String,
      },
      backgroundImage: {
        type: String,
      },
      type: { type: String },
      descriptions: [
        {
          Language: {
            type: String,
            default: "EN",
          },
          appDescription: {
            type: String,
          },
          appHelp: {
            type: String,
          },
          modules: {
            type: String,
          },
          area: {
            type: String,
          },
        },
      ],
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Static method to get avg of course tuitions
ApproleSchema.statics.getAverageCost = async function (companyId) {
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
ApproleSchema.post("save", function () {
  this.constructor.getAverageCost(this.company);
});

// Call getAverageCost before remove
ApproleSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.company);
});

module.exports = mongoose.model("Approle", ApproleSchema);
