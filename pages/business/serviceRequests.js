import Layout from "../../components/businessLayout";
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
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import formatTimeToAMPM from "../../components/formatTime";

export default function ServiceRequests() {
  const [pendingTourPackages, setPendingTourPackages] = useState([]);
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [pendingTransports, setPendingTransports] = useState([]);
  const [pendingAccommodations, setPendingAccommodations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem("currentUser");
      const userResponse = await axios.post(
        "http://127.0.0.1:8000/findUserUsingEmail",
        { email: email }
      );
      const userId = userResponse.data._id;
      const pendingTourPackagesRequests = await axios.post(
        "http://127.0.0.1:8000/getPendingTourPackages",
        { userId }
      );
      const pendingRestaurantsResponse = await axios.post(
        "http://127.0.0.1:8000/getPendingRestaurants",
        { userId }
      );
      const pendingTransportsResponse = await axios.post(
        "http://127.0.0.1:8000/getPendingTransports",
        { userId }
      );
      const pendingAccommodatoinsResponse = await axios.post(
        "http://127.0.0.1:8000/getPendingAccommodations",
        { userId }
      );
      const pendingTransports = pendingTransportsResponse.data || null;
      const pendingRestaurants = pendingRestaurantsResponse.data || null;
      const pendingTourPackages = pendingTourPackagesRequests.data || null;
      const pendingAccommodations = pendingAccommodatoinsResponse.data || null;
      setPendingTourPackages(pendingTourPackages);
      setPendingRestaurants(pendingRestaurants);
      setPendingTransports(pendingTransports);
      setPendingAccommodations(pendingAccommodations);
    };
    fetchData();
  }, []);

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
        <Text
          textAlign="center"
          letterSpacing="2px"
          fontWeight="500"
          fontSize="25px"
        >
          Service Requests
        </Text>
        <Table variant="simple">
          {pendingTourPackages.length !== 0 ||
          pendingRestaurants.length !== 0 ||
          pendingAccommodations.length !== 0 ||
          pendingTransports.length !== 0 ? (
            ""
          ) : (
            <TableCaption color="white">
              No service requests are pending for approval
            </TableCaption>
          )}

          <Thead bg="#2A656D">
            <Tr>
              <Th border="0px" color="white">
                Request Type
              </Th>
              <Th border="0px" color="white">
                Name
              </Th>
              <Th border="0px" color="white">
                Request Status
              </Th>
              <Th border="0px" color="white">
                Request Time
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {pendingTourPackages &&
              pendingTourPackages.map((d) => (
                <Tr key={d._id}>
                  <Td border="0px">Tour Package</Td>
                  <Td border="0px">{d.name}</Td>
                  <Td border="0px">{d.status}</Td>
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
            {pendingRestaurants &&
              pendingRestaurants.map((d) => (
                <Tr key={d._id}>
                  <Td border="0px">Restaurant</Td>
                  <Td border="0px">{d.name}</Td>
                  <Td border="0px">{d.status}</Td>
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
            {pendingTransports &&
              pendingTransports.map((d) => (
                <Tr key={d._id}>
                  <Td border="0px">Transport</Td>
                  <Td border="0px">{d.name}</Td>
                  <Td border="0px">{d.status}</Td>
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
            {pendingAccommodations &&
              pendingAccommodations.map((d) => (
                <Tr key={d._id}>
                  <Td border="0px">Accommodation</Td>
                  <Td border="0px">{d.name}</Td>
                  <Td border="0px">{d.status}</Td>
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
          </Tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
}
