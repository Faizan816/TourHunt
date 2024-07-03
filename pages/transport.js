import { useState, useEffect } from "react";
import Layout from "../components/layout";
import {
  Button,
  Grid,
  Input,
  Select,
  Text,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  InputGroup,
  InputRightElement,
  useToast,
  Box,
  Heading,
} from "@chakra-ui/react";
import { FaPhone } from "react-icons/fa";
import { useRouter } from "next/router";
import axios from "axios";
import Map from "../components/map/map";

export default function Accommodation() {
  const [seats, setSeats] = useState(1);
  const [t, setT] = useState();
  const router = useRouter();
  const [reservationDate, setReservationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [reservationTime, setReservationTime] = useState("00:00");
  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dropOffCities, setDropOffCities] = useState();
  const [selectedDropOffCity, setSelectedDropOffCity] = useState();
  const [customerContact, setCustomerContact] = useState("");
  const toast = useToast();
  const [currentlyActive, setCurrentlyActive] = useState("Overview");
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
      "Murree",
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
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // checking if the currentService is available
    if (!localStorage.getItem("currentService")) {
      router.push("../results");
      return;
    }

    const getReviews = async () => {
      const response = await axios.post(
        `http://localhost:8000/getServiceReviews`,
        {
          serviceId: JSON.parse(localStorage.getItem("currentService")).service
            ._id,
        }
      );
      setReviews(response.data);
    };
    getReviews();

    setT(JSON.parse(localStorage.getItem("currentService")).service);
    console.log(JSON.parse(localStorage.getItem("currentService")).service);
    // Get the current service's province
    const currentProvince = JSON.parse(localStorage.getItem("currentService"))
      .service.province;
    const provinceSpecificCities = pakistanCities[currentProvince];
    const filteredCities = provinceSpecificCities.filter(
      (d) =>
        d !== JSON.parse(localStorage.getItem("currentService")).service.city
    );
    setDropOffCities(filteredCities);
    setSelectedDropOffCity(filteredCities[0]);
  }, []);

  // useEffect which removes currentService when back button is pressed
  useEffect(() => {
    const handlePopState = (event) => {
      // Check if the user is navigating back
      if (event.type === "popstate") {
        // Remove the "currentService" item from localStorage
        localStorage.removeItem("currentService");
      }
    };

    // Add the event listener
    window.addEventListener("popstate", handlePopState);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleBookNow = async () => {
    if (customerContact === "") {
      toast({
        title: "Please enter your contact number.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if (customerContact.length < 11) {
      toast({
        title: "Contact number must be 11 digits.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    // checking if booking is already done
    const email = localStorage.getItem("currentUser");
    const userResponse = await axios.post(
      "http://127.0.0.1:8000/findUserUsingEmail",
      { email: email }
    );
    const userId = userResponse.data._id;
    const tResponse = await axios.post(
      "http://localhost:8000/getTransportBookings",
      { userId }
    );
    const transportBookings = tResponse.data;
    let flag = false;
    transportBookings.forEach((booking) => {
      if (
        booking.serviceId === t._id &&
        booking.reservationDate === reservationDate
      ) {
        flag = true;
      }
    });
    if (flag) {
      toast({
        title: "This transport is already booked for the selected date.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    localStorage.setItem("reservationDate", reservationDate);
    localStorage.setItem("reservationTime", reservationTime);
    localStorage.setItem("bookingDate", bookingDate);
    localStorage.setItem("paymentPrice", t.seatPricePerPerson * seats);
    localStorage.setItem("dropOffLocation", selectedDropOffCity);
    localStorage.setItem("numberOfSeats", seats);
    localStorage.setItem("customerContact", customerContact);
    router.push("../bookings/payment");
  };

  // Helper function to capitalize the first character
  const capitalizeFirstChar = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Layout>
      {t && (
        <div
          style={{
            borderRadius: 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: "2%",
            letterSpacing: 1,
          }}
        >
          <Grid
            mt="0px"
            w="20%"
            textAlign="center"
            templateColumns="repeat(1, 1fr)"
            gap={0.5}
            ml="20px"
            mr="20px"
            // display="none"
          >
            <Text
              w="100%"
              cursor="pointer"
              _hover={{ opacity: 0.5 }}
              bg="#143E56"
              pt="10px"
              p="15px 35px"
              onClick={() => setCurrentlyActive("Overview")}
              opacity={currentlyActive === "Overview" ? 0.5 : 1}
            >
              Overview
            </Text>
            <Text
              cursor="pointer"
              _hover={{ opacity: 0.5 }}
              bg="#143E56"
              pt="10px"
              p="15px 25px"
              onClick={() => setCurrentlyActive("Images")}
              opacity={currentlyActive === "Images" ? 0.5 : 1}
            >
              Images
            </Text>
            <Text
              cursor="pointer"
              _hover={{ opacity: 0.5 }}
              bg="#143E56"
              pt="10px"
              p="15px 25px"
              onClick={() => setCurrentlyActive("Map")}
              opacity={currentlyActive === "Map" ? 0.5 : 1}
            >
              Map
            </Text>
            <Text
              cursor="pointer"
              _hover={{ opacity: 0.5 }}
              bg="#143E56"
              pt="10px"
              p="15px 25px"
              onClick={() => setCurrentlyActive("Reviews")}
              opacity={currentlyActive === "Reviews" ? 0.5 : 1}
            >
              Reviews
            </Text>
          </Grid>
          <div style={{ backgroundColor: "#143E56", borderRadius: 10 }}>
            <div>
              {currentlyActive !== "Images" && (
                <img
                  style={{ height: 400, width: 680, borderRadius: 10 }}
                  src={t.imageUrls[0] || "/images/Bus.jpg"}
                />
              )}
            </div>
            <div style={{ padding: 30, fontSize: "medium" }}>
              <div>
                <p style={{ fontWeight: "bold", fontSize: 20 }}>{t.name}</p>
              </div>
              <Grid mt="10px" templateColumns="repeat(2, 1fr)" gap="1px">
                <p>Location:</p>
                <p>{capitalizeFirstChar(t.city + ", " + t.province)}</p>
                <p>Owner</p>
                <p>{t.businessName}</p>
                <p>Contact:</p>
                <p>{t.contact}</p>
                <p>Seat price per person: </p>
                <p>Rs.{t.seatPricePerPerson}</p>
                <p>Number of seats you want:</p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "70px",
                  }}
                >
                  <img
                    onClick={() => {
                      if (seats !== 1) setSeats(seats - 1);
                    }}
                    src="/images/minus.png"
                    style={{ width: 10, height: 10 }}
                  />
                  <p>{seats}</p>
                  <img
                    onClick={() => {
                      setSeats(seats + 1);
                    }}
                    src="/images/plus.png"
                    style={{ width: 10, height: 10 }}
                  />
                </div>
                <p>Your total bill will be:</p>
                <p>Rs.{t.seatPricePerPerson * seats}</p>
              </Grid>
              {currentlyActive === "Images" && (
                <Box>
                  <Heading size="md" mt={4} mb={4}>
                    Images
                  </Heading>
                  {t.imageUrls && t.imageUrls.length > 0 ? (
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
                      gap={4}
                      overflow="auto"
                    >
                      {t.imageUrls.map((imageUrl, index) => (
                        <Box
                          key={index}
                          borderWidth={1}
                          borderRadius="md"
                          overflow="hidden"
                        >
                          <img
                            src={imageUrl}
                            alt={`Image ${index + 1}`}
                            style={{ width: "100%", height: "auto" }}
                          />
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box>No images available</Box>
                  )}
                </Box>
              )}
              {currentlyActive === "Reviews" && (
                <Box>
                  <Heading size="md" mb={4}>
                    Reviews
                  </Heading>
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <Box
                        key={index}
                        borderWidth={1}
                        borderRadius="md"
                        p={4}
                        mb={4}
                      >
                        <Text fontWeight="bold">Review by: {review.email}</Text>
                        <Text>Comment: {review.comment}</Text>
                        <Text>
                          Rating:
                          {[...Array(5)].map((_, i) => (
                            <Text
                              fontSize="sm"
                              key={i}
                              className={
                                i < review.rating
                                  ? "fa fa-star rated gold"
                                  : "fa fa-star not-rated"
                              }
                            ></Text>
                          ))}
                        </Text>
                      </Box>
                    ))
                  ) : (
                    <Box>No reviews available</Box>
                  )}
                </Box>
              )}
              {currentlyActive === "Map" && (
                <>
                  <Heading size="md">Map</Heading>
                  <Map service={t} />
                </>
              )}
              <Text mt="10px" fontSize="sm">
                Select date for reservation:
              </Text>
              <Input
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
                type="date"
                padding="10px"
                borderRadius="10px"
                min={bookingDate}
              />
              <Text mt="10px" fontSize="sm">
                Select time for reservation:
              </Text>
              <Input
                value={reservationTime}
                onChange={(e) => setReservationTime(e.target.value)}
                type="time"
                padding="10px"
                borderRadius="10px"
              />
              <Text mt="10px" fontSize="sm">
                Select drop-off location:
              </Text>
              <Select
                value={selectedDropOffCity}
                onChange={(e) => setSelectedDropOffCity(e.target.value)}
              >
                {dropOffCities.map((dc) => (
                  <option
                    key={dc}
                    style={{ backgroundColor: "#1F516D" }}
                    value={dc}
                  >
                    {dc}
                  </option>
                ))}
              </Select>
              <FormControl isRequired mt="10px">
                <FormLabel fontWeight="bold">Contact:</FormLabel>
                <InputGroup>
                  <Input
                    borderRadius="10px"
                    padding="10px"
                    placeholder="03135068731"
                    size="md"
                    value={customerContact}
                    onChange={(e) => {
                      if (customerContact.length < 11)
                        setCustomerContact(e.target.value);
                      if (e.nativeEvent.inputType === "deleteContentBackward") {
                        console.log("Backspace pressed");
                        setCustomerContact(e.target.value);
                      }
                    }}
                    type="number"
                  />
                  <InputRightElement>
                    <Icon as={FaPhone} />
                  </InputRightElement>
                </InputGroup>
                <FormHelperText color="white" fontSize="small">
                  Kindly enter your contact number
                </FormHelperText>
              </FormControl>
              <div style={{ marginTop: "3%" }}>
                <Button
                  onClick={handleBookNow}
                  bg="#2A656D"
                  color="white"
                  _hover={{ opacity: 0.5 }}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      )}
    </Layout>
  );
}
