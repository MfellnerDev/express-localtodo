const Todo = require('../models/toDo');
const async = require("async");
const {body, validationResult} = require("express-validator");

exports.index = (req, res) => {
    async.parallel(
        {
            //methods for counting to do objects in db
            todo_entry_count(callback) {
                Todo.countDocuments({}, callback);
            },
            todo_notDone_entry_count(callback) {
                Todo.countDocuments({isDone: false}, callback);
            },
            todo_done_entry_count(callback) {
                Todo.countDocuments({isDone: true}, callback);
            },
        },
        (err, results) => {
            //render the result, callback = answer
            res.render("index", {
                title: "Your ToDo overview",
                error: err,
                data: results,
            })
        }
    )
};


//Display all ToDos
exports.todo_list = (req, res, next) => {
    //find {} = get everything, show todos with latest date first and exec query
    Todo.find({})
        .sort({dueDate: -1})
        .exec(function (err, todo_list) {
            if (err) {
                //there is an error
                return next(err);
            }
            //render the result
            res.render("todo_list", {page_title: "All Todos", todo_list: todo_list});
        });
};

//display detail page for specific ToDos-entry
exports.todo_detail = (req, res, next) => {
    async.parallel(
        {
            //find detailed todos entry
            todo(callback) {
                //find by id, execute query
                Todo.findById(req.params.id).exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                //there is an error
                return next(err);
            }
            if (results.todo == null) {
                //no results -> not found
                const err = new Error("ToDo entry not found!");
                err.status = 404;
                return next(err);
            }
            //todos found
            res.render("todo_detail", {
                page_title: results.todo.title,
                todo_object: results.todo,
            })
        }
    )
};

//display todos create form on GET
exports.todo_create_get = (req, res, next) => {
    //deliver form for creating todos
    res.render("todo_form", {title: "Create a new todo"});
};

// Handle todos create on post
exports.todo_create_post = [
    // Validate and sanitize fields.
    //-> trims strings, sets minLength = 1, escapes the string and with message
    body("title")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("title name must be specified."),
    body("description")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("description name must be specified."),
    body("secretTodoKey")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("Secret to do key must be specified."),
    //checks if date is valid -> ISO8601 format, converts it to date
    body("isDue", "Invalid isDue date")
        .optional({checkFalsy: true})
        .isISO8601()
        .toDate(),
    body("priority")
        .isNumeric()
        .escape(),
    body("subject")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("description name must be specified."),
    body("isDone")
        .toBoolean()
        .escape(),

    // Now process request after validation and sanitization
    (req, res, next) => {
        // Extract validation errors from a request
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages
            res.render("todo_form", {
                title: "Create a new ToDo",
                author: req.body,
                errors: errors.array(),
            });
            return;
        }

        // Data is valid

        // Create a todos object with escaped and trimmed data
        const todo = new Todo({
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            priority: req.body.priority,
            subject: req.body.subject,
            isDone: req.body.isDone,
            secretTodoKey: req.body.secretTodoKey,
        });
        //save the new object into the db
        todo.save((err) => {
            if (err) {
                return next(err);
            }
            // Successful - redirect to new todos.
            res.redirect(todo.url);
        });
    },
];

//display todos delete form on GET
exports.todo_delete_get = (req, res, next) => {
    async.parallel(
        {
            //find todos by id
            todo(callback) {
                Todo.findById(req.params.id).exec(callback);
            }
        },
        (err, results) => {
            if (err) {
                //there is an error
                return next(err);
            }
            if (results.todo == null) {
                //no results -> 404, redirect to all entries
                res.redirect("/todo/entries");
            }

            //successful, render form
            res.render("todo_form_delete", {
                title: "Delete ToDo",
                todo: results.todo
            })
        }
    )
};

// handle todos delete on POST
exports.todo_delete_post = (req, res, next) => {
    async.parallel(
        {
            //find todos by id
            todo(callback) {
                Todo.findById(req.params.id).exec(callback);
            },
        },
        async (err, results) => {
            if (err) {
                //there is an error
                return next(err);
            }

            //TODO: implement secret key input when deleting

            //find and delete object with id
            Todo.findByIdAndDelete(req.body.id, (err) => {
                if (err) {
                    //error while trying to find and delete it
                    return next(err);
                }
                //success - go to all entries
                res.redirect("/todo/entries");
            });
        }
    );
};

//display todos update form on GET
exports.todo_update_get = (req, res, next) => {
    async.parallel(
        {
            //find todos by id
            todo(callback) {
                Todo.findById(req.params.id).exec(callback);
            }
        },
        (err, results) => {
            if (err) {
                //there is an error
                return next(err);
            }
            if (results.todo == null)   {
                //no results -> 404
                const err = new Error("ToDo not found!");
                err.status = 404;
                return next(err);
            }

            //Success, render update form
            res.render("todo_form", {
                title: "Update ToDo",
                todo: results.todo,
            })
        }
    )
}

//handle todos update on POST
exports.todo_update_post = [
    // Validate and sanitize fields
    body("title")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("title name must be specified."),
    body("description")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("description name must be specified."),
    body("secretTodoKey")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("Secret to do key must be specified."),
    body("isDue", "Invalid isDue date")
        .optional({checkFalsy: true})
        .isISO8601()
        .toDate(),
    body("priority")
        .isNumeric()
        .escape(),
    body("subject")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("description name must be specified."),
    body("isDone")
        .toBoolean()
        .escape(),

    // Now, process request after validation and sanitization.
    async (req, res, next) => {
        // Extract validation errors from a request
        const errors = validationResult(req);

        const todoInDB = await Todo.findById(req.params.id);

        if (todoInDB.secretTodoKey !== req.body.secretTodoKey) {
            res.status(403).send({message: "The secret key is wrong!"});
        }

        // Create a todos object with escaped and trimmed data
        const todo = new Todo({
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            priority: req.body.priority,
            subject: req.body.subject,
            isDone: req.body.isDone,
            secretTodoKey: req.body.secretTodoKey,
            _id: req.params.id, //this field is REQUIRED! If it is deleted, an error will be thrown
            //because it will be tried to change the immutable field _id
        });
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages
            res.render("todo_form", {
                title: "Update a ToDo",
                author: req.body,
                errors: errors.array(),
            });
            return;
        }

        // data from form is valid, update the object in db
        Todo.findByIdAndUpdate(req.params.id, todo, {}, (err, todo) => {
            if (err) {
                //there is an error while trying to find and update the object
                return next(err);
            }

            // Successful! Redirect to new updated todos page
            res.redirect(todo.url);
        });
    },
];

