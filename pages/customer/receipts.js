import Layout from "../../components/layout";
import {
  Box,
  Grid,
  GridItem,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stack,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Receipts() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tp, setTp] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("currentUser")) {
      router.push("../login");
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let tp;
      const email = localStorage.getItem("currentUser");
      const userResponse = await axios.post(
        "http://127.0.0.1:8000/findUserUsingEmail",
        { email: email }
      );
      try {
        const receiptResponse = await axios.post(
          "http://127.0.0.1:8000/getTourPackageBookings",
          { userId: userResponse.data._id }
        );
        tp = receiptResponse.data;
      } catch (error) {
        tp = null;
        console.log(error);
      }
      setTp(tp);
    };
    isLoggedIn && fetchData();
  }, [isLoggedIn]);

  const capitalizeFirstChar = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleDownloadPDF = (receipt) => {
    const input = document.getElementById(`receipt-${receipt._id}`);

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate the scaling factor to fit the content within the A4 size
      const contentWidth = input.offsetWidth;
      const contentHeight = input.offsetHeight;
      const scalingFactor = Math.min(
        pdfWidth / contentWidth,
        pdfHeight / contentHeight
      );

      // Add the content to the PDF, scaling it to fit the A4 size
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        contentWidth * scalingFactor,
        contentHeight * scalingFactor
      );
      pdf.save(`receipt-${receipt._id}.pdf`);
    });
  };

  return (
    isLoggedIn && (
      <Layout>
        <Box w="100%" mt="40px" display="flex" justifyContent="center">
          <Box w="60%" borderRadius="10px" p="20px" bg="#143E56">
            <Heading size="md" textAlign="left">
              Receipts
            </Heading>
            {tp &&
              tp.map((d) => (
                // <Box
                //   key={d._id}
                //   id={`receipt-${d._id}`}
                //   display="flex"
                //   w="100%"
                //   mt="20px"
                //   p="10px"
                //   bg="white"
                //   color="black"
                // >
                //   <Box w="100%" fontSize="sm">
                //     <Text>
                //       ======================= RECEIPT ======================
                //     </Text>
                //     <Text textAlign="center">{d.name}</Text>
                //     <Grid templateColumns="repeat(2, 1fr)" gap={1}>
                //       <Text>Departure City:</Text>
                //       <Text>{capitalizeFirstChar(d.departureCity)}</Text>

                //       <Text>Destination City:</Text>
                //       <Text>{capitalizeFirstChar(d.destinationCity)}</Text>
                //     </Grid>
                //     <Text>
                //       ------------------------------------------------------------------------------------------
                //     </Text>
                //     <Grid templateColumns="repeat(2, 1fr)" gap={1}>
                //       <Text>Booking Date:</Text>
                //       <Text>{d.bookingDate}</Text>

                //       <Text>Departure Date:</Text>
                //       <Text>{d.departureDate}</Text>

                //       <Text>Arrival Date:</Text>
                //       <Text>{d.arrivalDate}</Text>

                //       <Text>Tour Duration:</Text>
                //       <Text>{d.tourDuration} days</Text>
                //     </Grid>
                //     <Text>
                //       ------------------------------------------------------------------------------------------
                //     </Text>
                //     <Grid templateColumns="repeat(2,1fr)" gap={1}>
                //       <>
                //         <Text>Accommodation:</Text>
                //         <Text>
                //           Rs.{d.hotelRoomExpensePerPerson * d.numberOfRooms}
                //         </Text>
                //         <Text>No. of rooms:</Text>
                //         <Text>{d.numberOfRooms}</Text>
                //       </>
                //       <>
                //         <Text>Transport:</Text>
                //         <Text>Rs.{d.transportExpensePerPerson}</Text>
                //         <Text>No. of seats:</Text>
                //         <Text>{d.numberOfSeats}</Text>
                //       </>

                //       <Text>Food Expense:</Text>
                //       <Text>Rs.{d.foodPrice}</Text>
                //     </Grid>
                //     <Text>
                //       ------------------------------------------------------------------------------------------
                //     </Text>
                //     <Grid templateColumns="repeat(2, 1fr)" gap={1}>
                //       <Text>Total Price:</Text>
                //       <Text>Rs.{d.price}</Text>
                //     </Grid>
                //     <Text>
                //       ===================================================
                //     </Text>
                //   </Box>
                //   <Button onClick={() => downloadPdf(d)}>Download PDF</Button>
                // </Box>
                // <Box
                //   bg="gray.50"
                //   minH="100vh"
                //   display="flex"
                //   justifyContent="center"
                //   alignItems="center"
                //   color="black"
                //   p={4}
                // >
                //   <Box bg="white" p={8} rounded="md" shadow="md" width="600px">
                //     <Heading as="h1" mb={4} textAlign="center">
                //       Tour Package Receipt
                //     </Heading>
                //     <Box mb={6}>
                //       <Heading as="h2" size="md" mb={2}>
                //         Travel Adventures
                //       </Heading>
                //       <Text>123 Travel Lane</Text>
                //       <Text>Wonderland, WL 12345</Text>
                //       <Text>Email: info@traveladventures.com</Text>
                //     </Box>
                //     <Box mb={6}>
                //       <Text>Receipt #: {d.userId}</Text>
                //       <Text>Service ID: {d.serviceId}</Text>
                //       <Text>Date: {d.bookingDate}</Text>
                //     </Box>
                //     <Box mb={6}>
                //       <Heading as="h3" size="md" mb={2}>
                //         Customer Information
                //       </Heading>
                //       {/* <Text>Name: {name}</Text> */}
                //       <Text>Departure City: {d.departureCity}</Text>
                //       <Text>Destination City: {d.destinationCity}</Text>
                //     </Box>
                //     <Box mb={6}>
                //       <Heading as="h3" size="md" mb={2}>
                //         Tour Package Details
                //       </Heading>
                //       <Table variant="simple">
                //         <Thead>
                //           <Tr>
                //             <Th>Description</Th>
                //             <Th>Details</Th>
                //           </Tr>
                //         </Thead>
                //         <Tbody>
                //           <Tr>
                //             <Td>Departure Date</Td>
                //             <Td>{d.departureDate}</Td>
                //           </Tr>
                //           <Tr>
                //             <Td>Arrival Date</Td>
                //             <Td>{d.arrivalDate}</Td>
                //           </Tr>
                //           <Tr>
                //             <Td>Tour Duration</Td>
                //             <Td>{d.tourDuration} days</Td>
                //           </Tr>
                //           <Tr>
                //             <Td>Hotel Room Expense (Per Person)</Td>
                //             <Td>Rs.{d.hotelRoomExpensePerPerson}</Td>
                //           </Tr>
                //           <Tr>
                //             <Td>Number of Rooms</Td>
                //             <Td>{d.numberOfRooms}</Td>
                //           </Tr>
                //           <Tr>
                //             <Td>Transport Expense (Per Person)</Td>
                //             <Td>Rs.{d.transportExpensePerPerson}</Td>
                //           </Tr>
                //           <Tr>
                //             <Td>Number of Seats</Td>
                //             <Td>{d.numberOfSeats}</Td>
                //           </Tr>
                //           <Tr>
                //             <Td>Food Price</Td>
                //             <Td>Rs.{d.foodPrice}</Td>
                //           </Tr>
                //           <Tr>
                //             <Td>Total Price</Td>
                //             <Td>Rs{d.price}</Td>
                //           </Tr>
                //         </Tbody>
                //       </Table>
                //     </Box>
                //     <Box textAlign="right" mb={6}>
                //       <Heading as="h3" size="lg">
                //         Total Amount Due: Rs.{d.price}
                //       </Heading>
                //     </Box>
                //     <Box textAlign="center">
                //       <Text>
                //         Thank you for choosing Travel Adventures! We hope you
                //         have an amazing trip.
                //       </Text>
                //     </Box>
                //   </Box>
                // </Box>
                <div class="receipt-container" id={`receipt-${d._id}`}>
                  <Heading size="md">Tour Package Receipt</Heading>
                  <div class="receipt-header">
                    <div class="company-info">
                      <Heading size="sm" id="businessName">
                        Tour Hunt
                      </Heading>
                      <p>Lahore</p>
                      <p>Punjab, Pakistan</p>
                      <p>Email: muhammadfaizanahmad3@gmail.com</p>
                    </div>
                    <div class="receipt-info">
                      <p>Receipt #: {`receipt-${d._id}`}</p>
                      <p>
                        Date:{" "}
                        {new Date().toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div class="customer-info">
                    <Heading size="sm">Customer Information</Heading>
                    <p>Name: {d.buyerName}</p>
                    <p>Contact: {d.buyerContact}</p>
                    <p>Email: {d.buyerEmail}</p>
                  </div>
                  <div class="seller-info">
                    <Heading size="sm">Seller Information</Heading>
                    <p>Name: {d.sellerName}</p>
                    <p>Contact: {d.sellerContact}</p>
                    <p>Email: {d.sellerEmail}</p>
                  </div>
                  <div class="tour-details">
                    <Heading size="sm">Tour Package Details</Heading>
                    <table>
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Service Name: {d.serviceName}</td>
                          <td>Number of People: {d.numberOfPeople}</td>
                          <td>
                            Price per Person: Rs.
                            {d.amountPaid / d.numberOfPeople}
                          </td>
                          <td>Rs.{d.amountPaid}</td>
                        </tr>
                        <tr>
                          <td>Hotel: {d.hotelCompanyName}</td>
                          <td>Rooms: {d.numberOfRooms}</td>
                          <td>
                            Room Expense per Person: Rs.
                            {d.hotelRoomExpensePerPerson}
                          </td>
                          <td>
                            Rs.
                            {d.hotelRoomExpensePerPerson * d.numberOfPeople}
                          </td>
                        </tr>
                        <tr>
                          <td>Transport: {d.transportType}</td>
                          <td>Seats: {d.numberOfSeats}</td>
                          <td>
                            Transport Expense per Person: Rs.
                            {d.transportExpensePerPerson}
                          </td>
                          <td>
                            Rs.
                            {d.transportExpensePerPerson * d.numberOfPeople}
                          </td>
                        </tr>
                        <tr>
                          <td>Food</td>
                          <td>Breakfast, Lunch, Dinner</td>
                          <td>Food Expense per Person: Rs.{d.foodPrice}</td>
                          <td>Rs.{d.foodPrice * d.numberOfPeople}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="summary">
                    <Heading size="sm">Summary</Heading>
                    <p>{d.summary.map((item) => item + ". ")}</p>
                  </div>
                  <div class="inclusions">
                    <Heading size="sm">Inclusions</Heading>
                    <p>{d.inclusions.map((item) => item + ", ")}</p>
                  </div>
                  <div class="exclusions">
                    <Heading size="sm">Exclusions</Heading>
                    <p>{d.exclusions.map((item) => item + ", ")}</p>
                  </div>
                  <div class="total">
                    <Heading size="sm" style={{ textAlign: "right" }}>
                      Total Amount Paid: Rs.{d.amountPaid}
                    </Heading>
                  </div>
                  <div class="footer">
                    <p>
                      Thank you for choosing Tour Hunt! We hope you have an
                      amazing trip.
                    </p>
                  </div>
                  <Button onClick={() => handleDownloadPDF(d)}>
                    Download as PDF
                  </Button>
                </div>
              ))}
          </Box>
        </Box>
      </Layout>
    )
  );
}
