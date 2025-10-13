// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());           // allow frontend to call this API
app.use(express.json());

app.use((req, res, next) => {
  const t = Date.now();
  res.on("finish", () =>
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now()-t}ms)`));
  next();
});

// ---------------------- data 
let users = {
  users_list: [
    { id: "xyz789", name: "Charlie", job: "Janitor" },
    { id: "abc123", name: "Mac",     job: "Bouncer" },
    { id: "ppp222", name: "Mac",     job: "Professor" },
    { id: "yat999", name: "Dee",     job: "Aspiring actress" },
    { id: "zap555", name: "Dennis",  job: "Bartender" }
  ]
};

// ---------------------- Helpers 
const findUserByName = (name) =>
  users.users_list.filter((u) => u.name === name);

const findUsersByNameAndJob = (name, job) =>
  users.users_list.filter((u) => u.name === name && u.job === job);

const findUserById = (id) =>
  users.users_list.find((u) => u.id === id);

const makeId = () => Math.random().toString(36).slice(2, 8);

const addUser = ({ name, job }) => {
  const created = { id: makeId(), name, job }; // server assigns id
  users.users_list.push(created);
  return created;
};

const deleteUserById = (id) => {
  const idx = users.users_list.findIndex((u) => u.id === id);
  if (idx === -1) return false;
  users.users_list.splice(idx, 1);
  return true;
};

// ---------------------- Routes 
app.get("/", (_req, res) => {
  res.send("Hello World!");
});

// GET /users  (all | ?name= | ?name=&job=)
app.get("/users", (req, res) => {
  const { name, job } = req.query;
  if (name !== undefined && job !== undefined) {
    const result = findUsersByNameAndJob(name, job);
    return res.json({ users_list: result });
  }
  if (name !== undefined) {
    const result = findUserByName(name);
    return res.json({ users_list: result });
  }
  return res.json(users);
});

// GET /users/:id
app.get("/users/:id", (req, res) => {
  const result = findUserById(req.params.id);
  if (!result) return res.status(404).send("Resource not found.");
  return res.json(result);
});

// POST /users  (expects {name, job}; generates id; returns 201 + created)
app.post("/users", (req, res) => {
  const { name, job } = req.body ?? {};
  if (!name || !job) return res.status(400).json({ error: "name and job are required" });

  const created = addUser({ name, job });
  return res
    .status(201)
    .location(`/users/${created.id}`)
    .json(created);
});

// DELETE /users/:id  (204 if removed, 404 if not found)
app.delete("/users/:id", (req, res) => {
  const removed = deleteUserById(req.params.id);
  if (!removed) return res.status(404).send("Resource not found.");
  return res.sendStatus(204);
});

// ---------------------- Start server 
app.listen(port, () => {
  console.log(`Backend on http://localhost:${port}`);
});
