import { Route, Routes } from "react-router-dom";
import Login from "../pages/login/login";
import Register from "../pages/register/register";
import ForgotPassword from "../pages/forgotPassword/forgotPassWord"
import Home from "../pages/home/home"
import TourDetail from '../pages/tourDetail/tourDetail'
import ItemTourBookingDetail from "../components/ItemTourBookingDetail";
import UserInfo from "../pages/userInfo/userInfo";
import Orders from "../pages/orders/orders";
import BestForYouBagTour from "../pages/BestForYouBagTour/BestForYouBagTour";
import BookingDetail from "../pages/bookingDetail/BookingDetail";
import CardChatBotPress from "../pages/CardChatBotPress/cardChatBotPress";
import LocationTour from "../pages/LocationTour/locationTour";
import PriceTour from "../pages/PricePage/priceTour";
import About from "../pages/About/about";
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<UserInfo />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/tour-detail" element={<TourDetail />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/tour-booking" element={<ItemTourBookingDetail />} />
      <Route path="/bestforyou" element={<BestForYouBagTour />} />
      <Route path="/booking-detail" element={<BookingDetail />} />
      <Route path="/cardChatBotpress" element={<CardChatBotPress />} />
      <Route path="/locationtour" element={<LocationTour />} />
      <Route path="/pricetour" element={<PriceTour />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}
