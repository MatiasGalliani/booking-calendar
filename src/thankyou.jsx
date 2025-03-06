import React from "react";
import logo from "./assets/LOGO-CREDITPLAN.png";

function ThankYou() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <header className="mb-8">
        <img src={logo} alt="Logo CreditPlan" className="w-56" />
      </header>
      <main className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Grazie per la tua prenotazione!
        </h1>
        <p className="text-lg text-gray-700">
          Apprezziamo la tua fiducia. Siamo pronti ad assisterti e non vediamo l'ora di accoglierti.
        </p>
      </main>
    </div>
  );
}

export default ThankYou;
