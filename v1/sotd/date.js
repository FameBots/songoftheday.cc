const app = global.app;
const WebhooksSchema = global.api.schemas.Webhooks;
const chalk = require('chalk');
const DiscordJs = global.api.discordjs;
const TodayObjekt = global.api.TodayObject;

app.get('/v1/date', async (req, res) => {
    console.log(`${global.api.timestamp()} [${chalk.bgWhite(`GET`)}] ${req.originalUrl}`);

    try {
        global.api.counters.date++; // counter for the number of requests

        if(global.handleRateLimit(res, req, 250, "date")) return;

        const RequestDate = req.query.date;
        if(!RequestDate) return res.send(TodayObjekt);


        var varDate = new Date(RequestDate); //dd-mm-YYYY
        var today = new Date();
        today.setHours(0,0,0,0);
        
        if(varDate > today) return res.send(TodayObjekt);          


        const Entry = global.api.Cache.get(RequestDate);
        if(!Entry) return res.send(TodayObjekt);

        return res.send(Entry);
    } catch(err) {
        console.log(err);
        return res.status(500).send(`Sorry but I got a error! Please report this here: https://songoftheday.cc/discord`);
    }
})