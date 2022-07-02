const CronJob = require("cron").CronJob;
const chalk = require('chalk'),
moment = require('moment');
const Schema = global.api.schemas.Webhooks;

new CronJob("15 1 * * *", async function () {
    try {
    const DatabaseEntrys = await Schema.find().exec();
    let number = 0;

    let sended = 0;
    let errors = 0;


    if(DatabaseEntrys.length > 0) {
        DatabaseEntrys.forEach(async entry => {
            setTimeout(async () => {
            const WebhookToSend = new global.api.discordjs.WebhookClient({ url: entry.webhookUrl });
            const TodayObjekt = global.api.TodayObject;
            number++;

            const DateTimeStamp = Math.round((new Date(TodayObjekt.date)).getTime() / 1000);


            const WebhookSender = await WebhookToSend.send({
                avatarURL: `https://cdn.discordapp.com/icons/530727855475261450/6c98e944932d8574b332b7195fa094fe.webp`,
                username: `Song of the Day`,
                embeds: [
                    new global.api.discordjs.MessageEmbed()
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
            })
            .then(test => {
                sended++;
            })
            .catch(async err => {
                await entry.delete().catch(err => { })
                errors++;
            })

            }, number * 1000);
        })

        setTimeout(() => {
            console.log(`${global.api.timestamp()} [${chalk.bgBlue(`Webhooks`)}] Sended ${sended} Webhooks and got ${errors} Errors!`)
        }, DatabaseEntrys * 2500)
    }

    } catch(err) {

    }
}, null, true, "Europe/Berlin");