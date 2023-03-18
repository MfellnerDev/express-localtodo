/**
 * Test NodeJS & mongoose application with Jest and supertest
 * Disclaimer: Because this app DOES NOT have a "real" API endpoint,
 * testing it proved to be a little difficult.
 * @author MfellnerDev
 * @version 18.03.2023
 */

const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const Todo = require("../models/todo");

//load env variables
require('dotenv').config();

const mongodb = process.env.MONGODB_CONNECTION_STRING || 'mongodb://127.0.0.1:27017';

beforeEach(async () => {
    await mongoose.connect(mongodb);
});

function createNewTodoEntry(title, description, priority, dueDate, subject, isDone)   {
    let id = new mongoose.Types.ObjectId();
    let newTodoEntry = new Todo({
        _id: id,
        title: title,
        description: description,
        priority: priority,
        dueDate: dueDate,
        subject: subject,
        isDone: isDone,
    });
    newTodoEntry.save();
    return id;
}

// TEST CASE: get all todo_ entries
describe('GET /todo/entries', () => {
    //performs request to /entries
    it('should return all todo entries', async () => {
        const res = await request(app).get('/todo/entries');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
    });
});

// TEST CASE: CREATE TODO_ & GET DETAILED VIEW
describe('GET /todo/entries/:id', () => {
    it("should return detail of todo", async () => {
        let objId = await createNewTodoEntry( "Test221", "Test2", 0, "2005-05-13", "hello", false);
        const res = await request(app).get(`/todo/entries/${objId}`);
        expect(res.statusCode).toBe(200);
    });
});

// TEST CREATE TODO_ ENTRY
describe('POST /todo/entries/create', () => {
   it('Should create a todo entry', async () => {
       const res = await request(app).post('/todo/entries/create').send({
           title: "Title1",
           description: "description1",
           priority: 0,
           dueDate: "2005-05-13",
           subject: "AM",
           "isDone": false,
       });
       //if redirected -> created successfully
       expect(res.statusCode).toBe(302);
   });
});