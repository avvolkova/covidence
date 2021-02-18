// Подключение библиотеки express
const express = require("express");

// Создание приложения express
const app = express();
var cors = require("cors");

// Подключение middleware, который отдаёт клиенту файлы из папки
app.use(express.static("public"));

// Подклчение cors
app.use(cors());

// Устанавливаем внутреннюю переменную express-приложения
// Эта переменная подключает шаблонизатор Handlebars
app.set("view engine", "hbs");

// Роут, отвечающий на запрос GET /
app.get("/", (req, res) => {
  return res.render("index");
});

// Запуск сервера по порту 3000
app.listen(3000);
