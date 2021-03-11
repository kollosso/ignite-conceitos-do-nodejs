const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers

  const user = users.find((user) => user.username === username)

  if(!user) {
    return response.status(400).json({ error: "User not found" })
  }

  request.username = user;

  return next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body

  const usersAlreadyExists = users.some((user) => user.username === username)

  if(usersAlreadyExists) {
    return response.status(400).json({error: "Usuário ja existe"})
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }
  
  users.push(user)
  
  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request

  return response.status(200).json(username.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request
  const { title, deadline } = request.body

  const newTodo = {
    id: uuidv4(),
    title,
    done : false,
    deadline: new Date(deadline),
    created_at : new Date(),
  }

  username.todos.push(newTodo)

  return response.status(201).json(newTodo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request
  const { id } = request.params
  const { title, deadline } = request.body

  const findTodo = username.todos.find(todo => todo.id === id)

  if(!findTodo) {
    return response.status(404).json({ error: "Todo not found"})
  }

  findTodo.title = title
  findTodo.deadline = deadline

  return response.status(201).json(findTodo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request
  const { id } = request.params

  const findTodo = username.todos.find(todo => todo.id === id)

  if(!findTodo) {
    return response.status(404).json({ error: "TO-DO not found"})
  }

  findTodo.done = true

  return response.status(200).json(findTodo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request
  const { id } = request.params

  const findTodo = username.todos.find(todo => todo.id === id)

  if(!findTodo) {
    return response.status(404).json({ error: "TO-DO not found"})
  }
  
  username.todos.splice(username.todos.indexOf(findTodo), 1)

  return response.status(204).send()
});

module.exports = app;