import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import "./App.css";
import Dashboard from "./components/Dashboard";
import UserAuth from "./components/UserAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserAuth toast={toast} />} />
        <Route path="/dashboard" element={<Dashboard toast={toast}/>}/>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
