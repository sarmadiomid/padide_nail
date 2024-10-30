const express = require("express");
const {
  addAvailableSlots,
  getAllSlots, // Updated controller for fetching all slots
  getAvailableSlotsForDate, // Controller for fetching slots for a specific date
  deleteTimeSlot,
  deleteDay,
  updateTimeSlot,
} = require("../controllers/slot.controller");
const router = express.Router();

router.post("/add", addAvailableSlots); // Add available slots (admin)
router.get("/", getAllSlots); // Get all slots (admin panel)
router.get("/:date", getAvailableSlotsForDate); // Get available slots for a specific date
router.delete("/delete/:date", deleteDay); // Delete all time slots for a specific date
router.delete("/delete/:date/:timeSlot", deleteTimeSlot); // Delete a time slot by date and time

module.exports = router;
