import fs from "fs";
import { File, User } from "../models";

export const saveFile = (req, res) => {
  File.create({
    user: req.user._id,
    file_name: req.file.filename,
    file_path: req.file.path,
    original_name: req.file.originalname,
    file_size: req.file.size,
    file_des: req.file.destination,
    status: req.body.status,
  }).then((file) => {
    file
      .saveMetaData(req.user, "create")
      .then(() => {
        return res.status(201).json({
          code: 201,
          message: "File created successfully",
          dev_message: "file_created",
        });
      })
      .catch((error) => {
        return res.status(500).json({
          code: 500,
          message: error.message,
          dev_message: "file_create_failed",
        });
      });
  });
};

export const getFile = (req, res) => {
  File.findById(req.params.id)
    .then((fileInfo) => {
      const file = fs.createReadStream(fileInfo.file_path);
      res.setHeader("Content-Disposition", 'attachment: filename="' + fileInfo.original_name + '"');
      file.pipe(res);
    })
    .catch((error) => {
      return res.status(404).json({
        code: 404,
        message: error.message,
        dev_message: "file_not_found",
      });
    });
};

export const getFileInfo = (req, res) => {
  File.findById(req.params.id)
    .select("-user -__v")
    .populate({
      path: "meta_data",
      populate: [
        {
          path: "createdBy",
          model: User,
          select: "-_id first_name last_name user_name",
        },
        {
          path: "updatedBy",
          model: User,
          select: "-_id first_name last_name user_name",
        },
      ],
    })
    .then((file) => {
      return res.status(200).json({
        code: 200,
        message: "File info fetch successfully",
        dev_message: "file_info_fetch",
        file: file,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        code: 500,
        message: error.message,
        dev_message: "file_info_fetch_error",
      });
    });
};

export const getFileInfoForUser = (req, res) => {
  File.find({ user: req.user._id })
    .select("-user -__v")
    .populate({
      path: "meta_data",
      populate: [
        {
          path: "createdBy",
          model: User,
          select: "-_id first_name last_name user_name",
        },
        {
          path: "updatedBy",
          model: User,
          select: "-_id first_name last_name user_name",
        },
      ],
    })
    .then((files) => {
      return res.status(200).json({
        code: 200,
        message: "Files info fetch successfully",
        dev_message: "files_info_fetch",
        files: files,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        code: 500,
        message: error.message,
        dev_message: "files_info_fetch_error",
      });
    });
};
