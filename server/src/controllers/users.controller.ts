// CONTROLLER
import { Request, Response } from "express";
import User, { UserModel } from "../models/users.model";
import { handleError } from "../utils/errorHandler";
import { StatusCodes } from "http-status-codes";

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
export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    // create a new user with the schema constructor
    const newUser: UserModel = await User.create(req.body);
    if (!newUser) {
      res.status(StatusCodes.BAD_REQUEST).json({ msg: "User creation failed" });
      return;
    }
    res.status(StatusCodes.CREATED).json({ newUser });
  } catch (error: unknown) {
    handleError(res, error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    // get all the users async, usermodel array or null
    const allUsers: UserModel[] | null = await User.find({});
    if (allUsers === null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No Users have been created yet..." });
      return;
    }
    // TODO: it is possible that you need to mess with this json return naming wise
    res.status(StatusCodes.OK).json({ users: allUsers });
  } catch (error: unknown) {
    handleError(res, error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    // find a user by id, if they don't exist, catch the null
    const foundUser: UserModel | null = await User.findById(req.params.id);
    if (foundUser === null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No user found with given id" });
      return;
    }
    res.status(StatusCodes.OK).json({ user: foundUser });
  } catch (error: unknown) {
    handleError(res, error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const foundUser: UserModel | null = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (foundUser === null) {
      res.status(StatusCodes.NOT_FOUND).json({ msg: "No item found" });
      return;
    }
    // TODO: success true
    res.status(StatusCodes.CREATED).json({ user: foundUser });
  } catch (error: unknown) {
    handleError(res, error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const foundUser: UserModel | null = await User.findByIdAndDelete(
      req.params.id
    );
    if (foundUser === null) {
      res.status(StatusCodes.NOT_FOUND).json({ msg: "No user found" });
      return;
    }
    res.status(StatusCodes.OK).json({ task: null, status: "Success" });
  } catch (error: unknown) {
    handleError(res, error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
