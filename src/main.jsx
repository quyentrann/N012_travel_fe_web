import { useEffect } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import viVN from 'antd/locale/vi_VN';
import { ConfigProvider } from 'antd';
import { Provider } from "react-redux";
import {store} from "./redux/store.js";
import { useLocation } from "react-router-dom";
import {
  Webchat,
  WebchatProvider,
  Fab,
  getClient
} from '@botpress/webchat';

function BotpressChat() {
  useEffect(() => {
    const excludedPaths = ["/login", "/register", "/forgot-password"];

    if (excludedPaths.includes(window.location.pathname)) return;

    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v2.4/inject.js";
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://files.bpcontent.cloud/2025/04/06/17/20250406174729-7C6DVJIU.js";
    script2.async = true;
    document.body.appendChild(script2);

    script1.onload = () => {
      window.botpressWebChat.init({
        botId: "b33b4f5b-8a1b-4e6b-a1f8-4c7b9e8d3c2e",
        host: "https://cdn.botpress.cloud/webchat/v2.4",
        clientId: "e4c60808-83fd-484a-8833-2c29bfcee1e4",
        botName: "Travel TADA Assistant",
        showUserAvatar: true,
        enableConversationDeletion: true,
        closeOnEscape: true
      });

      const originalReset = window.botpressWebChat.resetConversation;
      window.botpressWebChat.resetConversation = function () {
        originalReset();
        setTimeout(() => {
          window.botpressWebChat.sendPayload({
            type: "text",
            text: "hi"
          });
        }, 2000);
      };
    };
  }, []);

  return null;
}




createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter >
        <ConfigProvider locale={viVN}>
          <App />
          {/* <BotpressChat /> */}
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
