const DataBase_URL = "mongodb+srv://Admin:Obdxj9SnGwE3zbyU@cluster0.xo3gk7b.mongodb.net/?retryWrites=true&w=majority";
const QuickMongo = require("quick-mongo-super");
const { base64encode, base64decode } = require('nodejs-base64');
const rateLimit = require('express-rate-limit')
const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const app = express();
const port = 80

const db = new QuickMongo({
    connectionURI: DataBase_URL,
    dbName: 'UserAccounts',
    collectionName: 'database'
});

const createAccountLimiter = rateLimit({
	windowMs: 30 * 60 * 1000,
	max: 5,
	message: 'Too many accounts created from this IP, please try again after an 30 minutes',
	standardHeaders: true, 
	legacyHeaders: false,
});

const loginAccountLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
    message: 'Too many login attempts from this IP, please try again after an 15 minutes',
	standardHeaders: true,
	legacyHeaders: false,
});

(async () => {
    //await db.connect().then(console.log("Connected To Database.")).catch((e) => console.log(e))
    await db.connect().then((e) => { console.log("Connected To Database.")})

    //await db.set(`${username}.password`, base64encode('password'))
    //await db.set(`${username}.profilepicture`, base64encode('profilepicture'))
})();

app.get('/login', loginAccountLimiter, async(req, res) => {
    let OriginalMessage = req.originalUrl;
    if (OriginalMessage.includes("/?login=")){
        if (!OriginalMessage.includes(":")){ return res.send("404"); }
        OriginalMessage = OriginalMessage.replace("/login/?login=", "");
        OriginalMessage = OriginalMessage.split(":");
        try {
            let username = base64encode(OriginalMessage[0]);
            let password = base64encode(OriginalMessage[1]);
            let abc = await db.fetch(username);
            if (password === abc.password){
                return res.send(base64decode(abc.uuid) + ":" + OriginalMessage[0]);
            } else {
                res.send("invalid_password");
            }
        } catch(err) {
            if (err == "TypeError: Cannot read properties of null (reading 'password')"){
                return res.send("invalid_username");
            }
            return res.send("404");
        }
    }
})

app.get('/register', createAccountLimiter,  async(req, res) => {
    let OriginalMessage = req.originalUrl;
    if (OriginalMessage.includes("/?register=")){
        if (!OriginalMessage.includes(":")){ return res.send("404"); }
        OriginalMessage = OriginalMessage.replace("/register/?register=", "");
        OriginalMessage = OriginalMessage.split(":");
        try {
            let username = base64encode(OriginalMessage[0]);
            let password = base64encode(OriginalMessage[1]);
            
            //await db.set(`${username}.password`, base64encode('password'))
            //await db.set(`${username}.profilepicture`, base64encode('profilepicture'))
            try{
                let abc = await db.fetch(username)
                if(abc.password){
                    return res.send("username_exist");
                }
                throw new Error('Try Throw Error');
            } catch (err) {
                if (err == "TypeError: Cannot read properties of null (reading 'password')"){
                    try {
                        await db.set(`${username}.password`, password)
                        await db.set(`${username}.profilepicture`, base64encode('profilepicture'))
                        await db.set(`${username}.uuid`, base64encode("UUID_" + crypto.randomUUID()))
                        let cba = await db.fetch(username)
                        if(cba.password){
                            return res.send(base64decode(cba.uuid));
                        }
                    } catch (err) {
                        console.log(err)
                        return res.send("404");
                    }
                    return res.send("404");
                }
                return res.send("404");
            }

    
        }
        catch(err) {
            console.error(err);
        }
    }
    else{
        return res.send("404");
    }
})

app.get('/', async(req, res) => {
    return res.send("404");
    console.log(req.originalUrl)
    let OriginalMessage = req.originalUrl;
    if (OriginalMessage.includes("/?login=")){
        if (!OriginalMessage.includes(":")){ return res.send("404"); }
        OriginalMessage = OriginalMessage.replace("/?login=", "");
        OriginalMessage = OriginalMessage.split(":");
        try {
            const username = base64encode(OriginalMessage[0]);
            const password = base64encode(OriginalMessage[1]);
            let abc = await db.fetch(username).catch((e) => { console.log(e); res.send("username_non_existent"); });
            if (password === abc.password){
                res.send("worked");
            } else {
                res.send("invalid_password");
            }
        } catch(err) {
            console.error(err);
        }
    }
})
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})




process.on('unhandledRejection', (reason, p) => {
    fs.appendFile('./Logs/unhandledRejection.log', reason + "\n", function (err) {})
    fs.appendFile('./Logs/unhandledRejection.log', p + "\n", function (err) {})

});
process.on('uncaughtException', err => {
    fs.appendFile('./Logs/unhandledRejection.log', err + "\n", function (err) {})
});
