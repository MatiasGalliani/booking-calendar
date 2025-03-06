import BookingCalendar from "./components/BookingCalendar";
import picturenico from "./assets/foto-ejemplo-agente.png";
import logo from "./assets/LOGO-CREDITPLAN.png"; // Importamos el logo

function Booking() {
    return (
        <div className="w-full min-h-screen">
            {/* 📌 Logo - Alineado a la izquierda en pantallas grandes, centrado en móviles, con más margen inferior */}
            <header className="flex md:justify-start justify-center mt-10 md:ml-12 mb-8">
                <h1>
                    <img src={logo} className="w-56" alt="logo" />
                </h1>
            </header>

            {/* 📌 Contenedor principal con dos columnas */}
            <div className="flex flex-col md:flex-row w-full items-center justify-center mt-6 md:gap-6">
                {/* 📌 Columna izquierda - Tarjeta del agente */}
                <div className="w-full md:w-[47%] flex justify-center md:justify-end items-center px-5">
                    <AgentCard name="Nico Falcinelli" picture={picturenico} />
                </div>

                {/* 📌 Columna derecha - Calendario */}
                <div className="w-full md:w-[47%] flex justify-center md:justify-start items-center px-5 mb-12 md:mb-0">
                    <BookingCalendar />
                </div>
            </div>
        </div>
    );
}

export function AgentCard({ name, picture }) {
    return (
        <article className="bg-gray-200 rounded-lg w-96 p-7 flex flex-col justify-center items-center shadow-xl">
            <img src={picture} alt="picture" className="w-40" />
            <h4 className="mt-6 text-center font-semibold text-3xl">{name}</h4>
            <p className="text-center text-lg mt-3 font-light">
                Nico Falcinelli è un mediatore creditizio con oltre <strong>30 anni di esperienza nel settore.</strong>
            </p>
            <p className="text-center mt-3 text-lg font-light">
                Ha aiutato migliaia di clienti a trovare il prestito giusto per le loro esigenze.
            </p>
            <p className="text-center mt-3 text-lg font-light">
                <strong>Contattalo subito per una consulenza gratuita!</strong>
            </p>
        </article>
    );
}

export default Booking;
