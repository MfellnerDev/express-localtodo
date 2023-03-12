const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ToDoSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required!"],
        maxLength: 150
    },
    description: {
        type : String,
        required: [true, "Description is required!"],
        maxLength: 300
    },
    dueDate: {
        type: Date,
        required: [true, "Date is required!"]
    },
    subject: {
        type: String,
        required: false
    },
    isDone: {
        type: Boolean,
        required: true,
        default: false,
    }
});

//To Do schema's toString
ToDoSchema.virtual("toString").get(function () {
    return `${this.title} ; ${this.description} \n ${this.dueDate} ; ${this.subject} ; ${this.isDone}`;
});

//To Do schema's url
ToDoSchema.virtual("url").get(function  () {
    return `/todo/${this._id}`;
})

module.exports = mongoose.model("ToDo", ToDoSchema);