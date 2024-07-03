const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
//for running python scripts
const { spawn } = require("child_process");
const path = require("path");

const userRoute = require("./routes/userRoute");

const cors = require("cors");

app.use(cors());

app.use(express.json({ limit: "100mb" }));

// Increase the request body size limit to 100MB
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

//Connect to mongodb database(locally)
mongoose
  .connect("mongodb://127.0.0.1:27017/Fyp")
  .then(() => {
    console.log("Database Connected Successfully");
    app.listen(process.env.PORT || 5000, "0.0.0.0", (err) => {
      if (err) console.log(err);
      console.log(`running at port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log("Failed to connect", error));

app.use(userRoute);

// // for running python scripts
// function runNotebooks(folderPath, notebookList) {
//   notebookList.forEach((notebook) => {
//     const notebookPath = path.join(folderPath, notebook);

//     // Run the notebook using spawn
//     const notebookProcess = spawn("jupyter", [
//       "nbconvert",
//       "--to",
//       "notebook",
//       "--execute",
//       notebookPath,
//     ]);

//     // Uncomment the following lines if you want to capture output from the subprocess
//     // notebookProcess.stdout.on('data', data => {
//     //   console.log(`stdout: ${data}`);
//     // });

//     // notebookProcess.stderr.on('data', data => {
//     //   console.error(`stderr: ${data}`);
//     // });

//     // Uncomment the following lines if you want to handle process exit events
//     // notebookProcess.on('close', code => {
//     //   console.log(`Notebook process exited with code ${code}`);
//     // });
//   });
// }

// // Define the base folder path
// const baseFolderPath = "E:\\jupyter\\ML model";

// // Define the relative folder paths and notebook lists
// const accommodationsFolder = path.join(baseFolderPath, "Accommodations");
// const priceFolder = path.join(baseFolderPath, "Price");
// const restaurantsFolder = path.join(baseFolderPath, "Restaurants");
// const tourPackagesFolder = path.join(baseFolderPath, "Tour Packages");
// const transportsFolder = path.join(baseFolderPath, "Transports");

// const accommodationsNotebooks = ["departureCity.ipynb", "price.ipynb"];
// const priceNotebooks = ["price.ipynb"];
// const restaurantsNotebooks = ["city.ipynb", "price.ipynb"];
// const tourPackagesNotebooks = [
//   "departureCity.ipynb",
//   "destinationCity.ipynb",
//   "transportType.ipynb",
// ];
// const transportsNotebooks = [
//   "departureCity.ipynb",
//   "price.ipynb",
//   "transportType.ipynb",
// ];

// // Run the notebooks
// runNotebooks(accommodationsFolder, accommodationsNotebooks);
// runNotebooks(priceFolder, priceNotebooks);
// runNotebooks(restaurantsFolder, restaurantsNotebooks);
// runNotebooks(tourPackagesFolder, tourPackagesNotebooks);
// runNotebooks(transportsFolder, transportsNotebooks);

// // Wait for some time to allow processes to start (you may need to adjust the sleep duration)
// setTimeout(() => {
//   console.log("Processes are running.");
// }, 10000);
