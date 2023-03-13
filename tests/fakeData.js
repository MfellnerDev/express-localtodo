/// GENERATES FAKE DATA & FILLS DB FOR TESTING PURPOSE ///

const fakery = require('mongoose-fakery');
const Todo = require("../models/ToDo");
const mongoose = require("mongoose");
const mongoDBUser = "";
//Todo: encrypt
const mongoDBPassword = "";
const mongoDBConnectionURL = process.env.MONGODBURL || function() {
    if (mongoDBUser.isEmpty() && mongoDBPassword.isEmpty()) {
        //user did not specific any db user or db password
        return `mongodb://127.0.0.1:27017/todoApp`;
    } else {
        //user did specify db user and password
        return `mongodb://${mongoDBUser}:${mongoDBPassword}@127.0.0.1:27017/todoApp`;
    }
};

async function connectToDB() {
    await mongoose.connect(mongoDBConnectionURL);
}

function generateFakeData() {
    //connect to db
    connectToDB().catch(err => console.log(err));
    console.log("fakeData.js - Fill the database with fake data.")
    const countOfFakeObject = prompt("How many fake ToDo entries do you want to create?");
    for (let i = 0; i < countOfFakeObject; i++) {
        //implementation of model creating and saving
    }
    //get input from terminal -> How many fake todos does the user want to generate?
}

