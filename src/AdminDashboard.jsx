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
import {
  FiChevronRight,
  FiChevronLeft,
  FiPlus,
  FiMenu,
  FiX,
  FiPower,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./assets/LOGO-CREDITPLAN.png";
import { useNavigate } from "react-router-dom";

const API_URL = "https://backend-calendar-f4ag.onrender.com";

function AdminDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  // Inicializamos en marzo 2025 (mes index 2) y definimos abril como máximo
  const initialMonth = new Date(2025, 2, 1);
  const maxMonth = addMonths(initialMonth, 1); // abril 2025
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);

  const today = new Date();

  // Días de la semana en italiano (la semana comienza en lunes)
  const giorniSettimana = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  // Helper para generar el arreglo de días con espacios en blanco al inicio
  const getCalendarDays = (month) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });
    // getDay(): 0 = domingo, 1 = lunes, etc. Queremos que lunes sea 0
    const firstDay = start.getDay();
    const offset = (firstDay === 0 ? 7 : firstDay) - 1;
    const blanks = Array.from({ length: offset }, () => null);
    return [...blanks, ...days];
  };

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      fetch(`${API_URL}/availability?date=${formattedDate}&view=admin`)
        .then((res) => res.json())
        .then((data) => setTimeSlots(data.timeSlots || []))
        .catch((error) => console.error("Error fetching availability:", error));
    }
  }, [selectedDate]);

  const handleDateClick = (day) => {
    if (day && !isBefore(day, today)) {
      setSelectedDate(day);
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

  const handleSaveAvailability = async () => {
    if (!selectedDate || timeSlots.length === 0) {
      alert("Seleziona una data e aggiungi almeno un orario.");
      return;
    }

    const dateISO = format(selectedDate, "yyyy-MM-dd");

    try {
      const response = await fetch(`${API_URL}/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateISO, timeSlots }),
      });

      if (!response.ok) {
        throw new Error("Errore nel salvataggio della disponibilità.");
      }
      alert("Disponibilità salvata con successo!");
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  // Se deshabilita la flecha izquierda si ya estamos en marzo 2025
  const isPrevDisabled =
    format(currentMonth, "yyyy-MM") === format(initialMonth, "yyyy-MM");
  // La flecha derecha se deshabilita si ya estamos en abril 2025
  const isNextDisabled =
    format(currentMonth, "yyyy-MM") === format(maxMonth, "yyyy-MM");

  const handlePrev = () => {
    if (!isPrevDisabled) {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
  };

  const handleNext = () => {
    if (!isNextDisabled) {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Sidebar para escritorio */}
      <aside className="hidden md:flex flex-col w-72 h-auto min-h-[calc(100%-160px)] mt-20 bg-gray-100 rounded-tr-lg absolute bottom-0 items-center justify-start pt-8 space-y-6 pl-0 pr-8">
        <a href="#" className="text-gray-700 text-xl font-medium">
          Disponibilità
        </a>
        <a href="#" className="text-gray-700 text-xl font-medium">
          Profilo
        </a>
        <a href="#" className="text-gray-700 text-xl font-medium">
          Appuntamenti
        </a>
      </aside>

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col items-center">
        {/* Navbar */}
        <div className="flex items-center justify-between px-6 py-4 w-full">
          <button className="md:hidden text-2xl" onClick={() => setMenuOpen(true)}>
            <FiMenu />
          </button>
          <div className="flex items-center">
            <img src={logo} className="w-56 md:ml-3 md:mt-6 mt-4" alt="logo" />
            <span className="hidden md:block text-3xl font-semibold ml-12 mt-5">
              Gestore Calendario
            </span>
          </div>
          <button
            onClick={() => navigate("/loginadmin")}
            className="text-red-600 text-3xl hover:text-red-800 transition"
          >
            <FiPower />
          </button>
        </div>

        {/* Menú lateral en móviles */}
        {menuOpen && (
          <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 transition-all duration-300">
            <button className="absolute top-6 right-6 text-2xl" onClick={() => setMenuOpen(false)}>
              <FiX />
            </button>
            <a href="#" className="text-gray-700 text-xl font-medium">
              Disponibilità
            </a>
          </div>
        )}

        <h2 className="text-2xl font-semibold mt-20 mb-8 text-gray-800">
          La tua disponibilità
        </h2>

        {/* Contenedor para calendario y panel de intervalos */}
        <div className="flex flex-col md:flex-row justify-center items-start gap-8 md:pl-8">
          {/* Calendario */}
          <div className="flex flex-col transition-all duration-300">
            {/* Vista de escritorio: calendario con flechas */}
            <div className="hidden md:block">
              <div className="flex items-center justify-center mb-4">
                <button onClick={handlePrev} disabled={isPrevDisabled}>
                  <FiChevronLeft className={`${isPrevDisabled ? "text-gray-400" : "text-black"} text-2xl`} />
                </button>
                <span className="mx-4 text-xl font-medium">
                  {format(currentMonth, "MMMM yyyy", { locale: it })}
                </span>
                <button onClick={handleNext} disabled={isNextDisabled}>
                  <FiChevronRight className={`${isNextDisabled ? "text-gray-400" : "text-black"} text-2xl`} />
                </button>
              </div>
              {/* Encabezado de días */}
              <div className="grid grid-cols-7 gap-2 w-80 text-center font-medium mb-2">
                {giorniSettimana.map((giorno, index) => (
                  <span key={index} className="text-gray-700">
                    {giorno}
                  </span>
                ))}
              </div>
              {/* Cuadrícula de días con espacios en blanco */}
              <div className="grid grid-cols-7 gap-2 w-80 mb-6">
                {getCalendarDays(currentMonth).map((day, index) =>
                  day ? (
                    <button
                      key={index}
                      onClick={() => handleDateClick(day)}
                      disabled={isBefore(day, today)}
                      className={`p-2 w-10 h-10 text-center rounded-full border transition-all ${isBefore(day, today)
                        ? "text-gray-400 cursor-not-allowed border-transparent"
                        : selectedDate &&
                          format(selectedDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
                          ? "bg-blue-600 text-white border-transparent"
                          : "hover:bg-gray-200 border-transparent"
                        }`}
                    >
                      {format(day, "d")}
                    </button>
                  ) : (
                    <div key={index} className="p-2 w-10 h-10" />
                  )
                )}
              </div>
            </div>

            {/* Vista de móvil: calendario sin flechas */}
            <div className="block md:hidden">
              {/* Encabezado de días */}
              <div className="grid grid-cols-7 gap-2 w-80 text-center font-medium mb-2">
                {giorniSettimana.map((giorno, index) => (
                  <span key={index} className="text-gray-700">
                    {giorno}
                  </span>
                ))}
              </div>
              {/* Cuadrícula de días */}
              <div className="grid grid-cols-7 gap-2 w-80 mb-6">
                {getCalendarDays(currentMonth).map((day, index) =>
                  day ? (
                    <button
                      key={index}
                      onClick={() => handleDateClick(day)}
                      disabled={isBefore(day, today)}
                      className={`p-2 w-10 h-10 text-center rounded-full border transition-all ${isBefore(day, today)
                        ? "text-gray-400 cursor-not-allowed border-transparent"
                        : selectedDate &&
                          format(selectedDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
                          ? "bg-blue-600 text-white border-transparent"
                          : "hover:bg-gray-200 border-transparent"
                        }`}
                    >
                      {format(day, "d")}
                    </button>
                  ) : (
                    <div key={index} className="p-2 w-10 h-10" />
                  )
                )}
              </div>
            </div>
          </div>

          {/* Panel de intervalos (a la derecha en escritorio, debajo en móvil) */}
          <AnimatePresence>
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-80"
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
                  className="mt-4 mb-6 md:mb-12 bg-green-600 text-white px-4 py-2 rounded"
                >
                  Salva Disponibilità
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
