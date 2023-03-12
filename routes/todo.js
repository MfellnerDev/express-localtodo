const express = require("express");
const router = express.Router();

// require controller module
const todo_controller = require("../controllers/toDoController");

/// TODOs ROUTES ///

// GET home page
router.get('/', todo_controller.index);

// GET request for creating a todos
router.get('/entries/create', todo_controller.todo_create_get);

// POST request for creating a todos
router.post('/entries/create', todo_controller.todo_create_post);

// GET request for deleting todos
router.get('/entries/:id/delete', todo_controller.todo_delete_get);

// POST request for deleting todos
router.post('/entries/:id/delete', todo_controller.todo_delete_post);

// GET request to update todos
router.get('/entries/:id/update', todo_controller.todo_update_get);


// POST request to update todos
router.post('/entries/:id/update', todo_controller.todo_update_post);

// GET request for one todos
router.get('/entries/:id', todo_controller.todo_detail);

//GET request for a list of all todos
router.get('/entries', todo_controller.todo_list);

module.exports = router;