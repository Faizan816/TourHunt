import "@fontsource/irish-grover"; // Defaults to weight 400
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  HStack,
  Heading,
  Button,
  MenuDivider,
  MenuGroup,
  Stack,
  useBreakpointValue,
  IconButton,
  Avatar,
  InputGroup,
  Input,
  InputRightElement,
} from "@chakra-ui/react";

import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import { current } from "@reduxjs/toolkit";
import axios from "axios";
import jwtDecode from "jwt-decode";

export default function Logo() {
  const router = useRouter();
  const [routeName, setRouteName] = useState(router.pathname);
  const [subMenuVisible, setSubMenuVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [email, setEmail] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchBox();
    }
  };

  useEffect(() => {
    // Check if localStorage is available (client-side)
    if (typeof window !== "undefined") {
      // Use localStorage
      const storedUser = localStorage.getItem("currentUser");
      setCurrentUser(storedUser);
      setIsLoggedIn(!!storedUser);
    }
  }, []);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode token
        const currentTime = Date.now() / 1000; // Current time in seconds
        if (decodedToken.exp < currentTime) {
          // Token has expired, log out the user
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser"); // Remove user from localStorage
          setCurrentUser(null); // Update currentUser state to null after logout
          setUsername(null); // Update username state to null after logout
          setIsLoggedIn(false);
          signOut();
          // Redirect to home page
          router.push("/home");
        }
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000); // Check every minute
    checkTokenExpiration(); // Check when component mounts

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setCurrentUser(null); // Update currentUser state to null after logout
    setEmail(null); // Update username state to null after logout
    setIsLoggedIn(false); // Update isLoggedIn state to false
    signOut({ redirect: false });
    // router.push("/login");
  };

  const getUser = async () => {
    const userResponse = await axios.post(
      "http://127.0.0.1:8000/findUserUsingEmail",
      { email: localStorage.getItem("currentUser") }
    );

    setEmail(userResponse.data.email);
    console.log(userResponse.data.userType);

    try {
      //getting profile picture
      const profilePictureResponse = await axios.post(
        "http://127.0.0.1:8000/getProfilePicture",
        { userId: userResponse.data._id }
      );
      setProfilePicture(profilePictureResponse.data.profilePicture);
    } catch (error) {}

    // try {
    //   const business = await axios.post("http://127.0.0.1:8000/getBusiness", {
    //     id: userResponse.data._id,
    //   });
    //   console.log("Business: " + business.data);

    //   const businessInvite = await axios.post(
    //     "http://127.0.0.1:8000/getBusinessInvite",
    //     {
    //       id: userResponse.data._id,
    //     }
    //   );
    //   console.log("Business Invite" + businessInvite.data);
    // } catch (error) {
    //   // console.log("Error: " + error);
    // }
  };
  if (currentUser) getUser();

  const isMobile = useBreakpointValue({
    base: true,
    sm: true,
    md: true,
    lg: false,
    xl: false,
  });

  const handleSwitchToBusinessProfile = async () => {
    if (localStorage.getItem("currentUser")) {
      const userResponse = await axios.post(
        "http://127.0.0.1:8000/findUserUsingEmail",
        { email: localStorage.getItem("currentUser") }
      );

      try {
        const businessResponse = await axios.post(
          "http://127.0.0.1:8000/getBusiness",
          { id: userResponse.data._id }
        );
        if (businessResponse.data.businessName)
          router.push("../business/dashboard");
      } catch (error) {
        try {
          const bi = await axios.post(
            "http://127.0.0.1:8000/getBusinessInvite",
            {
              id: userResponse.data._id,
            }
          );
          if (bi.data.businessName) router.push("../business/dashboard");
        } catch (error) {
          router.push("../business/welcome");
        }
      }
    } else {
      router.push("../login");
    }
  };

  const handleSearchBox = () => {
    if (filterText !== "") {
      router.push({
        pathname: "../results",
        query: { search: filterText },
      });
    }
  };

  return (
    <Box w="100%">
      <HStack
        padding="10px 0px"
        justifyContent="space-between"
        pl="40px"
        pr="40px"
      >
        {isMobile ? (
          <>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon color="white" />}
                variant="outline"
                _hover={{ bg: "grey" }}
                colorScheme="white"
              />
              <MenuList bg="#1F516D">
                <MenuItem
                  as="a"
                  href="../home"
                  _hover={{ bg: "grey" }}
                  bg="#1F516D"
                  opacity={routeName == "/home" ? 0.5 : 1}
                >
                  Home
                </MenuItem>
                {/* <MenuItem
                  as="a"
                  href="../expenseConfiguration"
                  _hover={{ bg: "grey" }}
                  bg="#1F516D"
                  opacity={routeName == "/expenseConfiguration" ? 0.5 : 1}
                >
                  Expenses
                </MenuItem> */}
                <MenuItem
                  as="a"
                  href="../results"
                  _hover={{ bg: "grey" }}
                  bg="#1F516D"
                  opacity={routeName == "/results" ? 0.5 : 1}
                >
                  Explore
                </MenuItem>
                <Box>
                  <MenuItem
                    as="a"
                    href="../community/community"
                    _hover={{ bg: "grey" }}
                    bg="#1F516D"
                    opacity={routeName == "/community/community" ? 0.5 : 1}
                  >
                    Community
                  </MenuItem>
                  <MenuItem
                    as="a"
                    href="../customer/reviews"
                    _hover={{ bg: "grey" }}
                    bg="#1F516D"
                    opacity={routeName == "/customer/reviews" ? 0.5 : 1}
                  >
                    Reviews
                  </MenuItem>
                </Box>

                {/* <MenuItem
                  as="a"
                  href="../admin/adminLogin"
                  _hover={{ bg: "grey" }}
                  bg="#1F516D"
                  opacity={routeName == "/admin/adminLogin" ? 0.5 : 1}
                >
                  Admin
                </MenuItem> */}
                <MenuItem
                  as="a"
                  href="../customer/bookings"
                  _hover={{ bg: "grey" }}
                  bg="#1F516D"
                  opacity={routeName == "/customer/bookings" ? 0.5 : 1}
                >
                  Bookings
                </MenuItem>
                <MenuItem
                  as="a"
                  href="../customer/receipts"
                  _hover={{ bg: "grey" }}
                  bg="#1F516D"
                  opacity={routeName == "/customer/receipts" ? 0.5 : 1}
                >
                  Receipts
                </MenuItem>
                <MenuItem
                  as="a"
                  href="../customer/suggestions"
                  _hover={{ bg: "grey" }}
                  bg="#1F516D"
                  opacity={routeName == "/customer/suggestions" ? 0.5 : 1}
                >
                  Suggestions
                </MenuItem>
                <MenuItem
                  as="a"
                  href="../customer/account"
                  _hover={{ bg: "grey" }}
                  bg="#1F516D"
                  opacity={routeName == "/customer/account" ? 0.5 : 1}
                >
                  Account
                </MenuItem>
                <MenuItem
                  as="a"
                  href="../customer/favorites"
                  _hover={{ bg: "grey" }}
                  bg="#1F516D"
                  opacity={routeName == "/customer/favorites" ? 0.5 : 1}
                >
                  Favorites
                </MenuItem>
              </MenuList>
            </Menu>
            <Box>
              <Heading fontFamily="Irish Grover">Tour Hunt</Heading>
            </Box>
          </>
        ) : (
          <>
            <Box>
              <Heading fontFamily="Irish Grover">Tour Hunt</Heading>
            </Box>
            <InputGroup size="sm" w="50%">
              <InputRightElement cursor="pointer">
                <SearchIcon onClick={handleSearchBox} color="gray.300" />
              </InputRightElement>
              <Input
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                borderRadius="20px"
                type="tel"
                placeholder="Search entire site here"
              />
            </InputGroup>
          </>
        )}

        <Box>
          {!currentUser ? (
            <>
              <Button
                onClick={() => {
                  router.push("../login");
                }}
                bg="#2A656D"
                _hover={{ opacity: 0.5 }}
                color="white"
              >
                Login
              </Button>
            </>
          ) : (
            <>
              <Menu>
                <Box as="span" display="inline-block" width="auto">
                  <MenuButton
                    _hover={{ opacity: 0.5 }}
                    as={Button}
                    colorScheme="#2A656D"
                    p={0}
                  >
                    {profilePicture ? (
                      <Avatar src={profilePicture} alt="Profile" />
                    ) : (
                      <Avatar src="/images/user.png" />
                    )}
                  </MenuButton>
                </Box>
                <MenuList bg="#2A656D">
                  <MenuGroup title={email}>
                    {/* <MenuItem
                      onClick={handleSwitchToBusinessProfile}
                      bg="#2A656D"
                      _hover={{ bg: "grey" }}
                    >
                      Switch to Business Profile
                    </MenuItem> */}
                  </MenuGroup>
                  <MenuDivider />
                  {currentUser ? (
                    <MenuItem
                      as="a"
                      href="../home"
                      onClick={handleLogout}
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
            </>
          )}
        </Box>
      </HStack>
      {/* for search box in mobile version */}
      {isMobile && (
        <Box
          border="1px"
          display="flex"
          justifyContent="center"
          pb="10px"
          pt="10px"
        >
          <InputGroup size="sm" w="50%">
            <InputRightElement cursor="pointer">
              <SearchIcon onClick={handleSearchBox} color="gray.300" />
            </InputRightElement>
            <Input
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              borderRadius="20px"
              type="tel"
              placeholder="Search entire site here"
              onKeyDown={handleKeyPress}
            />
          </InputGroup>
        </Box>
      )}

      <Box fontSize="sm">
        {!isMobile && (
          <>
            <HStack
              pb="10px"
              pt="10px"
              border="1px"
              borderLeft="0"
              borderRight="0"
              w="100%"
              justifyContent="space-around"
            >
              <Stack direction={["column", "row"]} spacing={[1, 6]}>
                <Menu isLazy>
                  <Box _hover={{ opacity: 0.5 }}>
                    <MenuButton
                      as="a"
                      href="../home"
                      style={
                        routeName == "/home" ? { opacity: 0.5 } : { opacity: 1 }
                      }
                    >
                      Home
                    </MenuButton>
                  </Box>
                </Menu>
                {/* <Menu isLazy>
                  <Box _hover={{ opacity: 0.5 }}>
                    <MenuButton
                      as="a"
                      href="../expenseConfiguration"
                      style={
                        routeName == "/expenseConfiguration"
                          ? { opacity: 0.5 }
                          : { opacity: 1 }
                      }
                    >
                      Expenses
                    </MenuButton>
                  </Box>
                </Menu> */}
                <Menu isLazy>
                  <Box _hover={{ opacity: 0.5 }}>
                    <MenuButton
                      as="a"
                      href="../results"
                      style={
                        routeName == "/results"
                          ? { opacity: 0.5 }
                          : { opacity: 1 }
                      }
                    >
                      Explore
                    </MenuButton>
                  </Box>
                </Menu>
                <Menu isLazy>
                  <Box _hover={{ opacity: 0.5 }}>
                    <MenuButton
                      as="a"
                      href="../community/community"
                      style={
                        routeName == "/community/community"
                          ? { opacity: 0.5 }
                          : { opacity: 1 }
                      }
                    >
                      Community
                    </MenuButton>
                  </Box>
                </Menu>
                <Menu isLazy>
                  <Box _hover={{ opacity: 0.5 }}>
                    <MenuButton
                      as="a"
                      href="../customer/reviews"
                      style={
                        routeName == "/customer/reviews"
                          ? { opacity: 0.5 }
                          : { opacity: 1 }
                      }
                    >
                      Reviews
                    </MenuButton>
                  </Box>
                </Menu>
                {/* <Menu isLazy>
                  <Box _hover={{ opacity: 0.5 }}>
                    <MenuButton
                      as="a"
                      href="../admin/adminLogin"
                      style={
                        routeName == "/admin/adminLogin"
                          ? { opacity: 0.5 }
                          : { opacity: 1 }
                      }
                    >
                      Admin
                    </MenuButton>
                  </Box>
                </Menu> */}
                {/* <Menu isLazy>
                  <Box _hover={{ opacity: 0.5 }}>
                    <MenuButton
                      as="a"
                      href="../customer/account"
                      style={
                        routeName == "/customer/account"
                          ? { opacity: 0.5 }
                          : { opacity: 1 }
                      }
                    >
                      Account
                    </MenuButton>
                  </Box>
                </Menu> */}
                <Menu isLazy>
                  <Box _hover={{ opacity: 0.5 }}>
                    <MenuButton
                      as="a"
                      href="../customer/bookings"
                      style={
                        routeName == "/customer/bookings"
                          ? { opacity: 0.5 }
                          : { opacity: 1 }
                      }
                    >
                      Bookings
                    </MenuButton>
                  </Box>
                </Menu>
                <Menu isLazy>
                  <Box _hover={{ opacity: 0.5 }}>
                    <MenuButton
                      as="a"
                      href="../customer/receipts"
                      style={
                        routeName == "/customer/receipts"
                          ? { opacity: 0.5 }
                          : { opacity: 1 }
                      }
                    >
                      Receipts
                    </MenuButton>
                  </Box>
                </Menu>
                <Menu isLazy>
                  <Box _hover={{ opacity: 0.5 }}>
                    <MenuButton
                      as="a"
                      href="../customer/suggestions"
                      style={
                        routeName == "/customer/suggestions"
                          ? { opacity: 0.5 }
                          : { opacity: 1 }
                      }
                    >
                      Suggestions
                    </MenuButton>
                  </Box>
                </Menu>
                <Menu isLazy>
                  <Box _hover={{ opacity: 0.5 }}>
                    <MenuButton
                      as="a"
                      href="../customer/account"
                      style={
                        routeName == "/customer/account"
                          ? { opacity: 0.5 }
                          : { opacity: 1 }
                      }
                    >
                      Account
                    </MenuButton>
                  </Box>
                </Menu>
                <Menu isLazy>
                  <Box _hover={{ opacity: 0.5 }}>
                    <MenuButton
                      as="a"
                      href="../customer/favorites"
                      style={
                        routeName == "/customer/favorites"
                          ? { opacity: 0.5 }
                          : { opacity: 1 }
                      }
                    >
                      Favorites
                    </MenuButton>
                  </Box>
                </Menu>
                {/* <Menu isLazy>
                  <Box _hover={{ opacity: 0.5 }}>
                    <MenuButton
                      onClick={() =>
                        router.push({
                          pathname: "../results",
                          query: { service: "restaurant" },
                        })
                      }
                    >
                      Restaurants
                    </MenuButton>
                  </Box>
                </Menu>
                <Menu isLazy>
                  <Box _hover={{ opacity: 0.5 }}>
                    <MenuButton
                      onClick={() =>
                        router.push({
                          pathname: "../results",
                          query: { service: "transport" },
                        })
                      }
                    >
                      Transports
                    </MenuButton>
                  </Box>
                </Menu>
                <Menu isLazy>
                  <Box _hover={{ opacity: 0.5 }}>
                    <MenuButton
                      onClick={() =>
                        router.push({
                          pathname: "../results",
                          query: { service: "accommodation" },
                        })
                      }
                    >
                      Accommodations
                    </MenuButton>
                  </Box>
                </Menu> */}
                {/* <Menu isLazy>
                  <Box _hover={{ opacity: 0.5 }}>
                    <MenuButton>More</MenuButton>
                  </Box>
                  <MenuList bg="#1F516D">
                    <Box>
                      <MenuItem
                        as="a"
                        href="../customer/reviews"
                        _hover={{ bg: "grey" }}
                        bg="#1F516D"
                        opacity={routeName == "/customer/reviews" ? 0.5 : 1}
                      >
                        Reviews
                      </MenuItem>
                    </Box>

                    <MenuItem
                      _hover={{ bg: "grey" }}
                      bg="#1F516D"
                      as="a"
                      href="../admin/adminLogin"
                      opacity={routeName == "/admin/adminLogin" ? 0.5 : 1}
                    >
                      Admin
                    </MenuItem>
                  </MenuList>
                </Menu> */}
              </Stack>
            </HStack>
          </>
        )}
      </Box>
    </Box>
  );
}
