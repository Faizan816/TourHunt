import { useState, createContext, useContext, useEffect, useRef } from "react";
import "@fontsource/irish-grover"; // Defaults to weight 400
import styles from "./businessLayout.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  useBreakpointValue,
  Button,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Text,
  MenuGroup,
  MenuDivider,
  Box,
  Image,
  HStack,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  Input,
  Avatar,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import axios from "axios";
import EditDrawer from "./EditDrawer";

export default function Layout({ children }) {
  const [active, setActive] = useState("Approvals");
  const router = useRouter();
  const [routeName, setRouteName] = useState(router.pathname);
  const [services, setServices] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [status, setStatus] = useState();
  const [email, setEmail] = useState();
  const [business, setBusiness] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [drawerShow, setDrawerShow] = useState(false);
  const editRef = useRef();

  const isMobile = useBreakpointValue({
    base: true,
    sm: true,
    md: true,
    lg: false,
    xl: false,
  });

  const loadData = async () => {
    const emailResponse = await axios.post(
      "http://127.0.0.1:8000/findUserUsingEmail",
      { email: localStorage.getItem("currentUser") }
    );
    setEmail(emailResponse.data.email);
    const businessResponse = await axios.post(
      "http://127.0.0.1:8000/getBusiness",
      { id: emailResponse.data._id }
    );
    setBusiness(businessResponse.data);
    setServices(businessResponse.data.services);
    setStatus(businessResponse.data.status);
  };

  useEffect(() => {
    if (!business) {
      loadData();
    }
  }, []);

  useEffect(() => {
    // Check if localStorage is available (client-side)
    if (typeof window !== "undefined") {
      // Use localStorage
      const storedUser = localStorage.getItem("currentUser");
      setCurrentUser(storedUser);
    }
  }, []);

  const handleSwitchToUserProfile = () => {
    router.push("../home");
  };

  return (
    <div
      style={{
        backgroundColor: "#1F516D",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {drawerShow && (
        <EditDrawer
          bn={business.businessName}
          l={business.location}
          c={business.contact}
          business={business}
          editRef={editRef}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
      <div className={styles.logoContainer}>
        {isMobile ? (
          <>
            <div
              style={{
                padding: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingLeft: "5%",
                paddingRight: "5%",
              }}
            >
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon color="white" />}
                  variant="outline"
                  _hover={{ bg: "grey" }}
                  colorScheme="white"
                  size="sm"
                />
                <MenuList bg="#1F516D">
                  <MenuItem
                    as="a"
                    href="../business/dashboard"
                    opacity={routeName === "/business/dashboard" ? 0.5 : 1}
                    _hover={{ bg: "grey" }}
                    bg="#1F516D"
                  >
                    Dashboard
                  </MenuItem>
                  {status !== "Rejected" &&
                    status !== "Pending" &&
                    services &&
                    services.map((s, i) => (
                      <MenuItem
                        key={s + i}
                        onClick={() => {
                          if (s === "Tour Package")
                            router.push("../business/tourPackage");
                          if (s === "Accommodation")
                            router.push("../business/AcoomodationDashboard");
                          if (s === "Restaurant")
                            router.push("../business/RestaurantDashboard");
                          if (s === "Transport")
                            router.push("../business/TranpsortDashboard");
                          if (s === "Guide")
                            router.push("../business/GuideDashboard");
                        }}
                        _hover={{ bg: "grey" }}
                        bg="#1F516D"
                        opacity={
                          routeName === "/business/tourPackage" &&
                          s === "Tour Package"
                            ? 0.5
                            : routeName === "/business/RestaurantDashboard" &&
                              s === "Restaurant"
                            ? 0.5
                            : routeName === "/business/TranpsortDashboard" &&
                              s === "Transport"
                            ? 0.5
                            : routeName === "/business/AcoomodationDashboard" &&
                              s === "Accommodation"
                            ? 0.5
                            : routeName === "/business/GuideDashboard" &&
                              s === "Guide"
                            ? 0.5
                            : 1
                        }
                      >
                        {s}
                      </MenuItem>
                    ))}
                  <MenuItem
                    onClick={() => router.push("../business/serviceRequests")}
                    _hover={{ bg: "grey" }}
                    bg="#1F516D"
                    opacity={
                      routeName === "/business/serviceRequests" ? 0.5 : 1
                    }
                  >
                    Pending Requests
                  </MenuItem>
                  <MenuItem
                    onClick={() => router.push("../business/purchasedServices")}
                    _hover={{ bg: "grey" }}
                    bg="#1F516D"
                    opacity={
                      routeName === "/business/purchasedServices" ? 0.5 : 1
                    }
                  >
                    Purchased Services
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      router.push("../business/deactivatedTourPackages")
                    }
                    _hover={{ bg: "grey" }}
                    bg="#1F516D"
                    opacity={
                      routeName === "/business/deactivatedTourPackages"
                        ? 0.5
                        : 1
                    }
                  >
                    Deactivated Tour Packages
                  </MenuItem>
                </MenuList>
              </Menu>
              <div>
                <h1
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 30,
                    fontFamily: "Irish Grover",
                    marginBottom: 0,
                  }}
                >
                  Tour Hunt
                </h1>
              </div>

              <div>
                <Menu>
                  <Box as="span" display="inline-block" width="auto">
                    <MenuButton
                      _hover={{ opacity: 0.5 }}
                      as={Button}
                      colorScheme="#2A656D"
                      p={0}
                    >
                      <Avatar src="/images/profile-logo.png" />
                    </MenuButton>
                  </Box>
                  <MenuList bg="#2A656D">
                    <MenuGroup title={email}>
                      {/* <MenuItem
                        onClick={handleSwitchToUserProfile}
                        bg="#2A656D"
                        _hover={{ bg: "grey" }}
                      >
                        Switch to User Profile
                      </MenuItem> */}
                    </MenuGroup>
                    <MenuDivider />
                    {currentUser ? (
                      <MenuItem
                        as="a"
                        href="../home"
                        onClick={() => localStorage.removeItem("currentUser")}
                        bg="#2A656D"
                        _hover={{ bg: "grey" }}
                      >
                        Logout
                      </MenuItem>
                    ) : (
                      <MenuItem
                        as="a"
                        href="../login"
                        bg="#2A656D"
                        _hover={{ bg: "grey" }}
                      >
                        Login
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                padding: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingLeft: 50,
                paddingRight: 50,
              }}
            >
              <div>
                <h1
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 40,
                    fontFamily: "Irish Grover",
                  }}
                >
                  Tour Hunt
                </h1>
              </div>

              <div>
                <Menu>
                  <Box as="span" display="inline-block" width="auto">
                    <MenuButton
                      _hover={{ opacity: 0.5 }}
                      as={Button}
                      colorScheme="#2A656D"
                      p={0}
                    >
                      <Avatar src="/images/profile-logo.png" />
                    </MenuButton>
                  </Box>
                  <MenuList bg="#2A656D">
                    <MenuGroup title={email}>
                      {/* <MenuItem
                        onClick={handleSwitchToUserProfile}
                        bg="#2A656D"
                        _hover={{ bg: "grey" }}
                      >
                        Switch to User Profile
                      </MenuItem> */}
                    </MenuGroup>
                    <MenuDivider />
                    {currentUser ? (
                      <MenuItem
                        as="a"
                        href="../home"
                        onClick={() => localStorage.removeItem("currentUser")}
                        bg="#2A656D"
                        _hover={{ bg: "grey" }}
                      >
                        Logout
                      </MenuItem>
                    ) : (
                      <MenuItem
                        as="a"
                        href="../login"
                        bg="#2A656D"
                        _hover={{ bg: "grey" }}
                      >
                        Login
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              </div>
            </div>
          </>
        )}
      </div>
      <div
        className={styles.container}
        style={isMobile ? { justifyContent: "center" } : { display: "flex" }}
      >
        {!isMobile && (
          <div
            className={styles.menu}
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#143E56",
              width: "15%",
              paddingBottom: 240,
              marginTop: 39,
              paddingRight: 20,
              fontSize: "medium",
            }}
          >
            <Box
              mt="7%"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <Image src="/images/user.png" h="100%" />
              <HStack
                onClick={() => {
                  setDrawerShow(true);
                  onOpen();
                }}
                cursor="pointer"
                _hover={{ opacity: 0.5 }}
                justifyContent="center"
                alignItems="center"
                ref={editRef}
              >
                <Image src="/images/edit.png" h="15px" />
                <Text
                  fontWeight="normal"
                  textDecoration="underline"
                  fontSize="small"
                >
                  Edit your profile
                </Text>
              </HStack>
            </Box>
            <div
              style={{
                marginLeft: "10%",
                marginTop: "20%",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                fontWeight: "bold",
              }}
            >
              <Text
                onClick={() => {
                  router.push("../business/dashboard");
                }}
                _hover={{ opacity: 0.5 }}
                opacity={routeName === "/business/dashboard" ? 0.5 : 1}
              >
                Dashboard
              </Text>
              {status !== "Rejected" &&
                status !== "Pending" &&
                services &&
                services.map((s, i) => (
                  <Text
                    onClick={() => {
                      if (s === "Tour Package")
                        router.push("../business/tourPackage");
                      if (s === "Accommodation")
                        router.push("../business/AcoomodationDashboard");
                      if (s === "Restaurant")
                        router.push("../business/RestaurantDashboard");
                      if (s === "Transport")
                        router.push("../business/TranpsortDashboard");
                      if (s === "Guide")
                        router.push("../business/GuideDashboard");
                    }}
                    opacity={
                      routeName === "/business/tourPackage" &&
                      s === "Tour Package"
                        ? 0.5
                        : routeName === "/business/RestaurantDashboard" &&
                          s === "Restaurant"
                        ? 0.5
                        : routeName === "/business/TranpsortDashboard" &&
                          s === "Transport"
                        ? 0.5
                        : routeName === "/business/AcoomodationDashboard" &&
                          s === "Accommodation"
                        ? 0.5
                        : routeName === "/business/GuideDashboard" &&
                          s === "Guide"
                        ? 0.5
                        : 1
                    }
                    key={s + i}
                    _hover={{ opacity: 0.5 }}
                  >
                    {s}
                  </Text>
                ))}
              <Text
                onClick={() => {
                  router.push("../business/serviceRequests");
                }}
                _hover={{ opacity: 0.5 }}
                opacity={routeName === "/business/serviceRequests" ? 0.5 : 1}
              >
                Pending Requests
              </Text>
              <Text
                onClick={() => {
                  router.push("../business/purchasedServices");
                }}
                _hover={{ opacity: 0.5 }}
                opacity={routeName === "/business/purchasedServices" ? 0.5 : 1}
              >
                Purchased Services
              </Text>
              <Text
                onClick={() => {
                  router.push("../business/deactivatedTourPackages");
                }}
                _hover={{ opacity: 0.5 }}
                opacity={
                  routeName === "/business/deactivatedTourPackages" ? 0.5 : 1
                }
              >
                Deactivated Tour Packages
              </Text>
            </div>
          </div>
        )}

        {children}
      </div>
      <div
        style={{
          width: "100%",
          paddingTop: 50,
          paddingBottom: 50,
          backgroundColor: "#143E56",
          marginTop: "3%",
        }}
      >
        <p style={{ textAlign: "center", fontSize: 12 }}>
          © 2024 Tour Hunt. All rights reserved.
        </p>
      </div>
    </div>
  );
}
