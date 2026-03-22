import { Card, Button, Progress } from "antd";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GameEndModal from "../components/GameEndModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  GiftOutlined,
  TrophyOutlined,
  FireOutlined,
  StarOutlined,
} from "@ant-design/icons";
import Ada from "../assets/All lotteries/Ada Sampatha - Fri.jpg";
import Dana from "../assets/All lotteries/DN- FRI.png";
import Govi from "../assets/All lotteries/GS- FRI.png";
import WINWAYLogo from "../assets/WIN WAY English Logo- PNG.png";

import Handa from "../assets/All lotteries/H- SAT.png";
import Mega from "../assets/All lotteries/MP- WED.png";
import Maha from "../assets/All lotteries/MS- FRI.png";
import Jaya from "../assets/All lotteries/Jaya - Fri.jpg";
// ✅ API
import { submitQuizGame } from "../api/gameApi";

const questions = [
  {
    question: "මල් වැනි හැඩයක් ඇති අවුරුදු කැවිලි කුමක්ද?",
    options: ["කොකිස්", "කැවුම්", "අලුවා", "අග්ගලා"],
    answer: "කොකිස්",
  },
  {
    question: "අවුරුදු ආරම්භයේදී කරන්නේ කුමක්ද?",
    options: [
      "ටීවී බලනවා",
      "ලිප ගිනි දමා කිරි බත් උයනවා",
      "වෙළඳසල් යනවා",
      "රැකියාවට යනවා",
    ],
    answer: "ලිප ගිනි දමා කිරි බත් උයනවා",
  },
  {
    question: "මේවා අතරින් අවුරුදු ක්‍රීඩාවක් වන්නේ කුමක්ද?",
    options: ["ක්‍රිකට්", "කණා මුට්ටි", "පාපන්දු", "චෙස්"],
    answer: "කණා මුට්ටි",
  },
];

export default function Game1({ player }) {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

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

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  // Inject animations
  useEffect(() => {
    const styleId = "game1-festival-animations";
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

      @keyframes shimmer {
        0% {
          background-position: -1000px 0;
        }
        100% {
          background-position: 1000px 0;
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

      .question-card {
        animation: floatIn 0.6s ease forwards;
      }

      .option-button {
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      .option-button:hover:not(:disabled) {
        transform: translateX(5px) scale(1.02);
      }

      .floating-element {
        position: absolute;
        pointer-events: none;
        opacity: 0.4;
        animation: gentleFloat var(--duration) ease-in-out infinite;
        animation-delay: var(--delay);
        filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.2));
      }

      .progress-glow {
        animation: pulseGlow 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const handleSelect = (opt) => {
    setSelected(opt);
  };

  const handleSubmit = () => {
    if (!selected) return;

    const currentQ = questions[current];

    setAnswers((prev) => [
      ...prev,
      {
        question: currentQ.question,
        selected: selected,
        correct: currentQ.answer,
        isCorrect: selected === currentQ.answer,
      },
    ]);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      handleFinish();
      setShowModal(true);
    }
  };

  const handleFinish = async () => {
    const finishTime = Date.now();
    setEndTime(finishTime);

    const timeTaken = ((finishTime - startTime) / 1000).toFixed(2);

    const finalAnswers = [
      ...answers,
      {
        question: questions[current].question,
        selected: selected,
        correct: questions[current].answer,
        isCorrect: selected === questions[current].answer,
      },
    ];

    const score = finalAnswers.filter((a) => a.isCorrect).length;

    const payload = {
      name: player?.name || "Guest",
      phone: player?.phone || "N/A",
      score,
      time: timeTaken,
      totalQuestions: questions.length,
      answers: finalAnswers,
    };

    console.log("RESULT:", payload);

    try {
      const res = await submitQuizGame(payload);

      if (res) {
        localStorage.setItem("game_quiz_done", "true");
      }
      console.log("Saved");
    } catch (err) {
      console.log("Save failed");
    }
  };

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 30% 30%, #FFE4B5, #DEB887, #8B4513)",
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
                display: "flex",
                justifyContent: "center",
                marginBottom: 0,
              }}
            >
              <motion.img
                src={WINWAYLogo}
                alt="Winway Logo"
                initial={{ opacity: 0, scale: 0.85, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.65 }}
                style={{
                  width: 120,
                  maxWidth: "80%",
                  height: "auto",
                  objectFit: "contain",
                  filter: "drop-shadow(0 8px 18px rgba(139, 69, 19, 0.18))",
                }}
              />
            </div>
            <h2
              style={{
                color: "#8B4513",
                fontSize: 20,
                fontWeight: 900,
                textAlign: "center",
                background: "linear-gradient(135deg, #8B4513, #D2691E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              WINWAY
            </h2>
            <h2
              style={{
                margin: "12px 0 8px",
                color: "#8B4513",
                fontSize: 20,
                fontWeight: 800,
                textAlign: "center",
                background: "linear-gradient(135deg, #8B4513, #D2691E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              අවුරුදු ප්‍රශ්න මාලාව
            </h2>
          </div>

          {/* Question Section */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="question-card"
                style={{
                  background: "linear-gradient(135deg, #FFF8E7, #FFEBCD)",
                  border: "2px solid #FFD700",
                  borderRadius: 24,
                  padding: "24px 20px",
                  marginBottom: 24,
                  boxShadow: "inset 0 2px 10px rgba(0,0,0,0.02)",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: "#5c3b14",
                    fontSize: 16,
                    lineHeight: 1.6,
                    fontWeight: 700,
                  }}
                >
                  {q.question}
                </h3>
              </div>

              {/* Options */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {q.options.map((opt, i) => (
                  <motion.div
                    key={opt}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Button
                      className="option-button"
                      block
                      onClick={() => handleSelect(opt)}
                      style={{
                        height: 60,
                        borderRadius: 20,
                        fontWeight: 600,
                        fontSize: 14,
                        border:
                          selected === opt
                            ? "3px solid #FFD700"
                            : "2px solid #f0f0f0",
                        background:
                          selected === opt
                            ? "linear-gradient(135deg, #FFF9E6, #FFE4B5)"
                            : "white",
                        color: selected === opt ? "#8B4513" : "#666",
                        boxShadow:
                          selected === opt
                            ? "0 10px 20px rgba(255,215,0,0.2)"
                            : "0 5px 15px rgba(0,0,0,0.05)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {opt}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: 28,
              display: "flex",
              gap: 12,
            }}
          >
            <Button
              onClick={() => {
                if (current > 0) {
                  setCurrent((prev) => prev - 1);
                  setSelected(answers[current - 1]?.selected || null);
                  setAnswers((prev) => prev.slice(0, -1));
                } else {
                  navigate("/");
                }
              }}
                   style={{
                height: 56,
                borderRadius: 30,
         
                border: "2px solid #d41717",
                background: "linear-gradient(135deg, #FFF8E1, #d41717b7)",
                color: "#554646",
                fontWeight: 700,
                fontSize: 15,
                boxShadow: "0 10px 20px rgba(212,160,23,0.18)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 16px 28px rgba(212,160,23,0.28)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 10px 20px rgba(212,160,23,0.18)";
              }}
            >
              {current > 0 ? "පෙර" : "ආපසු"}
            </Button>

            <Button
              type="primary"
              block
              disabled={!selected}
              onClick={handleSubmit}
              style={{
                height: 56,
                borderRadius: 30,
                background: selected
                  ? "linear-gradient(135deg, #27AE60, #2ECC71)"
                  : "#f0f0f0",
                border: "none",
                fontWeight: 800,
                fontSize: 15,
                boxShadow: selected
                  ? "0 15px 30px rgba(39,174,96,0.3)"
                  : "none",
                transition: "all 0.3s ease",
                color: selected ? "white" : "#999",
              }}
              onMouseEnter={(e) => {
                if (selected) {
                  e.currentTarget.style.transform =
                    "translateY(-3px) scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(39,174,96,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (selected) {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 30px rgba(39,174,96,0.3)";
                }
              }}
            >
              {current + 1 === questions.length ? "අවසන් කරන්න" : "ඊළඟ"}
            </Button>
          </motion.div>
    
    
        </Card>
      </motion.div>

      {/* Game End Modal */}
      <GameEndModal
        open={showModal}
        gameName="අවුරුදු ප්‍රශ්න මාලාව"
        onClose={() => {
          setShowModal(false);
          navigate("/");
        }}
      />
    </div>
  );
}
