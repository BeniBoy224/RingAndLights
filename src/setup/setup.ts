import { RingApi } from 'ring-client-api'
import { getAllLights } from '../goveeAPI/goveeAPI'
import { env } from '../env/env';
import { promisify } from 'util'
import { readFile, writeFile } from 'fs'

async function setup() {
    await getAllLights()
    console.log("test");
}

setup()