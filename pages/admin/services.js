import Layout from "../../components/adminLayout";
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
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import formatTimeToAMPM from "../../components/formatTime";

export default function () {
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      let data;
      const response = await axios.get("http://127.0.0.1:8000/getAllServices");
      data = response.data || null;
      setData(data);
      setFilteredData(data);

      // Calculate the total number of pages
      const totalRecords = data.length;
      const recordsPerPage = 10;
      setTotalPages(Math.ceil(totalRecords / recordsPerPage));
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredData(data);
      setSearchError(false); // Reset search error state
      return;
    }
    const filtered = data.filter((d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length === 0) {
      setSearchError(true); // Set search error if no matches found
    } else {
      setSearchError(false); // Reset search error if matches found
    }
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (filteredData) {
      // Calculate the total number of pages
      const totalRecords = filteredData.length;
      const recordsPerPage = 10;
      setTotalPages(Math.ceil(totalRecords / recordsPerPage));
      const startIndex = (currentPage - 1) * 10;
      const endIndex = startIndex + 10;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      setPaginatedData(paginatedData);
    }
  }, [currentPage, filteredData]);

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setSearchTerm(inputValue);
    setSearchError(false); // Reset search error when input changes
    if (!inputValue) {
      setFilteredData(data);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleActivate = async (d) => {
    await axios.post("http://localhost:8000/activateService", {
      userId: d.userId,
      serviceId: d._id,
    });
    // sending mail to owner of the service
    const userResponse = await axios.post(
      "http://localhost:8000/getUserDetails",
      { userId: d.userId }
    );
    // Refetch data and update state
    const response = await axios.get("http://127.0.0.1:8000/getAllServices");
    setData(response.data);
    setFilteredData(response.data);
    setCurrentPage(1);
    toast({
      title: "Service Activated",
      description: `${d.name} has been activated.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    await axios.post("http://localhost:8000/sendMail", {
      to: userResponse.data.email,
      subject: "Service Activated",
      body: `<p>Your service "${d.name}" has been activated.</p>`,
    });
  };

  const handleDeactivate = async (d) => {
    await axios.post("http://localhost:8000/deactivateService", {
      userId: d.userId,
      serviceId: d._id,
    });
    // sending mail to owner of the service
    const userResponse = await axios.post(
      "http://localhost:8000/getUserDetails",
      { userId: d.userId }
    );
    // Refetch data and update state
    const response = await axios.get("http://127.0.0.1:8000/getAllServices");
    setData(response.data);
    setFilteredData(response.data);
    setCurrentPage(1);
    toast({
      title: "Service Deactivated",
      description: `${d.name} has been deactivated.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    await axios.post("http://localhost:8000/sendMail", {
      to: userResponse.data.email,
      subject: "Service Deactivated",
      body: `<p>Your service "${d.name}" has been deactivated.</p>
      <p>You can submit complaint form from our website if you have any queries as to why it has been deactivated.</p>`,
    });
  };

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
        <InputGroup mb="4">
          <Input
            placeholder="Search by service name"
            value={searchTerm}
            onChange={handleChange}
            onKeyPress={handleKeyPress} // Handle search on Enter key press
          />
          <InputRightElement width="4.5rem" onClick={handleSearch}>
            <SearchIcon colorScheme="blue" />
          </InputRightElement>
        </InputGroup>
        <Text>Services</Text>
        <Table variant="simple">
          {/* <TableCaption color="white">Service Requests History</TableCaption> */}
          <Thead bg="#2A656D">
            <Tr>
              <Th border="0px" color="white">
                Service Name
              </Th>
              <Th border="0px" color="white">
                Service Type
              </Th>
              <Th border="0px" color="white">
                Status
              </Th>
              <Th border="0px" color="white">
                Action
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedData.length !== 0 &&
              paginatedData.map((d) => (
                <Tr key={d._id}>
                  <Td border="0px">{d.name}</Td>
                  <Td border="0px">
                    {d.hotelRoomExpensePerPerson &&
                    d.transportExpensePerPerson &&
                    d.foodPrice
                      ? "Tour Package"
                      : d.averageFoodRate
                      ? "Restaurant"
                      : d.hotelRoomExpensePerPerson
                      ? "Accommodation"
                      : d.seatPricePerPerson
                      ? "Transport"
                      : ""}
                  </Td>
                  <Td border="0px">
                    {d.status === "Approved" ? "Active" : d.status}
                  </Td>
                  <Td border="0px">
                    {d.status === "Approved" ? (
                      <Button
                        onClick={() => handleDeactivate(d)}
                        _hover={{ opacity: 0.5 }}
                        color="sm"
                        size="sm"
                        bg="#AC3116"
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleActivate(d)}
                        _hover={{ opacity: 0.5 }}
                        color="sm"
                        size="sm"
                        bg="#398D2C"
                      >
                        Activate
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            {searchError && (
              <Tr>
                <Td colSpan="6" textAlign="center" color="red">
                  No matching request found.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
        <div>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <Text as="span" ml="10px" mr="10px">
            Page {currentPage} of {totalPages}
          </Text>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </TableContainer>
    </Layout>
  );
}
