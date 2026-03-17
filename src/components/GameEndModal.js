import { Modal, Button, Typography } from "antd";

const { Title, Text } = Typography;

export default function GameEndModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      footer={null}
      centered
      closable={false}
      width={420}
      className="game-end-modal"
    >
      <div style={{ textAlign: "center" }}>
        
        <Title level={4} style={{ color: "#8b0000" }}>
          🎉 ස්තූතියි! 🎉
        </Title>

        <Text>
          තරගයට සහභාගි වූවාට ස්තූතියි
        </Text>

        <br /><br />

        <Text strong>
          ත්‍යාග සඳහා සුදුසුකම් ලැබීමට <span style={{ color: "#d4af37" }}>WIN WAY</span> සමග Register සිටීම අනිවාර්ය වේ.
        </Text>

        <br /><br />

        <div style={{ textAlign: "left" }}>
          <ul>
            <li>තෝරාගත් Register වූ පාරිභෝගිකයන් 100 කට Wallet top-ups 🎁</li>
            <li>WIN WAY වෙතින් ටිකට්පත් 5ක් හෝ ඊට වඩා මිලදී ගත්තොත් රු. 100,000ක් දක්වා මුදල් තෑගි 💰</li>
          </ul>
        </div>

        <Button
          type="primary"
          block
          style={{
            marginTop: 15,
            background: "#f5e20b",
            color: "#000",
            fontWeight: "bold",
            borderRadius: 10
          }}
          onClick={() => window.open("https://winway.lk", "_blank")}
        >
          👉 දැන්ම Register වෙන්න
        </Button>

        <Button
          block
          style={{ marginTop: 10 }}
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
}