import mongoose, { Schema } from "mongoose";

const FileSchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true },
    file_name: { type: String, required: true },
    file_path: { type: String, required: true },
    original_name: { type: String, required: true },
    file_size: { type: Number, required: true },
    file_des: { type: String, required: true },
    status: {
      type: String,
      enum: ["private", "public", "shared"],
      default: "private",
      required: false,
    },
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

FileSchema.methods.saveMetaData = async function (user, method) {
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

const File = mongoose.model("files", FileSchema);

export default File;
