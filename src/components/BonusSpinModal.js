import { Modal, Button, message } from "antd";
import { Wheel } from "react-custom-roulette";
import { useState } from "react";
import { playSpin } from "../api/gameApi";
import { motion, AnimatePresence } from "framer-motion";

export default function BonusSpinModal({ open, onClose, player }) {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const data = [
    { option: "💰 Rs.250", style: { backgroundColor: "#faad14", textColor: "#fff" } },
    { option: "💰 Rs.500", style: { backgroundColor: "#ff7a45", textColor: "#fff" } },
    { option: "💰 Rs.1000", style: { backgroundColor: "#36cfc9", textColor: "#fff" } },
    { option: "💰 Rs.5000", style: { backgroundColor: "#722ed1", textColor: "#fff" } },
    { option: "😢 Try Again", style: { backgroundColor: "#ff4d4f", textColor: "#fff" } },
  ];

  const getIndex = (prize) => {
    switch (prize) {
      case 250: return 0;
      case 500: return 1;
      case 1000: return 2;
      case 5000: return 3;
      default: return 4;
    }
  };

  const handleSpin = async () => {
    if (mustSpin || loading) return;

    setShowResult(false);
    setLoading(true);

    const res = await playSpin({ playerId: player });

    setLoading(false);

    if (!res?.success) {
      message.error("Spin failed");
      return;
    }

    const index = getIndex(res.prize);

    setTimeout(() => {
      setPrizeNumber(index);
      setResult(res.prize);
      setMustSpin(true);
    }, 400);
  };

  const handleStop = () => {
    setMustSpin(false);
    setShowResult(true);

    if (result === "TRY_AGAIN") {
      message.warning("😢 Try Again");
    } else {
      message.success(`🎉 You won Rs.${result}!`);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      styles={{
        mask: { background: "rgba(0,0,0,0.4)" },
        content: {
          background: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <div style={{ textAlign: "center", position: "relative" }}>
        
        {/* 🔥 GLOW BACKGROUND */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          style={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,215,0,0.4), transparent)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
          }}
        />

        {/* 🎡 TITLE */}
        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            color: "#FFD700",
            fontWeight: "bold",
            textShadow: "0 0 20px #FFD700",
            zIndex: 1,
          }}
        >
          🎡 Spin & Win
        </motion.h2>

        {/* 🔻 POINTER */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: "20px solid #FFD700",
            margin: "0 auto",
            marginBottom: -10,
            zIndex: 2,
            position: "relative",
          }}
        />

        {/* 🎯 WHEEL */}
        <motion.div
          animate={{
            scale: mustSpin ? 1.15 : 1,
          }}
          transition={{ duration: 0.3 }}
          style={{
            margin: "20px 0",
            padding: 15,
            borderRadius: 20,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 0 30px rgba(255,215,0,0.5)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
            onStopSpinning={handleStop}
            outerBorderColor="#FFD700"
            outerBorderWidth={6}
            radiusLineColor="#fff"
            radiusLineWidth={2}
            textDistance={65}
            fontSize={14}
          />
        </motion.div>

        {/* 🎯 BUTTON */}
        <motion.div
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: [
              "0 0 10px #FFD700",
              "0 0 25px #FFA500",
              "0 0 10px #FFD700",
            ],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Button
            type="primary"
            size="large"
            onClick={handleSpin}
            loading={loading}
            disabled={mustSpin}
            style={{
              background: "linear-gradient(135deg, #FFD700, #FF8C00)",
              border: "none",
              fontWeight: "bold",
              fontSize: 16,
              padding: "10px 30px",
              borderRadius: 12,
              color: "#000",
            }}
          >
            🎯 {loading ? "Spinning..." : "Spin Now"}
          </Button>
        </motion.div>

        {/* 🏆 RESULT */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                marginTop: 20,
                padding: 20,
                borderRadius: 15,
                background:
                  result === "TRY_AGAIN"
                    ? "#fff1f0"
                    : "linear-gradient(135deg, #d9f7be, #73d13d)",
                border:
                  result === "TRY_AGAIN"
                    ? "2px solid #ff4d4f"
                    : "2px solid #52c41a",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              {result === "TRY_AGAIN"
                ? "😢 Try Again!"
                : `🎉 You won Rs.${result}!`}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}