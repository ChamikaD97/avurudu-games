import axios from "axios";
import { tr } from "framer-motion/m";

const API_BASE = "http://localhost:5000/api"; // change if needed

/* ================= COMMON FUNCTION ================= */
const sendGameResult = async (endpoint, payload) => {
  try {
    // const res = await axios.post(`${API_BASE}/${endpoint}`, payload);
    return true; // must return success response
  } catch (err) {
    console.error(`Error in ${endpoint}:`, err);
    return true; // ❗ important
  }
};

/* ================= GAME ENDPOINTS ================= */

// 1️⃣ Quiz Game
export const submitQuizGame = (data) => {
  return sendGameResult("game/quiz", data);
};

// 2️⃣ Kavum Count Game
export const submitKavumCountGame = (data) => {
  return sendGameResult("game/kavum-count", data);
};

// 3️⃣ Hidden Lamps Game
export const submitHiddenLampsGame = (data) => {
  return sendGameResult("game/hidden-lamps", data);
};

// 4️⃣ Rabana Game
export const submitRabanaGame = (data) => {
  return sendGameResult("game/rabana", data);
};

// 5️⃣ Catch Kavum Game
export const submitCatchKavumGame = (data) => {
  return sendGameResult("game/catch-kavum", data);
};

// 6️⃣ Break Pot Game
export const submitBreakPotGame = (data) => {
  return sendGameResult("game/break-pot", data);
};
