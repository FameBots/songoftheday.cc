const app = global.app;
const WebhooksSchema = global.api.schemas.Webhooks;
const chalk = require('chalk');
const DiscordJs = global.api.discordjs;
const TodayObjekt = global.api.TodayObject;
const Cache = global.api.Cache;


app.get('/v1/cache', (req, res) => {
    console.log(`${global.api.timestamp()} [${chalk.bgWhite(`GET`)}] ${req.originalUrl}`);

    try {
        global.api.counters.cache++; // counter for the number of requests

        if (global.handleRateLimit(res, req, 60 * 1000 * 5, "cache")) return;

        var today = new Date();
        today.setHours(0, 0, 0, 0);
        const EntryArray = [];


        Cache.forEach(entry => {
            var varDate = new Date(entry.date);
            if (varDate <= today) return EntryArray.push(entry);
        })


        return res.send({
            Entrys: EntryArray
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send(`Sorry but I got a error! Please report this here: https://songoftheday.cc/discord`);
    }
})