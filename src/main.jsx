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

// function BotpressChat() {
//   useEffect(() => {
//     const script1 = document.createElement("script");
//     script1.src = "https://cdn.botpress.cloud/webchat/v2.3/inject.js";
//     script1.async = true;
//     document.body.appendChild(script1);

//     const script2 = document.createElement("script");
//     script2.src = "https://files.bpcontent.cloud/2025/04/06/17/20250406174729-7C6DVJIU.js";
//     script2.async = true;
//     document.body.appendChild(script2);

//     script1.onload = () => {
//       window.botpressWebChat.init({
//         botId: "YOUR_BOT_ID",
//         host: "https://cdn.botpress.cloud/webchat/v2",
//         clientId: "YOUR_CLIENT_ID",
//         botName: "Travel TADA Assistant",
//         showUserAvatar: true,
//         enableConversationDeletion: true,
//         closeOnEscape: true
//       });

//       // Ghi đè lại nút restart conversation
//       const originalReset = window.botpressWebChat.resetConversation;
//       window.botpressWebChat.resetConversation = function () {
//         originalReset(); // Gọi hàm reset gốc của bot

//         setTimeout(() => {
//           // Gửi "hi" với tư cách khách hàng ngay sau khi reset
//           window.botpressWebChat.sendPayload({
//             type: "text",
//             text: "hi"
//           });
//         }, 2000); // Chờ 2 giây để chatbox reset hoàn toàn rồi mới gửi
//       };
//     };
//   }, []);

//   return null;
// }



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
