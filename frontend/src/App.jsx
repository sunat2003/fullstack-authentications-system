import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from './pages/Signup';
import Dashboard from './pages/Dasboard';
import NotFound from "./pages/NotFound";
import ProtectedRoute from './components/PrivateRoute';
import ChangePassword from './pages/ChangePassword';
import SuccessPage from './pages/SuccessPage';
import ForgotPasswordForm from './pages/ForgotPasswordForm';
import VerifyOtpForm from "./pages/VerifyOtpForm";
import ResetPasswordForm from "./pages/ResetPasswordForm";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/verify-otp" element={<VerifyOtpForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/oauth2/success" element={<SuccessPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="/change-password" element={<ChangePassword/>}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
