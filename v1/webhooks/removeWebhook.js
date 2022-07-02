const app = global.app;
const WebhooksSchema = global.api.schemas.Webhooks;
const chalk = require('chalk');
const DiscordJs = global.api.discordjs;

app.get('/v1/removeWebhook', async (req, res) => {
    console.log(`${global.api.timestamp()} [${chalk.bgWhite(`GET`)}] ${req.originalUrl}`);

    try {
        global.api.counters.webhookConfigs++; // counter for the number of requests

        if (global.handleRateLimit(res, req, 60 * 1000 * 5, "removeWebhook")) return;


        const WebhookUrl = req.query.webhookUrl;
        if (!WebhookUrl) return res.send(`Please provide a Webhook URL!`);
        if (!WebhookUrl.includes('discord.com') || !WebhookUrl.includes('/api') || !WebhookUrl.includes('webhooks')) return res.send(`Please provide a valid Webhook URL!`);

        const DatabaseEntry = await WebhooksSchema.findOne({
            webhookUrl: WebhookUrl,
        })

        if (!DatabaseEntry) return res.send(`This Webhook is not in the Database!`);

        let error = false;
        await DatabaseEntry.delete().catch(err => {
            error = true;
        });

        if (error) return res.send(`Sorry but I got a error! Please report this here: https://songoftheday.cc/discord`);


        return res.send(`Webhook removed!`);
    } catch (err) {
        console.log(err);
        return res.status(500).send(`Sorry but I got a error! Please report this here: https://songoftheday.cc/discord`);
    }
})