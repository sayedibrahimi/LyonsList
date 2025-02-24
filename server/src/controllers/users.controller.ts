// CONTROLLER
import { Request, Response } from "express";
import User, { UserModel } from "../models/users.model";
import { handleError } from "../middlewares/handleError";

// TODO: Response body
/*
success,
auth token,
user data {
  id  
  first
  last
}
*/
export async function createUser(req: Request, res: Response) {
  try {
    // create a new user with the schema constructor
    const newUser: UserModel = await User.create(req.body);
    res.status(201).json({ newUser });
  } catch (error: unknown) {
    handleError(res, error);
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
  } catch (error: unknown) {
    handleError(res, error);
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    // find a user by id, if they dont exist, catch the null
    const foundUser: UserModel | null = await User.findById(req.params.id);
    if (foundUser === null) {
      res.status(404).json({ msg: "No user found with given id" });
      return;
    }
    res.status(200).json({ user: foundUser });
  } catch (error: unknown) {
    handleError(res, error);
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const foundUser: UserModel | null = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (foundUser === null) {
      res.status(404).json({ msg: "No item found" });
      return;
    }
    // TODO: success true
    res.status(201).json({ user: foundUser });
  } catch (error: unknown) {
    handleError(res, error);
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const foundUser: UserModel | null = await User.findByIdAndDelete(
      req.params.id
    );
    if (foundUser === null) {
      res.status(404).json({ msg: "No user found" });
      return;
    }
    res.status(200).json({ task: null, status: "Success" });
  } catch (error: unknown) {
    handleError(res, error);
  }
}
