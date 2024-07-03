import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, useSession } from "next-auth/react";
import {
  faEnvelope,
  faLock,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import google from "../assets/Image/google.png";
import fb from "../assets/Image/facebook.png";
import apple from "../assets/Image/apple.png";
import React from "react";
import {
  Center,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast(); // Initialize Chakra UI toast
  const router = useRouter();
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const togglePasswordNewVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };
  const togglePasswordConfirmVisibility = () =>
    setShowNewConfirmPassword(!showNewConfirmPassword);

  const handleLogin = async () => {
    if (!email || !password) {
      // Both email and password fields should be filled
      toast({
        description: "Please enter both email and password",
        status: "error",
        duration: 2000,
        position: "top",
        variant: "solid", // Use solid background style
      });
      return;
    }

    try {
      const userResponse = await axios.post(
        "http://127.0.0.1:8000/findUserUsingEmail",
        { email }
      );

      if (!userResponse.data) {
        toast({
          description: "User not found",
          status: "error",
          duration: 2000,
          position: "top",
          variant: "solid", // Use solid background style
        });
        return;
      }

      // check if user has not verified email through email address
      if (!userResponse.data.isVerified) {
        toast({
          description:
            "Please verify your email using the link received in your email address! If link is expired, signup using different email.",
          status: "warning",
          duration: 5000,
          position: "top",
          isClosable: true,
        });
        return; // Exit the function if the user is not verified
      }

      // Extract the username and userType from the response
      const { username, userType } = userResponse.data;
      console.log("this is username of login person", username);

      // Save the user's data to the current user based on userType
      const setCurrentUserResponse = await axios.post(
        "http://localhost:8000/setCurrentUser",
        { username, email, password, userType }
      );

      const { message, token } = setCurrentUserResponse.data;
      // Display a success message
      toast({
        description: `Welcome ${username}!`,
        status: "success",
        duration: 2000,
        position: "top-right",
      });

      // Save credentials to local storage
      localStorage.setItem("currentUser", email);
      localStorage.setItem("token", token);

      // Redirect based on userType
      if (userType === "customer") {
        router.push("/home");
      } else if (userType === "businessOwner") {
        router.push("/business/welcome");
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        toast({
          description: error.response.data.error,
          status: "error",
          duration: 2000,
          position: "top",
        });
      } else if (error.request) {
        // The request was made but no response was received
        toast({
          description: "No response received from server",
          status: "error",
          duration: 2000,
          position: "top",
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        toast({
          description: "An error occurred: " + error.message,
          status: "error",
          duration: 2000,
          position: "top",
        });
      }
      console.error(error);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post("http://localhost:8000/check-email", {
        email,
      });
      toast({
        description: "Reset your password now!",
        status: "success",
        position: "top",
        duration: 2000,
      });
      // Open the Chakra UI modal for changing password
      onOpen();
    } catch (error) {
      if (error.response) {
        toast({
          description: error.response.data.error,
          status: "error",
          position: "top",
          duration: 1000,
        });
      } else if (error.request) {
        toast({
          description: "No response received from server",
          status: "error",
          duration: 2000,
          position: "top",
        });
      } else {
        toast({
          description: "An error occurred: " + error.message,
          status: "error",
          duration: 2000,
          position: "top",
        });
      }
      console.error(error);
    }
  };

  const handleCancel = () => {
    // Reset password and confirm password fields
    setNewPassword("");
    setConfirmPassword("");

    // Close the modal
    onClose();
  };

  const handleSavePassword = async () => {
    if (newPassword === "" || confirmPassword === "") {
      // Display error toast indicating that both fields are required
      toast({
        description: "Both fields are required.",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      // Display error toast indicating that passwords do not match
      toast({
        description: "Passwords do not match.",
        position: "top",
        status: "error",
        duration: 2000,
      });
      return;
    }

    // Check password strength
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&,.\/<>?;':"[\]{}\\|\-=+_)(*&^%$#@!`~])[A-Za-z\d@$!%*#?&,.\/<>?;':"[\]{}\\|\-=+_)(*&^%$#@!`~]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      // Display error toast indicating weak password
      toast({
        description:
          "Password must be at least 8 characters long and contain letters, numbers, and special characters.",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return;
    }
    try {
      // Send request to backend to update the password
      const response = await axios.put(
        "http://localhost:8000/update-password",
        { email, newPassword }
      );

      const userResponse = await axios.post(
        "http://127.0.0.1:8000/findUserUsingEmail",
        { email }
      );
      // Extract the username and userType from the response
      const { username, userType } = userResponse.data;
      console.log(userResponse.data);
      // Save the user's data to the current user based on userType
      const setCurrentUserResponse = await axios.post(
        "http://localhost:8000/setCurrentUser",
        { username, email, password, userType }
      );

      const { message, token } = setCurrentUserResponse.data;
      // Save credentials to local storage
      localStorage.setItem("currentUser", email);
      localStorage.setItem("token", token);
      console.log(localStorage.getItem("currentUser"));

      // Display success toast
      toast({
        description: `Password updated successfully! Welcome ${username}!`,
        status: "success",
        position: "top",
        duration: 2000,
      });

      // Redirect based on userType
      if (userType === "customer") {
        router.push("/home");
      } else if (userType === "businessOwner") {
        router.push("/business/welcome");
      }
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        onClose();
      }, 2000); // Adjust the delay as needed
    } catch (error) {
      // Handle error
      console.error("Error updating password:", error);
      // Display error toast
      toast({
        description:
          "An error occurred while updating password. Please try again later.",
        status: "error",
        position: "top",
        duration: 2000,
      });
    }
  };

  const { data: session } = useSession(); // Access session data

  console.log("this is session ", session);
  const handleGoogleLoginSuccess = async () => {
    try {
      if (!session) {
        console.log("there is no session");
        signIn(
          "google",
          { callbackUrl: "/User" } // Redirect to the "User" page after signing in
        );
        return;
      } else {
        const { email, name } = session.user;

        // Check if the user's email is already in the database
        const userResponse = await axios.post(
          "http://127.0.0.1:8000/findUserUsingEmail",
          { email }
        );

        console.log("USER RESPONSE", userResponse.data);
        // Extract the username and userType from the response
        const { userType, username, user } = userResponse.data;

        console.log("this is after user response", userType);
        // Save user data to current user if user exists
        if (user) {
          const setCurrentUserResponse = await axios.post(
            "http://localhost:8000/setCurrentUser",
            { username, email, userType }
          );
          const { message, token } = setCurrentUserResponse.data;

          // Display success message
          toast({
            description: message,
            status: "success",
            duration: 2000,
            position: "top",
          });

          // Save credentials to local storage
          localStorage.setItem("currentUser", email);
          localStorage.setItem("token", token);

          console.log("this is before redirect", userType);
          // Redirect based on userType
          if (userType === "customer") {
            console.log("hello");
            router.push("/home");
          } else if (userType === "businessOwner") {
            router.push("/business/welcome");
          }
        } else {
          console.log("else block in the google login");
          // User doesn't exist, redirect to user page for registration
          router.push({
            pathname: "/User",
            query: { username: name, email },
          });
        }
      }
    } catch (error) {
      console.error("Error occurred:", error);
      // Handle error
    }
  };

  return (
    <>
      <div className="main_box">
        <div className="container-fluid ">
          <div className="row row-change">
            <div className="col-lg-7 col-sm-12 padding-change">
              <div className="block">
                <div className="image-box"></div>
              </div>
            </div>
            <div className="col-lg-5 col-sm-12 padding-change">
              <div className="login_thing">
                <div className="title">
                  <h1 className="heading">LOGIN</h1>
                </div>
                <div className="inputs">
                  <div className="email-div">
                    <label htmlFor="email" className="email-label">
                      Email
                    </label>
                    <div className="input-container">
                      <input
                        type="email"
                        className="email_container"
                        value={email}
                        placeholder="asma123@gmail.com"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="input-icon"
                      />
                    </div>
                  </div>

                  <div className="Password_div">
                    <label htmlFor="password" className="password-label">
                      Password
                    </label>
                    <div className="input-container">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="password_container"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <FontAwesomeIcon
                        icon={showPassword ? faUnlock : faLock}
                        className="input-icon"
                        onClick={togglePasswordVisibility}
                      />
                      <a className="link" onClick={handleForgotPassword}>
                        Forgot Password
                      </a>
                      {/* Password reset modal */}
                      <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                        closeOnOverlayClick={false}
                        closeOnEsc={false}
                      >
                        <ModalOverlay />
                        <ModalContent className="animate__animated animate__fadeInLeftBig">
                          <ModalHeader>
                            <Center>
                              <Text fontWeight="bold">Change Password</Text>
                            </Center>
                          </ModalHeader>
                          <ModalBody>
                            {/* New Password input */}
                            <FormControl mb={4}>
                              <FormLabel>New Password</FormLabel>
                              <div className="change-input-container">
                                <input
                                  type={showNewPassword ? "text" : "password"}
                                  className="password_container"
                                  value={newPassword}
                                  onChange={(e) =>
                                    setNewPassword(e.target.value)
                                  }
                                />
                                <FontAwesomeIcon
                                  icon={showNewPassword ? faUnlock : faLock}
                                  className="input-icon"
                                  onClick={togglePasswordNewVisibility}
                                />
                              </div>
                            </FormControl>
                            {/* Confirm Password input */}
                            <FormControl mb={4}>
                              <FormLabel>Confirm Password</FormLabel>
                              <div className="change-input-container">
                                <input
                                  type={
                                    showNewConfirmPassword ? "text" : "password"
                                  }
                                  className="password_container"
                                  value={confirmPassword}
                                  onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                  }
                                />
                                <FontAwesomeIcon
                                  icon={
                                    showNewConfirmPassword ? faUnlock : faLock
                                  }
                                  className="input-icon"
                                  onClick={togglePasswordConfirmVisibility}
                                />
                              </div>
                            </FormControl>
                          </ModalBody>
                          <ModalFooter>
                            {/* Save Password button */}
                            <Button
                              background={"#FFA500"}
                              mr={3}
                              onClick={handleSavePassword}
                            >
                              Save Password
                            </Button>
                            {/* Close button */}
                            <Button variant="ghost" onClick={handleCancel}>
                              Cancel
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    </div>
                  </div>
                </div>
                <div className="button">
                  <button
                    type="submit"
                    className="Login_Button"
                    onClick={handleLogin}
                  >
                    Log In
                  </button>
                </div>
                <div class="horizontal-line">
                  <hr />
                  <p>OR</p>
                  <hr />
                </div>
                <div className="account_list">
                  <button onClick={handleGoogleLoginSuccess}>
                    <Image
                      src={google}
                      alt="Google Icon"
                      className="google-icon"
                    />
                    Sign in with Google
                  </button>
                </div>

                <div className="statement">
                  <p className="register">
                    Don't Have An Account?
                    <a href="../signup" className="link-reg">
                      Register Now
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
