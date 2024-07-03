import { useState, createContext, useContext, useEffect } from "react";
import "@fontsource/irish-grover"; // Defaults to weight 400
import styles from "./adminLayout.module.css";
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
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import axios from "axios";

export default function Layout({ children }) {
  const [active, setActive] = useState("Approvals");
  const router = useRouter();
  const [routeName, setRouteName] = useState(router.pathname);

  const isMobile = useBreakpointValue({
    base: true,
    sm: true,
    md: true,
    lg: false,
    xl: false,
  });

  useEffect(() => {
    const verifyAdminLogin = async () => {
      try {
        await axios.post("http://127.0.0.1:8000/verifyAdmin", {
          email: localStorage.getItem("currentUser"),
        });
      } catch (error) {
        router.push("../admin/adminLogin");
      }
    };
    verifyAdminLogin();
  }, []);

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
      <div className={styles.logoContainer}>
        {isMobile ? (
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
                    href="../admin/dashboard"
                    _hover={{ bg: "grey" }}
                    bg="#1F516D"
                    opacity={routeName === "/admin/dashboard" ? 0.5 : 1}
                  >
                    Dashboard
                  </MenuItem>
                  <MenuItem
                    as="a"
                    href="../admin/approval"
                    _hover={{ bg: "grey" }}
                    bg="#1F516D"
                    opacity={routeName === "/admin/approval" ? 0.5 : 1}
                  >
                    Service Requests
                  </MenuItem>
                  {/* <MenuItem
                    as="a"
                    href="#"
                    _hover={{ bg: "grey" }}
                    bg="#1F516D"
                    opacity={routeName === "/admin/userManagement" ? 0.5 : 1}
                  >
                    User Management
                  </MenuItem>
                  <MenuItem
                    as="a"
                    href="#"
                    _hover={{ bg: "grey" }}
                    bg="#1F516D"
                    opacity={routeName === "/admin/serviceManagement" ? 0.5 : 1}
                  >
                    Services Management
                  </MenuItem> */}
                  <MenuItem
                    as="a"
                    href="../admin/serviceReviews"
                    _hover={{ bg: "grey" }}
                    bg="#1F516D"
                    opacity={routeName === "/admin/serviceReviews" ? 0.5 : 1}
                  >
                    Service Reviews
                  </MenuItem>
                  <MenuItem
                    as="a"
                    href="../admin/businessRequests"
                    _hover={{ bg: "grey" }}
                    bg="#1F516D"
                    opacity={routeName === "/admin/businessRequests" ? 0.5 : 1}
                  >
                    Business Account Approval
                  </MenuItem>
                  <MenuItem
                    as="a"
                    href="../admin/requestsHistory"
                    _hover={{ bg: "grey" }}
                    bg="#1F516D"
                    opacity={routeName === "/admin/requestsHistory" ? 0.5 : 1}
                  >
                    Requests History
                  </MenuItem>
                  <MenuItem
                    as="a"
                    href="../admin/transactionsHistory"
                    _hover={{ bg: "grey" }}
                    bg="#1F516D"
                    opacity={
                      routeName === "/admin/transactionsHistory" ? 0.5 : 1
                    }
                  >
                    Transactions History
                  </MenuItem>
                  <MenuItem
                    as="a"
                    href="../admin/complaints"
                    _hover={{ bg: "grey" }}
                    bg="#1F516D"
                    opacity={routeName === "/admin/complaints" ? 0.5 : 1}
                  >
                    Complaints
                  </MenuItem>
                  <MenuItem
                    as="a"
                    href="../admin/users"
                    _hover={{ bg: "grey" }}
                    bg="#1F516D"
                    opacity={routeName === "/admin/users" ? 0.5 : 1}
                  >
                    Users
                  </MenuItem>
                  <MenuItem
                    as="a"
                    href="../admin/services"
                    _hover={{ bg: "grey" }}
                    bg="#1F516D"
                    opacity={routeName === "/admin/services" ? 0.5 : 1}
                  >
                    Services
                  </MenuItem>
                </MenuList>
              </Menu>
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
                <Link
                  onClick={() => localStorage.removeItem("currentUser")}
                  href="../home"
                >
                  <Button bg="#2A656D" color="white" _hover={{ opacity: 0.5 }}>
                    Logout
                  </Button>
                </Link>
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
                <Link
                  onClick={() => localStorage.removeItem("currentUser")}
                  href="../home"
                >
                  <Button bg="#2A656D" color="white" _hover={{ opacity: 0.5 }}>
                    Logout
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
        {/* <div
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
            <Link
              onClick={() => localStorage.removeItem("currentUser")}
              href="../home"
            >
              <Button bg="#2A656D" color="white" _hover={{ opacity: 0.5 }}>
                Logout
              </Button>
            </Link>
          </div>
        </div> */}
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
              width: "20%",
              paddingBottom: 240,
              marginTop: 39,
              paddingRight: 20,
              fontSize: "medium",
            }}
          >
            <div
              style={{
                marginLeft: "10%",
                marginTop: 50,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                fontWeight: "bold",
                // color: "black",
              }}
            >
              <Text
                opacity={routeName === "/admin/dashboard" ? 0.5 : 1}
                onClick={() => {
                  router.push("../admin/dashboard");
                }}
                _hover={{ opacity: 0.5 }}
              >
                Dashboard
              </Text>
              <Text
                opacity={routeName === "/admin/approval" ? 0.5 : 1}
                onClick={() => {
                  router.push("../admin/approval");
                }}
                _hover={{ opacity: 0.5 }}
              >
                Service Requests
              </Text>
              {/* <Text
                opacity={routeName === "/admin/userManagement" ? 0.5 : 1}
                onClick={() => setActive("User Management")}
              >
                User Management
              </Text>
              <Text
                opacity={routeName === "/admin/serviceManagement" ? 0.5 : 1}
                onClick={() => setActive("Service Management")}
              >
                Service Management
              </Text> */}
              <Text
                _hover={{ opacity: 0.5 }}
                opacity={routeName === "/admin/serviceReviews" ? 0.5 : 1}
                onClick={() => {
                  router.push("../admin/serviceReviews");
                }}
              >
                Service Reviews
              </Text>
              <Text
                _hover={{ opacity: 0.5 }}
                opacity={routeName === "/admin/businessRequests" ? 0.5 : 1}
                onClick={() => {
                  router.push("../admin/businessRequests");
                }}
              >
                Business Account Approval
              </Text>
              <Text
                _hover={{ opacity: 0.5 }}
                opacity={routeName === "/admin/requestsHistory" ? 0.5 : 1}
                onClick={() => {
                  router.push("../admin/requestsHistory");
                }}
              >
                Requests History
              </Text>
              <Text
                _hover={{ opacity: 0.5 }}
                opacity={routeName === "/admin/transactionsHistory" ? 0.5 : 1}
                onClick={() => {
                  router.push("../admin/transactionsHistory");
                }}
              >
                Transactions History
              </Text>
              <Text
                _hover={{ opacity: 0.5 }}
                opacity={routeName === "/admin/complaints" ? 0.5 : 1}
                onClick={() => {
                  router.push("../admin/complaints");
                }}
              >
                Complaints
              </Text>
              <Text
                _hover={{ opacity: 0.5 }}
                opacity={routeName === "/admin/users" ? 0.5 : 1}
                onClick={() => {
                  router.push("../admin/users");
                }}
              >
                Users
              </Text>
              <Text
                _hover={{ opacity: 0.5 }}
                opacity={routeName === "/admin/services" ? 0.5 : 1}
                onClick={() => {
                  router.push("../admin/services");
                }}
              >
                Services
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
