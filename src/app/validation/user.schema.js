import { object, string } from "yup";

const phone_number_regex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/i;
const email_regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export const createUserSchema = object({
  first_name: string()
    .required("First name is required")
    .max(200, "name cannot exceed 200 characters"),
  last_name: string()
    .required("Last name is required")
    .max(200, "name cannot exceed 200 characters"),
  email: string()
    .required("Email is required")
    .matches(email_regex, "Invalid email address")
    .max(200, "Email cannot exceed 200 characters"),
  phone_number: string()
    .required("Phone number is requred")
    .max(10, "Phone number cannot exceed 10 numbers")
    .matches(phone_number_regex, "Invalid phone number"),
  user_name: string()
    .required("User name is required")
    .max(5, "User name cannot exeed 5 characters"),
  password: string()
    .required("Password is required")
    .max(50, "Password characters should less than 50 characters"),
  role: string().required("User role name is required"),
});

export const loginUser = object({
  user_name: string()
    .required("User name is required")
    .max(5, "User name cannot exeed 5 characters"),
  password: string()
    .required("Password is required")
    .max(50, "Password characters should less than 50 characters"),
});
