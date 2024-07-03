import axios from "axios";
export async function getUserBookings(id) {
  const bookingsResponse = await axios.post(
    "http://127.0.0.1:8000/getBookings",
    { userId: id }
  );
  return bookingsResponse.data;
}

export async function getTourPackageBookings(id) {
  const bookingsResponse = await axios.post(
    "http://127.0.0.1:8000/getTourPackageBookings",
    { userId: id }
  );
  return bookingsResponse.data;
}

export async function getAccommodationBookings(id) {
  const bookingsResponse = await axios.post(
    "http://127.0.0.1:8000/getAccommodationBookings",
    { userId: id }
  );
  return bookingsResponse.data;
}

export async function getTransportBookings(id) {
  const bookingsResponse = await axios.post(
    "http://127.0.0.1:8000/getTransportBookings",
    { userId: id }
  );
  return bookingsResponse.data;
}

export async function getRestaurantBookings(id) {
  const bookingsResponse = await axios.post(
    "http://127.0.0.1:8000/getRestaurantBookings",
    { userId: id }
  );
  return bookingsResponse.data;
}
