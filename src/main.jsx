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
  const location = useLocation();

  useEffect(() => {
    const excludedPaths = ['/login', '/register', '/forgot-password', '/tour-detail'];
    const currentPath = location.pathname;

    if (excludedPaths.includes(currentPath)) {
      if (window.botpressWebChat) {
        window.botpressWebChat.destroy();
      }
      return;
    }

    if (window.botpressWebChat) {
      window.botpressWebChat.destroy();
    }

    const script1 = document.createElement('script');
    script1.src = 'https://cdn.botpress.cloud/webchat/v2.4/inject.js';
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://files.bpcontent.cloud/2025/04/06/17/20250406174729-7C6DVJIU.js';
    script2.async = true;
    document.body.appendChild(script2);

    let script1Loaded = false;
    let script2Loaded = false;

    const initializeBotpress = () => {
      if (script1Loaded && script2Loaded) {
        try {
          if (window.botpressWebChat && typeof window.botpressWebChat.init === 'function') {
            window.botpressWebChat.init({
              botId: 'b33b4f5b-8a1b-4e6b-a1f8-4c7b9e8d3c2e',
              host: 'https://cdn.botpress.cloud/webchat/v2.4',
              clientId: 'e4c60808-83fd-484a-8833-2c29bfcee1e4',
              botName: 'Travel TADA Assistant',
              showUserAvatar: true,
              enableConversationDeletion: true,
              closeOnEscape: true,
              layout: 'side',
              backgroundColor: '#ffffff',
              botAvatarUrl: 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png',
              userAvatarUrl: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',
              avatarUrl: 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png',
              showBotName: true,
              showPoweredBy: false,
              theme: {
                primary: '#00b96b',
                secondary: '#f0f0f0',
                textColorOnPrimary: '#fff',
                background: '#ffffff',
                sentMessageBackground: '#E6F7FF',
                receivedMessageBackground: '#F5F5F5',
              },
            });
            console.log('Botpress Webchat initialized successfully');

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
          } else {
            console.error('Botpress Webchat không khả dụng hoặc init không tồn tại');
          }
        } catch (error) {
          console.error('Lỗi khi khởi tạo Botpress Webchat:', error);
        }
      }
    };

    script1.onload = () => {
      console.log('Script 1 (Botpress inject.js) loaded');
      script1Loaded = true;
      initializeBotpress();
    };
    script1.onerror = () => {
      console.error('Lỗi khi tải script 1 (Botpress inject.js)');
    };

    script2.onload = () => {
      console.log('Script 2 (Botpress config) loaded');
      script2Loaded = true;
      initializeBotpress();
    };
    script2.onerror = () => {
      console.error('Lỗi khi tải script 2 (Botpress config)');
    };

    return () => {
      if (window.botpressWebChat) {
        window.botpressWebChat.destroy();
      }
    };
  }, [location.pathname]);

  return null;
}

// ✅ Bọc App trong BrowserRouter để có thể dùng useLocation bên trong BotpressChat
function AppWithChat() {
  return (
    <BrowserRouter>
      <ConfigProvider locale={viVN}>
        <App />
        {/* <BotpressChat /> */}
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
