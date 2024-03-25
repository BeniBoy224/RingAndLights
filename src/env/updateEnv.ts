import fs from 'fs';
import path from 'path';

// Function to update a value in the .env file
function updateEnvVariable(key: string, value: string): void {
    // Load the current content of the .env file
    const envFilePath = path.resolve(__dirname, '..', '..', '.env');
    const envContent = fs.readFileSync(envFilePath, 'utf8');

    // Create a RegExp pattern to match the key-value pair
    const pattern = new RegExp(`${key}=.*`);

    // Replace the existing value with the new value
    const updatedEnvContent = envContent.replace(pattern, `${key}=${value}`);

    // Write the updated content back to the .env file
    fs.writeFileSync(envFilePath, updatedEnvContent);
}