const { glob } = require("glob"),
{ promisify } = require("util"),
globPromise = promisify(glob),
chalk = require('chalk'),
moment = require('moment');


const getToday = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    return today;
}

// Schemas
const SOTDSchema = require('./database/schemas/SongOfTheDay.js');
const WebhooksSchema = require('./database/schemas/Webhooks.js');

// Cache
const Cache = new Map();
const getTimestamp = () => {
    return `[${moment().format('YYYY-MM-DD HH:mm:ss')}]:`;
}


// Create Api Object
const ApiObject = global.api = {
    rateLimits: {
        today: new Set(),
        date: new Set(),
        cache: new Set(),
        testWebhook: new Set(),
        addWebhook: new Set(),
        removeWebhook: new Set(),
    }, 
    timeouts: {
        today: new Set(),
        date: new Set(),
        cache: new Set(),
        testWebhook: new Set(),
        addWebhook: new Set(),
        removeWebhook: new Set(),
    },
    counters: {
        today: 0,
        date: 0,
        docs: 0,
        redirects: 0,
        cache: 0,
        webhookConfigs: 0,
        webhooks: 0,
    },
    TodayObject: {
        date: null,
        unixtimestamp: null,
        songUri: null,
        songTitle: null,
        songAuthor: null,
    },
    UpdateCache: async () => {
        const Entrys = await SOTDSchema.find().exec();
        Entrys.forEach(entry => {
            Cache.set(entry.date, {
                date: entry.date,
                unixtimestamp: Math.round((new Date(entry.date)).getTime() / 1000),
                songUri: entry.songUri,
                songTitle: entry.songTitle,
                songAuthor: entry.songAuthor,
            });
        })
    
        console.log(`${getTimestamp()} [${chalk.bgBlue(`Cache`)}] The Cache is now updated.`);
    },
    UpdateCounter: async () => {
        const DatabaseEntrys = await WebhooksSchema.find().exec();
        return DatabaseEntrys.length;
    },
    UpdateToday: async () => {
        function getTodayforUpdate() {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
        
            today = mm + '/' + dd + '/' + yyyy;
            return today;
        }

        let Entry = await SOTDSchema.findOne({
            date: `${getTodayforUpdate()}`
        });
        
        if(!Entry) console.log(`${getTimestamp()} [${chalk.bgGreen(`API`)}] Can't find today Object.. ${getTodayforUpdate()}`);

        return {
            date: Entry.date,
            unixtimestamp: Math.round((new Date(Entry.date)).getTime() / 1000),
            songUri: Entry.songUri,
            songTitle: Entry.songTitle,
            songAuthor: Entry.songAuthor,
        };
    },
    discordjs: require('discord.js'),
    schemas: {
        SongOfTheDay: SOTDSchema,
        Webhooks: WebhooksSchema,
    },
    utils: null,
    Cache: Cache,
    getToday: () => getToday(),
    timestamp: () => getTimestamp(),
}

console.log(`${ApiObject.timestamp()} [${chalk.bgGreen(`API`)}] Loading and Start Creating the API..`)


setTimeout(async () => {
        // create mongo creation
        require("./database/mongoose.js")("MOGOOSEURL");

        // Load all CronJobs
        const CronJobFiles = await globPromise(`${process.cwd()}/cronjobs/*.js`);
        CronJobFiles.map((value) => require(value));

        // Load all utils
        ApiObject.utils = require("./utils.js");

        // Trigger Update Functions
        await ApiObject.UpdateCache();
        ApiObject.counters.webhooks = await ApiObject.UpdateCounter();
        ApiObject.TodayObject = await ApiObject.UpdateToday();

        // Load the Api
        const port = "8866"
        const express = require("express")
        var bodyParser = require('body-parser');
        const app = global.app = express()
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.set("json spaces", 2)
        app.set('view engine', 'html');

        app.listen(port, () => {
            console.log(`${ApiObject.timestamp()} [${chalk.bgGreen(`Express`)}] Running on port ${port}`)
        })

        // load all endpoints
        const EndPointsFiles = await globPromise(`${process.cwd()}/v1/**/*.js`);
        EndPointsFiles.map((value) => require(value));


        module.exports = ApiObject;
}, 5000)