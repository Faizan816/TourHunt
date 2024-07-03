const express = require("express");
const router = express.Router();
const Customer = require("../models/customerModel");
const BusinessOwner = require("../models/BusinessOwner");
const Gcustomer = require("../models/GoogleCustomerModal");
const GBusiness = require("../models/GoogleBusinessOwnerModal");
const TourPackage = require("../models/tourPackageModel");
const Restaurant = require("../models/restaurantModel");
const Acc = require("../models/accommodationModel");
const Transport = require("../models/transportModel");
const Guide = require("../models/guideModel");
const Admin = require("../models/adminModel");
const Community = require("../models/community");
const CurrentUser = require("../models/currentUser");
const BusinessInvite = require("../models/businessInviteModel");
const Business = require("../models/businessModel");
const Payment = require("../models/paymentModel");
const Review = require("../models/reviewModel");
const Booking = require("../models/bookingModel");
const validator = require("email-validator");
const dns = require("dns");
const RequestsHistory = require("../models/requestsHistoryModel");
const PurchasedServices = require("../models/purchasedServicesModel");
const TourPackageReceipt = require("../models/tourPackageReceipt");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../lib/mail");
const Favorite = require("../models/favoritesModel");
const RestaurantBooking = require("../models/restaurantBookingModel");
const AccommodationBooking = require("../models/accommodationBookingModel");
const TransportBooking = require("../models/transportBookingModel");
const TourPackageBooking = require("../models/tourPackageBookingModel");
const ProfilePicture = require("../models/profilePictureModel");
const Complaint = require("../models/complaintModel");
const cron = require("node-cron");

// signup of customer
router.post("/registerCustomer", async (req, res) => {
  const { username, email, password, gender, userType } = req.body;
  try {
    // Check if a user with the same email already exists
    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with the same email already exists" });
    }

    // Check if the email is already registered as a Business Owner
    const existingOwner = await BusinessOwner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({
        error:
          "A user with the same email already exists as a Business owner. Please use a different email or login to your existing account.",
      });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("customer registered in databse password", hashedPassword);
    // Create a new user with the hashed password
    const user = await Customer.create({
      username,
      email,
      password: hashedPassword,
      gender,
      userType,
    });
    // now creating verification jwt token for email verification
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // sending verification email
    const url = `http://MuhammadFaizanAhmad-61918.portmap.host:61918/verify-email?token=${token}`;
    await sendMail({
      to: email,
      name: username,
      subject: "Verify your email address",
      body: `Click <a href="${url}">here</a> to verify your email address. This link is valid for 1 hour only.`,
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// signup of business owner
router.post("/registerBusinessOwner", async (req, res) => {
  const { username, email, password, gender, userType } = req.body;
  try {
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({
        error:
          "A user with the same email already exists as a customer. Please use a different email or login to your existing account.",
      });
    }

    const existingUser = await BusinessOwner.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with the same email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await BusinessOwner.create({
      username,
      email,
      password: hashedPassword,
      gender,
      userType,
    });
    // now creating verification jwt token for email verification
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // sending verification email
    const url = `http://MuhammadFaizanAhmad-61918.portmap.host:61918/verify-email?token=${token}`;
    await sendMail({
      to: email,
      name: username,
      subject: "Verify your email address",
      body: `Click <a href="${url}">here</a> to verify your email address. This link is valid for 1 hour only.`,
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// signup of google logges-customer
router.post("/googleRegisterCustomer", async (req, res) => {
  const { username, email, userType, gender } = req.body;
  try {
    // Check if a user with the same email already exists
    const existingUser = await Gcustomer.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with the same email already exists" });
    }

    // Check if the email is already registered as a Business Owner
    const existingOwner = await GBusiness.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({
        error:
          "A user with the same email already exists as a Business owner. Please use a different email or login to your existing account.",
      });
    }

    // Create a new user with the hashed password
    const user = await Gcustomer.create({ username, email, userType, gender });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// signup of google logges-customer
router.post("/googleRegisterBusinessOwner", async (req, res) => {
  const { username, email, userType, gender } = req.body;
  try {
    // Check if a user with the same email already existsGBusiness
    const existingUser = await GBusiness.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with the same email already exists" });
    }

    // Check if the email is already registered as a Business Owner
    const existingOwner = await Gcustomer.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({
        error:
          "A user with the same email already exists as a Business owner. Please use a different email or login to your existing account.",
      });
    }

    // Create a new user with the hashed password
    const user = await GBusiness.create({ username, email, userType, gender });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// login
router.post("/setCurrentUser", async (req, res) => {
  const { email, password, username, userType } = req.body;

  try {
    let user;

    // Check if a password is provided
    if (password) {
      // Password is provided, check the respective collection based on userType
      if (userType === "customer") {
        user = await Customer.findOne({ email });
      } else if (userType === "businessOwner") {
        user = await BusinessOwner.findOne({ email });
      }
    } else {
      // No password provided, check Google-registered accounts collection
      if (userType === "customer") {
        user = await Gcustomer.findOne({ email });
      } else if (userType === "businessOwner") {
        user = await GBusiness.findOne({ email });
      }
    }

    // Check if a user exists
    if (!user) {
      // If the user doesn't exist and password is provided, return error
      if (password) {
        return res.status(400).json({ error: "User not found" });
      }
    }

    // Check if a password is provided and verify it
    if (password) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        // Passwords don't match, return error
        return res.status(400).json({ error: "Invalid password" });
      }
    }

    // Generate JWT token
    // Add this line at the beginning of your route handler
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    const token = jwt.sign({ email, userType }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    console.log(token);

    // Save login data in the CurrentUser collection
    const currentUser = await CurrentUser.findOneAndUpdate(
      { _id: "660d33ef7d2bebc8e494c7c5" }, // Assuming you have a specific document ID for current user
      { email, username, userType },
      { upsert: true, new: true }
    );

    // Login successful, return success message along with user data and token
    return res.status(200).json({
      message: "Login successful. Welcome to our site!",
      currentUser,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// find user using email
router.post("/findUserUsingEmail", async (req, res) => {
  const { email } = req.body;
  try {
    // Check if the email exists in the Customer collection
    const customer = await Customer.findOne({ email });
    console.log(req.body);
    if (customer) {
      return res.status(200).json(customer);
    }

    // Check if the email exists in the BusinessOwner collection
    const businessOwner = await BusinessOwner.findOne({ email });
    if (businessOwner) {
      return res.status(200).json(businessOwner);
    }

    // Check if the email exists in the GoogleCustomer collection
    const googleCustomer = await Gcustomer.findOne({ email });
    if (googleCustomer) {
      console.log("gcus checked");
      return res.status(200).json({
        user: googleCustomer,
        userType: "customer",
        username: googleCustomer.username,
        email: googleCustomer.email,
        _id: googleCustomer._id,
      });
    }

    // Check if the email exists in the GoogleBusinessOwner collection
    const googleBusinessOwner = await GBusiness.findOne({ email });
    if (googleBusinessOwner) {
      console.log("checked");
      return res.status(200).json({
        user: googleBusinessOwner,
        userType: "businessOwner",
        username: googleBusinessOwner.username,
        email: googleBusinessOwner.email,
        _id: googleBusinessOwner._id,
      });
    }

    console.log("The customer found is: " + customer);

    // If the email is not found in any collection, return an error
    return res
      .status(204)
      .json({ message: "No account found. Proceed with Google sign-up." });
    // return res.status(404).json({ message: "Account not found!" });
  } catch (error) {
    console.error("Error fetching user: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
});

// Route to check if the email exists in the database and get the user type
router.post("/check-email", async (req, res) => {
  const { email } = req.body;
  try {
    const customer = await Customer.findOne({ email });
    if (customer) {
      return res
        .status(200)
        .json({ message: "Email found", userType: "customer" });
    }

    const businessOwner = await BusinessOwner.findOne({ email });
    if (businessOwner) {
      return res
        .status(200)
        .json({ message: "Email found", userType: "businessOwner" });
    }

    return res.status(404).json({ error: "Email not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Route to reset the password
router.put("/update-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Find the user by email in both Customer and BusinessOwner collections
    let user = await Customer.findOne({ email });
    if (!user) {
      user = await BusinessOwner.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password with the hashed password
    user.password = hashedPassword;
    await user.save();

    // Password updated successfully
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get admin
router.post("/admin", async (req, res) => {
  const { email, password } = req.body;
  console.log(email + "\n" + password);
  try {
    const admin = await Admin.findOne({ email, password });
    if (!admin) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    res.status(200).json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get all tour packages
router.get("/tourpackages", async (req, res) => {
  try {
    const tourPackages = await TourPackage.find({ status: "Approved" });
    res.status(200).json(tourPackages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get all restaurants
router.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ status: "Approved" });
    res.status(200).json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get all accommodations
router.get("/accommodations", async (req, res) => {
  try {
    const accommodations = await Acc.find({ status: "Approved" });
    res.status(200).json(accommodations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get all transports
router.get("/transports", async (req, res) => {
  try {
    const transports = await Transport.find({ status: "Approved" });
    res.status(200).json(transports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get all communities
router.get("/communities", async (req, res) => {
  try {
    const communities = await Community.find();
    res.status(200).json(communities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//create community
router.post("/createCommunity", async (req, res) => {
  try {
    const { communityName, users } = req.body;
    console.log(communityName + " " + users);
    const community = await Community.create({
      name: communityName,
      users: users,
    });
    console.log("Community successfully created!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get current user
router.get("/getCurrentUser", async (req, res) => {
  try {
    const currentUser = await CurrentUser.find();
    res.status(200).json(currentUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//set current user
// router.post("/setCurrentUser", async (req, res) => {
//   try {
//     const { email, username } = req.body;
//     console.log(email + " " + username);
//     const currentUser = await CurrentUser.findByIdAndUpdate(
//       "65c693a127f5db879fe87dbe",
//       {
//         email,
//         username,
//       }
//     );
//     if (!currentUser) {
//       res
//         .status(400)
//         .json({ message: "No current user was found with this id" });
//     }
//     console.log("Current user updated successfully!");
//     res.status(200).json(currentUser);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

//make restaurant registration
router.post("/registerRestaurant", async (req, res) => {
  console.log("Request Body:", req.body); // Log request body for debugging
  const {
    userId,
    name,
    businessName,
    cuisine,
    city,
    province,
    country,
    averageFoodRate,
    contact,
    openingTime,
    closingTime,
    reservation,
    reservationCharges,
    imageUrls,
    status,
  } = req.body;
  try {
    const restaurant = await Restaurant.create({
      userId: userId,
      name: name,
      businessName,
      cuisine: cuisine,
      city,
      province,
      country,
      averageFoodRate,
      contact: contact,
      openingTime,
      closingTime,
      reservation: reservation,
      reservationCharges,
      imageUrls: imageUrls,
      status,
    });
    return res.status(201).json(restaurant);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
});

// get restaurant
router.post("/getRestaurant", async (req, res) => {
  const { userId } = req.body; // Assuming userId is sent in the request body
  try {
    const restaurant = await Restaurant.find({ userId, status: "Approved" }); // Assuming userId matches the field in Accommodation model
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant details not found!" });
    }
    return res.status(200).json(restaurant);
  } catch (error) {
    console.error("Error fetching Restaurant:", error);
    return res.status(500).json({ error: "Internal server error!" });
  }
});

// get single restaurant
router.get("/getRestaurant/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findById({ _id: id });
    if (!restaurant) {
      return res.status(404).json("restaurant not found!");
    }
    return res.status(200).json(restaurant);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// edit restaurant
router.post("/editRestaurant", async (req, res) => {
  const {
    _id,
    userId,
    name,
    businessName,
    cuisine,
    city,
    province,
    country,
    averageFoodRate,
    contact,
    openingTime,
    closingTime,
    reservation,
    reservationCharges,
    imageUrls,
    status,
  } = req.body;
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: _id },
      {
        userId,
        name,
        businessName,
        cuisine,
        city,
        province,
        country,
        averageFoodRate,
        contact,
        openingTime,
        closingTime,
        reservation,
        reservationCharges,
        imageUrls,
        status,
      }
    );
    if (!restaurant) {
      return res.status(404).json("No restaurant detail found to be updated!");
    }
    return res.status(200).json("Restaurant detail  updated successfully!");
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// delete restaurant
router.post("/deleteRestaurant", async (req, res) => {
  const { id } = req.body;
  try {
    const restaurant = await Restaurant.findOneAndDelete({ _id: id });
    if (!restaurant) {
      return res.status(404).json("No Restaurant details are deleted!");
    }
    return res.status(200).json("Restaurant details are deleted successfully!");
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

//make accommodation registration
router.post("/registerAccommodation", async (req, res) => {
  const {
    userId,
    name,
    businessName,
    contact,
    city,
    province,
    country,
    amenities,
    hotelRoomExpensePerPerson,
    imageUrls,
    status,
  } = req.body;

  try {
    // Create a new hotel using the Hotel model
    const hotel = await Acc.create({
      userId,
      name,
      businessName,
      contact,
      city,
      province,
      country,
      amenities,
      hotelRoomExpensePerPerson,
      imageUrls,
      status,
    });

    res.status(201).json(hotel); // Send a success response with the created hotel
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message }); // Send an error response if registration fails
  }
});

// get accommodation
router.post("/getAccommodation", async (req, res) => {
  const { userId } = req.body; // Assuming userId is sent in the request body
  try {
    const accommodation = await Acc.find({ userId, status: "Approved" }); // Assuming userId matches the field in Accommodation model
    if (!accommodation) {
      return res
        .status(404)
        .json({ error: "Accommodation details not found!" });
    }
    return res.status(200).json(accommodation);
  } catch (error) {
    console.error("Error fetching accommodation:", error);
    return res.status(500).json({ error: "Internal server error!" });
  }
});

// get single accommodation
router.get("/getAccommodation/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const accommodation = await Acc.findById({ _id: id });
    if (!accommodation) {
      return res.status(404).json("Accommodation not found!");
    }
    return res.status(200).json(accommodation);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error!");
  }
});

// router.post("/getAccommodation", async (req, res) => {
//   const { userId } = req.body;
//   try {
//     const accommodation = await Acc.findById({ userId, status: "Approved" });
//     if (!accommodation) {
//       return res.status(404).json("No Accommodation found!");
//     }
//     return res.status(200).json(accommodation);
//   } catch (error) {
//     return res.status(500).json("Internal server error!");
//   }
// });

// edit accommodation
router.post("/editAccommodation", async (req, res) => {
  const {
    _id,
    userId,
    name,
    businessName,
    contact,
    city,
    province,
    country,
    amenities,
    hotelRoomExpensePerPerson,
    imageUrls,
    status,
  } = req.body;
  try {
    const accommodation = await Acc.findOneAndUpdate(
      { _id: _id },
      {
        userId,
        name,
        businessName,
        contact,
        city,
        province,
        country,
        amenities,
        hotelRoomExpensePerPerson,
        imageUrls,
        status,
      }
    );
    if (!accommodation) {
      return res
        .status(404)
        .json("No Accomomdation detail found to be updated!");
    }
    return res.status(200).json("Accomodation detail  updated successfully!");
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// delete accommodation
router.post("/deleteAccommodation", async (req, res) => {
  const { id } = req.body;
  try {
    const accomodation = await Acc.findOneAndDelete({ _id: id });
    if (!accomodation) {
      return res.status(404).json("No accomodation details are deleted!");
    }
    return res
      .status(200)
      .json("Accomodation details are deleted successfully!");
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

//make transport registration
router.post("/registerTransport", async (req, res) => {
  console.log("Request Body:", req.body); // Log request body for debugging
  const {
    userId,
    name,
    businessName,
    seatPricePerPerson,
    amenities,
    city,
    province,
    country,
    contact,
    transportType,
    status,
    capacity,
    imageUrls,
  } = req.body;
  console.log(req.body);
  try {
    const transport = await Transport.create({
      userId,
      name,
      businessName,
      seatPricePerPerson,
      amenities,
      city,
      province,
      country,
      contact,
      transportType,
      status,
      capacity,
      imageUrls,
    });
    res.status(201).json(transport);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// get transport
router.post("/getTransport", async (req, res) => {
  const { userId } = req.body; // Assuming userId is sent in the request body
  try {
    const transport = await Transport.find({ userId, status: "Approved" }); // Assuming userId matches the field in Accommodation model
    if (!transport) {
      return res.status(404).json({ error: "Transposrt details not found!" });
    }
    return res.status(200).json(transport);
  } catch (error) {
    console.error("Error fetching Transport:", error);
    return res.status(500).json({ error: "Internal server error!" });
  }
});

// get single transport
router.get("/getTransport/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const transport = await Transport.findById({ _id: id });
    if (!transport) {
      return res.status(404).json("Tour Package not found!");
    }
    return res.status(200).json(transport);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// edit transport
router.post("/editTransport", async (req, res) => {
  const {
    _id,
    userId,
    name,
    businessName,
    seatPricePerPerson,
    amenities,
    city,
    province,
    country,
    contact,
    transportType,
    status,
    capacity,
    imageUrls,
  } = req.body;
  try {
    const accommodation = await Transport.findOneAndUpdate(
      { _id: _id },
      {
        userId,
        name,
        businessName,
        seatPricePerPerson,
        amenities,
        city,
        province,
        country,
        contact,
        transportType,
        status,
        capacity,
        imageUrls,
      }
    );
    if (!accommodation) {
      return res.status(404).json("No Transport detail found to be updated!");
    }
    return res.status(200).json("Transport detail  updated successfully!");
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// delete transport
router.post("/deleteTransport", async (req, res) => {
  const { id } = req.body;
  try {
    const transport = await Transport.findOneAndDelete({ _id: id });
    if (!transport) {
      return res.status(404).json("No accomodation details are deleted!");
    }
    return res
      .status(200)
      .json("Accomodation details are deleted successfully!");
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// make guide registeration
router.post("/registerGuide", async (req, res) => {
  const {
    userId,
    name,
    contact,
    location,
    years_of_experience,
    specialization,
    languages,
    imageUrls,
  } = req.body;

  try {
    // Create a new guide using the Guide model
    const guide = await Guide.create({
      userId: userId,
      name: name,
      contact: contact,
      location: location,
      years_of_experience: years_of_experience,
      specialization: specialization,
      languages: languages,
      imageUrls: imageUrls,
    });

    res.status(201).json(guide); // Send a success response with the created guide
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message }); // Send an error response if registration fails
  }
});

// get
router.post("/getGuide", async (req, res) => {
  const { userId } = req.body; // Assuming userId is sent in the request body
  try {
    const guide = await Guide.find({ userId }); // Assuming userId matches the field in Accommodation model
    if (!guide) {
      return res.status(404).json({ error: "guide details not found!" });
    }
    console.log("guide found:", guide);
    return res.status(200).json(guide);
  } catch (error) {
    console.error("Error fetching guide:", error);
    return res.status(500).json({ error: "Internal server error!" });
  }
});

// get single guide
router.get("/getGuide/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const guide = await Guide.findById({ _id: id });
    if (!guide) {
      return res.status(404).json("guide  not found!");
    }
    return res.status(200).json(guide);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// edit guide
router.post("/editGuide", async (req, res) => {
  const {
    _id,
    userId,
    name,
    contact,
    location,
    years_of_experience,
    specialization,
    languages,
    imageUrls,
  } = req.body;
  try {
    const guide = await Guide.findOneAndUpdate(
      { _id: _id },
      {
        userId,
        name,
        contact,
        location,
        years_of_experience,
        specialization,
        languages,
        imageUrls,
      }
    );
    if (!guide) {
      return res.status(404).json("No guide detail found to be updated!");
    }
    return res.status(200).json("guide detail  updated successfully!");
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// delete guide
router.post("/deleteGuide", async (req, res) => {
  const { id } = req.body;
  try {
    const guide = await Guide.findOneAndDelete({ _id: id });
    if (!guide) {
      return res.status(404).json("No guide details are deleted!");
    }
    return res.status(200).json("guide details are deleted successfully!");
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get user id
router.post("/getUserId", async (req, res) => {
  const { email } = req.body;
  try {
    // Find customer based on email
    const customer = await Customer.findOne({ email });
    if (customer) {
      return res.status(200).json(customer);
    }
    const buser = await BusinessOwner.findOne({ email });
    if (buser) {
      return res.status(200).json(buser);
    }
    const guser = await Gcustomer.findOne({ email });
    if (guser) {
      return res.status(200).json(guser);
    }
    const gbusiness = await GBusiness.findOne({ email });
    if (gbusiness) {
      return res.status(200).json(gbusiness);
    }
    return res.status(404).json({ message: "Customer not found" });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// // find user using email---faizan
// router.post("/findUserUsingEmail", async (req, res) => {
//   const { email } = req.body;
//   console.log(email);
//   try {
//     const customer = await Customer.findOne({ email });
//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found!" });
//     }
//     return res.status(200).json(customer);
//   } catch (error) {
//     console.error("Error fetching customer: ", error);
//     return res.status(500).json({ message: "Internal server error!" });
//   }
// });

// get all business invites
router.get("/getBusinessInvites", async (req, res) => {
  try {
    const pendingBusinessInvites = await Business.find({ status: "Pending" });
    if (!pendingBusinessInvites || pendingBusinessInvites.length === 0) {
      return res
        .status(404)
        .json({ message: "No pending business invites found" });
    }
    return res.status(200).json(pendingBusinessInvites);
  } catch (error) {
    console.error("Error fetching pending business invites: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
});

// get a business
router.post("/getBusiness", async (req, res) => {
  const { id } = req.body;
  try {
    const business = await Business.findOne({ userId: id });
    if (!business) {
      return res.status(404).json("No business found!");
    }
    res.status(200).json(business);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
});

//create a business
router.post("/registerBusiness", async (req, res) => {
  const {
    userId,
    businessName,
    ntn,
    country,
    province,
    city,
    contact,
    services,
    status,
    cnic,
  } = req.body;
  try {
    const business = await Business.create({
      userId,
      businessName,
      ntn,
      country,
      province,
      city,
      contact,
      services,
      status,
      cnic,
    });
    res.status(200).json(business);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
});

// approve a business
router.post("/approveBusiness", async (req, res) => {
  const {
    userId,
    businessName,
    country,
    province,
    city,
    contact,
    services,
    status,
  } = req.body;
  try {
    const business = await Business.findOneAndUpdate(
      { userId: userId },
      {
        userId,
        businessName,
        country,
        province,
        city,
        contact,
        services,
        status,
      }
    );
    res.status(200).json(business);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
});

// delete business invite
router.post("/deleteBusinessInvite", async (req, res) => {
  const {
    id,
    userId,
    businessName,
    country,
    province,
    city,
    contact,
    services,
    status,
  } = req.body;
  try {
    await Business.findOneAndUpdate(
      { _id: id },
      {
        _id: id,
        userId,
        businessName,
        country,
        province,
        city,
        contact,
        services,
        status,
      }
    );
    res.status(200).json({ message: "Business Invite successfully deleted!" });
  } catch (error) {
    res.status(500).json({ message: "No business invite found with give id" });
  }
});

// reinvoke business request
router.post("/reinvokeBusinessRequest", async (req, res) => {
  const {
    id,
    userId,
    businessName,
    country,
    province,
    city,
    contact,
    services,
    status,
  } = req.body;
  try {
    await Business.findOneAndUpdate(
      { _id: id },
      {
        _id: id,
        userId,
        businessName,
        country,
        province,
        city,
        contact,
        services,
        status,
      }
    );
    res.status(200).json({ message: "Business Request Reinvoked!" });
  } catch (error) {
    res.status(500).json({ message: "No business invite found with give id" });
  }
});

// delete business
router.post("/deleteBusiness", async (req, res) => {
  const { id } = req.body;
  try {
    await Business.findByIdAndDelete({ _id: id });
    res.status(200).json("Business successfully deleted!");
  } catch (error) {
    res.status(500).json("Internal server error!");
  }
});

// get a business invite
router.post("/getBusinessInvite", async (req, res) => {
  const { id } = req.body;
  try {
    const businessInvite = await BusinessInvite.findOne({ userId: id });
    if (!businessInvite) {
      return res.status(404).json("No business found!");
    }
    res.status(200).json(businessInvite);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
});

// update a business
router.post("/updateBusiness", async (req, res) => {
  const { business } = req.body;
  console.log(business);
  try {
    const updatedBusiness = await Business.findOneAndUpdate(
      { _id: business._id }, // Find business by ID
      { services: business.services }, // Update services
      { new: true } // Return the updated document
    );

    if (!updatedBusiness) {
      return res.status(404).json("No business found with given id!");
    }

    res.status(200).json("Business updated successfully!");
  } catch (error) {
    console.log("Server error:", error);
    res.status(500).json("Internal server error!");
  }
});

// update business profile
router.post("/updateBusinessProfile", async (req, res) => {
  const { _id, businessName, location, contact, cnic } = req.body;
  try {
    const updatedBusiness = await Business.findOneAndUpdate(
      { _id: _id },
      {
        businessName,
        location,
        contact,
        cnic,
      }
    );
    if (!updatedBusiness) {
      return res.status(404).json("Business not found!");
    }
    return res.status(200).json("Business updated successfully!");
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// tour package business registration
router.post("/registerBusinessTourPackage", async (req, res) => {
  try {
    const {
      name,
      contact,
      departureCity,
      city,
      departureDate,
      arrivalDate,
      summary,
      inclusions,
      exclusions,
      breakfast,
      lunch,
      dinner,
      transportType,
      hotelCompanyName,
      tourDuration,
      foodPrice,
      hotelRoomExpensePerPerson,
      transportExpensePerPerson,
      imageUrls,
      price,
      destination,
      province,
      country,
      status,
      userId,
      businessName,
    } = req.body;

    // Create a new TourPackage document
    const newTourPackage = new TourPackage({
      name,
      contact,
      departureCity,
      city,
      departureDate,
      arrivalDate,
      summary,
      inclusions,
      exclusions,
      breakfast,
      lunch,
      dinner,
      transportType,
      hotelCompanyName,
      tourDuration,
      foodPrice,
      hotelRoomExpensePerPerson,
      transportExpensePerPerson,
      imageUrls,
      price,
      destination,
      province,
      country,
      status,
      userId,
      businessName,
    });

    // Save the new TourPackage document to the database
    await newTourPackage.save();

    res
      .status(201)
      .json({ success: true, message: "Tour package registered successfully" });
  } catch (error) {
    console.error("Error registering tour package:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to register tour package" });
  }
});

// get approved business tour package
router.post("/getBusinessTourPackages", async (req, res) => {
  const { userId } = req.body;
  try {
    const tourPackage = await TourPackage.find({
      userId: userId,
      status: "Approved",
    });
    if (!tourPackage) {
      return res.status(404).json("Tour Packages not found for this uer!");
    }
    return res.status(200).json(tourPackage);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get pending business tour package
router.post("/getPendingBusinessTourPackages", async (req, res) => {
  const { userId } = req.body;
  try {
    const tourPackage = await TourPackage.find({
      userId: userId,
      status: "Pending",
    });
    if (!tourPackage) {
      return res.status(404).json("Tour Packages not found for this uer!");
    }
    return res.status(200).json(tourPackage);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get single business tour package
router.get("/getTourPackage/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const tourPackage = await TourPackage.findById({ _id: id });
    if (!tourPackage) {
      return res.status(404).json("Tour Package not found!");
    }
    return res.status(200).json(tourPackage);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// edit business tour package
router.post("/editBusinessTourPackage", async (req, res) => {
  const {
    _id,
    name,
    contact,
    departureCity,
    city,
    departureDate,
    arrivalDate,
    summary,
    inclusions,
    exclusions,
    breakfast,
    lunch,
    dinner,
    transportType,
    hotelCompanyName,
    tourDuration,
    foodPrice,
    hotelRoomExpensePerPerson,
    transportExpensePerPerson,
    imageUrls,
    price,
    destination,
    province,
    country,
    status,
    userId,
    businessName,
  } = req.body;
  try {
    const tourPackage = await TourPackage.findOneAndUpdate(
      { _id: _id },
      {
        name,
        contact,
        departureCity,
        city,
        departureDate,
        arrivalDate,
        summary,
        inclusions,
        exclusions,
        breakfast,
        lunch,
        dinner,
        transportType,
        hotelCompanyName,
        tourDuration,
        foodPrice,
        hotelRoomExpensePerPerson,
        transportExpensePerPerson,
        imageUrls,
        price,
        destination,
        province,
        country,
        status,
        userId,
        businessName,
      }
    );
    if (!tourPackage) {
      return res.status(404).json("No tour package found to be updated!");
    }
    return res.status(200).json("Tour Package updated successfully!");
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// delete business tour package
router.post("/deleteBusinessTourPackage", async (req, res) => {
  const { id } = req.body;
  try {
    const tourPackage = await TourPackage.findOneAndDelete({ _id: id });
    if (!tourPackage) {
      return res.status(404).json("No tour package deleted!");
    }
    return res.status(200).json("Tour package deleted successfully!");
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// store payment
router.post("/savePayment", async (req, res) => {
  const {
    serviceId,
    username,
    userId,
    serviceType,
    serviceName,
    amount,
    status,
  } = req.body;
  try {
    const payment = new Payment({
      serviceId,
      username,
      userId,
      serviceType,
      serviceName,
      amount,
      status,
    });
    await payment.save();
    return res.status(200).json("Payment saved successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error!");
  }
});

// update payment
router.post("/updatePayment", async (req, res) => {
  const { serviceId, userId, serviceType, serviceName, amount, status } =
    req.body;
  try {
    const review = await Payment.findOneAndUpdate(
      { userId, serviceId },
      {
        serviceId,
        userId,
        serviceType,
        serviceName,
        amount,
        status,
      }
    );
    if (!review) {
      return res.status(404).json("No payment with service id: " + serviceId);
    }
    return res.status(200).json("Payment updated successfully!");
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get user payments
router.post("/getPayments", async (req, res) => {
  const { userId } = req.body;
  try {
    const payments = await Payment.find({ userId: userId });
    if (!payments) {
      return res.status(404).json("No payments found!");
    }
    return res.status(200).json(payments);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get all payments for admin for transactions history
router.get("/getPayments", async (req, res) => {
  try {
    const payments = await Payment.find();
    if (!payments) {
      return res.status(404).json("No payments found!");
    }
    return res.status(200).json(payments);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// save booking
router.post("/saveBooking", async (req, res) => {
  const {
    buyerId,
    sellerId,
    serviceId,
    serviceName,
    buyerName,
    sellerName,
    buyerEmail,
    sellerEmail,
    serviceType,
    amountPaid,
  } = req.body;
  try {
    const booking = new Booking({
      buyerId,
      sellerId,
      serviceId,
      serviceName,
      buyerName,
      sellerName,
      buyerEmail,
      sellerEmail,
      serviceType,
      amountPaid,
    });
    await booking.save();
    return res.status(200).json("Booking saved successfully!");
  } catch (errro) {
    return res.status(500).json("Internal server error!");
  }
});

// get bookings of a customer
router.post("/getBookings", async (req, res) => {
  const { userId } = req.body;
  try {
    const bookings = await Booking.find({ buyerId: userId });
    if (!bookings) {
      return res.status(404).json("No bookings were found for this user!");
    }
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get tour package bookings of a customer
router.post("/getTourPackageBookings", async (req, res) => {
  const { userId } = req.body;
  try {
    const bookings = await TourPackageBooking.find({
      buyerId: userId,
    });
    if (!bookings) {
      return res.status(404).json("No bookings were found for this user!");
    }
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get accommodation bookings of a customer
router.post("/getAccommodationBookings", async (req, res) => {
  const { userId } = req.body;
  console.log(userId);
  try {
    const bookings = await AccommodationBooking.find({
      buyerId: userId,
    });
    if (!bookings) {
      return res.status(404).json("No bookings were found for this user!");
    }
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get transport bookings of a customer
router.post("/getTransportBookings", async (req, res) => {
  const { userId } = req.body;
  try {
    const bookings = await TransportBooking.find({
      buyerId: userId,
    });
    if (!bookings) {
      return res.status(404).json("No bookings were found for this user!");
    }
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get restaurant bookings of a customer
router.post("/getRestaurantBookings", async (req, res) => {
  const { userId } = req.body;
  try {
    const bookings = await RestaurantBooking.find({
      buyerId: userId,
    });
    if (!bookings) {
      return res.status(404).json("No bookings were found for this user!");
    }
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get all bookings for admin for transactions history
router.get("/getBookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    if (!bookings) {
      return res.status(404).json("No bookings were found for this user!");
    }
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// save a review
router.post("/saveReview", async (req, res) => {
  const {
    serviceId,
    userId,
    username,
    email,
    serviceName,
    serviceType,
    rating,
    comment,
  } = req.body;
  try {
    const review = await Review.create({
      serviceId,
      userId,
      username,
      email,
      serviceName,
      serviceType,
      rating,
      comment,
    });
    return res.status(200).json("Review saved successfully!");
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get not reviewed
router.post("/getNotReviewed", async (req, res) => {
  const { userId } = req.body;
  try {
    const payments = await Payment.find({
      userId: userId,
      status: "not reviewed",
    });
    if (!payments) {
      return res.status(404).json("No payments found!");
    }
    return res.status(200).json(payments);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get reviewed
router.post("/getReviews", async (req, res) => {
  const { userId } = req.body;
  try {
    const reviews = await Review.find({
      userId: userId,
    });
    if (!reviews) {
      return res.status(404).json("No reviews found!");
    }
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get all reviews for admin
router.get("/getReviews", async (req, res) => {
  try {
    const reviews = await Review.find();
    if (!reviews) {
      return res.status(404).json("No reviews found!");
    }
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query the database to find a user with the provided email and password
    const customer = await Customer.findOne({ email, password });
    if (!customer) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    // console.log("customer found");
    // Authentication successful
    return res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// find ratings of a service
router.post("/getServiceRatings", async (req, res) => {
  const { serviceId } = req.body;
  try {
    const reviews = await Review.find({ serviceId: serviceId });
    if (!reviews) {
      return res.status(404).json("No reviews were found!");
    }
    const ratings = reviews.map((d) => d.rating);
    return res.status(200).json(ratings);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get requests history
router.get("/getRequestsHistory", async (req, res) => {
  try {
    const requestsHistory = await RequestsHistory.find();
    if (!requestsHistory) {
      return res.status(404).json("No requests history yet!");
    }
    return res.status(200).json(requestsHistory);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// save request
router.post("/saveRequest", async (req, res) => {
  const { userId, username, email, requestType, requestName, requestStatus } =
    req.body;
  try {
    const request = await RequestsHistory.create({
      userId,
      username,
      email,
      requestType,
      requestName,
      requestStatus,
    });
    return res.status(200).json("Request saved successfully!");
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get user details
router.post("/getUserDetails", async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await Customer.findOne({ _id: userId });
    if (user) {
      return res.status(200).json(user);
    }
    const buser = await BusinessOwner.findOne({ _id: userId });
    if (buser) {
      return res.status(200).json(buser);
    }
    const gcustomer = await Gcustomer.findOne({ _id: userId });
    if (gcustomer) {
      return res.status(200).json(gcustomer);
    }
    const gbusiness = await GBusiness.findOne({ _id: userId });
    if (gbusiness) {
      return res.status(200).json(gbusiness);
    }
    return res.status(404).json("User not found!");
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get Pending tour packages for admin
router.get("/getPendingTourPackages", async (req, res) => {
  try {
    const tourPackages = await TourPackage.find({ status: "Pending" });
    if (!tourPackages) {
      return res.status(404).json("No tour package pending for approval!");
    }
    return res.status(200).json(tourPackages);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get pending tour packages requests for customer
router.post("/getPendingTourPackages", async (req, res) => {
  const { userId } = req.body;
  try {
    const tourPackages = await TourPackage.find({
      status: "Pending",
      userId: userId,
    });
    if (!tourPackages) {
      return res.status(404).json("No tour package pending for approval!");
    }
    return res.status(200).json(tourPackages);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get all restaurants for admin
router.get("/getPendingRestaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      status: "Pending",
    });
    if (!restaurants) {
      return res.status(404).json("No restaurants pending for approval!");
    }
    return res.status(200).json(restaurants);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get pending restaurants for customer
router.post("/getPendingRestaurants", async (req, res) => {
  const { userId } = req.body;
  try {
    const restaurants = await Restaurant.find({
      userId: userId,
      status: "Pending",
    });
    if (!restaurants) {
      return res.status(404).json("No restaurants pending for approval!");
    }
    return res.status(200).json(restaurants);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get pending transports for admin
router.get("/getPendingTransports", async (req, res) => {
  try {
    const transports = await Transport.find({ status: "Pending" });
    if (!transports) {
      return res.status(404).json("No pending transports for approval!");
    }
    return res.status(200).json(transports);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get pending transports for customer
router.post("/getPendingTransports", async (req, res) => {
  const { userId } = req.body;
  try {
    const transports = await Transport.find({ userId, status: "Pending" });
    if (!transports) {
      return res.status(404).json("No pending transports for approval!");
    }
    return res.status(200).json(transports);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get pending accommodations for admin
router.get("/getPendingAccommodations", async (req, res) => {
  try {
    const accommodations = await Acc.find({ status: "Pending" });
    if (!accommodations) {
      return res.status(404).json("No pending accommodations for approval!");
    }
    return res.status(200).json(accommodations);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// get pending accommodations for customer
router.post("/getPendingAccommodations", async (req, res) => {
  const { userId } = req.body;
  try {
    const accommodations = await Acc.find({ userId, status: "Pending" });
    if (!accommodations) {
      return res.status(404).json("No pending accommodations for approval!");
    }
    return res.status(200).json(accommodations);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// save purchased service by customer
router.post("/savePurchasedService", async (req, res) => {
  const {
    buyerId,
    sellerId,
    serviceId,
    serviceName,
    buyerName,
    buyerEmail,
    sellerName,
    sellerEmail,
    serviceType,
    amountPaid,
  } = req.body;
  try {
    const purchasedService = await PurchasedServices.create({
      buyerId,
      sellerId,
      serviceId,
      serviceName,
      buyerName,
      buyerEmail,
      sellerName,
      sellerEmail,
      serviceType,
      amountPaid,
    });
    return res.status(200).json("Purchased service saved successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error!");
  }
});

// get purchased services for business owner
router.post("/getPurchasedServices", async (req, res) => {
  const { userId } = req.body;
  try {
    const purchasedServices = await PurchasedServices.find({
      sellerId: userId,
    });
    if (!purchasedServices) {
      return res.status(404).json("No purchased services were found!");
    }
    return res.status(200).json(purchasedServices);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

// save a tour package receipt
router.post("/saveTourPackageReceipt", async (req, res) => {
  const {
    userId,
    serviceId,
    name,
    departureCity,
    destinationCity,
    bookingDate,
    departureDate,
    arrivalDate,
    tourDuration,
    hotelRoomExpensePerPerson,
    numberOfRooms,
    transportExpensePerPerson,
    numberOfSeats,
    foodPrice,
    price,
  } = req.body;
  try {
    const tourPackageReceipt = await TourPackageReceipt.create({
      userId,
      serviceId,
      name,
      departureCity,
      destinationCity,
      bookingDate,
      departureDate,
      arrivalDate,
      tourDuration,
      hotelRoomExpensePerPerson,
      numberOfRooms,
      transportExpensePerPerson,
      numberOfSeats,
      foodPrice,
      price,
    });
    return res.status(200).json("Tour package receipt saved successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error!");
  }
});

// get tour package receipts for a customer
router.post("/getTourPackageReceipts", async (req, res) => {
  const { userId } = req.body;
  try {
    const tourPackageReceipts = await TourPackageReceipt.find({
      userId: userId,
    });
    if (!tourPackageReceipts) {
      return res.status(404).json("No tour package receipt was found!");
    }
    return res.status(200).json(tourPackageReceipts);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
});

//
//
//

// EMAIL VALIDATION

router.post("/validate-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Validate email format
  if (!validator.validate(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Extract domain from email
  const domain = email.split("@")[1];
  console.log("Domain:", domain); // Log the extracted domain for debugging

  // Check if domain exists
  dns.resolve(domain, "MX", (err, addresses) => {
    if (err) {
      console.error("DNS Error:", err); // Log DNS resolution error for debugging
      return res.status(400).json({ error: "Invalid domain" });
    } else {
      console.log("MX Records:", addresses); // Log MX records for debugging
      // Email and domain are valid
      res.json({ success: true });
    }
  });
});

// router.get("/getBusinessCounts", async (req, res) => {
//   try {
//     // Fetch all business requests
//     const allBusiness = await Business.find();

//     // Group business requests by month
//     const monthlyCounts = {};
//     allBusiness.forEach(business => {
//       const month = new Date(business.createdAt).getMonth() + 1; // Extracting the month (adding 1 since month index starts from 0)
//       const year = new Date(business.createdAt).getFullYear(); // Extracting the year
//       const monthYear = `${year}-${month < 10 ? '0' + month : month}`; // Creating month-year string
//       monthlyCounts[monthYear] = monthlyCounts[monthYear] ? monthlyCounts[monthYear] + 1 : 1;
//     });

//     // Convert monthlyCounts object to an array of objects
//     const chartData = Object.entries(monthlyCounts).map(([label, value]) => ({ x: label, y: value }));

//     console.log("Monthly request counts:", chartData); // Log the monthly counts

//     res.status(200).json(chartData);
//   } catch (error) {
//     console.error("Error fetching monthly request counts:", error);
//     res.status(500).json({ message: "Internal server error!" });
//   }
// });

// router.get("/getPendingRequestCounts", async (req, res) => {
//   console.log("I am in pending");
//   try {
//       // Fetch all pending business requests
//       const pendingBusiness = await Business.find({ status: "Pending" });

//       // Group pending business requests by month
//       const monthlyCounts = {};
//       pendingBusiness.forEach(business => {
//           const month = new Date(business.createdAt).getMonth() + 1; // Extracting the month (adding 1 since month index starts from 0)
//           const year = new Date(business.createdAt).getFullYear(); // Extracting the year
//           const monthYear = `${year}-${month < 10 ? '0' + month : month}`; // Creating month-year string
//           monthlyCounts[monthYear] = monthlyCounts[monthYear] ? monthlyCounts[monthYear] + 1 : 1;
//       });

//       // Convert monthlyCounts object to an array of objects
//       const chartData = Object.entries(monthlyCounts).map(([label, value]) => ({ y: label, x: value }));

//       console.log("Monthly pending request counts:", chartData); // Log the monthly counts

//       res.status(200).json(chartData);
//   } catch (error) {
//       console.error("Error fetching monthly pending request counts:", error);
//       res.status(500).json({ message: "Internal server error!" });
//   }
// });

// router.get("/getApprovedRequestCounts", async (req, res) => {
//   console.log("I am in pending");
//   try {
//       // Fetch all pending business requests
//       const pendingBusiness = await Business.find({ status: "Approved" });

//       // Group pending business requests by month
//       const monthlyCounts = {};
//       pendingBusiness.forEach(business => {
//           const month = new Date(business.createdAt).getMonth() + 1; // Extracting the month (adding 1 since month index starts from 0)
//           const year = new Date(business.createdAt).getFullYear(); // Extracting the year
//           const monthYear = `${year}-${month < 10 ? '0' + month : month}`; // Creating month-year string
//           monthlyCounts[monthYear] = monthlyCounts[monthYear] ? monthlyCounts[monthYear] + 1 : 1;
//       });

//       // Convert monthlyCounts object to an array of objects
//       const chartData = Object.entries(monthlyCounts).map(([label, value]) => ({ y: label, x: value }));

//       console.log("Monthly pending request counts:", chartData); // Log the monthly counts

//       res.status(200).json(chartData);
//   } catch (error) {
//       console.error("Error fetching monthly pending request counts:", error);
//       res.status(500).json({ message: "Internal server error!" });
//   }
// });

// Backend route to fetch customer counts grouped by month
router.get("/getCustomerCounts", async (req, res) => {
  try {
    // Fetch all customers
    const allCustomers = await Customer.find();

    // Fetch all gold customers
    const allGoldCustomers = await Gcustomer.find();

    // Combine all customers into one array
    const allCombinedCustomers = [...allCustomers, ...allGoldCustomers];

    // Group customers by month
    const monthlyCounts = {};
    allCombinedCustomers.forEach((customer) => {
      const month = new Date(customer.createdAt).getMonth() + 1; // Extracting the month (adding 1 since month index starts from 0)
      const year = new Date(customer.createdAt).getFullYear(); // Extracting the year
      const monthYear = `${year}-${month < 10 ? "0" + month : month}`; // Creating month-year string
      monthlyCounts[monthYear] = monthlyCounts[monthYear]
        ? monthlyCounts[monthYear] + 1
        : 1;
    });

    // Convert monthlyCounts object to an array of objects
    const chartData = Object.entries(monthlyCounts).map(([label, value]) => ({
      x: label,
      y: value,
    }));

    console.log("Monthly customer counts:", chartData); // Log the monthly counts

    res.status(200).json(chartData);
  } catch (error) {
    console.error("Error fetching monthly customer counts:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

router.get("/getRequestCounts", async (req, res) => {
  try {
    // Fetch all business requests
    const allBusiness = await Business.find();

    // Group business requests by month and status (pending or approved)
    const monthlyCounts = {
      pending: {},
      approved: {},
    };

    allBusiness.forEach((business) => {
      const month = new Date(business.createdAt).getMonth() + 1; // Extracting the month (adding 1 since month index starts from 0)
      const year = new Date(business.createdAt).getFullYear(); // Extracting the year
      const monthYear = `${year}-${month < 10 ? "0" + month : month}`; // Creating month-year string

      // Increment count based on status
      if (business.status === "Pending") {
        monthlyCounts.pending[monthYear] = monthlyCounts.pending[monthYear]
          ? monthlyCounts.pending[monthYear] + 1
          : 1;
      } else if (business.status === "Approved") {
        monthlyCounts.approved[monthYear] = monthlyCounts.approved[monthYear]
          ? monthlyCounts.approved[monthYear] + 1
          : 1;
      }
    });

    // Convert monthlyCounts object to arrays of objects for pending and approved requests
    const pendingData = Object.entries(monthlyCounts.pending).map(
      ([label, value]) => ({ x: label, y: value })
    );
    const approvedData = Object.entries(monthlyCounts.approved).map(
      ([label, value]) => ({ x: label, y: value })
    );

    console.log("Monthly pending request counts:", pendingData);
    console.log("Monthly approved request counts:", approvedData);

    res.status(200).json({ pendingData, approvedData });
  } catch (error) {
    console.error("Error fetching monthly request counts:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

// send mail to recipient
router.post("/sendMail", async (req, res) => {
  const { to, name, subject, body } = req.body;
  await sendMail({
    to,
    name,
    subject,
    body,
  });
});

// get single tour package
router.post("/getSingleTourPackage", async (req, res) => {
  const { serviceId } = req.body;
  try {
    const tourPackage = await TourPackage.findOne({ _id: serviceId });
    if (!tourPackage) {
      return res.status(404).json("No tour package found!");
    }
    return res.status(200).json(tourPackage);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// update account
router.post("/updateAccount", async (req, res) => {
  const { userId, username, email, gender } = req.body;
  console.log(req.body);
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: userId },
      {
        username,
        email,
        gender,
      }
    );
    if (customer) {
      console.log("account updated successfully!");
      return res.status(200).json("User account updated successfully!");
    }
    const gcustomer = await Gcustomer.findOneAndUpdate(
      { _id: userId },
      {
        username,
        email,
        gender,
      }
    );
    if (gcustomer) {
      console.log("account updated successfully!");
      return res
        .status(200)
        .json("Gold customer account updated successfully!");
    }
    const gbusiness = await GBusiness.findOneAndUpdate(
      { _id: userId },
      {
        username,
        email,
        gender,
      }
    );
    if (gbusiness) {
      console.log("account updated successfully!");
      return res.status(200).json("User account updated successfully!");
    }
    return res.status(404).json("User not found!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// save to favorites
router.post("/saveToFavorites", async (req, res) => {
  const {
    userId,
    username,
    serviceId,
    serviceName,
    city,
    province,
    country,
    serviceType,
  } = req.body;
  try {
    await Favorite.create({
      userId,
      username,
      serviceId,
      city,
      province,
      country,
      serviceName,
      serviceType,
    });
    return res.status(200).json("Added successfully to favorites!");
  } catch (error) {
    console.log(serviceName);
    return res.status(500).json(error);
  }
});

// get specific faovrites of a customer
router.post("/getFavorites", async (req, res) => {
  const { userId, serviceId } = req.body;
  try {
    const favorites = await Favorite.find({ userId, serviceId });
    if (!favorites) {
      return res
        .status(404)
        .json("No favorites found for the given customer id!");
    }
    return res.status(200).json(favorites);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// get all faovrites of a customer
router.post("/getAllFavorites", async (req, res) => {
  const { userId } = req.body;
  try {
    const favorites = await Favorite.find({ userId });
    if (!favorites) {
      return res
        .status(404)
        .json("No favorites found for the given customer id!");
    }
    return res.status(200).json(favorites);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// unfavorite a service by customer
router.post("/unfavorite", async (req, res) => {
  const { userId, serviceId } = req.body;
  try {
    const favorites = await Favorite.findOneAndDelete({ userId, serviceId });
    if (!favorites) {
      return res
        .status(404)
        .json("No favorites found for the given customer id!");
    }
    return res.status(200).json(favorites);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// book a restaurant
router.post("/bookRestaurant", async (req, res) => {
  const {
    sellerId,
    sellerName,
    buyerId,
    buyerName,
    serviceId,
    serviceName,
    buyerEmail,
    sellerEmail,
    amountPaid,
    businessName,
    cuisine,
    city,
    province,
    country,
    averageFoodRate,
    contact,
    customerContact,
    openingTime,
    closingTime,
    reservationDate,
    reservationTime,
    reservationCharges,
    bookingDate,
    status,
  } = req.body;
  try {
    await RestaurantBooking.create({
      sellerId,
      sellerName,
      buyerId,
      buyerName,
      serviceId,
      serviceName,
      buyerEmail,
      sellerEmail,
      amountPaid,
      businessName,
      cuisine,
      city,
      province,
      country,
      averageFoodRate,
      contact,
      customerContact,
      openingTime,
      closingTime,
      reservationDate,
      reservationTime,
      reservationCharges,
      bookingDate,
      status,
    });
    return res.status(200).json("Restaurant booking saved successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error!");
  }
});

// book accommodation
router.post("/bookAccommodation", async (req, res) => {
  const {
    buyerId,
    sellerId,
    serviceId,
    serviceName,
    buyerName,
    sellerName,
    buyerEmail,
    sellerEmail,
    amountPaid,
    businessName,
    contact,
    customerContact,
    city,
    province,
    country,
    amenities,
    hotelRoomExpensePerPerson,
    numberOfRooms,
    bookingDate,
    reservationDate,
    reservationTime,
    status,
  } = req.body;
  try {
    await AccommodationBooking.create({
      buyerId,
      sellerId,
      serviceId,
      serviceName,
      buyerName,
      sellerName,
      buyerEmail,
      sellerEmail,
      amountPaid,
      businessName,
      contact,
      customerContact,
      city,
      province,
      country,
      amenities,
      hotelRoomExpensePerPerson,
      numberOfRooms,
      bookingDate,
      reservationDate,
      reservationTime,
      status,
    });
    return res.status(200).json("Accommodation booking saved successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error!");
  }
});

// book transport
router.post("/bookTransport", async (req, res) => {
  const {
    buyerId,
    sellerId,
    serviceId,
    serviceName,
    buyerName,
    sellerName,
    buyerEmail,
    sellerEmail,
    amountPaid,
    businessName,
    seatPricePerPerson,
    numberOfSeats,
    amenities,
    city,
    province,
    country,
    contact,
    customerContact,
    transportType,
    dropOffLocation,
    bookingDate,
    reservationDate,
    reservationTime,
    status,
  } = req.body;
  try {
    await TransportBooking.create({
      buyerId,
      sellerId,
      serviceId,
      serviceName,
      buyerName,
      sellerName,
      buyerEmail,
      sellerEmail,
      amountPaid,
      businessName,
      seatPricePerPerson,
      numberOfSeats,
      amenities,
      city,
      province,
      country,
      contact,
      customerContact,
      transportType,
      dropOffLocation,
      bookingDate,
      reservationDate,
      reservationTime,
      status,
    });
    return res.status(200).json("Transport booking saved successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error!");
  }
});

// book tour package
router.post("/bookTourPackage", async (req, res) => {
  const {
    buyerId,
    sellerId,
    serviceId,
    buyerName,
    sellerName,
    serviceName,
    buyerEmail,
    sellerEmail,
    amountPaid,
    sellerContact,
    buyerContact,
    departureDate,
    arrivalDate,
    summary,
    inclusions,
    exclusions,
    hotelCompanyName,
    hotelRoomExpensePerPerson,
    transportExpensePerPerson,
    foodPricePerPerson,
    numberOfRooms,
    numberOfSeats,
    price,
    destination,
    province,
    country,
    departureCity,
    breakfast,
    lunch,
    dinner,
    foodPrice,
    transportType,
    status,
    city,
    tourDuration,
    businessName,
    imageUrls,
    isTransportAvailed,
    isAccommodationAvailed,
    numberOfPeople,
  } = req.body;
  try {
    await TourPackageBooking.create({
      buyerId,
      sellerId,
      serviceId,
      buyerName,
      sellerName,
      serviceName,
      buyerEmail,
      sellerEmail,
      amountPaid,
      sellerContact,
      buyerContact,
      departureDate,
      arrivalDate,
      summary,
      inclusions,
      exclusions,
      hotelCompanyName,
      hotelRoomExpensePerPerson,
      transportExpensePerPerson,
      foodPricePerPerson,
      numberOfRooms,
      numberOfSeats,
      price,
      destination,
      province,
      country,
      departureCity,
      breakfast,
      lunch,
      dinner,
      foodPrice,
      transportType,
      status,
      city,
      tourDuration,
      businessName,
      imageUrls,
      isTransportAvailed,
      isAccommodationAvailed,
      numberOfPeople,
    });
    return res.status(200).json("Tour package booking saved successfully!");
  } catch (error) {
    console.log(req.body);
    console.log(error);
    return res.status(500).json("Internal server error!");
  }
});

// update tour package booking of hotel
router.post("/updateTpBookingHotel", async (req, res) => {
  const { _id, isAccommodationAvailed, numberOfRooms, amountPaid } = req.body;
  try {
    const tpBooking = await TourPackageBooking.findOneAndUpdate(
      { _id },
      {
        isAccommodationAvailed,
        numberOfRooms,
        amountPaid,
      }
    );
    if (!tpBooking) {
      return res
        .status(404)
        .json("Tour package booking was not found with the given id!");
    }
    return res.status(200).json("Tour package booking updated successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// update tour package booking of transport
router.post("/updateTpBookingTransport", async (req, res) => {
  const { _id, isTransportAvailed, numberOfSeats, amountPaid } = req.body;
  try {
    const tpBooking = await TourPackageBooking.findOneAndUpdate(
      { _id },
      {
        isTransportAvailed,
        numberOfSeats,
        amountPaid,
      }
    );
    if (!tpBooking) {
      return res
        .status(404)
        .json("Tour package booking was not found with the given id!");
    }
    return res.status(200).json("Tour package booking updated successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// updating the respective payments when user avails hotel or transport of tour package booking
router.post("/updatePaymentAfterAvailing", async (req, res) => {
  const { userId, serviceId, amountPaid } = req.body;
  console.log(req.body);
  try {
    await Payment.findOneAndUpdate(
      { userId, serviceId },
      { amount: amountPaid }
    );
    return res.status(200).json("Payment updated successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// upload profile picture of a customer
router.post("/uploadProfilePicture", async (req, res) => {
  const { userId, profilePicture } = req.body;
  console.log("Profile Picture data:");
  console.log(req.body);
  try {
    const customer = await ProfilePicture.findOneAndUpdate(
      { userId },
      { profilePicture }
    );
    if (!customer) {
      // if profile picture doesn't exist already to be updated
      await ProfilePicture.create({ userId, profilePicture });
    }
    return res.status(200).json("Profile picture uploaded successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// get profile picture of the customer
router.post("/getProfilePicture", async (req, res) => {
  const { userId } = req.body;
  try {
    const customer = await ProfilePicture.findOne({ userId });
    if (!customer) {
      return res.status(404).json("Profile picture not found!");
    }
    return res.status(200).json(customer);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// verify email
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Customer.findById(decoded.id);
    if (user) {
      user.isVerified = true;
      await user.save();
      return res.status(200).json("Email verified successfully!");
    }
    const buser = await BusinessOwner.findById(decoded.id);
    if (buser) {
      buser.isVerified = true;
      await buser.save();
      return res.status(200).json("Email verified successfully!");
    }
    return res.status(404).json("User not found!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// cancel tour package booking
router.post("/cancelTourPackageBooking", async (req, res) => {
  const { id } = req.body;
  try {
    const tourPackageBooking = await TourPackageBooking.findOneAndDelete({
      _id: id,
    });
    if (!tourPackageBooking) {
      return res.status(404).json("Tour package booking not found!");
    }
    return res.status(200).json("Tour package booking cancelled successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// cancel accommodation booking
router.post("/cancelAccommodationBooking", async (req, res) => {
  const { id } = req.body;
  try {
    const accommodationBooking = await AccommodationBooking.findOneAndDelete({
      _id: id,
    });
    if (!accommodationBooking) {
      return res.status(404).json("Accommodation booking not found!");
    }
    return res
      .status(200)
      .json("Accommodation booking cancelled successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// cancel transport booking
router.post("/cancelTransportBooking", async (req, res) => {
  const { id } = req.body;
  try {
    const transportBooking = await TransportBooking.findOneAndDelete({
      _id: id,
    });
    if (!transportBooking) {
      return res.status(404).json("Transport booking not found!");
    }
    return res.status(200).json("Transport booking cancelled successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// cancel restaurant booking
router.post("/cancelRestaurantBooking", async (req, res) => {
  const { id } = req.body;
  try {
    const restaurantBooking = await RestaurantBooking.findOneAndDelete({
      _id: id,
    });
    if (!restaurantBooking) {
      return res.status(404).json("Restaurant booking not found!");
    }
    return res.status(200).json("Restaurant booking cancelled successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// delete respective payment when booking is cancelled
router.post("/deletePayment", async (req, res) => {
  const { userId, serviceId } = req.body;
  try {
    const payment = await Payment.findOneAndDelete({
      userId,
      serviceId,
    });
    if (!payment) {
      return res.status(404).json("Payment not found!");
    }
    return res.status(200).json("Payment deleted successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// post complaint
router.post("/postComplaint", async (req, res) => {
  const { userId, username, email, complaint } = req.body;
  try {
    await Complaint.create({ userId, username, email, complaint });
    return res.status(200).json("Complaint posted successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// get all complaints
router.get("/getAllComplaints", async (req, res) => {
  try {
    const complaints = await Complaint.find({});
    return res.status(200).json(complaints);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// verify if admin exists
router.post("/verifyAdmin", async (req, res) => {
  const { email } = req.body; // Change id to email
  console.log(req.body);
  try {
    const admin = await Admin.findOne({ email }); // Use findOne and search by email
    if (!admin) {
      return res.status(404).json("Admin not found!");
    }
    return res.status(200).json("Admin verified successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// getting reviews of a service
router.post("/getServiceReviews", async (req, res) => {
  const { serviceId } = req.body;
  console.log(serviceId);
  try {
    const reviews = await Review.find({ serviceId });
    return res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// disabling the tour packages whose departure dates have passed
// Schedule a job to run every day at 12:00 AM
cron.schedule("0 0 * * *", async () => {
  try {
    // Find all tour packages
    const tourPackages = await TourPackage.find();

    // Loop through each tour package
    for (const tourPackage of tourPackages) {
      // Check if the departure date is behind the current date
      if (tourPackage.departureDate < new Date().toISOString().slice(0, 10)) {
        // Update the status of the tour package to 'deactivated'
        await TourPackage.findByIdAndUpdate(tourPackage._id, {
          status: "deactivated",
        });
        console.log(
          `Tour package with ID ${tourPackage._id} has been deactivated.`
        );
      }
    }
  } catch (error) {
    console.error("Error checking tour package departure dates:", error);
  }
});

// get all users for admin
router.get("/getAllUsers", async (req, res) => {
  try {
    const users = await Customer.find({});
    const gusers = await Gcustomer.find({});
    const gbusers = await GBusiness.find({});
    const allUsers = users.concat(gusers).concat(gbusers);
    res.json(allUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// get all services
router.get("/getAllServices", async (req, res) => {
  try {
    const tourPackages = await TourPackage.find({});
    const accommodations = await Acc.find({});
    const transports = await Transport.find({});
    const restaurants = await Restaurant.find({});
    const allServices = tourPackages
      .concat(accommodations)
      .concat(transports)
      .concat(restaurants);
    res.json(allServices);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// activate tour package if its userId is found, else activate restaurant, else activate accommodation, else activate transport
router.post("/activateService", async (req, res) => {
  const { userId, serviceId } = req.body;
  try {
    const tourPackage = await TourPackage.findOne({ userId, _id: serviceId });
    if (tourPackage) {
      tourPackage.status = "Approved";
      await tourPackage.save();
      return res.status(200).json("Tour package activated successfully!");
    }
    const restaurant = await Restaurant.findOne({
      userId,
      _id: serviceId,
    });
    if (restaurant) {
      restaurant.status = "Approved";
      await restaurant.save();
      return res.status(200).json("Restaurant activated successfully!");
    }
    const accommodation = await Acc.findOne({
      userId,
      _id: serviceId,
    });
    if (accommodation) {
      accommodation.status = "Approved";
      await accommodation.save();
      return res.status(200).json("Accommodation activated successfully!");
    }
    const transport = await Transport.findOne({
      userId,
      _id: serviceId,
    });
    if (transport) {
      transport.status = "Approved";
      await transport.save();
      return res.status(200).json("Transport activated successfully!");
    }
    return res.status(404).json("Service not found!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// similarly deactivate
router.post("/deactivateService", async (req, res) => {
  const { userId, serviceId } = req.body;
  try {
    const tourPackage = await TourPackage.findOne({ userId, _id: serviceId });
    if (tourPackage) {
      tourPackage.status = "deactivated";
      await tourPackage.save();
      return res.status(200).json("Tour package deactivated successfully!");
    }
    const restaurant = await Restaurant.findOne({
      userId,
      _id: serviceId,
    });
    if (restaurant) {
      restaurant.status = "deactivated";
      await restaurant.save();
      return res.status(200).json("Restaurant deactivated successfully!");
    }
    const accommodation = await Acc.findOne({
      userId,
      _id: serviceId,
    });
    if (accommodation) {
      accommodation.status = "deactivated";
      await accommodation.save();
      return res.status(200).json("Accommodation deactivated successfully!");
    }
    const transport = await Transport.findOne({
      userId,
      _id: serviceId,
    });
    if (transport) {
      transport.status = "deactivated";
      await transport.save();
      return res.status(200).json("Transport deactivated successfully!");
    }
    return res.status(404).json("Service not found!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// get deactivated tour packages of a user
router.post("/getDeactivatedTourPackages", async (req, res) => {
  const { userId } = req.body;
  try {
    const tourPackages = await TourPackage.find({
      userId,
      status: "deactivated",
    });
    res.json(tourPackages);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

module.exports = router;
