import {
  Box,
  HStack,
  Heading,
  VStack,
  Button,
  Image,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  FormLabel,
  useToast,
  useBreakpointValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import Layout from "../../components/businessLayout";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import EditDrawer from "../../components/EditDrawer";

function NewServiceModal({ isOpen, onClose, btnRef, services, setServices }) {
  const [selectedValue, setSelectedValue] = useState("Tour Package");
  const router = useRouter();
  const allServices = [
    "Tour Package",
    "Restaurant",
    "Transport",
    "Accommodation",
    "Guide",
  ];
  const toast = useToast();
  const isMobile = useBreakpointValue({
    base: true,
    sm: true,
    md: false,
    lg: false,
    xl: false,
  });

  const handleSubmit = async () => {
    const user = await axios.post("http://127.0.0.1:8000/findUserUsingEmail", {
      email: localStorage.getItem("currentUser"),
    });
    const userId = user.data._id;
    const businessResponse = await axios.post(
      "http://127.0.0.1:8000/getBusiness",
      { id: userId }
    );
    let business = businessResponse.data;
    const filteredService = businessResponse.data.services.filter(
      (s) => s === selectedValue
    );
    if (filteredService.length) {
      toast({
        title: "You already have this service!",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } else {
      business.services.push(selectedValue);
      await axios.post("http://127.0.0.1:8000/updateBusiness", { business });
      setServices(business.services);
      toast({
        title: "Your service has beend added!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onClose();
      router.push("../business/dashboard");
    }
  };

  return (
    <>
      {isOpen && (
        <Modal finalFocusRef={btnRef} isOpen={true} onClose={onClose}>
          <ModalOverlay />
          <ModalContent
            style={{ width: isMobile ? "80%" : "50%" }}
            color="white"
            bg="#1F516D"
          >
            <ModalHeader>Add a New Service</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormLabel>Select a service:</FormLabel>
              <Select
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
              >
                <option
                  style={{ backgroundColor: "#1F516D" }}
                  value="Tour Package"
                >
                  Tour Package
                </option>
                <option
                  style={{ backgroundColor: "#1F516D" }}
                  value="Restaurant"
                >
                  Restaurant
                </option>
                <option
                  style={{ backgroundColor: "#1F516D" }}
                  value="Transport"
                >
                  Transport
                </option>
                <option
                  style={{ backgroundColor: "#1F516D" }}
                  value="Accommodation"
                >
                  Accommodation
                </option>
              </Select>
            </ModalBody>

            <ModalFooter>
              <Button
                bg="#AC3116"
                color="white"
                _hover={{ opacity: 0.5 }}
                mr={3}
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                onClick={handleSubmit}
                bg="#398D2C"
                _hover={{ opacity: 0.5 }}
                color="white"
              >
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

function DeleteDialog({ isOpen, onClose, handleDelete }) {
  const cancelRef = useRef();
  const isMobile = useBreakpointValue({
    base: true,
    sm: true,
    md: false,
    lg: false,
    xl: false,
  });

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            style={isMobile ? { width: "70%" } : { width: "50%" }}
            bg="#1F516D"
            color="white"
          >
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Profile
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete your business profile?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                bg="#2A656D"
                color="white"
                _hover={{ opacity: 0.5 }}
                ref={cancelRef}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                bg="#AC3116"
                color="white"
                _hover={{ opacity: 0.5 }}
                onClick={handleDelete}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default function Dashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalShow, setModalShow] = useState(false);
  const [dialogShow, setDialogShow] = useState(false);
  const [drawerShow, setDrawerShow] = useState(false);
  const router = useRouter();
  const isMobile = useBreakpointValue({
    base: true,
    sm: true,
    md: false,
    lg: false,
    xl: false,
  });
  const btnRef = useRef();
  const editRef = useRef();
  const [business, setBusiness] = useState();
  const [services, setServices] = useState();
  const [status, setStatus] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem("currentUser");
      const userResponse = await axios.post(
        "http://127.0.0.1:8000/findUserUsingEmail",
        { email: email }
      );
      const servicesResponse = await axios.post(
        "http://127.0.0.1:8000/getBusiness",
        { id: userResponse.data._id }
      );
      const business = servicesResponse.data || null;
      const services = servicesResponse.data.services || null;
      const status = servicesResponse.data.status;
      const username = userResponse.data.username;
      setUsername(username);
      setEmail(userResponse.data.email);
      setBusiness(business);
      setServices(services);
      setStatus(status);
    };
    fetchData();
  }, []);

  const handleDelete = async () => {
    await axios.post("http://127.0.0.1:8000/deleteBusiness", {
      id: business._id,
    });
    router.push("../business/welcome");
  };

  const handleReinvoke = async () => {
    await axios.post("http://127.0.0.1:8000/reinvokeBusinessRequest", {
      id: business._id,
      userId: business.userId,
      businessName: business.businessName,
      country: business.country,
      province: business.province,
      city: business.city,
      contact: business.contact,
      services: business.services,
      status: "Pending",
    });
    router.push("../business/dashboard");
    toast({
      title: "Your request has been resent!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Layout>
      {modalShow && (
        <NewServiceModal
          services={services}
          setServices={setServices}
          btnRef={btnRef}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
      {dialogShow && (
        <DeleteDialog
          handleDelete={handleDelete}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
      {drawerShow && (
        <EditDrawer
          bn={business.businessName}
          co={business.country}
          pr={business.province}
          ci={business.city}
          c={business.contact}
          business={business}
          editRef={editRef}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
      {isMobile ? (
        <Box
          display="flex"
          justifyContent="center"
          padding="20px"
          mt="20px"
          w="100%"
        >
          {business && (
            <Box w="95%">
              <VStack
                fontSize="small"
                w="100%"
                padding="20px"
                borderRadius="10px"
                bg="#143E56"
                overflow="auto"
              >
                <HStack w="100%" justifyContent="space-between">
                  <Box></Box>
                  <Heading mb="0" size="sm">
                    Dashboard
                  </Heading>
                  <HStack>
                    <Image
                      onClick={() => {
                        setModalShow(false);
                        setDialogShow(false);
                        setDrawerShow(true);
                        onOpen();
                      }}
                      _hover={{ opacity: 0.5 }}
                      cursor="pointer"
                      src="/images/edit.png"
                      height="15px"
                    />
                    {/* <Image
                      onClick={() => {
                        setModalShow(false);
                        setDrawerShow(false);
                        setDialogShow(true);
                        onOpen();
                      }}
                      _hover={{ opacity: 0.5 }}
                      cursor="pointer"
                      src="/images/delete.png"
                      height="15px"
                    /> */}
                  </HStack>
                </HStack>
                <VStack w="100%" overflow="auto">
                  <HStack w="100%" justifyContent="space-between">
                    <Text fontWeight="500">Username:</Text>
                    <Text fontSize>{username}</Text>
                  </HStack>
                  <HStack w="100%" justifyContent="space-between">
                    <Text fontWeight="500">Email:</Text>
                    <Text fontSize>{email}</Text>
                  </HStack>
                  <HStack w="100%" justifyContent="space-between">
                    <Text fontWeight="500">Business Name:</Text>
                    <Text fontSize>{business.businessName}</Text>
                  </HStack>
                  <HStack w="100%" justifyContent="space-between">
                    <Text fontWeight="500">Location:</Text>
                    <Text fontSize>
                      {business.country} {business.province} {business.city}
                    </Text>
                  </HStack>
                  <HStack w="100%" justifyContent="space-between">
                    <Text fontWeight="bold">Contact:</Text>
                    <Text fontSize>{business.contact}</Text>
                  </HStack>
                  <HStack w="100%" justifyContent="space-between">
                    <Text fontWeight="bold">CNIC:</Text>
                    <Text fontSize>{business.cnic}</Text>
                  </HStack>
                  <HStack w="100%" justifyContent="space-between">
                    <Text fontWeight="bold">NTN:</Text>
                    <Text fontSize>{business.ntn}</Text>
                  </HStack>
                  <HStack w="100%" justifyContent="space-between">
                    <Text fontWeight="bold">Account Approval Status:</Text>
                    <Text>{status}</Text>
                  </HStack>
                </VStack>
                <VStack w="100%" alignItems="flex-start">
                  {services &&
                    status !== "Pending" &&
                    services.map((s, i) => (
                      <Button
                        onClick={() => {
                          if (s === "Tour Package") {
                            router.push("../business/registerTourPackage");
                          } else if (s === "Accommodation") {
                            router.push("../business/Accommodation");
                          } else if (s === "Restaurant") {
                            router.push("../business/Restaurant");
                          } else if (s === "Transport") {
                            router.push("../business/Transport");
                          } else if (s === "Guide") {
                            router.push("../business/Guide");
                          }
                        }}
                        key={s + i}
                        size="xs"
                        bg="#2A656D"
                        color="white"
                        fontSize="smaller"
                        _hover={{ opacity: 0.5 }}
                      >
                        Register a {s}
                      </Button>
                    ))}
                  {status !== "Pending" && status !== "Rejected" && (
                    <HStack w="100%" justifyContent="space-between">
                      {services.length !== 4 && (
                        <HStack
                          ref={btnRef}
                          onClick={() => {
                            setModalShow(true);
                            setDialogShow(false);
                            setDrawerShow(false);
                            onOpen();
                          }}
                          _hover={{ opacity: 0.5 }}
                          cursor="pointer"
                        >
                          <Image src="/images/plus.png" height="15px" />
                          <Text fontSize="smaller">Add a New Service</Text>
                        </HStack>
                      )}
                    </HStack>
                  )}
                  {status === "Rejected" && (
                    <HStack
                      _hover={{ opacity: 0.5 }}
                      cursor="pointer"
                      onClick={handleReinvoke}
                    >
                      <Image src="/images/redo.png" height="15px" />
                      <Text>Reinvoke Request</Text>
                    </HStack>
                  )}
                </VStack>
              </VStack>
            </Box>
          )}
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          padding="20px"
          mt="20px"
          w="80%"
        >
          {business && (
            <Box w="95%">
              <VStack
                overflow="auto"
                w="100%"
                padding="20px"
                borderRadius="10px"
                bg="#143E56"
              >
                <HStack w="100%" alignItems="center" justifyContent="center">
                  <Box></Box>
                  <Heading mb="0" size="md">
                    Dashboard
                  </Heading>
                  {/* <Image
                    onClick={() => {
                      setModalShow(false);
                      setDialogShow(true);
                      setDrawerShow(false);
                      onOpen();
                    }}
                    _hover={{ opacity: 0.5 }}
                    cursor="pointer"
                    src="/images/delete.png"
                    height="15px"
                  /> */}
                </HStack>

                <VStack w="100%" overflow="auto">
                  <HStack w="100%" justifyContent="space-between">
                    <Heading size="sm">Username:</Heading>
                    <Heading fontWeight="normal" size="sm">
                      {username}
                    </Heading>
                  </HStack>
                  <HStack w="100%" justifyContent="space-between">
                    <Heading size="sm">Email:</Heading>
                    <Heading fontWeight="normal" size="sm">
                      {email}
                    </Heading>
                  </HStack>
                  <HStack w="100%" justifyContent="space-between">
                    <Heading size="sm">Business Name:</Heading>
                    <Heading fontWeight="normal" size="sm">
                      {business.businessName}
                    </Heading>
                  </HStack>
                  <HStack w="100%" justifyContent="space-between">
                    <Heading size="sm">Country:</Heading>
                    <Heading fontWeight="normal" size="sm">
                      {business.city}, {business.province}, {business.country}
                    </Heading>
                  </HStack>
                  <HStack w="100%" justifyContent="space-between">
                    <Heading size="sm">Contact:</Heading>
                    <Heading fontWeight="normal" size="sm">
                      {business.contact}
                    </Heading>
                  </HStack>
                  <HStack w="100%" justifyContent="space-between">
                    <Text fontWeight="bold">CNIC:</Text>
                    <Text fontSize>{business.cnic}</Text>
                  </HStack>
                  <HStack w="100%" justifyContent="space-between">
                    <Text fontWeight="bold">NTN:</Text>
                    <Text fontSize>{business.ntn}</Text>
                  </HStack>
                  <HStack w="100%" justifyContent="space-between">
                    <Heading size="sm">Account Approval Status:</Heading>
                    <Heading fontWeight="normal" size="sm">
                      {status}
                    </Heading>
                  </HStack>
                </VStack>
                <VStack w="100%" alignItems="flex-start">
                  {services &&
                    status !== "Pending" &&
                    status !== "Rejected" &&
                    services.map((s, i) => (
                      <Button
                        onClick={() => {
                          if (s === "Tour Package") {
                            router.push("../business/registerTourPackage");
                          } else if (s === "Accommodation") {
                            router.push("../business/Accommodation");
                          } else if (s === "Restaurant") {
                            router.push("../business/Restaurant");
                          } else if (s === "Transport") {
                            router.push("../business/Transport");
                          } else if (s === "Guide") {
                            router.push("../business/Guide");
                          }
                        }}
                        key={s + i}
                        size="sm"
                        bg="#2A656D"
                        color="white"
                        _hover={{ opacity: 0.5 }}
                      >
                        Register a {s}
                      </Button>
                    ))}
                  {status !== "Pending" && status !== "Rejected" && (
                    <HStack w="100%" justifyContent="space-between">
                      {services.length !== 4 && (
                        <HStack
                          ref={btnRef}
                          onClick={() => {
                            setModalShow(true);
                            setDialogShow(false);
                            setDrawerShow(false);
                            onOpen();
                          }}
                          _hover={{ opacity: 0.5 }}
                          cursor="pointer"
                        >
                          <Image src="/images/plus.png" height="15px" />
                          <Text fontSize="smaller">Add a New Service</Text>
                        </HStack>
                      )}
                    </HStack>
                  )}
                  {status === "Rejected" && (
                    <HStack
                      _hover={{ opacity: 0.5 }}
                      cursor="pointer"
                      onClick={handleReinvoke}
                    >
                      <Image src="/images/redo.png" height="15px" />
                      <Text>Reinvoke Request</Text>
                    </HStack>
                  )}
                </VStack>
              </VStack>
            </Box>
          )}
        </Box>
      )}
    </Layout>
  );
}
