import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isBefore,
} from "date-fns";
import { it } from "date-fns/locale";
import { FiChevronRight, FiChevronLeft, FiPlus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./assets/LOGO-CREDITPLAN.png";

function AdminDashboard() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  // timeSlots will be an array of objects: { from: "HH:MM", to: "HH:MM" }
  const [timeSlots, setTimeSlots] = useState([]);
  const [changingMonth, setChangingMonth] = useState(false);

  const today = new Date();
  const nextMonthLimit = addMonths(today, 1);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const giorniSettimana = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  // When a date is selected, fetch current availability (time slots) from the backend.
  useEffect(() => {
    if (selectedDate) {
      fetch(`http://localhost:5000/availability?date=${selectedDate.toISOString()}`)
        .then((res) => res.json())
        .then((data) => {
          // Assume the backend returns an object with a key "timeSlots" containing an array of intervals
          setTimeSlots(data.timeSlots || []);
        })
        .catch((error) => {
          console.error("Error fetching availability:", error);
        });
    }
  }, [selectedDate]);

  const nextMonth = () => {
    if (currentMonth < nextMonthLimit) {
      setChangingMonth(true);
      setTimeout(() => {
        setCurrentMonth(addMonths(currentMonth, 1));
        setChangingMonth(false);
      }, 300);
    }
  };

  const prevMonth = () => {
    if (format(currentMonth, "yyyy-MM") !== format(today, "yyyy-MM")) {
      setChangingMonth(true);
      setTimeout(() => {
        setCurrentMonth(subMonths(currentMonth, 1));
        setChangingMonth(false);
      }, 300);
    }
  };

  const handleDateClick = (day) => {
    if (!isBefore(day, today)) {
      setSelectedDate(day);
      // Clear time slots when a new date is selected.
      setTimeSlots([]);
    }
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { from: "", to: "" }]);
  };

  const handleTimeChange = (index, field, value) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[index][field] = value;
    setTimeSlots(updatedSlots);
  };

  // Save the availability for the selected date by sending the new time slots to the backend.
  const handleSaveAvailability = async () => {
    if (!selectedDate || timeSlots.length === 0) {
      alert("Please select a date and add at least one time slot.");
      return;
    }
    const dateISO = selectedDate.toISOString();
    try {
      const response = await fetch("http://localhost:5000/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateISO, timeSlots }),
      });
      if (!response.ok) {
        throw new Error("Failed to update availability");
      }
      alert("Availability updated successfully!");
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6">
      {/* Logo Header */}
      <header className="mb-6 flex justify-center">
        <img src={logo} className="w-56" alt="CreditPlan Logo" />
      </header>

      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Seleziona una data per impostare la disponibilità
      </h2>
      <div className="flex justify-between items-center w-80 mb-4">
        <button
          onClick={prevMonth}
          disabled={format(currentMonth, "yyyy-MM") === format(today, "yyyy-MM")}
          className="text-gray-700 hover:text-black transition disabled:text-gray-400"
        >
          <FiChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-medium capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: it })}
        </h2>
        <button
          onClick={nextMonth}
          disabled={format(currentMonth, "yyyy-MM") === format(nextMonthLimit, "yyyy-MM")}
          className="text-gray-700 hover:text-black transition disabled:text-gray-400"
        >
          <FiChevronRight size={24} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 w-80 text-center font-medium mb-2">
        {giorniSettimana.map((giorno, index) => (
          <span key={index} className="text-gray-700">{giorno}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 w-80">
        {daysInMonth.map((day) => (
          <button
            key={day}
            onClick={() => handleDateClick(day)}
            disabled={isBefore(day, today)}
            className={`p-2 w-10 h-10 text-center rounded-full border transition-all ${
              isBefore(day, today)
                ? "text-gray-400 cursor-not-allowed border-transparent"
                : selectedDate && format(selectedDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
                ? "bg-blue-600 text-white border-transparent"
                : "hover:bg-gray-200 border-transparent"
            }`}
          >
            {format(day, "d")}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-6 w-80"
          >
            <h3 className="text-lg font-medium text-gray-800 mb-2 text-center">
              Imposta gli orari disponibili
            </h3>
            {timeSlots.map((slot, index) => (
              <div key={index} className="flex gap-2 items-center mb-2">
                <input
                  type="time"
                  value={slot.from}
                  onChange={(e) => handleTimeChange(index, "from", e.target.value)}
                  className="p-2 border rounded w-1/2 text-center appearance-none"
                  required
                />
                <span>-</span>
                <input
                  type="time"
                  value={slot.to}
                  onChange={(e) => handleTimeChange(index, "to", e.target.value)}
                  className="p-2 border rounded w-1/2 text-center appearance-none"
                  required
                />
              </div>
            ))}
            <button
              onClick={addTimeSlot}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition mt-2"
            >
              <FiPlus /> Aggiungi intervallo
            </button>
            <button
              onClick={handleSaveAvailability}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              Salva Disponibilità
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminDashboard;
