import { useState, useEffect } from "react";
import Layout from "../../components/layout";
import {
  Box,
  VStack,
  Editable,
  EditablePreview,
  EditableTextarea,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";

export default function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverIndex, setHoverIndex] = useState(-1);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    // return () => {
    //   localStorage.removeItem("currentService");
    // };
  }, []);

  const handleStarClick = (starIndex) => {
    setRating(starIndex + 1);
  };

  const handleSubmit = async () => {
    if (!rating) {
      toast({
        title: "Please give rating!",
        status: "info",
        isClosable: true,
        duration: 3000,
      });
      return;
    }

    const userResponse = await axios.post(
      "http://127.0.0.1:8000/findUserUsingEmail",
      { email: localStorage.getItem("currentUser") }
    );
    const serviceDetails = JSON.parse(localStorage.getItem("currentService"));
    const userId = userResponse.data._id;
    const username = userResponse.data.username;
    const email = userResponse.data.email;
    const serviceId = serviceDetails.serviceId;
    const serviceName = serviceDetails.serviceName;
    const serviceType = serviceDetails.serviceType;
    const amount = serviceDetails.amount;
    try {
      const reviewResponse = await axios.post(
        "http://127.0.0.1:8000/saveReview",
        {
          serviceId,
          userId,
          username,
          email,
          serviceName,
          serviceType,
          rating,
          comment,
        }
      );
      toast({
        title: "Review submitted successfully!",
        duration: 3000,
        isClosable: true,
        status: "success",
      });
      // now updating the payment's status to reviewed
      try {
        const paymentResponse = await axios.post(
          "http://127.0.0.1:8000/updatePayment",
          {
            serviceId,
            userId,
            serviceName,
            serviceType,
            amount,
            status: "reviewed",
          }
        );
        router.push("../customer/reviews");
      } catch (error) {
        console.log("Payment updation failed!");
      }
    } catch (error) {
      toast({
        title: "Something went wrong from server side!",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    }
  };

  return (
    <Layout>
      <Box w="100%" display="flex" justifyContent="center">
        <Box p="20px" borderRadius="10px" mt="20px" w="50%" bg="#143E56">
          <VStack gap="5px" w="100%" alignItems="flex-start">
            <b>Please give your review</b>
            <b>Murree Tours</b>
            <Box>
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  onMouseOver={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(-1)}
                  className={
                    hoverIndex !== -1
                      ? index < hoverIndex
                        ? "fa fa-star star checked gold"
                        : "fa fa-star star"
                      : index < rating
                      ? "fa fa-star star checked"
                      : "fa fa-star star"
                  }
                  onClick={() => handleStarClick(index)}
                ></span>
              ))}
            </Box>
            <Editable
              borderColor="red"
              w="100%"
              placeholder="Click to type comments"
            >
              <EditablePreview />

              <EditableTextarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Editable>
            <Button
              size="sm"
              bg="#2A656D"
              color="white"
              _hover={{ opacity: 0.5 }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </VStack>
        </Box>
      </Box>
    </Layout>
  );
}
