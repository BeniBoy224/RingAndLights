import { RingApi } from 'ring-client-api'
import changeLightColor from './goveeAPI/goveeAPI'
import { env } from './env/env';
import { promisify } from 'util'
import { readFile, writeFile } from 'fs'

const ringApi = new RingApi({
  refreshToken: env.RING_REFRESH_TOKEN,

  // The following are all optional. See below for details
  /*
  cameraStatusPollingSeconds: 20,
  locationIds: [
    '488e4800-fcde-4493-969b-d1a06f683102',
    '4bbed7a7-06df-4f18-b3af-291c89854d60',
  ],
  */
})

async function main() {
  const locations = await ringApi.getLocations();
  const location = locations[0];
  const camera = location.cameras[0];

  //Automaticly refresh api token each time it is updated
  ringApi.onRefreshTokenUpdated.subscribe(
    async ({ newRefreshToken, oldRefreshToken }) => {
      if (!oldRefreshToken) {
        return
      }

      const currentConfig = await promisify(readFile)('../.env'),
        updatedConfig = currentConfig
          .toString()
          .replace(oldRefreshToken, newRefreshToken)

      await promisify(writeFile)('../.env', updatedConfig)
    }
  )
  
  camera.onDoorbellPressed.subscribe(() => {
    changeLightColor();
  });
}


main();