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
import BookingDetail from "../pages/bookingDetail/bookingDetail";
import CardChatBotPress from "../pages/CardChatBotPress/cardChatBotPress";
import LocationTour from "../pages/LocationTour/locationTour";
import PriceTour from "../pages/PricePage/priceTour";
import About from "../pages/About/about";
import SearchPage from "../pages/SearchPage/SearchPage";
import Recommended from "../pages/Recommended/recommended";
import PaymentResult from "../pages/paymentPage/paymentPage";
import FavouriteTours from "../pages/FavouriteTours/FavouriteTours";
import HomeBar from "../pages/homebar/homebar"
import VnpayReturn from '../pages/paymentPage/paymentPage'
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomeBar />} />
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
      <Route path="/search" element={<SearchPage />} />
      <Route path="/recommended" element={<Recommended />} />
      <Route path="/payment-result" element={<PaymentResult />} />
      <Route path="/favourite-tours" element={<FavouriteTours />} />
      <Route path="/vnpay-return" element={<VnpayReturn />} />
    </Routes>
  );
}
