# Getting started with the local TODO App

Please note that this manual guide only provides steps for Linux-based systems.
I will soon create a manual for the Windows installation.

A Docker version is coming soon.

## 1. Requirements
You will need to install the following requirements on your system:

-> [NodeJS@18.15.0](https://nodejs.org/en/blog/release/v18.15.0) (including `npm`) *[1]*

-> [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/) *[2]*

---
*[1]* It theoretically doesn't matter which version of NodeJS you have installed. The 
project was developed and tested under NodeJS@18.15.0.

*[2]* You will need to run a local MongoDB server;

- [Run a local MongoDB Server](https://www.prisma.io/dataguide/mongodb/setting-up-a-local-mongodb-database); 

Follow these instructions.
It is important to note your `MongoDB connection string` as you will
need it for the application.

## 2. Install and run the local TODO App

Now that you have Node and a local MongoDB server running on your system, you can move on to installing and
running the application.

### 2.1 Installing

Clone the repository to your machine:

```shell
$ git clone https://github.com/MfellnerDev/express-localtodo
```

Now you need to install the NodeJS requirements:

```shell
$ cd <project-root-directory>
# Installs requirements for project listed in package.json
$ npm install 
```


*Optional*: Install the dev dependencies:

```shell
$ npm install dev
```

Next, you need to create a `.env` file in the root directory of the project and paste your `MongoDB connection string`
into it.

You can find the "syntax" for this in `.env_example`. 

For example, your `.env` file could look like this:
```shell
MONGODB_CONNECTION_STRING="mongodb://127.0.0.1:27017"
```

The last step is running the application:

```shell
$ npm run start
# You should receive the following output:
# > express-localtodo@1.0 start
# > node ./bin/www

```

Congratulations! You've succes  sfully installed and run the application.