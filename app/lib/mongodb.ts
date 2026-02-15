// import { MongoClient, MongoClientOptions } from "mongodb";

// declare global {

//   var _mongoClientPromise: Promise<MongoClient> | undefined;
// }

// const uri: string = process.env.MONGODB_URI || "";

// if (!uri) {
//   throw new Error("Please add MONGODB_URI to .env.local");
// }

// let client: MongoClient;
// let clientPromise: Promise<MongoClient>;

// const options: MongoClientOptions = {
  
// };

// if (process.env.NODE_ENV === "development") {
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri, options);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
//   client = new MongoClient(uri, options);
//   clientPromise = client.connect();
// }

// export default clientPromise;
