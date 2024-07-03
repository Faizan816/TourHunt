import {
  Box,
  Grid,
  GridItem,
  HStack,
  Heading,
  Image,
  Stack,
  Text,
  VStack,
  useBreakpointValue,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  useDisclosure,
  Center,
} from "@chakra-ui/react";
import Layout from "../../components/businessLayout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DeleteDialog from "../../components/deleteDialog";

export default function TourPackage() {
  const [currentId, setCurrentId] = useState();
  const [tourPackages, setTourPackages] = useState();
  const router = useRouter();
  const [expanded, setExpanded] = useState();
  const isMobile = useBreakpointValue({
    base: true,
    sm: true,
    md: false,
    lg: false,
    xl: false,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem("currentUser");
      const userIdResponse = await axios.post(
        "http://127.0.0.1:8000/findUserUsingEmail",
        { email }
      );
      const userId = userIdResponse.data._id;
      const tpResponse = await axios.post(
        "http://127.0.0.1:8000/getBusinessTourPackages",
        { userId }
      );
      const tourPackages = tpResponse.data || null;
      let expandedArray = [];
      for (let i = 0; i < tourPackages.length; i++) {
        expandedArray.push(false);
      }
      setExpanded(expandedArray);
      setTourPackages(tourPackages);
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const response = await axios.post(
      "http://127.0.0.1:8000/deleteBusinessTourPackage",
      { id }
    );
    router.push("../business/tourPackage");
  };

  return (
    <Layout>
      <DeleteDialog
        isOpen={isOpen}
        onClose={onClose}
        title="Delete Tour Package"
        description="Are you sure you want to delete this tour package?"
        handleDelete={handleDelete}
        id={currentId}
      />
      <Box
        style={
          isMobile ? { width: "90%" } : { width: "80%", paddingLeft: "20px" }
        }
      >
        <Box
          w="100%"
          mt="39px"
          display="flex"
          flexDirection="column"
          borderRadius="10px"
          style={isMobile ? { fontSize: "small" } : { fontSize: "" }}
        >
          <HStack justifyContent="space-between">
            <Heading size="md">Tour Packages</Heading>
            <HStack
              onClick={() => router.push("../business/registerTourPackage")}
              _hover={{ opacity: 0.5 }}
              cursor="pointer"
              gap="4px"
            >
              <Image src="/images/plus.png" h="10px" />
              <Text fontSize="small">Register a New Tour Package</Text>
            </HStack>
          </HStack>
          {tourPackages && tourPackages.length !== 0 ? (
            tourPackages.map((tp, i) => (
              <VStack
                p="20px"
                mb="20px"
                bg="#143E56"
                borderRadius="10px"
                alignItems="flex-start"
                key={tp._id}
              >
                <HStack w="100%" justifyContent="flex-end">
                  <HStack>
                    <Image
                      onClick={() =>
                        router.push({
                          pathname: "../business/editTourPackage",
                          query: { id: tp._id },
                        })
                      }
                      _hover={{ opacity: 0.5 }}
                      cursor="pointer"
                      src="/images/edit.png"
                      h="15px"
                    />
                    <Image
                      onClick={() => {
                        onOpen();
                        setCurrentId(tp._id);
                      }}
                      _hover={{ opacity: 0.5 }}
                      cursor="pointer"
                      src="/images/delete.png"
                      h="15px"
                    />
                  </HStack>
                </HStack>
                <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                  <GridItem>
                    <Text fontWeight="bold">Package Name:</Text>
                  </GridItem>
                  <GridItem>
                    <Text>{tp.name}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontWeight="bold">Departure City:</Text>
                  </GridItem>
                  <GridItem>
                    <Text>{tp.departureCity}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontWeight="bold">Destination(s):</Text>
                  </GridItem>
                  <GridItem>
                    <Text>{tp.destination}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontWeight="bold">Destination City:</Text>
                  </GridItem>
                  <GridItem>
                    <Text>{tp.city}</Text>
                  </GridItem>
                </Grid>
                <Accordion w="100%" allowToggle>
                  <AccordionItem>
                    <h2>
                      <AccordionButton
                        onClick={() => {
                          const newExpanded = [...expanded];
                          newExpanded[i] = !newExpanded[i];
                          setExpanded(newExpanded);
                        }}
                        pb="0"
                      >
                        <Box as="span" flex="1" textAlign="center">
                          {expanded[i] ? "Show Less" : "Show More"}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel>
                      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                        <GridItem>
                          <Text fontWeight="bold">Food:</Text>
                        </GridItem>
                        <GridItem>
                          <Text>
                            {tp.breakfast && (
                              <span>Breakfast: {tp.breakfast}</span>
                            )}
                            <br />
                            {tp.lunch && <span>Lunch: {tp.lunch}</span>}
                            <br />
                            {tp.dinner && <span>Dinner: {tp.dinner}</span>}
                            {!tp.breakfast && !tp.lunch && !tp.dinner && (
                              <span>-</span>
                            )}
                          </Text>
                        </GridItem>
                        <GridItem>
                          <Text fontWeight="bold">Transportation:</Text>
                        </GridItem>
                        <GridItem>
                          <Text>{tp.transportType}</Text>
                        </GridItem>
                        <GridItem>
                          <Text fontWeight="bold">Accommodation(s):</Text>
                        </GridItem>
                        <GridItem>
                          <Text>{tp.hotelCompanyName}</Text>
                        </GridItem>
                        <GridItem>
                          <Text fontWeight="bold">Images:</Text>
                        </GridItem>
                        <GridItem>
                          <Stack overflow="auto" direction={["column", "row"]}>
                            {tp.imageUrls.map((imageUrl) => (
                              <Image
                                key={imageUrl}
                                src={imageUrl}
                                h="100px"
                                borderRadius="10px"
                              />
                            ))}
                          </Stack>
                        </GridItem>
                        <GridItem>
                          <Text fontWeight="bold">Tour Duration:</Text>
                        </GridItem>
                        <GridItem>
                          <Text>{tp.tourDuration} days</Text>
                        </GridItem>
                        <GridItem>
                          <Text fontWeight="bold">
                            Food charges per person:
                          </Text>
                        </GridItem>
                        <GridItem>
                          <Text>Rs.{tp.foodPrice}</Text>
                        </GridItem>
                        <GridItem>
                          <Text fontWeight="bold">
                            Hotel Room Expense Per Person:
                          </Text>
                        </GridItem>
                        <GridItem>
                          <Text>Rs.{tp.hotelRoomExpensePerPerson}</Text>
                        </GridItem>
                        <GridItem>
                          <Text fontWeight="bold">
                            Transport Expense Per Person:
                          </Text>
                        </GridItem>
                        <GridItem>
                          <Text>Rs.{tp.transportExpensePerPerson}</Text>
                        </GridItem>
                        <GridItem>
                          <Text fontWeight="bold">Total Cost:</Text>
                        </GridItem>
                        <GridItem>
                          <Text>Rs.{tp.price}</Text>
                        </GridItem>
                      </Grid>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </VStack>
            ))
          ) : (
            <Center color="white" h="100vh">
              <b>Kindly register your Tour Package service</b>
            </Center>
          )}
        </Box>
      </Box>
    </Layout>
  );
}
