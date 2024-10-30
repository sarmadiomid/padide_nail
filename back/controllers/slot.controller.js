const Slot = require("../models/slot.model");

// Add available slots (admin only)
exports.addAvailableSlots = async (req, res) => {
  const { date, timeSlots } = req.body;

  try {
    // Check if the slot for the specified date already exists
    let existingSlot = await Slot.findOne({ date });

    if (existingSlot) {
      // If the date exists, add new time slots to the existing document
      existingSlot.timeSlots.push(...timeSlots); // Add the new time slots
      await existingSlot.save(); // Save the updated document
      return res
        .status(200)
        .json({ message: "New time slots added successfully", existingSlot });
    } else {
      // If the date doesn't exist, create a new slot document
      const newSlot = new Slot({ date, timeSlots });
      await newSlot.save();
      return res
        .status(201)
        .json({ message: "Slots added successfully", newSlot });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Get all slots (for admin panel)
exports.getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.find(); // Fetch all slots
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get available slots for a specific date
exports.getAvailableSlotsForDate = async (req, res) => {
  const { date } = req.params; // Get the date from the URL parameter

  try {
    const availableSlots = await Slot.findOne({ date }); // Fetch slots for the specific date

    if (availableSlots) {
      res.status(200).json(availableSlots);
    } else {
      res.status(404).json({ message: "No available slots for this date" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a time slot for a specific date
exports.deleteTimeSlot = async (req, res) => {
  const { date, timeSlot } = req.params; // Get date and time slot from URL parameters

  try {
    const slot = await Slot.findOneAndUpdate(
      { date },
      { $pull: { timeSlots: { time: timeSlot } } }, // Remove the specified time slot
      { new: true } // Return the updated document
    );

    if (!slot) {
      return res.status(404).json({ message: "No slots found for this date" });
    }

    res.status(200).json({ message: "Time slot deleted successfully", slot });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete all time slots for a specific date
exports.deleteDay = async (req, res) => {
  const { date } = req.params; // Get the date from the URL parameter

  try {
    // Find and delete the slot for the given date
    const deletedSlot = await Slot.findOneAndDelete({ date });

    if (!deletedSlot) {
      return res.status(404).json({ message: "No slots found for this date" });
    }

    res.status(200).json({
      message: "All time slots for the day deleted successfully",
      deletedSlot,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
