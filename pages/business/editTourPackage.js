import {
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  VStack,
  Box,
  Stack,
  Checkbox,
  Text,
  HStack,
  Image,
  Button,
  useToast,
  Spinner,
  Editable,
  EditablePreview,
  EditableTextarea,
  Textarea,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import {
  ref as sRef,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { app, storage } from "../../components/firebase/firebase";
import Layout from "../../components/businessLayout";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function EditTourPackage({ tourPackage }) {
  const [name, setName] = useState(tourPackage.name);
  const [departureCity, setDepartureCity] = useState(tourPackage.departureCity);
  const [destinations, setDestinations] = useState(tourPackage.destination);
  const [breakfast, setBreakfast] = useState(tourPackage.breakfast);
  const [lunch, setLunch] = useState(tourPackage.lunch);
  const [dinner, setDinner] = useState(tourPackage.dinner);
  const [departureDate, setDepartureDate] = useState(tourPackage.departureDate);
  const [transportations, setTransportations] = useState([]);
  // const [transportDetails, setTransportDetails] = useState();
  const [accommodations, setAccommodations] = useState(
    tourPackage.hotelCompanyName
  );
  // const [accommodationDetails, setAccommodaitonDetails] = useState();
  const [inclusions, setInclusions] = useState(tourPackage.inclusions);
  const [exclusions, setExclusions] = useState(tourPackage.exclusions);
  const [tourDuration, setTourDuration] = useState(tourPackage.tourDuration);
  const [mealsCost, setMealsCost] = useState(tourPackage.foodPrice);
  const [accommodationsCost, setAccommodationsCost] = useState(
    tourPackage.hotelRoomExpensePerPerson
  );
  const [transportationCost, setTransportationCost] = useState(
    tourPackage.transportExpensePerPerson
  );
  const [images, setImages] = useState(tourPackage.imageUrls);
  const [imageUrls, setImageUrls] = useState(tourPackage.imageUrls);
  const fileInputRef = useRef();
  const toast = useToast();
  const router = useRouter();
  const loadingRef = useRef();
  const isDayError = tourDuration <= 0;
  const [arrivalDate, setArrivalDate] = useState("");
  const [summary, setSummary] = useState(tourPackage.summary);
  const [id, setId] = useState(tourPackage._id);

  useEffect(() => {
    loadingRef.current.style.display = "none";
    setArrivalDate(calculateArrivalDate(departureDate));
  }, []);

  const calculateArrivalDate = (selectedDate) => {
    const arrivalDate = new Date(selectedDate); // Create a new Date object based on selectedDate
    arrivalDate.setDate(arrivalDate.getDate() + parseInt(tourDuration)); // Add 4 days to the selectedDate
    console.log(arrivalDate);
    return arrivalDate.toISOString().split("T")[0]; // Convert arrivalDate to "yyyy-mm-dd" format
  };

  const handleSummaryChange = (index, value) => {
    const newInputFields = [...summary];
    newInputFields[index] = value;
    setSummary(newInputFields);
  };

  const handleBreakfastChange = (index, value) => {
    const newInputFields = [...breakfast];
    newInputFields[index] = value;
    setBreakfast(newInputFields);
  };

  const handleLunchChange = (index, value) => {
    const newInputFields = [...lunch];
    newInputFields[index] = value;
    setLunch(newInputFields);
  };

  const handleDinnerChange = (index, value) => {
    const newInputFields = [...dinner];
    newInputFields[index] = value;
    setDinner(newInputFields);
  };

  // useEffect(() => {
  //   if (departureDate !== "" && arrivalDate !== "") {
  //     // Parse departureDate and arrivalDate strings to Date objects
  //     const parsedDepartureDate = new Date(departureDate);
  //     const parsedArrivalDate = new Date(arrivalDate);

  //     // Calculate the difference in milliseconds between the two dates
  //     const timeDifference =
  //       parsedArrivalDate.getTime() - parsedDepartureDate.getTime();

  //     // Convert the difference from milliseconds to days
  //     const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  //     // Update state with the calculated number of days
  //     setTourDuration(days);
  //   }
  // }, [departureDate, arrivalDate]);
  //   "Punjab",
  //   " Sindh",
  //   " Khyber Pakhtunkhwa",
  //   "Balochistan",
  //   "Gilgit-Baltistan",
  //   "Azad Kashmir",
  // ];

  const pakistanCities = {
    Punjab: [
      "Lahore",
      "Islamabad",
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

  const [selectedCountry, setSelectedCountry] = useState("Pakistan");
  const [selectedProvince, setSelectedProvince] = useState(
    tourPackage.province
  );
  const [selectedCity, setSelectedCity] = useState(tourPackage.city);

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
  const [selectedValue, setSelectedValue] = useState(tourPackage.departureCity);

  const transportationsList = ["Bus", "SUV", "Jeep", "Minivan", "Coach"];
  const [selectedTransport, setSelectedTransport] = useState(
    tourPackage.transportType
  );

  const inclusionsList = [
    "Meals",
    "Transportation",
    "Accommodation",
    "Activities",
    "Equipment Rental",
    "Entrance Fees",
    "Taxes and Service Charges",
  ];
  const exclusionsList = [
    "Airfare",
    "Travel Insurances",
    "Personal Expenses",
    "Optional Activities",
    "Visa and Passport Fees",
    "Medical Expenses",
    "Tips and Gratuities",
    "Airport Transfers",
  ];

  const handleTransportations = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setTransportations((s) => [...s, value]);
    } else {
      setTransportations((s) => s.filter((d) => d !== value));
    }
  };

  const handleInclusions = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setInclusions((s) => [...s, value]);
    } else {
      setInclusions((s) => s.filter((d) => d !== value));
    }
  };

  const hanldeExclusions = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setExclusions((s) => [...s, value]);
    } else {
      setExclusions((s) => s.filter((d) => d !== value));
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = sRef(storage, `tourPackageImages/${file.name}`);
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
    if (!name) {
      toast({
        description: "Package Name cannot be empty!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    } else if (!destinations) {
      toast({
        description: "Destination(s) cannot be empty!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
      // } else if (!transportDetails) {
      //   toast({
      //     description: "Transportation Details cannot be empty!",
      //     status: "error",
      //     duration: 2000,
      //     isClosable: true,
      //   });
    } else if (!accommodations) {
      toast({
        description: "Accommodation(s) cannot be empty!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
      // } else if (!accommodationDetails) {
      //   toast({
      //     description: "Accommodation Details cannot be empty!",
      //     status: "error",
      //     duration: 2000,
      //     isClosable: true,
      //   });
    } else if (!tourDuration) {
      toast({
        description: "Tour Duration cannot be empty!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    } else if (isNaN(tourDuration) || tourDuration <= 0 || tourDuration >= 99) {
      toast({
        description: "Tour Duration must be a number between 1 and 9999!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    } else if (!mealsCost) {
      toast({
        description: "Food charges cannot be empty!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    } else if (isNaN(mealsCost) || mealsCost <= 0 || mealsCost >= 9999999) {
      toast({
        description: "Meals Cost must be a number between 1 and 9999!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    } else if (!accommodationsCost) {
      toast({
        description: "Accommodation Cost cannot be empty!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    } else if (
      isNaN(accommodationsCost) ||
      accommodationsCost <= 0 ||
      accommodationsCost >= 9999999
    ) {
      toast({
        description: "Accommodation Cost must be a number between 1 and 9999!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    } else if (!transportationCost) {
      toast({
        description: "Transportation Cost cannot be empty!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    } else if (
      isNaN(transportationCost) ||
      transportationCost <= 0 ||
      transportationCost >= 9999999
    ) {
      toast({
        description: "Transportation Cost must be a number between 1 and 9999!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    // making registration
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
    const contact = businessResponse.data.contact;
    const price =
      parseInt(mealsCost) +
      parseInt(transportationCost) +
      parseInt(accommodationsCost);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/editBusinessTourPackage",
        {
          _id: id,
          userId,
          name,
          contact,
          businessName,
          departureCity: selectedValue,
          city: selectedCity,
          departureDate,
          arrivalDate,
          summary,
          inclusions,
          exclusions,
          breakfast,
          destination: destinations,
          lunch,
          province: selectedProvince,
          country: selectedCountry,
          dinner,
          transportType: selectedTransport,
          // transportDetails,
          hotelCompanyName: accommodations,
          // accommodationDetails,
          // inclusions,
          // exclusions,
          tourDuration,
          foodPrice: mealsCost,
          hotelRoomExpensePerPerson: accommodationsCost,
          transportExpensePerPerson: transportationCost,
          imageUrls,
          price,
          status: "Approved",
        }
      );
      toast({
        title: "Edit successfull!",
        duration: 3000,
        isClosable: true,
        status: "success",
      });
      console.log("Tour package edited successfully:", response.data);
      router.push("../business/tourPackage");
    } catch (error) {
      console.error("Failed to edit tour package:", error);
      toast({
        title: "Edit failed!",
        duration: 2000,
        isClosable: true,
        status: "error",
      });
    }
  };

  return (
    <Layout>
      <VStack w="100%" p="2%" pt="40px">
        <Box w="100%" borderRadius="10px" p="20px" bg="#143E56">
          <Heading size="sm">Tour Package Edit</Heading>
          <VStack mt="2%">
            <FormControl isRequired>
              <FormLabel>Package Name</FormLabel>
              <Input
                borderRadius="10px"
                padding="10px"
                placeholder="Murree Package"
                size="md"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl mt="1%" isRequired>
              <FormLabel>Departure City</FormLabel>
              <Select
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
              >
                {departureCities.map((dc) => (
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
            <FormControl mt="1%" isRequired>
              <FormLabel>Province</FormLabel>
              <Select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
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
            <FormControl mt="1%" isRequired>
              <FormLabel>Destination City</FormLabel>
              <Select
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
            {/* <FormControl mt="1%" isRequired>
              <FormLabel>Country</FormLabel>
              <Select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                border="none"
                borderBottom="1px"
              >
                {countries.map((dc) => (
                  <option style={{ backgroundColor: "#1F516D" }} value={dc}>
                    {dc}
                  </option>
                ))}
              </Select>
            </FormControl> */}
            <FormControl mt="1%" isRequired>
              <FormLabel>Destination(s)</FormLabel>
              <Input
                borderRadius="10px"
                padding="10px"
                placeholder="Watchtower, Shahi Garden, Badshahi Mosque"
                size="md"
                value={destinations}
                onChange={(e) => setDestinations(e.target.value)}
              />
            </FormControl>
            <FormControl isInvalid={isDayError} mt="1%" isRequired>
              <FormLabel>Tour Duration (Days)</FormLabel>
              <Input
                borderRadius="10px"
                padding="10px"
                placeholder="Enter duration in days"
                size="md"
                value={tourDuration}
                onChange={(e) => setTourDuration(e.target.value)}
              />
              <FormErrorMessage>Enter number greater than 0</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={isDayError} mt="1%" isRequired>
              <FormLabel>Departure Date</FormLabel>
              <Input
                disabled={isDayError}
                type="date"
                borderRadius="10px"
                padding="10px"
                size="md"
                value={departureDate}
                onChange={(e) => {
                  setDepartureDate(e.target.value);
                  setArrivalDate(calculateArrivalDate(e.target.value));
                }}
              />
              <FormErrorMessage>Please select tour duration</FormErrorMessage>
            </FormControl>
            <FormControl mt="1%" isRequired>
              <FormLabel>Arrival Date</FormLabel>
              <Input
                disabled
                type="date"
                borderRadius="10px"
                padding="10px"
                size="md"
                value={arrivalDate}
              />
            </FormControl>
            {!tourDuration <= 0 &&
              [...Array(parseInt(tourDuration))].map((_, i) => (
                <>
                  <FormControl mt="1%" isRequired>
                    <FormLabel>Day {i + 1} summary</FormLabel>
                    <Textarea
                      value={summary[i]}
                      onChange={(e) => handleSummaryChange(i, e.target.value)}
                      placeholder="Write the summary of the day here..."
                      size="md"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Day {i + 1} Breakfast</FormLabel>
                    <Input
                      borderRadius="10px"
                      padding="10px"
                      placeholder="Naan Chanay, Rotti"
                      size="md"
                      value={breakfast[i]}
                      onChange={(e) => handleBreakfastChange(i, e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Day {i + 1} Lunch</FormLabel>
                    <Input
                      borderRadius="10px"
                      padding="10px"
                      placeholder="Biryani, Chicken Kebab"
                      size="md"
                      value={lunch[i]}
                      onChange={(e) => handleLunchChange(i, e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Day {i + 1} Dinner</FormLabel>
                    <Input
                      borderRadius="10px"
                      padding="10px"
                      placeholder="Mutton, Beef, Rotti"
                      size="md"
                      value={dinner[i]}
                      onChange={(e) => handleDinnerChange(i, e.target.value)}
                    />
                  </FormControl>
                </>
              ))}
            <FormControl mt="1%" isRequired>
              <FormLabel>Transport</FormLabel>
              <Select
                value={selectedTransport}
                onChange={(e) => setSelectedTransport(e.target.value)}
              >
                {transportationsList.map((dc) => (
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
            {/* <Box mt="1%" w="100%">
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
            </Box> */}
            {/* <FormControl mt="1%" isRequired>
              <FormLabel>Transportation Details</FormLabel>
              <Input
                
                borderRadius="10px"
                padding="10px"
                placeholder="The bus is airconditioned. There are 7 jeeps."
                size="md"
                value={transportDetails}
                onChange={(e) => setTransportDetails(e.target.value)}
              />
            </FormControl> */}
            <FormControl mt="1%" isRequired>
              <FormLabel>Accommodation(s)</FormLabel>
              <Input
                borderRadius="10px"
                padding="10px"
                placeholder="Riazi Hills, Murre Hotel"
                size="md"
                value={accommodations}
                onChange={(e) => setAccommodations(e.target.value)}
              />
            </FormControl>
            {/* <FormControl mt="1%" isRequired>
              <FormLabel>Accommodation Details</FormLabel>
              <Input
                
                borderRadius="10px"
                padding="10px"
                placeholder="The hotel rooms are airconditioned. Rooms are neat and clean."
                size="md"
                value={accommodationDetails}
                onChange={(e) => setAccommodaitonDetails(e.target.value)}
              />
            </FormControl> */}
            <VStack w="100%" mt="1%" alignItems="flex-start">
              <Text fontWeight="bold">Upload Images</Text>
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
            <Box mt="1%" w="100%">
              <Text fontWeight="bold">Inclusions</Text>
              <Stack
                flexWrap="wrap"
                mt="10px"
                spacing={[1, 5]}
                direction={["column", "row"]}
              >
                {inclusionsList.map((t) => (
                  <Checkbox
                    key={t}
                    size="sm"
                    colorScheme="white"
                    value={t}
                    isChecked={inclusions.includes(t)}
                    onChange={handleInclusions}
                  >
                    {t}
                  </Checkbox>
                ))}
              </Stack>
            </Box>
            <Box mt="1%" w="100%">
              <Text fontWeight="bold">Exclusions</Text>
              <Stack
                flexWrap="wrap"
                mt="10px"
                spacing={[1, 5]}
                direction={["column", "row"]}
              >
                {exclusionsList.map((t) => (
                  <Checkbox
                    key={t}
                    size="sm"
                    colorScheme="white"
                    value={t}
                    isChecked={exclusions.includes(t)}
                    onChange={hanldeExclusions}
                  >
                    {t}
                  </Checkbox>
                ))}
              </Stack>
            </Box>
            <FormControl mt="1%" isRequired>
              <FormLabel>Food charges per person (Rs.)</FormLabel>
              <NumberInput defaultValue={mealsCost}>
                <NumberInputField
                  borderRadius="10px"
                  padding="10px"
                  placeholder="Enter cost in Rs."
                  size="md"
                  value={mealsCost}
                  onChange={(e) => setMealsCost(e.target.value)}
                />
              </NumberInput>
            </FormControl>
            <FormControl mt="1%" isRequired>
              <FormLabel>Hotel Room Expense Per Person (Rs.)</FormLabel>
              <NumberInput defaultValue={accommodationsCost}>
                <NumberInputField
                  borderRadius="10px"
                  padding="10px"
                  placeholder="Enter cost in Rs."
                  size="md"
                  value={accommodationsCost}
                  onChange={(e) => setAccommodationsCost(e.target.value)}
                />
              </NumberInput>
            </FormControl>
            <FormControl mt="1%" isRequired>
              <FormLabel>Transport Expense Per Person (Rs.)</FormLabel>
              <NumberInput defaultValue={transportationCost}>
                <NumberInputField
                  borderRadius="10px"
                  padding="10px"
                  placeholder="Enter cost in Rs."
                  size="md"
                  value={transportationCost}
                  onChange={(e) => setTransportationCost(e.target.value)}
                />
              </NumberInput>
            </FormControl>
            <Box w="100%">
              <Text fontWeight="bold">
                Total Cost:{" Rs."}
                {(parseInt(mealsCost) || 0) +
                  (parseInt(transportationCost) || 0) +
                  (parseInt(accommodationsCost) || 0)}
              </Text>
            </Box>
            <Button
              onClick={handleSubmit}
              bg="#398D2C"
              color="white"
              _hover={{ opacity: 0.5 }}
            >
              Submit
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const response = await axios.get(
    `http://127.0.0.1:8000/getTourPackage/${id}`
  );
  const tourPackage = response.data;
  return {
    props: {
      tourPackage,
    },
  };
}
