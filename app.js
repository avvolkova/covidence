// Подключение библиотеки express
const express = require('express');

// Создание приложения express
const app = express();

// Подключение middleware, который отдаёт клиенту файлы из папки
app.use(express.static('public'));

// Устанавливаем внутреннюю переменную express-приложения
// Эта переменная подключает шаблонизатор Handlebars
app.set('view engine', 'hbs');

// Роут, отвечающий на запрос GET /
app.get('/', (req, res) => {

    // Рендерим шаблон index.hbs
    return res.render('index');
});

// Запуск сервера по порту 3000
app.listen(3000);