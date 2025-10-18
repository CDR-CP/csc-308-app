// packages/express-backend/backend.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userServices from "./models/user-services.js"; // service layer

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// simple request timing log (kept from your original)
app.use((req, res, next) => {
  const t = Date.now();
  res.on("finish", () =>
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now()-t}ms)`));
  next();
});

// db connect (env var or local default)
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/csc308";
mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// routes
app.get("/", (_req, res) => {
  res.send("Hello World!");
});

// GET /users (all | ?name= | ?job= | ?name=&job=)
app.get("/users", (req, res, next) => {
  const { name, job } = req.query;

  if (name && job) {
    return userServices.findUsersByNameAndJob(name, job)
      .then(users => res.json({ users_list: users }))
      .catch(next);
  }
  if (name) {
    return userServices.findUsersByName(name)
      .then(users => res.json({ users_list: users }))
      .catch(next);
  }
  if (job) {
    return userServices.findUsersByJob(job)
      .then(users => res.json({ users_list: users }))
      .catch(next);
  }
  return userServices.getAllUsers()
    .then(users => res.json({ users_list: users }))
    .catch(next);
});

// GET /users/:id
app.get("/users/:id", (req, res, next) => {
  userServices.getUserById(req.params.id)
    .then(user => {
      if (!user) return res.status(404).send("Resource not found.");
      res.json(user);
    })
    .catch(next);
});

// POST /users  (expects {name, job})
app.post("/users", (req, res, next) => {
  const { name, job } = req.body ?? {};
  if (!name || !job) return res.status(400).json({ error: "name and job are required" });

  userServices.createUser({ name, job })
    .then(created => res.status(201).location(`/users/${created._id}`).json(created))
    .catch(next);
});

// DELETE /users/:id
app.delete("/users/:id", (req, res, next) => {
  userServices.deleteUserById(req.params.id)
    .then(deleted => {
      if (!deleted) return res.status(404).send("Resource not found.");
      res.sendStatus(204);
    })
    .catch(next);
});

// basic error handler
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Backend on http://localhost:${port}`);
});
