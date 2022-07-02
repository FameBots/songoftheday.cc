
const handleRateLimit = global.handleRateLimit = (res, req, cooldown, type, WebhookUrl) => {
    // get the IP
    const ip = req.header('x-forwarded-for') ?? req.socket.remoteAddress;
    // get Set
    const Set = global.api.rateLimits[type];


    if(WebhookUrl) {
        // check if IP is in Set
        if(Set.has(WebhookUrl)) return res.status(429).send(`Sorry but this webhook got ratelimited for to many requests. Please try again in a few minutes.`);
        // add IP to Set
        Set.add(WebhookUrl);
        // set the timeout
        setTimeout(() => Set.delete(WebhookUrl), cooldown);
    } else {
        // check if IP is in Set
        if(Set.has(ip)) return res.status(429).send(`Sorry but you got ratelimited for to many requests. Please try again in a few minutes.`);
        // add IP to Set
        Set.add(ip);
        // set the timeout
        setTimeout(() => Set.delete(ip), cooldown);
    }



    // return false if there is no cooldown
    return false;
}




module.exports = handleRateLimit;