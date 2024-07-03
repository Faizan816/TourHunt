import { useState, useRef } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Select,
} from "@chakra-ui/react";
import axios from "axios";

export default function EditDrawer({
  isOpen,
  onClose,
  bn,
  c,
  co,
  pr,
  ci,
  business,
}) {
  const [businessName, setBusinessName] = useState(bn);
  const [contact, setContact] = useState(c);
  const [country, setCountry] = useState(co);
  const [province, setProvince] = useState(pr);
  const [city, setCity] = useState(ci);
  const [cnic, setCnic] = useState(business.cnic);
  const firstField = useRef();
  const router = useRouter();

  console.log("city", ci);

  const countries = ["Pakistan"]; // Example options
  const provinces = [
    "Punjab",
    " Sindh",
    " Khyber Pakhtunkhwa",
    "Balochistan",
    "Gilgit-Baltistan",
    "Azad Kashmir",
  ]; // Example options

  const cities = [
    "Abbottabad",
    "Ahmadpur East",
    "Ahmed Nager Chatha",
    "Akora Khattak",
    "Ali Khan Abad",
    "Alpuri",
    "Astore",
    "Attock",
    "Ayubia",
    "Badin",
    "Bagh",
    "Bahawalnagar",
    "Bahawalpur",
    "Banda Daud Shah",
    "Bannu",
    "Batkhela",
    "Battagram",
    "Bela",
    "Bhakkar",
    "Bhalwal",
    "Bhimber",
    "Bhirkan",
    "Burewala",
    "Chak",
    "Chakdara",
    "Chakwal",
    "Charsadda",
    "Chawinda",
    "Cherat",
    "Chichawatni",
    "Chilas",
    "Chiniot",
    "Chishtian",
    "Chitral",
    "Choa Saidan Shah",
    "Chohar Jamali",
    "Chunian",
    "Dadhar",
    "Dadu",
    "Daharki",
    "Dandot",
    "Dargai",
    "Darya Khan",
    "Daska",
    "Daud Khel",
    "Daulatpur",
    "Daur",
    "Dehri",
    "Dera Bugti",
    "Dera Ghazi Khan",
    "Dera Ismail Khan",
    "Dera Murad Jamali",
    "Dhadar",
    "Dhakla",
    "Dina",
    "Dinga",
    "Dipalpur",
    "Diplo",
    "Dokri",
    "Drosh",
    "Faisalabad",
    "Fateh Jang",
    "Gadani",
    "Gaggoo Mandi",
    "Gakuch",
    "Gandava",
    "Gandawah",
    "Garhi Khairo",
    "Ghari Dupatta",
    "Ghari Yasin",
    "Ghizer",
    "Ghotki",
    "Gilgit",
    "Gojra",
    "Gujar Khan",
    "Gujranwala",
    "Gujrat",
    "Gwadar",
    "Hadali",
    "Hafizabad",
    "Hala",
    "Hangu",
    "Haripur",
    "Harnai",
    "Hasilpur",
    "Haveli Lakha",
    "Havelian",
    "Hunza",
    "Hyderabad",
    "Islamabad",
    "Islamkot",
    "Jacobabad",
    "Jahanian Shah",
    "Jalalpur Jattan",
    "Jalalpur Pirwala",
    "Jampur",
    "Jamshoro",
    "Jand",
    "Jandola",
    "Jaranwala",
    "Jatoi Shimali",
    "Jauharabad",
    "Jhang",
    "Jhelum",
    "Jhudo",
    "Jiwani",
    "Jungshahi",
    "Kabirwala",
    "Kahror Pakka",
    "Kahuta",
    "Kakul",
    "Kalabagh",
    "Kalat",
    "Kaleke Mandi",
    "Kallar Kahar",
    "Kalur Kot",
    "Kamalia",
    "Kamoke",
    "Kamra",
    "Kandiaro",
    "Karachi",
    "Karak",
    "Karor Lal Esan",
    "Kashmor",
    "Kasur",
    "Katuri",
    "Keti Bandar",
    "Khairpur",
    "Khanewal",
    "Khanpur",
    "Kharian",
    "Khewra",
    "Khuzdar",
    "Khyber",
    "Kohat",
    "Kot Addu",
    "Kot Diji",
    "Kot Ghulam Muhammad",
    "Kot Mithan",
    "Kot Sultan",
    "Kotli",
    "Kotli Sattian",
    "Kotri",
    "Kulachi",
    "Kundian",
    "Kunjah",
    "Kunri",
    "Lahore",
    "Lakki Marwat",
    "Lala Musa",
    "Lalamusa",
    "Lalian",
    "Larkana",
    "Layyah",
    "Liaquat Pur",
    "Lodhran",
    "Loralai",
    "Lower Dir District",
    "Machi Goth",
    "Machulu",
    "Mailsi",
    "Makli",
    "Malakwal",
    "Mamoori",
    "Mandi Bahauddin",
    "Mandi Warburton",
    "Mangla",
    "Mankera",
    "Mardan",
    "Mastuj",
    "Matiari",
    "Matli",
    "Mehar",
    "Mehrabpur",
    "Mian Channu",
    "Mianwali",
    "Minchinabad",
    "Mingora",
    "Miram Shah",
    "Mirpur",
    "Mirpur Khas",
    "Mirpur Mathelo",
    "Mirpur Sakro",
    "Mithi",
    "Mitro",
    "Mohmand",
    "Morā",
    "Moro",
    "Multan",
    "Muridke",
    "Murree",
    "Mustafabad",
    "Muzaffarabad",
    "Nabisar",
    "Nagar Parkar",
    "Nankana Sahib",
    "Narang",
    "Narowal",
    "Naseerabad",
    "Naudero",
    "Naukot",
    "Naushahro Firoz",
    "Naushahra Virkan",
    "Nawabshah",
    "North Waziristan",
    "Noshero Feroz",
    "Nushki",
    "Nowshera",
    "Nowshera Cantonment",
    "Okara",
    "Ormara",
    "Paharpur",
    "Pakpattan",
    "Panjgur",
    "Pano Aqil",
    "Parachinar",
    "Pasni",
    "Pattoki",
    "Peshawar",
    "Pind Dadan Khan",
    "Pindi Bhattian",
    "Pindigheb",
    "Pir Jo Goth",
    "Pir Mahal",
    "Pishin",
    "Pithoro",
    "Pīr jo Goth",
    "Quetta",
    "Rabwah",
    "Rahim Yar Khan",
    "Raiwind",
    "Raja Jang",
    "Rajanpur",
    "Ranipur",
    "Rasulnagar",
    "Rawalakot",
    "Rawalpindi",
    "Renala Khurd",
    "Risalpur Cantonment",
    "Rohri",
    "Rojhan",
    "Rohri",
    "Sadiqabad",
    "Sahiwal",
    "Sahiwal",
    "Sakrand",
    "Samaro",
    "Sambrial",
    "Sanghar",
    "Sangla Hill",
    "Sarai Alamgir",
    "Sarai Naurang",
    "Sarai Sidhu",
    "Sargodha",
    "Sehwan",
    "Sehwan Sharif",
    "Shabqadar",
    "Shahdad Kot",
    "Shahdadpur",
    "Shahkot",
    "Shakargarr",
    "Shakargarh",
    "Shamkhor",
    "Shangla",
    "Sharaqpur Sharif",
    "Sheikhupura",
    "Shikarpur",
    "Shujaabad",
    "Sialkot",
    "Sibi",
    "Sillānwāli",
    "Sita Road",
    "Skardu",
    "Sobhodero",
    "Sodhra",
    "Sohawa",
    "Sohbatpur",
    "Sukheke",
    "Sukkur",
    "Swabi",
    "Swat",
    "Talagang",
    "Talhar",
    "Tando Adam",
    "Tando Allahyar",
    "Tando Bago",
    "Tando Jam",
    "Tando Muhammad Khan",
    "Tangi",
    "Tank",
    "Tarbela",
    "Tatlay Wali",
    "Taunsa",
    "Taxila",
    "Thal",
    "Thatta",
    "Thul",
    "Tobatek Singh",
    "Topi",
    "Turbat",
    "Ubauro",
    "Umarkot",
    "Umerkot",
    "Upper Dir",
    "Usta Muhammad",
    "Uthal",
    "Vehari",
    "Wadh",
    "Wah Cantonment",
    "Warah",
    "Wazirabad",
    "Yazman",
    "Zafarwal",
    "Zahir Pir",
    "Zaida",
    "Zhob",
  ];
  const [selectedValue, setSelectedValue] = useState(cities[0]);

  const handleSave = async () => {
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

    // Contact validation
    const contactPattern = /^\d{11}$/;
    if (!contactPattern.test(contact)) {
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
    if (!cnicPattern.test(cnic)) {
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

    const response = await axios.post(
      "http://127.0.0.1:8000/updateBusinessProfile",
      {
        businessName,
        country,
        province,
        city,
        contact,
        contact,
        cnic,
        _id: business._id,
      }
    );
    router.push("../business/dashboard");
    onClose();
  };

  return (
    <>
      <Drawer
        initialFocusRef={firstField}
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent bg="#1F516D" color="white">
          <DrawerCloseButton />
          <DrawerHeader>Edit your Profile</DrawerHeader>

          <DrawerBody>
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
            <FormControl isRequired mt="20px">
              <FormLabel fontWeight="bold">Location:</FormLabel>
              <Select
                variant="flushed"
                borderRadius="10px"
                padding="10px"
                size="md"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                mr="10px" // Add margin-right to separate the Select components
              >
                {countries.map((countryOption) => (
                  <option style={{ backgroundColor: "#1F516D" }}>
                    {countryOption}
                  </option>
                ))}
              </Select>
              <Select
                variant="flushed"
                borderRadius="10px"
                padding="10px"
                size="md"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                mr="10px" // Add margin-right to separate the Select components
              >
                {provinces.map((provinceOption) => (
                  <option style={{ backgroundColor: "#1F516D" }}>
                    {provinceOption}
                  </option>
                ))}
              </Select>
              <Select
                variant="flushed"
                borderRadius="10px"
                padding="10px"
                size="md"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                {cities.map((cityOption) => (
                  <option style={{ backgroundColor: "#1F516D" }}>
                    {cityOption}
                  </option>
                ))}
              </Select>
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
              <Input
                variant="flushed"
                borderRadius="10px"
                padding="10px"
                placeholder="35032-9457683-1"
                size="md"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
              />
            </FormControl>
          </DrawerBody>

          <DrawerFooter>
            <Button
              bg="#AC3116"
              color="white"
              _hover={{ opacity: 0.5 }}
              mr={3}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              bg="#398D2C"
              color="white"
              _hover={{ opacity: 0.5 }}
              colorScheme="blue"
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
