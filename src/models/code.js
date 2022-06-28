const mongoose = require("mongoose");

const { Schema, ObjectId } = mongoose;

const CodeSchema = Schema(
  {
    code: {
      type: String,
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
