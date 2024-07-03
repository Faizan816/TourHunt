import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  useToast,
} from "@chakra-ui/react";
import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Complaint() {
  const [userId, setUserId] = useState();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [complaint, setComplaint] = useState("");
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const userResponse = await axios.post(
          "http://127.0.0.1:8000/findUserUsingEmail",
          {
            email: localStorage.getItem("currentUser"),
          }
        );
        setUserId(userResponse.data._id);
        setUsername(userResponse.data.username);
        setEmail(userResponse.data.email);
      } catch (error) {
        console.log(error);
        router.push("../login");
      }
    };
    getUserDetails();
  }, []);

  const handleSubmit = async () => {
    if (username === "" || email === "" || complaint === "") {
      alert("Please fill all the fields");
      return;
    }
    try {
      await axios.post("http://127.0.0.1:8000/postComplaint", {
        userId: userId,
        username: username,
        email: email,
        complaint: complaint,
      });
      router.push("../home");
      toast({
        title: "Complaint submitted successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // send confirmation mail to custoer that complaint is submitted
      axios.post("http://127.0.0.1:8000/sendMail", {
        to: email,
        name: "Faizan",
        subject: "Complaint Submitted Successfully!",
        body: `<p>Dear ${username},</p>
           <p>Your complaint has been successfully submitted to the system administrator. 
           We will get in touch with you ASAP. Your complaint was: "${complaint}"</p>
           <p>Best regards,</p>`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <Box display="flex" justifyContent="center">
        <Box w="70%" bg="#143E56" p="40px" borderRadius="10px" mt="20px">
          <Heading size="lg" mb={6}>
            Submit a Complaint
          </Heading>
          <Flex direction="column" align="start">
            <Text mb={2} fontWeight="bold">
              Name
            </Text>
            <Input
              disabled
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              mb={4}
              placeholder="Enter your name"
            />
            <Text mb={2} fontWeight="bold">
              Email
            </Text>
            <Input
              disabled
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              mb={4}
              placeholder="Enter your email"
              type="email"
            />
            <Text mb={2} fontWeight="bold">
              Complaint Details
            </Text>
            <Textarea
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              mb={4}
              placeholder="Describe your complaint"
              rows={6}
            />
            <Button onClick={handleSubmit} colorScheme="blue" type="submit">
              Submit
            </Button>
          </Flex>
        </Box>
      </Box>
    </Layout>
  );
}
