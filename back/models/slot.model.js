const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  timeSlots: [{ time: String, isAvailable: { type: Boolean, default: true } }],
});

module.exports = mongoose.model("Slot", slotSchema);
