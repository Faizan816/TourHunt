import { toast, ToastContainer } from "react-toastify";
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
  Radio,
  RadioGroup,
  Select,
  FormHelperText,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Layout from "../../components/businessLayout";
import { useRouter } from "next/router";
import {
  ref as sRef,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { app, storage } from "../../components/firebase/firebase";
import axios from "axios";
import cuisineImg from "../../assets/Image/cuisine.png";
import {
  faClock,
  faHotel,
  faPhone,
  faPaperclip,
  faMoneyCheckDollar,
  faLocationDot,
  faAward,
} from "@fortawesome/free-solid-svg-icons";
import NextImage from "next/image";

export default function HotelRegisteration({ restaurant }) {
  const [restname, setRestName] = useState(restaurant.name);
  const [contact, setContact] = useState(restaurant.contact);
  const [openingTime, setOpeningTime] = useState(restaurant.openingTime);
  const [closingTime, setClosingTime] = useState(restaurant.closingTime);
  const [reservation, setReservation] = useState(restaurant.reservation);
  const [images, setImages] = useState(restaurant.imageUrls);
  const [imageUrls, setImageUrls] = useState(restaurant.imageUrls);
  const fileInputRef = useRef();
  const loadingRef = useRef();
  const toast = useToast(); // Initialize Chakra UI toast
  const router = useRouter();
  const cuisines = ["Pakistani", "Mexican", "Italian"];
  const [selectedCuisine, setSelectedCuisine] = useState(restaurant.cuisine);
  const [averageFoodRate, setAverageFoodRate] = useState(
    restaurant.averageFoodRate
  );
  const [reservationCharges, setReservationCharges] = useState(
    restaurant.reservationCharges
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
  const [selectedProvince, setSelectedProvince] = useState(restaurant.province);
  const [selectedCity, setSelectedCity] = useState(restaurant.city);

  useEffect(() => {
    loadingRef.current.style.display = "none";
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = sRef(storage, `RestaurantImages/${file.name}`);
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

  // Function to validate inputs
  const validateInputs = () => {
    // Regular expressions
    const lettersRegex = /^[a-zA-Z\s]+$/;
    const contactRegex = /^\d{11}$/;
    const averageFoodRateRegex = /^\d{6}$/;
    const locationRegex = /^[\w\s]+,[\w\s]+,[\w\s]+,[\w\s]+$/;
    const timeRegex = /^[a-zA-Z0-9\s:-]+$/;

    // Check for empty required fields
    if (!restname) {
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

    if (!averageFoodRate) {
      toast({
        descript: "Average Food Rate is required",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    if (!reservationCharges) {
      toast({
        descript: "Reservation charges is required",
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

    // if (!cuisine) {
    //   toast({
    //     description: "Cuisine input is required",
    //     status: "error",
    //     position: "top",
    //     duration: 2000,
    //   });
    //   return false;
    // }

    if (!openingTime) {
      toast({
        description: "Opening Time is required",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    if (!closingTime) {
      toast({
        description: "Closing Time is required",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    if (images.length === 0) {
      toast({
        description: "Please put one at least pic of your restaraunt site",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    if (!reservation) {
      toast({
        description: "Reservation is required",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }

    // Validate

    if (!contactRegex.test(contact)) {
      toast({
        description: "Contact number must be 11 digits",
        status: "error",
        position: "top",
        duration: 2000,
      });
      return false;
    }
    // if (!averageFoodRateRegex.test(averageFoodRate)) {
    //   toast({
    //     description:
    //       "Please enter average food rate in numbers less than 6 digits",
    //     status: "error",
    //     position: "top",
    //     duration: 2000,
    //   });
    //   return false;
    // }
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

    // if (!lettersRegex.test(cuisine)) {
    //   toast({
    //     description: "Please enter valid cuisine types",
    //     status: "error",
    //     position: "top",
    //     duration: 2000,
    //   });
    //   return false;
    // }

    // if (!timeRegex.test(OpeningHrs)) {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

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
        { id: userResponse.data._id }
      );
      const businessName = businessResponse.data.businessName;
      // Make Axios POST request to your backend
      await axios.post("http://127.0.0.1:8000/editRestaurant", {
        _id: restaurant._id,
        userId: userId,
        name: restname,
        businessName,
        cuisine: selectedCuisine,
        city: selectedCity,
        province: selectedProvince,
        country: "Pakistan",
        contact: contact,
        averageFoodRate,
        openingTime,
        closingTime,
        reservation: reservation,
        reservationCharges,
        imageUrls: imageUrls,
        status: "Approved",
      });

      toast({
        title: "Edit successfull!",
        status: "success",
        duration: 5000,
        position: "top",
      });
      router.push("../business/RestaurantDashboard");
    } catch (error) {
      // Handle error if Axios request fails
      console.error("Error submitting restaurant form:", error);
      toast({
        description:
          "An error occurred while registering the restaurant. Please try again later.",
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
                  <h1 className="heading">Restaurant Edit </h1>
                </div>
                <div className="form-div">
                  <FormControl isRequired>
                    <div className="same_div_first">
                      <div className="col-12">
                        <div className="same_side-div">
                          <FormLabel htmlFor="name" className="name-label">
                            Resturant Name
                          </FormLabel>
                          <div className="input-container">
                            <input
                              type="name"
                              className="same_side_input"
                              value={restname}
                              onChange={(e) => {
                                setRestName(e.target.value);
                              }}
                              placeholder="Monal restaurant"
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

                    <div className="same_div_first">
                      <div className="col-12">
                        <div className="same_side-div margin-top_rows">
                          <FormControl isRequired>
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
                        </div>
                      </div>
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
                      <div className="col-12">
                        <div className="same_side-div margin-top_rows">
                          <FormLabel htmlFor="name" className="name-label">
                            Cuisine
                          </FormLabel>
                          <Select
                            border="0"
                            borderBottom="2px"
                            borderRadius="0"
                            w="90%"
                            value={selectedCuisine}
                            onChange={(e) => setSelectedCuisine(e.target.value)}
                          >
                            {cuisines.map((dc) => (
                              <option
                                key={dc}
                                style={{ backgroundColor: "#1F516D" }}
                                value={dc}
                              >
                                {dc}
                              </option>
                            ))}
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="same_div_first">
                      <div className="col-12">
                        <div className="same_side-div margin-top_rows">
                          <div className="input-container">
                            <div className="upload-container">
                              <VStack w="100%" mt="1%" alignItems="flex-start">
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

                      <div className="col-12">
                        <div className="same_side-div margin-top_rows">
                          <FormLabel
                            htmlFor="name"
                            className="name-label name_margin_label"
                          >
                            Opening Time
                          </FormLabel>
                          <Input
                            w="90%"
                            type="time"
                            variant="flushed"
                            borderBottom="2px"
                            className="same_side_input"
                            value={openingTime}
                            onChange={(e) => {
                              setOpeningTime(e.target.value);
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="same_side-div margin-top_rows">
                          <FormLabel
                            htmlFor="name"
                            className="name-label name_margin_label"
                          >
                            Closing Time
                          </FormLabel>
                          <Input
                            w="90%"
                            type="time"
                            variant="flushed"
                            borderBottom="2px"
                            className="same_side_input"
                            value={closingTime}
                            onChange={(e) => {
                              setClosingTime(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="same_div_first">
                      <div className="col-12">
                        <div className="same_side-div margin-top_rows">
                          <FormLabel htmlFor="name" className="name-label">
                            Reservation
                          </FormLabel>
                          <div className="input-container">
                            <RadioGroup defaultValue={reservation}>
                              <div className="radio-margin-top">
                                <Radio
                                  size="lg"
                                  colorScheme="rgb(20, 62, 86)"
                                  name="availability"
                                  value="Available"
                                  onChange={(e) =>
                                    setReservation(e.target.value)
                                  }
                                >
                                  Available
                                </Radio>
                              </div>
                              <Radio
                                size="lg"
                                colorScheme="rgb(20, 62, 86)"
                                name="availability"
                                value="Not Available"
                                onChange={(e) => setReservation(e.target.value)}
                              >
                                Not Available
                              </Radio>
                            </RadioGroup>
                          </div>
                        </div>
                      </div>
                    </div>

                    <FormControl w="90%" mt="40px" isRequired>
                      <FormLabel>Average Food Rate in Rs.</FormLabel>
                      <Input
                        border="0"
                        borderBottom="2px"
                        borderRadius="0"
                        padding="10px"
                        placeholder="Enter average price of food you serve"
                        size="md"
                        value={averageFoodRate}
                        onChange={(e) => {
                          if (averageFoodRate.length < 6)
                            setAverageFoodRate(e.target.value);
                          if (
                            e.nativeEvent.inputType === "deleteContentBackward"
                          ) {
                            setAverageFoodRate(e.target.value);
                          }
                        }}
                        type="number"
                      />
                      <FormHelperText color="white">
                        Enter the average price at which you serve food in Rs.
                      </FormHelperText>
                    </FormControl>

                    <FormControl w="90%" mt="40px" isRequired>
                      <FormLabel>Reservation Charges in Rs.</FormLabel>
                      <Input
                        border="0"
                        borderBottom="2px"
                        borderRadius="0"
                        padding="10px"
                        placeholder="Enter reservation charges in Rs."
                        size="md"
                        value={reservationCharges}
                        onChange={(e) => {
                          if (reservationCharges.length < 6)
                            setReservationCharges(e.target.value);
                          if (
                            e.nativeEvent.inputType === "deleteContentBackward"
                          ) {
                            setReservationCharges(e.target.value);
                          }
                        }}
                        type="number"
                      />
                    </FormControl>

                    <div className="button button_margin_rest">
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
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const response = await axios.get(`http://127.0.0.1:8000/getRestaurant/${id}`);
  const restaurant = response.data;
  return {
    props: {
      restaurant,
    },
  };
}
