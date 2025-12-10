# BMI Calculator/ИМТ калькулятор

Пприложение на Express.js для расчёта ИМТ (BMI) и работы с данными через REST API.

## Возможности/использованные технологии

- Расчёт BMI через:
  - POST JSON
  - GET query
- Возможность сохранять результаты в in-memory хранилище.
- Полный CRUD:
  - GET всех записей
  - GET записи по ID
  - PUT обновление
  - DELETE удаление
- Используются:
  - req.params
  - req.query
  - express.json()
  - express.urlencoded()
- Собственный middleware: logger
- Раздача статических файлов: /public
- Структура проекта разделена на:
  - routes
  - controllers
  - middleware
  - data

---


## Установка/запуск
`bash
git clone <https://github.com/ZenonRa/express-bmi-calculator>
cd express-bmi-calculator
npm install
npm run dev   # или npm start