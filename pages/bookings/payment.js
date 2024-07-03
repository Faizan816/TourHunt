import {
  Box,
  Divider,
  HStack,
  Text,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  FormControl,
  FormLabel,
  Input,
  Image,
  Button,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "../../components/layout";

export default function Payment() {
  const stripe = useStripe();
  const elements = useElements();
  const [userId, setUserId] = useState();
  const [sellerId, setSellerId] = useState();
  const [serviceId, setServiceId] = useState();
  const [serviceType, setServiceType] = useState();
  const [serviceName, setServiceName] = useState();
  const [buyerName, setBuyerName] = useState();
  const [sellerName, setSellerName] = useState();
  const [buyerEmail, setBuyerEmail] = useState();
  const [sellerEmail, setSellerEmail] = useState();
  const [amount, setAmount] = useState(0);
  const [fullName, setFullName] = useState(""); // Added state for Full Name
  const isMobile = useBreakpointValue({
    base: true,
    sm: true,
    md: false,
    lg: false,
    xl: false,
  });
  const toast = useToast();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handlePayNow = async () => {
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log(error);
      toast({
        title: error.type,
        description: error.code,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      // Payment successful, proceed with saving payment details
      try {
        if (!localStorage.getItem("updateTpBooking")) {
          await axios.post("http://127.0.0.1:8000/savePayment", {
            serviceId,
            serviceType,
            serviceName,
            userId,
            amount,
            status: "not reviewed",
            username: buyerName,
          });
        }
        if (
          JSON.parse(localStorage.getItem("currentService")).serviceType ===
          "Restaurant"
        ) {
          const r = JSON.parse(localStorage.getItem("currentService")).service;
          await axios.post("http://127.0.0.1:8000/bookRestaurant", {
            buyerId: userId,
            buyerName,
            sellerId,
            sellerName,
            serviceId,
            serviceName,
            buyerEmail,
            sellerEmail,
            amountPaid: amount,
            businessName: r.businessName,
            cuisine: r.cuisine,
            city: r.city,
            province: r.province,
            country: r.country,
            averageFoodRate: r.averageFoodRate,
            contact: r.contact,
            customerContact: localStorage.getItem("customerContact"),
            openingTime: r.openingTime,
            closingTime: r.closingTime,
            reservationDate: localStorage.getItem("reservationDate"),
            reservationTime: localStorage.getItem("reservationTime"),
            reservationCharges: r.reservationCharges,
            bookingDate: localStorage.getItem("bookingDate"),
            status: "Pending",
          });
          // sending confirmation email that restaurant has been booked successfully!
          axios.post("http://127.0.0.1:8000/sendMail", {
            to: buyerEmail,
            name: "Faizan",
            subject: "Restaurant Booking Success!",
            body: `<p>Dear ${buyerName},</p>
           <p>Your booking of restaurant "${serviceName}" has been successfully confirmed.</p>
           <br/>
           <p><b>Location:</b> ${r.city}, ${r.province}, ${r.country}</p>
           <p><b>Reservation Date</b>: ${localStorage.getItem(
             "reservationDate"
           )}</p>
           <p><b>Reservation Time</b>: ${localStorage.getItem(
             "reservationTime"
           )}</p>
           <p><b>Amount Paid:</b> Rs.${amount}</p>
           <br/>
           <p>Thank you for using our service!</p>`,
          });
        } else if (
          JSON.parse(localStorage.getItem("currentService")).serviceType ===
          "Accommodation"
        ) {
          const a = JSON.parse(localStorage.getItem("currentService")).service;
          await axios.post("http://127.0.0.1:8000/bookAccommodation", {
            buyerId: userId,
            sellerId,
            serviceId,
            serviceName,
            buyerName,
            sellerName,
            buyerEmail,
            sellerEmail,
            amountPaid: amount,
            businessName: a.businessName,
            contact: a.contact,
            customerContact: localStorage.getItem("customerContact"),
            city: a.city,
            province: a.province,
            country: a.country,
            amenities: a.amenities || "-",
            hotelRoomExpensePerPerson: a.hotelRoomExpensePerPerson,
            numberOfRooms: localStorage.getItem("numberOfRooms"),
            bookingDate: localStorage.getItem("bookingDate"),
            reservationDate: localStorage.getItem("reservationDate"),
            reservationTime: localStorage.getItem("reservationTime"),
            status: "Pending",
          });
          // sending confirmation email that accommodation has been booked successfully!
          axios.post("http://127.0.0.1:8000/sendMail", {
            to: buyerEmail,
            name: "Faizan",
            subject: "Accommodation Booking Success!",
            body: `<p>Dear ${buyerName},</p>
           <p>Your booking of accommodation "${serviceName}" has been successfully confirmed.</p>
           <br/>
           <p><b>Location:</b> ${a.city}, ${a.province}, ${a.country}</p>
           <p><b>Reservation Date</b>: ${localStorage.getItem(
             "reservationDate"
           )}</p>
           <p><b>Reservation Time</b>: ${localStorage.getItem(
             "reservationTime"
           )}</p>
           <p><b>Number of Rooms:</b> ${localStorage.getItem(
             "numberOfRooms"
           )}</p>
           <p><b>Hotel Room Expense Per Person:</b> Rs.${
             a.hotelRoomExpensePerPerson
           }</p>
           <p><b>Amount Paid:</b> Rs.${amount}</p>
           <br/>
           <p>Thank you for using our service!</p>`,
          });
        } else if (
          JSON.parse(localStorage.getItem("currentService")).serviceType ===
          "Transport"
        ) {
          const t = JSON.parse(localStorage.getItem("currentService")).service;
          await axios.post("http://127.0.0.1:8000/bookTransport", {
            buyerId: userId,
            sellerId,
            serviceId,
            serviceName,
            buyerName,
            sellerName,
            buyerEmail,
            sellerEmail,
            amountPaid: amount,
            businessName: t.businessName,
            seatPricePerPerson: t.seatPricePerPerson,
            numberOfSeats: localStorage.getItem("numberOfSeats"),
            amenities: t.amenities || "-",
            city: t.city,
            province: t.province,
            country: t.country,
            contact: t.contact,
            customerContact: localStorage.getItem("customerContact"),
            transportType: t.transportType,
            dropOffLocation: localStorage.getItem("dropOffLocation"),
            bookingDate: localStorage.getItem("bookingDate"),
            reservationDate: localStorage.getItem("reservationDate"),
            reservationTime: localStorage.getItem("reservationTime"),
            status: "Pending",
          });
          // send confirmation mail that transport has been booked
          axios.post("http://127.0.0.1:8000/sendMail", {
            to: buyerEmail,
            name: "Faizan",
            subject: "Transport Booking Success!",
            body: `<p>Dear ${buyerName},</p>
           <p>Your booking of transport "${serviceName}" has been successfully confirmed.</p>
           <br/>
           <p><b>Departure Location:</b> ${t.city}, ${t.province}, ${
              t.country
            }</p>
           <p><b>Drop Off Location:</b> ${localStorage.getItem(
             "dropOffLocation"
           )}</p>
           <p><b>Reservation Date</b>: ${localStorage.getItem(
             "reservationDate"
           )}</p>
           <p><b>Reservation Time</b>: ${localStorage.getItem(
             "reservationTime"
           )}</p>
           <p><b>Number of Seats:</b> ${localStorage.getItem(
             "numberOfSeats"
           )}</p>
           <p><b>Seat Price Per Person:</b> Rs.${t.seatPricePerPerson}</p>
           <p><b>Amount Paid:</b> Rs.${amount}</p>
           <br/>
           <p>Thank you for using our service!</p>`,
          });
        }
        // when user clicks avail hotel or avail transport from bookings
        else if (JSON.parse(localStorage.getItem("updateTpBooking"))) {
          const action = JSON.parse(
            localStorage.getItem("updateTpBooking")
          ).action;
          const numberOfPeople = JSON.parse(
            localStorage.getItem("updateTpBooking")
          ).numberOfPeople;
          const serviceId = JSON.parse(
            localStorage.getItem("updateTpBooking")
          ).serviceId;
          const buyerId = JSON.parse(
            localStorage.getItem("updateTpBooking")
          ).buyerId;
          const previousAmount = JSON.parse(
            localStorage.getItem("updateTpBooking")
          ).previousAmount;
          const id = JSON.parse(localStorage.getItem("updateTpBooking"))._id;
          if (action == "Avail Hotel") {
            await axios.post("http://localhost:8000/updateTpBookingHotel", {
              _id: id,
              isAccommodationAvailed: true,
              numberOfRooms: numberOfPeople,
              amountPaid: parseFloat(amount) + parseFloat(previousAmount),
            });
          }
          if (action == "Avail Transport") {
            await axios.post("http://localhost:8000/updateTpBookingTransport", {
              _id: id,
              isTransportAvailed: true,
              numberOfSeats: numberOfPeople,
              amountPaid: parseFloat(amount) + parseFloat(previousAmount),
            });
          }
          // finally update the payment of the user
          await axios.post("http://127.0.0.1:8000/updatePaymentAfterAvailing", {
            userId: buyerId,
            serviceId,
            amountPaid: parseFloat(amount) + parseFloat(previousAmount),
          });
        } else if (
          JSON.parse(localStorage.getItem("currentService")).serviceType ===
          "Tour Package"
        ) {
          const tp = JSON.parse(localStorage.getItem("currentService")).service;
          console.log(tp);
          await axios.post("http://127.0.0.1:8000/bookTourPackage", {
            buyerId: userId,
            sellerId,
            serviceId,
            buyerName,
            sellerName,
            serviceName,
            buyerEmail,
            sellerEmail,
            amountPaid: amount,
            sellerContact: tp.contact,
            buyerContact: localStorage.getItem("customerContact"),
            departureDate: tp.departureDate,
            arrivalDate: tp.arrivalDate,
            summary: tp.summary || "-",
            inclusions: tp.inclusions || "-",
            exclusions: tp.exclusions || "-",
            hotelCompanyName: tp.hotelCompanyName,
            hotelRoomExpensePerPerson: tp.hotelRoomExpensePerPerson,
            transportExpensePerPerson: tp.transportExpensePerPerson,
            foodPricePerPerson: tp.foodPrice,
            numberOfSeats:
              JSON.parse(localStorage.getItem("isTransportAvailed")) &&
              JSON.parse(localStorage.getItem("numberOfSeats")),
            numberOfRooms:
              JSON.parse(localStorage.getItem("isAccommodationAvailed")) &&
              JSON.parse(localStorage.getItem("numberOfRooms")),
            price: tp.price,
            destination: tp.destination,
            province: tp.province,
            country: tp.country,
            departureCity: tp.departureCity,
            breakfast: tp.breakfast,
            lunch: tp.lunch,
            dinner: tp.dinner,
            foodPrice:
              tp.foodPrice * JSON.parse(localStorage.getItem("numberOfSeats")),
            transportType: tp.transportType,
            status: "Pending",
            city: tp.city,
            tourDuration: tp.tourDuration,
            businessName: tp.businessName,
            imageUrls: tp.imageUrls,
            isTransportAvailed: JSON.parse(
              localStorage.getItem("isTransportAvailed")
            ),
            isAccommodationAvailed: JSON.parse(
              localStorage.getItem("isAccommodationAvailed")
            ),
            numberOfPeople: JSON.parse(localStorage.getItem("numberOfPeople")),
          });
          // send confirmation mail that tour package has been booked
          axios.post("http://127.0.0.1:8000/sendMail", {
            to: buyerEmail,
            name: "Faizan",
            subject: "Tour Package Booking Success!",
            body: `<p>Dear ${buyerName},</p>
           <p>Your booking of tour package "${serviceName}" has been successfully confirmed.</p>
           <br/>
           <p><b>Departure City:</b> ${tp.departureCity}</p>
           <p><b>Destination City:</b> ${tp.city}</p>
           <p><b>Destination(s):</b> ${tp.destination}</p>
           <p><b>Departure Date:</b> ${tp.departureDate}</p>
           <p><b>Arrival Date:</b> ${tp.arrivalDate}</p>
           <p><b>Number of People:</b> ${localStorage.getItem(
             "numberOfPeople"
           )}</p>
           <p><b>Amount Paid:</b> Rs.${amount}</p>
           <br/>
           <p>Thank you for using our service!</p>`,
          });
        } else {
          await axios.post("http://127.0.0.1:8000/saveBooking", {
            buyerId: userId,
            sellerId,
            serviceId,
            serviceName,
            buyerName,
            sellerName,
            buyerEmail,
            sellerEmail,
            serviceType,
            amountPaid: amount,
          });
        }
        await axios.post("http://127.0.0.1:8000/savePurchasedService", {
          buyerId: userId,
          sellerId,
          serviceId,
          serviceName,
          buyerName,
          sellerName,
          buyerEmail,
          sellerEmail,
          serviceType,
          amountPaid: amount,
        });
        const tp = JSON.parse(localStorage.getItem("tpReceipt"));
        if (tp) {
          await axios.post("http://127.0.0.1:8000/saveTourPackageReceipt", {
            userId: tp.userId,
            serviceId,
            name: tp.name,
            departureCity: tp.departureCity,
            destinationCity: tp.destinationCity,
            bookingDate: tp.bookingDate,
            departureDate: tp.departureDate,
            arrivalDate: tp.arrivalDate,
            tourDuration: tp.tourDuration,
            hotelRoomExpensePerPerson: tp.hotelRoomExpensePerPerson,
            numberOfRooms: tp.numberOfRooms,
            transportExpensePerPerson: tp.transportExpensePerPerson,
            numberOfSeats: tp.numberOfSeats,
            foodPrice: tp.foodPrice,
            price: tp.price,
          });
        }
        toast({
          title: "Payment Successfull!",
          status: "success",
          isClosable: true,
          duration: 1000,
        });
        router.push("../results");
        localStorage.removeItem("currentService");
        localStorage.removeItem("tpReceipt");
        localStorage.removeItem("paymentPrice");
        localStorage.removeItem("reservationDate");
        localStorage.removeItem("reservationTime");
        localStorage.removeItem("bookingDate");
        localStorage.removeItem("dropOffLocation");
        localStorage.removeItem("numberOfRooms");
        localStorage.removeItem("numberOfSeats");
        localStorage.removeItem("customerContact");
        localStorage.removeItem("isTransportAvailed");
        localStorage.removeItem("isAccommodationAvailed");
        localStorage.removeItem("numberOfPeople");
        localStorage.removeItem("updateTpBooking");
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const getData = async () => {
      const response = await axios.post(
        "http://127.0.0.1:8000/findUserUsingEmail",
        {
          email: localStorage.getItem("currentUser"),
        }
      );
      const sellerResponse = await axios.post(
        "http://127.0.0.1:8000/getUserDetails",
        {
          userId:
            JSON.parse(localStorage.getItem("currentService")).service.userId ||
            JSON.parse(localStorage.getItem("currentService")).service.sellerId,
        }
      );
      console.log(response.data);
      setUserId(response.data._id);
      setBuyerName(response.data.username);
      setBuyerEmail(response.data.email);
      setSellerName(sellerResponse.data.username);
      setSellerEmail(sellerResponse.data.email);
      setSellerId(
        JSON.parse(localStorage.getItem("currentService")).service.userId ||
          JSON.parse(localStorage.getItem("currentService")).service.sellerId
      );
      setServiceId(
        JSON.parse(localStorage.getItem("currentService")).service._id
      );
      setServiceType(
        JSON.parse(localStorage.getItem("currentService")).serviceType
      );
      setServiceName(
        JSON.parse(localStorage.getItem("currentService")).serviceName
      );
      setAmount(
        // JSON.parse(localStorage.getItem("tpReceipt")).price ||
        localStorage.getItem("paymentPrice")
      );
    };
    if (localStorage.getItem("currentUser") === null) {
      router.push("../login");
    } else {
      getData();
      setIsLoggedIn(true);
    }
  }, []);

  const handleFullNameChange = (e) => {
    // Remove non-alphabet characters using a regular expression
    const formattedValue = e.target.value.replace(/[^a-zA-Z ]/g, "");
    setFullName(formattedValue);
  };

  return (
    isLoggedIn && (
      <Layout>
        <Box
          style={isMobile ? { fontSize: "small" } : { fontSize: "large" }}
          display="flex"
          justifyContent="center"
          color="white"
        >
          <Box className="col-sm-10 col-md-8 col-lg-8">
            <VStack
              className="col-sm-12"
              p="20px"
              borderRadius="10px"
              mt="20px"
              w="100%"
              bg="#143E56"
            >
              <HStack w="100%" justifyContent="space-between">
                <Text fontSize="larger" mb="0">
                  Payment
                </Text>
                <Text>Total Amount: Rs.{amount}</Text>
              </HStack>
              <Divider></Divider>
              <Tabs w="100%" isLazy variant="soft-rounded">
                <TabList>
                  <Tab
                    borderRadius="10px"
                    _selected={{ bg: "#2A656D", color: "white" }}
                  >
                    Credit Card
                  </Tab>
                  <Tab
                    borderRadius="10px"
                    _selected={{ bg: "#2A656D", color: "white" }}
                  >
                    Debit Card
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <VStack alignItems="flex-start" w="100%">
                      <Text fontSize="larger">Credit Card</Text>
                      <Text fontSize="small">
                        We accept credit card with Visa and MasterCard logo
                      </Text>
                      <FormControl mt="20px" isRequired>
                        <FormLabel pl="10px">Cardholder's Full Name*</FormLabel>
                        <Input
                          borderRadius="10px"
                          p="20px"
                          variant="flushed"
                          type="text"
                          placeholder="Full Name on card"
                          color="white"
                          value={fullName}
                          onChange={handleFullNameChange} // Handle Full Name change
                        />
                      </FormControl>
                      <FormControl
                        borderBottom="1px"
                        mt="20px"
                        borderRadius="10px"
                        pb="10px"
                        pl="10px"
                        isRequired
                      >
                        <FormLabel>Card Number*</FormLabel>
                        <CardNumberElement
                          options={{
                            style: {
                              base: {
                                color: "white",
                                fontFamily: "Roboto, sans-serif",
                                fontSize: "16px",
                                "::placeholder": {
                                  color: "gray",
                                },
                              },
                            },
                          }}
                        />
                      </FormControl>
                      {/* <Divider /> */}
                      <FormControl
                        borderBottom="1px"
                        borderRadius="10px"
                        pb="10px"
                        pl="10px"
                        mt="20px"
                        isRequired
                      >
                        <FormLabel>Expiration Date:*</FormLabel>
                        <CardExpiryElement
                          options={{
                            style: {
                              base: {
                                color: "white",
                                fontFamily: "Roboto, sans-serif",
                                fontSize: "16px",
                                "::placeholder": {
                                  color: "gray",
                                },
                              },
                            },
                          }}
                        />
                      </FormControl>
                      <FormControl
                        borderBottom="1px"
                        borderRadius="10px"
                        pb="10px"
                        pl="10px"
                        mt="20px"
                        isRequired
                      >
                        <FormLabel>CVC*</FormLabel>
                        <CardCvcElement
                          options={{
                            style: {
                              base: {
                                color: "white",
                                fontFamily: "Roboto, sans-serif",
                                fontSize: "16px",
                                "::placeholder": {
                                  color: "gray",
                                },
                              },
                            },
                          }}
                        />
                      </FormControl>
                      <Button
                        rightIcon={
                          <Image src="/images/shopping-cart.png" h="20px" />
                        }
                        mt="20px"
                        bg="#2A656D"
                        color="white"
                        _hover={{ opacity: 0.5 }}
                        onClick={handlePayNow}
                      >
                        Pay Now
                      </Button>
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <VStack alignItems="flex-start" w="100%">
                      <Text fontSize="larger">Debit Card</Text>
                      <Text fontSize="small">
                        We accept debit card with Visa and MasterCard logo
                      </Text>
                      <FormControl mt="20px" isRequired>
                        <FormLabel pl="10px">Cardholder's Full Name*</FormLabel>
                        <Input
                          borderRadius="10px"
                          p="20px"
                          variant="flushed"
                          type="text"
                          placeholder="Full Name on card"
                          color="white"
                          value={fullName}
                          onChange={handleFullNameChange} // Handle Full Name change
                        />
                      </FormControl>
                      <FormControl
                        borderBottom="1px"
                        borderRadius="10px"
                        pb="10px"
                        pl="10px"
                        mt="20px"
                        isRequired
                      >
                        <FormLabel>Card Number*</FormLabel>
                        <CardNumberElement
                          options={{
                            style: {
                              base: {
                                color: "white",
                                fontFamily: "Roboto, sans-serif",
                                fontSize: "16px",
                                "::placeholder": {
                                  color: "gray",
                                },
                              },
                            },
                          }}
                        />
                      </FormControl>
                      <FormControl
                        borderBottom="1px"
                        borderRadius="10px"
                        pb="10px"
                        pl="10px"
                        mt="20px"
                        isRequired
                      >
                        <FormLabel>Expiration Date:*</FormLabel>
                        <CardExpiryElement
                          options={{
                            style: {
                              base: {
                                color: "white",
                                fontFamily: "Roboto, sans-serif",
                                fontSize: "16px",
                                "::placeholder": {
                                  color: "gray",
                                },
                              },
                            },
                          }}
                        />
                      </FormControl>
                      <FormControl
                        borderBottom="1px"
                        borderRadius="10px"
                        pb="10px"
                        pl="10px"
                        mt="20px"
                        isRequired
                      >
                        <FormLabel>CVC*</FormLabel>
                        <CardCvcElement
                          options={{
                            style: {
                              base: {
                                color: "white",
                                fontFamily: "Roboto, sans-serif",
                                fontSize: "16px",
                                "::placeholder": {
                                  color: "gray",
                                },
                              },
                            },
                          }}
                        />
                      </FormControl>
                      <Button
                        rightIcon={
                          <Image src="/images/shopping-cart.png" h="20px" />
                        }
                        mt="20px"
                        bg="#2A656D"
                        color="white"
                        _hover={{ opacity: 0.5 }}
                        onClick={handlePayNow}
                      >
                        Pay Now
                      </Button>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </Box>
        </Box>
      </Layout>
    )
  );
}
