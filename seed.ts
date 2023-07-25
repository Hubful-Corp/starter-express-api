import mongoose from "mongoose";
import User, { IUser } from "./src/models/User";
import { connectDatabase } from "./src/configs/db";

const seedUser: IUser[] = [
  {
    email: "gregory.fisher@hubful.com",
    name: "Gregory",
    phone: "+1",
    role: "admin",
    origin: "123456",
    password: "$2b$10$miytJVOP59y2W3w86yKQ5uspjZHnAWjVL6xVYu6kT4sYae2M1XlRi",
    verify: true,
    address: "address",
    avatar: "https://cdn-icons-png.flaticon.com/512/21/21104.png",
    pricing: "bl3",
  },
  {
    email: "dustin.hayate@hubful.com",
    name: "Hayate",
    phone: "+1",
    role: "admin",
    origin: "123456",
    password: "$2b$10$miytJVOP59y2W3w86yKQ5uspjZHnAWjVL6xVYu6kT4sYae2M1XlRi",
    verify: true,
    address: "address",
    avatar: "https://cdn-icons-png.flaticon.com/512/21/21104.png",
    pricing: "bl3",
  },
];

async function seedDatabase() {
  try {
    connectDatabase();
    await User.deleteMany({});
    await User.insertMany(seedUser);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    // Close the database connection
    mongoose.disconnect();
  }
}

// Run the seeder function
seedDatabase();
