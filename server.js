import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Для поддержки ES-модулей и __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Отдаём статику
app.use(express.static(path.join(__dirname, "public")));

// Функция определения фазы луны
function getMoonPhase(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let c = 0, e = 0, jd = 0, b = 0;
  if (month < 3) {
    c = Math.floor((year - 1) / 100);
    e = 0;
    jd = Math.floor(365.25 * (year - 1)) + Math.floor(30.6001 * (month + 12 + 1)) + day + 1720995;
  } else {
    c = Math.floor(year / 100);
    e = 2 - c + Math.floor(c / 4);
    jd = Math.floor(365.25 * year) + Math.floor(30.6001 * (month + 1)) + day + 1720994 + e;
  }
  b = jd - 2451550.1;
  b = b / 29.530588853;
  b = b - Math.floor(b);
  if (b < 0) b += 1;

  if (b < 0.03 || b > 0.97) return "Новолуние";
  if (b < 0.22) return "Молодая луна (растущая)";
  if (b < 0.28) return "Первая четверть";
  if (b < 0.47) return "Почти полнолуние (растущая)";
  if (b < 0.53) return "Полнолуние";
  if (b < 0.72) return "Убывающая луна";
  if (b < 0.78) return "Последняя четверть";
  return "Старая луна (убывающая)";
}

// API для фаз луны
app.get("/api/moon", (req, res) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const todayPhase = getMoonPhase(today);
  const tomorrowPhase = getMoonPhase(tomorrow);

  res.json({
    today: todayPhase,
    tomorrow: tomorrowPhase
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
