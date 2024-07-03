import Layout from "../../components/layout";
import {
  Box,
  VStack,
  Tabs,
  InputGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Button,
  HStack,
  Tooltip,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Reviews() {
  const router = useRouter();
  const [payments, setPayments] = useState();
  const [reviews, setReviews] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tourPackages, setTourPackages] = useState();

  const todayIsBehind = (d) => {
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const targetDate = new Date(d);
    return today < targetDate;
  };

  useEffect(() => {
    const fetchData = async () => {
      let payments;
      let reviews;
      const email = localStorage.getItem("currentUser");
      const userResponse = await axios.post(
        "http://127.0.0.1:8000/findUserUsingEmail",
        { email: email }
      );
      const userId = userResponse.data._id;
      try {
        const paymentsResponse = await axios.post(
          "http://127.0.0.1:8000/getNotReviewed",
          { userId }
        );
        const reviewedResponse = await axios.post(
          "http://127.0.0.1:8000/getReviews",
          { userId }
        );

        // making reviews for tour packages unavailable if tour is not completed yet based on arrival date
        let tourPackages = paymentsResponse.data.filter(
          (d) => d.serviceType === "Tour Package"
        );
        tourPackages.map(async (d, i) => {
          const tpResponse = await axios.post(
            "http://127.0.0.1:8000/getSingleTourPackage",
            { serviceId: d.serviceId }
          );

          if (todayIsBehind(tpResponse.data.arrivalDate)) {
            tourPackages[i] = {
              ...tourPackages[i],
              reviewButtonDisabled: true,
            };
          } else {
            tourPackages[i] = {
              ...tourPackages[i],
              reviewButtonDisabled: false,
            };
          }
          // now setting tour packages
          setTourPackages(tourPackages);
        });
        payments = paymentsResponse.data.filter(
          (d) => d.serviceType !== "Tour Package"
        );
        reviews = reviewedResponse.data;
      } catch (error) {
        payments = 0;
      }
      setPayments(payments);
      setReviews(reviews);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("currentUser")) {
      router.push("../login");
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  const hasReservationDatePassed = (reservationDate) => {
    const currentDate = new Date();
    const reservationDateObj = new Date(reservationDate);
    return currentDate >= reservationDateObj;
  };

  function Reviewed({ reviews }) {
    console.log(reviews);
    return (
      <VStack alignItems="flex-start" w="100%">
        {reviews.length !== 0 ? (
          reviews.map((s) => (
            <Box
              key={s.serviceId}
              p="10px 20px"
              borderRadius="10px"
              bg="rgb(31, 81, 109, 0.5)"
              w="100%"
              fontSize="medium"
            >
              <Stack
                direction={["column", "row"]}
                p="5px"
                justifyContent="space-between"
              >
                <Box>
                  <p>{s.serviceName}</p>
                  <p>{s.serviceType}</p>
                  {s.comment && <p>Review: {s.comment}</p>}
                </Box>
                <Box display="flex" alignItems="center">
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      className={
                        index < s.rating
                          ? "fa fa-star rated gold"
                          : "fa fa-star not-rated"
                      }
                    ></span>
                  ))}
                </Box>
              </Stack>
            </Box>
          ))
        ) : (
          <p>No reviews yet</p>
        )}
      </VStack>
    );
  }

  return (
    isLoggedIn && (
      <Layout>
        <Box w="100%" display="flex" justifyContent="center">
          <VStack w="100%">
            <Box bg="#143E56" borderRadius="10px" mt="20px" p="20px" w="70%">
              <Tabs w="100%" isLazy variant="soft-rounded">
                <TabList>
                  <Tab
                    borderRadius="10px"
                    _selected={{ bg: "#2A656D", color: "white" }}
                  >
                    To Review
                  </Tab>
                  <Tab
                    borderRadius="10px"
                    _selected={{ bg: "#2A656D", color: "white" }}
                  >
                    Reviewed
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <VStack alignItems="flex-start" w="100%">
                      {payments && payments.length == 0 && !tourPackages && (
                        <p>Nothing to review</p>
                      )}
                      {payments &&
                        payments.length !== 0 &&
                        payments.map((s) => (
                          <Box
                            key={s.serviceId}
                            p="10px 20px"
                            borderRadius="10px"
                            bg="rgb(31, 81, 109, 0.5)"
                            w="100%"
                            fontSize="medium"
                          >
                            <HStack p="5px" justifyContent="space-between">
                              <Box>
                                <p>{s.serviceName}</p>
                                <p>{s.serviceType}</p>
                                <p>Rs.{s.amount}</p>
                              </Box>
                              {s.serviceType === "Accommodation" ||
                              s.serviceType === "Transport" ||
                              s.serviceType === "Restaurant" ? (
                                hasReservationDatePassed(s.reservationDate) ? (
                                  <Button
                                    bg="#2A656D"
                                    _hover={{ opacity: 0.5 }}
                                    color="white"
                                    size="sm"
                                    onClick={() => {
                                      localStorage.setItem(
                                        "currentService",
                                        JSON.stringify({
                                          serviceName: s.serviceName,
                                          serviceType: s.serviceType,
                                          serviceId: s.serviceId,
                                          amount: s.amount,
                                        })
                                      );
                                      router.push("../customer/reviewForm");
                                    }}
                                  >
                                    Review
                                  </Button>
                                ) : (
                                  <Tooltip label="Cannot review until after the reservation date">
                                    <Button
                                      bg="#2A656D"
                                      isDisabled
                                      _hover={{ opacity: 0.5 }}
                                      color="white"
                                      size="sm"
                                    >
                                      Review
                                    </Button>
                                  </Tooltip>
                                )
                              ) : (
                                <Button
                                  bg="#2A656D"
                                  _hover={{ opacity: 0.5 }}
                                  color="white"
                                  size="sm"
                                  onClick={() => {
                                    localStorage.setItem(
                                      "currentService",
                                      JSON.stringify({
                                        serviceName: s.serviceName,
                                        serviceType: s.serviceType,
                                        serviceId: s.serviceId,
                                        amount: s.amount,
                                      })
                                    );
                                    router.push("../customer/reviewForm");
                                  }}
                                >
                                  Review
                                </Button>
                              )}
                            </HStack>
                          </Box>
                        ))}
                      {tourPackages &&
                        tourPackages.length !== 0 &&
                        tourPackages.map((s) => (
                          <Box
                            key={s.serviceId}
                            p="10px 20px"
                            borderRadius="10px"
                            bg="rgb(31, 81, 109, 0.5)"
                            w="100%"
                            fontSize="medium"
                          >
                            <HStack p="5px" justifyContent="space-between">
                              <Box>
                                <p>{s.serviceName}</p>
                                <p>{s.serviceType}</p>
                                <p>Rs.{s.amount}</p>
                              </Box>
                              {s.reviewButtonDisabled ? (
                                <Tooltip label="Cannot review since tour is not completed yet!">
                                  <Button
                                    bg="#2A656D"
                                    isDisabled
                                    _hover={{ opacity: 0.5 }}
                                    color="white"
                                    size="sm"
                                    onClick={() => {
                                      localStorage.setItem(
                                        "currentService",
                                        JSON.stringify({
                                          serviceName: s.serviceName,
                                          serviceType: s.serviceType,
                                          serviceId: s.serviceId,
                                          amount: s.amount,
                                        })
                                      );
                                      router.push("../customer/reviewForm");
                                    }}
                                  >
                                    Review
                                  </Button>
                                </Tooltip>
                              ) : (
                                <Button
                                  bg="#2A656D"
                                  _hover={{ opacity: 0.5 }}
                                  color="white"
                                  size="sm"
                                  onClick={() => {
                                    localStorage.setItem(
                                      "currentService",
                                      JSON.stringify({
                                        serviceName: s.serviceName,
                                        serviceType: s.serviceType,
                                        serviceId: s.serviceId,
                                        amount: s.amount,
                                      })
                                    );
                                    router.push("../customer/reviewForm");
                                  }}
                                >
                                  Review
                                </Button>
                              )}
                            </HStack>
                          </Box>
                        ))}
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <Reviewed reviews={reviews} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </VStack>
        </Box>
      </Layout>
    )
  );
}
