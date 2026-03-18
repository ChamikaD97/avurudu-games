import { Card, Button, message } from "antd";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GiftOutlined, 
  FireOutlined,
  StarOutlined,
  ThunderboltOutlined,
  HeartOutlined
} from "@ant-design/icons";
import { checkUser } from "../api/api";
import pot from "../assets/claypot.png";
import pot2 from "../assets/claypot2.png";
import pot3 from "../assets/claypot3.png";
import pot4 from "../assets/claypot4.png";
import GameEndModal from "../components/GameEndModal";
import hitSound from "../assets/sounds/hit.mp3";
import breakSound from "../assets/sounds/break.mp3";
import { submitBreakPotGame } from "../api/gameApi";

export default function BreakPot({ player }) {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const [hits, setHits] = useState(0);
  const [broken, setBroken] = useState(false);
  const [startClicked, setStartClicked] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [finalTime, setFinalTime] = useState(null);
  const [checkingUser, setCheckingUser] = useState(false);
  const [potPressed, setPotPressed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hitEffect, setHitEffect] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [particles, setParticles] = useState([]);
  const [crackLevel, setCrackLevel] = useState(0);

  const hitAudioRef = useRef(null);
  const breakAudioRef = useRef(null);
  const potRef = useRef(null);

  const MAX_HITS = 8;
  const remainingHits = MAX_HITS - hits;

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

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    hitAudioRef.current = new Audio(hitSound);
    hitAudioRef.current.volume = 0.5;

    breakAudioRef.current = new Audio(breakSound);
    breakAudioRef.current.volume = 0.7;
  }, []);

  // Update crack level based on hits
  useEffect(() => {
    if (hits > 0 && hits < MAX_HITS) {
      setCrackLevel(Math.floor((hits / MAX_HITS) * 100));
    }
  }, [hits]);

  // Inject enhanced animations
  useEffect(() => {
    const styleId = "breakpot-festival-animations";
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

      @keyframes crackAppear {
        0% {
          opacity: 0;
          transform: scale(0);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes potShake {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-8deg) scale(0.95); }
        50% { transform: rotate(8deg) scale(0.9); }
        75% { transform: rotate(-4deg) scale(0.92); }
      }

      @keyframes hitRipple {
        0% {
          box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7);
        }
        100% {
          box-shadow: 0 0 0 50px rgba(255, 215, 0, 0);
        }
      }

      .game-card {
        animation: floatIn 0.7s ease forwards;
      }

      .pot-image {
        transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        cursor: pointer;
        filter: drop-shadow(0 12px 20px rgba(139, 69, 19, 0.3));
      }

      .pot-image:hover {
        transform: scale(1.05);
        filter: drop-shadow(0 20px 30px rgba(255, 215, 0, 0.4));
      }

      .pot-image.pot-pressed {
        transform: scale(0.85) rotate(-8deg);
        filter: drop-shadow(0 8px 12px rgba(255, 215, 0, 0.5));
      }

      .pot-image.hit-effect {
        animation: potShake 0.3s ease;
      }

      .pot-image.break-animation {
        animation: break 0.6s ease forwards;
      }

      @keyframes break {
        0% { transform: scale(1); opacity: 1; }
        20% { transform: scale(1.3); opacity: 0.9; }
        40% { transform: scale(0.7); opacity: 0.7; }
        60% { transform: scale(1.1); opacity: 0.5; }
        80% { transform: scale(0.4); opacity: 0.3; }
        100% { transform: scale(0); opacity: 0; }
      }

      .floating-element {
        position: absolute;
        pointer-events: none;
        opacity: 0.5;
        animation: gentleFloat var(--duration) ease-in-out infinite;
        animation-delay: var(--delay);
        filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.3));
      }

      .crack-effect {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255,0,0,0.1) 0%, transparent 70%);
        pointer-events: none;
        animation: crackAppear 0.3s ease;
      }

      .hit-counter {
        animation: pulseGlow 2s ease-in-out infinite;
      }

      .stat-card {
        animation: gentleFloat 3s ease-in-out infinite;
        transition: all 0.3s ease;
      }

      .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.15);
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Generate particles on hit
  const createParticles = () => {
    const newParticles = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: i * 0.05,
        angle: (i * 45) * (Math.PI / 180),
      });
    }
    setParticles([...particles, ...newParticles]);

    setTimeout(() => {
      setParticles([]);
    }, 500);
  };

  const handleFinish = async () => {
    try {
      const res = await submitBreakPotGame({
        name: player?.name || "Guest",
        phone: player?.phone || "N/A",
        score: hits,
        time: finalTime,
      });

      if (res) {
        localStorage.setItem("game_break_pot_done", "true");
      }
    } catch (err) {
      console.log("Failed to save");
    }
  };

  const hit = () => {
    if (!gameStarted || broken) return;

    setPotPressed(true);
    setHitEffect(true);
    setShowRipple(true);
    createParticles();

    setTimeout(() => {
      setPotPressed(false);
    }, 100);

    setTimeout(() => {
      setHitEffect(false);
    }, 150);

    setTimeout(() => {
      setShowRipple(false);
    }, 300);

    const newHits = hits + 1;
    setHits(newHits);

    if (hitAudioRef.current) {
      hitAudioRef.current.currentTime = 0;
      hitAudioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }

    if (newHits >= 8) {
      setBroken(true);
      setFinalTime(time);

      setTimeout(() => {
        setShowModal(true);
      }, 600);

      if (breakAudioRef.current) {
        breakAudioRef.current.currentTime = 0;
        breakAudioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      handleFinish();
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

  useEffect(() => {
    if (!gameStarted || broken) return;

    const interval = setInterval(() => {
      setTime((prev) => prev + 0.1);
    }, 100);

    return () => clearInterval(interval);
  }, [gameStarted, broken]);

  const restartGame = () => {
    setHits(0);
    setBroken(false);
    setStartClicked(false);
    setCountdown(3);
    setGameStarted(false);
    setTime(0);
    setFinalTime(null);
    setCheckingUser(false);
    setPotPressed(false);
    setHitEffect(false);
    setShowRipple(false);
    setParticles([]);
    setCrackLevel(0);
  };

  // Determine pot image based on remaining hits
  const getPotImage = () => {
    if (remainingHits > 6) return pot;
    if (remainingHits > 4) return pot2;
    if (remainingHits > 2) return pot3;
    return pot4;
  };

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 30% 30%, #8B4513, #D2691E, #CD853F)",
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
          '--duration': '12s',
          '--delay': '0s',
          transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
        }}
      >
        🏺
      </div>
      <div
        className="floating-element"
        style={{
          top: "80%",
          right: "5%",
          fontSize: 36,
          '--duration': '15s',
          '--delay': '2s',
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
          '--duration': '10s',
          '--delay': '1s',
          transform: `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * 0.4}px)`,
        }}
      >
        🔨
      </div>
      <div
        className="floating-element"
        style={{
          bottom: "15%",
          left: "10%",
          fontSize: 40,
          '--duration': '14s',
          '--delay': '3s',
          transform: `translate(${mousePosition.x * 0.6}px, ${mousePosition.y * 0.6}px)`,
        }}
      >
        💥
      </div>
      <div
        className="floating-element"
        style={{
          top: "40%",
          right: "20%",
          fontSize: 32,
          '--duration': '11s',
          '--delay': '1.5s',
          transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`,
        }}
      >
        ✨
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
                background: "radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)",
                borderRadius: "50%",
                animation: "spinSlow 15s linear infinite",
              }}
            />
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
              <ThunderboltOutlined style={{ color: "#FFD700", fontSize: 24 }} />
              <span style={{ color: "#8B4513", fontWeight: 600, fontSize: 16 }}>
                කලය බිඳීමේ ක්‍රීඩාව
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
              🏺
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
              කලය බිඳන්න
            </h2>

            <p style={{ textAlign: "center", color: "#7a7a7a", fontSize: 15 }}>
              හැකි තරම් ඉක්මනින් කලයට පහර දී, කෙටිම වේලාවෙන් එය බිඳා දමන්න.
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
                බිඳීමට සූදානම්ද?
              </h3>

              <p
                style={{
                  marginBottom: 18,
                  color: "#5f5f5f",
                  lineHeight: 1.7,
                  fontSize: 15,
                }}
              >
                කලය නැවත නැවතත් පහර දී බිඳා දමන්න.
                <br />
                ඔබ ඉක්මනින් බිඳන තරමට ඔබගේ ප්‍රතිඵලය වඩා හොඳ වේ.
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
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 15px 30px rgba(228,77,46,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 10px 24px rgba(228,77,46,0.3)";
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
                කලය ඉක්මනින් බිඳීමට සූදානම් වෙන්න
              </p>
            </motion.div>
          )}

          {/* Game Stats */}
          {gameStarted && !broken && (
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
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  වේලාව
                </div>

                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#E44D2E",
                  }}
                >
                  {time.toFixed(1)}s
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
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "#2E7D32",
                    fontWeight: 700,
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  ඉතිරි පහර
                </div>

                <div
                  className="hit-counter"
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#2E7D32",
                  }}
                >
                  {remainingHits}
                </div>
              </div>
            </motion.div>
          )}

          {/* Pot Container */}
          {gameStarted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                borderRadius: 24,
                background: "linear-gradient(180deg, #FFF8E7, #FFE4B5)",
                border: "3px solid #FFD700",
                boxShadow: "inset 0 4px 12px rgba(0,0,0,0.05)",
                padding: "24px 16px",
                marginBottom: 16,
                position: "relative",
              }}
            >
              <div className="pot-container" ref={potRef} style={{ position: "relative" }}>
                <img
                  src={getPotImage()}
                  alt="pot"
                  onClick={hit}
                  className={`pot-image ${potPressed ? "pot-pressed" : ""} ${hitEffect ? "hit-effect" : ""} ${broken ? "break-animation" : ""}`}
                  style={{
                    width: 220,
                    maxWidth: "100%",
                    display: "block",
                    margin: "0 auto",
                  }}
                />

                {/* Crack effect based on hits */}
                {!broken && hits > 0 && (
                  <div
                    className="crack-effect"
                    style={{
                      opacity: hits / MAX_HITS,
                    }}
                  />
                )}

                {showRipple && <div className="ripple-effect" />}

                {particles.map((particle) => (
                  <div
                    key={particle.id}
                    className="particle"
                    style={{
                      "--x": `${(Math.random() - 0.5) * 100}px`,
                      "--y": `${(Math.random() - 0.5) * 100}px`,
                      left: `${particle.x}%`,
                      top: `${particle.y}%`,
                      background: `hsl(${45 + Math.random() * 30}, 100%, 50%)`,
                    }}
                  />
                ))}

                {/* Hit counter badge */}
                {!broken && hits > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      background: "#FFD700",
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      color: "#8B4513",
                      border: "2px solid white",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                    }}
                  >
                    {hits}
                  </div>
                )}
              </div>

              {!broken && (
                <p
                  style={{
                    color: "#777",
                    fontSize: 14,
                    marginTop: 12,
                    marginBottom: 0,
                    animation: "pulseGlow 2s ease-in-out infinite",
                  }}
                >
                  කලය බිඳෙන තුරු දිගටම පහර දෙන්න
                </p>
              )}
            </motion.div>
          )}

          {/* Broken Message */}
          <AnimatePresence>
            {broken && (
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
                  🎉
                </motion.div>

                <h2 style={{ color: "#8B4513", fontSize: 28, marginBottom: 8 }}>
                  කලය බිඳුණා!
                </h2>

                <div
                  style={{
                    background: "linear-gradient(135deg, #FFD700, #FFA500)",
                    padding: "15px",
                    borderRadius: 20,
                    marginBottom: 16,
                  }}
                >
                  <div style={{ color: "#8B4513", fontSize: 14, marginBottom: 5 }}>
                    ගත වූ කාලය
                  </div>
                  <h3
                    style={{
                      color: "#8B4513",
                      fontSize: 32,
                      margin: 0,
                      fontWeight: 800,
                    }}
                  >
                    {finalTime?.toFixed(2)}s
                  </h3>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
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
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 10px 20px rgba(255,215,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    නැවත ක්‍රීඩා කරන්න
                  </Button>
                </div>
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
            <span style={{ fontSize: 20, animation: "gentleFloat 3s ease-in-out infinite" }}>🏺</span>
            <span style={{ fontSize: 20, animation: "gentleFloat 3.5s ease-in-out infinite" }}>💥</span>
            <span style={{ fontSize: 20, animation: "gentleFloat 4s ease-in-out infinite" }}>✨</span>
            <span style={{ fontSize: 20, animation: "gentleFloat 2.5s ease-in-out infinite" }}>🔨</span>
          </div>
        </Card>
      </motion.div>

      <GameEndModal
        open={showModal}
        gameName="Break the Pot"
        onClose={() => navigate("/")}
      />
    </div>
  );
}