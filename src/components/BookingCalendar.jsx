import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isBefore,
  isToday,
} from "date-fns";
import { it } from "date-fns/locale";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function BookingCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [changingMonth, setChangingMonth] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  const today = new Date();
  const nextMonthLimit = addMonths(today, 1);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const giorniSettimana = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
  // Ejemplo de días siempre no disponibles (por ejemplo, fechas específicas)
  const unavailableDays = [5, 10, 15, 20, 25];

  // Al seleccionar una fecha se consulta el backend para obtener los horarios disponibles (en intervalos de 30 minutos)
  useEffect(() => {
    if (selectedDate) {
      fetch(`http://localhost:5000/availability?date=${selectedDate.toISOString()}`)
        .then((res) => res.json())
        .then((data) => {
          // Se espera que el backend retorne un array con horarios en formato "HH:mm" (e.g., "09:00", "09:30", etc.)
          setAvailableTimes(data.availableTimes || []);
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
    // Se permite seleccionar la fecha solo si no es pasada y no se encuentra en unavailableDays.
    if (!isBefore(day, today) && !unavailableDays.includes(parseInt(format(day, "d")))) {
      setSelectedDate(day);
      setSelectedTime(null);
      setShowForm(false); // Reinicia el formulario al seleccionar otra fecha
    }
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (selectedTime) setShowForm(true);
  };

  // Envío del formulario de reserva al backend.
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { nome, cognome, email } = e.target;
    const bookingData = {
      name: `${nome.value} ${cognome.value}`,
      email: email.value,
      date: selectedDate,
      time: selectedTime,
    };

    try {
      const response = await fetch("http://localhost:5000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingData,
          date: new Date(bookingData.date).toISOString(),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Se remueve el horario reservado de los horarios disponibles
        setAvailableTimes(availableTimes.filter((time) => time !== selectedTime));
        navigate("/thankyou");
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center mt-8">
      {!showForm && (
        <>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Seleziona una data per il tuo appuntamento
          </h2>
          <div className="flex justify-between items-center w-80 mb-4">
            <button
              onClick={prevMonth}
              disabled={format(currentMonth, "yyyy-MM") === format(today, "yyyy-MM")}
              className={`text-gray-700 hover:text-black transition ${
                format(currentMonth, "yyyy-MM") === format(today, "yyyy-MM")
                  ? "text-gray-400 cursor-not-allowed"
                  : ""
              }`}
            >
              <FiChevronLeft size={24} />
            </button>
            <h2 className="text-lg font-medium capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: it })}
            </h2>
            <button
              onClick={nextMonth}
              disabled={format(currentMonth, "yyyy-MM") === format(nextMonthLimit, "yyyy-MM")}
              className={`text-gray-700 hover:text-black transition ${
                format(currentMonth, "yyyy-MM") === format(nextMonthLimit, "yyyy-MM")
                  ? "text-gray-400 cursor-not-allowed"
                  : ""
              }`}
            >
              <FiChevronRight size={24} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2 w-80 text-center font-medium mb-2">
            {giorniSettimana.map((giorno, index) => (
              <span key={index} className="text-gray-700">
                {giorno}
              </span>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {!changingMonth && (
              <motion.div
                key={currentMonth}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="grid grid-cols-7 gap-2 w-80"
              >
                {daysInMonth.map((day) => {
                  const formattedDay = format(day, "d");
                  const isUnavailable = unavailableDays.includes(parseInt(formattedDay));
                  const isPast = isBefore(day, today);

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      disabled={isPast || isUnavailable}
                      className={`p-2 w-10 h-10 text-center rounded-full border ${
                        isPast
                          ? "text-gray-400 cursor-not-allowed border-transparent"
                          : isUnavailable
                          ? "bg-gray-300 text-gray-600 border-gray-400 cursor-not-allowed"
                          : isToday(day)
                          ? "bg-green-500 text-white border-transparent"
                          : selectedDate && format(selectedDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
                          ? "bg-blue-600 text-white border-transparent"
                          : "hover:bg-gray-200 border-transparent"
                      }`}
                    >
                      {formattedDay}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {selectedDate && availableTimes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mt-4 text-center"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  Seleziona un orario disponibile
                </h3>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeClick(time)}
                      className={`p-2 w-16 h-10 text-center rounded-full border transition-all ${
                        selectedTime === time
                          ? "bg-gray-600 text-white border-transparent"
                          : "border-gray-400 hover:bg-gray-200"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleConfirm}
                  className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-800 transition"
                >
                  Conferma appuntamento
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-4 w-80 text-center"
          >
            <div className="flex justify-start mb-2">
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-700 hover:text-black transition"
              >
                <FiChevronLeft size={24} />
              </button>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Inserisci i tuoi dati
            </h3>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                className="p-2 border rounded text-center"
                required
              />
              <input
                type="text"
                name="cognome"
                placeholder="Cognome"
                className="p-2 border rounded text-center"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="p-2 border rounded text-center"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-800 transition"
              >
                Invia
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BookingCalendar;
