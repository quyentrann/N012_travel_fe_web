import { Route, Routes } from "react-router-dom";
import Login from "../pages/login/login";
import Register from "../pages/register/register";
import ForgotPassword from "../pages/forgotPassword/forgotPassWord"
import Home from "../pages/home/home"
import ItemCradComponent from "../components/ItemCradComponent"

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<ItemCradComponent />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}
