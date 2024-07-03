import { useState, useEffect } from "react";
import Layout from "../../components/adminLayout";
import axios from "axios";
import {
  Button,
  ButtonGroup,
  useToast,
  InputGroup,
  InputRightElement,
  Input,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export default function BusinessRequests() {
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      let businessInvites;
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/getBusinessInvites"
        );
        businessInvites = response.data;
      } catch (error) {
        businessInvites = null;
      }
      setData(businessInvites);
      setFilteredData(businessInvites);
    };
    fetchData();
  }, []);

  const updateData = (id) => {
    const updatedData = data.filter((dat) => dat._id !== id);
    setData(updatedData);
    setFilteredData(data);
  };

  const handleApprove = async (d) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/approveBusiness",
        {
          userId: d.userId,
          businessName: d.businessName,
          location: d.location,
          contact: d.contact,
          services: d.services,
          status: "Approved",
        }
      );
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
          requestType: "Business Profile Approval",
          requestName: d.businessName,
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
      console.log("Business approved!");
      updateData(d._id);
      const r = await axios.post("http://127.0.0.1:8000/deleteBusinessInvite", {
        id: d._id,
      });
      // sending mail to recipient
      await axios.post("http://127.0.0.1:8000/sendMail", {
        to: email,
        name: "Faizan",
        subject: "Business Profile Approved",
        body: `<p>Dear ${username},</p>
           <p>Your business profile for ${d.businessName} has been approved by the admin.</p>
           <p>Thank you!</p>`,
      });
    } catch (error) {
      console.log("Something went wrong!");
    }
  };

  const handleReject = async (d) => {
    try {
      const r = await axios.post("http://127.0.0.1:8000/deleteBusinessInvite", {
        id: d._id,
        userId: d.userId,
        businessName: d.businessName,
        location: d.location,
        contact: d.contact,
        services: d.services,
        status: "Rejected",
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
          requestType: "Business Profile Approval",
          requestName: d.businessName,
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
      updateData(d._id);
      // sending mail to recipient
      await axios.post("http://127.0.0.1:8000/sendMail", {
        to: email,
        name: "Faizan",
        subject: "Business Profile Rejected",
        body: `<p>Dear ${username},</p>
           <p>Unfortunately, your business profile for ${d.businessName} has been rejected by the admin.</p>
           <p>Please contact us for further details.</p>`,
      });
    } catch (error) {
      console.log("Something went wrong!");
    }
  };

  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredData(data);
      setSearchError(false);
      return;
    }

    const filtered = data.filter((d) =>
      d.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filtered.length === 0) {
      setSearchError(true);
    } else {
      setSearchError(false);
    }

    setFilteredData(filtered);
  };

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setSearchTerm(inputValue);
    setSearchError(false);
    if (!inputValue) {
      setFilteredData(data);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Layout>
      {/* <VStack>
        <TableContainer mt="40px">
          <Table variant="simple">
            <TableCaption color="whiteAlpha.600">
              Pending Business Requests
            </TableCaption>
            <Thead>
              <Tr>
                <Th color="whiteAlpha.600">Business Name</Th>
                <Th color="whiteAlpha.600">Location</Th>
                <Th color="whiteAlpha.600">Contact</Th>
                <Th color="whiteAlpha.600">Service(s) Offering</Th>
                <Th color="whiteAlpha.600">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Faizan Business</Td>
                <Td>Lahore, Punjab, Pakistan</Td>
                <Td>03134038517</Td>
                <Td>
                  Tour Packages <br />
                  Food <br />
                  Transports <br />
                  Accommodaitons
                </Td>
                <Td>
                  <ButtonGroup>
                    <Button
                      size="sm"
                      bg="#398D2C"
                      color="white"
                      _hover={{ opacity: 0.5 }}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      bg="#AC3116"
                      color="white"
                      _hover={{ opacity: 0.5 }}
                    >
                      Reject
                    </Button>
                  </ButtonGroup>
                </Td>
              </Tr>
            </Tbody>
            <Tfoot>
              <Tr>
                <Th color="whiteAlpha.600">Business Name</Th>
                <Th color="whiteAlpha.600">Location</Th>
                <Th color="whiteAlpha.600">Contact</Th>
                <Th color="whiteAlpha.600">Service(s) Offering</Th>
                <Th color="whiteAlpha.600">Action</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </VStack> */}
      <div
        style={{
          backgroundColor: "#143E56",
          display: "flex",
          flexDirection: "column",
          fontWeight: "bold",
          marginLeft: "2%",
          marginTop: 39,
          padding: 20,
          borderRadius: 10,
          width: "75%",
          gap: 10,
          overflow: "auto",
        }}
      >
        <InputGroup mb="4">
          <Input
            placeholder="Search by business name"
            value={searchTerm}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
          <InputRightElement width="4.5rem" onClick={handleSearch}>
            <SearchIcon colorScheme="blue" />
          </InputRightElement>
        </InputGroup>

        {data ? <p>Business Requests</p> : <p>No Business Requests yet</p>}

        <table className="custom-table">
          <thead style={{ backgroundColor: "#2A656D" }}>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  paddingLeft: 20,
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              >
                Business Name
              </th>
              <th
                style={{
                  paddingLeft: 20,
                  textAlign: "left",
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              >
                Location
              </th>
              <th
                style={{
                  paddingLeft: 20,
                  textAlign: "left",
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              >
                Contact
              </th>
              <th
                style={{
                  paddingLeft: 20,
                  textAlign: "left",
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              >
                CNIC
              </th>
              <th
                style={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  textAlign: "left",
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              >
                NTN
              </th>
              <th
                style={{
                  textAlign: "left",
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingRight: 20,
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody style={{ fontWeight: "normal" }}>
            {searchError ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "red" }}>
                  No such record found in business account request.
                </td>
              </tr>
            ) : (
              filteredData &&
              filteredData.map((d) => (
                <tr key={d._id}>
                  <td className="table-td">{d.businessName}</td>
                  <td className="table-td">
                    {d.city + " " + d.province + " " + d.country}
                  </td>
                  <td className="table-td">{d.contact}</td>
                  <td className="table-td">{d.cnic}</td>
                  {/* <td
                    className="table-td"
                    dangerouslySetInnerHTML={{
                      __html: d.services.join("<br />"),
                    }}
                  ></td> */}
                  <td className="table-td">{d.ntn}</td>
                  <td>
                    <ButtonGroup paddingTop="5px">
                      <Button
                        onClick={() => handleApprove(d)}
                        _hover={{ opacity: 0.5 }}
                        color="sm"
                        size="sm"
                        bg="#398D2C"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(d)}
                        _hover={{ opacity: 0.5 }}
                        color="sm"
                        size="sm"
                        bg="#AC3116"
                      >
                        Reject
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
