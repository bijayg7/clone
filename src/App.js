import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Password from "./pages/Password";
import Admin from './pages/Admin';
import ForgotPassword from './pages/ForogtPassword';
import VerifyCode from './pages/VerifyCode';
import ChangePassword from './pages/ChangePassword';
import './App.css';

function App() {
  return (
     <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/password" element={<Password />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
    </Router>
  );
}

export default App;
