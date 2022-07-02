const mongoose = require('mongoose');
const chalk = require('chalk');
const moment = require('moment');
const timestamp = `[${moment().format('YYYY-MM-DD HH:mm:ss')}]:`;


module.exports = async (url) => {
    const dbOptions = {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,  
      };

    mongoose.connect(url, dbOptions)
    .catch(err => {
      console.log(`${timestamp} [${chalk.bgRed(`Mongoose`)}] Got a Error with the Mongoose Connection!\n`, err.message);
    })

    mongoose.Promise = global.Promise;

    mongoose.connection.on('err', err => {
        console.log(`${timestamp} [${chalk.bgRed(`Mongoose`)}] Mongoose connection error!\n`, err.message);
    });

    mongoose.connection.on('disconnected', () => {
        console.log(`${timestamp} [${chalk.bgRed(`Mongoose`)}] Mongoose connection lost!\n`);
    });
};