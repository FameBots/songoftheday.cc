
const app = global.app;
const DiscordJs = global.api.discordjs;
const WebhooksSchema = global.api.schemas.Webhooks;
const TodayObjekt = global.api.TodayObject;
const chalk = require('chalk');

app.get('/v1/testWebhook', async (req, res) => {
    console.log(`${global.api.timestamp()} [${chalk.bgWhite(`GET`)}] ${req.originalUrl}`);

    try {
        global.api.counters.webhookConfigs++; // counter for the number of requests

        const WebhookUrl = req.query.webhookUrl;
        if(!WebhookUrl) return res.send(`Please provide a Webhook URL!`);
        if(!WebhookUrl.includes('discord.com') || !WebhookUrl.includes('/api') || !WebhookUrl.includes('webhooks')) return res.send(`Please provide a valid Webhook URL!`);

        const DatabaseEntry = await WebhooksSchema.findOne({
            webhookUrl: WebhookUrl,
        })

        if(!DatabaseEntry) return res.send(`This Webhook is not in the Database!`);

        if(global.handleRateLimit(res, req, 60 * 1000 * 2, "testWebhook", WebhookUrl)) return;

        const Webhook = new DiscordJs.WebhookClient({
            url: DatabaseEntry.webhookUrl,
        });


        const DateTimeStamp = Math.round((new Date(TodayObjekt.date)).getTime() / 1000);


        let error = false;
        await Webhook.send({
            avatarURL: `https://cdn.discordapp.com/icons/530727855475261450/6c98e944932d8574b332b7195fa094fe.webp`,
            username: `Song of the Day`,
            embeds: [
                new DiscordJs.MessageEmbed()
                .setColor('#F781BE')
                .setTitle(`Song of the Day`)
                .setURL(TodayObjekt.songUri)
                .setDescription(`The Song of the Day is **${TodayObjekt.songTitle}** by **${TodayObjekt.songAuthor}**!`)
                .setFooter({
                    text: `Powered by songoftheday.cc`,
                    iconURL: `https://cdn.discordapp.com/icons/530727855475261450/6c98e944932d8574b332b7195fa094fe.webp`,
                })
                .addFields(
                    {
                        name: `Date`,
                        value: `**<t:${DateTimeStamp}:d>**`,
                        inline: true,
                    },
                    {
                        name: `Link`,
                        value: `[Click Here](${TodayObjekt.songUri})`,
                        inline: true,
                    }
                )
            ],
        }).catch(err => {
            error = true;
        })

        if(error) return res.send(`Sorry but I got a error by sending a test embed! Get help here: https://songoftheday.cc/discord`);

        return res.send(`Webhook sended!`);
    } catch(err) {
        console.log(err);
        return res.status(500).send(`Sorry but I got a error! Please report this here: https://songoftheday.cc/discord`);
    }
})