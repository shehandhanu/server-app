import mongoose from "mongoose";

let connection;

export const dbConnect = async () => {
  if (connection) return;

  mongoose
    .connect(process.env.MONGODB_TEST_URI)
    .then((connection) => {
      connection = connection.connection;
    })
    .catch((error) => {
      logger.error(`Database connection error: ${error.message}`);
    });
};

export const dbClose = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

export const dbClear = async () => {
  const collections = mongoose.connection.collections;
  for (const collection in collections) {
    await collections[collection].deleteMany({});
  }
};
