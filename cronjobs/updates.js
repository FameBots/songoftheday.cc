const CronJob = require("cron").CronJob;

new CronJob("0 */5 * * * *", async function () {
    await global.api.UpdateCache();
    global.api.counters.webhooks = await global.api.UpdateCounter();

    const { date, unixtimestamp, songUri, songTitle, songAuthor } = await global.api.UpdateToday();

    global.api.TodayObject = {
        date,
        unixtimestamp,
        songUri,
        songTitle,
        songAuthor,
    }
}, null, true, "Europe/Berlin");