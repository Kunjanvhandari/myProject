import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);

  const knownNonPdfDomains = [
    "pustakalaya.org",
    "worldlibrary.org",
  ];

  const orConditions = knownNonPdfDomains.map((domain) => ({
    sourceUrl: { $regex: new RegExp(`https?://[^/]*${domain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i") },
  }));

  const r = await mongoose.connection.db.collection("books").updateMany(
    { $or: orConditions },
    { $set: { sourceUrl: "" } }
  );
  console.log("Cleared non-PDF web page URLs:", r.modifiedCount);
  mongoose.disconnect();
}
fix().catch(console.error);
