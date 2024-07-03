import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import axios from "axios";
import { isEmail } from "validator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faPeopleGroup,
  faUnlock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import validator from "validator";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState("");
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const toast = useToast();
  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleCheck = () => setIsChecked(!isChecked);

  const validateName = (name) => {
    // Regular expression for validating the username
    const nameRegex = /^[a-zA-Z0-9_\- ]+$/; // Updated regex to allow alphanumeric characters, underscore (_), hyphen (-), and space ( )
    return name.length >= 2 && nameRegex.test(name); // Updated minimum length to 2 characters
  };

  const handleNameChange = (e) => {
    const { value } = e.target;
    setName(value);

    if (value.trim() === "") {
      setNameError(""); // Reset error message if input is empty
    } else if (!validateName(value)) {
      setNameError(
        "Username must be at least 2 characters long and contain only letters, numbers, underscore (_), hyphen (-), or space ( )"
      );
    } else {
      setNameError(""); // Reset error message if input is valid
    }
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    if (value.trim() === "") {
      setEmailError(""); // Reset error message if input is empty
    } else if (!isEmail(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (password) => {
    // Password should be at least 8 characters long with letters
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&,.\/<>?;':"[\]{}\\|\-=+_)(*&^%$#@!`~])[A-Za-z\d@$!%*#?&,.\/<>?;':"[\]{}\\|\-=+_)(*&^%$#@!`~]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);

    if (value.trim() === "") {
      setPasswordError("");
    } else if (!validatePassword(value)) {
      setPasswordError(
        "Password should be at least 8 characters long with letters, symbols, and numbers"
      );
    } else {
      setPasswordError("");
    }
  };

  const handleSignUP = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !gender ||
      !userType
    ) {
      // Check if all fields are filled
      toast({
        description: "Fill all the required fields",
        status: "error",
        duration: 2000,
      });
      return;
    }
    if (!validateName(name)) {
      toast({
        description: nameError,
        status: "error",
        duration: 2000,
      });
      return;
    }
    if (!isEmail(email)) {
      toast({
        description: "Invalid email format",
        status: "error",
        duration: 2000,
      });
      return;
    }
    try {
      const apiKey = "98840c6d90f80dd491d6aed7b3372d3d1163b0c4";
      const response = await axios.get(
        `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`
      );
      const data = response.data.data;
      if (data.result !== "deliverable") {
        toast({
          description:
            "This email address does not exist or is not deliverable.",
          status: "error",
          duration: 2000,
        });
        return;
      }
    } catch (error) {
      console.error("Error:", error.response.data.error);
      toast({
        description: "An error occurred while verifying the email address.",
        status: "error",
        duration: 2000,
      });
      return;
    }
    if (!validatePassword(password)) {
      toast({
        description: "resolve the password error ",
        status: "error",
        duration: 2000,
      });
      return;
    }
    if (password !== confirmPassword) {
      // Password and confirm password do not match
      toast({
        description: "Password and Confirm Password do not match",
        status: "error",
        duration: 2000,
      });
      return;
    }
    try {
      // Make Axios POST request to the backend
      const endpoint =
        userType === "customer" ? "registerCustomer" : "registerBusinessOwner";
      await axios.post(`http://127.0.0.1:8000/${endpoint}`, {
        username: name,
        email: email,
        password: password,
        gender: gender,
        userType: userType,
      });

      // Notify user of successful submission
      toast({
        description:
          "Account created successfully! Activate your account using the link sent to your email.",
        status: "success",
        duration: 5000,
        position: "top",
      });

      // Navigate to the login screen
      router.push("/login");

      // // Save current user based on userType
      // const userResponse = await axios.post("http://localhost:8000/setCurrentUser", {
      //   username: name,
      //   email,
      //   password,
      //   userType
      // });

      // const { token } = userResponse.data;
      // // Save the token to local storage
      // localStorage.setItem("token", token);
      // localStorage.setItem("currentUser", email);

      // // Redirect based on userType
      // if (userType === "customer") {
      //   router.push("/home");
      // } else if (userType === "businessOwner") {
      //   router.push("/business/welcome");
      // }
      // // Notify user of successful submission
      // toast({
      //   description: `Welcome ${name}! To Tour Hunt`,
      //   status: "success",
      //   duration: 5000,
      //   position: "top",
      // });
    } catch (error) {
      // Handle error if Axios request fails
      console.error("Error submitting signup form:", error);

      // Show an alert for different types of errors
      if (error.response && error.response.status === 400) {
        toast({
          description:
            error.response.data.error || "An error occurred while signing up.",
          status: "error",
          duration: 2000,
          position: "top",
        });
      } else {
        toast({
          description:
            "An error occurred while signing up. Please try again later.",
          status: "error",
          duration: 2000,
          position: "top",
        });
      }
    }
  };

  return (
    <>
      <div className="main_box">
        <div className="container-fluid ">
          <div className="row row-change_padding">
            <div className="col-lg-7 col-sm-12 padding-change">
              <div className="block">
                <div className="image"></div>
              </div>
            </div>
            <div className="col-lg-5 col-sm-12 padding-change">
              <div className="login_thing">
                <div className="title">
                  <h1 className="heading">SIGN UP</h1>
                </div>
                <div className="inputs_container">
                  <div className="name-div">
                    <label htmlFor="name" className="name-label">
                      Username
                    </label>
                    <div className="input-container">
                      <input
                        type="text"
                        id="username"
                        className={`name_container ${nameError ? "error" : ""}`}
                        value={name}
                        placeholder="Aria"
                        onChange={handleNameChange}
                      />
                      <FontAwesomeIcon icon={faUser} className="input-icon" />
                    </div>
                    {nameError && (
                      <span className="error-message">{nameError}</span>
                    )}
                  </div>
                  <div className="email-div margin-top-email">
                    <label htmlFor="email" className="email-label">
                      Email
                    </label>
                    <div className="input-container">
                      <input
                        type="email"
                        className={`email_container ${
                          emailError ? "error" : ""
                        }`}
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="asma123@gmail.com"
                      />
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="input-icon"
                      />
                    </div>
                    {emailError && (
                      <span className="error-message">{emailError}</span>
                    )}
                  </div>
                  <div className="Password_div">
                    <label htmlFor="password" className="password-label">
                      Password
                    </label>
                    <div className="input-container">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`password_container ${
                          passwordError ? "error" : ""
                        }`}
                        value={password}
                        onChange={handlePasswordChange}
                      />
                      <FontAwesomeIcon
                        icon={showPassword ? faUnlock : faLock}
                        className="input-icon"
                        onClick={togglePasswordVisibility}
                      />
                    </div>
                    {passwordError && (
                      <span className="error-message">{passwordError}</span>
                    )}
                  </div>
                  <div className="Password_div">
                    <label htmlFor="password" className="password-label">
                      Confirm Password
                    </label>
                    <div className="input-container">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="password_container"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <FontAwesomeIcon
                        icon={showConfirmPassword ? faUnlock : faLock}
                        className="input-icon"
                        onClick={toggleConfirmPasswordVisibility}
                      />
                    </div>
                  </div>
                  <div className="radio-container">
                    <div className="label_icon">
                      <label htmlFor="gender" className="gender-label">
                        Gender
                      </label>
                      <FontAwesomeIcon
                        icon={faPeopleGroup}
                        className="people_icon"
                      />
                    </div>
                    <div className="radio_buttons">
                      <div className="label_one">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            className="radio_label_button"
                            onChange={(e) => setGender(e.target.value)}
                          />
                          Male
                        </label>
                      </div>
                      <div className="label_two">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            className="radio_label_button"
                            onChange={(e) => setGender(e.target.value)}
                          />
                          Female
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="radio-container">
                    <div className="label_icon">
                      <label htmlFor="userType" className="gender-label">
                        UserType
                      </label>
                    </div>
                    <div className="radio_buttons">
                      <div className="label_one">
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
                      <div className="label_two">
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
                  {/* <div className="checkbox_div">
                    <input
                      type="checkbox"
                      id="agreeCheckbox"
                      className="agree_checkbox"
                      checked={isChecked}
                      onChange={handleCheck}
                    />
                    <label className="checkbox-label" htmlFor="agreeCheckbox">
                      I agree to the
                      <span className="label_italic"> Terms and Service</span>
                    </label>
                  </div> */}
                </div>
                <div className="button">
                  <button
                    type="submit"
                    className="Login_Button"
                    onClick={handleSignUP}
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
