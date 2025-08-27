const path = require("path"); //thư viện path có sẵn trong nodejs
const express = require("express");

let configViewEngine = (app) => {
    app.set('views', path.join('./src', 'views'));
    app.set('view engine', 'ejs');
    app.use(express.static(path.join('./src', 'public')));
};

module.exports = configViewEngine; //xuất hàm ra