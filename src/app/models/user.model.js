import Bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";

const UserSchema = Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      validate(value) {
        const email_regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        const is_email_valid = value.match(email_regex);

        if (!is_email_valid) {
          throw new Error(`Invalid email address`);
        }
      },
    },
    phone_number: {
      type: String,
      required: true,
      validate(value) {
        const phone_number_regex =
          /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/i;
        const is_phone_number_valid = value.match(phone_number_regex);

        if (!is_phone_number_valid) {
          throw new Error(`Invalid phone number`);
        }
      },
    },

    user_name: { type: String, required: true, unique: [true, "User name already exists"] },
    password: {
      type: String,
      required: true,
      validate(value) {
        const passwordValue = value.trim();
        const regExpStrong = /.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/;
        const min_strong_password = 8;
        const password_strong = value.match(regExpStrong);

        if (passwordValue < min_strong_password) {
          throw new Error(`Password should have more than ${min_strong_password} characters`);
        }
        if (!password_strong) {
          throw new Error(`Password is not strong. Add numbers and special characters`);
        }
      },
    },

    role: {
      type: String,
      enum: ["admin", "worker", "manager"],
      default: "worker",
    },
    permissions: [
      {
        type: String,
        enum: ["allow_message", "allow_download", "allow_upload", "allow_delete", "allow_share"],
        default: "allow_message",
        required: false,
      },
    ],
    auth_token: { type: String, required: false },
    meta_data: {
      createdBy: { type: Schema.Types.ObjectId, required: false },
      updatedBy: { type: Schema.Types.ObjectId, required: false },
      deletedBy: { type: Schema.Types.ObjectId, required: false },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  const password = user.password;
  if (!user.isModified("password")) {
    return next();
  }

  const salt = await Bcrypt.genSalt(8);
  const hash = Bcrypt.hashSync(password, salt);
  user.password = hash;

  let permissions = [];

  if (user.role === "worker") permissions.push("allow_message");
  if (user.role === "manager") permissions.push("allow_message", "allow_upload", "allow_download");
  if (user.role === "admin")
    permissions.push(
      "allow_message",
      "allow_download",
      "allow_upload",
      "allow_delete",
      "allow_share"
    );

  user.permissions = permissions;
  return next();
});

UserSchema.methods.generateAuthToken = async function () {
  const user = this;

  const authToken = Jwt.sign(
    { _id: user._id, role: user.role, permissions: user.permissions, createdAt: new Date() },
    process.env.JWT_SCRETE,
    { expiresIn: "30m" }
  );
  user.auth_token = authToken;
  await user.save();
  return authToken;
};

UserSchema.methods.saveMetaData = async function (user, method) {
  const userDoc = this;

  switch (method) {
    case "create":
      userDoc.meta_data.createdBy = user._id;
      userDoc.meta_data.updatedBy = user._id;
      await userDoc.save();
      break;
    case "update":
      userDoc.meta_data.updatedBy = user._id;
      await userDoc.save();
      break;
    case "delete":
      userDoc.meta_data.deletedBy = user._id;
      await userDoc.save();
      break;
    default:
      break;
  }

  return userDoc.meta_data;
};

UserSchema.statics.findByUsernamePassword = async (userName, password) => {
  const user = await User.findOne({ user_name: userName }).select(
    "role permissions auth_token password"
  );
  if (!user)
    throw new Error(
      JSON.stringify({ code: 404, message: "User record not found", dev_message: "user_not_found" })
    );

  const isPasswordMatch = await Bcrypt.compare(password, user.password);

  if (!isPasswordMatch)
    throw new Error(
      JSON.stringify({
        code: 400,
        message: "Credentials are invalid",
        dev_message: "invalid_credentials",
      })
    );

  const authToken = await user.generateAuthToken();
  return authToken;
};

const User = mongoose.model("users", UserSchema);

export default User;
