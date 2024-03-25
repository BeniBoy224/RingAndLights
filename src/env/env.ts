import dotenv from 'dotenv';
import path from 'path';

// Load the .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Define a type for your environment variables
interface EnvConfig {
    RING_REFRESH_TOKEN: string;
    GOVEE_API_KEY: string;
    GOVEE_MAC_ADDRESS: string;
    GOVEE_SKU: string;
    RING_COLOR: number;
    COLOR_TIME: number;
}

// Parse and assign environment variables
export const env: EnvConfig = {
    RING_REFRESH_TOKEN: process.env.RING_REFRESH_TOKEN || '',
    GOVEE_API_KEY: process.env.GOVEE_API_KEY || '',
    GOVEE_MAC_ADDRESS: process.env.GOVEE_MAC_ADDRESS || '',
    GOVEE_SKU: process.env.GOVEE_SKU || '',
    RING_COLOR: parseInt(process.env.RING_COLOR || '0', 10),
    COLOR_TIME: parseInt(process.env.COLOR_TIME || '0', 10)
};
