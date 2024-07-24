// Import necessary types from Express
import { Request, response, Response } from "express";
import bcrypt from "bcrypt";
import { QueryResult } from "pg";
import jwt from "jsonwebtoken";

// Import the PostgreSQL connection pool from database.ts
import { pool } from "../database";

// Controller for a new task
export const signUp = async (req: Request, res: Response) => {
  // Extract user details from the request body
  //(fullName, email,password)
  const { fullname, password, userlevel } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  // Execute a SQL INSERT statement
  await pool.query(
    `INSERT INTO public."users" (fullname, password , userlevel) VALUES ($1, $2, $3)`,
    [fullname, hashedPassword, userlevel]
  );
  // Send a JSON response to the client
  res.status(201).json({
    // user Created successfully
    message: "registred",
    user: {
      fullname,
      password,
      userlevel,
    },
  });
};

export const signIn = async (req: Request, res: Response) => {
  console.log("1");
  const { userlevel, password } = req.body;
  try {
    console.log("2");
    const resu = await pool.query(
      `SELECT * FROM public."userss" WHERE userlevel = $1`,
      [userlevel]
    );
    const user = resu.rows[0];
    console.log(user);
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });
      res.json({ token });
    } else {
      res.status(401).json({ error: "not token" });
    }
  } catch (error) {
    res.status(500).json({ message: "sign in error" });
  }
};
