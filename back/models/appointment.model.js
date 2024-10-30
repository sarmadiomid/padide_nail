const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    status: { type: String, default: "pending" }, // pending, completed
    file: { type: String }, // Add file field
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
