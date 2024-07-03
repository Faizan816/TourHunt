import Layout from "../../components/adminLayout";
import { Box, Heading, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/getAllComplaints")
      .then((res) => res.json())
      .then((data) => setComplaints(data));
  }, []);

  return (
    <Layout>
      <Box mt="40px" ml="20px" w="74%">
        <Box bg="#143E56" p="20px" borderRadius="10px" w="100%">
          <Heading mb={6}>Complaints</Heading>
          {complaints.length > 0 ? (
            complaints.map((complaint) => (
              <Box
                key={complaint._id}
                mb={4}
                p={4}
                borderWidth={1}
                borderRadius={4}
              >
                <Text fontWeight="bold">Username: {complaint.username}</Text>
                <Text>Email: {complaint.email}</Text>
                <Text>Complaint: {complaint.complaint}</Text>
              </Box>
            ))
          ) : (
            <Text>No complaints found.</Text>
          )}
        </Box>
      </Box>
    </Layout>
  );
}
