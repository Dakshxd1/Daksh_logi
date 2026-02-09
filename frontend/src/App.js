import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Items from "./pages/Items";
import Billing from "./pages/Billing";
import Master from "./pages/Master";
import CreateInvoice from "./pages/CreateInvoice";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/master" element={<Master />} />   {/* 🔥 THIS WAS MISSING */}
        <Route path="/customers" element={<Customers />} />
        <Route path="/items" element={<Items />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/create-invoice" element={<CreateInvoice />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
