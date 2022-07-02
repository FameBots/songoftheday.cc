const app = global.app;
const chalk = require('chalk');
const TodayObjekt = global.api.TodayObject;

app.get('/v1/docs', (req, res) => {
    console.log(`${global.api.timestamp()} [${chalk.bgWhite(`GET`)}] ${req.originalUrl}`);

    try {
        global.api.counters.docs++; // counter for the number of requests

    return res.send({
            "staticUrl": "https://songoftheday.cc/v1",
            "stats": [
                `Requests with redirect: ${global.api.counters.redirects}`,
                `Requests for /today: ${global.api.counters.today}`,
                `Requests for /date: ${global.api.counters.date}`,
                `Requests for /docs: ${global.api.counters.docs}`,
                `Requests for /cache: ${global.api.counters.cache}`,
                `Requests for /addWebhook & /removeWebhook & /testWebhook: ${global.api.counters.webhookConfigs}`,
                `Total Requests: ${global.api.counters.docs + global.api.counters.date + global.api.counters.today + global.api.counters.redirects + global.api.counters.cache}`,
                `Total Webhooks: ${global.api.counters.webhooks}`,
            ],
            "support_server": "https://songoftheday.cc/discord",
            "docs": "https://songoftheday.cc/docs",
            "api_endpoints": [
                `GET /date?date=${global.api.getToday()}`,
                `GET /today`,
                `GET /cache`,
                `GET /`,
                `GET /addWebhook?webhookUrl=WEBHOOK`,
                `GET /removeWebhook?webhookUrl=WEBHOOK`,
                `GET /testWebhook?webhookUrl=WEBHOOK`,
            ],
            "Note!": [
                "If the date for /date is before 04/20/2022 it will return the song of the day for today.",
                "All endpoints are GET requests.",
                "Since 05/03/2022 we changed our backend and the staticUrl is now https://songoftheday.cc/v1!",
            ]
        });
} catch(err) {
    console.log(err);
    return res.status(500).send(`Sorry but I got a error! Please report this here: https://songoftheday.cc/discord`);
}
})