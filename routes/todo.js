/**
 * Routing configuration for the TODO_ application (routes for everything in this project)
 *
 * @author MfellnerDev
 * @version 13.03.2023
 */

const express = require("express");
const router = express.Router();

// require controller module
const todo_controller = require("../controllers/toDoController");

/// TODO_ ROUTES ///

// GET home page
router.get('/', todo_controller.index);

// GET request for creating a todo_
router.get('/entries/create', todo_controller.todo_create_get);

// POST request for creating a todo_
router.post('/entries/create', todo_controller.todo_create_post);

// GET request for deleting todo_
router.get('/entries/:id/delete', todo_controller.todo_delete_get);

// POST request for deleting todo_
router.post('/entries/:id/delete', todo_controller.todo_delete_post);

// GET request to update todo_
router.get('/entries/:id/update', todo_controller.todo_update_get);


// POST request to update todo_
router.post('/entries/:id/update', todo_controller.todo_update_post);

// GET request for one todo_
router.get('/entries/:id', todo_controller.todo_detail);

//GET request for a list of all todos
router.get('/entries', todo_controller.todo_list);

module.exports = router;