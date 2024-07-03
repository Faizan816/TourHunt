import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Layout from "../../components/layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import formatTimeToAMPM from "../../components/formatTime";
import { addDays } from "date-fns";
import { CloseIcon, PhoneIcon } from "@chakra-ui/icons";

export default function Bookings() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState();
  const [r, setR] = useState();
  const [t, setT] = useState();
  const [a, setA] = useState();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showDialog, setShowDialog] = useState(false);
  const [buyerId, setBuyerId] = useState();
  const [serviceId, setServiceId] = useState();
  const [serviceType, setServiceType] = useState();
  const [dialogTitle, setDialogTitle] = useState();
  const [buyerName, setBuyerName] = useState();
  const [buyerEmail, setBuyerEmail] = useState();
  const [serviceName, setServiceName] = useState();
  const toast = useToast();
  const [id, setId] = useState();

  function CancelBookingDialog() {
    const cancelRef = useRef();

    return (
      <>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent bg="#2A656D" color="white">
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Cancel Booking
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to cancel this booking '{dialogTitle}'?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={() => {
                    onClose();
                    setShowDialog(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    onClose();
                    handleCancelBooking();
                    setShowDialog(false);
                  }}
                  ml={3}
                >
                  Yes, Cancel
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    );
  }

  useEffect(() => {
    if (!localStorage.getItem("currentUser")) {
      router.push("../login");
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let data;
      let restaurants;
      let transports;
      let accommodations;
      const email = localStorage.getItem("currentUser");
      const userResponse = await axios.post(
        "http://127.0.0.1:8000/findUserUsingEmail",
        { email: email }
      );
      try {
        const bookingsResponse = await axios.post(
          "http://127.0.0.1:8000/getTourPackageBookings",
          { userId: userResponse.data._id }
        );
        const restaurantBookings = await axios.post(
          "http://127.0.0.1:8000/getRestaurantBookings",
          {
            userId: userResponse.data._id,
          }
        );
        const transportBookings = await axios.post(
          "http://127.0.0.1:8000/getTransportBookings",
          {
            userId: userResponse.data._id,
          }
        );
        const accommodationBookings = await axios.post(
          "http://127.0.0.1:8000/getAccommodationBookings",
          { userId: userResponse.data._id }
        );
        data = bookingsResponse.data;
        console.log(bookingsResponse.data);
        restaurants = restaurantBookings.data;
        transports = transportBookings.data;
        accommodations = accommodationBookings.data;
      } catch (error) {
        data = null;
        restaurants = null;
        transports = null;
        accommodations = null;
        console.log(error);
      }
      setData(data);
      setR(restaurants);
      setT(transports);
      setA(accommodations);
    };
    isLoggedIn && fetchData();
  }, [isLoggedIn]);

  const handleCancelBooking = async () => {
    try {
      // cancelling booking
      // deleting respective payment when booking is cancelled
      await axios.post("http://127.0.0.1:8000/deletePayment", {
        userId: buyerId,
        serviceId,
      });
      if (serviceType === "Tour Package") {
        await axios.post("http://127.0.0.1:8000/cancelTourPackageBooking", {
          id,
        });
        const filteredTourPackages = data.filter((d) => !(d._id === id));
        setData(filteredTourPackages);
        // sending email to notify of booking cancellation
        axios.post("http://127.0.0.1:8000/sendMail", {
          to: buyerEmail,
          name: "Faizan",
          subject: "Tour Package Booking Cancellation!",
          body: `<p>Dear ${buyerName},</p>
           <p>Your booking of tour package "${serviceName}" has been successfully cancelled.</p>
           <p>We hope to see you again soon.</p>`,
        });
      }

      // cancelling accommodation booking
      if (serviceType === "Accommodation") {
        await axios.post("http://127.0.0.1:8000/cancelAccommodationBooking", {
          id,
        });
        const filteredAccommodations = a.filter(
          (d) => !(d.buyerId === buyerId && d.serviceId === serviceId)
        );
        setA(filteredAccommodations);
        // sending email to notify of booking cancellation
        axios.post("http://127.0.0.1:8000/sendMail", {
          to: buyerEmail,
          name: "Faizan",
          subject: "Accommodation Booking Cancellation!",
          body: `<p>Dear ${buyerName},</p>
         <p>Your booking of accommodation "${serviceName}" has been successfully cancelled.</p>
         <p>We hope to see you again soon.</p>`,
        });
      }

      // cancelling transport booking
      if (serviceType === "Transport") {
        await axios.post("http://127.0.0.1:8000/cancelTransportBooking", {
          id,
        });
        const filteredTransports = t.filter(
          (d) => !(d.buyerId === buyerId && d.serviceId === serviceId)
        );
        setT(filteredTransports);
        // sending email to notify of booking cancellation
        axios.post("http://127.0.0.1:8000/sendMail", {
          to: buyerEmail,
          name: "Faizan",
          subject: "Transport Booking Cancellation!",
          body: `<p>Dear ${buyerName},</p>
         <p>Your booking of transport "${serviceName}" has been successfully cancelled.</p>
         <p>We hope to see you again soon.</p>`,
        });
      }

      // cancelling restaurant booking
      if (serviceType === "Restaurant") {
        await axios.post("http://127.0.0.1:8000/cancelRestaurantBooking", {
          id,
        });
        const filteredRestaurants = r.filter(
          (d) => !(d.buyerId === buyerId && d.serviceId === serviceId)
        );
        setR(filteredRestaurants);
        // sending email to notify of booking cancellation
        axios.post("http://127.0.0.1:8000/sendMail", {
          to: buyerEmail,
          name: "Faizan",
          subject: "Restaurant Booking Cancellation!",
          body: `<p>Dear ${buyerName},</p>
         <p>Your booking of restaurant "${serviceName}" has been successfully cancelled.</p>
         <p>We hope to see you again soon.</p>`,
        });
      }

      toast({
        title: "Booking cancelled successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    isLoggedIn && (
      <Layout>
        {showDialog && <CancelBookingDialog />}

        <Box w="100%" mt="40px" display="flex" justifyContent="center">
          <Box
            letterSpacing={1}
            borderRadius="10px"
            p="20px"
            w="70%"
            bg="#143E56"
          >
            <Heading size="md">Bookings</Heading>
            <Tabs mt="10px" w="100%" isLazy variant="soft-rounded">
              <TabList overflow="auto">
                <Tab
                  borderRadius="10px"
                  fontSize="sm"
                  _selected={{ bg: "#2A656D", color: "white" }}
                >
                  Tour Packages
                </Tab>
                <Tab
                  borderRadius="10px"
                  fontSize="sm"
                  _selected={{ bg: "#2A656D", color: "white" }}
                >
                  Accommodations
                </Tab>
                <Tab
                  borderRadius="10px"
                  fontSize="sm"
                  _selected={{ bg: "#2A656D", color: "white" }}
                >
                  Transports
                </Tab>
                <Tab
                  borderRadius="10px"
                  fontSize="sm"
                  _selected={{ bg: "#2A656D", color: "white" }}
                >
                  Restaurants
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {data &&
                    data.map((d) => (
                      <Box
                        mt="10px"
                        key={d._id}
                        p="20px"
                        // mt="10px"
                        borderRadius="10px"
                        w="100%"
                        bg="#2A656D"
                        // backgroundImage="linear-gradient(45deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)"
                        // backgroundSize="cover"
                        // backgroundPosition="center"
                        fontSize="smaller"
                      >
                        <Grid templateColumns="repeat(2,1fr)" gap={0.1}>
                          <GridItem>
                            <b>Booking Type:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/tour package.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>Tour Package</Text>
                          </GridItem>
                          <GridItem>
                            <b>Service Name:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/name.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.serviceName}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Seller Name:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/user.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.sellerName}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Seller Contact:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/telephone-call.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.sellerContact}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Amount Paid:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/money.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>Rs.{d.amountPaid}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Purchase Date:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/booking.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.createdAt.split("T")[0]}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Purchase Time:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/clock.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>
                              {formatTimeToAMPM(
                                d.createdAt.split("T")[1].split(".")[0]
                              )}
                            </Text>
                          </GridItem>
                          <GridItem>
                            <b>Departure Date:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/booking.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.departureDate}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Arrival Date:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/booking.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.arrivalDate}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Tour Duration:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/clock.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.tourDuration} days</Text>
                          </GridItem>
                          {d.isAccommodationAvailed && (
                            <>
                              <GridItem>
                                <b>Hotel name:</b>
                              </GridItem>
                              <GridItem display="flex" alignItems="center">
                                <Image
                                  src="/images/map.png"
                                  alt="Transport"
                                  boxSize="20px"
                                  mr={1}
                                />
                                <Text>{d.hotelCompanyName}</Text>
                              </GridItem>
                            </>
                          )}
                          <GridItem>
                            <b>Destination:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/map.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.destination}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Departure City:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/map.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.departureCity}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Destination City:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/map.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.city}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Transport:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/bus (1).png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.transportType}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Number of people:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/numberOfPeople.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.numberOfPeople}</Text>
                          </GridItem>
                          {!d.isAccommodationAvailed &&
                            new Date() <
                              addDays(
                                new Date(d.createdAt.split("T")[0]),
                                1
                              ) && (
                              <>
                                <GridItem>
                                  <b>Hotel:</b>
                                </GridItem>
                                <GridItem>
                                  <Button
                                    mt="5px"
                                    bg="darkblue"
                                    color="white"
                                    _hover={{ opacity: 0.5 }}
                                    size="sm"
                                    onClick={() => {
                                      localStorage.setItem(
                                        "paymentPrice",
                                        parseFloat(d.numberOfPeople) *
                                          parseFloat(
                                            d.hotelRoomExpensePerPerson
                                          )
                                      );
                                      localStorage.setItem(
                                        "updateTpBooking",
                                        JSON.stringify({
                                          action: "Avail Hotel",
                                          serviceId: d.serviceId,
                                          buyerId: d.buyerId,
                                          _id: d._id,
                                          numberOfPeople: d.numberOfPeople,
                                          previousAmount: d.amountPaid,
                                        })
                                      );
                                      localStorage.setItem(
                                        "currentService",
                                        JSON.stringify({
                                          service: d,
                                          serviceType: "Tour Package",
                                          serviceName: d.serviceName,
                                        })
                                      );
                                      router.push("../bookings/payment");
                                    }}
                                  >
                                    Avail Hotel Now
                                  </Button>
                                </GridItem>
                              </>
                            )}
                          {!d.isTransportAvailed &&
                            new Date() <
                              addDays(
                                new Date(d.createdAt.split("T")[0]),
                                1
                              ) && (
                              <>
                                <GridItem>
                                  <b>Transport:</b>
                                </GridItem>
                                <GridItem>
                                  <Button
                                    mt="5px"
                                    bg="darkblue"
                                    color="white"
                                    _hover={{ opacity: 0.5 }}
                                    size="sm"
                                    onClick={() => {
                                      localStorage.setItem(
                                        "paymentPrice",
                                        parseFloat(d.numberOfPeople) *
                                          parseFloat(
                                            d.transportExpensePerPerson
                                          )
                                      );
                                      localStorage.setItem(
                                        "updateTpBooking",
                                        JSON.stringify({
                                          action: "Avail Transport",
                                          serviceId: d.serviceId,
                                          buyerId: d.buyerId,
                                          _id: d._id,
                                          numberOfPeople: d.numberOfPeople,
                                          previousAmount: d.amountPaid,
                                        })
                                      );
                                      localStorage.setItem(
                                        "currentService",
                                        JSON.stringify({
                                          service: d,
                                          serviceType: "Tour Package",
                                          serviceName: d.serviceName,
                                        })
                                      );
                                      router.push("../bookings/payment");
                                    }}
                                  >
                                    Avail Transport Now
                                  </Button>
                                </GridItem>
                              </>
                            )}
                          {d.isAccommodationAvailed && (
                            <>
                              <GridItem>
                                <b>Number of rooms:</b>
                              </GridItem>
                              <GridItem display="flex" alignItems="center">
                                <Image
                                  src="/images/bed.png"
                                  alt="Transport"
                                  boxSize="20px"
                                  mr={1}
                                />
                                <Text>{d.numberOfRooms}</Text>
                              </GridItem>
                            </>
                          )}
                          {d.isTransportAvailed && (
                            <>
                              <GridItem>
                                <b>Number of seats:</b>
                              </GridItem>
                              <GridItem display="flex" alignItems="center">
                                <Image
                                  src="/images/seat.png"
                                  alt="Transport"
                                  boxSize="20px"
                                  mr={1}
                                />
                                <Text>{d.numberOfSeats}</Text>
                              </GridItem>
                            </>
                          )}
                          {d.isAccommodationAvailed && (
                            <>
                              <GridItem>
                                <b>Room price per person:</b>
                              </GridItem>
                              <GridItem display="flex" alignItems="center">
                                <Image
                                  src="/images/money.png"
                                  alt="Transport"
                                  boxSize="20px"
                                  mr={1}
                                />
                                <Text>Rs.{d.hotelRoomExpensePerPerson}</Text>
                              </GridItem>
                            </>
                          )}
                          {d.isTransportAvailed && (
                            <>
                              <GridItem>
                                <b>Seat price per person:</b>
                              </GridItem>
                              <GridItem display="flex" alignItems="center">
                                <Image
                                  src="/images/money.png"
                                  alt="Transport"
                                  boxSize="20px"
                                  mr={1}
                                />
                                <Text>Rs.{d.transportExpensePerPerson}</Text>
                              </GridItem>
                            </>
                          )}
                          <GridItem>
                            <b>Food price per person:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/money.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>Rs.{d.foodPricePerPerson}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Total Bill:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/money.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>Rs.{d.amountPaid}</Text>
                          </GridItem>
                        </Grid>
                        {new Date() <
                          addDays(new Date(d.createdAt.split("T")[0]), 1) && (
                          <Button
                            mt="10px"
                            bg="#AC3116"
                            color="white"
                            leftIcon={<CloseIcon />}
                            _hover={{ opacity: 0.5 }}
                            size="sm"
                            onClick={() => {
                              setId(d._id);
                              setBuyerId(d.buyerId);
                              setServiceId(d.serviceId);
                              setServiceType("Tour Package");
                              setBuyerName(d.buyerName);
                              setServiceName(d.serviceName);
                              setBuyerEmail(d.buyerEmail);
                              setShowDialog(true);
                              setDialogTitle(d.serviceName);
                              onOpen();
                            }}
                          >
                            Cancel Booking
                          </Button>
                        )}
                      </Box>
                    ))}
                  {data && data.length === 0 && (
                    <Text>Start booking tour packages today!</Text>
                  )}
                </TabPanel>
                <TabPanel>
                  {a &&
                    a.map((d) => (
                      <Box
                        key={d._id}
                        p="20px"
                        mt="10px"
                        borderRadius="10px"
                        w="100%"
                        bg="#2A656D"
                        fontSize="smaller"
                      >
                        <Grid templateColumns="repeat(2,1fr)" gap={0.1}>
                          <GridItem>
                            <b>Booking Type:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/hotell.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>Accommodation</Text>
                          </GridItem>
                          <GridItem>
                            <b>Service Name:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/name.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.serviceName}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Seller Name:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/user.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.sellerName}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Seller Contact:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/telephone-call.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.contact}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Room price per person:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/money.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>Rs.{d.hotelRoomExpensePerPerson}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Number of rooms booked:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/bed.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.numberOfRooms}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Amount Paid:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/money.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>Rs.{d.amountPaid}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Purchase Date:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/booking.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.createdAt.split("T")[0]}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Purchase Time:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/clock.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>
                              {formatTimeToAMPM(
                                d.createdAt.split("T")[1].split(".")[0]
                              )}
                            </Text>
                          </GridItem>
                          <GridItem>
                            <b>Booking Date:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/booking.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            {d.bookingDate}
                          </GridItem>
                          <GridItem>
                            <b>Reservation Date:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/booking.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            {d.reservationDate}
                          </GridItem>
                          <GridItem>
                            <b>Reservation Time:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/clock.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            {formatTimeToAMPM(d.reservationTime)}
                          </GridItem>
                        </Grid>
                        {new Date() <
                          addDays(new Date(d.createdAt.split("T")[0]), 1) && (
                          <Button
                            mt="10px"
                            bg="#AC3116"
                            color="white"
                            leftIcon={<CloseIcon />}
                            _hover={{ opacity: 0.5 }}
                            size="sm"
                            onClick={() => {
                              setId(d._id);
                              setBuyerId(d.buyerId);
                              setServiceId(d.serviceId);
                              setServiceType("Accommodation");
                              setBuyerName(d.buyerName);
                              setServiceName(d.serviceName);
                              setBuyerEmail(d.buyerEmail);
                              setShowDialog(true);
                              setDialogTitle(d.serviceName);
                              onOpen();
                            }}
                          >
                            Cancel Booking
                          </Button>
                        )}
                      </Box>
                    ))}
                  {a && a.length === 0 && (
                    <Text>Start booking accommodations today!</Text>
                  )}
                </TabPanel>
                <TabPanel>
                  {t &&
                    t.map((d) => (
                      <Box
                        key={d._id}
                        p="20px"
                        mt="10px"
                        borderRadius="10px"
                        w="100%"
                        bg="#2A656D"
                        fontSize="smaller"
                      >
                        <Grid templateColumns="repeat(2,1fr)" gap={0.1}>
                          <GridItem>
                            <b>Booking Type:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/bus (1).png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>Transport</Text>
                          </GridItem>
                          <GridItem>
                            <b>Service Name:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/name.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.serviceName}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Seller Name:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/user.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.sellerName}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Seller Contact:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/telephone-call.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.contact}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Seat Price Per Person:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/money.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>Rs.{d.seatPricePerPerson}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Number of seats booked:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/seat.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.numberOfSeats}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Amount Paid:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/money.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>Rs.{d.amountPaid}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Purchase Date:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/booking.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.createdAt.split("T")[0]}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Purchase Time:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/clock.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>
                              {formatTimeToAMPM(
                                d.createdAt.split("T")[1].split(".")[0]
                              )}
                            </Text>
                          </GridItem>
                          <GridItem>
                            <b>Booking Date:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/booking.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            {d.bookingDate}
                          </GridItem>
                          <GridItem>
                            <b>Reservation Date:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/booking.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            {d.reservationDate}
                          </GridItem>
                          <GridItem>
                            <b>Reservation Time:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/clock.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            {formatTimeToAMPM(d.reservationTime)}
                          </GridItem>
                          <GridItem>
                            <b>Drop-off Location:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/map.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            {d.dropOffLocation}
                          </GridItem>
                        </Grid>
                        {new Date() <
                          addDays(new Date(d.createdAt.split("T")[0]), 1) && (
                          <Button
                            mt="10px"
                            bg="#AC3116"
                            color="white"
                            leftIcon={<CloseIcon />}
                            _hover={{ opacity: 0.5 }}
                            size="sm"
                            onClick={() => {
                              setId(d._id);
                              setBuyerId(d.buyerId);
                              setServiceId(d.serviceId);
                              setServiceType("Transport");
                              setBuyerName(d.buyerName);
                              setServiceName(d.serviceName);
                              setBuyerEmail(d.buyerEmail);
                              setShowDialog(true);
                              setDialogTitle(d.serviceName);
                              onOpen();
                            }}
                          >
                            Cancel Booking
                          </Button>
                        )}
                      </Box>
                    ))}
                  {t && t.length === 0 && (
                    <Text>Start booking transports today!</Text>
                  )}
                </TabPanel>
                <TabPanel>
                  {r &&
                    r.map((d) => (
                      <Box
                        key={d._id}
                        p="20px"
                        mt="10px"
                        borderRadius="10px"
                        w="100%"
                        bg="#2A656D"
                        fontSize="smaller"
                      >
                        <Grid templateColumns="repeat(2,1fr)" gap={0.1}>
                          <GridItem>
                            <b>Booking Type:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/restaurant (1).png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>Restaurant</Text>
                          </GridItem>
                          <GridItem>
                            <b>Service Name:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/name.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.serviceName}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Seller Name:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/user.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.sellerName}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Seller Contact:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/telephone-call.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.contact}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Amount Paid:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/money.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>Rs.{d.amountPaid}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Purchase Date:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/booking.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>{d.createdAt.split("T")[0]}</Text>
                          </GridItem>
                          <GridItem>
                            <b>Purchase Time:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/clock.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            <Text>
                              {formatTimeToAMPM(
                                d.createdAt.split("T")[1].split(".")[0]
                              )}
                            </Text>
                          </GridItem>
                          <GridItem>
                            <b>Booking Date:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/booking.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            {d.bookingDate}
                          </GridItem>
                          <GridItem>
                            <b>Reservation Date:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/booking.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            {d.reservationDate}
                          </GridItem>
                          <GridItem>
                            <b>Reservation Time:</b>
                          </GridItem>
                          <GridItem display="flex" alignItems="center">
                            <Image
                              src="/images/clock.png"
                              alt="Transport"
                              boxSize="20px"
                              mr={1}
                            />
                            {formatTimeToAMPM(d.reservationTime)}
                          </GridItem>
                        </Grid>
                        {new Date() <
                          addDays(new Date(d.createdAt.split("T")[0]), 1) && (
                          <Button
                            mt="10px"
                            bg="#AC3116"
                            color="white"
                            leftIcon={<CloseIcon />}
                            _hover={{ opacity: 0.5 }}
                            size="sm"
                            onClick={() => {
                              setId(d._id);
                              setBuyerId(d.buyerId);
                              setServiceId(d.serviceId);
                              setServiceType("Restaurant");
                              setBuyerName(d.buyerName);
                              setServiceName(d.serviceName);
                              setBuyerEmail(d.buyerEmail);
                              setShowDialog(true);
                              setDialogTitle(d.serviceName);
                              onOpen();
                            }}
                          >
                            Cancel Booking
                          </Button>
                        )}
                      </Box>
                    ))}
                  {r && r.length === 0 && (
                    <Text>Start booking restaurants today!</Text>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </Layout>
    )
  );
}
