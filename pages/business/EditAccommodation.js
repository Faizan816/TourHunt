import "react-toastify/dist/ReactToastify.css";
import { useEffect, useRef, useState } from "react";
import {
  useToast,
  VStack,
  HStack,
  Spinner,
  Button,
  Text,
  Image,
  FormControl,
  Input,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Layout from "../../components/businessLayout";
import { useRouter } from "next/router";
import {
  ref as sRef,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { app, storage } from "../../components/firebase/firebase";
import {
  faHotel,
  faPhone,
  faBed,
  faTimesCircle,
  faMoneyBill,
  faMoneyCheckDollar,
  faLocationDot,
  faCity,
  faGlobe,
  faEarthAmericas,
  faMugSaucer,
  faBowlFood,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";

export default function EditAccommodation({ accommodation }) {
  // Helper function to capitalize the first character
  const capitalizeFirstChar = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const [hotelname, setHotelName] = useState(accommodation.name);
  const [roomType, setRoomType] = useState("");
  const [price, setPrice] = useState(accommodation.hotelRoomExpensePerPerson);
  const [ameniti, setAme] = useState(accommodation.amenities);
  const [contact, setContact] = useState(accommodation.contact);
  const [location, setLocation] = useState("");
  const [Service, setService] = useState("");
  const [Time, setTime] = useState("");
  const toast = useToast(); // Initialize Chakra UI toast
  const [images, setImages] = useState(accommodation.imageUrls);
  const [imageUrls, setImageUrls] = useState(accommodation.imageUrls);
  const fileInputRef = useRef();
  const loadingRef = useRef();
  const router = useRouter();
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
      "Mandi Bahauddin",
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
    capitalizeFirstChar(accommodation.province)
  );
  const [selectedCity, setSelectedCity] = useState(
    capitalizeFirstChar(accommodation.city)
  );
  const roomTypes = ["Deluxes Room", "Standard Room"];
  const [selectedRoomType, setSelectedRoomType] = useState(roomTypes[0]);

  useEffect(() => {
    loadingRef.current.style.display = "none";
  }, []);

  // Function to validate inputs
  const validateInputs = () => {
    // Regular expressions
    const lettersRegex = /^[a-zA-Z\s]+$/;
    const contactRegex = /^\d{11}$/;
    const locationRegex = /^[\w\s]+,[\w\s]+,[\w\s]+,[\w\s]+$/;
    const roomTypeRegex = /^[a-zA-Z,\s]+$/;
    const priceRegex = /^\d+$/;
    const timeRegex = /^[a-zA-Z0-9\s:-]+$/;

    // Check for empty required fields
    if (!hotelname) {
      toast({
        description: "Hotel name is required",
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

    // if (!location) {
    //   toast({
    //     description: "Location is required",
    //     status: "error",
    //     position: "top",
    //     duration: 2000,
    //   });
    //   return false;
    // }

    // if (!roomType) {
    //   toast({
    //     description: "Room type is required",
    //     status: "error",
    //     position: "top",
    //     duration: 2000,
    //   });
    //   return false;
    // }

    if (!price) {
      toast({
        description: "Price is required",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    if (!ameniti) {
      toast({
        description: "Ameniti is required",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    // if (!Service) {
    //   toast({
    //     description: "Service is required",
    //     status: "error",
    //     position: "top",
    //     duration: 2000,
    //   });
    //   return false;
    // }

    // if (!Time) {
    //   toast({
    //     description: "Time is required",
    //     status: "error",
    //     position: "top",
    //     duration: 2000,
    //   });
    //   return false;
    // }

    if (images.length === 0) {
      toast({
        description: "Please put one at least pic of your accomomdation site",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    // Validate
    if (!lettersRegex.test(hotelname)) {
      toast({
        description: "Please enter a valid hotel name",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }
    if (!contactRegex.test(contact)) {
      toast({
        description: "Contact number must be 11 digits",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }
    // if (!locationRegex.test(location)) {
    //   toast({
    //     description:
    //       "Please enter the location in the correct format of local strret , city , province , country",
    //     status: "error",
    //     position: "top",
    //     duration: 2000,
    //   });
    //   return false;
    // }

    // if (!roomTypeRegex.test(roomType)) {
    //   toast({
    //     description: "Please enter valid room types",
    //     status: "error",
    //     position: "top",
    //     duration: 2000,
    //   });
    //   return false;
    // }

    if (!priceRegex.test(price) || price < 1 || price > 99999) {
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

    // if (!timeRegex.test(Time)) {
    //   toast({
    //     description:
    //       "Please enter the time in a valid format (e.g., 9:00 am - 12:00 pm)",
    //     status: "error",
    //     position: "top",
    //     duration: 2000,
    //   });
    //   return false;
    // }

    // All validations passed
    return true;
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = sRef(storage, `AccomodationImages/${file.name}`);
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
      await axios.post("http://127.0.0.1:8000/editAccommodation", {
        _id: accommodation._id,
        userId,
        name: hotelname,
        businessName,
        contact,
        city: selectedCity,
        province: selectedProvince,
        country: "Pakistan",
        amenities: ameniti,
        hotelRoomExpensePerPerson: price,
        imageUrls,
        status: "Approved",
      });
      console.log(imageUrls);
      // Notify user of successful submission
      toast({
        description: "Edited successfully",
        status: "success",
        duration: 5000,
        position: "top",
      });
      router.push("../business/AcoomodationDashboard");
    } catch (error) {
      // Handle error if Axios request fails
      console.error("Error submitting hotel edit:", error);
      toast({
        description:
          "An error occurred while editing the hotel. Please try again later.",
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
  };

  return (
    <Layout>
      <section className="registeration_page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 ">
              <div className="padding">
                <div className="title">
                  <h1 className="heading">Hotel Edit </h1>
                </div>
                <div className="form-div">
                  <FormControl isRequired>
                    <div className="first_row same_div_first">
                      <div className="col-12">
                        <div className="same_side-div">
                          <FormLabel htmlFor="name" className="name-label">
                            Hotel Name
                          </FormLabel>
                          <div className="input-container">
                            <input
                              type="name"
                              className="same_side_input"
                              value={hotelname}
                              onChange={(e) => {
                                setHotelName(e.target.value);
                              }}
                              placeholder="Royal Service Apartments Centaurus"
                            />
                            <FontAwesomeIcon
                              icon={faHotel}
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
                      <div className="col-12">
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
                                style={{ backgroundColor: "#1F516D" }}
                                value={dc}
                              >
                                {dc}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                      </div>

                      <div className="col-12">
                        {/* <FormControl mt="40px" isRequired>
                          <FormLabel fontWeight="500" fontSize="xl">
                            Room Type
                          </FormLabel>
                          <Select
                            border="0"
                            borderBottom="2px"
                            borderRadius="0"
                            w="90%"
                            value={selectedRoomType}
                            onChange={(e) =>
                              setSelectedRoomType(e.target.value)
                            }
                          >
                            {roomTypes.map((dc) => (
                              <option
                                style={{ backgroundColor: "#1F516D" }}
                                value={dc}
                              >
                                {dc}
                              </option>
                            ))}
                          </Select>
                        </FormControl> */}
                      </div>
                    </div>

                    <div className="third_row same_div_first ">
                      <div className="col-12">
                        <div className="same_side-div margin-top_rows">
                          <FormLabel htmlFor="name" className="name-label">
                            Room Rate Per Person in Rs.
                          </FormLabel>
                          <div className="input-container">
                            <input
                              type="name"
                              className="same_side_input"
                              value={price}
                              onChange={(e) => {
                                setPrice(e.target.value);
                              }}
                              placeholder="enter price in Dollars"
                            />
                            <FontAwesomeIcon
                              icon={faMoneyBill}
                              className="input-icon"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="same_side-div margin-top_rows">
                          <FormLabel
                            htmlFor="name"
                            className="name-label name_margin_label"
                          >
                            Amenities
                          </FormLabel>
                          <div className="input-container">
                            <input
                              type="name"
                              className="same_side_input"
                              value={ameniti}
                              onChange={(e) => {
                                setAme(e.target.value);
                              }}
                              placeholder="Wifi avaialble, Air conditioned rooms"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="third_row same_div_first ">
                      {/* <div className="col-12">
                        <div className="same_side-div margin-top_rows">
                          <FormLabel htmlFor="name" className="name-label">
                            Services
                          </FormLabel>
                          <div className="input-container">
                            <input
                              type="name"
                              className="same_side_input"
                              value={Service}
                              onChange={(e) => {
                                setService(e.target.value);
                              }}
                              placeholder="bed linen changes , laundary"
                            />
                          </div>
                        </div>
                      </div> */}

                      <div className="col-12">
                        {/* <div className="same_side-div margin-top_rows">
                          <FormLabel htmlFor="name" className="name-label">
                            Check-In and CheckOut Time
                          </FormLabel>
                          <div className="input-container Checkin-margin">
                            <input
                              type="name"
                              className="same_side_input"
                              value={Time}
                              onChange={(e) => {
                                setTime(e.target.value);
                              }}
                              placeholder="9:00 am  - 12:00pm"
                            />
                          </div>
                        </div> */}
                      </div>
                    </div>

                    <div className="third_row same_div_first ">
                      <div className="row">
                        <div className="col-12">
                          <div className="same_side-div margin-top_rows">
                            <div className="input-container">
                              <div className="upload-container">
                                <VStack
                                  w="100%"
                                  mt="1%"
                                  alignItems="flex-start"
                                >
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
                                      onClick={() =>
                                        fileInputRef.current.click()
                                      }
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
                    </div>
                  </FormControl>

                  <div className="button button_margin">
                    <button
                      type="submit"
                      className="Submit_Button"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const response = await axios.get(
    `http://127.0.0.1:8000/getAccommodation/${id}`
  );
  const accommodation = response.data;
  return {
    props: {
      accommodation,
    },
  };
}
