import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, useLocation } from 'react-router-dom';
import viVN from 'antd/locale/vi_VN';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';

// ✅ Component nhúng Botpress Webchat
function BotpressChat() {
  const location = useLocation(); // dùng để theo dõi thay đổi route

  useEffect(() => {
    const excludedPaths = [
      '/login',
      '/register',
      '/forgot-password',
      '/tour-detail',
    ];
    const currentPath = location.pathname;

    // Nếu đang ở path bị loại trừ => xóa chatbot nếu có
    if (excludedPaths.includes(currentPath)) {
      if (window.botpressWebChat) {
        window.botpressWebChat.destroy();
      }
      return;
    }

    // Nếu đã có chatbot rồi thì không cần gắn lại
    if (window.botpressWebChat) {
      window.botpressWebChat.destroy(); // Xóa bot cũ trước khi tạo mới
    }

    // Tạo script để nhúng chatbot
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.botpress.cloud/webchat/v2.4/inject.js';
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src =
      'https://files.bpcontent.cloud/2025/04/06/17/20250406174729-7C6DVJIU.js';
    script2.async = true;
    document.body.appendChild(script2);

    script1.onload = () => {
      window.botpressWebChat.init({
        botId: 'b33b4f5b-8a1b-4e6b-a1f8-4c7b9e8d3c2e',
        host: 'https://cdn.botpress.cloud/webchat/v2.4',
        clientId: 'e4c60808-83fd-484a-8833-2c29bfcee1e4',
        botName: 'Travel TADA Assistant',
        showUserAvatar: true,
        enableConversationDeletion: true,
        closeOnEscape: true,

        // 🌈 GIAO DIỆN
        layout: 'side', // hoặc "stacked" nếu muốn gọn kiểu mobile
        backgroundColor: '#ffffff', // màu nền khung chat
        botAvatarUrl: 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png',
        userAvatarUrl:
          'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',
        avatarUrl: 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png',
        // stylesheet: "https://your-custom-css.com/chat-style.css",
        showBotName: true,
        showPoweredBy: false,

        // 🌟 Màu sắc chủ đạo
        theme: {
          primary: '#00b96b', // màu chính
          secondary: '#f0f0f0', // màu nền khung chat
          textColorOnPrimary: '#fff', // màu chữ trên nút
          background: '#ffffff',
          sentMessageBackground: '#E6F7FF',
          receivedMessageBackground: '#F5F5F5',
        },
      });

      // Tự gửi "hi" khi reset
      const originalReset = window.botpressWebChat.resetConversation;
      window.botpressWebChat.resetConversation = function () {
        originalReset();
        setTimeout(() => {
          window.botpressWebChat.sendPayload({
            type: 'text',
            text: 'hi',
          });
        }, 2000);
      };
    };
  }, [location.pathname]); // chạy lại mỗi khi thay đổi route

  return null;
}

// ✅ Bọc App trong BrowserRouter để có thể dùng useLocation bên trong BotpressChat
function AppWithChat() {
  return (
    <BrowserRouter>
      <ConfigProvider locale={viVN}>
        <App />
        <BotpressChat />
      </ConfigProvider>
    </BrowserRouter>
  );
}

// ✅ Render toàn bộ ứng dụng
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AppWithChat />
    </Provider>
  </StrictMode>
);
