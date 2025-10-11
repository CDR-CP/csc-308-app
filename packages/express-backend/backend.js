// backend.js
import express from "express";

const app = express();
const port = 8000;

app.use(express.json());

// ---------------------- data 
const users = {
  users_list: [
    { id: "xyz789", name: "Charlie", job: "Janitor" },
    { id: "abc123", name: "Mac",     job: "Bouncer" },
    { id: "ppp222", name: "Mac",     job: "Professor" },
    { id: "yat999", name: "Dee",     job: "Aspring actress" },
    { id: "zap555", name: "Dennis",  job: "Bartender" }
  ]
};

// ---------------------- Helpers 
const findUserByName = (name) =>
  users["users_list"].filter((user) => user["name"] === name);

const findUsersByNameAndJob = (name, job) =>
  users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

const deleteUserById = (id) => {
  const idx = users["users_list"].findIndex((u) => u["id"] === id);
  if (idx === -1) return false;
  users["users_list"].splice(idx, 1);
  return true;
};

// ---------------------- Routes 
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// get /users
// no query: returns all users
// ?name=...: returns users with that name
// ?name=...&job=...: returns users with that name and job
app.get("/users", (req, res) => {
  const { name, job } = req.query;

  if (name !== undefined && job !== undefined) {
    let result = findUsersByNameAndJob(name, job);
    res.send({ users_list: result });
  } else if (name !== undefined) {
    let result = findUserByName(name);
    res.send({ users_list: result });
  } else {
    res.send(users);
  }
});

// get /users/:id -- single user or 404
app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  const result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

// POST /users -- add user (expects JSON body)
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.send(); // 200 OK empty body
});

// DELETE /users/:id -- delete, 204 if removed, 404 if not found
app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const removed = deleteUserById(id);
  if (!removed) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(204).send(); //
  }
});

// ---------------------- Start server 
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
