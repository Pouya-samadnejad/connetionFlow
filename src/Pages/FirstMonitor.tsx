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
            <ellipse
              cx="0"
              cy="0"
              rx="10"
              ry="10"
              fill="url(#paint0_linear_11_39)"
            >
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
            </ellipse>
            <circle cx="0" cy="0" r="10" fill="url(#paint1_linear_purple)">
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
            </circle>
            <defs>
              <linearGradient
                id="paint0_linear_11_39"
                x1="1365"
                y1="259"
                x2="1365"
                y2="316"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FFD900" />
                <stop offset="1" stopColor="#FFA600" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_purple"
                x1="0"
                y1="217"
                x2="0"
                y2="247"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#8B5CF6" />
                <stop offset="1" stopColor="#6B2AFF" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </>
  );
}
