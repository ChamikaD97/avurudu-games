import { Modal, Button } from "antd";
import { Wheel } from "react-custom-roulette";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GiftOutlined, 
  TrophyOutlined,
  StarOutlined,
  FireOutlined,
  ThunderboltOutlined
} from "@ant-design/icons";

export default function BonusSpinModal({ open, onClose, player }) {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [result, setResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [spinHistory, setSpinHistory] = useState([]);

  const data = [
    { option: "🎁 Gift Voucher", style: { backgroundColor: '#ff7875', textColor: '#fff' } },
    { option: "😢 Try Again", style: { backgroundColor: '#d9d9d9', textColor: '#666' } },
    { option: "💰 Rs.1000", style: { backgroundColor: '#ffd666', textColor: '#8B4513' } },
    { option: "🍫 Chocolate Pack", style: { backgroundColor: '#95de64', textColor: '#2E7D32' } },
    { option: "🎉 Free Item", style: { backgroundColor: '#69c0ff', textColor: '#fff' } },
    { option: "😢 Try Again", style: { backgroundColor: '#d9d9d9', textColor: '#666' } },
  ];

  // Trigger confetti on win
  useEffect(() => {
    if (result && !result.includes("Try Again")) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  // Inject animations
  useEffect(() => {
    const styleId = "bonusspin-festival-animations";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      @keyframes confettiFall {
        0% {
          transform: translateY(-100vh) rotate(0deg);
        }
        100% {
          transform: translateY(100vh) rotate(720deg);
        }
      }

      @keyframes spinIn {
        0% {
          opacity: 0;
          transform: scale(0.3) rotate(-180deg);
        }
        100% {
          opacity: 1;
          transform: scale(1) rotate(0deg);
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

      @keyframes float {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
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

      .wheel-container {
        animation: spinIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .confetti-piece {
        position: fixed;
        width: 10px;
        height: 10px;
        background: linear-gradient(135deg, #FFD700, #FFA500);
        animation: confettiFall 3s linear infinite;
        pointer-events: none;
        z-index: 9999;
      }

      .floating-icon {
        animation: float 3s ease-in-out infinite;
      }

      .glow-icon {
        animation: pulseGlow 2s ease-in-out infinite;
      }

      .result-banner {
        animation: pulseGlow 2s ease-in-out infinite;
        transition: all 0.3s ease;
      }

      .history-item {
        transition: all 0.3s ease;
      }

      .history-item:hover {
        transform: translateX(5px);
        background: rgba(255, 215, 0, 0.2);
      }
    `;
    document.head.appendChild(style);
  }, []);

  const spin = () => {
    const newPrize = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrize);
    setMustSpin(true);
    setResult(null);
  };

  const handleStop = () => {
    setMustSpin(false);
    const win = data[prizeNumber].option;
    setResult(win);
    
    // Add to history
    setSpinHistory(prev => [win, ...prev].slice(0, 5));
    
    localStorage.setItem("bonus_reward", win);
  };

  // Generate confetti pieces
  const confettiPieces = [];
  for (let i = 0; i < 50; i++) {
    confettiPieces.push({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
      background: `hsl(${Math.random() * 60 + 30}, 80%, 60%)`,
    });
  }

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      centered
      width={600}
      styles={{
        mask: {
          backdropFilter: "blur(8px)",
          background: "rgba(139, 69, 19, 0.6)",
        },
        content: {
          borderRadius: 32,
          padding: 0,
          overflow: "hidden",
          background: "linear-gradient(135deg, #FFF9E6, #FFE4B5)",
          border: "3px solid #FFD700",
          boxShadow: "0 30px 60px rgba(139, 69, 19, 0.3)",
        },
      }}
    >
      {/* Confetti Effect */}
      {showConfetti && confettiPieces.map((piece, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: piece.left,
            background: piece.background,
            animationDelay: piece.animationDelay,
          }}
        />
      ))}

      {/* Decorative Header */}
      <div
        style={{
          height: 8,
          background: "linear-gradient(90deg, #FFD700, #FFA500, #FFD700)",
          width: "100%",
        }}
      />

      <div style={{ padding: 32, position: "relative" }}>
        {/* Floating Decorations */}
        <div
          className="floating-icon"
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            fontSize: 24,
            opacity: 0.3,
          }}
        >
          🎁
        </div>
        <div
          className="floating-icon"
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            fontSize: 24,
            opacity: 0.3,
            animationDelay: "1s",
          }}
        >
          🎡
        </div>
        <div
          className="floating-icon"
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            fontSize: 24,
            opacity: 0.3,
            animationDelay: "1.5s",
          }}
        >
          ✨
        </div>
        <div
          className="floating-icon"
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            fontSize: 24,
            opacity: 0.3,
            animationDelay: "2s",
          }}
        >
          🌟
        </div>

        {/* Title Section */}
        <div style={{ textAlign: "center", marginBottom: 24, position: "relative", zIndex: 2 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="glow-icon"
            style={{
              fontSize: 64,
              marginBottom: 8,
              display: "inline-block",
            }}
          >
            🎡
          </motion.div>

          <h2
            style={{
              color: "#8B4513",
              fontSize: 32,
              fontWeight: 800,
              margin: "0 0 8px",
              background: "linear-gradient(135deg, #8B4513, #D2691E)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            බෝනස් වාසනාව
          </h2>

          <p style={{ color: "#5f5f5f", fontSize: 15 }}>
            රෝදය කරකවා ඔබගේ ත්‍යාගය දිනාගන්න! 🎁
          </p>
        </div>

        {/* Wheel Container */}
        <div className="wheel-container" style={{ textAlign: "center", marginBottom: 24 }}>
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
            onStopSpinning={handleStop}
            backgroundColors={data.map(item => item.style?.backgroundColor || '#ffd666')}
            textColors={data.map(item => item.style?.textColor || '#fff')}
            outerBorderColor="#FFD700"
            outerBorderWidth={3}
            innerRadius={10}
            radiusLineColor="#FFD700"
            radiusLineWidth={2}
            fontSize={14}
            perpendicularText={true}
          />
        </div>

        {/* Spin Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ textAlign: "center", marginBottom: 20 }}
        >
          <Button
            type="primary"
            onClick={spin}
            disabled={mustSpin}
            style={{
              height: 54,
              padding: "0 40px",
              borderRadius: 30,
              fontWeight: 700,
              fontSize: 18,
              background: mustSpin 
                ? "#d9d9d9" 
                : "linear-gradient(135deg, #faad14, #d48806)",
              border: "none",
              boxShadow: mustSpin 
                ? "none" 
                : "0 15px 30px rgba(250,173,20,0.4)",
              transition: "all 0.3s ease",
            }}
          >
            {mustSpin ? (
              <>කරකවමින්... 🔄</>
            ) : (
              <>🎯 රෝදය කරකවන්න</>
            )}
          </Button>
        </motion.div>

        {/* Result Display */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4 }}
              className="result-banner"
              style={{
                background: result.includes("Try Again")
                  ? "linear-gradient(135deg, #ffd6d6, #ffb3b3)"
                  : "linear-gradient(135deg, #d9f7be, #b7eb8f)",
                border: result.includes("Try Again")
                  ? "2px solid #ff4d4f"
                  : "2px solid #52c41a",
                borderRadius: 50,
                padding: "16px 24px",
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 14, color: "#8B4513", marginBottom: 4 }}>
                {result.includes("Try Again") ? "😢 අවාසනාවන්තයි!" : "🎉 සුභ පැතුම්!"}
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#8B4513" }}>
                {result}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spin History */}
        {spinHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(5px)",
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
              border: "1px solid #FFD700",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <ThunderboltOutlined style={{ color: "#FFD700" }} />
              <span style={{ color: "#8B4513", fontWeight: 600 }}>ඔබගේ පෙර වාසනාව</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {spinHistory.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="history-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    background: "rgba(255, 255, 255, 0.5)",
                    borderRadius: 20,
                    border: item.includes("Try Again") 
                      ? "1px solid #ff4d4f" 
                      : "1px solid #52c41a",
                  }}
                >
                  <span style={{ fontSize: 18 }}>
                    {item.includes("Try Again") ? "😢" : "🎉"}
                  </span>
                  <span style={{ color: "#8B4513", fontSize: 14, flex: 1 }}>
                    {item}
                  </span>
                  <span style={{ color: "#999", fontSize: 12 }}>
                    {index === 0 ? "(අලුත්ම)" : ""}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Close Button */}
        <div style={{ textAlign: "center" }}>
          <Button
            onClick={onClose}
            style={{
              height: 46,
              padding: "0 30px",
              borderRadius: 30,
              fontWeight: 600,
              border: "2px solid #FFD700",
              background: "transparent",
              color: "#8B4513",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.background = "rgba(255,215,0,0.1)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(255,215,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            වසන්න
          </Button>
        </div>

        {/* Decorative Footer */}
        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "center",
            gap: 8,
            fontSize: 12,
            color: "#999",
          }}
        >
          <span>✨</span>
          <span>වාසනාව ඔබට</span>
          <span>✨</span>
        </div>
      </div>
    </Modal>
  );
}