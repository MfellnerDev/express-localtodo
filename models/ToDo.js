const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const ToDoSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required!"],
        maxLength: 150,
    },
    description: {
        type : String,
        required: [true, "Description is required!"],
        maxLength: 300,
    },
    priority: {
        type: Number,
        required: [true, "ToDo priority is required!"],
        min: 0,
        max: 10,
    },
    dueDate: {
        type: Date,
        required: [true, "Date is required!"],
    },
    subject: {
        type: String,
        required: [true, "The subject is required!"],
    },
    isDone: {
        type: Boolean,
        required: [true, "IsDone is required!"],
        default: false,
    },
    secretTodoKey: {
        type: String,
        required: [true, "The secret key for your todo is required!"],
    }
});

//To Do schema's url
ToDoSchema.virtual("url").get(function  () {
    return `/todo/entries/${this._id}`;
})

//To Do schema's formatted date
ToDoSchema.virtual("dueDate_formatted").get(function () {
    return DateTime.fromJSDate(this.dueDate).toLocaleString(DateTime.DATE_MED);
})

module.exports = mongoose.model("ToDo", ToDoSchema);