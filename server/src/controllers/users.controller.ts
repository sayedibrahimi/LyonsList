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

export async function getAllUsers(req: Request, res: Response) {
  try {
    // get all the users async, usermodel array or null
    const allUsers: UserModel[] | null = await User.find({});
    if (allUsers === null) {
      res.status(404).json({ msg: "No Users have been created yet..." });
      return;
    }
    // TODO: it is possible that you need to mess with this json return naming wise
    res.status(200).json({ users: allUsers });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
}
