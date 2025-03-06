import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/LOGO-CREDITPLAN.png";

function LoginAdmin() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Por ahora, se ignoran los valores de los inputs y se redirige a /admin
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8">
        <div className="mb-6 flex justify-center">
          <img src={logo} alt="CreditPlan Logo" className="w-56" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Login Agenti Calendar
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Accedi
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginAdmin;
