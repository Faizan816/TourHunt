import { useState } from "react";
import axios from "axios";

export async function getCurrentUser() {
  const email = localStorage.getItem("currentUser");
  const userResponse = await axios.post(
    "http://127.0.0.1:8000/findUserUsingEmail",
    { email: email }
  );
  return userResponse.data;
}
