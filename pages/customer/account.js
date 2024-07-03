import {
  Box,
  FormLabel,
  Grid,
  HStack,
  Image,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Layout from "../../components/layout";
import AccountDrawer from "../../components/AccountDrawer";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Account() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userId, setUserId] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [gender, setGender] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [image, setImage] = useState();
  const [imageChange, setImageChange] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const getData = async () => {
      const userResponse = await axios.post(
        `http://localhost:8000/findUserUsingEmail`,
        { email: localStorage.getItem("currentUser") }
      );
      try {
        const profilePictureResponse = await axios.post(
          `http://localhost:8000/getProfilePicture`,
          { userId: userResponse.data._id }
        );
        setImage(profilePictureResponse.data.profilePicture);
      } catch (error) {}
      setUserId(userResponse.data._id);
      setUsername(userResponse.data.username);
      setEmail(userResponse.data.email);
      setGender(userResponse.data.gender);
      setIsLoaded(true);
      console.log(userResponse.data);
    };
    getData();
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/updateAccount", {
        userId,
        username,
        email,
        gender,
      });
      localStorage.setItem("currentUser", email);
      onClose();
      toast({
        title: "Account updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update account",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a FileReader instance
      const reader = new FileReader();
      // Listen to the FileReader's onload event
      reader.onload = () => {
        setImage(reader.result);
        setImageChange(true);
      };
      // Read the image file as a data URL
      reader.readAsDataURL(file);
    }
  };

  // sending the updated profile picture to the backend
  const updateImage = async () => {
    try {
      await axios.post("http://localhost:8000/uploadProfilePicture", {
        userId,
        profilePicture: image,
      });
      toast({
        title: "Profile picture updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      if (error.response.status === 413) {
        toast({
          title: "Failed to upload image!",
          description: "File size is too large",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile picture",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  if (imageChange) {
    setImageChange(false);
    updateImage();
  }

  return (
    <Layout>
      {isLoaded && (
        <AccountDrawer
          username={username}
          email={email}
          gender={gender}
          setUsername={setUsername}
          setEmail={setEmail}
          setGender={setGender}
          isOpen={isOpen}
          onClose={onClose}
          handleSubmit={handleSubmit}
        />
      )}

      <Box w="100%" mt="40px" display="flex" justifyContent="center">
        {isLoaded ? (
          <Box borderRadius="10px" p="20px" w="80%" bg="#143E56">
            <HStack justifyContent="space-between">
              <Box></Box>
              <Text textAlign="right" fontWeight="500">
                Manage your account
              </Text>
              <Image
                onClick={onOpen}
                _hover={{ opacity: 0.5, cursor: "pointer" }}
                src="/images/edit.png"
                height="15px"
              />
            </HStack>
            <HStack justifyContent="flex-start">
              <Image src={image || "/images/user.png"} h="200px" />
              <Box ml="5" letterSpacing={1}>
                <Grid templateColumns="repeat(2, 1fr)" gap={1}>
                  <Text overflow="auto" fontWeight="500">
                    Username:
                  </Text>
                  <Text>{username}</Text>
                  <Text fontWeight="500">Email:</Text>
                  <Text overflow="auto">{email}</Text>
                  <Text fontWeight="500">Gender:</Text>
                  <Text>{gender}</Text>
                </Grid>
                <Box display="flex">
                  <FormLabel
                    htmlFor="image"
                    textDecoration="underline"
                    _hover={{ cursor: "pointer", opacity: 0.5 }}
                    fontSize="smaller"
                    mt="10px"
                  >
                    Change profile picture
                  </FormLabel>
                  <input
                    hidden
                    type="file"
                    id="image"
                    onChange={handleImageChange}
                  />
                </Box>
              </Box>
            </HStack>
          </Box>
        ) : (
          <Text>Loading your data...</Text>
        )}
      </Box>
    </Layout>
  );
}
