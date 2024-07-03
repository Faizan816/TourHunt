import { useState, useEffect } from "react";
import { app } from "./firebase/firebase";
import {
  getFirestore,
  collection,
  onSnapshot,
  ref,
  query,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  where,
  deleteDoc,
} from "firebase/firestore";
import axios from "axios";
import { Button, ButtonGroup } from "@chakra-ui/react";

const CommunityInviteModal = ({ onClose }) => {
  const [communityInvites, setCommunityInvites] = useState();
  const [filteredInvites, setFilteredInvites] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const snapshot = collection(getFirestore(app), "communityInvites");
    const q = query(snapshot, ref);
    onSnapshot(q, (snapshot) => {
      const documents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCommunityInvites(documents);
    });
  }, []);

  if (communityInvites && loading) {
    console.log("This is if body");
    const invites = communityInvites.filter(
      (ci) => ci.receiver === localStorage.getItem("currentUser")
    );
    if (invites.length !== 0) {
      setFilteredInvites(invites);
    } else {
      setFilteredInvites(undefined);
    }
    console.log(invites);

    setLoading(false);
  }

  const handleAccept = async (ci) => {
    // finding community's data from where invite came from
    const communitiesQuery = query(
      collection(getFirestore(app), "communities"),
      where("_id", "==", ci.communityId)
    );
    const querySnapshot = await getDocs(communitiesQuery);
    let updatedCommunity = querySnapshot.docs[0].data();

    // getting current user's data so that the user can be added to the community
    const response = await axios.post("http://127.0.0.1:8000/getUserId", {
      email: localStorage.getItem("currentUser"),
    });

    console.log(response.data._id);

    // adding the user's data to the community
    updatedCommunity.users.push({
      _id: response.data._id,
      email: response.data.email,
      messages: [],
      role: "user",
      username: response.data.username,
    });

    console.log(updatedCommunity);
    console.log(querySnapshot.docs[0].id);

    // now updating the firestore
    updateDoc(doc(getFirestore(app), "communities", querySnapshot.docs[0].id), {
      users: updatedCommunity.users,
    })
      .then(() => {
        console.log("Data updated successfully!");
      })
      .catch((err) => {
        console.log(err);
      });

    // deleting the invite since it has been processed
    deleteDoc(doc(getFirestore(app), "communityInvites", ci.id))
      .then(() => {
        console.log("Data Deleted successfully!");
      })
      .catch((err) => {
        console.log(err);
      });

    // Now, update the state after modifying the data in Firestore
    setFilteredInvites((prevInvites) => {
      const invites = prevInvites.filter((invite) => invite.id !== ci.id);
      if (invites.length !== 0) {
        return invites;
      } else {
        return undefined;
      }
    });

    // Set loading to trigger a re-render
    setLoading(false);
  };

  const handleReject = (ci) => {
    deleteDoc(doc(getFirestore(app), "communityInvites", ci.id))
      .then(() => {
        console.log("Data Deleted successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
    // Now, update the state after modifying the data in Firestore
    setFilteredInvites((prevInvites) => {
      const invites = prevInvites.filter((invite) => invite.id !== ci.id);
      if (invites.length !== 0) {
        return invites;
      } else {
        return undefined;
      }
    });

    // Set loading to trigger a re-render
    setLoading(false);
  };

  console.log("Loading is: " + loading);
  console.log("Filtered Invites are: " + filteredInvites);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="heading-plus-close-container">
          <h5 className="community-invites-heading">Community Invites</h5>
          <img
            className="close-icon"
            src="/images/close.png"
            onClick={onClose}
            style={{ height: 15, width: 15 }}
          />
        </div>
        <div>
          {filteredInvites !== undefined &&
            !loading &&
            filteredInvites.map((ci) => (
              <div className="modal-wrapper">
                <div className="content-holder">
                  <span className="heading">Community Name:</span>
                  <span className="value">{ci.communityName}</span>
                </div>
                <div className="content-holder">
                  <span className="heading">Sender:</span>
                  <span className="value">{ci.sender}</span>
                </div>
                <div className="modal-buttons">
                  <ButtonGroup>
                    <Button
                      colorScheme="green"
                      size="sm"
                      bg="#398D2C"
                      // className="accept-button"
                      onClick={() => handleAccept(ci)}
                    >
                      Accept
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      bg="#AC3116"
                      // className="reject-button"
                      onClick={() => {
                        handleReject(ci);
                      }}
                    >
                      Reject
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            ))}
        </div>
        {!filteredInvites && (
          <p className="no-invites-text">There are no invites!</p>
        )}
      </div>
    </div>
  );
};

export default CommunityInviteModal;
