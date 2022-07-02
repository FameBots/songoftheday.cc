const app = global.app;
const chalk = require('chalk');
const TodayObjekt = global.api.TodayObject;



app.get('/', (req, res) => {
    console.log(`${global.api.timestamp()} [${chalk.bgWhite(`GET`)}] ${req.originalUrl}`);

    try {
    global.api.counters.redirects++; // counter for the number of requests

    return res.redirect(TodayObjekt.songUri)
    } catch(err) {
        console.log(err);
        return res.status(500).send(`Sorry but I got a error! Please report this here: https://songoftheday.cc/discord`);
    }
})


app.get('/discord', (req, res) => {
    global.api.counters.redirects++; // counter for the number of requests

    console.log(`${global.api.timestamp()} [${chalk.bgWhite(`GET`)}] ${req.originalUrl}`);

    return res.redirect(`https://discord.gg/ZVERh35`)
})

app.get('/docs', (req, res) => {
    global.api.counters.redirects++; // counter for the number of requests

    console.log(`${global.api.timestamp()} [${chalk.bgWhite(`GET`)}] ${req.originalUrl}`);

    return res.redirect(`https://songoftheday.cc/v1/docs`)
})