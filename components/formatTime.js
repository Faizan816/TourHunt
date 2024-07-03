export default function formatTimeToAMPM(timeString) {
  // Split the time string into hours and minutes
  const [hours, minutes] = timeString
    .split(":")
    .map((num) => parseInt(num, 10));

  // Create a Date object with the given hours and minutes
  const time = new Date(0, 0, 0, hours, minutes);

  // Format the time into AM/PM format
  let formattedTime = time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Return the formatted time
  return formattedTime;
}
