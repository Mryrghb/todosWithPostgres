// Import necessary modules and types

import express, { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
} from "./controllers/index.controllers";
import { signIn, signUp } from "./controllers/auths";
// Create an Express application
const app = express();

// Create a Router instance for handling user-related routes
const userRouter = Router();

// Configure middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define routes for task operations using the userRouter
userRouter.get("/user", getUsers);
userRouter.get("/user/:id", getUserById);
userRouter.post("/user", createUser);
userRouter.put("/user/:id", updateUser);
userRouter.delete("/user/:id", deleteUser);
userRouter.post("/signIn", signIn);
userRouter.post("/signUp", signUp);

// Use the userRouter for paths starting with '/api'
app.use(userRouter);

// Set up the Express application to listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
