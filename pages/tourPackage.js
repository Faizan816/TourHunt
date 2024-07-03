import { useRouter } from "next/router";
import Layout from "../components/layout";
import styles from "../styles/TourPackage.module.css";
import { useEffect, useState } from "react";
import {
  Button,
  HStack,
  MenuButton,
  Switch,
  Text,
  VStack,
  Grid,
  GridItem,
  Box,
  Input,
  useToast,
  UnorderedList,
  List,
  ListItem,
  FormControl,
  FormLabel,
  InputRightElement,
  InputGroup,
  Icon,
  FormHelperText,
  Heading,
} from "@chakra-ui/react";
import { FaPhone } from "react-icons/fa";
import axios from "axios";
import Map from "../components/map/map";

export default function TourPackage() {
  const [isFood, setIsFood] = useState(false);
  const [isTransport, setIsTransport] = useState(true);
  const [isTransportAvailed, setIsTransportAvailed] = useState(true);
  const [isAccommodation, setIsAccommodation] = useState(true);
  const [isAccommodationAvailed, setIsAccommodationAvailed] = useState(true);
  const [isBill, setIsBill] = useState(false);
  const [rooms, setRooms] = useState(1);
  const [seats, setSeats] = useState(1);
  const router = useRouter();
  const [tp, setTp] = useState();
  const [currentlyActive, setCurrentlyActive] = useState("Overview");
  const [departureDate, setDepartureDate] = useState("");
  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [tourDuration, setTourDuration] = useState(0);
  const [contact, setContact] = useState("");
  const toast = useToast();
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [reviews, setReviews] = useState([]);

  // const calculateArrivalDate = (selectedDate) => {
  //   const arrivalDate = new Date(selectedDate); // Create a new Date object based on selectedDate
  //   arrivalDate.setDate(arrivalDate.getDate() + tourDuration); // Add 4 days to the selectedDate
  //   return arrivalDate.toISOString().split("T")[0]; // Convert arrivalDate to "yyyy-mm-dd" format
  // };
  // const [arrivalDate, setArrivalDate] = useState("");

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

    setTp(JSON.parse(localStorage.getItem("currentService")).service);
    setTourDuration(
      JSON.parse(localStorage.getItem("currentService")).service.tourDuration
    );

    // console.log(JSON.parse(localStorage.getItem("currentService")).service);

    return () => {
      localStorage.removeItem("currentlyActive");
    };
  }, []);
  console.log(tp);

  useEffect(() => {
    localStorage.setItem("currentlyActive", currentlyActive);
  }, [currentlyActive]);

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

  function calculateTotal() {
    let sum = 0;
    sum +=
      isAccommodationAvailed &&
      parseFloat(tp.hotelRoomExpensePerPerson) * rooms;
    sum +=
      isTransportAvailed && parseFloat(tp.transportExpensePerPerson) * seats;
    sum += parseFloat(tp.foodPrice) * numberOfPeople;

    return sum;
  }

  const handleNumberOfPeopleChange = (value) => {
    setNumberOfPeople(value);
    isTransportAvailed && setSeats(value);
    isAccommodationAvailed && setRooms(value);
  };

  const capitalizeFirstChar = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleBookNow = async () => {
    if (contact === "") {
      toast({
        title: "Please enter your contact number.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if (contact.length < 11) {
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
    const tpResponse = await axios.post(
      "http://localhost:8000/getTourPackageBookings",
      { userId }
    );
    const tpBookings = tpResponse.data;
    for (let i = 0; i < tpBookings.length; i++) {
      if (
        tpBookings[i].serviceId === tp._id &&
        tpBookings[i].departureCity === tp.departureCity &&
        tpBookings[i].city === tp.city &&
        tpBookings[i].departureDate === tp.departureDate
      ) {
        toast({
          title: "This tour package is already booked by you.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        return;
      }
    }

    localStorage.setItem(
      "tpReceipt",
      JSON.stringify({
        userId,
        name: tp.name,
        departureCity: tp.departureCity,
        destinationCity: tp.city,
        departureDate: tp.departureDate,
        arrivalDate: tp.arrivalDate,
        summary: tp.summary,
        bookingDate,
        tourDuration,
        hotelRoomExpensePerPerson:
          isAccommodationAvailed && tp.hotelRoomExpensePerPerson,
        numberOfRooms: isAccommodationAvailed && rooms,
        numberOfSeats: isTransportAvailed && seats,
        transportExpensePerPerson:
          isTransportAvailed && tp.transportExpensePerPerson,
        foodPrice: tp.foodPrice,
        price: calculateTotal(),
      })
    );
    localStorage.setItem("paymentPrice", calculateTotal());
    localStorage.setItem("customerContact", contact);
    localStorage.setItem("numberOfSeats", seats);
    localStorage.setItem("numberOfRooms", rooms);
    localStorage.setItem("isAccommodationAvailed", isAccommodationAvailed);
    localStorage.setItem("isTransportAvailed", isTransportAvailed);
    localStorage.setItem("numberOfPeople", numberOfPeople);
    router.push("../bookings/payment");
  };

  return (
    <Layout>
      {tp && (
        <HStack alignItems="flex-start">
          <Grid
            mt="200px"
            w="20%"
            textAlign="center"
            templateColumns="repeat(1, 1fr)"
            gap={0.5}
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
              onClick={() => setCurrentlyActive("Inclusions")}
              opacity={currentlyActive === "Inclusions" ? 0.5 : 1}
            >
              Inclusions
            </Text>
            <Text
              cursor="pointer"
              _hover={{ opacity: 0.5 }}
              bg="#143E56"
              pt="10px"
              p="15px 25px"
              onClick={() => setCurrentlyActive("Exclusions")}
              opacity={currentlyActive === "Exclusions" ? 0.5 : 1}
            >
              Exclusions
            </Text>
            <Text
              cursor="pointer"
              _hover={{ opacity: 0.5 }}
              bg="#143E56"
              pt="10px"
              p="15px 25px"
              onClick={() => setCurrentlyActive("Summary")}
              opacity={currentlyActive === "Summary" ? 0.5 : 1}
            >
              Summary
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
              onClick={() => setCurrentlyActive("Reviews")}
              opacity={currentlyActive === "Reviews" ? 0.5 : 1}
            >
              Reviews
            </Text>
          </Grid>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "57%",
              // marginLeft: "200px",
              backgroundColor: "#1F516D",
              fontSize: "small",
            }}
          >
            <div
              style={{
                backgroundColor: "#143E56",
                marginTop: "2%",
                padding: 30,
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div style={{ paddingRight: 40 }}>
                  <img
                    src={tp.imageUrls[0] || "/images/Murree.jpg"}
                    style={{ height: 270, borderRadius: 10 }}
                  />
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ padding: 5 }}>
                    <p>
                      <b>Company: {tp.businessName}</b>
                    </p>
                  </div>
                  <div style={{ padding: 5 }}>
                    <p>
                      <b>Package Name: </b>
                      {tp.name}
                    </p>
                  </div>
                  <div style={{ padding: 5 }}>
                    <p>
                      Departure City: {capitalizeFirstChar(tp.departureCity)}
                    </p>
                  </div>
                  <div style={{ padding: 5 }}>
                    <p>
                      Destination:{" "}
                      {capitalizeFirstChar(tp.destination) +
                        ", " +
                        capitalizeFirstChar(tp.city) +
                        ", " +
                        capitalizeFirstChar(tp.province)}
                    </p>
                  </div>
                  <div style={{ padding: 5 }}>
                    <p>
                      <b>Tour Duration: </b>
                      {tourDuration} days
                    </p>
                  </div>
                  <div style={{ padding: 5 }}>
                    <p>Price: Rs.{calculateTotal()}</p>
                  </div>
                  <div style={{ padding: 5 }}>
                    <p>Contact: {tp.contact}</p>
                  </div>
                </div>
              </div>
              <div style={{ paddingTop: 20, paddingBottom: 20 }}>
                {currentlyActive === "Overview" && (
                  <>
                    {/* <Text>Please select your departure date</Text>
                    <Input
                      type="date"
                      variant="flushed"
                      padding="10px"
                      borderRadius="10px"
                      value={departureDate}
                      min={bookingDate}
                      onChange={(e) => {
                        setDepartureDate(e.target.value);
                        setArrivalDate(calculateArrivalDate(e.target.value));
                      }}
                    /> */}
                    <p style={{ fontSize: "large", fontWeight: "bold" }}>
                      Services
                    </p>
                    {/* food select box */}
                    {!isFood ? (
                      <div
                        className={styles.selectBox}
                        onClick={() => {
                          setIsFood(true);
                        }}
                      >
                        <div>
                          <p>Food</p>
                        </div>
                        <div>
                          <img
                            src="/images/down.png"
                            style={{ height: 20, width: 20 }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div
                          className={styles.droppedBox}
                          onClick={() => {
                            setIsFood(false);
                          }}
                        >
                          <div>
                            <p>Food</p>
                          </div>
                          <div>
                            <img
                              src="/images/arrow-up.png"
                              style={{ height: 20, width: 20 }}
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            backgroundColor: "#1F516D",
                            padding: 20,
                            fontWeight: "bold",
                            display: "flex",
                            flexDirection: "column",
                            gap: 5,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p>Breakfast:</p>
                            <p>{tp.breakfast}</p>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p>Lunch:</p>
                            <p>{tp.lunch}</p>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p>Dinner:</p>
                            <p>{tp.dinner}</p>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p>Charges:</p>
                            <p>Rs.{tp.foodPrice}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* transport select box */}
                    {!isTransport ? (
                      <div style={{ marginTop: "3%" }}>
                        <div
                          className={styles.selectBox}
                          onClick={() => {
                            setIsTransport(true);
                          }}
                        >
                          <div>
                            <p>Transport</p>
                          </div>
                          <div>
                            <img
                              src="/images/down.png"
                              style={{ height: 20, width: 20 }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: "3%" }}>
                        <div>
                          <div
                            className={styles.droppedBox}
                            onClick={() => {
                              setIsTransport(false);
                            }}
                          >
                            <div>
                              <p>Transport</p>
                            </div>
                            <div>
                              <img
                                src="/images/arrow-up.png"
                                style={{ height: 20, width: 20 }}
                              />
                            </div>
                          </div>
                          <div
                            style={{
                              backgroundColor: "#1F516D",
                              padding: 20,
                              fontWeight: "bold",
                              display: "flex",
                              flexDirection: "column",
                              gap: 5,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p>Company:</p>
                              <p>{tp.transportCompanyName}</p>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p>Charges:</p>
                              <p>Rs.{tp.transportExpensePerPerson}</p>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p>Transport type:</p>
                              <p>{tp.transportType}</p>
                            </div>
                            {/* <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p>Seats:</p>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  width: "12%",
                                }}
                              >
                                <img
                                  onClick={() => {
                                    if (seats !== 1) setSeats(seats - 1);
                                  }}
                                  src="/images/minus.png"
                                  style={{ width: 10, height: 10 }}
                                />
                                <p>{seats}</p>
                                <img
                                  onClick={() => {
                                    if (seats < 10) setSeats(seats + 1);
                                  }}
                                  src="/images/plus.png"
                                  style={{ width: 10, height: 10 }}
                                />
                              </div>
                            </div> */}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p>Avail:</p>
                              <Switch
                                defaultChecked={isTransportAvailed}
                                onChange={() =>
                                  setIsTransportAvailed(!isTransportAvailed)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Accommodation section */}
                    {!isAccommodation ? (
                      <div style={{ marginTop: "3%" }}>
                        <div
                          className={styles.selectBox}
                          onClick={() => {
                            setIsAccommodation(true);
                          }}
                        >
                          <div>
                            <p>Accommodation</p>
                          </div>
                          <div>
                            <img
                              src="/images/down.png"
                              style={{ height: 20, width: 20 }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: "3%" }}>
                        <div>
                          <div
                            className={styles.droppedBox}
                            onClick={() => {
                              setIsAccommodation(false);
                            }}
                          >
                            <div>
                              <p>Accommodation</p>
                            </div>
                            <div>
                              <img
                                src="/images/arrow-up.png"
                                style={{ height: 20, width: 20 }}
                              />
                            </div>
                          </div>
                          <div
                            style={{
                              backgroundColor: "#1F516D",
                              padding: 20,
                              fontWeight: "bold",
                              display: "flex",
                              flexDirection: "column",
                              gap: 5,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p>Name:</p>
                              <p>{tp.hotelCompanyName}</p>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p>Price per person:</p>
                              <p>Rs.{tp.hotelRoomExpensePerPerson}</p>
                            </div>
                            {/* <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p>Rooms:</p>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  width: "12%",
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
                            </div> */}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p>Avail:</p>
                              <Switch
                                defaultChecked={isAccommodationAvailed}
                                onChange={() =>
                                  setIsAccommodationAvailed(
                                    !isAccommodationAvailed
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* bill section */}
                    {!isBill ? (
                      <div style={{ marginTop: "3%" }}>
                        <div
                          className={styles.selectBox}
                          onClick={() => {
                            setIsBill(true);
                          }}
                        >
                          <div>
                            <p>Bill</p>
                          </div>
                          <div>
                            <img
                              src="/images/down.png"
                              style={{ height: 20, width: 20 }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: "3%" }}>
                        <div>
                          <div
                            className={styles.droppedBox}
                            onClick={() => {
                              setIsBill(false);
                            }}
                          >
                            <div>
                              <p>Bill</p>
                            </div>
                            <div>
                              <img
                                src="/images/arrow-up.png"
                                style={{ height: 20, width: 20 }}
                              />
                            </div>
                          </div>
                          <div
                            style={{
                              backgroundColor: "#1F516D",
                              width: "50%",
                              padding: 20,
                              fontWeight: "bold",
                              display: "flex",
                              flexDirection: "column",
                              gap: 5,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p>Food:</p>
                              <p>Rs.{tp.foodPrice}</p>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p>Transport:</p>
                              <p>Rs.{tp.transportExpensePerPerson}</p>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p>Accommodation:</p>
                              <p>Rs.{tp.hotelRoomExpensePerPerson}</p>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p>Total:</p>
                              <p>Rs.{calculateTotal()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {currentlyActive === "Inclusions" && (
                  <Text fontWeight="bold" fontSize="20px">
                    Inclusions
                  </Text>
                )}
                {currentlyActive === "Inclusions" &&
                  (tp.inclusions?.length > 0 ? (
                    tp.inclusions.map((d) => (
                      <>
                        <UnorderedList>
                          <ListItem key={d}>{d}</ListItem>
                        </UnorderedList>
                      </>
                    ))
                  ) : (
                    <Text>Not provided</Text>
                  ))}
                {currentlyActive === "Exclusions" && (
                  <Text fontWeight="bold" fontSize="20px">
                    Exclusions
                  </Text>
                )}
                {currentlyActive === "Exclusions" &&
                  (tp.exclusions?.length > 0 ? (
                    tp.exclusions.map((d) => (
                      <>
                        <UnorderedList>
                          <ListItem key={d}>{d}</ListItem>
                        </UnorderedList>
                      </>
                    ))
                  ) : (
                    <Text>Not provided</Text>
                  ))}
                {currentlyActive === "Summary" && (
                  <Text fontWeight="bold" fontSize="20px">
                    Summary
                  </Text>
                )}
                {currentlyActive === "Summary" &&
                  (tp.summary?.length > 0 ? (
                    tp.summary.map((d, i) => (
                      <UnorderedList>
                        <ListItem>
                          <Text key={d}>Day {i + 1}:</Text>
                          {d}
                        </ListItem>
                      </UnorderedList>
                    ))
                  ) : (
                    <Text>Not provided</Text>
                  ))}
                {currentlyActive === "Map" && (
                  <>
                    <Heading size="md">Map</Heading>
                    <Map service={tp} />
                  </>
                )}
                {currentlyActive === "Images" && (
                  <Box>
                    <Heading size="md" mb={4}>
                      Images
                    </Heading>
                    {tp.imageUrls && tp.imageUrls.length > 0 ? (
                      <Box
                        display="grid"
                        gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
                        gap={4}
                        overflow="auto"
                      >
                        {tp.imageUrls.map((imageUrl, index) => (
                          <Box
                            key={index}
                            borderWidth={1}
                            borderRadius="md"
                            overflow="hidden"
                          >
                            <img
                              src={imageUrl}
                              alt={`Image ${index + 1}`}
                              style={{ width: "100%", height: "100%" }}
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
                          <Text fontWeight="bold">
                            Review by: {review.email}
                          </Text>
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
                {/* for number of people */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "large",
                  }}
                >
                  <Text fontWeight="500" mt="10px">
                    Number of people:
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "12%",
                    }}
                  >
                    <img
                      onClick={() => {
                        if (numberOfPeople !== 1)
                          handleNumberOfPeopleChange(numberOfPeople - 1);
                      }}
                      src="/images/minus.png"
                      style={{ width: 10, height: 10 }}
                    />
                    <p>{numberOfPeople}</p>
                    <img
                      onClick={(e) => {
                        if (numberOfPeople < 10)
                          handleNumberOfPeopleChange(numberOfPeople + 1);
                      }}
                      src="/images/plus.png"
                      style={{ width: 10, height: 10 }}
                    />
                  </div>
                </div>
                <FormControl isRequired mt="10px">
                  <FormLabel fontWeight="bold">Contact:</FormLabel>
                  <InputGroup>
                    <Input
                      borderRadius="10px"
                      padding="10px"
                      placeholder="03135068731"
                      size="md"
                      value={contact}
                      onChange={(e) => {
                        if (contact.length < 11) setContact(e.target.value);
                        if (
                          e.nativeEvent.inputType === "deleteContentBackward"
                        ) {
                          console.log("Backspace pressed");
                          setContact(e.target.value);
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
                <div style={{ marginTop: "3%" }}>
                  <Button
                    onClick={handleBookNow}
                    bg="#2A656D"
                    color="white"
                    size="sm"
                    _hover={{ opacity: 0.5 }}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <Box mt="130px" w="20%" p="10px" bg="white" color="black">
            <Box fontSize="sm">
              <Text>======= RECEIPT =======</Text>
              <Text textAlign="center">{tp.name}</Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={1}>
                <Text>Departure City:</Text>
                <Text>{capitalizeFirstChar(tp.departureCity)}</Text>

                <Text>Destination City:</Text>
                <Text>{capitalizeFirstChar(tp.city)}</Text>
              </Grid>
              <Text>----------------------------------</Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={1}>
                <Text>Booking Date:</Text>
                <Text>{bookingDate}</Text>

                <Text>Departure Date:</Text>
                <Text>{tp.departureDate}</Text>

                <Text>Arrival Date:</Text>
                <Text>{tp.arrivalDate}</Text>

                <Text>Tour Duratoin:</Text>
                <Text>{tourDuration} days</Text>
              </Grid>
              <Text>----------------------------------</Text>
              <Grid templateColumns="repeat(2,1fr)" gap={1}>
                {isAccommodationAvailed && (
                  <>
                    <Text>Accommodation:</Text>
                    <Text>Rs.{tp.hotelRoomExpensePerPerson * rooms}</Text>
                    <Text>No. of rooms:</Text>
                    <Text>{rooms}</Text>
                  </>
                )}
                {isTransportAvailed && (
                  <>
                    <Text>Transport:</Text>
                    <Text>Rs.{tp.transportExpensePerPerson}</Text>
                    <Text>No. of seats:</Text>
                    <Text>{seats}</Text>
                  </>
                )}

                <Text>Food Expense:</Text>
                <Text>Rs.{tp.foodPrice}</Text>
              </Grid>
              <Text>----------------------------------</Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={1}>
                <Text>Total Price:</Text>
                <Text>Rs.{calculateTotal()}</Text>
              </Grid>
              <Text>====================</Text>
            </Box>
          </Box>
        </HStack>
      )}
    </Layout>
  );
}
