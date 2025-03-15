import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import frFR from 'antd/locale/vi_VN'
import {ConfigProvider} from 'antd'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider locale={frFR}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>
);
