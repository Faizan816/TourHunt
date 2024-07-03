import { useState, useEffect } from "react";
import Layout from "../components/layout";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaPhone } from "react-icons/fa";
import axios from "axios";
import Map from "../components/map/map";

export default function Accommodation() {
  const [rooms, setRooms] = useState(1);
  const [a, setA] = useState();
  const router = useRouter();
  const [reservationDate, setReservationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [reservationTime, setReservationTime] = useState("00:00");
  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [customerContact, setCustomerContact] = useState("");
  const toast = useToast();
  const [currentlyActive, setCurrentlyActive] = useState("Overview");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // checking if the currentService is available
    if (!localStorage.getItem("currentService")) {
      router.push("../results");
      return;
    }

    const getReviews = async () => {
      const response = await axios.post(
        `http://localhost:8000/getServiceReviews`,
        {
          serviceId: JSON.parse(localStorage.getItem("currentService")).service
            ._id,
        }
      );
      setReviews(response.data);
    };
    getReviews();

    setA(JSON.parse(localStorage.getItem("currentService")).service);
    console.log(JSON.parse(localStorage.getItem("currentService")).service);
  }, []);

  // useEffect which removes currentService when back button is pressed
  useEffect(() => {
    const handlePopState = (event) => {
      // Check if the user is navigating back
      if (event.type === "popstate") {
        // Remove the "currentService" item from localStorage
        localStorage.removeItem("currentService");
      }
    };

    // Add the event listener
    window.addEventListener("popstate", handlePopState);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleBookNow = async () => {
    if (customerContact === "") {
      toast({
        title: "Please enter your contact number.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if (customerContact.length < 11) {
      toast({
        title: "Contact number must be 11 digits.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    // checking if booking is already done
    const email = localStorage.getItem("currentUser");
    const userResponse = await axios.post(
      "http://127.0.0.1:8000/findUserUsingEmail",
      { email: email }
    );
    const userId = userResponse.data._id;
    const aResponse = await axios.post(
      "http://localhost:8000/getAccommodationBookings",
      { userId }
    );
    const accommodationBookings = aResponse.data;
    console.log(accommodationBookings);
    let flag = false;
    accommodationBookings.forEach((booking) => {
      if (
        booking.serviceId === a._id &&
        booking.reservationDate === reservationDate
      ) {
        flag = true;
      }
    });
    if (flag) {
      toast({
        title: "This accommodation is already booked for the selected date.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    localStorage.setItem("reservationDate", reservationDate);
    localStorage.setItem("reservationTime", reservationTime);
    localStorage.setItem("bookingDate", bookingDate);
    localStorage.setItem("paymentPrice", a.hotelRoomExpensePerPerson * rooms);
    localStorage.setItem("numberOfRooms", rooms);
    localStorage.setItem("customerContact", customerContact);
    router.push("../bookings/payment");
  };

  // Helper function to capitalize the first character
  const capitalizeFirstChar = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Layout>
      {a && (
        <div
          style={{
            borderRadius: 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: "2%",
            letterSpacing: 1,
            fontSize: "medium",
          }}
        >
          <Grid
            mt="0px"
            w="20%"
            textAlign="center"
            templateColumns="repeat(1, 1fr)"
            gap={0.5}
            ml="20px"
            mr="20px"
            // display="none"
          >
            <Text
              w="100%"
              cursor="pointer"
              _hover={{ opacity: 0.5 }}
              bg="#143E56"
              pt="10px"
              p="15px 35px"
              onClick={() => setCurrentlyActive("Overview")}
              opacity={currentlyActive === "Overview" ? 0.5 : 1}
            >
              Overview
            </Text>
            <Text
              cursor="pointer"
              _hover={{ opacity: 0.5 }}
              bg="#143E56"
              pt="10px"
              p="15px 25px"
              onClick={() => setCurrentlyActive("Images")}
              opacity={currentlyActive === "Images" ? 0.5 : 1}
            >
              Images
            </Text>
            <Text
              cursor="pointer"
              _hover={{ opacity: 0.5 }}
              bg="#143E56"
              pt="10px"
              p="15px 25px"
              onClick={() => setCurrentlyActive("Map")}
              opacity={currentlyActive === "Map" ? 0.5 : 1}
            >
              Map
            </Text>
            <Text
              cursor="pointer"
              _hover={{ opacity: 0.5 }}
              bg="#143E56"
              pt="10px"
              p="15px 25px"
              onClick={() => setCurrentlyActive("Reviews")}
              opacity={currentlyActive === "Reviews" ? 0.5 : 1}
            >
              Reviews
            </Text>
          </Grid>
          <div style={{ backgroundColor: "#143E56", borderRadius: 10 }}>
            <div>
              {currentlyActive !== "Images" && (
                <img
                  style={{ height: 400, width: 680, borderRadius: 10 }}
                  src={a.imageUrls[0] || "/images/AccommodatorGuestHouse.jpg"}
                />
              )}
            </div>
            <Box p="20px">
              <div>
                <p style={{ fontWeight: "bold", fontSize: 20 }}>{a.name}</p>
              </div>
              <Grid mt="10px" templateColumns="repeat(2,1fr)" gap="1px">
                <p>Location: </p>
                <p>
                  {capitalizeFirstChar(a.city) +
                    ", " +
                    capitalizeFirstChar(a.province)}
                </p>
                <p>Owner:</p>
                <p>{a.businessName}</p>
                <p>Contact:</p>
                <p>{a.contact}</p>
                <p>Room price per person: </p>
                <p>Rs.{a.hotelRoomExpensePerPerson}</p>
                <p>Number of rooms you want:</p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "70px",
                  }}
                >
                  <img
                    onClick={() => {
                      if (rooms !== 1) setRooms(rooms - 1);
                    }}
                    src="/images/minus.png"
                    style={{ width: 10, height: 10 }}
                  />
                  <p>{rooms}</p>
                  <img
                    onClick={() => {
                      if (rooms < 2) setRooms(rooms + 1);
                    }}
                    src="/images/plus.png"
                    style={{ width: 10, height: 10 }}
                  />
                </div>
                <p>Your total bill will be:</p>
                <p>Rs.{a.hotelRoomExpensePerPerson * rooms}</p>
              </Grid>
              {currentlyActive === "Images" && (
                <Box>
                  <Heading size="md" mt={4} mb={4}>
                    Images
                  </Heading>
                  {a.imageUrls && a.imageUrls.length > 0 ? (
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
                      gap={4}
                      overflow="auto"
                    >
                      {a.imageUrls.map((imageUrl, index) => (
                        <Box
                          key={index}
                          borderWidth={1}
                          borderRadius="md"
                          overflow="hidden"
                        >
                          <img
                            src={imageUrl}
                            alt={`Image ${index + 1}`}
                            style={{ width: "100%", height: "auto" }}
                          />
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box>No images available</Box>
                  )}
                </Box>
              )}
              {currentlyActive === "Reviews" && (
                <Box>
                  <Heading size="md" mb={4}>
                    Reviews
                  </Heading>
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <Box
                        key={index}
                        borderWidth={1}
                        borderRadius="md"
                        p={4}
                        mb={4}
                      >
                        <Text fontWeight="bold">Review by: {review.email}</Text>
                        <Text>Comment: {review.comment}</Text>
                        <Text>
                          Rating:
                          {[...Array(5)].map((_, i) => (
                            <Text
                              fontSize="sm"
                              key={i}
                              className={
                                i < review.rating
                                  ? "fa fa-star rated gold"
                                  : "fa fa-star not-rated"
                              }
                            ></Text>
                          ))}
                        </Text>
                      </Box>
                    ))
                  ) : (
                    <Box>No reviews available</Box>
                  )}
                </Box>
              )}
              {currentlyActive === "Map" && (
                <>
                  <Heading size="md">Map</Heading>
                  <Map service={a} />
                </>
              )}
              <Text fontWeight="bold" mt="10px" fontSize="sm">
                Select date for reservation:
              </Text>
              <Input
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
                type="date"
                padding="10px"
                borderRadius="10px"
                min={bookingDate}
              />
              <Text fontWeight="bold" mt="10px" fontSize="sm">
                Select time for reservation:
              </Text>
              <Input
                value={reservationTime}
                onChange={(e) => setReservationTime(e.target.value)}
                type="time"
                padding="10px"
                borderRadius="10px"
              />
              <FormControl isRequired mt="10px">
                <FormLabel fontWeight="bold">Contact:</FormLabel>
                <InputGroup>
                  <Input
                    borderRadius="10px"
                    padding="10px"
                    placeholder="03135068731"
                    size="md"
                    value={customerContact}
                    onChange={(e) => {
                      if (customerContact.length < 11)
                        setCustomerContact(e.target.value);
                      if (e.nativeEvent.inputType === "deleteContentBackward") {
                        console.log("Backspace pressed");
                        setCustomerContact(e.target.value);
                      }
                    }}
                    type="number"
                  />
                  <InputRightElement>
                    <Icon as={FaPhone} />
                  </InputRightElement>
                </InputGroup>
                <FormHelperText color="white" fontSize="small">
                  Kindly enter your contact number
                </FormHelperText>
              </FormControl>
              <div style={{ marginTop: 20 }}>
                <Button
                  onClick={handleBookNow}
                  bg="#2A656D"
                  color="white"
                  _hover={{ opacity: 0.5 }}
                >
                  Book Now
                </Button>
              </div>
            </Box>
          </div>
          <div></div>
        </div>
      )}
    </Layout>
  );
}
