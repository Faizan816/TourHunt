import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  VStack,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import Layout from "../components/layout";
import { useEffect, useState } from "react";
import formatTimeToAMPM from "../components/formatTime";
import { useRouter } from "next/router";
import { FaPhone } from "react-icons/fa";
import axios from "axios";
import Map from "../components/map/map";

export default function Restaurant() {
  const [reservationDate, setReservationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [reservationTime, setReservationTime] = useState("00:00");
  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [r, setR] = useState();
  const router = useRouter();
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

    setR(JSON.parse(localStorage.getItem("currentService")).service);
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
    const rResponse = await axios.post(
      "http://localhost:8000/getRestaurantBookings",
      { userId }
    );
    const restaurantBookings = rResponse.data;
    let flag = false;
    restaurantBookings.forEach((booking) => {
      if (
        booking.serviceId === r._id &&
        booking.reservationDate === reservationDate
      ) {
        flag = true;
      }
    });
    if (flag) {
      toast({
        title: "This restaurant is already booked for the selected date.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    localStorage.setItem("paymentPrice", r.reservationCharges);
    localStorage.setItem("reservationDate", reservationDate);
    localStorage.setItem("reservationTime", reservationTime);
    localStorage.setItem("bookingDate", bookingDate);
    localStorage.setItem("customerContact", customerContact);
    router.push("../bookings/payment");
  };

  console.log(reservationTime);

  return (
    <Layout>
      <Box w="100%" display="flex" alignItems="center">
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
        <Box borderRadius="10px" mt="40px" p="20px" w="60%" bg="#143E56">
          <Heading textAlign="center" size="md" letterSpacing={1}>
            Restaurant
          </Heading>
          {r && (
            <VStack justifyContent="flex-start" alignItems="flex-start">
              <Stack
                fontSize="smaller"
                alignItems="center"
                direction={["column", "row"]}
                w="100%"
              >
                {currentlyActive !== "Images" && (
                  <Image
                    src={r.imageUrls[0] || "/images/Paris Restaurant.jpg"}
                    w="300px"
                    borderRadius="10px"
                  />
                )}
                <Grid
                  letterSpacing={1}
                  templateColumns="repeat(2,1fr)"
                  gap="1px"
                >
                  <GridItem>
                    <Text fontWeight="500">Name:</Text>
                  </GridItem>
                  <GridItem>
                    <Text>{r.name}</Text>
                  </GridItem>
                  <GridItem fontWeight="500">
                    <Text>Location::</Text>
                  </GridItem>
                  <GridItem>
                    <Text>{r.city + ", " + r.province + ", " + r.country}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontWeight="500">Average Food Rate:</Text>
                  </GridItem>
                  <GridItem>
                    <Text>Rs.{r.averageFoodRate}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontWeight="500">Cuisine:</Text>
                  </GridItem>
                  <GridItem>{r.cuisine}</GridItem>
                  <GridItem>
                    <Text fontWeight="500">Opening Hours:</Text>
                  </GridItem>
                  <GridItem>
                    <Text>
                      {formatTimeToAMPM(r.openingTime) +
                        "-" +
                        formatTimeToAMPM(r.closingTime)}
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Text fontWeight="500">Reservation:</Text>
                  </GridItem>
                  <GridItem>
                    <Text>{r.reservation}</Text>
                  </GridItem>
                  {r.reservation === "Available" && (
                    <>
                      <GridItem>
                        <Text fontWeight="500">Reservation Charges:</Text>
                      </GridItem>
                      <GridItem>
                        <Text>{r.reservationCharges}</Text>
                      </GridItem>
                    </>
                  )}
                  <GridItem>
                    <Text fontWeight="500">Contact:</Text>
                  </GridItem>
                  <GridItem>
                    <Text>{r.contact}</Text>
                  </GridItem>
                </Grid>
              </Stack>
              {currentlyActive === "Images" && (
                <Box>
                  <Heading size="md" mt={4} mb={4}>
                    Images
                  </Heading>
                  {r.imageUrls && r.imageUrls.length > 0 ? (
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
                      gap={4}
                      overflow="auto"
                    >
                      {r.imageUrls.map((imageUrl, index) => (
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
                  <Map service={r} />
                </>
              )}
              <Text fontSize="sm">Select date for reservation:</Text>
              <Input
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
                type="date"
                padding="10px"
                borderRadius="10px"
                min={bookingDate}
              />
              <Text fontSize="sm">Select time for reservation:</Text>
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
              <HStack mt="10px" w="100%" justifyContent="center">
                <Button
                  onClick={handleBookNow}
                  bg="#2A656D"
                  color="white"
                  size="sm"
                  _hover={{ opacity: 0.5 }}
                >
                  Book Now
                </Button>
              </HStack>
            </VStack>
          )}
        </Box>
      </Box>
    </Layout>
  );
}
