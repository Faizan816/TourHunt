import { FormControl, FormLabel, Heading, useToast } from "@chakra-ui/react";
import Layout from "../../components/layout";
import { useState } from "react";
import { Input, InputGroup, InputRightElement, Button } from "@chakra-ui/react";
import Link from "next/link";
import styles from "../../styles/Login.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUnlock } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/admin", {
        email,
        password,
      });
      localStorage.setItem("currentUser", email);
      // Success: User created
      toast({
        title: "Login Successful!",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
      setEmail("");
      setPassword("");
      dispatch({ type: "LOGIN" });
      setTimeout(() => {
        router.push("/admin/approval"); // Redirect to the home page
      }, 2000);
    } catch (error) {
      toast({
        title: "Login credentials are incorrect",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
      console.log(error);
    }
  };

  return (
    <>
      <div className="main_box">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-7 col-sm-12 padding-change">
              <div className="block">
                <div className="image-box"></div>
              </div>
            </div>
            <div className="col-lg-5 padding-change">
              <div className="admin-login_thing">
                <div className="title">
                  <h1 className="heading">ADMIN LOGIN</h1>
                </div>
                <div className="paddingTop">
                  <FormControl marginBottom={"7%"}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      placeholder="Enter username"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      variant={"flushed"}
                      fontSize={"14px"}
                    />
                  </FormControl>
                </div>
                <div className="paddingTop">
                  <FormControl marginBottom={"7%"}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup size="md">
                      <Input
                        pr="4.5rem"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant={"flushed"}
                        fontSize={"14px"}
                      />
                      <InputRightElement width="4.5rem">
                        <FontAwesomeIcon
                          icon={showPassword ? faUnlock : faLock}
                          className="input-icon"
                          onClick={togglePasswordVisibility}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </div>
                <div className="paddingTop">
                  <div className="button_parent">
                    <div className="button">
                      <Button onClick={handleLogin} className="Login_Button">
                        Login
                      </Button>
                    </div>
                    <div>
                      {/* <Link href="/home">
                        <Button colorScheme="blue">Cancel</Button>
                      </Link> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
