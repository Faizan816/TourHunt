import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Layout from "../../components/businessLayout";
import { faPlus, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Grid,
  GridItem,
  useToast,
} from "@chakra-ui/react";
import DeleteDialog from "../../components/deleteDialog";
import {
  HStack,
  Heading,
  VStack,
  Text,
  Accordion,
  AccordionButton,
  AccordionIcon,
  Stack,
  Image,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useDisclosure } from "@chakra-ui/react";
import formatTimeToAMPM from "../../components/formatTime";
export default function HotelDashboard() {
  const [restaurant, setRestaurant] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentId, setCurrentId] = useState();
  const router = useRouter();

  const [expand, setExpand] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem("currentUser");
      const userIdResponse = await axios.post(
        "http://127.0.0.1:8000/findUserUsingEmail",
        { email }
      );
      const userId = userIdResponse.data._id;
      const resResponse = await axios.post(
        "http://127.0.0.1:8000/getRestaurant",
        {
          userId,
        }
      );
      const restaurant = resResponse.data || null;
      setRestaurant(restaurant);
      let expandArray = [];
      for (let i = 0; i < restaurant.length; i++) {
        expandArray.push(false);
      }
      setExpand(expandArray);
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const response = await axios.post(
      "http://127.0.0.1:8000/deleteRestaurant",
      { id }
    );
    router.push("../business/RestaurantDashboard");
  };

  return (
    <Layout>
      <DeleteDialog
        isOpen={isOpen}
        onClose={onClose}
        title="Delete Tour Package"
        description="Are you sure you want to delete this Restaurant Detail?"
        handleDelete={handleDelete}
        id={currentId}
      />
      <Box w={"80%"}>
        <Box w={"100%"} pt={"4%"} pl={"2%"} pb={"1%"} pr={"2%"}>
          <HStack spacing={4} justify="space-between">
            <Heading as={"h2"} size="md">
              Restaurant
            </Heading>
            <HStack
              onClick={() => router.push("../business/Restaurant")}
              _hover={{ opacity: 0.5 }}
              cursor="pointer"
              gap="4px"
            >
              <Image src="/images/plus.png" h="10px" />
              <Text fontSize="small">Register a New Restaurant</Text>
            </HStack>
          </HStack>
          {restaurant && restaurant.length === 0 ? (
            <Center color="white" h="100vh">
              <b>Kindly register your Restaurant service</b>
            </Center>
          ) : (
            restaurant &&
            restaurant.map((res, i) => (
              <VStack
                mb={"2%"}
                key={res._id}
                backgroundColor={"#143E56"}
                alignItems={"start"}
                p={"2%"}
                borderRadius="10px"
              >
                <HStack w={"100%"} fontSize="sm" justifyContent={"flex-end"}>
                  <HStack>
                    <Box
                      as="span"
                      cursor="pointer"
                      _hover={{ opacity: 0.5 }}
                      onClick={() =>
                        router.push({
                          pathname: "../business/EditRestaurant",
                          query: { id: res._id },
                        })
                      }
                    >
                      <Image src="/images/edit.png" h="15px" />
                    </Box>
                    <Box
                      as="span"
                      cursor="pointer"
                      _hover={{ opacity: 0.5 }}
                      onClick={() => {
                        onOpen();
                        setCurrentId(res._id);
                      }}
                    >
                      <Image src="/images/delete.png" h="15px" />
                    </Box>
                  </HStack>
                </HStack>
                <VStack w={"100%"} align={"flex-start"}>
                  <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                    <GridItem>
                      <Text fontWeight="bold">Restaurant Name:</Text>
                    </GridItem>
                    <GridItem>
                      <Text>{res.name}</Text>
                    </GridItem>
                    <GridItem>
                      <Text fontWeight="bold">Contact:</Text>
                    </GridItem>
                    <GridItem>
                      <Text>{res.contact}</Text>
                    </GridItem>
                  </Grid>
                  <Accordion w={"100%"} allowToggle>
                    <AccordionItem>
                      <AccordionButton
                        onClick={() => {
                          const newExpanded = [...expand];
                          newExpanded[i] = !newExpanded[i];
                          setExpand(newExpanded);
                          console.log([expand]);
                          console.log("the diffrence above and below:", [
                            ...expand,
                          ]);
                        }}
                        pb="0"
                      >
                        <Box
                          as="span"
                          flex="1"
                          textAlign="center"
                          fontWeight={"bold"}
                        >
                          {expand[i] ? "Show Less" : "Show More"}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel>
                        <Grid
                          templateColumns="repeat(2, 1fr)"
                          gap={2}
                          pt={"3%"}
                        >
                          <GridItem>
                            <Text fontWeight="bold">Location:</Text>
                          </GridItem>
                          <GridItem>
                            <Text>
                              {res.city +
                                ", " +
                                res.province +
                                ", " +
                                res.country}
                            </Text>
                          </GridItem>
                          <GridItem>
                            <Text fontWeight="bold">Cuisine:</Text>
                          </GridItem>
                          <GridItem>
                            <Text>{res.cuisine}</Text>
                          </GridItem>
                          <GridItem>
                            <Text fontWeight="bold">Reservation:</Text>
                          </GridItem>
                          <GridItem>
                            <Text>{res.reservation}</Text>
                          </GridItem>
                          <GridItem>
                            <Text fontWeight="bold">Reservation Charges:</Text>
                          </GridItem>
                          <GridItem>
                            <Text>Rs.{res.reservationCharges}</Text>
                          </GridItem>
                          <GridItem>
                            <Text fontWeight="bold">
                              Opening and Closing Hrs:
                            </Text>
                          </GridItem>
                          <GridItem>
                            <Text>
                              {formatTimeToAMPM(res.openingTime)} -{" "}
                              {formatTimeToAMPM(res.closingTime)}
                            </Text>
                          </GridItem>
                          <GridItem>
                            <Text fontWeight="bold">Images:</Text>
                          </GridItem>
                          <GridItem>
                            <Stack overflow="auto" direction={["row"]}>
                              {res.imageUrls.map((imageUrl) => (
                                <Image
                                  key={imageUrl}
                                  src={imageUrl}
                                  h="100px"
                                  borderRadius="10px"
                                />
                              ))}
                            </Stack>
                          </GridItem>
                        </Grid>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </VStack>
              </VStack>
            ))
          )}
        </Box>
      </Box>
    </Layout>
  );
}
