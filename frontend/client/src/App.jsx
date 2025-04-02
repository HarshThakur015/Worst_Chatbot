import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landhome";
import ChatPage from "./pages/chatpage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import UserManagement from "./pages/UserManagement";

export default function App() { // ✅ Ensure 'export default' is here
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/users" element={<UserManagement />} />
    </Routes>
  );
}
