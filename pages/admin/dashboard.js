import axios from "axios";
import { useState, useEffect } from "react";
import Layout from "../../components/adminLayout";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryLine,
  VictoryScatter,
} from "victory";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faB,
  faBed,
  faBuilding,
  faClipboard,
  faPerson,
  faBus,
} from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  const [requestData, setRequestData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [pendingAccommodations, setPendingAccommodations] = useState(0);
  const [pendingRestaurants, setPendingRestaurants] = useState(0);
  const [pendingTransports, setPendingTransports] = useState(0);
  const [pendingTourPackages, setPendingTourPackages] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        const r = await axios.get(
          "http://127.0.0.1:8000/getPendingRestaurants"
        );
        const tp = await axios.get(
          "http://127.0.0.1:8000/getPendingTourPackages"
        );
        const t = await axios.get("http://127.0.0.1:8000/getPendingTransports");
        const a = await axios.get(
          "http://127.0.0.1:8000/getPendingAccommodations"
        );
        setPendingRestaurants(r.data.length);
        setPendingTourPackages(tp.data.length);
        setPendingTransports(t.data.length);
        setPendingAccommodations(a.data.length);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  // pending -sum data-smaple data
  let accommodationpending = 15;
  let restaurantpending = 15;
  let transportpending = 15;
  let guidepending = 15;
  let tourpackagespending = 10;

  const options = {
    scales: {
      x: {
        grid: {
          display: false, // Disable vertical grid lines
        },
      },
      y: {
        grid: {
          display: false, // Enable horizontal grid lines
        },
        ticks: {
          stepSize: 1, // Set step size to 1
        },
      },
    },
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/getRequestCounts")
      .then((response) => {
        const { pendingData, approvedData } = response.data;

        const chartData = {
          labels: approvedData.map((item) => convertMonth(item.x)), // Assuming both pending and approved data have the same labels
          datasets: [
            {
              label: "Pending Requests",
              data: pendingData.map((item) => item.y),
              backgroundColor: "rgba(54, 162, 235, 0.5)",
            },
            {
              label: "Approved Requests",
              data: approvedData.map((item) => item.y),
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        };
        setRequestData(chartData);
      })
      .catch((error) => {
        console.error("Error fetching request counts:", error);
      });

    axios
      .get("http://127.0.0.1:8000/getCustomerCounts")
      .then((response) => {
        const customerCounts = response.data;
        setCustomerData(customerCounts);
      })
      .catch((error) => {
        console.error("Error fetching customer counts:", error);
      });

    axios
      .get("http://127.0.0.1:8000/getReviews")
      .then((response) => {
        const reviewsResponse = response.data;
        // Take any three reviews
        const limitedReviews = reviewsResponse.slice(0, 3);
        setReviews(limitedReviews);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, []);

  // Function to convert month-year string to month name
  const convertMonth = (monthYearString) => {
    const [year, month] = monthYearString.split("-");
    const monthIndex = parseInt(month) - 1; // Subtracting 1 because month index starts from 0
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${monthNames[monthIndex]} ${year}`;
  };

  return (
    <Layout>
      <div className="main-dashboard">
        <div className="business-reports">
          <h5 className="heading">Business Accounts Status </h5>
          <div className="parent-business">
            <div className="graph-parent">
              <div className="graph-one">
                {requestData ? (
                  <Bar
                    options={options}
                    data={requestData}
                    width={600}
                    height={400}
                  />
                ) : (
                  <p>Loading...</p>
                )}
              </div>
              <div className="heading-div">
                <h5 className="heading">Monthly Customer Counts </h5>
              </div>
              <div className="graph-two">
                {customerData ? (
                  <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={20}
                    width={600}
                    height={400}
                  >
                    <VictoryAxis
                      tickFormat={(x) => convertMonth(x)} // Format month-year label
                      style={{
                        tickLabels: { angle: 0, fontSize: 10 }, // Rotate labels for better readability
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      tickFormat={(y) => y} // Show integer values on the y-axis
                    />
                    {customerData.length > 1 ? (
                      <VictoryLine
                        style={{
                          data: {
                            stroke: "#c43a31",
                            strokeWidth: ({ data }) => data.length,
                          },
                        }}
                        data={customerData}
                      />
                    ) : (
                      <VictoryScatter
                        data={customerData}
                        x="x"
                        y="y"
                        size={5} // Adjust the size of the point
                        style={{ data: { fill: "tomato" } }} // Adjust the color of the point
                      />
                    )}
                  </VictoryChart>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
            <div className="other-graph-half">
              <div className="pending-data">
                <div className="data">
                  <div className="icon">
                    <FontAwesomeIcon icon={faBed} className="input-icon" />
                  </div>
                  <div className="data">
                    <span className="data-number">
                      {pendingAccommodations} pending accommodation request
                    </span>
                  </div>
                </div>
                <div className="data">
                  <div className="icon">
                    <FontAwesomeIcon icon={faBuilding} className="input-icon" />
                  </div>
                  <div className="data">
                    <span className="data-number">
                      {pendingRestaurants} pending restaurant request
                    </span>
                  </div>
                </div>
                <div className="data">
                  <div className="icon">
                    <FontAwesomeIcon
                      icon={faClipboard}
                      className="input-icon"
                    />
                  </div>
                  <div className="data">
                    <span className="data-number">
                      {pendingTourPackages} pending tour packages requests
                    </span>
                  </div>
                </div>
                <div className="data">
                  <div className="icon">
                    <FontAwesomeIcon icon={faBus} className="input-icon" />
                  </div>
                  <div className="data">
                    <span className="data-number">
                      {pendingTransports} pending transport requests
                    </span>
                  </div>
                </div>
              </div>
              <div className="customer-reviews">
                <h5 className="heading">Customer Reviews on Services</h5>
                <div className="review-list">
                  {reviews.length > 0 ? (
                    <div className="review">
                      {reviews.map((review, index) => (
                        <div className="review-link" key={index}>
                          <div>
                            <div className="rating-stars">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={
                                    i < review.rating
                                      ? "star-yellow"
                                      : "star-grey"
                                  }
                                >
                                  &#9733;
                                </span>
                              ))}
                            </div>
                            <span className="comment">{review.comment}</span>
                            <a href="/admin/serviceReviews" className="link">
                              Read More &#8594;
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No reviews available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
