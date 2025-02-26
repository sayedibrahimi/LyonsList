import { Request, Response } from "express";
import User from "../models/users.model";
import { StatusCodes } from "http-status-codes";

// register function
// input param: req body: first, last, email, password
export async function register(req: Request, res: Response): Promise<void> {
  try {
    // check if req body is full
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Please provide name, email, and password" });
      return;
    }

    // if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(StatusCodes.BAD_REQUEST).json({ msg: "Email already in use" });
      return;
    }

    // else, create user
    const user = await User.create({ ...req.body });
    const token = user.createJWT();

    const returnObject = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    res.status(StatusCodes.CREATED).json({
      status: "success",
      user: returnObject,
      token,
    });
    return;
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  // check if req body is full
  if (!email || !password) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide email and password" });
    return;
  }

  // check for the user from dB by email
  const user = await User.findOne({ email });
  // user is not providing valid credentials but user exists
  if (!user) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid credentials" });
    return;
  }

  // check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid credentials" });
    return;
  }

  // If user exists with valid credentials
  const token = user.createJWT();
  const returnObject = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
  res.status(StatusCodes.OK).json({
    status: "success",
    user: returnObject,
    token,
  });
}
