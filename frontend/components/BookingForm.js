"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar } from "react-modern-calendar-datepicker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";

const BookingForm = ({ title }) => {
  console.log(title);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    selectedDate: null,
    selectedTime: "",
    file: null,
  });
  const [availableTimes, setAvailableTimes] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  const isValidPhoneNumber = (phoneNumber) => {
    const phonePattern = /^(\+98|0)?9\d{9}$/;
    return phonePattern.test(phoneNumber);
  };

  useEffect(() => {
    if (formData.selectedDate) {
      fetchAvailableTimes();
    }
  }, [formData.selectedDate]);

  const fetchAvailableTimes = async () => {
    try {
      const { year, month, day } = formData.selectedDate;
      const formattedDate = `${year}-${month}-${day}`;
      const response = await axios.get(
        `http://localhost:5000/api/slots/${formattedDate}`
      );
      setAvailableTimes(response.data.timeSlots);
    } catch (error) {
      console.error("Error fetching available times:", error);
      setAvailableTimes([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, file: e.target.files[0] }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({ ...prevData, selectedDate: date }));
  };

  const handleTimeSelection = (time) => {
    setFormData((prevData) => ({ ...prevData, selectedTime: time }));
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, phoneNumber, selectedDate, selectedTime, file } =
      formData;

    if (!selectedTime) {
      setMessage({ text: "لطفا یک زمان را انتخاب کنید.", type: "error" });
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setMessage({ text: "شماره تماس نامعتبر است.", type: "error" });
      return;
    }

    const formattedDate = selectedDate
      ? `${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`
      : null;

    let fileBase64 = "";
    if (file) {
      fileBase64 = await toBase64(file); // Convert file to base64 if present
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/appointments/book",
        {
          fullName,
          mobile: phoneNumber,
          date: formattedDate,
          timeSlot: selectedTime,
          file: fileBase64, // Send base64 file
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessage({
        text: `رزرو شما با موفقیت تایید شد. ${response.data.appointment.fullName}، شما تاریخ ${formattedDate} ساعت ${selectedTime} را رزرو کرده‌اید.`,
        type: "success",
      });

      setFormData({
        fullName: "",
        phoneNumber: "",
        selectedDate: null,
        selectedTime: "",
        file: null,
      });
      setAvailableTimes([]);
    } catch (error) {
      setMessage({
        text: "خطا در رزرو. لطفا دوباره تلاش کنید.",
        type: "error",
      });
      console.error(error);
    }
  };

  return (
    <div
      dir="rtl"
      className="flex justify-center items-center min-h-screen my-5"
    >
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded">
        <h2 className="text-center text-4xl font-bold text-gray-800 mb-8">
          رزرو نوبت
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="نام کامل"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="نام خود را وارد کنید"
          />
          <InputField
            label="شماره تماس"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="شماره تماس خود را وارد کنید"
            type="tel"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاریخ را انتخاب کنید
            </label>
            <div className="w-full">
              <Calendar
                value={formData.selectedDate}
                onChange={handleDateChange}
                shouldHighlightWeekends
                locale="fa"
                colorPrimary="#4F46E5"
                calendarClassName="responsive-calendar"
              />
            </div>
          </div>
          {formData.selectedDate && (
            <TimeSlots
              availableTimes={availableTimes}
              selectedTime={formData.selectedTime}
              onTimeSelect={handleTimeSelection}
            />
          )}
          <InputField
            label="آپلود فایل"
            name="file"
            type="file"
            onChange={handleFileChange}
          />
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition ease-in-out duration-300 transform hover:scale-105"
          >
            تایید رزرو
          </button>
        </form>
        {message.text && (
          <p
            className={`mt-6 text-center font-medium ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div>
    <label className="block text-md font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={type !== "file"}
      className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out text-gray-900"
      placeholder={placeholder}
    />
  </div>
);

const TimeSlots = ({ availableTimes, selectedTime, onTimeSelect }) => {
  console.log(availableTimes);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        زمان را انتخاب کنید
      </label>
      <div className="grid grid-cols-3 gap-2">
        {availableTimes.length > 0 ? (
          availableTimes
            .filter((item) => item.isAvailable)
            .map((item) => (
              <button
                key={item._id || item.time}
                type="button"
                onClick={() => onTimeSelect(item.time)}
                className={`px-4 py-2 rounded-md transition duration-150 ease-in-out ${
                  selectedTime === item.time
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {item.time}
              </button>
            ))
        ) : (
          <p className="col-span-3 text-red-500 text-center">
            هیچ زمانی در دسترس نیست
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
