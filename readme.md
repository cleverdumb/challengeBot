## Configuration:

1. All the details should be in `config.json`

`challengeChannelId` is the challenge channel id which the bot will post the questions
`serverId` is the server's id
`staffId` is the id of the role of the staff that can contribute
`unansweredRoleId` is another role for people who can view the channel before they send any message
`botId` is the id of the bot (not abc#1234 it is the 'copy id' when you right click on the user)

2. Create a file called `secret.json` and put in your token

```
{
    "token":"your token here"
}
```

3. Create a file called `data.db`
4. Run `node index.js`

by cleverdumb