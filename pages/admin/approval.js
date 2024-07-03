import Layout from "../../components/adminLayout";
import { useState, useEffect } from "react";
import styles from "../../styles/Approval.module.css";
import axios from "axios";
import {
  Table,
  TableContainer,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Text,
  Button,
  ButtonGroup,
  useToast,
} from "@chakra-ui/react";

export default function Approval() {
  const [active, setActive] = useState("Approvals");
  const [tp, setTp] = useState();
  const [r, setR] = useState();
  const [t, setT] = useState();
  const [a, setA] = useState();
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const tpResponse = await axios.get(
        "http://127.0.0.1:8000/getPendingTourPackages"
      );
      const rResponse = await axios.get(
        "http://127.0.0.1:8000/getPendingRestaurants"
      );
      const tResponse = await axios.get(
        "http://127.0.0.1:8000/getPendingTransports"
      );
      const aResponse = await axios.get(
        "http://127.0.0.1:8000/getPendingAccommodations"
      );
      const tourPackages = tpResponse.data || null;
      const restaurants = rResponse.data || null;
      const transports = tResponse.data || null;
      const accommodations = aResponse.data || null;
      setTp(tourPackages);
      setR(restaurants);
      setT(transports);
      setA(accommodations);
    };
    fetchData();
  }, []);

  function handleTpApprove(d) {
    const updateData = async () => {
      await axios.post(`http://127.0.0.1:8000/editBusinessTourPackage`, {
        _id: d._id,
        name: d.name,
        departureCity: d.departureCity,
        city: d.city,
        breakfast: d.breakfast,
        lunch: d.lunch,
        dinner: d.dinner,
        transportType: d.transportType,
        hotelCompanyName: d.hotelCompanyName,
        tourDuration: d.tourDuration,
        foodPrice: d.foodPrice,
        hotelRoomExpensePerPerson: d.hotelRoomExpensePerPerson,
        transportExpensePerPerson: d.transportExpensePerPerson,
        imageUrls: d.imageUrls,
        price: d.price,
        destination: d.destination,
        province: d.province,
        country: d.country,
        status: "Approved",
        userId: d.userId,
        businessName: d.businessName,
      });
      const userDetailsResponse = await axios.post(
        "http://127.0.0.1:8000/getUserDetails",
        { userId: d.userId }
      );
      const username = userDetailsResponse.data.username;
      const email = userDetailsResponse.data.email;
      const requestsHistoryResponse = await axios.post(
        "http://127.0.0.1:8000/saveRequest",
        {
          userId: d.userId,
          requestType: "Tour Package Registration",
          requestName: d.name,
          username: username,
          email: email,
          requestStatus: "Approved",
        }
      );
      toast({
        title: "Request Approved!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      const updatedTourPackages = tp.filter((t) => t._id !== d._id);
      setTp(updatedTourPackages);
      await axios.post("http://127.0.0.1:8000/sendMail", {
        to: email,
        name: "Faizan",
        subject: "Tour Package Registration Approved!",
        body: `<p>Dear ${username},</p>
           <p>Your registration of tour package "${d.name}" has been successfully approved by the admin.</p>
           <p>Thank you for using our service!</p>`,
      });
    };
    updateData();
  }

  function handleTpReject(d) {
    const deleteData = async () => {
      const userDetailsResponse = await axios.post(
        "http://127.0.0.1:8000/getUserDetails",
        { userId: d.userId }
      );
      const username = userDetailsResponse.data.username;
      const email = userDetailsResponse.data.email;
      const requestsHistoryResponse = await axios.post(
        "http://127.0.0.1:8000/saveRequest",
        {
          userId: d.userId,
          requestType: "Tour Package Registration",
          requestName: d.name,
          username: username,
          email: email,
          requestStatus: "Rejected",
        }
      );
      toast({
        title: "Request Rejected!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await axios.post("http://127.0.0.1:8000/deleteBusinessTourPackage", {
        id: d._id,
      });
      const updatedTourPackages = tp.filter((t) => t._id !== d._id);
      setTp(updatedTourPackages);
      await axios.post("http://127.0.0.1:8000/sendMail", {
        to: email,
        name: "Faizan",
        subject: "Tour Package Registration Rejected!",
        body: `<p>Dear ${username},</p>
           <p>Your registration of tour package "${d.name}" has been rejected by the admin.</p>
           <p>Kindly contact us for more details.</p>`,
      });
    };
    deleteData();
  }

  function handleRApprove(d) {
    const updateData = async () => {
      await axios.post(`http://127.0.0.1:8000/editRestaurant`, {
        _id: d._id,
        userId: d.userId,
        name: d.name,
        businessName: d.businessName,
        cuisine: d.cuisine,
        city: d.city,
        province: d.province,
        country: d.country,
        averageFoodRate: d.averageFoodRate,
        contact: d.contact,
        opening_hours: d.opening_hours,
        reservation: d.reservation,
        imageUrls: d.imageUrls,
        status: "Approved",
      });
      const userDetailsResponse = await axios.post(
        "http://127.0.0.1:8000/getUserDetails",
        { userId: d.userId }
      );
      const username = userDetailsResponse.data.username;
      const email = userDetailsResponse.data.email;
      const requestsHistoryResponse = await axios.post(
        "http://127.0.0.1:8000/saveRequest",
        {
          userId: d.userId,
          requestType: "Restaurant Registration",
          requestName: d.name,
          username: username,
          email: email,
          requestStatus: "Approved",
        }
      );
      toast({
        title: "Request Approved!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      const updatedRestaurants = r.filter((t) => t._id !== d._id);
      setR(updatedRestaurants);
      await axios.post("http://127.0.0.1:8000/sendMail", {
        to: email,
        name: "Faizan",
        subject: "Restaurant Registration Approved!",
        body: `<p>Dear ${username},</p>
           <p>Your registration of restaurant "${d.name}" has been successfully approved by the admin.</p>
           <p>Thank you for using our service!.</p>`,
      });
    };
    updateData();
  }

  function handleRReject(d) {
    const deleteData = async () => {
      const userDetailsResponse = await axios.post(
        "http://127.0.0.1:8000/getUserDetails",
        { userId: d.userId }
      );
      const username = userDetailsResponse.data.username;
      const email = userDetailsResponse.data.email;
      const requestsHistoryResponse = await axios.post(
        "http://127.0.0.1:8000/saveRequest",
        {
          userId: d.userId,
          requestType: "Restaurant Registration",
          requestName: d.name,
          username: username,
          email: email,
          requestStatus: "Rejected",
        }
      );
      toast({
        title: "Request Rejected!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await axios.post("http://127.0.0.1:8000/deleteRestaurant", { id: d._id });
      const updatedRestaurants = r.filter((t) => t._id !== d._id);
      setR(updatedRestaurants);
      await axios.post("http://127.0.0.1:8000/sendMail", {
        to: email,
        name: "Faizan",
        subject: "Restaurant Registration Rejected!",
        body: `<p>Dear ${username},</p>
           <p>Your registration of restaurant "${d.name}" has been rejected by the admin.</p>
           <p>Kindly contact us for more details.</p>`,
      });
    };
    deleteData();
  }

  function handleTApprove(d) {
    const updateData = async () => {
      await axios.post(`http://127.0.0.1:8000/editTransport`, {
        _id: d._id,
        userId: d.userId,
        name: d.name,
        businessName: d.businessName,
        seatPricePerPerson: d.seatPricePerPerson,
        amenities: d.amenities,
        city: d.city,
        province: d.province,
        country: d.country,
        contact: d.contact,
        transportType: d.transportType,
        status: "Approved",
        capacity: d.capacity,
        imageUrls: d.imageUrls,
      });
      const userDetailsResponse = await axios.post(
        "http://127.0.0.1:8000/getUserDetails",
        { userId: d.userId }
      );
      const username = userDetailsResponse.data.username;
      const email = userDetailsResponse.data.email;
      const requestsHistoryResponse = await axios.post(
        "http://127.0.0.1:8000/saveRequest",
        {
          userId: d.userId,
          requestType: "Transport Registration",
          requestName: d.name,
          username: username,
          email: email,
          requestStatus: "Approved",
        }
      );
      toast({
        title: "Request Approved!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      const updatedTransports = t.filter((tr) => tr._id !== d._id);
      setT(updatedTransports);
      await axios.post("http://127.0.0.1:8000/sendMail", {
        to: email,
        name: "Faizan",
        subject: "Transport Registration Approved!",
        body: `<p>Dear ${username},</p>
           <p>Your registration of transport "${d.name}" has been successfully approved by the admin.</p>
           <p>Thank you for using our service!</p>`,
      });
    };
    updateData();
  }

  function handleTReject(d) {
    const deleteData = async () => {
      const userDetailsResponse = await axios.post(
        "http://127.0.0.1:8000/getUserDetails",
        { userId: d.userId }
      );
      const username = userDetailsResponse.data.username;
      const email = userDetailsResponse.data.email;
      const requestsHistoryResponse = await axios.post(
        "http://127.0.0.1:8000/saveRequest",
        {
          userId: d.userId,
          requestType: "Transport Registration",
          requestName: d.name,
          username: username,
          email: email,
          requestStatus: "Rejected",
        }
      );
      toast({
        title: "Request Rejected!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await axios.post("http://127.0.0.1:8000/deleteTransport", { id: d._id });
      const updatedTransports = t.filter((tr) => tr._id !== d._id);
      setT(updatedTransports);
      await axios.post("http://127.0.0.1:8000/sendMail", {
        to: email,
        name: "Faizan",
        subject: "Transport Registration Rejected!",
        body: `<p>Dear ${username},</p>
           <p>Your registration of transport "${d.name}" has been rejected by the admin.</p>
           <p>Kindly contact us for more details.</p>`,
      });
    };
    deleteData();
  }

  function handleAApprove(d) {
    const updateData = async () => {
      await axios.post(`http://127.0.0.1:8000/editAccommodation`, {
        _id: d._id,
        userId: d.userId,
        name: d.name,
        businessName: d.businessName,
        contact: d.contact,
        city: d.city,
        province: d.province,
        country: d.country,
        amenities: d.amenities,
        hotelRoomExpensePerPerson: d.hotelRoomExpensePerPerson,
        imageUrls: d.imageUrls,
        status: "Approved",
      });
      const userDetailsResponse = await axios.post(
        "http://127.0.0.1:8000/getUserDetails",
        { userId: d.userId }
      );
      const username = userDetailsResponse.data.username;
      const email = userDetailsResponse.data.email;
      const requestsHistoryResponse = await axios.post(
        "http://127.0.0.1:8000/saveRequest",
        {
          userId: d.userId,
          requestType: "Accommodation Registration",
          requestName: d.name,
          username: username,
          email: email,
          requestStatus: "Approved",
        }
      );
      toast({
        title: "Request Approved!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      const updatedAccommodations = a.filter((ac) => ac._id !== d._id);
      setA(updatedAccommodations);
      await axios.post("http://127.0.0.1:8000/sendMail", {
        to: email,
        name: "Faizan",
        subject: "Accommodation Registration Approved!",
        body: `<p>Dear ${username},</p>
           <p>Your registration of accommodation "${d.name}" has been successfully approved by the admin.</p>
           <p>Thank you for using our service!</p>`,
      });
    };
    updateData();
  }

  function handleAReject(d) {
    const deleteData = async () => {
      const userDetailsResponse = await axios.post(
        "http://127.0.0.1:8000/getUserDetails",
        { userId: d.userId }
      );
      const username = userDetailsResponse.data.username;
      const email = userDetailsResponse.data.email;
      const requestsHistoryResponse = await axios.post(
        "http://127.0.0.1:8000/saveRequest",
        {
          userId: d.userId,
          requestType: "Accommodation Registration",
          requestName: d.name,
          username: username,
          email: email,
          requestStatus: "Rejected",
        }
      );
      toast({
        title: "Request Rejected!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await axios.post("http://127.0.0.1:8000/deleteAccommodation", {
        id: d._id,
      });
      const updatedAccommodations = a.filter((ac) => ac._id !== d._id);
      setA(updatedAccommodations);
      await axios.post("http://127.0.0.1:8000/sendMail", {
        to: email,
        name: "Faizan",
        subject: "Accommodation Registration Rejected!",
        body: `<p>Dear ${username},</p>
           <p>Your registration of accommodation "${d.name}" has been rejected by the admin.</p>
           <p>Kindly contact us for more details.</p>`,
      });
    };
    deleteData();
  }

  return (
    <Layout>
      <TableContainer
        p="20px"
        bg="#143E56"
        overflow="auto"
        mt="40px"
        ml="20px"
        w="75%"
        fontWeight="500"
      >
        {tp ? (
          <Text>Service Requests</Text>
        ) : (
          <Text>No service requests yet</Text>
        )}

        <Table fontSize="smaller" variant="simple">
          {/* <TableCaption color="white">Service Requests History</TableCaption> */}
          <Thead bg="#2A656D">
            <Tr>
              <Th border="0px" color="white">
                Service Name
              </Th>
              <Th border="0px" color="white">
                Business Name
              </Th>
              <Th border="0px" color="white">
                Contact
              </Th>
              <Th border="0px" color="white">
                Service Type
              </Th>
              <Th border="0px" color="white">
                Pricing
              </Th>
              <Th border="0px" color="white">
                City
              </Th>
              <Th border="0px" color="white">
                Province
              </Th>
              <Th border="0px" color="white">
                Country
              </Th>
              <Th border="0px" color="white">
                Request Time
              </Th>
              <Th border="0px" color="white">
                Action
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {tp &&
              tp.map((d) => (
                <Tr key={d._id}>
                  <Td border="0px">{d.name}</Td>
                  <Td border="0px">{d.businessName}</Td>
                  <Td border="0px">{d.contact}</Td>
                  <Td border="0px">Tour Package</Td>
                  <Td border="0px">Rs.{d.price}</Td>
                  <Td border="0px">{d.city}</Td>
                  <Td border="0px">{d.province}</Td>
                  <Td border="0px">{d.country}</Td>
                  <Td border="0px">
                    {d.createdAt.split("T")[0] +
                      " " +
                      d.createdAt.split("T")[1].split(".")[0]}
                  </Td>
                  <Td border="0px">
                    <ButtonGroup paddingTop="5px">
                      <Button
                        onClick={() => handleTpApprove(d)}
                        _hover={{ opacity: 0.5 }}
                        color="sm"
                        size="sm"
                        bg="#398D2C"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleTpReject(d)}
                        _hover={{ opacity: 0.5 }}
                        color="sm"
                        size="sm"
                        bg="#AC3116"
                      >
                        Reject
                      </Button>
                    </ButtonGroup>
                  </Td>
                </Tr>
              ))}
            {r &&
              r.map((d) => (
                <Tr key={d._id}>
                  <Td border="0px">{d.name}</Td>
                  <Td border="0px">{d.businessName}</Td>
                  <Td border="0px">{d.contact}</Td>
                  <Td border="0px">Restaurant</Td>
                  <Td border="0px">Rs.{d.reservationCharges}</Td>
                  <Td border="0px">{d.city}</Td>
                  <Td border="0px">{d.province}</Td>
                  <Td border="0px">{d.country}</Td>
                  <Td border="0px">
                    {d.createdAt.split("T")[0] +
                      " " +
                      d.createdAt.split("T")[1].split(".")[0]}
                  </Td>
                  <Td border="0px">
                    <ButtonGroup paddingTop="5px">
                      <Button
                        onClick={() => handleRApprove(d)}
                        _hover={{ opacity: 0.5 }}
                        color="sm"
                        size="sm"
                        bg="#398D2C"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleRReject(d)}
                        _hover={{ opacity: 0.5 }}
                        color="sm"
                        size="sm"
                        bg="#AC3116"
                      >
                        Reject
                      </Button>
                    </ButtonGroup>
                  </Td>
                </Tr>
              ))}
            {t &&
              t.map((d) => (
                <Tr key={d._id}>
                  <Td border="0px">{d.name}</Td>
                  <Td border="0px">{d.businessName}</Td>
                  <Td border="0px">{d.contact}</Td>
                  <Td border="0px">Transport</Td>
                  <Td border="0px">Rs.{d.seatPricePerPerson}</Td>
                  <Td border="0px">{d.city}</Td>
                  <Td border="0px">{d.province}</Td>
                  <Td border="0px">{d.country}</Td>
                  <Td border="0px">
                    {d.createdAt.split("T")[0] +
                      " " +
                      d.createdAt.split("T")[1].split(".")[0]}
                  </Td>
                  <Td border="0px">
                    <ButtonGroup paddingTop="5px">
                      <Button
                        onClick={() => handleTApprove(d)}
                        _hover={{ opacity: 0.5 }}
                        color="sm"
                        size="sm"
                        bg="#398D2C"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleTReject(d)}
                        _hover={{ opacity: 0.5 }}
                        color="sm"
                        size="sm"
                        bg="#AC3116"
                      >
                        Reject
                      </Button>
                    </ButtonGroup>
                  </Td>
                </Tr>
              ))}
            {a &&
              a.map((d) => (
                <Tr key={d._id}>
                  <Td border="0px">{d.name}</Td>
                  <Td border="0px">{d.businessName}</Td>
                  <Td border="0px">{d.contact}</Td>
                  <Td border="0px">Accommodation</Td>
                  <Td border="0px">Rs.{d.hotelRoomExpensePerPerson}</Td>
                  <Td border="0px">{d.city}</Td>
                  <Td border="0px">{d.province}</Td>
                  <Td border="0px">{d.country}</Td>
                  <Td border="0px">
                    {d.createdAt.split("T")[0] +
                      " " +
                      d.createdAt.split("T")[1].split(".")[0]}
                  </Td>
                  <Td border="0px">
                    <ButtonGroup paddingTop="5px">
                      <Button
                        onClick={() => handleAApprove(d)}
                        _hover={{ opacity: 0.5 }}
                        color="sm"
                        size="sm"
                        bg="#398D2C"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleAReject(d)}
                        _hover={{ opacity: 0.5 }}
                        color="sm"
                        size="sm"
                        bg="#AC3116"
                      >
                        Reject
                      </Button>
                    </ButtonGroup>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
}
