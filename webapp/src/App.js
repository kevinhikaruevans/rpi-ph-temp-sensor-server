import logo from './logo.svg';
import './App.css';
import HeaderBar from './components/HeaderBar';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DevicesPage from './pages/devices/DevicesPage';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <HeaderBar />
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/devices" element={<DevicesPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
