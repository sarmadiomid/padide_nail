const Appointment = require("../models/appointment.model");
const Slot = require("../models/slot.model");

// Book an appointment
exports.bookAppointment = async (req, res) => {
  const { fullName, mobile, date, timeSlot, file } = req.body; // Capture file data

  try {
    const slot = await Slot.findOne({ date, "timeSlots.time": timeSlot });
    if (
      !slot ||
      !slot.timeSlots.find((s) => s.time === timeSlot && s.isAvailable)
    ) {
      return res.status(400).json({ message: "Time slot not available" });
    }

    const appointment = new Appointment({
      fullName,
      mobile,
      date,
      timeSlot,
      file,
    }); // Save file data
    await appointment.save();

    await Slot.updateOne(
      { date, "timeSlots.time": timeSlot },
      { $set: { "timeSlots.$.isAvailable": false } }
    );

    res
      .status(201)
      .json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// View all booked appointments (admin only)
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Change appointment status
exports.updateAppointmentStatus = async (req, res) => {
  const { id, status } = req.body;
  try {
    const appointment = await Appointment.findById(id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    appointment.status = status;
    await appointment.save();
    res.status(200).json({ message: "Status updated", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params; // Get the appointment ID from URL parameter

  try {
    const appointment = await Appointment.findByIdAndDelete(id); // Delete the appointment by ID
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Optionally, you might want to mark the corresponding time slot as available again
    await Slot.updateOne(
      { date: appointment.date, "timeSlots.time": appointment.timeSlot },
      { $set: { "timeSlots.$.isAvailable": true } }
    );

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Change appointment status to complete
exports.completeAppointment = async (req, res) => {
  const { id } = req.params; // Get appointment ID from URL parameter

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = "completed"; // Change status to completed
    await appointment.save();

    res
      .status(200)
      .json({ message: "Appointment status updated to complete", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
