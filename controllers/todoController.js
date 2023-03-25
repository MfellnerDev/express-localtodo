/**
 * The controller of the entire TODO_ ROUTE (currently routes everything of the projects).
 * Contains all practical things like listing all todos, listing detail view of todo_, creating todo_, updating todo_,
 * deleting todo_
 *
 * @author MfellnerDev
 * @version 18.03.2023
 */

const Todo = require('../models/todo');
const async = require("async");
const {body, validationResult} = require("express-validator");


/**
 * The index page - Shows a count of entries, open entries and closed entries
 * @param req request
 * @param res response
 */
exports.index = (req, res) => {
    async.parallel(
        {
            //methods for counting to do objects in db
            todo_entries_count(callback) {
                Todo.countDocuments({}, callback);
            },
            todo_open_entries_count(callback) {
                Todo.countDocuments({isDone: false}, callback);
            },
            todo_closed_entries_count(callback) {
                Todo.countDocuments({isDone: true}, callback);
            },
        },
        (err, results) => {

            if (err)    {
                //inform about error but do not redirect to error handler, error will be rendered on website
                console.error(`Error! There was a problem while trying to count all todo entries!`);
            }

            //render the result, callback = answer
            res.render("index", {
                title: "Your Todo overview",
                error: err,
                data: results,
            });
        });
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
        //sort entries: latest date first
        .sort({ dueDate: -1 })
        .exec(function (err, todo_list) {
            if (err) {
                console.error(`Error! There was a problem while trying to fetch all todo entries.`);
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
                console.error(`Error when fetching todo detail of id=${req.params.id}: ${err}`);
                return next(err);
            }
            if (results.todo == null) {
                //no results -> not found

                console.error(`Error! Cannot find object with id=${req.params.id}`);
                return next(err);
            }
            //todo_ found
            res.render("todo_detail", {
                page_title: results.todo.title,
                todo_object: results.todo,
            })
        });
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
                title: "Create a new Todo",
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
                console.error(`TODO CREATE POST: Error while trying to save new object!`);
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
 * @param next next (for middleware)
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
                console.error(`Error! There was a problem while trying to find todo entry with id=${req.params.id}`);
                return next(err);
            }
            if (results.todo == null) {
                console.warn(`Warning! Could not find todo entry with id=${req.params.id}`);
                //no results -> redirect to entries
                res.redirect('/todo/entries');
            }

            //successful, render form
            res.render("todo_form_delete", {
                title: "Delete Todo",
                todo: results.todo
            });
        });
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
        (err) => {
            if (err) {
                console.error(`Error! There was a problem with sending the data via POST!`);
                return next(err);
            }

            //find and delete object with id
            Todo.findByIdAndDelete(req.body.id, (err) => {
                if (err) {
                    console.error(`Error! There was a problem while trying to find and delete todo entry with id=${req.body.id}`);
                    return next(err);
                }
                //success - go to all entries
                res.redirect("/todo/entries");
            });
        });
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
                console.error(`Error! There was a problem while trying to find todo entry with id=${req.params.id}`);
                return next(err);
            }
            if (results.todo == null) {
                //no results -> 404
                console.warn(`Error! Todo entry with id=${req.params.id} does not exist.`)
                const err = new Error().status = 404;
                return next(err);
            }

            //Success, render update form
            res.render("todo_form", {
                title: "Update Todo",
                todo: results.todo,
            });
        });
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
            console.warn(`Warning! Form data could not be sent! Re-rendering the form...`);
            res.render("todo_form", {
                title: "Update a Todo",
                author: req.body,
                errors: errors.array(),
            });
            return;
        }

        // data from form is valid, update the object in db
        Todo.findByIdAndUpdate(req.params.id, todo, {}, (err, todo) => {
            if (err) {
                if (err.status === 404) {
                    console.error(`Error! Cannot find object with id=${req.params.id}`);
                } else {
                    console.error(`Error! There was a problem while trying to find and update todo entry with id=${req.params.id}`);
                }
                return next(err);
            }

            // Successful! Redirect to new updated todo_ page
            res.redirect(todo.url);
        });
    },
];
