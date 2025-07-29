import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

async function getMoonPhase(date) {
  // Получаем timestamp (UTC) в секундах
  const timestamp = Math.floor(new Date(date).getTime() / 1000);
  const url = `https://api.farmsense.net/v1/moonphases/?d=${timestamp}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data[0]?.Phase || "Неизвестно";
  } catch {
    return "Ошибка";
  }
}

app.get("/api/moon", async (req, res) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [todayPhase, tomorrowPhase] = await Promise.all([
    getMoonPhase(today),
    getMoonPhase(tomorrow)
  ]);

  res.json({
    today: todayPhase,
    tomorrow: tomorrowPhase
  });
});

app.listen(PORT, () => {
  console.log(`Сервер: http://localhost:${PORT}`);
});
