import { Card, Button } from "antd";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GiftOutlined, 
  CheckCircleOutlined,
  StarOutlined,
  FireOutlined,
  BulbOutlined
} from "@ant-design/icons";
import lampsImage from "../assets/avurudu-lamps.jpeg";
import GameEndModal from "../components/GameEndModal";

// API
import { submitHiddenLampsGame } from "../api/gameApi";

export default function Game3({ player }) {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageHover, setImageHover] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const options = ["3", "4", "5", "6"];
  const correctAnswer = "4";

  const [startTime, setStartTime] = useState(null);

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
    setTimeout(() => setAnimateIn(true), 80);
    setStartTime(Date.now());
  }, []);

  // Inject animations
  useEffect(() => {
    const styleId = "game3-festival-animations";
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

      @keyframes flicker {
        0%, 100% {
          opacity: 1;
          transform: scale(1);
        }
        25% {
          opacity: 0.8;
          transform: scale(0.95);
        }
        50% {
          opacity: 1;
          transform: scale(1.05);
        }
        75% {
          opacity: 0.9;
          transform: scale(0.98);
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

      .game-card {
        animation: floatIn 0.7s ease forwards;
      }

      .option-button {
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      .option-button:hover:not(:disabled) {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 12px 24px rgba(255, 215, 0, 0.3);
      }

      .floating-element {
        position: absolute;
        pointer-events: none;
        opacity: 0.5;
        animation: gentleFloat var(--duration) ease-in-out infinite;
        animation-delay: var(--delay);
        filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.3));
      }

      .image-container {
        position: relative;
        overflow: hidden;
        border-radius: 20px;
      }

      .image-container::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        transition: left 0.5s ease;
      }

      .image-container:hover::after {
        left: 100%;
      }

      .pulse-glow {
        animation: pulseGlow 2s ease-in-out infinite;
      }

      .flicker {
        animation: flicker 3s ease-in-out infinite;
      }

      .lamp-icon {
        animation: flicker 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const handleFinish = async () => {
    if (submitting) return;

    setSubmitting(true);

    const finishTime = Date.now();
    const timeTaken = ((finishTime - startTime) / 1000).toFixed(2);

    const isCorrect = selected === correctAnswer;
    const score = isCorrect ? 1 : 0;

    const payload = {
      name: player?.name || "Guest",
      phone: player?.phone || "N/A",
      selectedAnswer: selected,
      correctAnswer,
      isCorrect,
      score,
      time: timeTaken,
    };

    try {
      await submitHiddenLampsGame(payload);
      localStorage.setItem("game_lamps_done", "true");
    } catch (err) {
      console.log("Save failed");
    }

    setShowModal(true);
    setSubmitting(false);
  };

  const handleSubmit = () => {
    if (!selected) return;
    handleFinish();
  };

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 30% 30%, #FFE4B5, #DEB887, #8B4513)",
        padding: "30px 16px",
        opacity: animateIn ? 1 : 0,
        transition: "all 0.5s ease",
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
              rgba(255, 215, 0, 0.05) 0px,
              rgba(255, 215, 0, 0.05) 20px,
              rgba(210, 105, 30, 0.05) 20px,
              rgba(210, 105, 30, 0.05) 40px
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
        🪔
      </div>
      <div
        className="floating-element flicker"
        style={{
          top: "80%",
          right: "5%",
          fontSize: 36,
          '--duration': '15s',
          '--delay': '2s',
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
        }}
      >
        🏮
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
        🌸
      </div>
      <div
        className="floating-element flicker"
        style={{
          bottom: "15%",
          left: "10%",
          fontSize: 40,
          '--duration': '14s',
          '--delay': '3s',
          transform: `translate(${mousePosition.x * 0.6}px, ${mousePosition.y * 0.6}px)`,
        }}
      >
        🕯️
      </div>
      <div
        className="floating-element"
        style={{
          top: "30%",
          right: "25%",
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
            background: "rgba(255, 255, 255, 0.97)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 30px 60px rgba(139, 69, 19, 0.25)",
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
              <BulbOutlined style={{ color: "#FFD700", fontSize: 24 }} />
              <span style={{ color: "#8B4513", fontWeight: 600, fontSize: 16 }}>
                පහන් සෙවීමේ ක්‍රීඩාව
              </span>
              <BulbOutlined style={{ color: "#FFD700", fontSize: 24 }} />
            </div>

            <div
              className="flicker"
              style={{
                fontSize: 60,
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              🏮
            </div>

            <h2
              style={{
                margin: "12px 0 8px",
                color: "#8B4513",
                fontSize: 28,
                fontWeight: 800,
                textAlign: "center",
                background: "linear-gradient(135deg, #8B4513, #D2691E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              පහන් ගණන හොයමු
            </h2>

            <p style={{ textAlign: "center", color: "#7a7a7a", fontSize: 15 }}>
              රූපය හොඳින් බලලා නිවැරදි පිළිතුර තෝරන්න!
            </p>
          </div>

          {/* QUESTION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              background: "linear-gradient(135deg, #FFF8E7, #FFEBCD)",
              border: "2px solid #FFD700",
              borderRadius: 24,
              padding: "20px 18px",
              marginBottom: 20,
            }}
          >
            <h3
              style={{
                margin: 0,
                color: "#5c3b14",
                fontSize: 22,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <FireOutlined style={{ color: "#FFD700" }} />
              රූපයේ ඇති පහන් ගණන කීයද?
              <FireOutlined style={{ color: "#FFD700" }} />
            </h3>
          </motion.div>

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="image-container"
            style={{
              background: "linear-gradient(135deg, #FFF8E7, #FFE4B5)",
              border: "3px solid #FFD700",
              borderRadius: 24,
              padding: 12,
              marginBottom: 24,
              boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={() => setImageHover(true)}
            onMouseLeave={() => setImageHover(false)}
          >
            <img
              src={lampsImage}
              alt="lamps"
              style={{
                width: "100%",
                borderRadius: 16,
                transform: imageHover ? "scale(1.05)" : "scale(1)",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                boxShadow: imageHover ? "0 20px 40px rgba(139,69,19,0.3)" : "none",
              }}
            />
            
         
            
            
          </motion.div>

          {/* Hint Message */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  background: "rgba(255, 215, 0, 0.1)",
                  border: "1px solid #FFD700",
                  borderRadius: 30,
                  padding: "12px 16px",
                  marginBottom: 16,
                  textAlign: "center",
                  fontSize: 14,
                  color: "#8B4513",
                }}
              >
                💡 ඉඟිය: පහන් පේළි වශයෙන් ගණන් කරන්න. ඉහළ පේළියේ 2ක්, පහළ පේළියේ 2ක්!
              </motion.div>
            )}
          </AnimatePresence>

          {/* OPTIONS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {options.map((opt, i) => {
              const isActive = selected === opt;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <Button
                    className="option-button"
                    block
                    onClick={() => setSelected(opt)}
                    style={{
                      height: 60,
                      borderRadius: 20,
                      fontWeight: 700,
                      fontSize: 18,
                      transition: "all 0.3s ease",
                      transform: isActive ? "scale(1.02)" : "scale(1)",
                      border: isActive
                        ? "3px solid #FFD700"
                        : "2px solid #f0f0f0",
                      background: isActive
                        ? "linear-gradient(135deg, #FFF9E6, #FFE4B5)"
                        : "white",
                      color: isActive ? "#8B4513" : "#666",
                      boxShadow: isActive
                        ? "0 15px 30px rgba(255,215,0,0.3)"
                        : "0 8px 15px rgba(0,0,0,0.05)",
                    }}
                  >
                    {opt}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* SUBMIT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              type="primary"
              block
              disabled={!selected || submitting}
              loading={submitting}
              onClick={handleSubmit}
              style={{
                marginTop: 28,
                height: 56,
                borderRadius: 30,
                background: selected
                  ? "linear-gradient(135deg, #27AE60, #2ECC71)"
                  : "#f0f0f0",
                border: "none",
                fontWeight: 800,
                fontSize: 18,
                boxShadow: selected
                  ? "0 15px 30px rgba(39,174,96,0.3)"
                  : "none",
                transition: "all 0.3s ease",
                color: selected ? "white" : "#999",
              }}
              onMouseEnter={(e) => {
                if (selected) {
                  e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(39,174,96,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (selected) {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 15px 30px rgba(39,174,96,0.3)";
                }
              }}
            >
              <CheckCircleOutlined /> පිළිතුර යොමු කරන්න
            </Button>
          </motion.div>

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
            <span className="flicker" style={{ fontSize: 20 }}>🏮</span>
            <span style={{ fontSize: 20, animation: "gentleFloat 3s ease-in-out infinite" }}>🌸</span>
            <span className="flicker" style={{ fontSize: 20, animationDelay: "1s" }}>🪔</span>
            <span style={{ fontSize: 20, animation: "gentleFloat 3.5s ease-in-out infinite" }}>🌺</span>
            <span className="flicker" style={{ fontSize: 20, animationDelay: "2s" }}>🕯️</span>
          </div>

        
        
        </Card>
      </motion.div>

      <GameEndModal
        open={showModal}
        gameName="Hidden Lamps"
        onClose={() => navigate("/")}
      />
    </div>
  );
}