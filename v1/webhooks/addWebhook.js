const app = global.app;
const WebhooksSchema = global.api.schemas.Webhooks;
const chalk = require('chalk');
const DiscordJs = global.api.discordjs;


app.get('/v1/addWebhook', async (req, res) => {
    console.log(`${global.api.timestamp()} [${chalk.bgWhite(`GET`)}] ${req.originalUrl}`);

    try {
        global.api.counters.webhookConfigs++; // counter for the number of requests


        const WebhookUrl = req.query.webhookUrl;
        if(!WebhookUrl) return res.send(`Please provide a Webhook URL!`);
        if(!WebhookUrl.includes('discord.com') || !WebhookUrl.includes('/api') || !WebhookUrl.includes('webhooks')) return res.send(`Please provide a valid Webhook URL!`);


        const Webhook = new DiscordJs.WebhookClient({
            url: WebhookUrl,
        })
        if(!Webhook) return res.send(`Please provide a valid Webhook URL!`);
        

        const DatabaseEntry = await WebhooksSchema.findOne({
            webhookUrl: WebhookUrl,
        })

        if(DatabaseEntry) return res.send(`This Webhook is already in the Database!`);

        if(global.handleRateLimit(res, req, 60 * 1000 * 2, "addWebhook", WebhookUrl)) return;

        let error = false;
        await Webhook.send({
            avatarURL: `https://cdn.discordapp.com/icons/530727855475261450/6c98e944932d8574b332b7195fa094fe.webp`,
            username: `Song of the Day`,
            embeds: [
                new DiscordJs.MessageEmbed()
                .setTitle(`Test Embed for songoftheday.cc`)
                .setColor('#F781BE')
                .setURL(`https://songoftheday.cc/docs`)
                .setFooter({
                    text: `WebhookURL: ${WebhookUrl}`,
                    iconURL: `https://cdn.discordapp.com/icons/530727855475261450/6c98e944932d8574b332b7195fa094fe.webp`
                })
            ],
        }).catch(err => {
            error = true;
        })

        if(error) return res.send(`Sorry but I got a error by sending a test embed! Get help here: https://songoftheday.cc/discord`);

        new WebhooksSchema({
            webhookUrl: WebhookUrl,
        }).save().catch(err  => {
            error = true;
        });

        if(error) return res.send(`Sorry but I got a error! Please report this here: https://songoftheday.cc/discord`);


        return res.send(`Webhook added! We now send a Test Webhook!`);
    } catch(err) {
        console.log(err);
        return res.status(500).send(`Sorry but I got a error! Please report this here: https://songoftheday.cc/discord`);
    }
})