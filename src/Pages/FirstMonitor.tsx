import { useEffect, useRef, useState } from "react";
import Card from "../components/Card";
import SwitchToggle from "../components/SwitchToggle";

export default function FirstMonitor() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((s) => [...s, trimmed]);
    setText("");
  };

  return (
    <>
      <div>
        <SwitchToggle />
      </div>
      <div className="flex items-center justify-center h-full px-20 ">
        <Card glowColor="#FFCC00">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="پیام خود را اینجا بنویسید..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="w-2/3 p-3 rounded-md bg-black/30 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <button
              onClick={sendMessage}
              className="h-11.5 w-1/3 py-2 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-600 transition-colors"
            >
              ارسال پیام
            </button>
          </div>
          <div
            ref={messagesRef}
            className="mt-3 min-h-25 overflow-auto p-3 rounded-md bg-black/20 border border-white/10 text-white space-y-2"
          >
            {messages.length === 0 ? (
              <div className="text-sm text-white/50">هیچ پیامی وجود ندارد.</div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className="text-sm bg-black/40 p-2 rounded">
                  {m}
                </div>
              ))
            )}
          </div>
        </Card>
        <div className="w-2/3 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1920"
            height="519"
            viewBox="0 0 900 519"
            fill="none"
          >
            <path
              d="M1425 232H1355.98C1328.52 232 1302.26 220.705 1283.38 200.767L1162.58 73.2334C1143.7 53.2945 1117.44 42 1089.98 42H0"
              stroke="white"
              stroke-width="4"
            />
            <path
              d="M1425 288H1355.98C1328.52 288 1302.26 299.295 1283.38 319.233L1162.58 446.767C1143.7 466.705 1117.44 478 1089.98 478H0"
              stroke="white"
              stroke-width="4"
            />
            <path
              d="M141.775 40.0317C142.95 40.831 142.94 42.5667 141.756 43.3523L93.9086 75.0842C92.5748 75.9688 90.794 75.0063 90.8033 73.4058L91.1754 9.3878C91.1848 7.78734 92.9767 6.8456 94.3001 7.74563L141.775 40.0317Z"
              fill="white"
            />
            <path d="M144 10V73.5" stroke="white" stroke-width="4" />
            <path
              d="M75.7025 476.032C74.5272 476.831 74.5373 478.567 75.7218 479.352L123.569 511.084C124.903 511.969 126.683 511.006 126.674 509.406L126.302 445.388C126.293 443.787 124.501 442.846 123.177 443.746L75.7025 476.032Z"
              fill="white"
            />
            <path d="M73.4774 446V509.5" stroke="white" stroke-width="4" />
            <ellipse
              cx="1365"
              cy="287.5"
              rx="10"
              ry="10"
              fill="url(#paint0_linear_11_39)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_11_39"
                x1="1365"
                y1="259"
                x2="1365"
                y2="316"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FFD900" />
                <stop offset="1" stop-color="#FFA600" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </>
  );
}
