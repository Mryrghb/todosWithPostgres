// Import necessary types from Express
import { Request, Response } from "express";
import { QueryResult } from "pg";
// Import the PostgreSQL connection pool from database.ts
import { pool } from "../database";

// Controller for a new task
export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // Extract user details from the request body
  //(fullName, email,password)
  const { fullName, email, password, userlevel } = req.body;
  // Execute a SQL INSERT statement
  await pool.query(
    `INSERT INTO public."user" (fullName, email, password , userlevel) VALUES ($1, $2, $3, $4)`,
    [fullName, email, password, userlevel]
  );
  // Send a JSON response to the client
  return res.status(201).json({
    // user Created successfully
    message: "user created successfully",
    user: {
      fullName,
      email,
      password,
      userlevel,
    },
  });
};

// Get all users
export const getUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Execute a PostgreSQL query to select all users
    const response: QueryResult = await pool.query(
      `SELECT * FROM public."user"`
    );

    // Return a JSON response with the retrieved users
    return res.status(200).json(response.rows);
  } catch (error) {
    // Handle errors, log them, and return an internal server error response
    console.error(error);
    return res.status(500).json("Internal Server error");
  }
};

// Get a user by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // Extract the user ID from the request parameters
  const id = parseInt(req.params.id);

  try {
    // Execute a PostgreSQL query to select a user by ID
    const response: QueryResult = await pool.query(
      `SELECT * FROM public."user" WHERE id = $1`,
      [id]
    );

    // Return a JSON response with the retrieved user
    return res.json(response.rows);
  } catch (error) {
    // Handle errors, log them, and return an internal server error response
    console.error(error);
    return res.status(500).json("Internal Server error");
  }
};

//Update a task by ID

export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // Extract user ID from request parameters
  const id = parseInt(req.params.id);

  // Extract updated user details from request body
  const { fullName, email, password } = req.body;

  try {
    // Execute a PostgreSQL query to update the task by ID
    await pool.query(
      `UPDATE public."user" SET fullName = $1, password = $2, email = $3 WHERE id = $4`,
      [fullName, password, email, id]
    );

    // Return a JSON response with the updated task details
    return res.json({
      message: "user updated successfully",
      user: {
        fullName,
        email,
        password,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server error");
  }
};

// Delete a user by ID
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // Extract user ID from request parameters
  const id = parseInt(req.params.id);

  try {
    // Execute a PostgreSQL query to delete the user by ID
    await pool.query(`DELETE FROM public."user" WHERE id = $1`, [id]);

    // Return a JSON response indicating successful deletion
    return res.status(200).json(`user ${id} deleted successfully`);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server error");
  }
};
