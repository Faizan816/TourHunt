import { useState, useEffect } from "react";
import Layout from "../../components/layout";
import { useRouter } from "next/router";
import {
  Text,
  Input,
  Heading,
  Stack,
  Checkbox,
  Button,
  FormControl,
  FormLabel,
  useToast,
  Select,
  Flex,
  FormHelperText,
  HStack,
  PinInput,
  PinInputField,
} from "@chakra-ui/react";
import axios from "axios";

export default function Signup() {
  const router = useRouter();
  const toast = useToast();
  const [businessName, setBusinessName] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [province, setProvince] = useState("Punjab");
  const [city, setCity] = useState("Lahore");
  const [contact, setContact] = useState("");
  const [services, setServices] = useState([]);
  const [cnic, setCnic] = useState();
  const countries = ["Pakistan"];
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
  const [ntn, setNtn] = useState(0);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("currentUser") || false;
    console.log(isLoggedIn);
    if (!isLoggedIn) {
      router.push("../login");
    }
  }, []);

  const formatCnic = () => {
    // Extract parts of the CNIC
    const part1 = cnic.slice(0, 5);
    const part2 = cnic.slice(5, 12);
    const part3 = cnic.slice(12);

    // Format into the desired format
    const formattedCnic = `${part1}-${part2}-${part3}`;

    return formattedCnic;
  };

  useEffect(() => {
    preventUnwantedBehavior();
  }, []);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setServices((prevServices) => [...prevServices, value]);
    } else {
      setServices((prevServices) =>
        prevServices.filter((service) => service !== value)
      );
    }
  };

  const preventUnwantedBehavior = async () => {
    const user = await axios.post("http://127.0.0.1:8000/findUserUsingEmail", {
      email: localStorage.getItem("currentUser"),
    });
    const userId = user.data._id;
    try {
      const businessResponse = await axios.post(
        "http://127.0.0.1:8000/getBusiness",
        { id: userId }
      );
      router.push("../business/dashboard");
    } catch (error) {
      try {
        const biResponse = await axios.post(
          "http://127.0.0.1:8000/getBusinessInvite",
          { id: userId }
        );
        router.push("../business/dashboard");
      } catch (error) {}
    }
  };

  const checkInvite = async (userId) => {
    try {
      const biResponse = await axios.post(
        "http://127.0.0.1:8000/getBusinessInvite",
        {
          id: userId,
        }
      );
      console.log(biResponse.data);
      router.push("../business/dashboard");
    } catch (error) {
      submitForm();
    }
  };

  const submitForm = async () => {
    const user = await axios.post("http://127.0.0.1:8000/findUserUsingEmail", {
      email: localStorage.getItem("currentUser"),
    });

    const userId = user.data._id;
    console.log(userId);
    const formData = {
      userId,
      businessName,
      country: "Pakistan",
      province: selectedProvince,
      city: selectedCity,
      contact,
      ntn,
      services,
      cnic: formatCnic(),
      status: "Pending",
    };
    console.log(formData);

    const response = await axios.post(
      "http://127.0.0.1:8000/registerBusiness",
      formData
    );
    if (response.status === 200) {
      toast({
        title: "Request Submitted Successfully!",
        description:
          "Your request has been submitted successfully! You will be notified for the response.",
        duration: 3000,
        isClosable: true,
        status: "success",
      });
      router.push("../business/dashboard");
    } else {
      toast({
        title: "Request Failed!",
        description: "Oops! Something went wrong! Plz try again.",
        duration: 3000,
        isClosable: true,
        status: "error",
      });
    }
  };

  const handleSubmit = async () => {
    // Business Name validation
    if (
      !businessName ||
      typeof businessName !== "string" ||
      businessName.length > 100
    ) {
      toast({
        title: "Invalid Input",
        description:
          "Please provide a valid business name (maximum 100 characters).",
        duration: 3000,
        isClosable: true,
        status: "error",
      });
      return;
    }
    // ntn validation
    if (ntn <= 0 || ntn.length < 13) {
      toast({
        title: "NTN is required!",
        description: "Please enter a valid NTN",
        duration: 3000,
        isClosable: true,
        status: "error",
      });
      return;
    }
    // Contact validation
    const contactRegex = /^\d{11}$/;
    if (!contactRegex.test(contact)) {
      toast({
        title: "Invalid Input",
        description: "Please provide a valid contact number (up to 11 digits).",
        duration: 3000,
        isClosable: true,
        status: "error",
      });
      return;
    }

    // CNIC validation
    const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
    if (!cnicPattern.test(formatCnic())) {
      toast({
        title: "Invalid Input",
        description:
          "Please provide a valid CNIC number (format: xxxxx-xxxxxxx-x).",
        duration: 3000,
        isClosable: true,
        status: "error",
      });
      return;
    }

    const user = await axios.post("http://127.0.0.1:8000/findUserUsingEmail", {
      email: localStorage.getItem("currentUser"),
    });
    const userId = user.data._id;
    console.log(checkInvite(userId));
  };

  return (
    <Layout>
      <div className="business-signup-container">
        <div className="business-signup-wrapper">
          <Heading mb="10px" size="md" mt="40px">
            Setup Business Profile
          </Heading>
          <div className="signup-container">
            <FormControl isRequired>
              <FormLabel fontWeight="bold">Business Name:</FormLabel>
              <Input
                borderRadius="10px"
                padding="10px"
                variant="flushed"
                placeholder="Ali Travels"
                size="md"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </FormControl>
            <FormControl mt="20px" isRequired>
              <FormLabel fontWeight="bold">
                National Tax Number (NTN):
              </FormLabel>
              <Input
                borderRadius="10px"
                padding="10px"
                variant="flushed"
                placeholder="Enter your 13 digit NTN"
                size="md"
                value={ntn}
                onChange={(e) => {
                  if (ntn.length < 13) setNtn(e.target.value);
                  if (e.nativeEvent.inputType === "deleteContentBackward") {
                    console.log("Backspace pressed");
                    setNtn(e.target.value);
                  }
                }}
                type="number"
              />
              <FormHelperText color="white" fontSize="smaller">
                Enter your 13 digit NTN here
              </FormHelperText>
            </FormControl>
            <FormControl isRequired mt="20px">
              <FormLabel fontWeight="bold">Location:</FormLabel>
              <Flex gap="40px">
                {/* <Select
                  variant="flushed"
                  borderRadius="10px"
                  padding="10px"
                  size="md"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  width="38%" // Adjust width as needed
                  mr="10px" // Add margin-right to separate the Select components
                >
                  {countries.map((countryOption) => (
                    <option
                      key={countryOption}
                      value={countryOption}
                      style={{ backgroundColor: "#1F516D" }}
                    >
                      {countryOption}
                    </option>
                  ))}
                </Select> */}
                <Select
                  border="0"
                  borderBottom="1px"
                  w="50%"
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedCity(pakistanCities[e.target.value][0]);
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
                <Select
                  border="0"
                  borderBottom="1px"
                  w="50%"
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
              </Flex>
            </FormControl>
            <FormControl isRequired mt="20px">
              <FormLabel fontWeight="bold">Contact:</FormLabel>
              <Input
                variant="flushed"
                borderRadius="10px"
                padding="10px"
                placeholder="03135068731"
                size="md"
                value={contact}
                onChange={(e) => {
                  if (contact.length < 11) setContact(e.target.value);
                  if (e.nativeEvent.inputType === "deleteContentBackward") {
                    console.log("Backspace pressed");
                    setContact(e.target.value);
                  }
                }}
                type="number"
              />
            </FormControl>
            <FormControl isRequired mt="20px">
              <FormLabel fontWeight="bold">Cnic:</FormLabel>
              <HStack>
                <PinInput value={cnic} onChange={(value) => setCnic(value)}>
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <Text>-</Text>
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <Text>-</Text>
                  <PinInputField />
                </PinInput>
              </HStack>
            </FormControl>
            <Text mt="20px" fontWeight="bold">
              Services:
            </Text>
            <Text mt="5px" fontSize="sm" opacity="0.8">
              Select one or more services you are offering
            </Text>
            <Stack
              flexWrap="wrap"
              mt="10px"
              spacing={[1, 2]}
              direction={["column", "row"]}
            >
              <Checkbox
                size="sm"
                colorScheme="white"
                value="Tour Package"
                onChange={handleCheckboxChange}
              >
                Tour Package
              </Checkbox>
              <Checkbox
                size="sm"
                colorScheme="white"
                value="Restaurant"
                onChange={handleCheckboxChange}
              >
                Restaurant
              </Checkbox>
              <Checkbox
                size="sm"
                colorScheme="white"
                value="Transport"
                onChange={handleCheckboxChange}
              >
                Transport
              </Checkbox>
              <Checkbox
                size="sm"
                colorScheme="white"
                value="Accommodation"
                onChange={handleCheckboxChange}
              >
                Accommodation
              </Checkbox>
            </Stack>
            <Stack
              direction={["column", "row"]}
              mt="20px"
              justifyContent="space-evenly"
            >
              <Button
                _hover={{ opacity: 0.5 }}
                bg="#398D2C"
                size="sm"
                color="white"
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <Button
                _hover={{ opacity: 0.5 }}
                bg="#AC3116"
                size="sm"
                color="white"
                onClick={() => router.push("../home")}
              >
                Cancel
              </Button>
            </Stack>
          </div>
        </div>
      </div>
    </Layout>
  );
}
