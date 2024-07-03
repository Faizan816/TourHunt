import {
  Box,
  Grid,
  GridItem,
  HStack,
  Image,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import Layout from "../../components/layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Favorites() {
  const [data, setData] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const getData = async () => {
      const userResponse = await axios.post(
        "http://127.0.0.1:8000/findUserUsingEmail",
        { email: localStorage.getItem("currentUser") }
      );
      const favoritesResponse = await axios.post(
        "http://127.0.0.1:8000/getAllFavorites",
        { userId: userResponse.data._id }
      );
      setData(favoritesResponse.data);
    };
    getData();
  }, []);

  // Helper function to capitalize the first character
  const capitalizeFirstChar = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleUnFavorite = async (serviceId) => {
    const userResponse = await axios.post(
      "http://127.0.0.1:8000/findUserUsingEmail",
      { email: localStorage.getItem("currentUser") }
    );
    const userId = userResponse.data._id;
    try {
      await axios.post("http://127.0.0.1:8000/unfavorite", {
        userId,
        serviceId,
      });
      const filteredData = data.filter((d) => d.serviceId !== serviceId);
      setData(filteredData);
      toast({
        title: "Service removed from favorites.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <Box w="100%" mt="40px" display="flex" justifyContent="center">
        <Box
          maxH="420px"
          overflow="auto"
          borderRadius="10px"
          p="20px"
          w="70%"
          bg="#143E56"
        >
          <Text
            textAlign="center"
            fontWeight="500"
            fontSize="larger"
            letterSpacing="1px"
          >
            Favorites
          </Text>
          {data.length == 0 && (
            <Text textAlign="center">No favorites added</Text>
          )}
          {data.length !== 0 &&
            data.map((d) => (
              <VStack>
                <Box w="100%">
                  <HStack
                    mt="10px"
                    borderRadius="10px"
                    p="20px"
                    justifyContent="flex-start"
                    bg="#2A656D"
                  >
                    <Image src="/images/favorite.png" h="100px" />
                    <Grid
                      letterSpacing={1}
                      templateColumns="repeat(2, 1fr)"
                      gap="1px"
                      fontSize="smaller"
                    >
                      <GridItem>
                        <Text fontWeight="500">Name:</Text>
                      </GridItem>
                      <GridItem>{d.serviceName}</GridItem>
                      <GridItem fontWeight="500">
                        <Text fontWeight="500">Location:</Text>
                      </GridItem>
                      <GridItem>
                        {capitalizeFirstChar(d.city) +
                          ", " +
                          capitalizeFirstChar(d.province) +
                          ", " +
                          capitalizeFirstChar(d.country)}
                      </GridItem>
                      <GridItem fontWeight="500">
                        <Text fontWeight="500">Service Type:</Text>
                      </GridItem>
                      <GridItem>{d.serviceType}</GridItem>
                    </Grid>
                  </HStack>
                  <HStack justifyContent="flex-end">
                    <HStack
                      gap="3px"
                      fontSize="smaller"
                      _hover={{ opacity: 0.5, cursor: "pointer" }}
                      onClick={() => handleUnFavorite(d.serviceId)}
                    >
                      <Image src="/images/block.png" h="12px" />
                      <Text>Remove from favorites</Text>
                    </HStack>
                  </HStack>
                </Box>
              </VStack>
            ))}
        </Box>
      </Box>
    </Layout>
  );
}
