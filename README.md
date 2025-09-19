# Afk bot for any server including aternos
Hi, this is a minecraft bot which stays afk in your minecraft server making some server like aternos 24/7.

### **Setup:**  
First of all you need to change the ip in [config file](https://github.com/itswinterbush26/Afk-Bot/blob/main/settings.json).
**Don't change the port**, you may change the rest of the stuff
```
{
	"ip":"yourip",
	"port": "25565",
	"name": "afk bot"
}
```
### **run the bot on github actions***
The is how to run the bot after configuring the bot to your server.

Go to actions and it will prompt you some thing then click enable workflow.
Then run the workflow file.
### **Important note:**
The bot is capable of joining any versions.
just add the following plugins:
- Viaversion
- Viarewind
> Others:
- If your server has login security its auto register and login.
- If your server has antibot/ddos protection, kindly whitelist the bot from that.
- Do not change the version in settings.json.
