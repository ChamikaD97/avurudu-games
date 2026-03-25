import { Modal, Button, Spin, message } from "antd";
import { Wheel } from "react-custom-roulette";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getSpinConfig,
  submitSpinResult,
  playSpin,
  saveSpinLog, // 🔥 NEW API
} from "../api/gameApi";

export default function BonusSpinModal({
  open,
  onClose,
  player,
  language = "si",
}) {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [result, setResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [data, setData] = useState([]);
  const [loadingSpinData, setLoadingSpinData] = useState(false);
  const [savingResult, setSavingResult] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);

  // 🌐 TRANSLATIONS
  const TEXT = {
    si: {
      title: "🎡 බෝනස් වාසනාව",
      spin: "🎯 රෝදය කරකවන්න",
      played: "ඔබ දැනටමත් ක්‍රීඩා කර ඇත",
      once: "ඔබට එක් වරක් පමණයි අවස්ථාව",
      close: "වසන්න",
      tryAgain: "😢 අවාසනාවන්තයි",
      congrats: "🎉 සුභ පැතුම්",
    },
    ta: {
      title: "🎡 போனஸ் அதிர்ஷ்டம்",
      spin: "🎯 சுழற்றவும்",
      played: "நீங்கள் ஏற்கனவே விளையாடிவிட்டீர்கள்",
      once: "உங்களுக்கு ஒரே ஒரு வாய்ப்பு மட்டுமே",
      close: "மூடு",
      tryAgain: "😢 மீண்டும் முயற்சிக்கவும்",
      congrats: "🎉 வாழ்த்துக்கள்",
    },
    en: {
      title: "🎡 Bonus Spin",
      spin: "🎯 Spin Now",
      played: "Already Played",
      once: "Only one chance allowed",
      close: "Close",
      tryAgain: "😢 Try Again",
      congrats: "🎉 Congratulations",
    },
  };

  const t = TEXT[language] || TEXT.en;

  // ================= LOAD CONFIG =================
  const loadSpinConfig = async () => {
    try {
      setLoadingSpinData(true);
      const res = await getSpinConfig();

      if (res?.success) {
        setData(res.data);
      } else {
        message.error("Spin data not found");
      }
    } catch (e) {
      message.error("Failed to load spin config");
    } finally {
      setLoadingSpinData(false);
    }
  };

  useEffect(() => {
    if (open) loadSpinConfig();
  }, [open]);

  // ================= SPIN (🔥 BACKEND CONTROLLED) =================
  const spin = async () => {
    if (!data.length) {
      console.error("Spin data not loaded");
      return;
    }

    const res = await playSpin({ phone: player?.phone });

    if (!res?.success) return;

    const index = data.findIndex((item) => item.option === res.prize);

    // ❌ IMPORTANT FIX
    if (index === -1) {
      console.error("Prize not found in wheel:", res.prize);
      return;
    }

    setPrizeNumber(index);
    setMustSpin(true);
    setResult(res.prize); // 🔥 ALSO MISSING
    setHasSpun(true);
  };
  // ================= STOP =================
  const handleStop = async () => {
    setMustSpin(false);

    const selectedPrize = data[prizeNumber];
    if (!selectedPrize) return;

    try {
      await submitSpinResult({
        phone: player?.phone,
        fullName: player?.fullName,
        prize: selectedPrize,
      });

      await saveSpinLog({
        phone: player?.phone,
        prize: selectedPrize.option,
        index: prizeNumber,
        spinTime: 10,
      });
    } catch (e) {
      message.error("Save failed");
    }
  };

  // ================= CONFETTI =================
  useEffect(() => {
    if (result && !result.includes("Try")) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(t);
    }
  }, [result]);

  const confettiPieces = useMemo(() => {
    return Array.from({ length: 30 }, () => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      color: `hsl(${Math.random() * 60 + 20}, 85%, 60%)`,
    }));
  }, [result]);

  const isTryAgain = result?.includes("Try");

  return (
    <Modal open={open} footer={null} onCancel={onClose} centered width={600}>
      {/* CONFETTI */}
      {showConfetti &&
        confettiPieces.map((c, i) => (
          <div
            key={i}
            style={{
              position: "fixed",
              width: 8,
              height: 8,
              left: c.left,
              background: c.color,
              animation: "confettiFall 3s linear infinite",
              animationDelay: c.delay,
            }}
          />
        ))}

      {/* TITLE */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h2 style={{ fontWeight: 800, fontSize: 28, color: "#8B4513" }}>
          {t.title}
        </h2>
      </div>

      {/* WHEEL */}
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}
      >
        {loadingSpinData ? (
          <Spin />
        ) : (
          <div
            style={{
              padding: 20,
              borderRadius: 30,
              background: "linear-gradient(135deg, #FFF9E6, #FFE4B5)",
              border: "3px solid #FFD700",
            }}
          >
            <div style={{ transform: "scale(1.15)" }}>
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data.map((i) => ({
                  option: i.option,
                  style: i.style,
                }))}
                onStopSpinning={handleStop}
                backgroundColors={data.map(
                  (i) => i.style?.backgroundColor || "#ffd666",
                )}
                textColors={data.map((i) => i.style?.textColor || "#fff")}
                outerBorderWidth={4}
                outerBorderColor="#FFD700"
                radiusLineWidth={2}
                radiusLineColor="#fff"
                fontSize={14}
                perpendicularText={false}
                textDistance={65}
              />
            </div>
          </div>
        )}
      </div>

      {/* BUTTON */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Button
          type="primary"
          onClick={spin}
          disabled={mustSpin || hasSpun || savingResult}
          loading={savingResult}
          style={{
            height: 50,
            borderRadius: 30,
            fontWeight: 700,
            background: hasSpun
              ? "#d9d9d9"
              : "linear-gradient(135deg, #faad14, #d48806)",
          }}
        >
          {hasSpun ? t.played : t.spin}
        </Button>
      </div>

      {/* RESULT */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            style={{
              textAlign: "center",
              padding: 20,
              borderRadius: 25,
              background: isTryAgain ? "#ffd6d6" : "#d9f7be",
              marginBottom: 20,
            }}
          >
            <h3>
              {isTryAgain ? t.tryAgain : t.congrats}
              <br />
              {result}
            </h3>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CLOSE */}
      <div style={{ textAlign: "center" }}>
        <Button onClick={onClose}>{t.close}</Button>
      </div>
    </Modal>
  );
}
