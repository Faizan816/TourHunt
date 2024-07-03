import { useEffect, useState } from "react";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = "AIzaSyBG7e6ggogcPLuQaOMoZrP8kXAGSrSn8BI";

export default function Map({ service }) {
  const [mapSrc, setMapSrc] = useState("");

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            `${service.destination}, ${service.city}, ${service.province}`
          )}&key=${GOOGLE_MAPS_API_KEY}`
        );

        console.log("Geocoding API response:", response.data);

        if (response.data.results.length > 0) {
          const { lat, lng } = response.data.results[0].geometry.location;
          const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=13&size=400x300&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;

          console.log("Generated map URL:", mapUrl);

          setMapSrc(mapUrl);
        } else {
          console.error("No results found for the given address.");
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, [service]);

  return (
    <div>
      {mapSrc ? (
        <img style={{ height: 400 }} src={mapSrc} alt="Map" />
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
}
