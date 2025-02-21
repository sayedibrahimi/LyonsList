// CONTROLLER
import { Request, Response } from "express";
import User, { UserModel } from "../models/users.model";

export async function createUser(req: Request, res: Response) {
  try {
    // create a new user with the schema constructor
    const newUser: UserModel = await User.create(req.body);
    res.status(201).json({ newUser });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
}
