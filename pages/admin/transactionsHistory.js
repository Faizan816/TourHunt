import { useEffect, useState } from "react";
import Layout from "../../components/adminLayout";
import axios from "axios";
import {
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
} from "@chakra-ui/react";

export default function TransactionsHistory() {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const bookingsResponse = await axios.get(
        "http://127.0.0.1:8000/getBookings"
      );
      const bookings = bookingsResponse.data || null;
      setData(bookings);
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
        <Text>Transactions History</Text>
        <Table fontSize="smaller" variant="simple">
          <Thead bg="#2A656D">
            <Tr>
              <Th border="0px" color="white">
                Buyer Name
              </Th>
              <Th border="0px" color="white">
                Seller Name
              </Th>
              <Th border="0px" color="white">
                Buyer Email
              </Th>
              <Th border="0px" color="white">
                Seller Email
              </Th>
              <Th border="0px" color="white">
                Amount Paid By Buyer
              </Th>
              <Th border="0px" color="white">
                Service Type
              </Th>
              <Th border="0px" color="white">
                Service Name
              </Th>
              <Th border="0px" color="white">
                Transaction Time
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data &&
              data.map((d) => (
                <Tr key={d._id}>
                  <Td border="0px">{d.buyerName}</Td>
                  <Td border="0px">{d.sellerName}</Td>
                  <Td border="0px">{d.buyerEmail}</Td>
                  <Td border="0px">{d.sellerEmail}</Td>
                  <Td isNumeric border="0px">
                    Rs.{d.amountPaid}
                  </Td>
                  <Td border="0px">{d.serviceType}</Td>
                  <Td border="0px">{d.serviceName}</Td>
                  <Td border="0px">
                    {d.createdAt.split("T")[0] +
                      " " +
                      d.createdAt.split("T")[1].split(".")[0]}
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
}
