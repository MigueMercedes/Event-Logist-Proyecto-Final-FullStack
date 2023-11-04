import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 4000;
export const API_URL = process.env.API_URL || "mongodb://127.0.0.1/eventlogist";
