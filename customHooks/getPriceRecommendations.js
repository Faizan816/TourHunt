import axios from "axios";

export async function getPriceRecommendations(average) {
  const response = await axios.post("http://127.0.0.1:5100/recommend", {
    price: average,
  });
  return response.data;
}

export async function getAccommodationRecommendations(average) {
  const response = await axios.post(
    "http://127.0.0.1:5100/recommend_accommodations",
    {
      price: average,
    }
  );
  return response.data;
}

export async function getTransportRecommendations(average) {
  const response = await axios.post(
    "http://127.0.0.1:5100/recommend_transports",
    {
      price: average,
    }
  );
  return response.data;
}

export async function getRestaurantRecommendations(average) {
  const response = await axios.post(
    "http://127.0.0.1:5100/recommend_restaurants",
    {
      price: average,
    }
  );
  return response.data;
}
