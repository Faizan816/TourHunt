import { useEffect, useState } from "react";
import Layout from "../../components/adminLayout";
import axios from "axios";
import { Button, Text } from "@chakra-ui/react";

export default function ServiceReviews() {
  const [r, setR] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const reviewsResponse = await axios.get(
        "http://127.0.0.1:8000/getReviews"
      );
      const reviews = reviewsResponse.data || null;
      setR(reviews);
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <div
        style={{
          backgroundColor: "#143E56",
          display: "flex",
          flexDirection: "column",
          fontWeight: "bold",
          marginLeft: "2%",
          marginTop: 39,
          padding: 20,
          borderRadius: 10,
          width: "75%",
          gap: 10,
          overflow: "auto",
        }}
      >
        <p>Service Reviews</p>
        <table>
          <thead style={{ backgroundColor: "#2A656D", fontSize: "smaller" }}>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  paddingLeft: 20,
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              >
                Service Name
              </th>
              <th
                style={{
                  textAlign: "left",
                  paddingLeft: 20,
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              >
                Username
              </th>
              <th
                style={{
                  textAlign: "left",
                  paddingLeft: 20,
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              >
                Email
              </th>
              <th
                style={{
                  paddingLeft: 20,
                  textAlign: "left",
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              >
                Service Type
              </th>
              <th
                style={{
                  paddingLeft: 20,
                  textAlign: "left",
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              >
                Comment
              </th>
              <th
                style={{
                  paddingLeft: 20,
                  textAlign: "left",
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              >
                Rating
              </th>
            </tr>
          </thead>
          <tbody>
            {r &&
              r.map((d) => (
                <tr key={d._id}>
                  <td style={{ padding: 20 }}>{d.serviceName}</td>
                  <td style={{ padding: 20 }}>{d.username && d.username}</td>
                  <td style={{ padding: 20 }}>{d.email && d.email}</td>
                  <td style={{ padding: 20 }}>{d.serviceType}</td>
                  <td style={{ padding: 20 }}>
                    <Text>{d.comment === "" ? "-" : d.comment}</Text>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        padding: 20,
                      }}
                    >
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          className={
                            index < d.rating
                              ? "fa fa-star rated gold"
                              : "fa fa-star not-rated"
                          }
                        ></span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
