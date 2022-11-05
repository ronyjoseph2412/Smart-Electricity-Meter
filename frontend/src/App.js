import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WalletState from "./context/walletState/WalletState";
import Navbar from "./components/Navbar";
import Registration from "./components/Registration";
import Payments from "./components/Payments";
import PaymentHistory from "./components/PaymentHistory";
import Home from "./components/Home";

function App() {
  return (
    <div className="select-none">
      <WalletState>
      <Router>
        <Navbar />
        <Routes>

          <Route path="/" element={<><Home /></>} />
          <Route path="/registration" element={<><Registration /></>} />
          <Route path="/payments" element={<><Payments /></>} />
          <Route path="/payment-history" element={<><PaymentHistory /></>} />

        </Routes>
      </Router>
      </WalletState>
    </div>
  );
}

export default App;
