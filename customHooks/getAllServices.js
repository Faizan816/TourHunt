import axios from "axios";

export async function getAllTourPackages() {
  const tourPackagesResponse = await axios.get(
    "http://127.0.0.1:8000/tourPackages"
  );
  return tourPackagesResponse.data;
}

export async function getAllAccommodations() {
  const accommodationsResponse = await axios.get(
    "http://127.0.0.1:8000/accommodations"
  );
  return accommodationsResponse.data;
}

export async function getAllTransports() {
  const transportsResponse = await axios.get(
    "http://127.0.0.1:8000/transports"
  );
  return transportsResponse.data;
}

export async function getAllRestaurants() {
  const restaurantsResponse = await axios.get(
    "http://127.0.0.1:8000/restaurants"
  );
  return restaurantsResponse.data;
}
