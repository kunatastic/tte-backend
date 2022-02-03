import { Request, Response } from 'express';
import { User, validateUser } from '../models/User.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser } from '../types/types';

/**
 * @api {post} /auth/signIn SignIn
 * @apiGroup Auth
 *
 */
export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check the email exists
    const user = await User.findOne({ email });
    if (!user) return res.status(403).json({ status: 403, msg: 'User Not Found' });

    // Compare the passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(403).json({ status: 403, msg: 'Incorrect Password' });

    // Create and assign a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res
      .cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === 'production',
      })
      .json({ status: 200, msg: 'User Logged In Successfully' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @api {post} /auth/signUp SignUp
 * @apiGroup Auth
 *
 */
export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, employeeId } = req.body;
    console.log(req.body);

    // Check for existing user with same email
    const email_user = await User.findOne({ email });
    if (email_user) return res.status(403).json({ status: 403, msg: 'User Already Exists found' });

    // Check for existing user with same employeeId
    const employeeId_user = await User.findOne({ employeeId });
    if (employeeId_user)
      return res.status(403).json({ status: 403, msg: 'Employee Id Already Exists found' });

    // Validate user data
    const newUserTemplate: IUser = { email, password, employeeId, role: 'user' };
    const result = validateUser(newUserTemplate);
    if (result.error)
      return res.status(400).json({ status: 400, msg: result.error.details[0].message });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    newUserTemplate.password = hashedPassword;
    const newUser = new User(newUserTemplate);

    // Save user
    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
    res
      .cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === 'production',
      })
      .json({ status: 200, msg: 'User Created Successfully' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @api {get} /auth/logout Logout
 * @apiGroup Auth
 */
export const logout = (req: Request, res: Response) => {
  res.clearCookie('token').json({ status: 200, msg: 'User Logged Out Successfully' });
};

/**
 * @api {get} /auth/isSignedIn IsSignedIn
 * @apiGroup Auth
 */
export const isSignedIn = (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(403).json({ status: 403, msg: 'User Not Signed In', value: false });
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ status: 200, msg: 'User Signed In', value: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err.message);
    res.status(403).json({ status: 403, msg: 'No token found', value: false });
  }
};
