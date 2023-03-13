/**
 * The controller of the entire TODO_ ROUTE (currently routes everything of the projects).
 * Contains all practical things like listing all todos, listing detail view of todo_, creating todo_, updating todo_,
 * deleting todo_
 *
 * @author MfellnerDev
 * @version 13.03.2023
 */

const Todo = require('../models/toDo');
const async = require("async");
const {body, validationResult} = require("express-validator");
const debug = require("debug")("todo");


/**
 * The index page - Shows a count of entries, open entries and closed entries
 * @param req request
 * @param res response
 */
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


/**
 * Display ALL todo_entries
 * @param req request
 * @param res response
 * @param next next (middleware)
 */
exports.todo_list = (req, res, next) => {
    //find {} = get everything, show todos with the latest date first and exec query
    Todo.find({})
        .sort({dueDate: -1})
        .exec(function (err, todo_list) {
            if (err) {
                debug(`Error when fetching all todo entries: ${err}`);
                return next(err);
            }
            //render the result
            res.render("todo_list", {page_title: "All Todos", todo_list: todo_list});
        });
};

/**
 * Display detail page for a specific Todo_entry
 * @param req request
 * @param res response
 * @param next next (middleware)
 */
exports.todo_detail = (req, res, next) => {
    async.parallel(
        {
            //find detailed todo_ entry
            todo(callback) {
                //find by id, execute query
                Todo.findById(req.params.id).exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                debug(`Error when fetching todo detail of id=${req.params.id}: ${err}`);
                return next(err);
            }
            if (results.todo == null) {
                //no results -> not found
                const err = new Error("ToDo entry not found!");
                err.status = 404;
                    return next(err);
            }
            //todo_ found
            res.render("todo_detail", {
                page_title: results.todo.title,
                todo_object: results.todo,
            })
        }
    )
};

/**
 * Display form to create todo_object on GET
 * @param req request
 * @param res response
 */
exports.todo_create_get = (req, res) => {
    res.render("todo_form", {title: "Create a new todo"});
};

/**
 * Handle todo_create operation on POST
 * Just everything packed up and exported
 */
exports.todo_create_post = [
    // Validate and sanitize fields, .escape() removes potentially dangerous characters
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

        // Create a todo_ object with escaped and trimmed data
        const todo = new Todo({
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            priority: req.body.priority,
            subject: req.body.subject,
            isDone: req.body.isDone,
        });
        //save the new object into the db
        todo.save((err) => {
            if (err) {
                debug(`Error when fetching todo detail of id=${req.params.id}: ${err}`);

                return next(err);
            }
            // Successful - redirect to new todo_
            res.redirect(todo.url);
        });
    },
];

/**
 * Displays todo_delete form on GET
 * @param req request
 * @param res response
 * @param next next (middleware)
 */
exports.todo_delete_get = (req, res, next) => {
    async.parallel(
        {
            //find todo_ by id
            todo(callback) {
                Todo.findById(req.params.id).exec(callback);
            }
        },
        (err, results) => {
            if (err) {
                debug(`Error when trying to GET delete, object with id=${req.params.id} doesn't exist: ${err}`);
                res.redirect('http://localhost:3000/html/404.html');
                return;
            }
            if (results.todo == null) {
                //no results -> redirect to entries
                res.redirect('/todo/entries');
            }

            //successful, render form
            res.render("todo_form_delete", {
                title: "Delete ToDo",
                todo: results.todo
            })
        }
    )
};

/**
 * Handle todo_delete operation on POST
 * @param req request
 * @param res response
 * @param next next (middleware)
 */
exports.todo_delete_post = (req, res, next) => {
    async.parallel(
        {
            //find todo_ by id
            todo(callback) {
                Todo.findById(req.params.id).exec(callback);
            },
        },
         (err, results) => {
            if (err) {
                debug(`Error when trying to delete todo with id=${req.params.id}: ${err}`);
                return next(err);
            }

            //find and delete object with id
            Todo.findByIdAndDelete(req.body.id, (err) => {
                if (err) {
                    debug(`Delete error, cannot find object with id=${req.params.id}: ${err}`);
                    res.redirect('http://localhost:3000/html/404.html');
                    return;
                }
                //success - go to all entries
                res.redirect("/todo/entries");
            });
        }
    );
};

/**
 * Display todo_update form on GET
 * @param req request
 * @param res response
 * @param next next (middleware)
 */
exports.todo_update_get = (req, res, next) => {
    async.parallel(
        {
            //find todo_ by id
            todo(callback) {
                Todo.findById(req.params.id).exec(callback);
            }
        },
        (err, results) => {
            if (err) {
                debug(`Update GET error, object wit hid=${req.params.id} doesn't exist: ${err}`);
                res.redirect('http://localhost:3000/html/404.html');
                return;
            }
            if (results.todo == null) {
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

/**
 * Handle todo_update operation on POST
 * Just everything packed together and exported
 */
exports.todo_update_post = [
    // Validate and sanitize fields, .escape() removes potentially dangerous characters
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

     (req, res, next) => {
        // Extract validation errors from a request
        const errors = validationResult(req);


        // Create a todo_ object with escaped and trimmed data
        const todo = new Todo({
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            priority: req.body.priority,
            subject: req.body.subject,
            isDone: req.body.isDone,
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
                debug(`Update POST error, cannot find object with id=${req.params.id}: ${err}`);
                res.redirect('http://localhost:3000/html/404.html');
                return;
            }

            // Successful! Redirect to new updated todo_ page
            res.redirect(todo.url);
        });
    },
];

