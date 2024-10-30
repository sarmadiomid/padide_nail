const express = require("express");
const {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  completeAppointment,
} = require("../controllers/appointment.controller");
const router = express.Router();

router.post("/book", bookAppointment); // Booking an appointment
router.get("/", getAppointments); // View all appointments (admin)
router.put("/status", updateAppointmentStatus); // Update appointment status (admin)
router.delete("/:id", deleteAppointment); // Delete an appointment by ID
router.put("/complete/:id", completeAppointment); // Change appointment status to complete

module.exports = router;
