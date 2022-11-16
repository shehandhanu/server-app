import { object, string } from "yup";

export const messageSchema = object({
  message: string().required("Message is required").max(2000),
});
