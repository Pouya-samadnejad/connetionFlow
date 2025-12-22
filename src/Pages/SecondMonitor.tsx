import { useEffect, useState, useRef } from "react";
import Card from "../components/Card";
import SwitchToggle from "../components/SwitchToggle";
import { getConnection2 } from "../signalRConnection";
import secureZone from "../assets/SecureZone.PNG";

export default function SecondMonitor() {
  const time = 4000;
  const [message, setMessage] = useState("");
  const [isRealTimeMonitoring, setIsRealTimeMonitoring] = useState(true);

  const [activeSendAnimations, setActiveSendAnimations] = useState<number[]>(
    []
  );
  const [activeReceiveAnimations, setActiveReceiveAnimations] = useState<
    number[]
  >([]);

  const [lastMessage, setLastMessage] = useState<string>("");

  const isRealTimeRef = useRef(isRealTimeMonitoring);
  const inputRef = useRef<HTMLInputElement>(null);

  const prevSendAnimationsRef = useRef<number[]>([]);
  const prevReceiveAnimationsRef = useRef<number[]>([]);
  const sendAnimationCounterRef = useRef(0);
  const receiveAnimationCounterRef = useRef(0);

  const connection = getConnection2();

  useEffect(() => {
    isRealTimeRef.current = isRealTimeMonitoring;
  }, [isRealTimeMonitoring]);

  // Force شروع انیمیشن‌های ارسال
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const newAnimations = activeSendAnimations.filter(
      (id) => !prevSendAnimationsRef.current.includes(id)
    );

    newAnimations.forEach((animationId) => {
      const timer = setTimeout(() => {
        const animateElement = document.getElementById(
          `send-animation-motion-${animationId}`
        ) as SVGAnimateMotionElement | null;
        if (animateElement) {
          animateElement.beginElement();
        }
      }, 50);
      timers.push(timer);
    });

    prevSendAnimationsRef.current = activeSendAnimations;
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [activeSendAnimations]);

  // Force شروع انیمیشن‌های دریافت
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const newAnimations = activeReceiveAnimations.filter(
      (id) => !prevReceiveAnimationsRef.current.includes(id)
    );

    newAnimations.forEach((animationId) => {
      const timer = setTimeout(() => {
        const animateElement = document.getElementById(
          `receive-animation-motion-${animationId}`
        ) as SVGAnimateMotionElement | null;
        if (animateElement) {
          animateElement.beginElement();
        }
      }, 50);
      timers.push(timer);
    });

    prevReceiveAnimationsRef.current = activeReceiveAnimations;
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [activeReceiveAnimations]);

  useEffect(() => {
    const handleReceiveMessage = (msg: string) => {
      if (isRealTimeRef.current) {
        setLastMessage(msg);
      } else {
        receiveAnimationCounterRef.current += 1;
        const newAnimationId = receiveAnimationCounterRef.current;
        setActiveReceiveAnimations((prev) => [...prev, newAnimationId]);

        setTimeout(() => {
          setLastMessage(msg);
          setActiveReceiveAnimations((prev) =>
            prev.filter((id) => id !== newAnimationId)
          );
        }, time);
      }
    };

    async function start() {
      if (connection.state === "Disconnected") {
        try {
          await connection.start();
          console.log("Connection 2 Started");
        } catch (err) {
          console.error("Connection 2 failed", err);
        }
      }

      connection.off("ReceiveMessage", handleReceiveMessage);
      connection.on("ReceiveMessage", handleReceiveMessage);
    }

    start();

    return () => {
      connection.off("ReceiveMessage", handleReceiveMessage);
    };
  }, []);

  const startSendMessage = async (msgToSend: string) => {
    if (connection.state === "Connected") {
      try {
        await connection.invoke("SendMessage", msgToSend);
      } catch (err) {
        console.error("Send failed", err);
      }
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const currentMsg = message;

    if (isRealTimeMonitoring) {
      await startSendMessage(currentMsg);
    } else {
      sendAnimationCounterRef.current += 1;
      const newAnimationId = sendAnimationCounterRef.current;
      setActiveSendAnimations((prev) => [...prev, newAnimationId]);

      setTimeout(async () => {
        await startSendMessage(currentMsg);
        setActiveSendAnimations((prev) =>
          prev.filter((id) => id !== newAnimationId)
        );
      }, time);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };
  useEffect(() => {
    const focusInput = () => {
      inputRef.current?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName;

      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key.length === 1) {
        focusInput();
      }
    };

    document.addEventListener("click", focusInput);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("click", focusInput);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <div className="flex flex-col h-screen w-full pl-2 lg:pr-0  overflow-hidden">
      {/* Header Section */}
      <div className="h-40 flex items-center justify-between lg:pl-20  w-full md:mb-24 lg:mb-29 ">
        <Card
          glowColor="#14E800"
          className="w-80 flex items-center justify-center h-30 gap-10"
        >
          <p className="text-2xl font-bold">سپر درونی</p>
          <div className="w-15 h-15 mb-2">
            <img src={secureZone} alt="secure zone" />
          </div>
        </Card>
        <SwitchToggle
          value={!isRealTimeMonitoring} // تغییر initial به value
          fromColor="#10C202"
          toggle={(val) => setIsRealTimeMonitoring(!val)}
          toColor="#0DA800"
          shadowColor="rgba(20, 232, 0, 0.45)"
        />
      </div>

      <div className="flex  items-center  h-full ">
        {/* SVG Container - Responsive */}
        <div className="flex-1 w-full max-w-[1500px]  flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            // تغییرات مهم برای ریسپانسیو بودن:
            width="100%"
            height="auto"
            // viewBox بر اساس مختصات واقعی مسیرها (H1425) تنظیم شده است
            viewBox="0 0 1425 519"
            fill="none"
            // حفظ نسبت ابعاد تصویر
            preserveAspectRatio="xMidYMid meet"
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

            {/* Send Animations */}
            {activeSendAnimations.map((animationId) => (
              <g
                key={`send-animation-${animationId}`}
                id={`send-animation-group-${animationId}`}
                transform="translate(-70, -20) scale(2)"
              >
                <animateMotion
                  id={`send-animation-motion-${animationId}`}
                  dur={`${time / 1000}s`}
                  repeatCount="1"
                  rotate="auto"
                  keySplines="0.42 0 0.58 1"
                  keyTimes="0;1"
                  calcMode="paced"
                  fill="remove"
                  begin="indefinite"
                >
                  <mpath href="#upper-path" />
                </animateMotion>
                <path
                  d="M29.0909 0H2.90909C1.30244 0 0 1.30244 0 2.90909V20.3636C0 21.9703 1.30244 23.2727 2.90909 23.2727H29.0909C30.6976 23.2727 32 21.9703 32 20.3636V2.90909C32 1.30244 30.6976 0 29.0909 0Z"
                  fill="url(#paint0_linear_purple_card_2)"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M29.0909 0H2.90909C2.52332 0 2.15223 0.0738135 1.79583 0.221441C1.43942 0.369069 1.12483 0.579272 0.852049 0.852054L13.943 13.943C14.2157 14.2157 14.5303 14.4259 14.8867 14.5735C15.2431 14.7212 15.6142 14.7951 16 14.7951C16.3857 14.7951 16.7568 14.7212 17.1133 14.5735C17.4696 14.4259 17.7842 14.2157 18.057 13.943L31.1479 0.852049C30.8752 0.57927 30.5606 0.369067 30.2042 0.22144C29.8478 0.0738131 29.4767 0 29.0909 0Z"
                  fill="url(#paint1_linear_purple_card_2)"
                />
              </g>
            ))}

            <defs>
              <linearGradient
                id="paint0_linear_purple_card_2"
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
                id="paint1_linear_purple_card_2"
                x1="16.0002"
                y1="0"
                x2="16.0002"
                y2="14.7951"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#c0affd" />
                <stop offset="1" stopColor="#9163fd" />
              </linearGradient>
              <linearGradient
                id="paint0_linear_card_2"
                x1="16"
                y1="0"
                x2="16"
                y2="23.2727"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#29B4FA" />
                <stop offset="1" stopColor="#29B4FA" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_card_2"
                x1="16.0002"
                y1="0"
                x2="16.0002"
                y2="14.7951"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#AFE6FD" />
                <stop offset="1" stopColor="#70C8FF" />
              </linearGradient>
            </defs>

            {/* Receive Animations */}
            {activeReceiveAnimations.map((animationId) => (
              <g
                key={`receive-animation-${animationId}`}
                id={`receive-animation-group-${animationId}`}
                transform="translate(-65, -22) scale(2)"
              >
                <animateMotion
                  id={`receive-animation-motion-${animationId}`}
                  dur={`${time / 1000}s`}
                  repeatCount="1"
                  rotate="auto"
                  keySplines="0.42 0 0.58 1"
                  keyTimes="0;1"
                  calcMode="paced"
                  fill="remove"
                  begin="indefinite"
                  keyPoints="1;0"
                >
                  <mpath href="#lower-path" />
                </animateMotion>
                <path
                  d="M29.0909 0H2.90909C1.30244 0 0 1.30244 0 2.90909V20.3636C0 21.9703 1.30244 23.2727 2.90909 23.2727H29.0909C30.6976 23.2727 32 21.9703 32 20.3636V2.90909C32 1.30244 30.6976 0 29.0909 0Z"
                  fill="url(#paint0_linear_card_2)"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M29.0909 0H2.90909C2.52332 0 2.15223 0.0738135 1.79583 0.221441C1.43942 0.369069 1.12483 0.579272 0.852049 0.852054L13.943 13.943C14.2157 14.2157 14.5303 14.4259 14.8867 14.5735C15.2431 14.7212 15.6142 14.7951 16 14.7951C16.3857 14.7951 16.7568 14.7212 17.1133 14.5735C17.4696 14.4259 17.7842 14.2157 18.057 13.943L31.1479 0.852049C30.8752 0.57927 30.5606 0.369067 30.2042 0.22144C29.8478 0.0738131 29.4767 0 29.0909 0Z"
                  fill="url(#paint1_linear_card_2)"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Controls / Message Card */}
        <Card glowColor="#14E800">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="پیام خود را اینجا بنویسید..."
              className="w-2/3 p-3 rounded-md bg-black/30 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-600"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />

            <button
              onClick={handleSend}
              className="h-11.5 w-1/3 py-2 text-xs bg-green-600 text-black font-semibold rounded-md hover:bg-green-700 transition-colors cursor-pointer"
            >
              ارسال پیام
            </button>
          </div>
          <div className="mt-3 min-h-25 overflow-auto p-3 rounded-md bg-black/20 border border-white/10 text-white flex items-center justify-center">
            {!lastMessage ? (
              <div className="text-sm text-white/50">هیچ پیامی وجود ندارد.</div>
            ) : (
              <div className="text-2xl font-medium text-center animate-pulse">
                {lastMessage}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
