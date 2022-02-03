import logo from './logo.svg';
import './App.css';
import HeaderBar from './components/HeaderBar';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DevicesPage from './pages/devices/DevicesPage';
import DeviceHistoryPage from './pages/devices/DeviceHistoryPage';
import { Container } from '@mui/material';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <HeaderBar />
        <Container>
          <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="/devices" element={<DevicesPage />} exact />
            <Route path="/devices/:device_id" element={<DeviceHistoryPage />} exact/>
          </Routes>
        </Container>
      </BrowserRouter>  
    </div>
  );
}

export default App;
