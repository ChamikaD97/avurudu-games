import { Card, Input, Button, message } from "antd";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  UserOutlined, 
  PhoneOutlined,
  StarOutlined,
  GiftOutlined,
  SafetyOutlined
} from "@ant-design/icons";
import "./Welcome.css";

export default function Welcome({ setPlayer }) {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [mobileFocused, setMobileFocused] = useState(false);

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

  // Load saved player
  useEffect(() => {
    const saved = localStorage.getItem("player");
    if (saved) {
      const data = JSON.parse(saved);
      setName(data.name || "");
      setMobile(data.phone || data.mobile || "");
    }
  }, []);

  // Inject enhanced animations
  useEffect(() => {
    const styleId = "welcome-festival-animations";
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

      @keyframes shimmer {
        0% {
          background-position: -1000px 0;
        }
        100% {
          background-position: 1000px 0;
        }
      }

      @keyframes borderGlow {
        0%, 100% {
          border-color: #FFD700;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }
        50% {
          border-color: #FFA500;
          box-shadow: 0 0 40px rgba(255, 165, 0, 0.5);
        }
      }

      .welcome-container {
        min-height: 100vh;
        background: radial-gradient(circle at 30% 30%, #8B4513, #D2691E, #CD853F);
        padding: 30px 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
      }

      .welcome-card {
        animation: floatIn 0.8s ease forwards;
        background: rgba(255, 248, 240, 0.97) !important;
        backdrop-filter: blur(10px) !important;
        border: 3px solid #FFD700 !important;
        border-radius: 40px !important;
        box-shadow: 0 30px 60px rgba(139, 69, 19, 0.3) !important;
        max-width: 500px;
        width: 100%;
        position: relative;
        overflow: hidden;
      }

      .floating-element {
        position: absolute;
        pointer-events: none;
        opacity: 0.5;
        animation: gentleFloat var(--duration) ease-in-out infinite;
        animation-delay: var(--delay);
        filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.3));
      }

      .welcome-input {
        height: 56px !important;
        border-radius: 30px !important;
        border: 2px solid #FFD700 !important;
        padding: 0 24px !important;
        font-size: 16px !important;
        transition: all 0.3s ease !important;
        background: white !important;
      }

      .welcome-input:hover {
        border-color: #FFA500 !important;
        box-shadow: 0 10px 20px rgba(255, 215, 0, 0.2) !important;
      }

      .welcome-input:focus {
        border-color: #FFD700 !important;
        box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3) !important;
      }

      .start-btn {
        height: 56px !important;
        border-radius: 30px !important;
        font-weight: 700 !important;
        font-size: 18px !important;
        background: linear-gradient(135deg, #27AE60, #2ECC71) !important;
        border: none !important;
        box-shadow: 0 15px 30px rgba(39, 174, 96, 0.3) !important;
        transition: all 0.3s ease !important;
      }

      .start-btn:hover {
        transform: translateY(-3px) scale(1.02) !important;
        box-shadow: 0 20px 40px rgba(39, 174, 96, 0.4) !important;
      }

      .start-btn:active {
        transform: translateY(1px) scale(0.98) !important;
      }

      .reset-link {
        transition: all 0.3s ease !important;
      }

      .reset-link:hover {
        transform: translateY(-2px);
        text-shadow: 0 5px 10px rgba(255, 77, 79, 0.3);
      }

      .title-shimmer {
        background: linear-gradient(90deg, #8B4513, #D2691E, #F4A460, #FFD700, #F4A460, #D2691E, #8B4513);
        background-size: 200% 100%;
        animation: shimmer 8s linear infinite;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .decoration-pattern {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: repeating-linear-gradient(
          45deg,
          rgba(255, 215, 0, 0.05) 0px,
          rgba(255, 215, 0, 0.05) 20px,
          rgba(210, 105, 30, 0.05) 20px,
          rgba(210, 105, 30, 0.05) 40px
        );
        animation: spinSlow 60s linear infinite;
        pointer-events: none;
      }

      .input-icon {
        color: #FFD700;
        transition: all 0.3s ease;
      }

      .input-wrapper {
        position: relative;
        margin-bottom: 20px;
      }

      .input-label {
        position: absolute;
        top: -10px;
        left: 20px;
        background: white;
        padding: 0 8px;
        font-size: 12px;
        color: #8B4513;
        font-weight: 600;
        border-radius: 10px;
        z-index: 2;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const handleStart = () => {
    if (!name.trim() || !mobile.trim()) {
      message.warning({
        content: "කරුණාකර නම සහ දුරකථන අංකය ඇතුළත් කරන්න",
        icon: <SafetyOutlined />,
        style: { marginTop: '20vh' },
      });
      return;
    }

    if (!/^07\d{8}$/.test(mobile)) {
      message.error({
        content: "වලංගු ජංගම දුරකථන අංකයක් ඇතුළත් කරන්න (07XXXXXXXX)",
        icon: <PhoneOutlined />,
        style: { marginTop: '20vh' },
      });
      return;
    }

    setLoading(true);

    const playerData = {
      name,
      phone: mobile,
    };

    localStorage.setItem("player", JSON.stringify(playerData));
    setPlayer(playerData);

    message.success({
      content: "සාදරයෙන් පිළිගනිමු! 🎉",
      duration: 1.5,
      style: { marginTop: '20vh' },
    });

    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  const handleReset = () => {
    localStorage.clear();
    setName("");
    setMobile("");
    message.info({
      content: "සැසිය මකා දමන ලදී",
      style: { marginTop: '20vh' },
    });
  };

  return (
    <div ref={containerRef} className="welcome-container">
      {/* Animated Background Pattern */}
      <div className="decoration-pattern" />

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
        🎋
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
        style={{ width: "100%", maxWidth: 500 }}
      >
        <Card className="welcome-card">
          {/* Decorative Header Pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 8,
              background: "linear-gradient(90deg, #FFD700, #FFA500, #FFD700)",
            }}
          />

          <div style={{ padding: "32px 24px", position: "relative" }}>
            {/* Header Icons */}
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 16 }}>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ fontSize: 32 }}
              >
                🪔
              </motion.div>
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{ fontSize: 32 }}
              >
                🎋
              </motion.div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                style={{ fontSize: 32 }}
              >
                🏮
              </motion.div>
            </div>

            {/* Title */}
            <h1 className="title-shimmer" style={{
              fontSize: 32,
              fontWeight: 800,
              textAlign: "center",
              margin: "0 0 8px",
              lineHeight: 1.4,
            }}>
              සිංහල අවුරුදු ක්‍රීඩා
            </h1>

            <p style={{
              textAlign: "center",
              color: "#5f5f5f",
              fontSize: 15,
              marginBottom: 28,
            }}>
              ක්‍රීඩා ආරම්භ කිරීමට ඔබගේ විස්තර ඇතුළත් කරන්න
            </p>

            {/* Name Input */}
            <div className="input-wrapper">
              <span className="input-label">
                <UserOutlined className="input-icon" /> ඔබගේ නම
              </span>
              <Input
                placeholder="ඔබගේ නම ඇතුළත් කරන්න"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                className="welcome-input"
                prefix={<UserOutlined style={{ color: nameFocused ? '#FFD700' : '#999' }} />}
              />
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: nameFocused ? 1 : 0 }}
                style={{
                  height: 2,
                  background: "linear-gradient(90deg, #FFD700, #FFA500)",
                  marginTop: 4,
                  borderRadius: 2,
                }}
              />
            </div>

            {/* Mobile Input */}
            <div className="input-wrapper">
              <span className="input-label">
                <PhoneOutlined className="input-icon" /> දුරකථන අංකය
              </span>
              <Input
                placeholder="07XXXXXXXX"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                onFocus={() => setMobileFocused(true)}
                onBlur={() => setMobileFocused(false)}
                className="welcome-input"
                maxLength={10}
                prefix={<PhoneOutlined style={{ color: mobileFocused ? '#FFD700' : '#999' }} />}
              />
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: mobileFocused ? 1 : 0 }}
                style={{
                  height: 2,
                  background: "linear-gradient(90deg, #FFD700, #FFA500)",
                  marginTop: 4,
                  borderRadius: 2,
                }}
              />
            </div>

            {/* Helper Text */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 20,
              padding: "8px 12px",
              background: "rgba(255, 215, 0, 0.1)",
              borderRadius: 20,
              fontSize: 12,
              color: "#8B4513",
            }}>
              <SafetyOutlined style={{ color: "#FFD700" }} />
              ඔබගේ තොරතුරු ආරක්ෂිතව ගබඩා වේ
            </div>

            {/* Start Button */}
            <Button
              type="primary"
              block
              className="start-btn"
              onClick={handleStart}
              loading={loading}
            >
              {loading ? "ආරම්භ කරමින්..." : "▶ ක්‍රීඩා ආරම්භ කරන්න"}
            </Button>

            {/* Reset Session */}
            <motion.div
              style={{ marginTop: 20, textAlign: "center" }}
              whileHover={{ scale: 1.05 }}
            >
              <Button
                type="link"
                danger
                onClick={handleReset}
                className="reset-link"
                style={{
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                🔄 සැසිය නැවත ආරම්භ කරන්න
              </Button>
            </motion.div>

            {/* Decorative Footer */}
            <div
              style={{
                marginTop: 24,
                display: "flex",
                justifyContent: "center",
                gap: 12,
                opacity: 0.6,
              }}
            >
              <span style={{ fontSize: 16, animation: "gentleFloat 3s ease-in-out infinite" }}>🌸</span>
              <span style={{ fontSize: 16, animation: "gentleFloat 3.5s ease-in-out infinite" }}>🌺</span>
              <span style={{ fontSize: 16, animation: "gentleFloat 4s ease-in-out infinite" }}>🍃</span>
              <span style={{ fontSize: 16, animation: "gentleFloat 2.5s ease-in-out infinite" }}>✨</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}