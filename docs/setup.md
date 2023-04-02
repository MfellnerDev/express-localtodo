# Setup local ToDo App

## 1. Linux
### 1.1 MongoDB setup
### 1.1.1 Pacman
First, install the [mongodb-bin](https://aur.archlinux.org/packages/mongodb-bin) package with the help of [Yay](https://github.com/Jguer/yay):
```shell
$ yay -S mongodb-bin
# Follow installing instructions
```

(you can also **install** the [mongodb](https://aur.archlinux.org/packages/mongodb-bin) package. But keep in mind that this version
will build from source.)

For second, install the [mongosh-bin](https://aur.archlinux.org/packages/mongosh-bin).
This is an JavaScript and Node.js 16.x environment that can help you interact with your MongoDB deployment easily.

```shell
$ yay -S mongosh-bin
# Follow installing instructions
```

Next, you have to **start the MongoDB systemd service**:
```shell
$ sudo systemctl start mongodb

$ sudo systemctl status mongodb
# Should get the following output:
#● mongodb.service - MongoDB Database Server
#     Loaded: loaded (/usr/lib/systemd/system/mongodb.service; disabled; preset: disabled)
#     Active: active (running) since Sat 2023-03-25 22:32:55 CET; 2h 2min ago
#       Docs: https://docs.mongodb.org/manual
```

**Create user with password and roles**:
```shell
$ mongosh
# Should connect to your local MongoDB database

[DB-Name]> db.createUser(
{	user: "USERNAME",
	pwd: "PASSWORD",

	roles:[{role: "userAdminAnyDatabase" , db:"admin"}]})
	
# Everything should be executed fine.
```

## 2. Windows