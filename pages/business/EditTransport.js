import React from "react";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useRouter } from "next/router";
import {
  ref as sRef,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { app, storage } from "../../components/firebase/firebase";
import {
  faUser,
  faBuilding,
  faPhone,
  faMoneyBill,
  faMoneyCheckDollar,
  faLocationDot,
  faAward,
} from "@fortawesome/free-solid-svg-icons";
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
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import Layout from "../../components/businessLayout";

export default function Transport({ transport }) {
  console.log(transport);
  const [Compname, setCompName] = useState(transport.name);
  const [price, setPrice] = useState();
  const [ameniti, setAme] = useState(transport.amenities);
  const [departureCity, setDepartureCity] = useState("Islamabad");
  const [Deslocation, setDesLocation] = useState("");
  const [contact, setContact] = useState(transport.contact);
  const [transportations, setTransportations] = useState([]);
  const [Capacity, setCapacity] = useState(transport.capacity);
  const [images, setImages] = useState(transport.imageUrls);
  const [imageUrls, setImageUrls] = useState(transport.imageUrls);
  const fileInputRef = useRef();
  const loadingRef = useRef();
  const toast = useToast(); // Initialize Chakra UI toast
  const router = useRouter();
  const transportationsList = ["Bus", "SUV", "Jeep", "Airline", "Cruise"];
  const departureCities = [
    "Islamabad",
    "Karachi",
    "Lahore",
    "Rawalpindi",
    "Peshawar",
    "Quetta",
    "Multan",
    "Faisalabad",
    "Sialkot",
    "Gujranwala",
    "Hyderabad",
    "Bahawalpur",
    "Sargodha",
    "Sukkur",
    "Gujrat",
    "Jhelum",
    "Abbottabad",
    "Muzaffarabad",
    "Murree",
    "Swat",
  ];
  const [selectedValue, setSelectedValue] = useState(departureCities[0]);
  const transports = ["Bus", "SUV", "Minivan", "Jeep", "Coach"];
  const [transportType, setTransportType] = useState(transport.transportType);
  const [seatPricePerPerson, setSeatPricePerPerson] = useState(
    transport.seatPricePerPerson
  );

  const pakistanCities = {
    Punjab: [
      "Lahore",
      "Faisalabad",
      "Rawalpindi",
      "Multan",
      "Gujranwala",
      "Sialkot",
      "Bahawalpur",
      "Sargodha",
      "Gujrat",
      "Sheikhupura",
      "Jhang",
      "Rahim Yar Khan",
      "Kasur",
      "Muzaffargarh",
      "Okara",
      "Dera Ghazi Khan",
      "Sahiwal",
      "Nankana Sahib",
      "Hafizabad",
      "Jhelum",
      "Chiniot",
      "Khanewal",
      "Attock",
      "Layyah",
      "Burewala",
      "Vehari",
      "Kamalia",
      "Kamoke",
      "Mianwali",
      "Kot Addu",
      "Khushab",
      "Daska",
      "Haroonabad",
      "Shakargarh",
      "Chakwal",
      "Chishtian",
      "Jaranwala",
      "Ahmadpur East",
      "Haripur",
      "Shahkot",
      "Muridke",
      "Gojra",
      "Mandi Bahauddin",
      "Toba Tek Singh",
      "Kharian",
      "Leiah",
      "Taxila",
      "Shorkot",
      "Hujra Shah Muqim",
      "Sambrial",
      "Sangla Hill",
      "Gujar Khan",
      "Narowal",
    ],
    Sindh: [
      "Karachi",
      "Hyderabad",
      "Sukkur",
      "Larkana",
      "Nawabshah",
      "Mirpur Khas",
      "Jacobabad",
      "Shikarpur",
      "Tando Allahyar",
      "Kambar",
      "Umerkot",
      "Dadu",
      "Ratodero",
      "Ghotki",
      "Badin",
      "Thatta",
      "Kashmore",
      "Matiari",
      "Tando Muhammad Khan",
      "Sujawal",
      "Sanghar",
      "Khipro",
      "Kandhkot",
      "Tando Adam",
      "Shahdadkot",
      "Mirpur Bathoro",
      "Moro",
      "Sakrand",
      "Daharki",
      "Digri",
      "Naudero",
      "Warah",
      "Khairpur",
      "Rohri",
      "Meeranpur",
      "Naushahro Firoz",
      "Mithi",
      "Kunri",
      "Jati",
      "Ranipur",
      "Hala",
      "Khairpur Nathan Shah",
      "Kandiaro",
      "Nasirabad",
      "Tando Bago",
      "Daur",
      "Dadu",
      "Thari Mirwah",
      "Sehwan",
      "Jhudo",
      "Daulatpur",
      "Sobhodero",
      "Jamshoro",
      "Naukot",
      "Padidan",
    ],
    Balochistan: [
      "Quetta",
      "Gwadar",
      "Turbat",
      "Khuzdar",
      "Chaman",
      "Hub",
      "Zhob",
      "Mastung",
      "Nushki",
      "Kalat",
      "Mach",
      "Panjgur",
      "Kharan",
      "Sibi",
      "Dera Bugti",
      "Chaman",
      "Usta Muhammad",
      "Loralai",
      "Pasni",
      "Gandava",
      "Kohlu",
      "Dalbandin",
      "Sui",
      "Jiwani",
      "Tump",
      "Qila Abdullah",
      "Turbat",
      "Ormara",
      "Sanjawi",
      "Killa Saifullah",
      "Chitkan",
      "Surab",
      "Wadh",
      "Harnai",
      "Mastung",
      "Dera Murad Jamali",
      "Bela",
      "Awaran",
      "Khuzdar",
      "Musakhel",
      "Ziarat",
      "Pishin",
      "Lasbela",
      "Duki",
      "Washuk",
      "Kohlu",
      "Tump",
      "Gawadar",
      "Kachhi",
      "Kohlu",
      "Kharan",
      "Jhal Magsi",
      "Kech",
      "Qila Abdullah",
      "Makran",
    ],
    "Khyber Pakhtunkhwa": [
      "Peshawar",
      "Abbottabad",
      "Mardan",
      "Swat",
      "Nowshera",
      "Mansehra",
      "Kohat",
      "Charsadda",
      "Chitral",
      "Dera Ismail Khan",
      "Haripur",
      "Bannu",
      "Batagram",
      "Karak",
      "Swabi",
      "Lower Dir",
      "Upper Dir",
      "Hangu",
      "Tank",
      "Shangla",
      "Buner",
      "Kohistan",
      "Lakki Marwat",
      "Malakand",
      "Shabqadar",
      "Jamrud",
      "Kohat",
      "Matta",
      "Paharpur",
      "Tangi",
      "Tordher",
      "Kabal",
      "Khwazakhela",
      "Chakdara",
      "Alpuri",
      "Barikot",
      "Kanju",
      "Lal Qila",
      "Pabbi",
      "Risalpur",
      "Daggar",
      "Doaba",
      "Mardan",
      "Nowshera Cantonment",
      "Takht-i-Bahi",
      "Tank",
      "Cherat",
      "Kabal",
      "Kotli",
      "Mohmand",
    ],
    "Gilgit-Baltistan": [
      "Gilgit",
      "Skardu",
      "Chilas",
      "Ghizer",
      "Astore",
      "Hunza",
      "Nagar",
      "Danyore",
      "Gahkuch",
      "Shigar",
      "Khaplu",
      "Kharmang",
      "Shyok",
      "Astore",
      "Ghanchey",
      "Darel",
      "Rondu",
      "Naltar",
      "Tangir",
      "Askole",
      "Sassi",
      "Bagrote",
      "Hoper",
      "Doyan",
      "Ghizar",
      "Yasin",
      "Shinaki",
      "Gupis",
      "Bunji",
      "Tangir",
      "Gujar",
      "Chaprote",
      "Niat",
      "Rattu",
      "Gandgarh",
      "Oshikhandass",
      "Dasu",
      "Harban",
      "Tholey",
      "Domail",
      "Chakarkot",
      "Ayun",
      "Gulmit",
      "Dainyor",
      "Rattu",
      "Shahgrom",
      "Drass",
      "Hussainabad",
      "Sassi",
      "Kargil",
    ],
  };

  const [selectedProvince, setSelectedProvince] = useState(
    Object.keys(pakistanCities)[0]
  );
  const [selectedCity, setSelectedCity] = useState(pakistanCities["Punjab"][0]);

  const handleTransportations = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setTransportations((s) => [...s, value]);
    } else {
      setTransportations((s) => s.filter((d) => d !== value));
    }
  };

  useEffect(() => {
    loadingRef.current.style.display = "none";
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = sRef(storage, `TransportImages/${file.name}`);
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

  const validateInputs = () => {
    // Regular expressions
    const lettersRegex = /^[a-zA-Z\s]+$/;
    const contactRegex = /^\d{11}$/;
    const locationRegex = /^[\w\s]+,[\w\s]+,[\w\s]+,[\w\s]+$/;
    const priceRegex = /^\d+$/;
    const Capregex = /^[a-zA-Z0-9\s]*$/;

    // Check for empty required fields
    if (!Compname) {
      toast({
        description: "cmopany name is required",
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

    // if (!Deslocation) {
    //   toast({
    //     description: "destination Location is required",
    //     status: "error",
    //     position: "top",
    //     duration: 2000,
    //   });
    //   return false;
    // }

    // if (!transportations) {
    //   toast({
    //     description: "Select at least one transporation type",
    //     status: "error",
    //     position: "top",
    //     duration: 2000,
    //   });
    //   return false;
    // }

    if (!seatPricePerPerson) {
      toast({
        description: "Seat price per person is required",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    if (!Capacity) {
      toast({
        description: "Capacity input is required",
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

    if (!ameniti) {
      toast({
        description: "Ameniti input is required",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    // Validate
    if (!lettersRegex.test(Compname)) {
      toast({
        description: "Please enter a valid company name",
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

    // if (!lettersRegex.test(Deslocation)) {
    //   toast({
    //     description: "Please enter valid destination location",
    //     status: "error",
    //     position: "top",
    //     duration: 2000,
    //   });
    //   return false;
    // }

    if (!Capregex.test(Capacity)) {
      // Show error toast if input contains characters other than alphabets or numbers
      toast({
        description:
          "Please enter the number of people in transport using alphabets or numbers only.",
        status: "error",
        position: "top",
        duration: 2000, // Adjust duration as needed
      });
      return false;
    }
    if (!priceRegex.test(seatPricePerPerson) || price < 1 || price > 99999) {
      toast({
        description: "Please enter a valid price between 1 and 99999",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }
    if (!/^\D+$/.test(ameniti)) {
      toast({
        description: "Ameniti field should not contain numbers.",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    // All validations passed
    return true;
  };

  const handleSubmit = async () => {
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
      const businessResponse = await axios.post(
        "http://127.0.0.1:8000/getBusiness",
        { id: userId }
      );
      const businessName = businessResponse.data.businessName;
      // Make Axios POST request to register transport
      await axios.post("http://127.0.0.1:8000/editTransport", {
        _id: transport._id,
        userId: userId,
        name: Compname,
        businessName,
        seatPricePerPerson: seatPricePerPerson,
        amenities: ameniti,
        city: selectedCity,
        province: selectedProvince,
        country: "Pakistan",
        contact: contact,
        transportType,
        capacity: Capacity,
        imageUrls: imageUrls,
        status: "Approved",
      });

      toast({
        description: "Edit successfull!",
        status: "success",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      router.push("../business/TranpsortDashboard");
    } catch (error) {
      // Handle error if Axios request fails
      console.error("Error registering transport:", error);
      toast({
        description:
          "An error occurred while registering the transport . Please try again later.",
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
  };

  return (
    <Layout>
      <div className="registeration_page">
        <div className="transport_image"></div>
        <div className="container">
          <div className="row">
            <div className="col-12 ">
              <div className="padding">
                <div className="title">
                  <h1 className="heading">Transport Edit </h1>
                </div>
                <div className="form-div">
                  <FormControl isRequired>
                    <div className="first_row same_div_first">
                      <div className="col-12">
                        <div className="same_side-div">
                          <FormLabel htmlFor="name" className="name-label">
                            Comapny Name
                          </FormLabel>
                          <div className="input-container">
                            <input
                              type="name"
                              className="same_side_input"
                              value={Compname}
                              onChange={(e) => {
                                setCompName(e.target.value);
                              }}
                              placeholder="Ali transport "
                            />
                            <FontAwesomeIcon
                              icon={faBuilding}
                              className="input-icon"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="same_side-div  margin-top_rows">
                          <FormLabel htmlFor="name" className="name-label">
                            Contact
                          </FormLabel>
                          <div className="input-container">
                            <input
                              className="same_side_input"
                              value={contact}
                              onChange={(e) => {
                                if (contact.length < 11)
                                  setContact(e.target.value);
                                if (
                                  e.nativeEvent.inputType ===
                                  "deleteContentBackward"
                                ) {
                                  console.log("Backspace pressed");
                                  setContact(e.target.value);
                                }
                              }}
                              type="number"
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
                    <div className="second_row same_div_first ">
                      {/* <div className="col-12">
                        <FormControl mt="5%" isRequired w={"90%"}>
                          <FormLabel>Departure City</FormLabel>
                          <Select
                            value={selectedValue}
                            onChange={(e) => setSelectedValue(e.target.value)}
                            border="none"
                            borderBottom="1px"
                            focusBorderColor="transparent"
                            focusVisibleBorderColor="transparent"
                          >
                            {departureCities.map((dc) => (
                              <option
                                style={{ backgroundColor: "#1F516D" }}
                                value={dc}
                              >
                                {dc}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                      </div> */}
                      {/* <div className="col-12">
                        <div className="same_side-div  margin-top_rows">
                          <FormLabel htmlFor="name" className="name-label">
                            Destination
                          </FormLabel>
                          <div className="input-container">
                            <input
                              type="name"
                              className="same_side_input"
                              value={Deslocation}
                              onChange={(e) => {
                                setDesLocation(e.target.value);
                              }}
                              placeholder="Naran , Murree , Karachi"
                            />
                            <FontAwesomeIcon
                              icon={faLocationDot}
                              className="input-icon"
                            />
                          </div>
                        </div>
                      </div> */}
                    </div>
                    <div className="third_row same_div_first">
                      {/* <div className="col-12">
                        <Box mt="5%" w="100%">
                          <Text fontWeight="bold">Transportation(s)</Text>
                          <Stack
                            flexWrap="wrap"
                            mt="10px"
                            spacing={[1, 5]}
                            direction={["column", "row"]}
                          >
                            {transportationsList.map((t) => (
                              <Checkbox
                                size="sm"
                                colorScheme="white"
                                value={t}
                                onChange={handleTransportations}
                              >
                                {t}
                              </Checkbox>
                            ))}
                          </Stack>
                        </Box>
                      </div> */}
                      <FormLabel
                        fontWeight="500"
                        fontSize="xl"
                        mt="40px"
                        className="name-label"
                      >
                        Transport Type
                      </FormLabel>
                      <Select
                        border="0"
                        borderBottom="2px"
                        borderRadius="0"
                        w="90%"
                        value={transportType}
                        onChange={(e) => setTransportType(e.target.value)}
                      >
                        {transports.map((dc) => (
                          <option
                            key={dc}
                            style={{ backgroundColor: "#1F516D" }}
                            value={dc}
                          >
                            {dc}
                          </option>
                        ))}
                      </Select>
                      <div className="col-12">
                        <div className="same_side-div  margin-top_rows">
                          <FormLabel
                            htmlFor="name"
                            className="name-label name_select"
                          >
                            Capacity
                          </FormLabel>
                          <div className="input-container">
                            <NumberInput defaultValue={Capacity}>
                              <NumberInputField
                                border="none"
                                className="same_side_input"
                                value={Capacity}
                                onChange={(e) => {
                                  setCapacity(e.target.value);
                                }}
                                placeholder="Number of people in a transport "
                              />
                            </NumberInput>
                          </div>
                        </div>
                        <FormControl mt="40px" isRequired>
                          <FormLabel fontWeight="500" fontSize="xl">
                            Province
                          </FormLabel>
                          <Select
                            border="0"
                            borderBottom="2px"
                            borderRadius="0"
                            w="90%"
                            value={selectedProvince}
                            onChange={(e) => {
                              setSelectedProvince(e.target.value);
                              setSelectedCity(
                                pakistanCities[e.target.value][0]
                              );
                            }}
                          >
                            {Object.keys(pakistanCities).map((province) => (
                              <option
                                key={province}
                                style={{ backgroundColor: "#1F516D" }}
                                value={province}
                              >
                                {province}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl mt="40px" isRequired>
                          <FormLabel fontWeight="500" fontSize="xl">
                            City
                          </FormLabel>
                          <Select
                            border="0"
                            borderBottom="2px"
                            borderRadius="0"
                            w="90%"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                          >
                            {pakistanCities[selectedProvince].map((dc) => (
                              <option
                                key={dc}
                                style={{ backgroundColor: "#1F516D" }}
                                value={dc}
                              >
                                {dc}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                    <div className="fourth_row same_div_first">
                      <div className="col-12">
                        <div className="same_side-div  margin-top_rows">
                          <FormLabel htmlFor="name" className="name-label">
                            Seat Price Per Person in Rs.
                          </FormLabel>
                          <div className="input-container">
                            <input
                              type="name"
                              className="same_side_input"
                              value={seatPricePerPerson}
                              onChange={(e) => {
                                setSeatPricePerPerson(e.target.value);
                              }}
                              placeholder="Enter transport fare of one person in Rs."
                            />
                            <FontAwesomeIcon
                              icon={faMoneyBill}
                              className="input-icon"
                            />
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="same_side-div  margin-top_rows">
                            <label htmlFor="name" className="name-label">
                              Amenities
                            </label>
                            <div className="input-container">
                              <input
                                type="name"
                                className="same_side_input"
                                value={ameniti}
                                onChange={(e) => {
                                  setAme(e.target.value);
                                }}
                                placeholder="wifi , airconditioned bus or car , hall in cruise"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="same_side-div margin-top_rows">
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
                                    {image.name ? (
                                      <Text>{image.name}</Text>
                                    ) : (
                                      <Image src={image} h={20} />
                                    )}
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
                    </div>

                    <div className="button button_margin">
                      <button
                        type="submit"
                        className="Submit_Button"
                        onClick={handleSubmit}
                      >
                        Submit
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
  const response = await axios.get(`http://127.0.0.1:8000/getTransport/${id}`);
  const transport = response.data;
  return {
    props: {
      transport,
    },
  };
}
