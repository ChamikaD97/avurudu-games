import { Card, Button, Progress } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import lampsImage from "../assets/avurudu-lamps.jpeg";
import GameEndModal from "../components/GameEndModal";

export default function Game3() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [timeUp, setTimeUp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  const [startClicked, setStartClicked] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);

  const options = ["3", "4", "5", "6"];

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
    if (!gameStarted) return;

    if (timeLeft === 0) {
      setTimeUp(true);
      setShowModal(true); // 🔥 show modal
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, gameStarted, navigate]);

  const handleSubmit = () => {
    if (!selected) return;
    setShowModal(true); // 🔥 show modal when quiz ends
  };


  const progressPercent = (timeLeft / 15) * 100;

  return (
<div
  style={{
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fff5e6 0%, #ffe3b3 100%)",
    padding: "30px 16px",

    display: "flex",
    justifyContent: "center",   // horizontal center
    alignItems: "center",       // vertical center
  }}
>
      <Card
        style={{
          maxWidth: 580,
          margin: "auto",
          marginTop: 20,
          textAlign: "center",
          borderRadius: 24,
          background: "rgba(255,255,255,0.96)",
          boxShadow: "0 18px 45px rgba(139,69,19,0.16)",
          border: "2px solid #f5d76e",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: 28 }}
      >
        <div
          style={{
            marginBottom: 20,
            paddingBottom: 14,
            borderBottom: "2px dashed #f3c96a",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 6 }}>🏮</div>
          <h2
            style={{
              margin: 0,
              color: "#8B4513",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            පහන් ගණන හොයමු
          </h2>
          <p style={{ margin: "8px 0 0", color: "#7a7a7a", fontSize: 15 }}>
            Look carefully at the image and choose the correct number of lamps
          </p>
        </div>

        {!startClicked && (
          <div
            style={{
              background: "linear-gradient(135deg, #fff8e8, #ffeabf)",
              border: "1px solid #f5d76e",
              borderRadius: 18,
              padding: "24px 20px",
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: 54, marginBottom: 10 }}>🎯</div>

            <h3
              style={{
                marginBottom: 10,
                color: "#8B4513",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              Ready to Answer?
            </h3>

            <p
              style={{
                marginBottom: 18,
                color: "#5f5f5f",
                lineHeight: 1.7,
                fontSize: 15,
              }}
            >
              Look carefully at the image and choose the correct number of lamps
              before the timer ends.
            </p>

            <Button
              type="primary"
              size="large"
              onClick={() => setStartClicked(true)}
              style={{
                height: 50,
                padding: "0 28px",
                borderRadius: 14,
                background: "linear-gradient(135deg, #E44D2E, #F9A826)",
                border: "none",
                fontWeight: 700,
                fontSize: 16,
                boxShadow: "0 10px 24px rgba(228,77,46,0.25)",
              }}
            >
              Start Game
            </Button>
          </div>
        )}

        {startClicked && !gameStarted && (
          <div
            style={{
              padding: "24px 16px",
              marginBottom: 20,
            }}
          >
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
                boxShadow: "0 12px 30px rgba(228,77,46,0.28)",
              }}
            >
              {countdown}
            </div>

            <h2 style={{ marginBottom: 6, color: "#8B4513" }}>
              Starting in {countdown}...
            </h2>
            <p style={{ color: "#777", margin: 0 }}>
              Get ready to answer quickly
            </p>
          </div>
        )}

        {gameStarted && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  flex: 1,
                  minWidth: 150,
                  background: "linear-gradient(135deg, #fff7df, #ffe9b3)",
                  border: "1px solid #f4cf69",
                  borderRadius: 16,
                  padding: "14px 18px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
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
                  Time Left
                </div>

                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: timeLeft <= 2 ? "#E44D2E" : "#d48806",
                  }}
                >
                  {timeLeft}s
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  minWidth: 150,
                  background: "linear-gradient(135deg, #eefcf1, #d6f7dc)",
                  border: "1px solid #95de64",
                  borderRadius: 16,
                  padding: "14px 18px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "#2f6b2f",
                    fontWeight: 700,
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Question
                </div>

                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#1f7a1f",
                  }}
                >
                  1/1
                </div>
              </div>
            </div>

            <div
              style={{
                marginBottom: 22,
                background: "#fffaf0",
                borderRadius: 14,
                padding: "14px 16px",
                border: "1px solid #f3e2b2",
              }}
            >
              <Progress
                percent={progressPercent}
                showInfo={false}
                strokeColor={timeLeft <= 2 ? "#ff4d4f" : "#52c41a"}
                trailColor="#f0e6c8"
              />
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #fff8e8, #ffeabf)",
                border: "1px solid #f5d76e",
                borderRadius: 18,
                padding: "20px 18px",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "#8B4513",
                  fontWeight: 700,
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Image Puzzle
              </div>

              <h3
                style={{
                  margin: 0,
                  color: "#5c3b14",
                  fontSize: 22,
                  lineHeight: 1.5,
                  fontWeight: 700,
                }}
              >
                රූපයේ ඇති පහන් ගණන කීයද?
              </h3>
            </div>

            <div
              style={{
                background: "#fffaf0",
                border: "2px solid #f5d76e",
                borderRadius: 18,
                padding: 12,
                marginBottom: 22,
                boxShadow: "0 8px 18px rgba(0,0,0,0.05)",
              }}
            >
              <img
                src={lampsImage}
                alt="lamps"
                style={{
                  width: "100%",
                  borderRadius: 14,
                  display: "block",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {options.map((opt, i) => (
                <Button
                  key={i}
                  block
                  onClick={() => setSelected(opt)}
                  style={{
                    height: 54,
                    borderRadius: 14,
                    fontWeight: 700,
                    fontSize: 15,
                    border:
                      selected === opt ? "2px solid #d48806" : "1px solid #ddd",
                    background:
                      selected === opt
                        ? "linear-gradient(135deg, #ffe58f, #ffd666)"
                        : "#fff",
                    color: "#333",
                    boxShadow:
                      selected === opt
                        ? "0 8px 18px rgba(212,136,6,0.18)"
                        : "0 4px 10px rgba(0,0,0,0.04)",
                  }}
                >
                  {opt}
                </Button>
              ))}
            </div>

            <Button
              type="primary"
              block
              disabled={!selected}
              onClick={handleSubmit}
              style={{
                marginTop: 22,
                height: 52,
                borderRadius: 14,
                background: "linear-gradient(135deg, #27AE60, #52c41a)",
                border: "none",
                fontWeight: 800,
                fontSize: 16,
                boxShadow: "0 10px 24px rgba(39,174,96,0.22)",
              }}
            >
              ✅ Submit Answer
            </Button>
          </>
        )}
      </Card>
      <GameEndModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
