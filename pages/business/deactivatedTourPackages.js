import {
  Box,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Button,
  VStack,
  Text,
  HStack,
} from "@chakra-ui/react";
import Layout from "../../components/businessLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser } from "../../customHooks/getCurrentUserApi";
import { useRouter } from "next/router";

export default function DeactivatedTourPackages() {
  const [tourPackages, setTourPackages] = useState([]);
  const router = useRouter();
  useEffect(() => {
    async function fetchData() {
      const user = await getCurrentUser();
      const tpResponse = await axios.post(
        "http://localhost:8000/getDeactivatedTourPackages",
        { userId: user._id }
      );
      setTourPackages(tpResponse.data);
    }
    fetchData();
  }, []);

  return (
    <Layout>
      <Box
        mt="40px"
        w="80%"
        ml="20px"
        bg="#143E56"
        p="20px"
        borderRadius="10px"
        letterSpacing={1}
      >
        <Heading size="md">Deactivated Tour Packages</Heading>
        {tourPackages.length === 0 ? (
          <Text letterSpacing={0} mb={4}>
            No deactivated tour packages.
          </Text>
        ) : (
          <Text letterSpacing={0} mb={4}>
            Following is a list of deactivated tour packages because their dates
            have passed. Click activate to edit their dates and get them
            running.
          </Text>
        )}
        <VStack spacing={4} align="start">
          {tourPackages.length !== 0 && (
            <>
              {tourPackages.map((tp) => (
                <HStack
                  key={tp._id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  w="100%"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Text>{tp.name}</Text>
                  <Button
                    bg="#2A656D"
                    color="white"
                    _hover={{ opacity: 0.5 }}
                    onClick={() => {
                      router.push({
                        pathname: "../business/editTourPackage",
                        query: { id: tp._id },
                      });
                    }}
                  >
                    Activate
                  </Button>
                </HStack>
              ))}
            </>
          )}
        </VStack>
      </Box>
    </Layout>
  );
}
