
import type { Request, Response } from "express";
export default function UserSignup(req: Request, res: Response) {
  const { email, password } = req.body;


  res.status(201).json({
    message: "User signed up successfully",
    user: {
      email,
      // You might not want to return the password in a real application
      password: "******", // Masking the password for security
    },
  });
}
export function UserLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    console.log(email + " " + password);

    // Here you would typically handle the login logic, like checking the user credentials
    // For demonstration purposes, we'll just return a success message
    res.status(200).json({
        message: "User logged in successfully",
        user: {
            email,
            // You might not want to return the password in a real application
            password: "******", // Masking the password for security
        },
    });
}