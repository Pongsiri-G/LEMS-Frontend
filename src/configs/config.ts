import dotenv from "dotenv";

dotenv.config();
const config = {
    publicAPI: process.env.NEXT_PUBLIC_API_URL,
};

export default config;
