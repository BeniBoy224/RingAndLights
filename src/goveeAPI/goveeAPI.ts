import axios, { AxiosResponse, AxiosError } from 'axios';
import { env } from '../env/env';

const baseUrl = "https://openapi.api.govee.com";
const headers = {
  "Govee-API-Key": env.GOVEE_API_KEY
}

export default async function changeLightColor(): Promise<void> {
  try {
    const postData = {
      "requestId": "uuid",
      "payload": {
          "sku": env.GOVEE_SKU,
          "device": env.GOVEE_MAC_ADDRESS
      }
    };

    let currentColor: number;

    const response: AxiosResponse = await axios.post(`${baseUrl}/router/api/v1/device/state`, postData, { headers });

    await Promise.all(response.data.payload.capabilities.map((data: any) => {
      if(data.instance === "colorRgb") {
        currentColor = data.state.value;
        setColor(currentColor)
      }
    }));

  } catch (error) {
    if (axios.isAxiosError(error)) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      const axiosError: AxiosError = error;

      if (axiosError.response) {
        console.error('Error status:', axiosError.response.status);
        console.error('Error data:', axiosError.response.data);
      } else if (axiosError.request) {
        console.error('No response received:', axiosError.request);
      } else {
        console.error('Error:', axiosError.message);
      }
    } else {
      // Something else happened while setting up the request
      console.error('Error:', axios.isAxiosError(error));
    }
  }
}

export async function getAllLights() {
  try {
    const response: AxiosResponse = await axios.get(`${baseUrl}/router/api/v1/user/devices`, { headers });

    console.log("Test: " + response);
    /*
    await Promise.all(response.data.map((data: any) => {
      if(data.type === "devices.types.light") {
        const result = {
          "sku": data.sku,
          "device": data.device,
          "deviceName": data.deviceName,
        }

        return data;
      }
    }));
    */
    const filteredDevices = response.data.filter((data: any) => data.type === "devices.types.light");
    console.log(filteredDevices);

  } catch (error) {
    if (axios.isAxiosError(error)) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      const axiosError: AxiosError = error;

      if (axiosError.response) {
        console.error('Error status:', axiosError.response.status);
        console.error('Error data:', axiosError.response.data);
      } else if (axiosError.request) {
        console.error('No response received:', axiosError.request);
      } else {
        console.error('Error:', axiosError.message);
      }
    } else {
      // Something else happened while setting up the request
      console.error('Error:', axios.isAxiosError(error));
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function setColor(currentColor: number) {
  const postColorNewData = {
    "requestId": "uuid",
    "payload": {
      "sku": env.GOVEE_SKU,
      "device": env.GOVEE_MAC_ADDRESS,
      "capability": {
        "type": "devices.capabilities.color_setting",
        "instance": "colorRgb",
        "value": env.RING_COLOR
      }
    }
  };

  const postColorOldData = {
    "requestId": "uuid",
    "payload": {
      "sku": env.GOVEE_SKU,
      "device": env.GOVEE_MAC_ADDRESS,
      "capability": {
        "type": "devices.capabilities.color_setting",
        "instance": "colorRgb",
        "value": currentColor
      }
    }
  };

  await axios.post(`${baseUrl}/router/api/v1/device/control`, postColorNewData, { headers });
  await sleep(env.COLOR_TIME);
  await axios.post(`${baseUrl}/router/api/v1/device/control`, postColorOldData, { headers });
}
