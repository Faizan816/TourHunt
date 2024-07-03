import React from "react";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import NextImage from "next/image";
import star from "../../assets/Image/star.png";
import {
  faUser,
  faPhone,
  faMoneyBill,
  faMoneyCheckDollar,
  faLocationDot,
  faAward,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import {
  ref as sRef,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { app, storage } from "../../components/firebase/firebase";
import {
  useToast,
  VStack,
  HStack,
  Spinner,
  Button,
  Text,
  Image,
  FormControl,
  Stack,
  FormLabel,
  Box,
  Input,
  Checkbox,
  Select,
} from "@chakra-ui/react";
import Layout from "../../components/businessLayout";

export default function HotelRegisteration({ guide }) {
  const [contact, setContact] = useState(guide.contact);
  const [name, setName] = useState(guide.name);
  const [location, setLocation] = useState(guide.location);
  const [yrs, setYrs] = useState(guide.years_of_experience);
  const [sep, setSep] = useState(guide.specialization);
  const [lang, setLang] = useState(guide.languages);
  const [images, setImages] = useState(guide.imageUrls || []);
  const [imageUrls, setImageUrls] = useState(guide.imageUrls || []);
  const fileInputRef = useRef();
  const loadingRef = useRef();
  const toast = useToast(); // Initialize Chakra UI toast
  const router = useRouter();

  const validateInputs = () => {
    // Regular expressions
    const lettersRegex = /^[a-zA-Z\s]+$/;
    const contactRegex = /^\d{11}$/;
    const locationRegex = /^[\w\s]+,[\w\s]+,[\w\s]+$/;
    const Capregex = /^[a-zA-Z0-9\s]*$/;

    // Check for empty required fields
    if (!name) {
      toast({
        description: "Full name is required",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    if (!contact) {
      toast({
        description: "Contact number is required",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    if (!location) {
      toast({
        description: "Location is required",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    if (!yrs) {
      toast({
        description: "Experience years input is required ",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    if (!sep) {
      toast({
        description: "Sepaciality input is required",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    if (!lang) {
      toast({
        description: "Language input is required",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    if (images.length === 0) {
      toast({
        description: "Please put one at least pic of your transport",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    // validate
    if (!lettersRegex.test(name)) {
      toast({
        description: "Please enter a valid  name",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    if (!contactRegex.test(contact)) {
      toast({
        description: "Please enter a valid contact number",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    if (!locationRegex.test(location)) {
      toast({
        description:
          "Please enter the location in the correct format of  city , province , country",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    if (!/^\D+$/.test(lang)) {
      toast({
        description: "Languages field should not contain numbers.",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    if (!Capregex.test(yrs)) {
      // Show error toast if input contains characters other than alphabets or numbers
      toast({
        description: "Please enter valid experience years.",
        status: "error",
        position: "top",
        duration: 2000, // Adjust duration as needed
      });
      return false;
    }

    // All validations passed
    return true;
  };

  useEffect(() => {
    loadingRef.current.style.display = "none";
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = sRef(storage, `GuideImages/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      console.log(file);
      loadingRef.current.style.display = "block";

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(snapshot);
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at: " + downloadURL);
            setImages((prev) => [...prev, file]);
            setImageUrls((p) => [...p, downloadURL]);
            loadingRef.current.style.display = "none";
          });
        }
      );
    }
  };

  const handleRemoveImage = async (index) => {
    try {
      // Get the URL of the image to be deleted
      const imageUrl = imageUrls[index];
      loadingRef.current.style.display = "block";

      // Delete the image from Firebase Storage
      const storageRef = sRef(storage, imageUrl);
      await deleteObject(storageRef);
      loadingRef.current.style.display = "none";

      // Remove the image URL from state
      setImageUrls((prevUrls) => {
        const updatedUrls = [...prevUrls];
        updatedUrls.splice(index, 1);
        return updatedUrls;
      });

      // Remove the image from the state
      setImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages.splice(index, 1);
        return updatedImages;
      });
    } catch (error) {
      console.error("Error deleting image from Firebase Storage:", error);
    }
  };

  const handleSave = async () => {
    const isValid = validateInputs();
    if (!isValid) {
      return;
    }

    try {
      const userResponse = await axios.post(
        "http://127.0.0.1:8000/findUserUsingEmail",
        { email: localStorage.getItem("currentUser") }
      );
      const userId = userResponse.data._id;
      const _id = guide._id;
      // Make Axios POST request to register a guide
      await axios.post("http://127.0.0.1:8000/editGuide", {
        _id,
        userId: userId,
        name: name,
        contact: contact,
        location: location,
        years_of_experience: yrs,
        specialization: sep,
        languages: lang,
        imageUrls: imageUrls,
      });

      // Notify user of successful updation
      toast({
        description: "Updated successfully",
        status: "success",
        duration: 5000,
        position: "top",
      });
      router.push("../business/GuideDashboard");
    } catch (error) {
      // Handle error if Axios request fails
      console.error("Error Updating guide:", error);
      toast({
        description:
          "An error occurred while Updating the guide . Please try again later.",
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
  };

  return (
    <Layout>
      <div className="registeration_page">
        <div className="guide_image"></div>
        <div className="container">
          <div className="row">
            <div className="col-12 ">
              <div className="padding">
                <div className="title">
                  <h1 className="heading">Guide Registeration </h1>
                </div>

                <div className="form-div">
                  <FormControl isRequired>
                    <div className="first_row same_div_first">
                      <div className="col-12">
                        <div className="same_side-div">
                          <FormLabel htmlFor="name" className="name-label">
                            Full Name
                          </FormLabel>
                          <div className="input-container">
                            <input
                              type="name"
                              className="same_side_input"
                              value={name}
                              onChange={(e) => {
                                setName(e.target.value);
                              }}
                              placeholder="Asad chauhan"
                            />
                            <FontAwesomeIcon
                              icon={faUser}
                              className="input-icon"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="same_side-div margin-top_rows">
                          <FormLabel htmlFor="name" className="name-label">
                            Contact
                          </FormLabel>
                          <div className="input-container">
                            <input
                              type="name"
                              className="same_side_input"
                              value={contact}
                              onChange={(e) => {
                                setContact(e.target.value);
                              }}
                              placeholder="01323433335"
                            />
                            <FontAwesomeIcon
                              icon={faPhone}
                              className="input-icon"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="second_row same_div_first">
                      <div className="col-12">
                        <div className="same_side-div margin-top_rows">
                          <FormLabel htmlFor="name" className="name-label">
                            Location
                          </FormLabel>
                          <div className="input-container">
                            <input
                              type="name"
                              className="same_side_input"
                              value={location}
                              onChange={(e) => {
                                setLocation(e.target.value);
                              }}
                              placeholder="city,province,country"
                            />
                            <FontAwesomeIcon
                              icon={faLocationDot}
                              className="input-icon"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="same_side-div margin-top_rows">
                          <FormLabel htmlFor="name" className="name-label">
                            Experience (yrs)
                          </FormLabel>
                          <div className="input-container">
                            <input
                              type="name"
                              className="same_side_input"
                              value={yrs}
                              onChange={(e) => {
                                setYrs(e.target.value);
                              }}
                              placeholder="5"
                            />
                            <NextImage src={star} className="input-icon" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="third_row same_div_first">
                      <div className="col-12">
                        <div className="same_side-div margin-top_rows">
                          <FormLabel htmlFor="name" className="name-label">
                            Specialities
                          </FormLabel>
                          <div className="input-container">
                            <input
                              type="name"
                              className="same_side_input"
                              value={sep}
                              onChange={(e) => {
                                setSep(e.target.value);
                              }}
                            />

                            <FontAwesomeIcon
                              icon={faAward}
                              className="input-icon special-icon"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="same_side-div margin-top_rows">
                          <FormLabel htmlFor="name" className="name-label">
                            Language(s)
                          </FormLabel>
                          <div className="input-container">
                            <input
                              type="name"
                              className="same_side_input"
                              value={lang}
                              onChange={(e) => {
                                setLang(e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="input-container">
                          <div className="upload-container">
                            <VStack w="100%" mt="5%" alignItems="flex-start">
                              <FormLabel fontWeight="bold">
                                Upload Images
                              </FormLabel>
                              {images.map((image, index) => (
                                <HStack
                                  key={index}
                                  alignItems="center"
                                  p="5px 10px"
                                  borderRadius="10px"
                                  bg="#2A656D"
                                >
                                  <Text>{image.name}</Text>
                                  <Image
                                    onClick={() => handleRemoveImage(index)}
                                    _hover={{ opacity: 0.5 }}
                                    cursor="pointer"
                                    src="/images/close.png"
                                    h="10px"
                                  />
                                </HStack>
                              ))}
                              <Spinner ref={loadingRef} />
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                id="file-input"
                                hidden
                                onChange={handleImageUpload}
                              />
                              <label htmlFor="file-input">
                                <Button
                                  onClick={() => fileInputRef.current.click()}
                                  bg="#2A656D"
                                  color="white"
                                  _hover={{ opacity: 0.5 }}
                                >
                                  Upload Image
                                </Button>
                              </label>
                            </VStack>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="button button_margin">
                      <button
                        type="submit"
                        className="Submit_Button"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                    </div>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const response = await axios.get(`http://127.0.0.1:8000/getGuide/${id}`);
  const guide = response.data;
  return {
    props: {
      guide,
    },
  };
}
