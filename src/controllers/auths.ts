// Import necessary types from Express
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Import the PostgreSQL connection pool from database.ts
import { pool } from "../database";

// Controller for a new task
export const signUp = async (req: Request, res: Response) => {
  // Extract user details from the request body
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
  const { userlevel, password } = req.body;
  try {
    const result = await pool.query(
      `SELECT * FROM public."users" WHERE userlevel = $1`,
      [userlevel]
    );

    const user = result.rows[0];

    //this have ERROR in process.env.JWTSECRET
    /* if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });
      res.json({ token });*/

    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign({ userId: user.id }, "secret", {
        expiresIn: "1h",
      });
      res
        .status(200)
        .json({ welcomeBack: user.fullName, yourToken: accessToken });
    } else {
      res.status(401).json({ error: "token error" });
    }
  } catch (error) {
    res.status(500).json({ message: "sign in error" });
  }
};
