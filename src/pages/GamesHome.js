import { Card, Button, Row, Col, message, Progress, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import BonusSpinModal from "../components/BonusSpinModal";
import bannerVideoMobile from "../assets/videos/Mobile.mp4";
import bannerVideoWeb from "../assets/videos/Web.mp4";

import {
  GiftOutlined,
  LockOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  FireOutlined,
  StarOutlined,
} from "@ant-design/icons";

export default function GamesHome() {
  const navigate = useNavigate();
  const [showBonus, setShowBonus] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const [completedGames, setCompletedGames] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showFireworks, setShowFireworks] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const data = [
    {
      option: "අවුරුදු ප්‍රශ්න මාලාව",
      route: "/game1",
      key: "game_quiz_done",
      color: "#ff7875",
      gradient: "linear-gradient(135deg, #ff7875, #ff9f4b)",
      icon: "❓",
      description: "අවුරුදු දැනුම පරීක්ෂා කරන්න",
      reward: "",
    },
    {
      option: "කැවුම් ගණන හොයමු",
      route: "/game2",
      key: "game_kavum_done",
      color: "#ffd666",
      gradient: "linear-gradient(135deg, #ffd666, #ffb347)",
      icon: "🍘",
      description: "කැවුම් ගණන නිවැරදිව තෝරන්න",
      reward: "🔢 ගණිත ශූරතාව",
    },
    {
      option: "සැඟවුණු පහන් හොයමු",
      route: "/game3",
      key: "game_lamps_done",
      color: "#69c0ff",
      gradient: "linear-gradient(135deg, #69c0ff, #5b8cff)",
      icon: "🔎",
      description: "රූපයේ සැඟවුණු දේ සොයන්න",
      reward: "",
    },
    {
      option: "රබානට තට්ටු කරන්න",
      route: "/rabana",
      key: "game_rabana_done",
      color: "#95de64",
      gradient: "linear-gradient(135deg, #95de64, #6bcf7f)",
      icon: "🥁",
      description: "ඉක්මනින් රබානට තට්ටු කරන්න",
      reward: "⚡ වේගවත් අත් ශූරතාව",
    },
    {
      option: "කැවුම් අල්ලන්න",
      route: "/kavum",
      key: "game_catch_kavum_done",
      color: "#b37feb",
      gradient: "linear-gradient(135deg, #b37feb, #9f6bdb)",
      icon: "🎯",
      description: "හැකි තරම් කැවුම් අල්ලන්න",
      reward: "🎯 නිරවද්‍යතා ශූරතාව",
    },
    {
      option: "කණා මුට්ටි බිඳිමු",
      route: "/break",
      key: "game_break_pot_done",
      color: "#ffa940",
      gradient: "linear-gradient(135deg, #ffa940, #ff8c5a)",
      icon: "🏺",
      description: "මුට්ටිය ඉක්මනින් බිඳ දමන්න",
      reward: "💪 බලවත් අත් ශූරතාව",
    },
  ];

  // Track mouse position for parallax effect (disable on mobile)
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  const allGamesDone = useMemo(() => {
    return data.every((game) => completedGames[game.key]);
  }, [completedGames]);

  // Trigger fireworks when all games completed
  useEffect(() => {
    if (allGamesDone) {
      setShowFireworks(true);
      const timer = setTimeout(() => setShowFireworks(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [allGamesDone]);

  // Inject enhanced animations (keeping your existing animations)
  useEffect(() => {
    const styleId = "games-home-enhanced-animations";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      @keyframes floatIn {
        0% {
          opacity: 0;
          transform: translateY(30px) scale(0.9);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes gentleFloat {
        0%, 100% {
          transform: translateY(0) rotate(0deg);
        }
        25% {
          transform: translateY(-8px) rotate(2deg);
        }
        75% {
          transform: translateY(8px) rotate(-2deg);
        }
      }

      @keyframes spinSlow {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes pulseGlow {
        0%, 100% {
          filter: drop-shadow(0 0 10px #f9ce1d
);
        }
        50% {
          filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.6));
        }
      }

      @keyframes shimmer {
        0% {
          background-position: -1000px 0;
        }
        100% {
          background-position: 1000px 0;
        }
      }

      @keyframes firework {
        0% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 1;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.5);
          opacity: 0.8;
        }
        100% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
        }
      }

      @keyframes rotateY {
        from {
          transform: rotateY(0deg);
        }
        to {
          transform: rotateY(360deg);
        }
      }

      .games-card-animate {
        opacity: 0;
        animation: floatIn 0.7s cubic-bezier(0.215, 0.610, 0.355, 1) forwards;
      }

      .games-home-card {
        box-shadow: 0 15px 35px rgba(139, 69, 19, 0.15);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 215, 0, 0.2);
      }

      .games-home-card:hover {
        transform: translateY(-12px) scale(1.02);
        box-shadow: 0 25px 45px rgba(218, 165, 32, 0.25);
        border-color: rgba(255, 215, 0, 0.5);
      }

      .games-home-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
      }

      .games-home-card:hover::before {
        left: 100%;
      }

      .games-glow-icon {
        animation: pulseGlow 3s ease-in-out infinite;
      }

      .floating-element {
        position: absolute;
        pointer-events: none;
        opacity: 0.6;
        animation: gentleFloat var(--duration) ease-in-out infinite;
        animation-delay: var(--delay);
        filter: drop-shadow(0 0 5px rgba(25, 0, 255, 0.3));
      }

      .firework {
        position: fixed;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: radial-gradient(circle, #ff0 0%, #f0f 50%, transparent 70%);
        animation: firework 1s ease-out forwards;
        pointer-events: none;
        z-index: 9999;
      }

      .progress-bar-glow {
        animation: pulseGlow 2s ease-in-out infinite;
      }

      .title-shimmer {
        background: linear-gradient(90deg, #8B4513, #D2691E, #f46060, #ff0000, #F4A460, #D2691E, #8B4513);
        background-size: 200% 100%;
        animation: shimmer 8s linear infinite;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      /* Mobile specific adjustments */
      @media (max-width: 768px) {
        .games-home-card:hover {
          transform: translateY(-8px) scale(1.01);
        }
        
        .games-home-card:active {
          transform: scale(0.98);
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Load states
  useEffect(() => {
    const status = {};
    data.forEach((game) => {
      status[game.key] = localStorage.getItem(game.key) === "true";
    });
    setCompletedGames(status);

    const savedActive = localStorage.getItem("activeGame");
    if (savedActive) setActiveGame(savedActive);
  }, []);

  useEffect(() => {
    if (activeGame) {
      localStorage.setItem("activeGame", activeGame);
    }
  }, [activeGame]);

  const completedCount = useMemo(() => {
    return data.filter((game) => completedGames[game.key]).length;
  }, [completedGames]);

  const handleEndSession = () => {
    localStorage.removeItem("activeGame");
    data.forEach((game) => localStorage.removeItem(game.key));
    localStorage.removeItem("player");
    localStorage.removeItem("bonus_reward");

    setActiveGame(null);
    setCompletedGames({});
    setShowBonus(false);

    message.success({
      content: "සැසිය අවසන් කරන ලදී. නැවත එන්න! 👋",
      duration: 2,
      style: { marginTop: isMobile ? "10vh" : "20vh" },
    });

    navigate("/welcome");
  };

  const quickPlay = (game) => {
    const isCompleted = completedGames[game.key];

    if (isCompleted) {
      message.warning({
        content: "ඔබ දැනටමත් මෙම ක්‍රීඩාව සම්පූර්ණ කර ඇත! 🎉",
        icon: <CheckCircleOutlined />,
        style: { marginTop: isMobile ? "10vh" : "20vh" },
      });
      return;
    }

    if (activeGame && activeGame !== game.route) {
      message.warning({
        content: "කරුණාකර පළමුව වත්මන් ක්‍රීඩාව අවසන් කරන්න",
        icon: <LockOutlined />,
        style: { marginTop: isMobile ? "10vh" : "20vh" },
      });
      return;
    }

    setActiveGame(game.route);
    message.success({
      content: `🎮 ${game.option} ආරම්භ කරමින්...`,
      duration: 1,
    });
    navigate(game.route);
  };

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 30% 30%, #FFE4B5, #DEB887, #8B4513)",
        padding: isMobile ? "0 10px" : 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 🎬 Banner Video - Responsive */}
      <div
        className="games-card-animate"
        style={{
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          
        }}
      >
        <video
          src={isMobile ? bannerVideoMobile : bannerVideoWeb}
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.5))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
          }}
        />
      </div>

      {/* Animated Background Pattern (simplified for mobile) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            repeating-linear-gradient(
              45deg,
              rgba(255, 215, 0, 0.05) 0px,
              rgba(255, 215, 0, 0.05) 20px,
              rgba(210, 105, 30, 0.05) 20px,
              rgba(210, 105, 30, 0.05) 40px
            )
          `,
          animation: isMobile ? "none" : "spinSlow 60s linear infinite",
          pointerEvents: "none",
        }}
      />

      {/* Fireworks Effect (fewer for mobile) */}
      {showFireworks && (
        <>
          {[...Array(isMobile ? 8 : 15)].map((_, i) => (
            <div
              key={i}
              className="firework"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                background: `radial-gradient(circle, ${["#ff0", "#f0f", "#0ff", "#ff9900"][Math.floor(Math.random() * 4)]} 0%, transparent 70%)`,
              }}
            />
          ))}
        </>
      )}

      {/* Main Content */}
      <div
        style={{
          maxWidth: isMobile ? "100%" : 1100,
          margin: "0 auto",
          position: "relative",
          zIndex: 10,
          marginTop:50,
          padding: isMobile ? "20px 0" : "0",
        }}
      >
        {/* Games Grid - Optimized for mobile */}
        <Row gutter={[isMobile ? 16 : 24, isMobile ? 16 : 24]} justify="center">
          {data.map((game, index) => {
            const isCompleted = completedGames[game.key];
            const isLocked =
              activeGame && activeGame !== game.route && !isCompleted;

            return (
              <Col xs={24} sm={12} md={8} key={game.key}>
                <div
                  className="games-card-animate"
                  style={{
                    animationDelay: `${index * 0.12}s`,
                  }}
                >
                  <Card
                    hoverable={!isLocked}
                    onClick={() => !isLocked && quickPlay(game)}
                    className="games-home-card"
                    style={{
                      borderRadius: isMobile ? 20 : 24,
                      overflow: "hidden",
                      cursor: isLocked ? "not-allowed" : "pointer",
                      border: "none",
                      position: "relative",
                      background: isCompleted
                        ? "linear-gradient(135deg, #f6ffed, #d9f7be)"
                        : "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      opacity: isLocked ? 0.6 : 1,
                      minHeight: isMobile ? 280 : 300,
                      transform: isLocked ? "scale(0.98)" : "scale(1)",
                      margin: isMobile ? "0" : "0",
                      WebkitTapHighlightColor: "transparent",
                    }}
                    bodyStyle={{
                      padding: isMobile ? 16 : 24,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: isMobile ? 280 : 300,
                    }}
                  >
                    {/* Status Badges - Adjusted for mobile */}
                    {isCompleted && (
                      <div
                        style={{
                          position: "absolute",
                          top: isMobile ? 8 : 12,
                          right: isMobile ? 8 : 12,
                          background: "#52c41a",
                          color: "white",
                          padding: isMobile ? "2px 8px" : "4px 12px",
                          borderRadius: 20,
                          fontSize: isMobile ? 10 : 12,
                          display: "flex",
                          alignItems: "center",
                          gap: isMobile ? 2 : 4,
                          zIndex: 10,
                          boxShadow: "0 4px 12px rgba(82,196,26,0.3)",
                        }}
                      >
                        <CheckCircleOutlined
                          style={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        {isMobile ? "සම්පූර්ණයි" : "සම්පූර්ණයි"}
                      </div>
                    )}

                    {isLocked && !isCompleted && (
                      <div
                        style={{
                          position: "absolute",
                          top: isMobile ? 8 : 12,
                          right: isMobile ? 8 : 12,
                          background: "rgba(0,0,0,0.6)",
                          color: "white",
                          width: isMobile ? 30 : 36,
                          height: isMobile ? 30 : 36,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                          backdropFilter: "blur(5px)",
                        }}
                      >
                        <LockOutlined
                          style={{ fontSize: isMobile ? 14 : 16 }}
                        />
                      </div>
                    )}

                    {activeGame === game.route && !isCompleted && (
                      <div
                        style={{
                          position: "absolute",
                          top: isMobile ? 8 : 12,
                          left: isMobile ? 8 : 12,
                          background: "#FFD700",
                          color: "#8B4513",
                          padding: isMobile ? "2px 8px" : "4px 12px",
                          borderRadius: 20,
                          fontSize: isMobile ? 10 : 12,
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: isMobile ? 2 : 4,
                          zIndex: 10,
                          boxShadow: "0 4px 12px rgba(255,215,0,0.3)",
                          maxWidth: isMobile ? "70%" : "auto",
                        }}
                      >
                        <FireOutlined
                          style={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        {isMobile ? "ක්‍රීඩා කරමින්" : "ක්‍රීඩා කරන්න"}
                      </div>
                    )}

                    <div style={{ textAlign: "center" }}>
                      {/* Icon with glow effect - Smaller on mobile */}
                      <div
                        style={{
                          width: isMobile ? 60 : 80,
                          height: isMobile ? 60 : 80,
                          borderRadius: "50%",
                          margin: isMobile ? "0 auto 12px" : "0 auto 16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: isMobile ? 30 : 40,
                          background: game.gradient,
                          boxShadow: `0 15px 25px ${game.color}40`,
                          animation: "gentleFloat 3s ease-in-out infinite",
                        }}
                      >
                        {game.icon}
                      </div>

                      <h3
                        style={{
                          fontSize: isMobile ? 16 : 18,
                          fontWeight: 800,
                          marginBottom: isMobile ? 8 : 10,
                          color: "#5c3b14",
                          minHeight: isMobile ? 44 : 52,
                          lineHeight: 1.3,
                          padding: isMobile ? "0 4px" : 0,
                        }}
                      >
                        {game.option}
                      </h3>

                      <p
                        style={{
                          color: "#666",
                          fontSize: isMobile ? 12 : 14,
                          marginBottom: isMobile ? 12 : 16,
                          minHeight: isMobile ? 32 : 40,
                          lineHeight: 1.4,
                          padding: isMobile ? "0 4px" : 0,
                        }}
                      >
                        {game.description}
                      </p>
                    </div>

                    <Button
                      disabled={isLocked || isCompleted}
                      block
                      style={{
                        marginTop: "auto",
                        borderRadius: 30,
                        fontWeight: "bold",
                        height: isMobile ? 40 : 44,
                        fontSize: isMobile ? 13 : 14,
                        background: isCompleted
                          ? "linear-gradient(135deg, #52c41a, #389e0d)"
                          : isLocked
                            ? "#d9d9d9"
                            : game.gradient,
                        color: "#fff",
                        border: "none",
                        boxShadow: `0 8px 16px ${game.color}60`,
                        transition: "all 0.3s ease",
                        touchAction: "manipulation", // Better touch response
                      }}
                      onTouchStart={(e) => {
                        if (!isLocked && !isCompleted && isMobile) {
                          e.currentTarget.style.transform = "scale(0.95)";
                        }
                      }}
                      onTouchEnd={(e) => {
                        if (!isLocked && !isCompleted && isMobile) {
                          e.currentTarget.style.transform = "scale(1)";
                        }
                      }}
                      onMouseEnter={(e) => {
                        if (!isLocked && !isCompleted && !isMobile) {
                          e.currentTarget.style.transform =
                            "translateY(-2px) scale(1.02)";
                          e.currentTarget.style.boxShadow = `0 12px 24px ${game.color}80`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLocked && !isCompleted && !isMobile) {
                          e.currentTarget.style.transform =
                            "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow = `0 8px 16px ${game.color}60`;
                        }
                      }}
                    >
                      {isCompleted
                        ? isMobile
                          ? "✅ සම්පූර්ණයි"
                          : "සම්පූර්ණයි ✅"
                        : isLocked
                          ? isMobile
                            ? "🔒 අගුළු දමා ඇත"
                            : "අගුළු දමා ඇත 🔒"
                          : isMobile
                            ? "🎮 ක්‍රීඩා කරන්න"
                            : "දැන් ක්‍රීඩා කරන්න 🎮"}
                    </Button>
                  </Card>
                </div>
              </Col>
            );
          })}
        </Row>

        {/* Bonus Section - Responsive */}
        {allGamesDone && (
          <div
            className="games-card-animate"
            style={{
              textAlign: "center",
              marginTop: isMobile ? 30 : 40,
              animationDelay: `${data.length * 0.12 + 0.2}s`,
              padding: isMobile ? "0 10px" : 0,
            }}
          >
            <Card
              className="games-glow-icon"
              style={{
                maxWidth: isMobile ? "100%" : 500,
                margin: "0 auto",
                borderRadius: isMobile ? 20 : 30,
                border: "3px solid gold",
                background: "linear-gradient(135deg, #FFF9E6, #FFE4B5)",
                boxShadow: "0 25px 45px rgba(255,215,0,0.3)",
                overflow: "hidden",
                position: "relative",
              }}
              bodyStyle={{ padding: isMobile ? 20 : 32 }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -50,
                  left: -50,
                  width: isMobile ? 80 : 100,
                  height: isMobile ? 80 : 100,
                  background:
                    "radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)",
                  borderRadius: "50%",
                  animation: "spinSlow 10s linear infinite",
                }}
              />

              <div style={{ position: "relative", zIndex: 2 }}>
                <div
                  style={{
                    fontSize: isMobile ? 48 : 64,
                    marginBottom: isMobile ? 12 : 16,
                    animation: "gentleFloat 2s ease-in-out infinite",
                  }}
                >
                  🎁
                </div>

                <h2
                  style={{
                    color: "#8B4513",
                    fontSize: isMobile ? 24 : 32,
                    fontWeight: 800,
                    marginBottom: isMobile ? 8 : 12,
                  }}
                >
                  {isMobile ? "Bonus Unlocked!" : "Bonus Unlocked! 🎉"}
                </h2>

                <p
                  style={{
                    color: "#D2691E",
                    fontSize: isMobile ? 14 : 16,
                    marginBottom: isMobile ? 16 : 20,
                  }}
                >
                  {isMobile
                    ? "සියලුම ක්‍රීඩා සම්පූර්ණ කළා!"
                    : "ඔබ සියලුම ක්‍රීඩා සාර්ථකව සම්පූර්ණ කළා!"}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: isMobile ? 8 : 16,
                    marginBottom: isMobile ? 20 : 24,
                    flexWrap: "wrap",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      ...styles.rewardBadge,
                      ...(isMobile && {
                        width: "100%",
                        justifyContent: "center",
                      }),
                    }}
                  >
                    <span
                      style={{ fontSize: isMobile ? 20 : 24, marginRight: 8 }}
                    >
                      🎡
                    </span>
                    {isMobile ? "වාසනාවන්ත රෝදය" : "වාසනාවන්ත රෝදය"}
                  </div>
                  <div
                    style={{
                      ...styles.rewardBadge,
                      ...(isMobile && {
                        width: "100%",
                        justifyContent: "center",
                      }),
                    }}
                  >
                    <span
                      style={{ fontSize: isMobile ? 20 : 24, marginRight: 8 }}
                    >
                      🏆
                    </span>
                    {isMobile ? "රන් පදක්කම" : "රන් පදක්කම"}
                  </div>
                </div>

                <Button
                  type="primary"
                  size={isMobile ? "middle" : "large"}
                  onClick={() => setShowBonus(true)}
                  style={{
                    borderRadius: 40,
                    height: isMobile ? 48 : 54,
                    padding: isMobile ? "0 24px" : "0 40px",
                    fontSize: isMobile ? 16 : 18,
                    fontWeight: "bold",
                    background: "linear-gradient(135deg, #faad14, #d48806)",
                    border: "none",
                    boxShadow: "0 15px 30px rgba(250,173,20,0.4)",
                    transition: "all 0.3s ease",
                    width: isMobile ? "100%" : "auto",
                    touchAction: "manipulation",
                  }}
                  onTouchStart={(e) => {
                    if (isMobile) {
                      e.currentTarget.style.transform = "scale(0.95)";
                    }
                  }}
                  onTouchEnd={(e) => {
                    if (isMobile) {
                      e.currentTarget.style.transform = "scale(1)";
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform =
                        "translateY(-3px) scale(1.02)";
                      e.currentTarget.style.boxShadow =
                        "0 20px 40px rgba(250,173,20,0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform =
                        "translateY(0) scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 15px 30px rgba(250,173,20,0.4)";
                    }
                  }}
                >
                  <GiftOutlined /> {isMobile ? "Spin" : "Spin the Wheel"} 🎡
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Session Controls - Responsive */}
        <div
          className="games-card-animate"
          style={{
            textAlign: "center",
            marginTop: isMobile ? 30 : 40,
            marginBottom: isMobile ? 20 : 40,
            animationDelay: `${(data.length + 1) * 0.12 + 0.3}s`,
            padding: isMobile ? "0 10px" : 0,
          }}
        >
          <Card
            style={{
              maxWidth: isMobile ? "100%" : 450,
              margin: "0 auto",
              borderRadius: isMobile ? 20 : 30,
              border: "2px dashed #ff4d4f",
              background: "linear-gradient(135deg, #FFF1F0, #FFE6E6)",
              boxShadow: "0 20px 40px rgba(255,77,79,0.2)",
              backdropFilter: "blur(5px)",
            }}
            bodyStyle={{ padding: isMobile ? 20 : 24 }}
          >
            <h3
              style={{
                color: "#a8071a",
                fontSize: isMobile ? 20 : 22,
                fontWeight: 800,
                marginBottom: isMobile ? 8 : 12,
              }}
            >
              🛑 {isMobile ? "Session" : "Session Controls"}
            </h3>

            <p
              style={{
                color: "#555",
                marginBottom: isMobile ? 16 : 20,
                fontSize: isMobile ? 14 : 16,
              }}
            >
              {isMobile
                ? "සියලු ප්‍රගතිය ඉවත් කර නැවත ආරම්භ කරන්න"
                : "සියලු ක්‍රීඩා ප්‍රගතිය ඉවත් කර නැවත ආරම්භ කරන්න"}
            </p>

            <Button
              danger
              size={isMobile ? "middle" : "large"}
              onClick={handleEndSession}
              style={{
                borderRadius: 30,
                height: isMobile ? 44 : 48,
                padding: isMobile ? "0 24px" : "0 32px",
                fontWeight: "bold",
                fontSize: isMobile ? 14 : 16,
                background: "linear-gradient(135deg, #ff4d4f, #cf1322)",
                border: "none",
                boxShadow: "0 15px 30px rgba(207,19,34,0.3)",
                transition: "all 0.3s ease",
                width: isMobile ? "100%" : "auto",
                touchAction: "manipulation",
              }}
              onTouchStart={(e) => {
                if (isMobile) {
                  e.currentTarget.style.transform = "scale(0.95)";
                }
              }}
              onTouchEnd={(e) => {
                if (isMobile) {
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform =
                    "translateY(-3px) scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(207,19,34,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 30px rgba(207,19,34,0.3)";
                }
              }}
            >
              {isMobile ? "End Session" : "End Session / Exit"}
            </Button>
          </Card>
        </div>
      </div>

      <BonusSpinModal open={showBonus} onClose={() => setShowBonus(false)} />
    </div>
  );
}

const styles = {
  rewardBadge: {
    background: "rgba(255, 215, 0, 0.15)",
    padding: "8px 16px",
    borderRadius: 30,
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    color: "#8B4513",
    border: "1px solid rgba(255, 215, 0, 0.3)",
  },
};
