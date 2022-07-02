const app = global.app;
const WebhooksSchema = global.api.schemas.Webhooks;
const chalk = require('chalk');
const DiscordJs = global.api.discordjs;
const TodayObjekt = global.api.TodayObject;

app.get('/v1/today', (req, res) => {
    console.log(`${global.api.timestamp()} [${chalk.bgWhite(`GET`)}] ${req.originalUrl}`);

    try {
    global.api.counters.today++; // counter for the number of requests

    if(global.handleRateLimit(res, req, 250, "today")) return;

    return res.json(TodayObjekt)
    } catch(err) {
        console.log(err);
        return res.status(500).send(`Sorry but I got a error! Please report this here: https://songoftheday.cc/discord`);
    }
})