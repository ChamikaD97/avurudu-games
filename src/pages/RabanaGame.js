import { Card, Button, message } from "antd";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GiftOutlined,
  StarOutlined,
  FireOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import Timer from "../components/Timer";
import { checkUser } from "../api/api";
import rabana from "../assets/rabana.png";
import GameEndModal from "../components/GameEndModal";
import tapSound from "../assets/sounds/raban.mp3";
import { submitRabanaGame } from "../api/gameApi";

export default function RabanaGame({ player }) {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [startClicked, setStartClicked] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [checkingUser, setCheckingUser] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [ripple, setRipple] = useState({ show: false, x: 0, y: 0 });
  const [combo, setCombo] = useState(0);
  const [particles, setParticles] = useState([]);

  const audioRef = useRef(null);

  // Track mouse for parallax effect
  useEffect(() => {
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
  }, []);

  // Generate particles on tap
  const createParticles = (x, y) => {
    const newParticles = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: x,
        y: y,
        angle: i * 45 * (Math.PI / 180),
        delay: i * 0.03,
      });
    }
    setParticles([...particles, ...newParticles]);

    setTimeout(() => {
      setParticles([]);
    }, 500);
  };

  // Inject enhanced animations
  useEffect(() => {
    const styleId = "rabana-festival-animations";
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

      @keyframes pulseGlow {
        0%, 100% {
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.3));
        }
        50% {
          filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.6));
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

      @keyframes drumHit {
        0% { transform: scale(1); }
        30% { transform: scale(0.85) rotate(-5deg); }
        60% { transform: scale(1.05) rotate(3deg); }
        100% { transform: scale(1); }
      }

      @keyframes drumIdle {
        0%, 100% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.02) rotate(-1deg); }
        75% { transform: scale(1.02) rotate(1deg); }
      }

      @keyframes comboPop {
        0% { transform: scale(0.5); opacity: 0; }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); opacity: 1; }
      }

      @keyframes ripple {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
      }

      .game-card {
        animation: floatIn 0.7s ease forwards;
      }

      .rabana-image {
        transition: all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        cursor: pointer;
        filter: drop-shadow(0 12px 20px rgba(139, 69, 19, 0.3));
        animation: drumIdle 2s ease-in-out infinite;
      }

      .rabana-image:hover {
        transform: scale(1.05);
        filter: drop-shadow(0 20px 30px rgba(255, 215, 0, 0.4));
      }

      .rabana-image.hit-animation {
        animation: drumHit 0.2s ease;
      }

      .floating-element {
        position: absolute;
        pointer-events: none;
        opacity: 0.5;
        animation: gentleFloat var(--duration) ease-in-out infinite;
        animation-delay: var(--delay);
        filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.3));
      }

      .ripple-effect {
        position: absolute;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 215, 0, 0.5) 0%, rgba(255, 215, 0, 0) 70%);
        animation: ripple 0.4s ease-out;
        pointer-events: none;
        transform: translate(-50%, -50%);
      }

      .particle {
        position: fixed;
        width: 6px;
        height: 6px;
        background: #ffd700;
        border-radius: 50%;
        pointer-events: none;
        animation: particleFly 0.5s ease-out forwards;
        z-index: 1000;
        box-shadow: 0 0 10px #ffd700;
      }

      @keyframes particleFly {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) 
                     translate(calc(cos(var(--angle)) * 60px), 
                             calc(sin(var(--angle)) * 60px)) 
                     scale(0);
          opacity: 0;
        }
      }

      .stat-card {
        animation: gentleFloat 3s ease-in-out infinite;
        transition: all 0.3s ease;
      }

      .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.15);
      }

      .combo-text {
        animation: comboPop 0.3s ease;
        color: #FFD700;
        font-weight: bold;
      }

      .beat-indicator {
        display: flex;
        gap: 4px;
        justify-content: center;
        margin-top: 10px;
      }

      .beat-bar {
        width: 8px;
        height: 20px;
        background: #FFD700;
        border-radius: 4px;
        transition: height 0.1s ease;
      }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio(tapSound);
    audioRef.current.volume = 1;
  }, []);

  const handleFinish = async () => {
    try {
      const res = await submitRabanaGame({
        name: player?.name || "Guest",
        phone: player?.phone || "N/A",
        score: score,
      });

      if (res) {
        localStorage.setItem("game_rabana_done", "true");
      }
      setFinished(true);
      setShowModal(true);
    } catch (err) {
      console.log("Failed to save");
    }
  };

  const tap = (e) => {
    if (!gameStarted || finished) return;

    const rect = e.target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const now = Date.now();
    const diff = now - lastTap;

    // Calculate combo
    if (diff < 250) {
      setCombo((prev) => prev + 1);
      setScore((prev) => prev + 2);
    } else {
      setCombo(0);
      setScore((prev) => prev + 1);
    }

    setLastTap(now);

    // Visual effects
    setAnimate(true);
    setRipple({ show: true, x: centerX, y: centerY });
    createParticles(centerX, centerY);

    setTimeout(() => setAnimate(false), 150);
    setTimeout(() => setRipple({ show: false, x: 0, y: 0 }), 300);

    // Play sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .catch((e) => console.log("Audio play failed:", e));
    }
  };

  useEffect(() => {
    if (!startClicked) return;

    if (countdown === 0) {
      setGameStarted(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, startClicked]);

  const restartGame = () => {
    setScore(0);
    setFinished(false);
    setStartClicked(false);
    setCountdown(3);
    setGameStarted(false);
    setAnimate(false);
    setLastTap(0);
    setCheckingUser(false);
    setCombo(0);
    setParticles([]);
  };

  // Generate beat bars based on tap frequency
  const beatBars = [];
  for (let i = 0; i < 5; i++) {
    beatBars.push({
      height:
        lastTap && Date.now() - lastTap < 500 ? 30 + Math.random() * 20 : 20,
    });
  }

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 30% 30%, #8B4513, #D2691E, #CD853F)",
        padding: "30px 16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Pattern */}
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
              rgba(255, 215, 0, 0.08) 0px,
              rgba(255, 215, 0, 0.08) 20px,
              rgba(210, 105, 30, 0.08) 20px,
              rgba(210, 105, 30, 0.08) 40px
            )
          `,
          animation: "spinSlow 60s linear infinite",
          pointerEvents: "none",
        }}
      />

      {/* Floating Decorative Elements */}
      <div
        className="floating-element"
        style={{
          top: "10%",
          left: "5%",
          fontSize: 48,
          "--duration": "12s",
          "--delay": "0s",
          transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
        }}
      >
        🥁
      </div>
      <div
        className="floating-element"
        style={{
          top: "80%",
          right: "5%",
          fontSize: 36,
          "--duration": "15s",
          "--delay": "2s",
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
        }}
      >
        🪔
      </div>
      <div
        className="floating-element"
        style={{
          top: "20%",
          right: "15%",
          fontSize: 42,
          "--duration": "10s",
          "--delay": "1s",
          transform: `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * 0.4}px)`,
        }}
      >
        🎵
      </div>
      <div
        className="floating-element"
        style={{
          bottom: "15%",
          left: "10%",
          fontSize: 40,
          "--duration": "14s",
          "--delay": "3s",
          transform: `translate(${mousePosition.x * 0.6}px, ${mousePosition.y * 0.6}px)`,
        }}
      >
        ✨
      </div>
      <div
        className="floating-element"
        style={{
          top: "40%",
          right: "20%",
          fontSize: 32,
          "--duration": "11s",
          "--delay": "1.5s",
          transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`,
        }}
      >
        🔊
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "100%",
          maxWidth: 620,
          position: "relative",
          zIndex: 10,
        }}
      >
        <Card
          className="game-card"
          style={{
            borderRadius: 32,
            background: "rgba(255, 248, 240, 0.97)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 30px 60px rgba(139, 69, 19, 0.3)",
            border: "2px solid #FFD700",
            overflow: "hidden",
          }}
          bodyStyle={{ padding: 32 }}
        >
          {/* Decorative Header */}
          <div
            style={{
              marginBottom: 24,
              paddingBottom: 16,
              borderBottom: "2px dashed #FFD700",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -10,
                left: -10,
                width: 60,
                height: 60,
                background:
                  "radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)",
                borderRadius: "50%",
                animation: "spinSlow 15s linear infinite",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <ThunderboltOutlined style={{ color: "#FFD700", fontSize: 24 }} />
              <span style={{ color: "#8B4513", fontWeight: 600, fontSize: 16 }}>
                රබාන වාදනය
              </span>
              <ThunderboltOutlined style={{ color: "#FFD700", fontSize: 24 }} />
            </div>

            <div
              style={{
                fontSize: 60,
                textAlign: "center",
                marginBottom: 10,
                animation: "gentleFloat 3s ease-in-out infinite",
              }}
            >
              🥁
            </div>

            <h2
              style={{
                margin: "12px 0 8px",
                color: "#8B4513",
                fontSize: 32,
                fontWeight: 800,
                textAlign: "center",
                background: "linear-gradient(135deg, #8B4513, #D2691E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              රබානට තට්ටු කරන්න
            </h2>

            <p style={{ textAlign: "center", color: "#7a7a7a", fontSize: 15 }}>
              හැකි තරම් ඉක්මනින් රබානට තට්ටු කරලා, අඛණ්ඩ වේගවත් තට්ටු කිරීමෙන්
              වැඩි ලකුණු ලබාගන්න!
            </p>
          </div>

          {/* Start Screen */}
          {!startClicked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                background: "linear-gradient(135deg, #FFF8E7, #FFEBCD)",
                border: "2px solid #FFD700",
                borderRadius: 24,
                padding: "24px 20px",
                marginBottom: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 54,
                  marginBottom: 10,
                  animation: "gentleFloat 2s ease-in-out infinite",
                }}
              >
                🎯
              </div>

              <h3
                style={{
                  marginBottom: 10,
                  color: "#8B4513",
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                වාදනයට සූදානම්ද?
              </h3>

              <p
                style={{
                  marginBottom: 18,
                  color: "#5f5f5f",
                  lineHeight: 1.7,
                  fontSize: 15,
                }}
              >
                කාලය අවසන් වීමට පෙර හැකි තරම් ඉක්මනින් රබානට තට්ටු කරන්න
              </p>

              <Button
                type="primary"
                size="large"
                onClick={() => setStartClicked(true)}
                style={{
                  height: 50,
                  padding: "0 28px",
                  borderRadius: 30,
                  background: "linear-gradient(135deg, #E44D2E, #F9A826)",
                  border: "none",
                  fontWeight: 700,
                  fontSize: 16,
                  boxShadow: "0 10px 24px rgba(228,77,46,0.3)",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-3px) scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 30px rgba(228,77,46,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 24px rgba(228,77,46,0.3)";
                }}
              >
                ක්‍රීඩාව ආරම්භ කරන්න
              </Button>
            </motion.div>
          )}

          {/* Countdown */}
          {startClicked && !gameStarted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                padding: "24px 16px",
                marginBottom: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <h2 style={{ marginBottom: 20, color: "#8B4513" }}>
                ආරම්භ වීමට තව තත්පර
              </h2>
              <div
                style={{
                  width: 120,
                  height: 120,
                  margin: "0 auto 14px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #E44D2E, #F9A826)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 52,
                  fontWeight: 800,
                  boxShadow: "0 12px 30px rgba(228,77,46,0.3)",
                  animation: "pulseGlow 1s ease infinite",
                }}
              >
                {countdown}
              </div>
              <p style={{ color: "#777", marginTop: 25 }}>
                හැකි තරම් වේගයෙන් තට්ටු කරන්න සූදානම් වෙන්න!
              </p>
            </motion.div>
          )}

          {/* Game Stats */}
          {gameStarted && !finished && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 14,
                flexWrap: "wrap",
                marginBottom: 22,
              }}
            >
              <div
                className="stat-card"
                style={{
                  minWidth: 150,
                  background: "linear-gradient(135deg, #FFF8E7, #FFE4B5)",
                  border: "2px solid #FFD700",
                  borderRadius: 20,
                  padding: "14px 18px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "#8B4513",
                    fontWeight: 700,
                    marginBottom: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <ClockCircleOutlined /> ඉතිරි වේලාව
                </div>

                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#E44D2E",
                  }}
                >
                  <Timer
                    seconds={10}
                    onFinish={() => {
                      setFinished(true);
                      handleFinish();
                    }}
                  />
                </div>
              </div>

              <div
                className="stat-card"
                style={{
                  minWidth: 150,
                  background: "linear-gradient(135deg, #E8F5E9, #C8E6C9)",
                  border: "2px solid #4CAF50",
                  borderRadius: 20,
                  padding: "14px 18px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "#2E7D32",
                    fontWeight: 700,
                    marginBottom: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <TrophyOutlined /> ලකුණු
                </div>

                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#2E7D32",
                  }}
                >
                  {score}
                </div>

                {combo > 1 && (
                  <div
                    className="combo-text"
                    style={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      background: "#FFD700",
                      borderRadius: 20,
                      padding: "4px 8px",
                      fontSize: 12,
                      color: "#8B4513",
                    }}
                  >
                    Combo x{combo}!
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Rabana Drum */}
          {gameStarted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                marginBottom: 16,
                position: "relative",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src={rabana}
                alt="rabana"
                className={`rabana-image ${animate ? "hit-animation" : ""}`}
                style={{
                  width: 240,
                  maxWidth: "100%",
                  cursor: "pointer",
                }}
                onClick={tap}
              />

              {/* Ripple effect */}
              {ripple.show && (
                <div
                  className="ripple-effect"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                  }}
                />
              )}

              {/* Particles */}
              {particles.map((particle) => (
                <div
                  key={particle.id}
                  className="particle"
                  style={{
                    left: particle.x,
                    top: particle.y,
                    "--angle": particle.angle,
                    animationDelay: `${particle.delay}s`,
                  }}
                />
              ))}

              {/* Beat indicator */}
              {gameStarted && !finished && (
                <div className="beat-indicator">
                  {beatBars.map((bar, i) => (
                    <div
                      key={i}
                      className="beat-bar"
                      style={{
                        height: bar.height,
                        opacity:
                          lastTap && Date.now() - lastTap < 500 ? 1 : 0.3,
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Instruction */}
          {gameStarted && !finished && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                color: "#777",
                fontSize: 14,
                marginTop: 6,
                textAlign: "center",
                animation: "pulseGlow 2s ease-in-out infinite",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              ඉක්මනින් තට්ටු කර ලකුණු ලබාගන්න!{" "}
              {combo > 1 && `(Combo: +${combo} bonus)`}
            </motion.p>
          )}

          {/* Finished Screen */}
          <AnimatePresence>
            {finished && (
              <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: "linear-gradient(135deg, #FFF9E6, #FFE4B5)",
                  border: "3px solid #FFD700",
                  borderRadius: 24,
                  padding: "22px 18px",
                  marginTop: 16,
                  textAlign: "center",
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  style={{ fontSize: 64, marginBottom: 10 }}
                >
                  ⏰
                </motion.div>

                <h2 style={{ color: "#8B4513", fontSize: 28, marginBottom: 8 }}>
                  කාලය අවසන්!
                </h2>

                <div
                  style={{
                    background: "linear-gradient(135deg, #FFD700, #FFA500)",
                    padding: "20px",
                    borderRadius: 20,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{ color: "#8B4513", fontSize: 14, marginBottom: 5 }}
                  >
                    ඔබගේ අවසන් ලකුණු
                  </div>
                  <h3
                    style={{
                      color: "#8B4513",
                      fontSize: 48,
                      margin: 0,
                      fontWeight: 800,
                    }}
                  >
                    {score}
                  </h3>
                  {combo > 1 && (
                    <div style={{ color: "#8B4513", fontSize: 14 }}>
                      Combo bonus: +{combo * 2}
                    </div>
                  )}
                </div>

                <Button
                  onClick={restartGame}
                  style={{
                    height: 46,
                    borderRadius: 23,
                    fontWeight: 700,
                    border: "2px solid #FFD700",
                    background: "white",
                    color: "#8B4513",
                    transition: "all 0.3s ease",
                    padding: "0 30px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 20px rgba(255,215,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  නැවත ක්‍රීඩා කරන්න
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Decorative Footer */}
          <div
            style={{
              marginTop: 24,
              display: "flex",
              justifyContent: "center",
              gap: 16,
              opacity: 0.6,
            }}
          >
            <span
              style={{
                fontSize: 20,
                animation: "gentleFloat 3s ease-in-out infinite",
              }}
            >
              🥁
            </span>
            <span
              style={{
                fontSize: 20,
                animation: "gentleFloat 3.5s ease-in-out infinite",
              }}
            >
              🎵
            </span>
            <span
              style={{
                fontSize: 20,
                animation: "gentleFloat 4s ease-in-out infinite",
              }}
            >
              ✨
            </span>
            <span
              style={{
                fontSize: 20,
                animation: "gentleFloat 2.5s ease-in-out infinite",
              }}
            >
              🌟
            </span>
          </div>
        </Card>
      </motion.div>

      <GameEndModal
        open={showModal}
        gameName="රබානට තට්ටු කරන්න"
        onClose={() => navigate("/")}
      />
    </div>
  );
}
