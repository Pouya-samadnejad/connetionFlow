import { useEffect, useState, useRef, useCallback } from "react";
import Card from "../components/Card";
import SwitchToggle from "../components/SwitchToggle";
import { getConnection } from "../signalRConnection";
import publicZone from "../assets/public-zone.png";

export default function FirstMonitor() {
  const time = 2000;
  const [message, setMessage] = useState("");
  const [isRealTimeMonitoring, setIsRealTimeMonitoring] = useState(true);

  const isRealTimeRef = useRef(isRealTimeMonitoring);
  const messageRef = useRef(message);
  const prevSendAnimationsRef = useRef<number[]>([]);
  const prevReceiveAnimationsRef = useRef<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const spamTimeoutRef = useRef<number | null>(null);
  const spamIntervalRef = useRef<number | null>(null);
  const sendAnimationCounterRef = useRef(0);

  const [activeSendAnimations, setActiveSendAnimations] = useState<number[]>(
    []
  );
  const [activeReceiveAnimations, setActiveReceiveAnimations] = useState<
    number[]
  >([]);

  const [lastMessage, setLastMessage] = useState<string>("");
  const [receiveAnimationCounter, setReceiveAnimationCounter] = useState(0);

  const connection = getConnection();

  // Keep refs in sync with state
  useEffect(() => {
    isRealTimeRef.current = isRealTimeMonitoring;
  }, [isRealTimeMonitoring]);

  useEffect(() => {
    messageRef.current = message;
  }, [message]);

  // Force Start Send Animations
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

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [activeSendAnimations]);

  // Force Start Receive Animations
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

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [activeReceiveAnimations]);

  useEffect(() => {
    const handleReceiveMessage = (msg: string) => {
      if (isRealTimeRef.current) {
        setLastMessage(msg);
      } else {
        const newAnimationId = receiveAnimationCounter + 1;
        setReceiveAnimationCounter(newAnimationId);
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
          console.log("Connection 1 Started");
        } catch (err) {
          console.error("Connection 1 failed", err);
        }
      }

      connection.off("ReceiveMessage", handleReceiveMessage);
      connection.on("ReceiveMessage", handleReceiveMessage);
    }

    start();

    return () => {
      connection.off("ReceiveMessage", handleReceiveMessage);
    };
  }, [receiveAnimationCounter]);

  const startSendMessage = useCallback(
    async (msgToSend: string) => {
      if (connection.state === "Connected") {
        try {
          await connection.invoke("SendMessage", msgToSend);
        } catch (err) {
          console.error("Send failed", err);
        }
      }
    },
    [connection]
  );

  // Stable handleSend using refs
  const handleSend = useCallback(async () => {
    const currentMsg = messageRef.current;
    if (!currentMsg.trim()) return;

    // Use ref for counter to avoid stale closures
    sendAnimationCounterRef.current += 1;
    const newAnimationId = sendAnimationCounterRef.current;

    setActiveSendAnimations((prev) => [...prev, newAnimationId]);

    const isRealTime = isRealTimeRef.current;

    setTimeout(
      async () => {
        await startSendMessage(currentMsg);
        setActiveSendAnimations((prev) =>
          prev.filter((id) => id !== newAnimationId)
        );
      },
      isRealTime ? 0 : time
    );
  }, [startSendMessage]);

  // Cleanup function for spam timers
  const stopSpam = useCallback(() => {
    if (spamTimeoutRef.current) {
      clearTimeout(spamTimeoutRef.current);
      spamTimeoutRef.current = null;
    }
    if (spamIntervalRef.current) {
      clearInterval(spamIntervalRef.current);
      spamIntervalRef.current = null;
    }
  }, []);

  const handleKeyDownInput = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;

      // Prevent OS key repeat - we handle our own repeat
      if (e.repeat) return;

      e.preventDefault();

      // 1. Send immediately on first press
      handleSend();

      // 2. Start spam after delay (500ms)
      spamTimeoutRef.current = window.setTimeout(() => {
        // 3. Start spam loop (every 100ms)
        spamIntervalRef.current = window.setInterval(() => {
          handleSend();
        }, 100);
      }, 500);
    },
    [handleSend]
  );

  const handleKeyUpInput = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        stopSpam();
      }
    },
    [stopSpam]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpam();
    };
  }, [stopSpam]);

  // Auto focus input
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
    <div className="flex flex-col h-screen w-full pr-2 lg:pr-0 overflow-hidden">
      <div className="h-40 flex items-center lg:pr-25 justify-between">
        <SwitchToggle
          value={!isRealTimeMonitoring}
          toggle={(val) => setIsRealTimeMonitoring(!val)}
          fromColor="#F43F5E"
          toColor="#C70A2E"
          shadowColor="rgba(244, 63, 9, 0.45)"
        />
        <Card
          glowColor="#F43F5E"
          className="w-80 flex items-center justify-center h-30 gap-10"
        >
          <p className="text-2xl font-bold">Public zone</p>
        </Card>
      </div>
      <div className="h-30" />

      <div className="flex items-center h-full lg:mr-25">
        <div>
          <div className="w-40 h-40 absolute top-[30%] right-[9.5%] mb-2">
            <img src={publicZone} alt="public zone" />
          </div>

          {lastMessage && (
            <div className="absolute bg-[#F43F5E] w-70 h-70 blur-[90px] lg:top-[47%] lg:right-[6%] md:top-[45%] rounded-full z-0 animate-pulse" />
          )}
          <Card glowColor="#F43F5E">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="پیام خود را اینجا بنویسید..."
                className="w-2/3 p-3 rounded-md bg-black/30 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F43F5E]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDownInput}
                onKeyUp={handleKeyUpInput}
                ref={inputRef}
              />

              <button
                onClick={handleSend}
                className="h-11.5 w-1/3 py-2 text-xs font-semibold rounded-md transition-colors bg-[#F43F5E] hover:bg-[#F43F5E] text-black"
              >
                ارسال پیام
              </button>
            </div>

            <div className="mt-3 min-h-25 max-h-60 overflow-auto p-3 rounded-md bg-black/20 border border-white/10 text-white flex items-center justify-center">
              {!lastMessage ? (
                <div className="text-sm text-white/50">
                  هیچ پیامی وجود ندارد.
                </div>
              ) : (
                <div className="text-2xl font-medium text-center animate-pulse">
                  {lastMessage?.length > 10
                    ? lastMessage.slice(0, 10) + "..."
                    : lastMessage}
                </div>
              )}
            </div>
          </Card>
        </div>
        <div className="flex-1 w-full max-w-[1500px] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="auto"
            viewBox="0 0 1425 519"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              id="upper-path-1"
              d="M1425 232H1355.98C1328.52 232 1302.26 220.705 1283.38 200.767L1162.58 73.2334C1143.7 53.2945 1117.44 42 1089.98 42H0"
              stroke="white"
              strokeWidth="4"
            />
            <path
              id="lower-path-1"
              d="M1425 288H1355.98C1328.52 288 1302.26 299.295 1283.38 319.233L1162.58 446.767C1143.7 466.705 1117.44 478 1089.98 478H0"
              stroke="white"
              strokeWidth="4"
            />
            <path
              d="M141.775 40.0317C142.95 40.831 142.94 42.5667 141.756 43.3523L93.9086 75.0842C92.5748 75.9688 90.794 75.0063 90.8033 73.4058L91.1754 9.3878C91.1848 7.78734 92.9767 6.8456 94.3001 7.74563L141.775 40.0317Z"
              fill="white"
            />
            <path d="M144 10V73.5" stroke="white" strokeWidth="4" />
            <g transform="translate(20, 0)">
              <path
                d="M75.7025 476.032C74.5272 476.831 74.5373 478.567 75.7218 479.352L123.569 511.084C124.903 511.969 126.683 511.006 126.674 509.406L126.302 445.388C126.293 443.787 124.501 442.846 123.177 443.746L75.7025 476.032Z"
                fill="white"
              />
              <path d="M73.4774 446V509.5" stroke="white" strokeWidth="4" />
            </g>

            {/* Send Animation (Blue) */}
            {activeSendAnimations.map((animationId) => (
              <g
                key={`send-animation-${animationId}`}
                id={`send-animation-group-${animationId}`}
                transform="rotate(180, 0, 10) scale(2)"
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
                  <mpath href="#lower-path-1" />
                </animateMotion>
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
            ))}

            {/* Receive Animation (RED) */}
            {activeReceiveAnimations.map((animationId) => (
              <g
                key={`receive-animation-${animationId}`}
                id={`receive-animation-group-${animationId}`}
                transform="translate(0, 22) scale(2) rotate(180)"
              >
                <defs>
                  <linearGradient
                    id={`paint0_linear_red_1_${animationId}`}
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
                    id={`paint1_linear_red_1_${animationId}`}
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
                  <mpath href="#upper-path-1" />
                </animateMotion>
                <path
                  d="M29.0909 0H2.90909C1.30244 0 0 1.30244 0 2.90909V20.3636C0 21.9703 1.30244 23.2727 2.90909 23.2727H29.0909C30.6976 23.2727 32 21.9703 32 20.3636V2.90909C32 1.30244 30.6976 0 29.0909 0Z"
                  fill={`url(#paint0_linear_red_1_${animationId})`}
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M29.0909 0H2.90909C2.52332 0 2.15223 0.0738135 1.79583 0.221441C1.43942 0.369069 1.12483 0.579272 0.852049 0.852054L13.943 13.943C14.2157 14.2157 14.5303 14.4259 14.8867 14.5735C15.2431 14.7212 15.6142 14.7951 16 14.7951C16.3857 14.7951 16.7568 14.7212 17.1133 14.5735C17.4696 14.4259 17.7842 14.2157 18.057 13.943L31.1479 0.852049C30.8752 0.57927 30.5606 0.369067 30.2042 0.22144C29.8478 0.0738131 29.4767 0 29.0909 0Z"
                  fill={`url(#paint1_linear_red_1_${animationId})`}
                />
              </g>
            ))}

            <defs>
              <linearGradient
                id="paint0_linear_card_1"
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
                id="paint1_linear_card_1"
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
          </svg>
        </div>
      </div>
    </div>
  );
}
