const { gameOptions, againOptions } = require("./options");

const TelegramApi = require("node-telegram-bot-api");

//токен для бота
const token = "5095436662:AAF3M5nOpizUOQqKoheLydZsIAEg9XabDQQ";

//создание бота из апи класса
const bot = new TelegramApi(token, { polling: true });

//объект,в который сохраняется id чата и рндомное число
const chat = {};
//функция начала работы бота
const start = () => {
  //функция установки команд бота
  bot.setMyCommands([
    {
      command: "/start",
      description: "Начальное приветствие",
    },
    {
      command: "/info",
      description: "Получение информации о пользователе",
    },
    {
      command: "/game",
      description: "Игра угадай цифру!",
    },
  ]);
  //   //объект,содержащий кнопки
  //   const gameOptions = {
  //     reply_markup: JSON.stringify({
  //       inline_keyboard: [
  //         [
  //           { text: "1", callback_data: "1" },
  //           { text: "2", callback_data: "2" },
  //           { text: "3", callback_data: "3" },
  //         ],
  //         [
  //           { text: "4", callback_data: "4" },
  //           { text: "5", callback_data: "5" },
  //           { text: "6", callback_data: "6" },
  //         ],
  //         [
  //           { text: "7", callback_data: "7" },
  //           { text: "8", callback_data: "8" },
  //           { text: "9", callback_data: "9" },
  //         ],
  //         [{ text: "0", callback_data: "0" }],
  //       ],
  //     }),
  //   };
  //   //объект для перезапуска игры
  //   const againOptions = {
  //     reply_markup: JSON.stringify({
  //       inline_keyboard: [[{ text: "Играть ещё раз", callback_data: "/game" }]],
  //     }),
  //   };
  //функция начала игры
  const startGame = async (chatId) => {
    await bot.sendMessage(
      chatId,
      "Сейчас я загадаю число от 0 до 9, а ты попробуй отгадать. "
    );
    //генерация рандомного числа
    const ranodomNumber = Math.floor(Math.random() * 10);
    //сохраняем число в объект chat
    chat[chatId] = ranodomNumber;
    await bot.sendMessage(chatId, "Отгадывай!", gameOptions);
  };

  //прослушивание событий сообщений
  //поля text и chatId берем из сообщения msg
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    //   console.log(msg);
    //проверка при инициализации чата(сообщение /start) указываем ответ от бота
    if (text === "/start") {
      //функция отправки стикера
      // await bot.sendSticker(chatId, "https://tlgrm.ru/stickers/stalin_zbs");
      //функция ответа
      return bot.sendMessage(chatId, "Приветствую тебя кто бы ты ни был!");
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Aaaa!Твое имя ${msg.from.first_name} ${msg.from.last_name}`
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    //если ни одна команда не отработала
    // return bot.sendMessage(chatId, "Я тебя не понял!");
  });
  //функция получения обратного вызова при нажатии на кнопку
  //data и chatId получаем из сообщения от бота
  bot.on("callback_query", (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    // console.log(msg);
    //проверка перезапуска игры
    if (data === "/game") {
      return startGame(chatId);
    }
    //проверка отгадал ли пользователь цифру
    if (data == chat[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю!Ты отгадал цифру ${chat[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Увы!Ты не отгадал!Я загадал цифру ${chat[chatId]}`,
        againOptions
      );
    }
  });
};
start();
