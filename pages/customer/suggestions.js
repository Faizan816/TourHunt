import {
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  VStack,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import Layout from "../../components/layout";
import axios from "axios";
import { getCurrentUser } from "../../customHooks/getCurrentUserApi";
import {
  getAccommodationBookings,
  getRestaurantBookings,
  getTourPackageBookings,
  getTransportBookings,
  getUserBookings,
} from "../../customHooks/getUserBookings";
import {
  getAccommodationRecommendations,
  getPriceRecommendations,
  getRestaurantRecommendations,
  getTransportRecommendations,
} from "../../customHooks/getPriceRecommendations";
import {
  getAllAccommodations,
  getAllRestaurants,
  getAllTourPackages,
  getAllTransports,
} from "../../customHooks/getAllServices";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ratingClasses } from "@mui/material";

export default function Suggestions() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [filteredTourPackages, setFilteredTourPackages] = useState([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);
  const [filteredTransports, setFilteredTransports] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("currentUser")) {
      router.push("../login");
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = await getCurrentUser();
      const bookings = await getTourPackageBookings(currentUser._id);
      const bookings_a = await getAccommodationBookings(currentUser._id);
      const bookings_t = await getTransportBookings(currentUser._id);
      const bookings_r = await getRestaurantBookings(currentUser._id);
      // counting the average price spent by the customer on purchases
      let sum = 0;
      bookings.map((d) => {
        sum += d.amountPaid;
      });
      let sum_a = 0;
      bookings_a.map((d) => {
        sum_a += d.hotelRoomExpensePerPerson;
      });
      let sum_t = 0;
      bookings_t.map((d) => {
        sum_t += d.seatPricePerPerson;
      });
      let sum_r = 0;
      bookings_r.map((d) => {
        sum_r += d.amountPaid;
      });
      const average = sum / bookings.length;
      const average_a = sum_a / bookings_a.length;
      const average_t = sum_t / bookings_t.length;
      const average_r = sum_r / bookings_r.length;
      console.log(average_t);
      // getting recommendations for average price spent by the customer
      const tourPackagePriceRecommendations = await getPriceRecommendations(
        average || 30000
      );
      const accommodationPriceRecommendations =
        await getAccommodationRecommendations(average_a || 15000);
      const transportPriceRecommendations = await getTransportRecommendations(
        average_t || 2000
      );
      const restaurantPriceRecommendations = await getRestaurantRecommendations(
        average_r || 2000
      );
      const tourPackages = await getAllTourPackages();
      const accommodations = await getAllAccommodations();
      const transports = await getAllTransports();
      const restaurants = await getAllRestaurants();

      let filteredTourPackages = [];
      tourPackagePriceRecommendations.map((s) => {
        tourPackages.map((tp) => {
          if (s == tp._id) {
            filteredTourPackages.push(tp);
          }
        });
      });
      let filteredAccommodations = [];
      accommodationPriceRecommendations.map((s) => {
        accommodations.map((a) => {
          if (s == a._id) {
            filteredAccommodations.push(a);
          }
        });
      });
      let filteredTransports = [];
      transportPriceRecommendations.map((s) => {
        transports.map((t) => {
          if (s == t._id) {
            filteredTransports.push(t);
          }
        });
      });
      let filteredRestaurants = [];
      restaurantPriceRecommendations.map((s) => {
        restaurants.map((r) => {
          if (s == r._id) {
            filteredRestaurants.push(r);
          }
        });
      });

      setFilteredTourPackages(filteredTourPackages);
      setFilteredAccommodations(filteredAccommodations);
      setFilteredTransports(filteredTransports);
      setFilteredRestaurants(filteredRestaurants);
    };
    isLoggedIn && fetchData();
  }, [isLoggedIn]);

  return (
    isLoggedIn && (
      <Layout>
        <Box w="100%" mt="40px" display="flex" justifyContent="center">
          <Box w="50%" borderRadius="10px" p="20px" bg="#143E56">
            <Text>Suggestions</Text>
            <Tabs mt="10px" w="100%" isLazy variant="soft-rounded">
              <TabList overflow="auto">
                <Tab
                  borderRadius="10px"
                  fontSize="sm"
                  _selected={{ bg: "#2A656D", color: "white" }}
                >
                  Tour Packages
                </Tab>
                <Tab
                  borderRadius="10px"
                  fontSize="sm"
                  _selected={{ bg: "#2A656D", color: "white" }}
                >
                  Accommodations
                </Tab>
                <Tab
                  borderRadius="10px"
                  fontSize="sm"
                  _selected={{ bg: "#2A656D", color: "white" }}
                >
                  Transports
                </Tab>
                <Tab
                  borderRadius="10px"
                  fontSize="sm"
                  _selected={{ bg: "#2A656D", color: "white" }}
                >
                  Restaurants
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <VStack alignItems="flex-start" w="100%" fontSize="sm">
                    {filteredTourPackages &&
                      filteredTourPackages.map((tp) => (
                        <Grid
                          w="100%"
                          p="20px"
                          borderRadius="10px"
                          bg="#2A656D"
                          key={tp._id}
                          templateColumns="repeat(2,1fr)"
                          gap="1"
                        >
                          <GridItem>
                            <Text fontWeight="500">Package Name:</Text>
                          </GridItem>
                          <GridItem>
                            <Text>{tp.name}</Text>
                          </GridItem>
                          <GridItem>
                            <Text fontWeight="500">Company:</Text>
                          </GridItem>
                          <GridItem>
                            <Text>{tp.businessName}</Text>
                          </GridItem>
                          <GridItem fontWeight="500">Price:</GridItem>
                          <GridItem>Rs.{tp.price}</GridItem>
                        </Grid>
                      ))}
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack alignItems="flex-start" w="100%" fontSize="sm">
                    {filteredAccommodations &&
                      filteredAccommodations.map((a) => (
                        <Grid
                          w="100%"
                          p="20px"
                          borderRadius="10px"
                          bg="#2A656D"
                          key={a._id}
                          templateColumns="repeat(2,1fr)"
                          gap="1"
                        >
                          <GridItem>
                            <Text fontWeight="500">Hotel Name:</Text>
                          </GridItem>
                          <GridItem>
                            <Text>{a.name}</Text>
                          </GridItem>
                          <GridItem>
                            <Text fontWeight="500">Company:</Text>
                          </GridItem>
                          <GridItem>
                            <Text>{a.businessName}</Text>
                          </GridItem>
                          <GridItem fontWeight="500">
                            Hotel Room Expense Per Person:
                          </GridItem>
                          <GridItem>Rs.{a.hotelRoomExpensePerPerson}</GridItem>
                        </Grid>
                      ))}
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack alignItems="flex-start" w="100%" fontSize="sm">
                    {filteredTransports &&
                      filteredTransports.map((t) => (
                        <Grid
                          w="100%"
                          p="20px"
                          borderRadius="10px"
                          bg="#2A656D"
                          key={t._id}
                          templateColumns="repeat(2,1fr)"
                          gap="1"
                        >
                          <GridItem>
                            <Text fontWeight="500">Package Name:</Text>
                          </GridItem>
                          <GridItem>
                            <Text>{t.name}</Text>
                          </GridItem>
                          <GridItem>
                            <Text fontWeight="500">Company:</Text>
                          </GridItem>
                          <GridItem>
                            <Text>{t.businessName}</Text>
                          </GridItem>
                          <GridItem fontWeight="500">
                            Seat Price Per Person:
                          </GridItem>
                          <GridItem>Rs.{t.seatPricePerPerson}</GridItem>
                        </Grid>
                      ))}
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack alignItems="flex-start" w="100%" fontSize="sm">
                    {filteredRestaurants &&
                      filteredRestaurants.map((r) => (
                        <Grid
                          w="100%"
                          p="20px"
                          borderRadius="10px"
                          bg="#2A656D"
                          key={r._id}
                          templateColumns="repeat(2,1fr)"
                          gap="1"
                        >
                          <GridItem>
                            <Text fontWeight="500">Package Name:</Text>
                          </GridItem>
                          <GridItem>
                            <Text>{r.name}</Text>
                          </GridItem>
                          <GridItem>
                            <Text fontWeight="500">Company:</Text>
                          </GridItem>
                          <GridItem>
                            <Text>{r.businessName}</Text>
                          </GridItem>
                          <GridItem fontWeight="500">
                            Reservation Charges:
                          </GridItem>
                          <GridItem>Rs.{r.reservationCharges}</GridItem>
                        </Grid>
                      ))}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </Layout>
    )
  );
}
