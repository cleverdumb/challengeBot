const Discord = require('discord.js');
const {token} = require('./secret.json');
const sqlite3 = require('sqlite3').verbose();

const {serverId, unansweredRoleId, staffId, challengeChannelId, botId} = require('./config.json');

const client = new Discord.Client();

const db = new sqlite3.Database('data.db',sqlite3.OPEN_READWRITE,(err)=>{
    if (err) throw err;
})

db.run('create table if not exists problems (problem varchar, author varchar)',err=>{
    if (err) throw err;
})

let pool = [];
let did;

db.all('select * from problems', (err,rows)=>{
    if (err) throw err;
    console.log('rows');
    console.log(rows);
    rows.forEach(x=>{
        pool.push({content:x.problem,author:x.author});
    })
})

client.on('message',(msg)=>{
    if (msg.channel.id==challengeChannelId && !msg.member.roles.cache.has(staffId) && msg.author.id!=botId) {
        let role = client.guilds.cache.find(x=>x.id==serverId).roles.cache.find(x=>x.id==unansweredRoleId)
        msg.member.roles.remove(role);
        return;
    }
    let content = msg.content;
    if (content.indexOf('$')!=0) return;
    else {
        let stop = content.indexOf(' ');
        let cmd = content.slice(1,stop);
        console.log(cmd);
        switch (cmd) {
            case 'ping':
                msg.channel.send('pong');
                break;
            case 'contribute':
                if (!msg.member.roles.cache.has(staffId)) return;
                console.log(msg.author);
                pool.push({content:content.slice(stop+1),author:msg.author.username});
                db.run('insert into problems values(?,?)',content.slice(stop+1),msg.author.username);
                console.log(pool);
                msg.channel.send('done');
                break;
            case 'newDay':
                if (!msg.member.roles.cache.has(staffId)) return;
                // console.log(client);
                newDay();
                break;
            case 'terminate':
                throw 'Terminated';
        }
    }
})

function newDay() {
    let guild = client.guilds.cache.find(x=>x.id==serverId);
    // console.log(guild.roles.cache);
    let role = guild.roles.cache.find(x=>x.id==unansweredRoleId)
    // console.log(role);
    console.log('newDay');
    // console.log(guild.members);
    // guild.members.fetch().then(members=>{
    //     console.log(members);
    //     members.forEach(x=>{
    //         console.log(x);
    //         console.log('looping through members')
    //         x.roles.add('unanswered');
    //     })
    // })

    guild.members.cache.forEach(x=>{
        x.roles.add(role)
    })
    let problem = pool[Math.round(Math.random()*(pool.length-1))];
    console.log(problem);
    client.channels.cache.get(challengeChannelId).send(`${problem.content}\nby ${problem.author}`);
}

setInterval(()=>{
    if (Date.getHours()==15 && Date.getDay() != did) {
        newDay();
        did = Date.getDay();
    }
},1800000)

client.on('ready',()=>{
    console.log('ok');
})

client.login(token);