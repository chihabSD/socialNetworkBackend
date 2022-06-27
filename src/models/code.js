const mongoose = require("mongoose");

const { Schema, ObjectId } = mongoose;

const CodeSchema = Schema(
  {
    code: {
      type: Number,
      required: [true],
    },

    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Code = mongoose.model("Code", CodeSchema);

module.exports = Code;
