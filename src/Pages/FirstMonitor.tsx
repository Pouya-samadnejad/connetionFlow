import { useEffect, useState } from "react";
import Card from "../components/Card";
import SwitchToggle from "../components/SwitchToggle";
import { getConnection } from "../signalRConnection";

export default function FirstMonitor() {
  const [message, setMessage] = useState(""); // متن ورودی
  const [messages, setMessages] = useState<string[]>([]); // لیست پیام‌ها

  useEffect(() => {
    const connection = getConnection();

    async function start() {
      if (connection.state === "Disconnected") {
        await connection.start();
      }

      // اسم متد دریافت از سرور – در صورت نیاز فقط همین رشته را عوض کن
      connection.on("ReceiveMessage", (msg: string) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    start();

    return () => {
      connection.off("ReceiveMessage");
    };
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;

    const connection = getConnection();
    if (connection.state === "Connected") {
      // اسم متد ارسال روی سرور – در صورت نیاز فقط همین رشته را عوض کن
      await connection.invoke("SendMessage", message);
      setMessage("");
    }
  };

  return (
    <>
      <div className="h-40 flex items-center mr-50 justify-between">
        <SwitchToggle
          fromColor="#FFD900"
          toColor="#FFA600"
          shadowColor="rgba(255, 204, 0, 0.45)"
        />
        <Card
          glowColor="#FFCC00"
          className="w-80 flex items-center justify-center h-30"
        >
          <p className="text-2xl">سپر درونی</p>
        </Card>
      </div>
      <div className="h-30" />
      <div className="flex items-center  h-full mr-42 ">
        <Card glowColor="#FFCC00">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="پیام خود را اینجا بنویسید..."
              className="w-2/3 p-3 rounded-md bg-black/30 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              onClick={handleSend}
              className="h-11.5 w-1/3 py-2 text-xs bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-600 transition-colors"
            >
              ارسال پیام
            </button>
          </div>
          <div className="mt-3 min-h-25 overflow-auto p-3 rounded-md bg-black/20 border border-white/10 text-white space-y-2">
            {messages.length === 0 ? (
              <div className="text-sm text-white/50">هیچ پیامی وجود ندارد.</div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className="text-sm">
                  {m}
                </div>
              ))
            )}
          </div>
        </Card>
        <div className="w-2/3 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1425"
            height="519"
            viewBox="0 0 1425 519"
            fill="none"
          >
            <path
              id="upper-path"
              d="M1425 232H1355.98C1328.52 232 1302.26 220.705 1283.38 200.767L1162.58 73.2334C1143.7 53.2945 1117.44 42 1089.98 42H0"
              stroke="white"
              strokeWidth="4"
            />
            <path
              id="lower-path"
              d="M1425 288H1355.98C1328.52 288 1302.26 299.295 1283.38 319.233L1162.58 446.767C1143.7 466.705 1117.44 478 1089.98 478H0"
              stroke="white"
              strokeWidth="4"
            />
            <path
              d="M141.775 40.0317C142.95 40.831 142.94 42.5667 141.756 43.3523L93.9086 75.0842C92.5748 75.9688 90.794 75.0063 90.8033 73.4058L91.1754 9.3878C91.1848 7.78734 92.9767 6.8456 94.3001 7.74563L141.775 40.0317Z"
              fill="white"
            />
            <path d="M144 10V73.5" stroke="white" strokeWidth="4" />
            <path
              d="M75.7025 476.032C74.5272 476.831 74.5373 478.567 75.7218 479.352L123.569 511.084C124.903 511.969 126.683 511.006 126.674 509.406L126.302 445.388C126.293 443.787 124.501 442.846 123.177 443.746L75.7025 476.032Z"
              fill="white"
            />
            <path d="M73.4774 446V509.5" stroke="white" strokeWidth="4" />
            <g>
              <animateMotion
                dur="7s"
                repeatCount="indefinite"
                rotate="auto"
                keySplines="0.42 0 0.58 1"
                keyTimes="0;1"
                calcMode="spline"
              >
                <mpath href="#lower-path" />
              </animateMotion>
              <g transform="translate(-16, 10) scale(1) rotate(180)">
                <path
                  d="M29.0909 0H2.90909C1.30244 0 0 1.30244 0 2.90909V20.3636C0 21.9703 1.30244 23.2727 2.90909 23.2727H29.0909C30.6976 23.2727 32 21.9703 32 20.3636V2.90909C32 1.30244 30.6976 0 29.0909 0Z"
                  fill="url(#paint0_linear_card_1)"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M29.0909 0H2.90909C2.52332 0 2.15223 0.0738135 1.79583 0.221441C1.43942 0.369069 1.12483 0.579272 0.852049 0.852054L13.943 13.943C14.2157 14.2157 14.5303 14.4259 14.8867 14.5735C15.2431 14.7212 15.6142 14.7951 16 14.7951C16.3857 14.7951 16.7568 14.7212 17.1133 14.5735C17.4696 14.4259 17.7842 14.2157 18.057 13.943L31.1479 0.852049C30.8752 0.57927 30.5606 0.369067 30.2042 0.22144C29.8478 0.0738131 29.4767 0 29.0909 0Z"
                  fill="url(#paint1_linear_card_1)"
                />
              </g>
            </g>
            <g>
              <animateMotion
                dur="7s"
                repeatCount="indefinite"
                rotate="auto"
                keySplines="0.42 0 0.58 1"
                keyTimes="0;1"
                calcMode="spline"
                keyPoints="1;0"
              >
                <mpath href="#upper-path" />
              </animateMotion>
              <g transform="translate(3, 12) scale(1) rotate(180)">
                <path
                  d="M29.0909 0H2.90909C1.30244 0 0 1.30244 0 2.90909V20.3636C0 21.9703 1.30244 23.2727 2.90909 23.2727H29.0909C30.6976 23.2727 32 21.9703 32 20.3636V2.90909C32 1.30244 30.6976 0 29.0909 0Z"
                  fill="url(#paint0_linear_purple_card_1)"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M29.0909 0H2.90909C2.52332 0 2.15223 0.0738135 1.79583 0.221441C1.43942 0.369069 1.12483 0.579272 0.852049 0.852054L13.943 13.943C14.2157 14.2157 14.5303 14.4259 14.8867 14.5735C15.2431 14.7212 15.6142 14.7951 16 14.7951C16.3857 14.7951 16.7568 14.7212 17.1133 14.5735C17.4696 14.4259 17.7842 14.2157 18.057 13.943L31.1479 0.852049C30.8752 0.57927 30.5606 0.369067 30.2042 0.22144C29.8478 0.0738131 29.4767 0 29.0909 0Z"
                  fill="url(#paint1_linear_purple_card_1)"
                />
              </g>
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_card_1"
                x1="16"
                y1="0"
                x2="16"
                y2="23.2727"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FAC227" />
                <stop offset="1" stopColor="#FAA627" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_card_1"
                x1="16.0002"
                y1="0"
                x2="16.0002"
                y2="14.7951"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FCE4B1" />
                <stop offset="1" stopColor="#FFD272" />
              </linearGradient>
              <linearGradient
                id="paint0_linear_purple_card_1"
                x1="16"
                y1="0"
                x2="16"
                y2="23.2727"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#8B5CF6" />
                <stop offset="1" stopColor="#6B2AFF" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_purple_card_1"
                x1="16.0002"
                y1="0"
                x2="16.0002"
                y2="14.7951"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#c0affd" />
                <stop offset="1" stopColor="#9163fd" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </>
  );
}
