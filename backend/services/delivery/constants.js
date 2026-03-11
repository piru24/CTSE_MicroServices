const apiKey = "5b3ce3597851110001cf6248211801968e064168aae20cd718432fc1";
const geoCodeBaseUrl = "https://api.openrouteservice.org/geocode/search?";

const constants = {
  API_KEY: apiKey,
  GEOCODE_URL_PREFIX : `${geoCodeBaseUrl}api_key=${apiKey}&text=`,
  GEOCODE_URL_SUFFIX : "&size=1",
  DURATION_URL : "https://api.openrouteservice.org/v2/matrix/driving-car"
};

module.exports = constants;