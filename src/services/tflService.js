const axios = require("axios");

const TFL_BASE_URL = "https://api.tfl.gov.uk";
const TFL_API_KEY = process.env.TFL_API_KEY;

// Function to fetch statuses from the TFL API
exports.getLineStatus = async (lineName) => {
  try {
    const response = await axios.get(
      `${TFL_BASE_URL}/line/${lineName}/status`,
      {
        params: {
          detail: "true",
          app_key: TFL_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw {
        status: error.response.status,
        message: `TFL API error: ${error.response.status}`,
        details: error.response.data,
      };
    }
    throw {
      status: 500,
      message: "Failed to connect to TFL API",
      details: error.message,
    };
  }
};
