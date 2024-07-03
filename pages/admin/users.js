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

  useEffect(() => {
    const fetchData = async () => {
      let data;
      const requestsHistoryResponse = await axios.get(
        "http://127.0.0.1:8000/getAllUsers"
      );
      data = requestsHistoryResponse.data || null;
      setData(data);
      setFilteredData(data);
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredData(data);
      setSearchError(false); // Reset search error state
      return;
    }

    const filtered = data.filter(
      (d) =>
        d.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filtered.length === 0) {
      setSearchError(true); // Set search error if no matches found
    } else {
      setSearchError(false); // Reset search error if matches found
    }

    setFilteredData(filtered);
  };

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
            placeholder="Search by username or email"
            value={searchTerm}
            onChange={handleChange}
            onKeyPress={handleKeyPress} // Handle search on Enter key press
          />
          <InputRightElement width="4.5rem" onClick={handleSearch}>
            <SearchIcon colorScheme="blue" />
          </InputRightElement>
        </InputGroup>
        <Text>Users</Text>
        <Table variant="simple">
          {/* <TableCaption color="white">Service Requests History</TableCaption> */}
          <Thead bg="#2A656D">
            <Tr>
              <Th border="0px" color="white">
                Username
              </Th>
              <Th border="0px" color="white">
                Email
              </Th>
              <Th border="0px" color="white">
                Gender
              </Th>
              <Th border="0px" color="white">
                Registration Date/Time
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredData &&
              filteredData.map((d) => (
                <Tr key={d._id}>
                  <Td border="0px">{d.username}</Td>
                  <Td border="0px">{d.email}</Td>
                  <Td border="0px">{d.gender}</Td>
                  <Td border="0px">
                    {d.createdAt &&
                      d.createdAt.split("T")[0] +
                        " " +
                        formatTimeToAMPM(
                          d.createdAt.split("T")[1].split(".")[0]
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
      </TableContainer>
    </Layout>
  );
}
