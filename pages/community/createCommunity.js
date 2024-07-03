import { useState } from "react";
import Layout from "../../components/layout";
import Link from "next/link";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  getFirestore,
  collection,
  onSnapshot,
  ref,
  query,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { app } from "../../components/firebase/firebase";
import { useRouter } from "next/router";

export default function CreateCommunity() {
  const [communityName, setCommunityName] = useState("");
  const snapshot = collection(getFirestore(app), "communities");
  const [error, setError] = useState("");
  const q = query(snapshot, ref);
  const router = useRouter();

  const handleFinish = async (page) => {
    // const currentUser = await axios.get("http://127.0.0.1:8000/getCurrentUser");
    // const username = currentUser.data[0].username;
    // const email = currentUser.data[0].email;

    if (communityName.trim() === "") {
      // Check if community name is empty
      setError("Please enter a community name."); // Update error message
      return false; // Exit function
    }
    const randomCommunityId = uuidv4();

    // saving the community id to the local storage
    localStorage.setItem("currentCommunity", randomCommunityId);

    const response = await axios.post(
      "http://127.0.0.1:8000/findUserUsingEmail",
      {
        email: localStorage.getItem("currentUser"),
      }
    );
    console.log(
      response.data.username +
        " " +
        response.data.email +
        " " +
        response.data._id
    );

    addDoc(snapshot, {
      _id: randomCommunityId,
      name: communityName,
      users: [
        {
          _id: response.data._id,
          email: response.data.email,
          messages: [],
          role: "admin",
          username: response.data.username,
        },
      ],
    })
      .then(() => {
        console.log("Data Added successfully!");
      })
      .catch((err) => {
        console.log(err);
      });

    router.push(`../../community/${page}`);

    // const response = await axios.post("http://127.0.0.1:8000/createCommunity", {
    //   communityName: communityName,
    //   users: [{ username: username, email: email, role: "admin" }],
    // });
  };

  const handleAddPeople = () => {
    handleFinish("addPeople");
  };

  return (
    <Layout>
      <div className="create-community">
        <div className="container">
          <span>Enter Community Name:</span>
          <form>
            <input
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              className="community-name-input"
              type="text"
              placeholder="Enter name"
            />
          </form>
          {error && <p className="error-message">{error}</p>}{" "}
          <div className="button-container">
            {/* <Link href="../community/community"> */}
            <button
              className="finish-button"
              onClick={() => handleFinish("community")}
            >
              Finish
            </button>
            {/* </Link> */}
            {/* <Link href="../community/addPeople"> */}
            <button className="add-people-button" onClick={handleAddPeople}>
              Add People
            </button>
            {/* </Link> */}
          </div>
        </div>
      </div>
    </Layout>
  );
}
