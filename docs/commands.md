# Commands/Scripts of this application

While developing, I've created a few useful scripts that I would like to share with everyone.

If you are not familiar with the NodeJS project structure, the commands for executing these
scripts can be found in the `package.json` file in the project root.
I will just explain these briefly here.

## 1. start

Like its name indicates, this will start the application.
The file that starts the server is located at `bin/www`.

Run the command:

```shell
$ npm start
```

## 2. dev

This command just runs the application. But instead of running
it normally, the command uses the `nodemon` library to check if any changes to the source code are happening
while the app is running. If there are any changes, the server will be refreshed automatically.

If you want to run this command, just type in the following:

```shell
$ npm run dev
```

## 3. fillDB

You can find the script in `tests/fakeData.js`.
It is designed to fill the MongoDB database with as much documents as you want.

This script is working with the `faker` library and is filling the TODO Mongoose
model with random values according to the expected datatype.

If you want to fill your database with fake entries, you can do the following:

**1. Edit the fakeObjectQuantity constant**

The `fakeObjectQuantity` constant is the number of fake entries that will be created in the database.

Just change it to your wanted quantity.

**2. Run the `fillDB` command**

```shell
$ npm run fillDB
```

## 4. test

You can find the script in `tests/todo.test.js`.
It is designed to just test a few really basic functions of the application with the 
`supertest` library. But because the app doesn't
have pure API endpoints, testing proved to be a little bit difficult.

If you want to run it anyway, just type in the following command:

```shell
$ npm run test
```



