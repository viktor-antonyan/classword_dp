const express = require('express');
const route = express.Router();
const { User } = require('./controller');
const validation = require('./validation');

route.get('/', User.index);
route.get('/:id', User.show);
route.post('/register', validation.create, User.create);
route.post('/login', User.login);
route.put('/:id', validation.update, User.update);
route.delete('/:id', User.destroy);

module.exports = { route }