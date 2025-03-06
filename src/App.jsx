import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import logo from "./assets/LOGO-CREDITPLAN.png";
import picturenico from "./assets/foto-ejemplo-agente.png";
import Booking from "./booking"; // Importamos la nueva página
import ThankYou from "./thankyou"; // Importamos la nueva página
import LoginAdmin from "./LoginAdmin";
import AdminDashboard from "./AdminDashboard";

function App() {
  return (
    <Router basename="/booking-calendar"> {/* 👈 Aquí agregamos basename */}
      <Routes>
        {/* Página de inicio */}
        <Route
          path="/"
          element={
            <div>
              {/* Logo - Alineado a la izquierda en pantallas grandes, centrado en móviles */}
              <header className="flex md:justify-start justify-center mt-10 md:ml-12">
                <h1>
                  <img src={logo} className="w-56" alt="logo" />
                </h1>
              </header>

              {/* Título y Subtítulo - Solo en la Home */}
              <Title />
              <SubTitle />

              {/* Tarjetas de agentes */}
              <div className="flex justify-center items-center flex-wrap gap-12 p-10">
                <AgentCard name={"Nico Falcinelli"} picture={picturenico} agentlink={"/booking"} />
              </div>
            </div>
          }
        />

        {/* Página de Booking */}
        <Route path="/booking" element={<Booking />} />

        {/* Página de Agradecimiento */}
        <Route path="/thankyou" element={<ThankYou />} />

        {/* Página de Login de Admin */}
        <Route path="/loginadmin" element={<LoginAdmin />} />

        {/* Página de Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export function Title() {
  return <h2 className="text-3xl font-medium text-center text-gray-800 mt-6">Recruitment Team</h2>;
}

export function SubTitle() {
  return <h3 className="flex justify-center mt-6 mb-8 text-xl font-medium">Scegli uno degli agenti disponibili:</h3>;
}

export function AgentCard({ name, picture, agentlink }) {
  return (
    <article className="bg-gray-200 rounded-lg w-80 p-6 flex flex-col justify-center items-center shadow-xl">
      <img src={picture} alt="picture" className="w-40" />
      <h4 className="mt-6 text-2xl font-medium">{name}</h4>
      <a
        href={agentlink}
        className="mt-5 inline-block bg-blue-600 text-white px-10 py-3 rounded-xl hover:bg-blue-950 text-lg font-medium"
      >
        Prenota
      </a>
    </article>
  );
}

export default App;
