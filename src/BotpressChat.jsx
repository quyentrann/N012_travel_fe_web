import { useSelector } from "react-redux";

function BotpressChat() {
  const location = useLocation();
  const userName = useSelector((state) => state.user?.name || "bạn");

  useEffect(() => {
    const excludedPaths = ["/login", "/register", "/forgot-password", "/tour-detail"];
    if (excludedPaths.includes(location.pathname)) return;

    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v2.4/inject.js";
    script1.async = true;
    script1.onerror = () => console.error("Failed to load Botpress inject.js");
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://files.bpcontent.cloud/2025/04/06/17/20250406174729-7C6DVJIU.js";
    script2.async = true;
    script2.onerror = () => console.error("Failed to load Botpress config script");
    document.body.appendChild(script2);

    script1.onload = () => {
      if (!window.botpressWebChat) {
        console.error("Botpress Webchat not initialized");
        return;
      }

      window.botpressWebChat.init({
        botId: "b33b4f5b-8a1b-4e6b-a1f8-4c7b9e8d3c2e",
        host: "https://cdn.botpress.cloud/webchat/v2.4",
        clientId: "e4c60808-83fd-484a-8833-2c29bfcee1e4",
        botName: "Travel TADA Assistant",
        showUserAvatar: true,
        enableConversationDeletion: true,
        closeOnEscape: true,
        theme: {
          primaryColor: "#007BFF",
          fontFamily: "'Montserrat', sans-serif",
        },
      });

      window.botpressWebChat.onChatOpen(() => {
        window.botpressWebChat.sendPayload({
          type: "text",
          text: `Xin chào ${userName}! Mình là Travel TADA Assistant. Bạn muốn khám phá tour du lịch nào hôm nay? 😊`,
          quick_replies: [
            { title: "Xem tour hot", payload: "HOT_TOURS" },
            { title: "Liên hệ hỗ trợ", payload: "SUPPORT" },
          ],
        });
      });
    };

    return () => {
      if (document.body.contains(script1)) document.body.removeChild(script1);
      if (document.body.contains(script2)) document.body.removeChild(script2);
    };
  }, [location.pathname, userName]);

  return null;
}

export default BotpressChat;