import { Card, Button, message } from "antd";
import { useState, useEffect } from "react";
import Timer from "../components/Timer";
import { checkUser } from "../api/api";
import rabana from "../assets/rabana.png";
import GameEndModal from "../components/GameEndModal";

export default function RabanaGame({ player }) {
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const [startClicked, setStartClicked] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);

  const [animate, setAnimate] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [checkingUser, setCheckingUser] = useState(false);

  const tap = () => {
    if (!gameStarted || finished) return;

    const now = Date.now();
    const diff = now - lastTap;

    if (diff < 200) {
      setScore((prev) => prev + 2);
    } else {
      setScore((prev) => prev + 1);
    }

    setLastTap(now);

    setAnimate(true);
    setTimeout(() => setAnimate(false), 100);
  };

  const handleAfterFinish = async () => {
    try {
      setCheckingUser(true);

      const res = await checkUser(player.phone);

      if (res?.data?.registered) {
        message.success(
          "You are registered. Winnings will be given on a future day.",
        );
      } else {
        message.warning(
          "Winnings are only for registered users. Redirecting to signup...",
        );
        setTimeout(() => {
          window.location.href = "https://www.winway.lk/auth/signup";
        }, 1500);
      }
    } catch (error) {
      message.error("User check failed");
    } finally {
      setCheckingUser(false);
    }
  };
  const [showModal, setShowModal] = useState(false);

  // when game ends
  const handleFinish = () => {
    setFinished(true);
    setShowModal(true); // 🔥 open modal
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
    if (finished) {
      handleAfterFinish();
    }
  }, [finished]);

  const restartGame = () => {
    setScore(0);
    setFinished(false);
    setStartClicked(false);
    setCountdown(3);
    setGameStarted(false);
    setAnimate(false);
    setLastTap(0);
    setCheckingUser(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff5e6 0%, #ffe3b3 100%)",
        padding: "30px 16px",
      }}
    >
      <Card
        style={{
          maxWidth: 560,
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
          <div style={{ fontSize: 40, marginBottom: 6 }}>🥁</div>
          <h2
            style={{
              margin: 0,
              color: "#8B4513",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            Tap the Rabana
          </h2>
          <p style={{ margin: "8px 0 0", color: "#7a7a7a", fontSize: 15 }}>
            Hit the rabana as fast as you can and earn more points with quick
            combos.
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
              Ready to Play?
            </h3>

            <p
              style={{
                marginBottom: 18,
                color: "#5f5f5f",
                lineHeight: 1.7,
                fontSize: 15,
              }}
            >
              Tap the Rabana drum as fast as you can before time runs out.
              <br />
              Faster taps give you combo points.
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
              Get ready to tap as fast as possible
            </p>
          </div>
        )}

        {gameStarted && !finished && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 14,
              flexWrap: "wrap",
              marginBottom: 22,
            }}
          >
            <div
              style={{
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
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#E44D2E",
                }}
              >
                <Timer seconds={10} onFinish={handleFinish} />
              </div>
            </div>

            <div
              style={{
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
                Score
              </div>

              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#1f7a1f",
                }}
              >
                {score}
              </div>
            </div>
          </div>
        )}

        {gameStarted && (
          <div style={{ marginBottom: 16 }}>
            <img
              src={rabana}
              alt="rabana"
              style={{
                width: 220,
                maxWidth: "100%",
                cursor: "pointer",
                transform: animate ? "scale(0.92)" : "scale(1)",
                transition: "transform 0.1s",
                filter: "drop-shadow(0 12px 20px rgba(139,69,19,0.18))",
              }}
              onClick={tap}
            />
          </div>
        )}

        {gameStarted && !finished && (
          <p
            style={{
              color: "#777",
              fontSize: 14,
              marginTop: 6,
            }}
          >
            Tap faster to earn combo points
          </p>
        )}

        {finished && (
          <div
            style={{
              background: "linear-gradient(135deg, #fff7e6, #ffe7c2)",
              border: "1px solid #f4cf69",
              borderRadius: 18,
              padding: "22px 18px",
              marginTop: 16,
            }}
          >
            <h2 style={{ color: "#8B4513", marginBottom: 8 }}>⏰ Time's Up!</h2>
            <h3
              style={{
                color: "#E44D2E",
                fontSize: 26,
                marginBottom: 18,
                fontWeight: 800,
              }}
            >
              Final Score: {score}
            </h3>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <Button
                type="primary"
                loading={checkingUser}
                style={{
                  height: 46,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #E44D2E, #F9A826)",
                  border: "none",
                  fontWeight: 700,
                }}
              >
                Checking player...
              </Button>

              <Button
                onClick={restartGame}
                style={{
                  height: 46,
                  borderRadius: 12,
                  fontWeight: 700,
                }}
              >
                Play Again
              </Button>
            </div>
          </div>
        )}
      </Card>
      <GameEndModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
