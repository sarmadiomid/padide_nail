import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar } from "react-modern-calendar-datepicker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import jalaali from "jalaali-js";
import {
  ClipboardList,
  Clock,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";

const AdminPanel = () => {
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editSlotId, setEditSlotId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image for modal

  const getShamsiToday = () => {
    const today = new Date();
    const jToday = jalaali.toJalaali(today);
    return {
      year: jToday.jy,
      month: jToday.jm,
      day: jToday.jd,
    };
  };

  const getShamsiNext30Days = () => {
    const today = new Date();
    const next30 = new Date(today.setDate(today.getDate() + 30));
    const jNext30 = jalaali.toJalaali(next30);
    return {
      year: jNext30.jy,
      month: jNext30.jm,
      day: jNext30.jd,
    };
  };

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/slots");
        setSlots(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching slots:", error);
        setLoading(false);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/appointments"
        );
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchSlots();
    fetchAppointments();

    const intervalId = setInterval(fetchSlots, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleImageClick = (imageData) => {
    setSelectedImage(imageData);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const toggleAvailability = async (id, time) => {
    try {
      const slot = slots.find((s) => s._id === id);
      const updatedTimeSlots = slot.timeSlots.map((ts) =>
        ts.time === time ? { ...ts, isAvailable: !ts.isAvailable } : ts
      );

      await axios.patch(`http://localhost:5000/api/slots/${id}`, {
        timeSlots: updatedTimeSlots,
      });

      setSlots(
        slots.map((slot) =>
          slot._id === id ? { ...slot, timeSlots: updatedTimeSlots } : slot
        )
      );
    } catch (error) {
      console.error("Error updating slot:", error);
    }
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];

    const formattedDate = `${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`;
    const selectedDaySlot = slots.find((slot) => slot.date === formattedDate);

    if (selectedDaySlot) {
      const unavailableTimes = selectedDaySlot.timeSlots.map(
        (slot) => slot.time
      );
      return timeSlots.filter((slot) => !unavailableTimes.includes(slot));
    }

    return timeSlots;
  };

  const addOrUpdateSlot = async (e) => {
    e.preventDefault();

    if (!selectedDate || selectedTimeSlots.length === 0) {
      setMessage("لطفاً یک تاریخ و حداقل یک بازه زمانی انتخاب کنید");
      return;
    }

    const formattedDate = `${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`;

    try {
      const existingSlot = slots.find((slot) => slot.date === formattedDate);

      const slotData = {
        date: formattedDate,
        timeSlots: selectedTimeSlots.map((time) => ({
          time,
          isAvailable: true,
        })),
      };

      // If no slot exists for the date, create a new slot with the selected time slots
      await axios.post("http://localhost:5000/api/slots/add", slotData);
      setMessage(`بازه زمانی جدید با موفقیت برای ${formattedDate} اضافه شد`);

      // Fetch and update the list of slots after the operation
      const response = await axios.get("http://localhost:5000/api/slots");
      setSlots(response.data);

      // Clear form and reset state
      setSelectedTimeSlots([]);
      setIsEditing(false);
      setEditSlotId(null);
    } catch (error) {
      console.error("Error adding or updating slot:", error);
      setMessage("خطا در افزودن یا بروزرسانی بازه زمانی");
    }
  };

  const removeDay = async (slot) => {
    try {
      await axios.delete(`http://localhost:5000/api/slots/delete/${slot.date}`);
      setSlots(slots.filter((s) => s._id !== slot._id));
      setMessage(
        `All time slots for ${slot.date} have been deleted successfully`
      );
    } catch (error) {
      console.error("Error deleting day's slots:", error);
      setMessage("Failed to delete the day's slots.");
    }
  };

  const editSlot = (slotId) => {
    const selectedSlot = slots.find((slot) => slot._id === slotId);
    setSelectedDate({
      year: parseInt(selectedSlot.date.split("-")[0]),
      month: parseInt(selectedSlot.date.split("-")[1]),
      day: parseInt(selectedSlot.date.split("-")[2]),
    });
    setSelectedTimeSlots(selectedSlot.timeSlots.map((ts) => ts.time));
    setIsEditing(true);
    setEditSlotId(slotId);
  };

  const toggleTimeSlot = (time) => {
    setSelectedTimeSlots((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      setAppointments(
        appointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, animationClass: "delete-animation" }
            : appointment
        )
      );

      setTimeout(async () => {
        await axios.delete(
          `http://localhost:5000/api/appointments/${appointmentId}`
        );
        setAppointments(
          appointments.filter(
            (appointment) => appointment._id !== appointmentId
          )
        );
        setMessage("قرار با موفقیت حذف شد");
      }, 1000);
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setMessage("حذف قرار با شکست مواجه شد.");
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/complete/${appointmentId}`
      );

      setAppointments(
        appointments.map((appointment) =>
          appointment._id === appointmentId
            ? {
                ...appointment,
                status: "done",
                animationClass: "done-animation",
              }
            : appointment
        )
      );

      setMessage("وضعیت قرار به 'انجام شد' تغییر یافت");
    } catch (error) {
      console.error("Error completing appointment:", error);
      setMessage("تغییر وضعیت قرار با شکست مواجه شد.");
    }
  };

  const deleteTimeSlot = async (slot, timeSlot) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/slots/delete/${slot.date}/${timeSlot.time}`
      );

      const updatedTimeSlots = slot.timeSlots.filter(
        (ts) => ts.time !== timeSlot.time
      );

      setSlots(
        slots.map((s) =>
          s._id === slot._id ? { ...s, timeSlots: updatedTimeSlots } : s
        )
      );

      console.log(
        `Time slot ${timeSlot.time} deleted successfully for date ${slot.date}`
      );
    } catch (error) {
      console.error("Error deleting time slot:", error);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-700 text-lg">در حال بارگذاری...</p>
    );
  }
  return (
    <div
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8 text-right"
      dir="rtl"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        پنل مدیریت
      </h2>

      {/* Display appointments */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-900">نوبت ها</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                {[
                  "نام کامل",
                  "شماره موبایل",
                  "تاریخ",
                  "بازه زمانی",
                  "وضعیت",
                  "تصویر", // New header for the image column
                ].map((header) => (
                  <th
                    key={header}
                    className="border-b-2 border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-600"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr
                  key={appointment._id}
                  className={`bg-white hover:bg-gray-50 transition-colors ${appointment.animationClass}`}
                >
                  {["fullName", "mobile", "date", "timeSlot"].map((field) => (
                    <td
                      key={field}
                      className="border-t border-gray-200 px-4 py-2 text-gray-800"
                    >
                      {appointment[field]}
                    </td>
                  ))}
                  <td className="border-t border-gray-200 px-4 py-2 text-gray-800">
                    <div className="flex items-center">
                      <span>{appointment.status}</span>
                      <button
                        onClick={() => completeAppointment(appointment._id)}
                        className="mx-2 text-green-600 hover:text-green-800 focus:outline-none"
                        aria-label="Complete appointment"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteAppointment(appointment._id)}
                        className="text-red-600 hover:text-red-800 focus:outline-none"
                        aria-label="Delete appointment"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                  <td className="border-t border-gray-200 px-4 py-2 text-gray-800">
                    {/* Display the image */}
                    {appointment.file ? (
                      <img
                        src={appointment.file}
                        alt="Appointment"
                        className="w-12 h-12 object-cover cursor-pointer"
                        onClick={() => handleImageClick(appointment.file)}
                      />
                    ) : (
                      <span>بدون تصویر</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for larger image view */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
            <img
              src={selectedImage}
              alt="Appointment"
              className="w-full h-auto rounded-lg"
            />
            <div className="flex justify-between items-center mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = selectedImage;
                  link.download = "appointment-image.png";
                  link.click();
                }}
              >
                دانلود تصویر
              </button>
              <button className="text-red-500 font-bold" onClick={closeModal}>
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-900">
          {isEditing ? "ویرایش بازه زمانی" : "اضافه کردن نوبت ها"}
        </h3>
        <div className="flex">
          <div className="flex flex-col max-h-96 overflow-y-auto scrollbar-thin">
            {getAvailableTimeSlots().map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => toggleTimeSlot(time)}
                className={`inline-block px-16 py-4 my-2 ml-2 rounded-md text-sm font-semibold ${
                  selectedTimeSlots.includes(time)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                } hover:bg-blue-600 transition`}
              >
                {time}
              </button>
            ))}
          </div>
          <div className="mr-2">
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              colorPrimary="#1A73E8"
              shouldHighlightWeekends
              locale="fa"
              minimumDate={getShamsiToday()}
              maximumDate={getShamsiNext30Days()}
            />
          </div>
        </div>

        <button
          onClick={addOrUpdateSlot}
          className="mt-4 bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {isEditing ? "بروزرسانی بازه زمانی" : "اضافه کردن بازه زمانی"}
        </button>
        <p className="text-red-500 mt-4">{message}</p>
      </div>

      <div className="mb-8 bg-white">
        <h3 className="text-2xl font-semibold mb-6 flex items-center text-gray-900">
          <ClipboardList className="ml-2 text-blue-600" /> بازه‌های زمانی موجود
        </h3>
        {slots.length === 0 ? (
          <p className="text-gray-600 text-center py-4">
            هیچ بازه زمانی موجود نیست
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                    تاریخ
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                    بازه‌های زمانی
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                    عمل
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {slots.map((slot) => (
                  <tr
                    key={slot._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm">{slot.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {slot.timeSlots.map((timeSlot) => (
                          <span
                            key={timeSlot.time}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              timeSlot.isAvailable
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {timeSlot.time}
                            <button
                              onClick={() => deleteTimeSlot(slot, timeSlot)}
                              className={`text-red-600 hover:text-red-800 `}
                            >
                              <XCircle className="w-4 h-4 mr-2 ml-1" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => removeDay(slot)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
