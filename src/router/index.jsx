import { Route, Routes } from "react-router-dom";
import Login from "../pages/login/login";
import Register from "../pages/register/register";
import ForgotPassword from "../pages/forgotPassword/forgotPassWord"
import Home from "../pages/home/home"
import TourDetail from '../pages/tourDetail/tourDetail'
import ItemTourBookingDetail from "../components/ItemTourBookingDetail";
import UserInfo from "../pages/userInfo/userInfo";
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<UserInfo />} />
      <Route path="/tour-detail" element={<TourDetail />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/tour-booking" element={<ItemTourBookingDetail />} />
    </Routes>
  );
}
