var token='347633632:AAGqH1mSIPHtNAiJT0GxDArXg8VUbeWfUyE';
var TelegramBot = require('node-telegram-bot-api'),
    fs = require('fs');
const GoogleImages = require('google-images');
var bot = new TelegramBot(token, {polling: true});
const client = new GoogleImages('013936756368695518274:se697hhw5ri', 'AIzaSyAdZEV-ZXJY3iCzuZvnWj2gn9fiMsJ5YMI');

bot.on('message', (msg) => {
    var chatId = msg.chat.id;
    var userId = msg.from.id;
    var text=msg.text;
    var name=msg.from.first_name+" "+msg.from.last_name;
    var control=text.split(" ");
    if(control[0]){
        switch (control[0]){
            case '/time' :currentTime(chatId);break;
            case '/sayHi' :greeting(chatId,name,userId);break;
            case '/help' :sendHelp(chatId);break;
            case '/start' :
                greeting(chatId,name);
                sendHelp(chatId);
                break;
            case '/code':sendIndex(chatId);break;
            default:
                client.search(text).then(images => {
                    if(images.length===0) {
                        bot.sendMessage(chatId, 'Увы, результаты отсутствуют');
                    }
                    else {
                        var rand = Math.floor(Math.random() * images.length);
                        bot.sendPhoto(chatId, images[rand].url, {caption: images[rand].description});
                    }
                });
                break;
        }
    }
});
var greeting=(chatId,name,userId)=>{
    bot.sendMessage(chatId, 'Привет, '+name);
    bot.getUserProfilePhotos(userId, 0, 1).then(function(data){
        bot.sendPhoto(chatId,data.photos[0][0].file_id);
    });
};
var currentTime=(chatId)=> {
    var date=new Date();
    var time=correctTime(date.getHours())+":"+
             correctTime(date.getMinutes())+":"+
             correctTime(date.getSeconds());
    bot.sendMessage(chatId,time);
}
var correctTime=(time)=>time<10?'0'+time:time;
var sendHelp=(chatId)=> {
    fs.readFile('./help.txt', 'utf8', function (err,data) {
        if (err) {return console.log(err);}
        bot.sendMessage(chatId,data);
    });
}
var sendIndex=(chatId)=> {
    bot.sendDocument(chatId,"index.js")
};
