import { Card, Input, Button } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";

export default function Welcome({ setPlayer }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const handleStart = () => {
    if (!name || !mobile) {
      alert("Please enter name and mobile");
      return;
    }

    const playerData = { name, mobile };

    localStorage.setItem("player", JSON.stringify(playerData));

    setPlayer(playerData);

    navigate("/");
  };

  return (
    <div className="avurudu-games-containerW">
      <div className="games-backgroundW"></div>

      <Card className="welcome-card">
        <h1 className="welcome-title">🎉 Avurudu Games 🎉</h1>

        <p className="welcome-sub">Enter your details to start playing</p>

        <Input
          placeholder="👤 Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="welcome-input"
        />

        <Input
          placeholder="📱 Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="welcome-input"
        />

        <Button
          type="primary"
          block
          className="start-btn"
          onClick={handleStart}
        >
          ▶ Start Playing
        </Button>
      </Card>
    </div>
  );
}
