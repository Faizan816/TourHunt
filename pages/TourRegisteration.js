import Layout from "../components/layout";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faUser,
  faHotel,
  faBed,
  faCar,
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

export default function TourRegisteration() {
  const [packagename, setPackageName] = useState("");
  const [hotelname, setHotelName] = useState("");
  const [hotelperson, setHotelPerson] = useState(0);
  const [transportname, setTransportName] = useState("");
  const [transportExpense, setTransportExpense] = useState(0);
  const [price, setPrice] = useState(0);
  const [destination, setDestination] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("");
  const [departure, setDepartureCity] = useState("");
  const [departuredate, setDepartureDate] = useState("");
  const [Arrivaledate, setArrivalDate] = useState("");
  const [breakfast, setBreakfast] = useState("");
  const [lunch, setLunch] = useState("");
  const [dinner, setdinner] = useState("");
  const [foodprice, setFoodPrice] = useState(0);
  const [transporttype, setTransportType] = useState("");

  let packageerrorText;
  let hotelerrorText;
  let HpersonerrorText;
  let TransExpenseText;
  let TransportText;
  let priceText;
  let destinationErrorText;
  let cityErrorText;
  let provinceErrorText;
  let countryErrorText;
  let departureErrorText;
  let breakfastErrorText;
  let lunchErrorText;
  let DinnerText;
  let foodPriceText;

  let invalid = false;
  let regExp = /[0-9]/;
  let priceExp = /[a-zA-z$@%&^*!]/;
  if (regExp.test(packagename)) {
    packageerrorText = "kindly write name in english letters!.";
  }
  if (regExp.test(hotelname)) {
    hotelerrorText = "kindly write name in english letters!.";
  }
  if (regExp.test(transportname)) {
    TransportText = "kindly write name in english letters!.";
  }
  if (regExp.test(destination)) {
    destinationErrorText = "kindly write name in english letters!.";
  }
  if (regExp.test(city)) {
    cityErrorText = "kindly write name in english letters!.";
  }
  if (regExp.test(province)) {
    provinceErrorText = "kindly write name in english letters!.";
  }
  if (regExp.test(country)) {
    countryErrorText = "kindly write name in english letters!.";
  }
  if (regExp.test(departure)) {
    departureErrorText = "kindly write name in english letters!.";
  }
  if (regExp.test(breakfast)) {
    breakfastErrorText = "kindly write name in english letters!.";
  }
  if (regExp.test(lunch)) {
    lunchErrorText = "kindly write name in english letters!.";
  }
  if (regExp.test(dinner)) {
    DinnerText = "kindly write name in english letters!.";
  }

  if (priceExp.test(hotelperson)) {
    HpersonerrorText = "kindly write numbers!.";
  }
  if (priceExp.test(transportExpense)) {
    TransExpenseText = "kindly write numbers!.";
  }
  if (priceExp.test(price)) {
    priceText = "kindly write numbers!.";
  }
  if (priceExp.test(foodprice)) {
    foodPriceText = "kindly write numbers!.";
  }

  function submit(event) {
    event.preventDefault();

    if (
      !packagename ||
      !hotelname ||
      !hotelperson ||
      !transportname ||
      !transportExpense ||
      !destination ||
      !province ||
      !country ||
      !departure ||
      !breakfast ||
      !city ||
      !lunch ||
      !dinner ||
      !foodprice ||
      !transporttype
    ) {
      alert("Please fill in all the fields!");
      return;
    }
    alert("You will be notified for further actvites");
    console.log(packagename);
    console.log(hotelname);
    console.log(hotelperson);
    console.log(transportname);
    console.log(transportExpense);
    console.log(
      parseFloat(hotelperson) +
        parseFloat(foodprice) +
        parseFloat(transportExpense)
    );
    console.log(destination);
    console.log(city);
    console.log(province);
    console.log(country);
    console.log(departure);
    console.log(departuredate);
    console.log(Arrivaledate);
    console.log(breakfast);
    console.log(lunch);
    console.log(dinner);
    console.log(foodprice);
    console.log(transporttype);

    const registerTour = async () => {
      await axios.post("http://127.0.0.1:8000/registerTourPackage", {
        name: packagename,
        city: city,
        hotelCompanyName: hotelname,
        hotelRoomExpensePerPerson: hotelperson,
        transportCompanyName: transportname,
        transportExpensePerPerson: transportExpense,
        price:
          parseFloat(hotelperson) +
          parseFloat(foodprice) +
          parseFloat(transportExpense),
        destination: destination,
        country: country,
        province: province,
        departureCity: departure,
        departureDate: departuredate,
        arrivalDate: Arrivaledate,
        breakfast: breakfast,
        lunch: lunch,
        dinner: dinner,
        foodPrice: foodprice,
        transportType: transporttype,
        status: "pending",
      });
    };
    registerTour();
  }

  return (
    <Layout>
      <section className="package">
        <div className="container">
          <div className="background">
            <div className="heading-div">
              <h4 className="heading">Tour Package Regitseration Form</h4>
            </div>
            <form>
              <div className="form_div">
                <div className="name-div">
                  <label htmlFor="name" className="name-label">
                    Name
                  </label>
                  <div className="input-container">
                    <input
                      type="name"
                      className="name"
                      value={packagename}
                      onChange={(e) => {
                        setPackageName(e.target.value);
                      }}
                    />
                    <FontAwesomeIcon icon={faUser} className="input-icon" />
                  </div>
                  <p className="errorstyle">{packageerrorText}</p>
                </div>

                <div className="sec-name_div">
                  <label htmlFor="name" className="name-label">
                    Hotel Company Name
                  </label>
                  <div className="input-container">
                    <input
                      type="hotelname"
                      className="name"
                      value={hotelname}
                      onChange={(e) => {
                        setHotelName(e.target.value);
                      }}
                    />
                    <FontAwesomeIcon icon={faHotel} className="input-icon" />
                  </div>
                  <p className="errorstyle">{hotelerrorText}</p>
                </div>
              </div>

              <div className="form_div">
                <div className="name-div expense-div">
                  <label htmlFor="name" className="name-label">
                    Hotel Room Expense Per Person
                  </label>
                  <label htmlFor="name" className="rate-label">
                    Kindly enter rate for a person in dollars ($)
                  </label>
                  <div className="input-container">
                    <input
                      type="name"
                      className="name"
                      value={hotelperson}
                      onChange={(e) => {
                        setHotelPerson(e.target.value);
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faMoneyBill}
                      className="input-icon"
                    />
                  </div>
                  <p className="errorstyle">{HpersonerrorText}</p>
                </div>

                <div className="sec-name_div margin_div">
                  <label htmlFor="name" className="trasnport-label">
                    Transport Company Name
                  </label>
                  <div className="input-container">
                    <input
                      type="name"
                      className="name"
                      value={transportname}
                      onChange={(e) => {
                        setTransportName(e.target.value);
                      }}
                    />
                    <FontAwesomeIcon icon={faCar} className="input-icon" />
                  </div>
                  <p className="errorstyle">{TransportText}</p>
                </div>
              </div>

              <div className="form_div">
                <div className="name-div expense-div">
                  <label htmlFor="name" className="name-label">
                    Transport Expense Per Person
                  </label>
                  <label htmlFor="name" className="rate-label">
                    Kindly enter rate for person in dollar ($)
                  </label>
                  <div className="input-container">
                    <input
                      type="name"
                      className="name"
                      value={transportExpense}
                      onChange={(e) => {
                        setTransportExpense(e.target.value);
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faMoneyBill}
                      className="input-icon"
                    />
                  </div>
                  <p className="errorstyle">{TransExpenseText}</p>
                </div>

                <div className="sec-name_div expense-div">
                  <label htmlFor="name" className="transport-label">
                    Price
                  </label>
                  <label htmlFor="name" className="rate-label">
                    Kindly enter rate with currency ($ price)
                  </label>
                  <div className="input-container">
                    <input
                      disabled
                      type="name"
                      className="name"
                      value={
                        parseFloat(hotelperson) +
                        parseFloat(foodprice) +
                        parseFloat(transportExpense)
                      }
                      onChange={(e) => {
                        setPrice(e.target.value);
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faMoneyCheckDollar}
                      className="input-icon"
                    />
                  </div>
                  <p className="errorstyle">{priceText}</p>
                </div>
              </div>

              <div className="form_div">
                <div className="name-div">
                  <label htmlFor="name" className="name-label">
                    Destination
                  </label>
                  <div className="input-container">
                    <input
                      type="name"
                      className="name"
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="input-icon"
                    />
                  </div>
                  <p className="errorstyle">{destinationErrorText}</p>
                </div>
                <div className="sec-name_div">
                  <label htmlFor="name" className="transport-label">
                    City
                  </label>
                  <div className="input-container">
                    <input
                      type="name"
                      className="name"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                      }}
                    />
                    <FontAwesomeIcon icon={faCity} className="input-icon" />
                  </div>
                  <p className="errorstyle">{cityErrorText}</p>
                </div>
              </div>

              <div className="form_div">
                <div className="name-div">
                  <label htmlFor="name" className="name-label">
                    Province
                  </label>
                  <div className="input-container">
                    <input
                      type="name"
                      className="name"
                      value={province}
                      onChange={(e) => {
                        setProvince(e.target.value);
                      }}
                    />
                    <FontAwesomeIcon icon={faGlobe} className="input-icon" />
                  </div>
                  <p className="errorstyle">{provinceErrorText}</p>
                </div>

                <div className="sec-name_div">
                  <label htmlFor="name" className="name-label">
                    Country
                  </label>
                  <div className="input-container">
                    <input
                      type="name"
                      className="name"
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faEarthAmericas}
                      className="input-icon"
                    />
                  </div>
                  <p className="errorstyle">{countryErrorText}</p>
                </div>
              </div>

              <div className="form_div ">
                <div className="sec-name_div">
                  <label htmlFor="name" className="transport-label">
                    Departure City
                  </label>
                  <div className="input-container">
                    <input
                      type="name"
                      className="name"
                      value={departure}
                      onChange={(e) => {
                        setDepartureCity(e.target.value);
                      }}
                    />
                    <FontAwesomeIcon icon={faCity} className="input-icon" />
                  </div>
                  <p className="errorstyle">{departureErrorText}</p>
                </div>

                <div className="sec-name_div expense-div">
                  <label htmlFor="name" className="trasnport-label">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    className="name"
                    value={departuredate}
                    onChange={(e) => {
                      setDepartureDate(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="form_div ">
                <div className="sec-name_div expense-div">
                  <label htmlFor="name" className="trasnport-label">
                    Arrival Date
                  </label>
                  <input
                    type="date"
                    className="name"
                    value={Arrivaledate}
                    onChange={(e) => {
                      setArrivalDate(e.target.value);
                    }}
                  />
                </div>

                <div className="name-div">
                  <label htmlFor="name" className="name-label">
                    Breakfast
                  </label>
                  <div className="input-container">
                    <input
                      type="name"
                      className="name"
                      value={breakfast}
                      onChange={(e) => {
                        setBreakfast(e.target.value);
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faMugSaucer}
                      className="input-icon"
                    />
                  </div>
                  <p className="errorstyle">{breakfastErrorText}</p>
                </div>
              </div>

              <div className="form_div">
                <div className="name-div">
                  <label htmlFor="name" className="name-label">
                    Lunch
                  </label>
                  <div className="input-container">
                    <input
                      type="name"
                      className="name"
                      value={lunch}
                      onChange={(e) => {
                        setLunch(e.target.value);
                      }}
                    />
                    <FontAwesomeIcon icon={faBowlFood} className="input-icon" />
                  </div>
                  <p className="errorstyle">{lunchErrorText}</p>
                </div>

                <div className="sec-name_div">
                  <label htmlFor="name" className="name-label">
                    Dinner
                  </label>
                  <div className="input-container">
                    <input
                      type="name"
                      className="name"
                      value={dinner}
                      onChange={(e) => {
                        setdinner(e.target.value);
                      }}
                    />
                    <FontAwesomeIcon icon={faUtensils} className="input-icon" />
                  </div>
                  <p className="errorstyle">{DinnerText}</p>
                </div>
              </div>

              <div className="form_div ">
                <div className="sec-name_div expense-div">
                  <label htmlFor="name" className="trasnport-label">
                    Food Price
                  </label>
                  <label htmlFor="name" className="rate-label">
                    Kindly enter price for the food in dollars ($)
                  </label>
                  <div className="input-container">
                    <input
                      type="name"
                      className="name"
                      value={foodprice}
                      onChange={(e) => {
                        setFoodPrice(e.target.value);
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faMoneyCheckDollar}
                      className="input-icon"
                    />
                  </div>
                  <p className="errorstyle">{foodPriceText}</p>
                </div>

                <div className="name-div">
                  <label htmlFor="name" className="name-label">
                    Transport Type
                  </label>
                  <select
                    className="dropdown-btn"
                    value={transporttype}
                    onChange={(e) => {
                      setTransportType(e.target.value);
                    }}
                  >
                    <option disabled hidden value="" className="list slected">
                      Select one from below
                    </option>
                    <option value="car" className="list">
                      Car
                    </option>
                    <option value="bus" className="list">
                      Bus
                    </option>
                    <option value="cruise" className="list">
                      Cruise
                    </option>
                  </select>
                </div>
              </div>

              <div className="button-div">
                <button className="register" onClick={submit}>
                  {" "}
                  Register{" "}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
