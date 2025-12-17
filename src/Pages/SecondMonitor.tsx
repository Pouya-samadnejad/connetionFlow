import { useEffect, useState } from "react";
import Card from "../components/Card";
import SwitchToggle from "../components/SwitchToggle";
import { getConnection } from "../signalRConnection";

export default function SecondMonitor() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const connection = getConnection();

    async function start() {
      if (connection.state === "Disconnected") {
        await connection.start();
      }

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
      await connection.invoke("SendMessage", message);
      setMessage("");
    }
  };

  return (
    <div className="p-0">
      <div className="h-40 flex items-center justify-between ml-50">
        <Card
          glowColor="#8B5CF6"
          className="w-80 flex items-center justify-center h-30"
        >
          <p className="text-2xl ">سپر بیرونی</p>
        </Card>
        <SwitchToggle
          fromColor="#8B5CF6"
          toColor="#6B2AFF"
          shadowColor="rgba(139, 92, 246, 0.45)"
        />
      </div>
      <div className="h-30" />
      <div className="flex items-center h-full  ">
        <div className="w-2/3 ml-2 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1920"
            height="519"
            viewBox="0 0 900 519"
            fill="none"
          >
            <path
              id="lower-path"
              d="M1.32322e-05 287H69.0197C96.4827 287 122.737 298.295 141.622 318.234L262.417 445.767C281.302 465.706 307.557 477 335.02 477H1425"
              stroke="white"
              strokeWidth="4"
            />
            <path
              id="upper-path"
              d="M1.32322e-05 231H69.0197C96.4827 231 122.737 219.706 141.622 199.767L262.417 72.2335C281.302 52.2946 307.557 41.0001 335.02 41.0001H1425"
              stroke="white"
              strokeWidth="4"
            />
            <path
              d="M1283.23 478.968C1282.05 478.169 1282.06 476.433 1283.24 475.648L1331.09 443.916C1332.43 443.031 1334.21 443.994 1334.2 445.594L1333.82 509.612C1333.82 511.213 1332.02 512.154 1330.7 511.254L1283.23 478.968Z"
              fill="white"
            />
            <path d="M1281 509V445.5" stroke="white" strokeWidth="4" />
            <path
              d="M1349.3 42.9683C1350.47 42.1691 1350.46 40.4333 1349.28 39.6478L1301.43 7.91582C1300.1 7.03124 1298.32 7.99376 1298.33 9.59421L1298.7 73.6123C1298.71 75.2127 1300.5 76.1545 1301.82 75.2544L1349.3 42.9683Z"
              fill="white"
            />
            <path d="M1351.52 73.0001V9.50006" stroke="white" strokeWidth="4" />
            <circle cx="0" cy="0" r="10" fill="url(#paint0_linear_14_40)">
              <animateMotion
                dur="7s"
                repeatCount="indefinite"
                rotate="auto"
                keySplines="0.42 0 0.58 1"
                keyTimes="0;1"
                calcMode="spline"
              >
                <mpath href="#upper-path" />
              </animateMotion>
            </circle>
            <defs>
              <linearGradient
                id="paint0_linear_14_40"
                x1="47.0001"
                y1="216"
                x2="47.0001"
                y2="246"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#8B5CF6" />
                <stop offset="1" stopColor="#6B2AFF" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_yellow"
                x1="0"
                y1="272"
                x2="0"
                y2="302"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FFD900" />
                <stop offset="1" stopColor="#FFA600" />
              </linearGradient>
            </defs>
            <ellipse
              cx="0"
              cy="0"
              rx="10"
              ry="10"
              fill="url(#paint1_linear_yellow)"
            >
              <animateMotion
                dur="7s"
                repeatCount="indefinite"
                rotate="auto"
                keySplines="0.42 0 0.58 1"
                keyTimes="0;1"
                calcMode="spline"
                keyPoints="1;0"
              >
                <mpath href="#lower-path" />
              </animateMotion>
            </ellipse>
          </svg>
        </div>
        <div className="w"></div>
        <Card glowColor="#8B5CF6" className="mr-28">
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
              className="h-11.5 w-1/3 py-2 text-xs bg-purple-500 text-black font-semibold rounded-md hover:bg-purple-600 transition-colors"
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
      </div>
    </div>
  );
}
