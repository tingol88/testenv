const express = require('express');
const path = require('path');
const app = express();

// Отдаём статические файлы из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Пример простого API-эндпоинта
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Привет из backend!' });
});

// Запуск сервера на порту, который укажет Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
