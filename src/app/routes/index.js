import { storage } from "../../utils";
import { getFile, getFileInfo, getFileInfoForUser, saveFile } from "../controllers/file.controller";
import { getMessages, saveMessage } from "../controllers/message.controller";
import { createUser, getAccount, getAllUsers, login } from "../controllers/user.controller";
import { authenticate, validateRequest } from "../middlewares";
import { createUserSchema, loginUser, messageSchema } from "../validation";

export const routes = (app) => {
  app.post("/user", [validateRequest(createUserSchema), authenticate], createUser);
  app.get("/user", [authenticate], getAccount);
  app.get("/users", [authenticate], getAllUsers);
  app.post("/login", [validateRequest(loginUser)], login);

  app.post("/upload", [authenticate, storage.single("file")], saveFile);
  app.get("/file/info/:id", [authenticate], getFileInfo);
  app.get("/files", [authenticate], getFileInfoForUser);
  app.get("/download/:id", [authenticate], getFile);

  app.post("/message", [validateRequest(messageSchema), authenticate], saveMessage);
  app.get("/messages", [authenticate], getMessages);
};
