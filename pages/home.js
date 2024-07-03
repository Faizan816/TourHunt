import React from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa"; // Import arrow icon
import Layout from "../components/layout";
import { useRouter } from "next/router";
import { Image } from "@chakra-ui/react";

const columnData = [
  {
    logoSrc: "./images/tourism.png",
    text: "Planned Tours",
    buttonLink: "../results",
    buttonText: "LEARN MORE",
  },
  {
    logoSrc: "./images/community.png",
    text: "Start Your Community?",
    buttonLink: "../community/community",
    buttonText: "LEARN MORE",
  },
  {
    logoSrc: "./images/suggestion.png",
    text: "Need Suggestions?",
    buttonLink: "../customer/suggestions",
    buttonText: "LEARN MORE",
  },
];

const statisticsData = {
  restaurants: 1200,
  hotels: 800,
  guides: 300,
  transport: 500,
};

const HomePage = () => {
  const router = useRouter();

  return (
    <Layout>
      <div className="home" style={{ backgroundColor: "white" }}>
        {/* Single Image Section */}
        <div
          className="imageCard"
          style={{ position: "relative", textAlign: "center" }}
        >
          <img
            src="./images/big1.jpg"
            alt="Large Image"
            style={{ filter: "brightness(40%)", height: "650px" }}
          />{" "}
          {/* Apply brightness filter */}
          <div
            className="imageText"
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <h4 className="imageHeadingMedium">Open Your Eyes To</h4>
            <h2 className="imageHeadingLarge">THE HIDDEN WORLD</h2>
            <h7 className="imageHeadingSmall">
              Whether you're dreaming of far-off destinations or planning your
              next getaway, TOUR HUNT is your trusted companion every step of
              the way. Join us on an unforgettable journey of discovery,
              adventure, and exploration.{" "}
            </h7>
            <button
              style={{
                backgroundColor: "#FFA500",
                color: "white",
                left: "40%",
                marginTop: "30px",
              }}
              className={"button"}
              onClick={() => {
                router.push("../results"); // Correct route path for Next.js routing
              }}
            >
              START TOUR
            </button>
          </div>
          {/* Four Columns Row */}
          <div
            className="fourColumnsRow"
            style={{
              position: "absolute",
              bottom: "0",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            <div
              className="row"
              style={{ textAlign: "center", margin: "0 5px" }}
            >
              <a
                onClick={() =>
                  router.push({
                    pathname: "../results",
                    query: { service: "restaurant" },
                  })
                }
                className="link"
                style={{
                  color: "black",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src="./images/restaurant (1).png"
                  alt="Image 1"
                  style={{
                    width: "70px",
                    transition: "transform 0.2s",
                    cursor: "pointer",
                  }}
                />
                <p
                  style={{
                    color: "white",
                    marginBottom: "5px",
                    transition: "color 0.2s",
                  }}
                >
                  Restaurants
                </p>
              </a>
            </div>
            <div
              className="row"
              style={{
                textAlign: "center",
                margin: "0 5px",
              }}
            >
              <a
                onClick={() =>
                  router.push({
                    pathname: "../results",
                    query: { service: "accommodation" },
                  })
                }
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                className="link"
              >
                <img
                  src="./images/hotell.png"
                  alt="Image 2"
                  style={{
                    width: "70px",
                    transition: "transform 0.2s",
                    cursor: "pointer",
                  }}
                />
                <p
                  style={{
                    color: "white",
                    marginBottom: "5px",
                    transition: "color 0.2s",
                  }}
                >
                  Accommodations
                </p>
              </a>
            </div>
            {/* <div
              className="row"
              style={{ textAlign: "center", margin: "0 5px" }}
            >
              <a
                onClick={() =>
                  router.push({
                    pathname: "../results",
                    query: { service: "guide" },
                  })
                }
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                href="/guides"
                className="link"
              >
                <img
                  src="./images/tour-guide.png"
                  alt="Image 3"
                  style={{
                    width: "70px",
                    transition: "transform 0.2s",
                    cursor: "pointer",
                  }}
                />
                <p
                  style={{
                    color: "white",
                    marginBottom: "5px",
                    transition: "color 0.2s",
                  }}
                >
                  Guides
                </p>
              </a>
            </div> */}
            <div
              className="row"
              style={{ textAlign: "center", margin: "0 5px" }}
            >
              <a
                onClick={() =>
                  router.push({
                    pathname: "../results",
                    query: { service: "transport" },
                  })
                }
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                className="link"
              >
                <img
                  src="./images/bus (1).png"
                  alt="Image 4"
                  style={{
                    width: "70px",
                    transition: "transform 0.2s",
                    cursor: "pointer",
                  }}
                />
                <p
                  style={{
                    color: "white",
                    marginBottom: "5px",
                    transition: "color 0.2s",
                  }}
                >
                  Transport
                </p>
              </a>
            </div>
          </div>
          <style jsx>{`
            .home {
              /* Your home styles */
            }

            .link:hover p {
              color: #ffa500 !important;
            }

            .link:hover img {
              transform: scale(1.1);
            }
          `}</style>
        </div>

        <div
          className="section"
          style={{ padding: "25px 90px", color: "black" }}
        >
          <h4>
            <b>
              <i>How Tour Hunt Works</i>
            </b>
          </h4>
          <hr className="solid" style={{ borderColor: "black" }} />
          <div className="columns">
            {columnData.map((column, index) => (
              <div
                key={index}
                className="column"
                style={{
                  padding: "25px",
                  textAlign: "center",
                  border: "2px solid black",
                }}
              >
                <img
                  src={column.logoSrc}
                  alt={`Logo ${index + 1}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    marginBottom: "5px",
                  }}
                />
                <p style={{ fontSize: "20px", lineHeight: "1.3" }}>
                  {column.text}
                </p>
                <Link href={column.buttonLink} passHref>
                  <div
                    className="button"
                    style={{
                      fontSize: "18px",
                      marginTop: "10px",
                      color: "black",
                      borderColor: "black",
                    }}
                  >
                    {column.buttonText}
                    <FaArrowRight
                      className="arrowIcon"
                      style={{ marginLeft: "5px", verticalAlign: "middle" }}
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div
          className="videoSection"
          style={{
            display: "flex",
            backgroundColor: "#EBEBEB",
            alignItems: "center",
            justifyContent: "center",
            padding: "50px",
          }}
        >
          <div className="videoContainer" style={{ width: "50%" }}>
            <Image
              borderRadius="10px"
              src="/images/destinations.webp"
              width="100%"
              height="300"
            />
          </div>
          <div
            className="textBox"
            style={{ width: "50%", paddingLeft: "50px" }}
          >
            <h3 style={{ color: "#FFA500" }}>D E S T I N A T I O N S</h3>
            <p style={{ fontSize: "20px", lineHeight: "1.5", color: "black" }}>
              "Embark on a journey of discovery and adventure with our website
              as your trusted companion, guiding you through breathtaking
              destinations and unique experiences.Let the hidden gems of the
              world unfold before your eyes as you explore with our website,
              creating unforgettable memories at every step."
            </p>
          </div>
        </div>

        <div className="customColumnsSection" style={{ padding: "80px" }}>
          <div
            style={{
              color: "black",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            <h4 style={{ marginBottom: "10px" }}>
              <b>WHERE TO GO</b>
            </h4>
            <hr
              className="solid"
              style={{
                borderColor: "black",
                width: "25%",
                marginBottom: "10px",
              }}
            />
            <h6 style={{ color: "black" }}>
              <i>These are some popular places in Pakistan worth visiting</i>
            </h6>
          </div>
          <div
            className="customColumn"
            style={{
              flexBasis: "33.33%",
              padding: "0 10px",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.6)",
              transition: "box-shadow 0.3s ease-in-out",
            }}
          >
            <a
              // href="../results"
              onClick={() =>
                router.push({
                  pathname: "../results",
                  query: { name: "lahore", type: "city" },
                })
              }
              style={{
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              <div style={{ position: "relative", overflow: "hidden" }}>
                <img
                  src="./images/b1.jpg"
                  alt="Image 1"
                  style={{
                    filter: "brightness(70%)",
                    width: "100%",
                    height: "350px",
                    borderRadius: "10px",
                    transition: "transform 0.2s ease-in-out",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    color: "white",
                    zIndex: 1,
                  }}
                >
                  <h3>Lahore</h3>
                  <p>
                    Lahore, often hailed as the cultural capital of Pakistan,
                    boasts a rich history and vibrant atmosphere, making it a
                    destination revered for its architectural marvels and
                    dynamic cultural scene.
                  </p>
                </div>
              </div>
            </a>
          </div>
          <div
            className="customRow"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginTop: "20px",
            }}
          >
            <div
              className="customColumn"
              style={{
                flexBasis: "calc(45% - 10px)",
                borderRadius: "10px",
                overflow: "hidden",
                marginBottom: "20px",
                position: "relative",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.6)",
                transition: "box-shadow 0.3s ease-in-out",
              }}
            >
              <a
                onClick={() =>
                  router.push({
                    pathname: "../results",
                    query: { name: "punjab", type: "province" },
                  })
                }
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src="./images/b7.jpg"
                    alt="Image 2"
                    style={{
                      filter: "brightness(70%)",
                      width: "100%",
                      height: "320px",
                      borderRadius: "10px",
                      transition: "transform 0.2s ease-in-out",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      color: "white",
                      zIndex: 1,
                    }}
                  >
                    <h3>Punjab</h3>
                    <p>
                      Punjab is Pakistan's largest province by area and is the
                      most populated province, with a rich culture and history.
                    </p>
                  </div>
                </div>
              </a>
            </div>
            <div
              className="customColumn"
              style={{
                flexBasis: "calc(55% - 10px)",
                borderRadius: "10px",
                overflow: "hidden",
                marginBottom: "20px",
                position: "relative",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.6)",
                transition: "box-shadow 0.3s ease-in-out",
              }}
            >
              <a
                onClick={() =>
                  router.push({
                    pathname: "../results",
                    query: { name: "sindh", type: "province" },
                  })
                }
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src="./images/b5.jpg"
                    alt="Image 3"
                    style={{
                      filter: "brightness(70%)",
                      width: "100%",
                      height: "320px",
                      borderRadius: "10px",
                      transition: "transform 0.2s ease-in-out",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      color: "white",
                      zIndex: 1,
                    }}
                  >
                    <h3>Sindh</h3>
                    <p>
                      Sindh has Pakistan's second-largest economy, while its
                      provincial capital Karachi is Pakistan's largest city and
                      financial hub.
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div
            className="customRow"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginTop: "20px",
            }}
          >
            <div
              className="customColumn"
              style={{
                flexBasis: "calc(55% - 10px)",
                borderRadius: "10px",
                overflow: "hidden",
                marginBottom: "20px",
                position: "relative",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.6)",
                transition: "box-shadow 0.3s ease-in-out",
              }}
            >
              <a
                onClick={() =>
                  router.push({
                    pathname: "../results",
                    query: { name: "khyber pakhtunkhwa", type: "province" },
                  })
                }
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src="./images/b4.jpg"
                    alt="Image 4"
                    style={{
                      width: "100%",
                      height: "320px",
                      borderRadius: "10px",
                      transition: "transform 0.2s ease-in-out",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      color: "white",
                      zIndex: 1,
                    }}
                  >
                    <h3>Khyber Pakhtunkhwa</h3>
                    <p>
                      Khyber Pakhtunkhwa is located in the northwestern region
                      of the country along the international border with
                      Afghanistan.
                    </p>
                  </div>
                </div>
              </a>
            </div>
            <div
              className="customColumn"
              style={{
                flexBasis: "calc(45% - 10px)",
                borderRadius: "10px",
                overflow: "hidden",
                marginBottom: "20px",
                position: "relative",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.6)",
                transition: "box-shadow 0.3s ease-in-out",
              }}
            >
              <a
                onClick={() =>
                  router.push({
                    pathname: "../results",
                    query: { name: "balochistan", type: "province" },
                  })
                }
                href="#"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src="./images/b3.jpg"
                    alt="Image 5"
                    style={{
                      width: "100%",
                      height: "320px",
                      borderRadius: "10px",
                      transition: "transform 0.2s ease-in-out",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      color: "white",
                      zIndex: 1,
                    }}
                  >
                    <h3>Balochistan</h3>
                    <p>
                      Balochistan is the largest province in terms of land area,
                      forming the southwestern region of the country.
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div
            className="customRow"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginTop: "20px",
            }}
          >
            {/* <div
              className="customColumn"
              style={{
                flexBasis: "calc(45% - 10px)",
                borderRadius: "10px",
                overflow: "hidden",
                marginBottom: "20px",
                position: "relative",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.6)",
                transition: "box-shadow 0.3s ease-in-out",
              }}
            >
              <a href="#" style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src="./images/b6.jpg"
                    alt="Image 6"
                    style={{
                      width: "100%",
                      height: "320px",
                      borderRadius: "10px",
                      transition: "transform 0.2s ease-in-out",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      color: "white",
                      zIndex: 1,
                    }}
                  >
                    <h3>Azad Kashmir</h3>
                    <p>
                      Azad Kashmir is an administrative region of the country.
                      The northern part of Azad Jammu and Kashmir encompasses
                      the lower part of the Himalayas, including Jamgarh Peak.
                    </p>
                  </div>
                </div>
              </a>
            </div> */}
            {/* <div
              className="customColumn"
              style={{
                flexBasis: "calc(55% - 10px)",
                borderRadius: "10px",
                overflow: "hidden",
                marginBottom: "20px",
                position: "relative",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.6)",
                transition: "box-shadow 0.3s ease-in-out",
              }}
            >
              <a href="#" style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src="./images/b2.jpg"
                    alt="Image 7"
                    style={{
                      width: "100%",
                      height: "320px",
                      borderRadius: "10px",
                      transition: "transform 0.2s ease-in-out",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      color: "white",
                      zIndex: 1,
                    }}
                  >
                    <h3>Gilgit Baltistan</h3>
                    <p>
                      Gilgit Baltistan is an administrative unit of Pakistan
                      situated in the northern part of the country. It is one of
                      the best tourist spots in Pakistan, home to five of the
                      "eight-thousanders" and more than fifty peaks above 7000
                      meters.
                    </p>
                  </div>
                </div>
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
