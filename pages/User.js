import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { getSession } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import axios from "axios";

export default function User() {
  const [userType, setUserType] = useState("");
  const toast = useToast();
  const router = useRouter();
  const { data: session } = useSession(); 
  const { email: queryEmail, username: queryUsername } = router.query;
  console.log("Query email:", queryEmail);
  console.log("Query username:", queryUsername);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (session) {
          const { name, email } = session.user;
          const userResponse = await axios.post("http://127.0.0.1:8000/findUserUsingEmail", { email });
  
          console.log("USER RESPONSE", userResponse.data);
          // Extract the username and userType from the response
          const { userType, username, user } = userResponse.data;
  
          console.log("this is after user response", userType);
          // Save user data to current user if user exists
          if (user) {
            const setCurrentUserResponse = await axios.post("http://localhost:8000/setCurrentUser", { username, email, userType });
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
            console.log("User not found in the database.");
          }
        } else {
          console.log("Session not available.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error or redirect to login page
        router.push('/login');
      }
    };
  
    fetchData();
  }, [session, router]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userType) {
      // Show toast for selecting user type
      toast({
        description: "Please select how you are going to process the system",
        status: "error",
        duration: 2000,
      });
      return;
    }

    try {

      let username, email;
      if (queryUsername && queryEmail) {
        username = queryUsername;
        email = queryEmail;
      } else {
        // Retrieve username and email from the session
        const session = await getSession();
        username = session.user.name;
        email = session.user.email;
      }


      // Make Axios POST request to the backend
      const endpoint = userType === "customer" ? "googleRegisterCustomer" : "googleRegisterBusinessOwner";
      await axios.post(`http://127.0.0.1:8000/${endpoint}`, {
        username: username,
        email: email,
        userType
      });

      const userResponse = await axios.post("http://localhost:8000/setCurrentUser", {
        username: username,
        email: email,
        userType
      });

      const { token } = userResponse.data;
      // Save the token to local storage
      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", queryEmail);

      // Redirect based on userType
      if (userType === "customer") {
        router.push("/home");
      } else if (userType === "businessOwner") {
        router.push("/business/welcome");
      }

      // Notify user of successful submission
      toast({
        description: "Welcome to Tour Hunt!",
        status: "success",
        duration: 5000,
        position: "top",
      });
    } catch (error) {
      // Handle error if Axios request fails
      console.error("Error submitting signup form:", error);

      // Show an alert for different types of errors
      if (error.response && error.response.status === 400) {
        toast({
          description: error.response.data.error || "An error occurred while signing up.",
          status: "error",
          duration: 2000,
          position: "top",
        });
      } else {
        toast({
          description: "An error occurred while signing up. Please try again later.",
          status: "error",
          duration: 2000,
          position: "top",
        });
      }
    }
  }

  return (
    <div className='user-div'>
      <div className="parent">
        <div className="radio-container">
          <div className="label_icon">
            <label htmlFor="userType" className="user-label">
              UserType
            </label>
          </div>
          <div className="radio_buttons">
            <div className="label">
              <label className="radio-label">
                <input
                  type="radio"
                  name="userType"
                  value="customer"
                  className="radio_label_button"
                  onChange={(e) => setUserType(e.target.value)}
                />
                Customer
              </label>
            </div>
            <div className="label label_two">
              <label className="radio-label">
                <input
                  type="radio"
                  name="userType"
                  value="businessOwner"
                  className="radio_label_button"
                  onChange={(e) => setUserType(e.target.value)}
                />
                Business Owner
              </label>
            </div>
          </div>
        </div>

        <div className="button">
          <button
            type="submit"
            className="Login_Button"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}


