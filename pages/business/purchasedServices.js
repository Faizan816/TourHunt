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

export default function PurchasedServices() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let data;
      const email = localStorage.getItem("currentUser");
      const userResponse = await axios.post(
        "http://127.0.0.1:8000/findUserUsingEmail",
        { email: email }
      );
      try {
        const purchasedServicesResponse = await axios.post(
          "http://127.0.0.1:8000/getPurchasedServices",
          { userId: userResponse.data._id }
        );
        data = purchasedServicesResponse.data;
      } catch (error) {
        data = null;
        console.log(error);
      }
      setData(data);
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
        w="80%"
        fontWeight="500"
      >
        <Text
          textAlign="center"
          letterSpacing="2px"
          fontWeight="500"
          fontSize="25px"
        >
          Purchased Services
        </Text>
        <Table variant="simple">
          {data.length !== 0 ? (
            <TableCaption color="white">
              Your services purchased by customers
            </TableCaption>
          ) : (
            <TableCaption color="white">
              No service has been purchased by any customer yet
            </TableCaption>
          )}
          <Thead bg="#2A656D">
            <Tr>
              <Th border="0px" color="white">
                Service Type
              </Th>
              <Th border="0px" color="white">
                Service Name
              </Th>
              <Th border="0px" color="white">
                Buyer Name
              </Th>
              <Th border="0px" color="white">
                Buyer Email
              </Th>
              <Th border="0px" color="white">
                Amount Paid
              </Th>
              <Th border="0px" color="white">
                Purchased At
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data &&
              data.map((d) => (
                <Tr key={d._id}>
                  <Td border="0px">{d.serviceType}</Td>
                  <Td border="0px">{d.serviceName}</Td>
                  <Td border="0px">{d.buyerName}</Td>
                  <Td border="0px">{d.buyerEmail}</Td>
                  <Td border="0px">Rs.{d.amountPaid}</Td>
                  <Td border="0px">
                    {d.updatedAt &&
                      d.updatedAt.split("T")[0] +
                        " " +
                        formatTimeToAMPM(
                          d.updatedAt.split("T")[1].split(".")[0]
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
