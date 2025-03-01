import { Route, Router, Routes } from "react-router-dom";
import Admin from "../pages/admin/index";
import User from "../pages/user/index";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<User />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
