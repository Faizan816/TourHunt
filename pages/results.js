import {
  Heading,
  Text,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  Image,
} from "@chakra-ui/react";
import Layout from "../components/layout";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Results.module.css";
import Navbar from "../components/navbar";
import Pagination from "../components/Pagination";
import { paginate } from "../components/paginate";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setTourData } from "../tourSlice";
import { setAccommodationData } from "../accommodationSlice";
import { setTransportData } from "../transportSlice";
import { setTourPackageBudget } from "../budgetSlice";
import {
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Results({
  tourPackagesData,
  accommodationsData,
  transportsData,
  restaurantsData,
}) {
  const [tourPackagesPrice, setTourPackagesPrice] = useState(40000);
  const [accommodationsPrice, setAccommodationsPrice] = useState(40000);
  const [restaurantsPrice, setRestaurantsPrice] = useState(5000);
  const [transportsPrice, setTransportsPrice] = useState(3000);
  const [showTooltip, setShowTooltip] = useState(false);
  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm",
  };

  const router = useRouter();
  const { name, type, service, search } = router.query;
  const [tabIndex, setTabIndex] = useState();

  const [tpData, setTpData] = useState(tourPackagesData);
  const [aData, setAData] = useState(accommodationsData);
  const [tData, setTData] = useState(transportsData);
  const [rData, setRData] = useState(restaurantsData);
  const [isTourPackageVisible, setIsTourPackageVisible] = useState(true);
  const [isAccommodationVisible, setIsAccommodationVisible] = useState(true);
  const [isTransportVisible, setIsTransportVisible] = useState(true);
  const [isRestaurantVisible, setIsRestaurantVisible] = useState(true);
  const [selectedDepartureCity, setSelectedDepartureCity] =
    useState("Select City...");
  const [selectedDestinationCity, setSelectedDestinationCity] =
    useState("Select City...");
  const [location, setLocation] = useState("Select City...");
  const [selectedTransportType, setSelectedTransportType] = useState(
    "Select Transport..."
  );
  // pages
  const [tourPackagePage, setTourPackagePage] = useState(1);
  const [restaurantPage, setRestaurantPage] = useState(1);
  const [transportPage, setTransportPage] = useState(1);
  const [accommodationPage, setAccommodationPage] = useState(1);
  const pageSize = 10;

  //data of services and dividing them into pages
  const [tourPackages, setTourPackages] = useState(
    paginate(tourPackagesData, tourPackagePage, pageSize)
  );
  const [restaurants, setRestaurants] = useState(
    paginate(restaurantsData, restaurantPage, pageSize)
  );
  const [transports, setTransports] = useState(
    paginate(transportsData, transportPage, pageSize)
  );
  const [accommodations, setAccommodations] = useState(
    paginate(accommodationsData, accommodationPage, pageSize)
  );
  const [tourPackageRatings, setTourPackageRatings] = useState([]);
  const [restaurantRatings, setRestaurantRatings] = useState([]);
  const [accommodationRatings, setAccommodationRatings] = useState([]);
  const [transportRatings, setTransportRatings] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [restaurantFavorites, setRestaurantFavorites] = useState();
  const [tourPackageFavorites, setTourPackageFavorites] = useState();
  const [accommodationFavorites, setAccommodationFavorites] = useState();
  const [transportFavorites, setTransportFavorites] = useState();
  const destinationCities = [
    "lahore",
    "rawalpindi",
    "gujranwala",
    "bahawalpur",
    "sargodha",
    "sialkot",
    "sheikhupura",
    "dera ghazi khan",
    "wah cantonment",
    "kasur",
    "chiniot",
    "kamoke",
    "sadiqabad",
    "khanewal",
    "muzaffargarh",
    "jhelum",
    "daska",
    "gojra",
    "chishtian",
    "attock",
    "vehari",
    "ferozewala",
    "gujranwala cantonment",
    "ahmedpur east",
    "kot addu",
    "wazirabad",
    "taxila",
    "khushab",
    "mianwali",
    "lodhran",
    "sambrial",
    "jhang",
    "muazaffargarh",
    "pakpattan",
    "muridke",
    "kamalia",
    "layyah",
    "hasilpur",
    "arif wala",
    "jatoi",
    "narowal",
    "bhalwal",
    "garhi yasin",
    "ghotki",
    "khairpur mirs",
    "hyderabad",
    "jamshoro",
    "khipro",
    "kiamari",
    "kotri",
    "larkana",
    "malir",
    "mian sahib",
    "mirpur khas",
    "nawabshah",
    "piryaloi",
    "ranipur",
    "rohri",
    "sanghar",
    "sehwan sharif",
    "shahdadpur",
    "shikarpur",
    "sukkur",
    "tando adam khan",
    "tando allahyar",
    "thari mirwah",
    "thatta",
    "thul",
    "umerkot",
    "latifabad",
    "karachi",
    "bhiria city",
    "bhirkan",
    "boriri",
    "chak",
    "dadu",
    "daharki",
    "digri",
    "gambat",
    "islamkot",
    "jacobabad",
    "kandhkot",
    "kandiaro",
    "keti bandar",
    "manjhand",
    "mehrabpur",
    "naudero",
    "new saeedabad",
    "quetta",
    "gwadar",
    "sibi",
    "loralai",
    "nushki",
    "zhob",
    "kharan",
    "saranan",
    "pishin",
    "pasni",
    "dera bugti",
    "jiwani",
    "ormara",
    "peshawar",
    "mardan",
    "kohat",
    "abbottabad",
    "swabi",
    "barikot",
    "haripur",
    "paharpur",
    "lakki marwat",
    "paroa",
    "mingora",
    "mansehra",
    "takht-i-bahi",
    "batkhela",
    "jamrud",
    "bahrain",
    "topi",
    "jehangira",
    "bannu",
    "chitral",
    "havelian",
    "khwazakhela",
    "khalabat",
    "tank",
    "matta",
    "tordher",
    "timargara",
    "amangarh",
    "risalpur",
    "nawan shehr",
    "sadda",
    "landi kotal",
    "utmanzai",
    "Murree",
  ];

  // to check if user is logged in or not
  useEffect(() => {
    if (localStorage.getItem("currentUser")) {
      setIsLoggedIn(true);
    }
  }, []);

  // useEffects which will trigger re-render when page number gets changed
  useEffect(() => {
    setTourPackages(
      !tpData
        ? paginate(tourPackagesData, tourPackagePage, pageSize)
        : paginate(tpData, tourPackagePage, pageSize)
    );

    // Reset ratings to an empty array before fetching new ratings and favorites
    setTourPackageRatings([]);
    setTourPackageFavorites({});

    // Map over paginated data to fetch ratings and favorites for each item
    paginate(tpData, tourPackagePage, pageSize).forEach(async (d) => {
      const { rating, numRatings } = await getRating(d._id);
      const isFavorite = await getFavorite(d._id);

      setTourPackageRatings((prevRatings) => {
        return { ...prevRatings, [d._id]: { rating, numRatings } };
      });
      setTourPackageFavorites((prevRatings) => {
        return { ...prevRatings, [d._id]: isFavorite };
      });
    });
  }, [tourPackagePage]);

  useEffect(() => {
    setRestaurants(
      !rData
        ? paginate(restaurantsData, restaurantPage, pageSize)
        : paginate(rData, restaurantPage, pageSize)
    );

    // Reset ratings to an empty array before fetching new ratings and favorites
    setRestaurantRatings([]);
    setRestaurantFavorites({});

    // Map over paginated data to fetch ratings and favorites for each item
    paginate(rData, restaurantPage, pageSize).forEach(async (d) => {
      const { rating, numRatings } = await getRating(d._id);
      const isFavorite = await getFavorite(d._id);

      setRestaurantRatings((prevRatings) => {
        return { ...prevRatings, [d._id]: { rating, numRatings } };
      });
      setRestaurantFavorites((prevRatings) => {
        return { ...prevRatings, [d._id]: isFavorite };
      });
    });
  }, [restaurantPage]);

  useEffect(() => {
    setAccommodations(
      !aData
        ? paginate(accommodationsData, accommodationPage, pageSize)
        : paginate(aData, accommodationPage, pageSize)
    );

    // Reset ratings to an empty array before fetching new ratings and favorites
    setAccommodationRatings([]);
    setAccommodationFavorites({});

    // Map over paginated data to fetch ratings and favorites for each item
    paginate(aData, accommodationPage, pageSize).forEach(async (d) => {
      const { rating, numRatings } = await getRating(d._id);
      const isFavorite = await getFavorite(d._id);

      setAccommodationRatings((prevRatings) => {
        return { ...prevRatings, [d._id]: { rating, numRatings } };
      });
      setAccommodationFavorites((prevRatings) => {
        return { ...prevRatings, [d._id]: isFavorite };
      });
    });
  }, [accommodationPage]);

  useEffect(() => {
    setTransports(
      !tData
        ? paginate(transportsData, transportPage, pageSize)
        : paginate(tData, transportPage, pageSize)
    );

    // Reset ratings to an empty object before fetching new ratings and favorites
    setTransportRatings({});
    setTransportFavorites({});

    // Map over paginated data to fetch ratings and favorites for each item
    paginate(tData, transportPage, pageSize).forEach(async (d) => {
      const { rating, numRatings } = await getRating(d._id);
      const isFavorite = await getFavorite(d._id);

      setTransportRatings((prevRatings) => {
        return { ...prevRatings, [d._id]: { rating, numRatings } };
      });
      setTransportFavorites((prevRatings) => {
        return { ...prevRatings, [d._id]: isFavorite };
      });
    });
  }, [transportPage]);

  // when this page is accessed through home page
  useEffect(() => {
    if (name) {
      if (type === "city") {
        const filteredTourPackages = tourPackagesData.filter(
          (d) => d.city === name
        );
        setTpData(filteredTourPackages);
        setTourPackages(
          paginate(filteredTourPackages, tourPackagePage, pageSize)
        );
      } else if (type === "province") {
        const filteredTourPackages = tourPackagesData.filter(
          (d) => d.province === name
        );
        setTpData(filteredTourPackages);
        setTourPackages(
          paginate(filteredTourPackages, tourPackagePage, pageSize)
        );
      }
    } else if (service) {
      if (service === "restaurant") {
        setTabIndex(3);
      } else if (service === "transport") {
        setTabIndex(2);
      } else if (service === "accommodation") {
        setTabIndex(1);
      }
    }
  }, []);

  // when this page is being redirected due to search box
  useEffect(() => {
    if (search) {
      try {
        const filteredTourPackages = tourPackagesData.filter(
          (d) =>
            d.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
            d.destination.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
            d.province.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
            d.departureCity.toLowerCase().indexOf(search.toLowerCase()) !==
              -1 ||
            d.transportType.toLowerCase().indexOf(search.toLowerCase()) !== -1
        );
        setTpData(filteredTourPackages);
        setTourPackages(
          paginate(filteredTourPackages, tourPackagePage, pageSize)
        );
        const filteredAccommodations = accommodationsData.filter(
          (d) =>
            d.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
            d.city.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
            d.province.toLowerCase().indexOf(search.toLowerCase()) !== -1
        );
        setAData(filteredAccommodations);
        setAccommodations(
          paginate(filteredAccommodations, accommodationPage, pageSize)
        );
        const filteredRestaurants = restaurantsData.filter(
          (d) =>
            d.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
            d.city.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
            d.province.toLowerCase().indexOf(search.toLowerCase()) !== -1
        );
        setRData(filteredRestaurants);
        setRestaurants(paginate(filteredRestaurants, restaurantPage, pageSize));
        const filteredTransports = transportsData.filter(
          (d) =>
            d.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
            d.transportType.toLowerCase().indexOf(search.toLowerCase()) !==
              -1 ||
            d.city.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
            d.province.toLowerCase().indexOf(search.toLowerCase()) !== -1
        );
        setTData(filteredTransports);
        setTransports(paginate(filteredTransports, transportPage, pageSize));
      } catch (error) {
        console.log(error);
      }
    }
  }, [search]);

  // clearing query parameter of search when refreshing the page
  useEffect(() => {
    return () => {
      const { pathname, search } = window.location;
      window.history.replaceState({}, document.title, pathname);
    };
  }, [router]);

  // applying filters
  const handleApply = () => {
    // resetting all the pages
    setTourPackagePage(1);
    setAccommodationPage(1);
    setTransportPage(1);
    setRestaurantPage(1);
    // --------------------For Tour Packages filters--------------------
    // for single combo
    if (selectedDepartureCity !== "Select City...") {
      const filteredTourPackages = tourPackagesData.filter(
        (d) =>
          d.departureCity.toLowerCase() ===
            selectedDepartureCity.toLowerCase() && d.price <= tourPackagesPrice
      );
      setTpData(filteredTourPackages);
      setTourPackages(
        paginate(filteredTourPackages, tourPackagePage, pageSize)
      );
    } else if (selectedDestinationCity !== "Select City...") {
      const filteredTourPackages = tourPackagesData.filter(
        (d) =>
          d.city.toLowerCase() === selectedDestinationCity.toLowerCase() &&
          d.price <= tourPackagesPrice
      );
      setTpData(filteredTourPackages);
      setTourPackages(
        paginate(filteredTourPackages, tourPackagePage, pageSize)
      );
    } else if (selectedTransportType !== "Select Transport...") {
      const filteredTourPackages = tourPackagesData.filter(
        (d) =>
          d.transportType === selectedTransportType &&
          d.price <= tourPackagesPrice
      );
      setTpData(filteredTourPackages);
      setTourPackages(
        paginate(filteredTourPackages, tourPackagePage, pageSize)
      );
    } else {
      const filteredTourPackages = tourPackagesData.filter(
        (d) => d.price <= tourPackagesPrice
      );
      setTpData(filteredTourPackages);
      setTourPackages(
        paginate(filteredTourPackages, tourPackagePage, pageSize)
      );
    }
    // for double combo
    if (
      selectedDepartureCity !== "Select City..." &&
      selectedDestinationCity !== "Select City..."
    ) {
      const filteredTourPackages = tourPackagesData.filter(
        (d) =>
          d.departureCity.toLowerCase() ===
            selectedDepartureCity.toLowerCase() &&
          d.city.toLowerCase() === selectedDestinationCity.toLowerCase() &&
          d.price <= tourPackagesPrice
      );
      setTpData(filteredTourPackages);
      setTourPackages(
        paginate(filteredTourPackages, tourPackagePage, pageSize)
      );
    } else if (
      selectedDepartureCity !== "Select City..." &&
      selectedTransportType !== "Select Transport..."
    ) {
      const filteredTourPackages = tourPackagesData.filter(
        (d) =>
          d.departureCity.toLowerCase() ===
            selectedDepartureCity.toLowerCase() &&
          d.transportType === selectedTransportType &&
          d.price <= tourPackagesPrice
      );
      setTpData(filteredTourPackages);
      setTourPackages(
        paginate(filteredTourPackages, tourPackagePage, pageSize)
      );
    } else if (
      selectedDestinationCity !== "Select City..." &&
      selectedTransportType !== "Select Transport..."
    ) {
      const filteredTourPackages = tourPackagesData.filter(
        (d) =>
          d.city.toLowerCase() === selectedDestinationCity.toLowerCase() &&
          d.transportType === selectedTransportType &&
          d.price <= tourPackagesPrice
      );
      setTpData(filteredTourPackages);
      setTourPackages(
        paginate(filteredTourPackages, tourPackagePage, pageSize)
      );
    }
    // for triple combo
    if (
      selectedDepartureCity !== "Select City..." &&
      selectedDestinationCity !== "Select City..." &&
      selectedTransportType !== "Select Transport..."
    ) {
      const filteredTourPackages = tourPackagesData.filter(
        (d) =>
          d.departureCity.toLowerCase() ===
            selectedDepartureCity.toLowerCase() &&
          d.city.toLowerCase() === selectedDestinationCity.toLowerCase() &&
          d.transportType === selectedTransportType &&
          d.price <= tourPackagesPrice
      );
      console.log(filteredTourPackages);
      setTpData(filteredTourPackages);
      setTourPackages(
        paginate(filteredTourPackages, tourPackagePage, pageSize)
      );
    }
    // ---------------------- For Other's filters ---------------
    if (location !== "Select City...") {
      const filteredAccommodations = accommodationsData.filter(
        (d) =>
          d.city === location.toLowerCase() &&
          d.hotelRoomExpensePerPerson <= accommodationsPrice
      );
      const filteredTransports = transportsData.filter(
        (d) => d.city === location && d.seatPricePerPerson <= transportsPrice
      );
      const filteredRestaurants = restaurantsData.filter(
        (d) => d.city === location && d.averageFoodRate <= restaurantsPrice
      );

      setRData(filteredRestaurants);
      setRestaurants(paginate(filteredRestaurants, restaurantPage, pageSize));
      setTData(filteredTransports);
      setTransports(paginate(filteredTransports, transportPage, pageSize));
      setAData(filteredAccommodations);
      setAccommodations(
        paginate(filteredAccommodations, accommodationPage, pageSize)
      );
    } else {
      const filteredAccommodations = accommodationsData.filter(
        (d) => d.hotelRoomExpensePerPerson <= accommodationsPrice
      );
      const filteredTransports = transportsData.filter(
        (d) => d.seatPricePerPerson <= transportsPrice
      );
      const filteredRestaurants = restaurantsData.filter(
        (d) => d.averageFoodRate <= restaurantsPrice
      );

      setRData(filteredRestaurants);
      setRestaurants(paginate(filteredRestaurants, restaurantPage, pageSize));
      setTData(filteredTransports);
      setTransports(paginate(filteredTransports, transportPage, pageSize));
      setAData(filteredAccommodations);
      setAccommodations(
        paginate(filteredAccommodations, accommodationPage, pageSize)
      );
    }
    // ---------------------- For Transports -------------------
    if (
      selectedTransportType !== "Select Transport..." &&
      location !== "Select City..."
    ) {
      console.log("This is working");
      const filteredTransports = transportsData.filter(
        (d) =>
          d.city === location &&
          d.seatPricePerPerson <= transportsPrice &&
          d.transportType === selectedTransportType
      );
      setTData(filteredTransports);
      setTransports(paginate(filteredTransports, transportPage, pageSize));
    } else if (selectedTransportType !== "Select Transport...") {
      const filteredTransports = transportsData.filter(
        (d) =>
          d.seatPricePerPerson <= transportsPrice &&
          d.transportType === selectedTransportType
      );
      setTData(filteredTransports);
      setTransports(paginate(filteredTransports, transportPage, pageSize));
    } else if (location !== "Select City...") {
      const filteredTransports = transportsData.filter(
        (d) => d.city === location && d.seatPricePerPerson <= transportsPrice
      );
      setTData(filteredTransports);
      setTransports(paginate(filteredTransports, transportPage, pageSize));
    } else {
      const filteredTransports = transportsData.filter(
        (d) => d.seatPricePerPerson <= transportsPrice
      );
      setTData(filteredTransports);
      setTransports(paginate(filteredTransports, transportPage, pageSize));
    }
  };

  const getRating = async (id) => {
    let rating = 0;
    let numRatings = 0;
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/getServiceRatings",
        { serviceId: id }
      );
      const ratings = response.data;
      const sum = ratings.reduce((acc, rating) => acc + rating, 0);
      const average = sum / ratings.length;
      numRatings = ratings.length;
      rating = Math.floor(average);
      return { rating, numRatings };
    } catch (error) {
      console.error("Error fetching rating:", error);
      return { rating, numRatings }; // Return a default value in case of an error
    }
  };

  const getFavorite = async (id) => {
    try {
      const userResponse = await axios.post(
        "http://127.0.0.1:8000/findUserUsingEmail",
        { email: localStorage.getItem("currentUser") }
      );
      const userId = userResponse.data._id;
      const response = await axios.post("http://127.0.0.1:8000/getFavorites", {
        userId,
        serviceId: id,
      });
      if (response.data.length) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const handleFavorite = async (data, serviceType) => {
    const userResponse = await axios.post(
      "http://127.0.0.1:8000/findUserUsingEmail",
      { email: localStorage.getItem("currentUser") }
    );
    const userId = userResponse.data._id;
    const username = userResponse.data.username;
    const serviceId = data._id;
    const serviceName = data.name;
    const city = data.city || data.destination;
    const province = data.province;
    const country = data.country;
    try {
      await axios.post("http://127.0.0.1:8000/saveToFavorites", {
        userId,
        username,
        serviceId,
        city,
        province,
        country,
        serviceName,
        serviceType,
      });
      if (serviceType === "Restaurant") {
        setRestaurantFavorites((prevRatings) => {
          return { ...prevRatings, [data._id]: true };
        });
      }
      if (serviceType === "Tour Package") {
        setTourPackageFavorites((prevRatings) => {
          return { ...prevRatings, [data._id]: true };
        });
      }
      if (serviceType === "Accommodation") {
        setAccommodationFavorites((prevRatings) => {
          return { ...prevRatings, [data._id]: true };
        });
      }
      if (serviceType === "Transport") {
        setTransportFavorites((prevRatings) => {
          return { ...prevRatings, [data._id]: true };
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnFavorite = async (serviceId, serviceType) => {
    const userResponse = await axios.post(
      "http://127.0.0.1:8000/findUserUsingEmail",
      { email: localStorage.getItem("currentUser") }
    );
    const userId = userResponse.data._id;
    try {
      await axios.post("http://127.0.0.1:8000/unfavorite", {
        userId,
        serviceId,
      });
      if (serviceType === "Restaurant") {
        setRestaurantFavorites((prevRatings) => {
          return { ...prevRatings, [serviceId]: false };
        });
      }
      if (serviceType === "Tour Package") {
        setTourPackageFavorites((prevRatings) => {
          return { ...prevRatings, [serviceId]: false };
        });
      }
      if (serviceType === "Accommodation") {
        setAccommodationFavorites((prevRatings) => {
          return { ...prevRatings, [serviceId]: false };
        });
      }
      if (serviceType === "Transport") {
        setTransportFavorites((prevRatings) => {
          return { ...prevRatings, [serviceId]: false };
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Helper function to capitalize the first character
  const capitalizeFirstChar = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Layout>
      <div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              backgroundColor: "#143E56",
              width: "20%",
              marginTop: 58,
              marginLeft: "1%",
              borderRadius: 10,
              paddingTop: 50,
              paddingBottom: 50,
              paddingLeft: 20,
              paddingRight: 20,
              height: "0%",
            }}
          >
            {/* Filters */}
            <p style={{ fontWeight: "500" }}>Filters</p>
            <Text mt="10px">For Tour Packages</Text>
            {/* <div style={{ display: "flex" }}>
              <input
                id="tour_packages"
                type="checkbox"
                checked={isTourPackageVisible}
                onChange={() => setIsTourPackageVisible(!isTourPackageVisible)}
              />
              <label
                for="tour_packages"
                style={{ paddingLeft: 10, fontWeight: "300" }}
              >
                Tour Packages
              </label>
            </div>
            <div style={{ display: "flex" }}>
              <input
                id="transports"
                type="checkbox"
                checked={isTransportVisible}
                onChange={() => setIsTransportVisible(!isTransportVisible)}
              />
              <label
                for="transports"
                style={{ paddingLeft: 10, fontWeight: "300" }}
              >
                Transports
              </label>
            </div>
            <div style={{ display: "flex" }}>
              <input
                id="accommodations"
                type="checkbox"
                checked={isAccommodationVisible}
                onChange={() =>
                  setIsAccommodationVisible(!isAccommodationVisible)
                }
              />
              <label
                for="accommodations"
                style={{ paddingLeft: 10, fontWeight: "300" }}
              >
                Accommodations
              </label>
            </div>
            <div style={{ display: "flex" }}>
              <input
                id="restaurants"
                type="checkbox"
                checked={isRestaurantVisible}
                onChange={() => setIsRestaurantVisible(!isRestaurantVisible)}
              />
              <label
                for="restaurants"
                style={{ paddingLeft: 10, fontWeight: "300" }}
              >
                Restaurants
              </label>
            </div> */}
            {/* <div style={{ paddingTop: 10 }}>
              <p style={{ fontWeight: "500" }}>Price Range</p>
              <Slider
                aria-label="slider-ex-1"
                colorScheme="blue"
                defaultValue={30}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 10,
                  fontWeight: "bold",
                }}
              >
                <p>$50</p>
                <p>$1000+</p>
              </div>
            </div> */}
            <div>
              <p style={{ fontWeight: "500" }}>Departure City</p>
              <select
                style={{
                  backgroundColor: "#2A656D",
                  outline: "none",
                  width: "100%",
                  borderRadius: 10,
                  fontSize: 12,
                  paddingTop: 5,
                  paddingBottom: 5,
                }}
                value={selectedDepartureCity}
                onChange={(e) => setSelectedDepartureCity(e.target.value)}
              >
                <option value="Select City...">Select City...</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Peshawar">Peshawar</option>
              </select>
            </div>
            <div style={{ paddingTop: 10 }}>
              <p style={{ fontWeight: "500" }}>Destination City</p>
              <select
                style={{
                  backgroundColor: "#2A656D",
                  outline: "none",
                  width: "100%",
                  borderRadius: 10,
                  fontSize: 12,
                  paddingTop: 5,
                  paddingBottom: 5,
                }}
                value={selectedDestinationCity}
                onChange={(e) => setSelectedDestinationCity(e.target.value)}
              >
                <option value="Select City...">Select City...</option>
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Quetta">Quetta</option>
              </select>
            </div>
            <div style={{ paddingTop: 10 }}>
              <p style={{ fontWeight: "500" }}>Transport Type</p>
              <select
                style={{
                  backgroundColor: "#2A656D",
                  outline: "none",
                  width: "100%",
                  borderRadius: 10,
                  fontSize: 12,
                  paddingTop: 5,
                  paddingBottom: 5,
                }}
                value={selectedTransportType}
                onChange={(e) => setSelectedTransportType(e.target.value)}
              >
                <option value="Select Transport...">Select Transport...</option>
                <option value="Bus">Bus</option>
                <option value="Coach">Coach</option>
                <option value="Jeep">Jeep</option>
                <option value="SUV">SUV</option>
                <option value="Minivan">Minivan</option>
              </select>
              <Text fontSize="xs">* Will also work on Transports</Text>
            </div>
            <Text mt="10px">For others</Text>
            <div>
              <p style={{ fontWeight: "500" }}>Location</p>
              <select
                style={{
                  backgroundColor: "#2A656D",
                  outline: "none",
                  width: "100%",
                  borderRadius: 10,
                  fontSize: 12,
                  paddingTop: 5,
                  paddingBottom: 5,
                }}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="Select City...">Select City...</option>
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Quetta">Quetta</option>
              </select>
            </div>
            <VStack mt="10px" gap="0px" alignItems="flex-start">
              <Text fontWeight="500">Tour Packages Price</Text>
              <Slider
                id="slider"
                defaultValue={40000}
                min={20000} // Set the minimum value to 100
                max={150000} // Set the maximum value to 10000
                colorScheme="teal"
                onChange={(v) => setTourPackagesPrice(v)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <SliderMark value={20000} mt="1" fontSize="xs">
                  Rs.20000
                </SliderMark>
                <SliderMark value={150000} mt="1" ml="-14" fontSize="xs">
                  Rs.150000
                </SliderMark>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <Tooltip
                  hasArrow
                  bg="#2A656D"
                  color="white"
                  placement="top"
                  borderRadius="20px"
                  isOpen={showTooltip}
                  label={`Rs.${tourPackagesPrice}`}
                >
                  <SliderThumb />
                </Tooltip>
              </Slider>
            </VStack>
            <VStack mt="20px" gap="0px" alignItems="flex-start">
              <Text fontWeight="500">Accommodations Price</Text>
              <Slider
                id="slider"
                defaultValue={40000}
                min={10000} // Set the minimum value to 100
                max={100000} // Set the maximum value to 10000
                colorScheme="teal"
                onChange={(v) => setAccommodationsPrice(v)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <SliderMark value={10000} mt="1" fontSize="xs">
                  Rs.10000
                </SliderMark>

                <SliderMark value={100000} mt="1" ml="-14" fontSize="xs">
                  Rs.100000
                </SliderMark>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <Tooltip
                  hasArrow
                  bg="#2A656D"
                  color="white"
                  placement="top"
                  borderRadius="20px"
                  isOpen={showTooltip}
                  label={`Rs.${accommodationsPrice}`}
                >
                  <SliderThumb />
                </Tooltip>
              </Slider>
            </VStack>
            <VStack mt="20px" gap="0px" alignItems="flex-start">
              <Text fontWeight="500">Transports Price</Text>
              <Slider
                id="slider"
                defaultValue={10000}
                min={1000} // Set the minimum value to 100
                max={50000} // Set the maximum value to 10000
                colorScheme="teal"
                onChange={(v) => setTransportsPrice(v)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <SliderMark value={1000} mt="1" fontSize="xs">
                  Rs.1000
                </SliderMark>

                <SliderMark value={50000} mt="1" ml="-12" fontSize="xs">
                  Rs.50000
                </SliderMark>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <Tooltip
                  hasArrow
                  bg="#2A656D"
                  color="white"
                  placement="top"
                  borderRadius="20px"
                  isOpen={showTooltip}
                  label={`Rs.${transportsPrice}`}
                >
                  <SliderThumb />
                </Tooltip>
              </Slider>
            </VStack>
            <VStack mt="20px" gap="0px" alignItems="flex-start">
              <Text fontWeight="500">Restaurants Price</Text>
              <Slider
                id="slider"
                defaultValue={5000}
                min={1000} // Set the minimum value to 100
                max={10000} // Set the maximum value to 10000
                colorScheme="teal"
                onChange={(v) => setRestaurantsPrice(v)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <SliderMark value={1000} mt="1" fontSize="xs">
                  Rs.1000
                </SliderMark>
                <SliderMark value={10000} mt="1" ml="-12" fontSize="xs">
                  Rs.10000
                </SliderMark>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <Tooltip
                  hasArrow
                  bg="#2A656D"
                  color="white"
                  placement="top"
                  borderRadius="20px"
                  isOpen={showTooltip}
                  label={`Rs.${restaurantsPrice}`}
                >
                  <SliderThumb />
                </Tooltip>
              </Slider>
            </VStack>
            <Button
              mt="20px"
              bg="#2A656D"
              _hover={{ opacity: 0.5 }}
              color="white"
              size="sm"
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
          <div
            style={{
              width: "61%",
              paddingTop: 50,
              paddingBottom: 50,
              paddingLeft: 30,
              paddingRight: 30,
              backgroundColor: "#143E56",
              marginTop: 58,
              borderRadius: 10,
              marginLeft: "1%",
            }}
          >
            {search && <Text>Showing results for {search}</Text>}
            <Tabs
              key={tabIndex}
              defaultIndex={tabIndex}
              w="100%"
              isLazy
              variant="soft-rounded"
            >
              <TabList overflow="auto">
                <Tab
                  borderRadius="10px"
                  fontSize="sm"
                  _selected={{ bg: "#2A656D", color: "white" }}
                >
                  Tour Packages
                </Tab>
                <Tab
                  borderRadius="10px"
                  fontSize="sm"
                  _selected={{ bg: "#2A656D", color: "white" }}
                >
                  Accommodations
                </Tab>
                <Tab
                  borderRadius="10px"
                  fontSize="sm"
                  _selected={{ bg: "#2A656D", color: "white" }}
                >
                  Transports
                </Tab>
                <Tab
                  borderRadius="10px"
                  fontSize="sm"
                  _selected={{ bg: "#2A656D", color: "white" }}
                >
                  Restaurants
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {/* Tour packages section */}
                  <p style={{ fontWeight: "500" }}>
                    {tourPackages.length === 0
                      ? "No Tour Packages. Try increasing the price range."
                      : `Tour Packages ${
                          name ? "in " + capitalizeFirstChar(name) : ""
                        }`}
                  </p>
                  {tourPackages &&
                    tourPackages.map((tp, i) => (
                      <Box
                        key={tp._id + tp.name + tp.price}
                        style={{
                          paddingTop: 10,
                          paddingBottom: 10,
                          width: "100%",
                        }}
                        _hover={{ opacity: 0.8 }}
                        cursor="pointer"
                        onClick={() => {
                          localStorage.setItem(
                            "currentService",
                            JSON.stringify({
                              serviceId: tp._id,
                              serviceType: "Tour Package",
                              serviceName: tp.name,
                              service: tp,
                            })
                          );
                          router.push("../tourPackage");
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#2A656D",
                            borderRadius: 10,
                            display: "flex",
                            // alignItems: "center",
                          }}
                        >
                          <div>
                            <img
                              // src="/images/Murree.jpg"
                              style={{
                                height: "100%",
                                width: 210,
                                borderRadius: 10,
                              }}
                            />
                          </div>
                          <div>
                            <div style={{ padding: 10, fontSize: 12 }}>
                              <p>
                                <b>Company: </b>
                                {tp.businessName}
                              </p>
                              <p>
                                <b>Name: </b>
                                {tp.name}
                              </p>
                              <p>
                                <b>Destination: </b>
                                {capitalizeFirstChar(tp.destination) +
                                  ", " +
                                  capitalizeFirstChar(tp.city) +
                                  ", " +
                                  capitalizeFirstChar(tp.province)}
                              </p>
                              <p>
                                <b>Departure: </b>
                                {capitalizeFirstChar(tp.departureCity)}
                              </p>
                              <p>
                                <b>Price: </b>Rs.{tp.price}
                              </p>
                              <p>
                                <b>Transport Type: {tp.transportType}</b>
                              </p>
                              <p>
                                <b>Tour Duration</b> {tp.tourDuration}
                              </p>
                            </div>
                            <div style={{ flexDirection: "column" }}>
                              <div
                                style={{
                                  display: "flex",
                                  paddingLeft: 10,
                                  paddingBottom: 10,
                                  alignItems: "center",
                                }}
                              >
                                {[...Array(5)].map((_, index) => (
                                  <span
                                    key={index}
                                    className={
                                      tourPackageRatings[tp._id] &&
                                      index < tourPackageRatings[tp._id].rating
                                        ? "fa fa-star rated gold"
                                        : "fa fa-star not-rated"
                                    }
                                  ></span>
                                ))}
                                {tourPackageRatings[tp._id] && (
                                  <span
                                    style={{ marginLeft: 5, fontSize: "small" }}
                                  >
                                    ({tourPackageRatings[tp._id].numRatings}{" "}
                                    ratings)
                                  </span>
                                )}
                              </div>
                              {isLoggedIn && (
                                <div
                                  style={{
                                    display: "flex",
                                    paddingLeft: 10,
                                    paddingBottom: 10,
                                  }}
                                >
                                  <Box style={{ paddingRight: 10 }}>
                                    <Image
                                      _hover={{ opacity: 0.5 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (tourPackageFavorites[tp._id]) {
                                          handleUnFavorite(
                                            tp._id,
                                            "Tour Package"
                                          );
                                        } else {
                                          handleFavorite(tp, "Tour Package");
                                        }
                                      }}
                                      src={
                                        tourPackageFavorites[tp._id]
                                          ? "/images/heart-red.png"
                                          : "/images/heart.png"
                                      }
                                      style={{ height: 20, widht: 20 }}
                                    />
                                  </Box>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Box>
                    ))}
                  <div>
                    <Pagination
                      items={!tpData ? tourPackagesData.length : tpData.length} // 100
                      currentPage={tourPackagePage} // 1
                      pageSize={pageSize} // 10
                      onPageChange={(page) => setTourPackagePage(page)}
                    />
                  </div>
                </TabPanel>
                <TabPanel>
                  {/* Accommodations section */}
                  <p style={{ fontWeight: "500" }}>
                    {accommodations.length === 0
                      ? "No Accommodations. Try increasing the price range."
                      : "Accommodations"}
                  </p>
                  {accommodations &&
                    accommodations.map((a, i) => (
                      <Box
                        key={a.name + a.hotelRoomExpensePerPerson + a.city}
                        style={{
                          paddingTop: 10,
                          paddingBottom: 10,
                          width: "100%",
                          fontSize: 12,
                        }}
                        _hover={{ opacity: 0.8 }}
                        cursor="pointer"
                        onClick={() => {
                          localStorage.setItem(
                            "currentService",
                            JSON.stringify({
                              serviceId: a._id,
                              serviceType: "Accommodation",
                              serviceName: a.name,
                              service: a,
                            })
                          );
                          router.push("../accommodation");
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#2A656D",
                            borderRadius: 10,
                            display: "flex",
                            // alignItems: "center",
                          }}
                        >
                          <div>
                            <img
                              // src="/images/Murree.jpg"
                              style={{
                                height: "100%",
                                width: 210,
                                borderRadius: 10,
                              }}
                            />
                          </div>
                          <div>
                            <div style={{ padding: 10 }}>
                              <p style={{ fontWeight: "500" }}>{a.name}</p>
                              <p style={{ fontWeight: "500" }}>
                                Location:{" "}
                                {capitalizeFirstChar(a.city) +
                                  ", " +
                                  capitalizeFirstChar(a.province)}
                              </p>
                              <p style={{ fontWeight: "500" }}>
                                Room price per person: Rs.
                                {a.hotelRoomExpensePerPerson}
                              </p>
                            </div>
                            <div style={{ flexDirection: "column" }}>
                              <div
                                style={{
                                  display: "flex",
                                  paddingLeft: 10,
                                  paddingBottom: 10,
                                  alignItems: "center",
                                }}
                              >
                                {[...Array(5)].map((_, index) => (
                                  <span
                                    key={index}
                                    className={
                                      accommodationRatings[a._id] &&
                                      index < accommodationRatings[a._id].rating
                                        ? "fa fa-star rated gold"
                                        : "fa fa-star not-rated"
                                    }
                                  ></span>
                                ))}
                                {accommodationRatings[a._id] && (
                                  <span
                                    style={{ marginLeft: 5, fontSize: "small" }}
                                  >
                                    ({accommodationRatings[a._id].numRatings}{" "}
                                    ratings)
                                  </span>
                                )}
                              </div>
                              {isLoggedIn && (
                                <div
                                  style={{
                                    display: "flex",
                                    paddingLeft: 10,
                                    paddingBottom: 10,
                                  }}
                                >
                                  <Box style={{ paddingRight: 10 }}>
                                    <Image
                                      _hover={{ opacity: 0.5 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (accommodationFavorites[a._id]) {
                                          handleUnFavorite(
                                            a._id,
                                            "Accommodation"
                                          );
                                        } else {
                                          handleFavorite(a, "Accommodation");
                                        }
                                      }}
                                      src={
                                        accommodationFavorites[a._id]
                                          ? "/images/heart-red.png"
                                          : "/images/heart.png"
                                      }
                                      style={{ height: 20, widht: 20 }}
                                    />
                                  </Box>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Box>
                    ))}
                  <div>
                    <Pagination
                      items={!aData ? accommodationsData.length : aData.length} // 100
                      currentPage={accommodationPage} // 1
                      pageSize={pageSize} // 10
                      onPageChange={(page) => setAccommodationPage(page)}
                    />
                  </div>
                </TabPanel>
                <TabPanel>
                  {/* Transports section */}
                  <p style={{ fontWeight: "500" }}>
                    {transports.length == 0
                      ? "No Transports. Try increasing the price range."
                      : "Transports"}
                  </p>
                  {transports &&
                    transports.map((t, i) => (
                      <Box
                        key={t._id}
                        style={{
                          paddingTop: 10,
                          paddingBottom: 10,
                          width: "100%",
                          fontSize: 12,
                        }}
                        _hover={{ opacity: 0.8 }}
                        cursor="pointer"
                        onClick={() => {
                          localStorage.setItem(
                            "currentService",
                            JSON.stringify({
                              serviceId: t._id,
                              serviceType: "Transport",
                              serviceName: t.name,
                              service: t,
                            })
                          );
                          router.push("../transport");
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#2A656D",
                            borderRadius: 10,
                            display: "flex",
                            // alignItems: "center",
                          }}
                        >
                          <div>
                            <img
                              // src="/images/Murree.jpg"
                              style={{
                                height: "100%",
                                width: 210,
                                borderRadius: 10,
                              }}
                            />
                          </div>
                          <div>
                            <div style={{ padding: 10 }}>
                              <p style={{ fontWeight: "500" }}>{t.name}</p>
                              <p style={{ fontWeight: "500" }}>
                                Location: {t.city + ", " + t.province}
                              </p>
                              <p style={{ fontWeight: "500" }}>
                                Transport Type: {t.transportType}
                              </p>
                              <p style={{ fontWeight: "500" }}>
                                Seat price per person: Rs.{t.seatPricePerPerson}
                              </p>
                            </div>
                            <div style={{ flexDirection: "column" }}>
                              <div
                                style={{
                                  display: "flex",
                                  paddingLeft: 10,
                                  paddingBottom: 10,
                                  alignItems: "center",
                                }}
                              >
                                {[...Array(5)].map((_, index) => (
                                  <span
                                    key={index}
                                    className={
                                      transportRatings[t._id] &&
                                      index < transportRatings[t._id].rating
                                        ? "fa fa-star rated gold"
                                        : "fa fa-star not-rated"
                                    }
                                  ></span>
                                ))}
                                {transportRatings[t._id] && (
                                  <span style={{ marginLeft: 5 }}>
                                    ({transportRatings[t._id].numRatings}{" "}
                                    ratings)
                                  </span>
                                )}
                              </div>
                              {isLoggedIn && (
                                <div
                                  style={{
                                    display: "flex",
                                    paddingLeft: 10,
                                    paddingBottom: 10,
                                  }}
                                >
                                  <Box style={{ paddingRight: 10 }}>
                                    <Image
                                      _hover={{ opacity: 0.5 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (transportFavorites[t._id]) {
                                          handleUnFavorite(t._id, "Transport");
                                        } else {
                                          handleFavorite(t, "Transport");
                                        }
                                      }}
                                      src={
                                        transportFavorites[t._id]
                                          ? "/images/heart-red.png"
                                          : "/images/heart.png"
                                      }
                                      style={{ height: 20, widht: 20 }}
                                    />
                                  </Box>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Box>
                    ))}
                  <div>
                    {isTransportVisible && (
                      <Pagination
                        items={!tData ? transportsData.length : tData.length} // 100
                        currentPage={transportPage} // 1
                        pageSize={pageSize} // 10
                        onPageChange={(page) => setTransportPage(page)}
                      />
                    )}
                  </div>
                </TabPanel>
                <TabPanel>
                  {/* Restaurants section */}
                  <p style={{ fontWeight: "500" }}>
                    {restaurants.length === 0
                      ? "No Restaurants. Try increasing the price range."
                      : "Restaurants"}
                  </p>
                  {restaurants &&
                    restaurants.map((r, i) => (
                      <Box
                        key={r._id}
                        style={{
                          paddingTop: 10,
                          paddingBottom: 10,
                          width: "100%",
                          fontSize: 12,
                        }}
                        _hover={{ opacity: 0.8 }}
                        cursor="pointer"
                        onClick={() => {
                          localStorage.setItem(
                            "currentService",
                            JSON.stringify({
                              serviceId: r._id,
                              serviceType: "Restaurant",
                              serviceName: r.name,
                              service: r,
                            })
                          );
                          router.push("../restaurant");
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#2A656D",
                            borderRadius: 10,
                            display: "flex",
                            // alignItems: "center",
                          }}
                        >
                          <div>
                            <img
                              // src="/images/Murree.jpg"
                              style={{
                                height: "100%",
                                width: 210,
                                borderRadius: 10,
                              }}
                            />
                          </div>
                          <div>
                            <div style={{ padding: 10 }}>
                              <p style={{ fontWeight: "500" }}>{r.name}</p>
                              <p style={{ fontWeight: "500" }}>
                                Location: {r.city + ", " + r.province}
                              </p>
                              <p style={{ fontWeight: "500" }}>
                                Average Food Rate: Rs.{r.averageFoodRate}
                              </p>
                            </div>
                            <div style={{ flexDirection: "column" }}>
                              <div
                                style={{
                                  display: "flex",
                                  paddingLeft: 10,
                                  paddingBottom: 10,
                                  alignItems: "center",
                                }}
                              >
                                {[...Array(5)].map((_, index) => (
                                  <span
                                    key={index}
                                    className={
                                      restaurantRatings[r._id] &&
                                      index < restaurantRatings[r._id].rating
                                        ? "fa fa-star rated gold"
                                        : "fa fa-star not-rated"
                                    }
                                  ></span>
                                ))}
                                {restaurantRatings[r._id] && (
                                  <span
                                    style={{ marginLeft: 5, fontSize: "small" }}
                                  >
                                    ({restaurantRatings[r._id].numRatings}{" "}
                                    ratings)
                                  </span>
                                )}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  paddingLeft: 10,
                                  paddingBottom: 10,
                                }}
                              >
                                {isLoggedIn && (
                                  <Box style={{ paddingRight: 10 }}>
                                    <Image
                                      _hover={{ opacity: 0.5 }}
                                      onClick={() => {
                                        if (restaurantFavorites[r._id]) {
                                          handleUnFavorite(r._id, "Restaurant");
                                        } else {
                                          handleFavorite(r, "Restaurant");
                                        }
                                      }}
                                      src={
                                        restaurantFavorites[r._id]
                                          ? "/images/heart-red.png"
                                          : "/images/heart.png"
                                      }
                                      style={{ height: 20, widht: 20 }}
                                    />
                                  </Box>
                                )}

                                {/* <div style={{ paddingRight: 10 }}>
                            <img
                              src="/images/shopping-cart.png"
                              style={{ height: 20, widht: 20 }}
                            />
                          </div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Box>
                    ))}
                  <div>
                    {isRestaurantVisible && (
                      <Pagination
                        items={!rData ? restaurantsData.length : rData.length} // 100
                        currentPage={restaurantPage} // 1
                        pageSize={pageSize} // 10
                        onPageChange={(page) => setRestaurantPage(page)}
                      />
                    )}
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const tpResponse = await axios.get("http://127.0.0.1:8000/tourpackages");
  const restaurantResponse = await axios.get(
    "http://127.0.0.1:8000/restaurants"
  );
  const transportResponse = await axios.get("http://127.0.0.1:8000/transports");
  const accommodationResponse = await axios.get(
    "http://127.0.0.1:8000/accommodations"
  );

  const restaurantsData = restaurantResponse.data;
  const transportsData = transportResponse.data;
  const accommodationsData = accommodationResponse.data;
  const tourPackagesData = tpResponse.data;

  return {
    props: {
      tourPackagesData,
      transportsData,
      accommodationsData,
      restaurantsData,
    },
  };
};
