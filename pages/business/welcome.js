import React, { useEffect } from "react";
import CinematicSlider from "../../components/CinematicSlider";
import Layout from "../../components/layout";
import axios from "axios";
import { useRouter } from "next/router";

export default function Welcome() {
  const router = useRouter();
  const images = [
    "../images/wl1.jpg",
    "../images/wl2.jpg",
    "../images/wl3.jpg",
    "../images/wl4.webp",
    "../images/wl5.jpg",
    "../images/wl6.jpg",
    "../images/wl7.webp",
    "../images/wl8.webp",
  ]; // Replace with actual image paths
  const words = [
    "MURREE",
    "KASHMIR",
    "SWAT",
    "NARAN",
    "LAHORE",
    "ISLAMABAD",
    "KARACHI",
    "HUNZA VALLEY",
  ]; // Replace with actual words

  useEffect(() => {
    preventUnwantedBehavior();
  }, []);

  const preventUnwantedBehavior = async () => {
    const user = await axios.post("http://127.0.0.1:8000/findUserUsingEmail", {
      email: localStorage.getItem("currentUser"),
    });
    const userId = user.data._id;
    try {
      const businessResponse = await axios.post(
        "http://127.0.0.1:8000/getBusiness",
        { id: userId }
      );
      router.push("../business/dashboard");
    } catch (error) {
      try {
        const biResponse = await axios.post(
          "http://127.0.0.1:8000/getBusinessInvite",
          { id: userId }
        );
        router.push("../business/dashboard");
      } catch (error) {}
    }
  };

  return <CinematicSlider images={images} words={words} />;
}
