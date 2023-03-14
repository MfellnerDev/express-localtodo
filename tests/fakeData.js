/**
 * Generates fake data for the mongoDB database - Currently only one schema = Todo_
 *
 * @author MfellnerDev
 * @version 13.03.2023
 */

//TODO: Replace console.log() with a real logger

const faker = require('faker');
const Todo = require("../models/todo");
const mongoose = require("mongoose");

// MONGODBURL -> env variable that has to include your WHOLE MongoDB connection string
//or the URL will be set to your local mongoDB server
const mongoDBConnectionURL = process.env.MONGODBURL || 'mongodb://0.0.0.0:27017/todoApp';

//disable queries for properties that are not in the schema
mongoose.set('strictQuery', false);

//number of documents that will be created in the DB
const fakeObjectQuantity = 100;

async function connectToDB() {
    await mongoose.connect(mongoDBConnectionURL);
}

function generateFakeData() {
    //connect to db
    connectToDB().catch(err => console.log(err));

    console.log("fakeData.js - Fill the database with fake data.");
    //generate fake entries
    generateFakeTodoEntries();

    console.log("Fake data creation was successful! Enjoy your new entries. :)");
}

function generateFakeTodoEntries() {
    // check if quantity is NaN (Not a Number
    if (isNaN(fakeObjectQuantity)) {
        console.log(`Error! Quantity has to be a number! Input: ${fakeObjectQuantity}`);
    } else {
        console.log(`Trying to fill db with ${fakeObjectQuantity} Todo entries...`);
        //promies = JS objects that represent a value that may not be available yet
        //More -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise?retiredLocale=de
        let promises = [];
        for (let i = 0; i < fakeObjectQuantity; i++) {
            //create a new entry with (completely) fake data
            let newTodoEntry = new Todo({
                title: faker.lorem.sentence(),
                description: faker.lorem.sentence(),
                priority: faker.datatype.number({min: 0, max: 10}),
                dueDate: faker.date.future(),
                subject: faker.lorem.word(),
                isDone: faker.datatype.boolean(),
            })
            //push entry into the array and save it
            promises.push(newTodoEntry.save());
        }
        //wait for all promises to be resolved/rejected before logging result
        Promise.all(promises)
            .then(() => {
                console.log(`${fakeObjectQuantity} Todo entries saved into the database.`);
            })
            .catch((error => {
                console.log(error);
            }));
    }
}

// start fake data creation
generateFakeData();