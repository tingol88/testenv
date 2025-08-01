import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

function getMoonPhaseDetails(date = new Date()) {
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

  let phase, description;
  if (b < 0.03 || b > 0.97) {
    phase = "Новолуние";
    description = "Время новых начинаний и планирования. Не перегружайте себя, настройтесь на внутренний покой.";
  } else if (b < 0.22) {
    phase = "Молодая луна (растущая)";
    description = "Подходит для начала новых дел, обучения, привлечения ресурсов. Ваша энергия на подъёме.";
  } else if (b < 0.28) {
    phase = "Первая четверть";
    description = "Преодолевайте препятствия, активно реализуйте планы. Хорошо решать вопросы, требующие решимости.";
  } else if (b < 0.47) {
    phase = "Почти полнолуние (растущая)";
    description = "Динамичный период, энергия на максимуме. Самое время продвигать проекты и общаться.";
  } else if (b < 0.53) {
    phase = "Полнолуние";
    description = "Пик эмоциональности и активности. Не перегружайте себя, следите за эмоциональным состоянием.";
  } else if (b < 0.72) {
    phase = "Убывающая луна";
    description = "Завершайте дела, очищайте пространство, избавляйтесь от лишнего. Умерьте темп.";
  } else if (b < 0.78) {
    phase = "Последняя четверть";
    description = "Пора анализа и исправления ошибок. Завершайте незаконченные дела, стройте планы.";
  } else {
    phase = "Старая луна (убывающая)";
    description = "Подходит для отдыха, расслабления и восстановления. Время заботы о себе.";
  }
  return { phase, description };
}

app.get("/api/moon", (req, res) => {
  let date = new Date();
  if (req.query.date) {
    // Ожидает yyyy-mm-dd
    date = new Date(req.query.date);
    if (isNaN(date)) date = new Date();
  }
  const { phase, description } = getMoonPhaseDetails(date);

  res.json({
    date: date.toISOString().slice(0,10),
    phase,
    description
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
