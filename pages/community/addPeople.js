import Link from "next/link";
import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  getFirestore,
  collection,
  onSnapshot,
  ref,
  query,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../../components/firebase/firebase";
import { Box, useToast } from "@chakra-ui/react";

export default function AddPeople() {
  const [inputFields, setInputFields] = useState([""]); // Initial state with one input field
  const snapshot = collection(getFirestore(app), "communityInvites");
  const q = query(snapshot, ref);
  let communityName = "";
  const toast = useToast();

  const handleAddField = () => {
    setInputFields([...inputFields, ""]);
  };

  const handleInputChange = (index, value) => {
    const newInputFields = [...inputFields];
    newInputFields[index] = value;
    setInputFields(newInputFields);
  };

  const handleSendInvite = async (index) => {
    if (inputFields[index] === "") {
      toast({
        title: "Input field empty!",
        description: "Please enter the email and then send.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else if (localStorage.getItem("currentUser") !== inputFields[index]) {
      console.log(localStorage.getItem("currentCommunity"));

      //                RECEIVER ALREADY EXISTS?

      // checking if receiver is already a member of the community
      const receiverQuery = query(
        collection(getFirestore(app), "communities"),
        where("_id", "==", localStorage.getItem("currentCommunity"))
      );

      // now checking looping through receiverQuery which contains community to match if receiver is already a member
      const querySnapshot = await getDocs(receiverQuery);
      console.log(querySnapshot.docs[0].data());
      let receiverExists = [];
      receiverExists = querySnapshot.docs[0]
        .data()
        .users.filter((u) => u.email === inputFields[index]);
      console.log(receiverExists.length);
      if (receiverExists.length !== 0) {
        toast({
          title: "Cannot invite!",
          description: `${inputFields[index]} is already a member`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      //                INVITE ALREADY SENT TO RECEIVER?

      // checking if the receiver has already been invited and his/her invite response is pending
      const pendingInviteQuery = query(
        collection(getFirestore(app), "communityInvites"),
        where("receiver", "==", inputFields[index]),
        where("communityId", "==", localStorage.getItem("currentCommunity"))
      );
      const piqSnapshot = await getDocs(pendingInviteQuery);
      if (
        !piqSnapshot.empty &&
        localStorage.getItem("currentCommunity") ===
          piqSnapshot.docs[0].data().communityId
      ) {
        console.log(piqSnapshot.docs[0].data().communityId);
        console.log(localStorage.getItem("currentCommunity"));
        toast({
          title: "Already Invited!",
          description: `${inputFields[index]} is already invited!`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      //                RECEIVER ACCOUNT EXISTS IN THE SYSTEM?
      let username;
      let senderName;
      // checking if receiver account exists
      try {
        const receiverResponse = await axios.post(
          "http://127.0.0.1:8000/findUserUsingEmail",
          {
            email: inputFields[index],
          }
        );
        const senderResponse = await axios.post(
          "http://127.0.0.1:8000/findUserUsingEmail",
          {
            email: localStorage.getItem("currentUser"),
          }
        );
        username = receiverResponse.data.username;
        senderName = senderResponse.data.username;
      } catch (error) {
        console.error("Error: " + error);
        toast({
          title: "Invite cannot be sent!",
          description: `${inputFields[index]} is not registered in the system`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      //                    SENDING INVITE TO RECEIVER

      // getting username or sender's name
      const response = await axios.post(
        "http://127.0.0.1:8000/findUserUsingEmail",
        {
          email: localStorage.getItem("currentUser"),
        }
      );
      console.log(response.data.username);

      // getting community name from firestore
      const communitiesQuery = query(
        collection(getFirestore(app), "communities"),
        where("_id", "==", localStorage.getItem("currentCommunity"))
      );
      try {
        const querySnapshot = await getDocs(communitiesQuery);

        if (querySnapshot.empty) {
          console.log("No community found with given id");
          return;
        }
        // Assuming there's only one community with the specified name
        const communityDoc = querySnapshot.docs[0];
        console.log("Community found:", communityDoc.data().name);
        communityName = communityDoc.data().name;
      } catch (error) {
        console.error("Error querying communities:", error);
      }

      // we already have community name in communityName variable
      const communityId = localStorage.getItem("currentCommunity");
      const sender = response.data.username;
      const receiver = inputFields[index];

      // now using these variables to send community invite
      addDoc(snapshot, {
        communityId: communityId,
        communityName: communityName,
        sender: sender,
        receiver: receiver,
      })
        .then(() => {
          console.log("Invite sent successfully!");
          toast({
            title: "Invite sent successfully!",
            description: `Your invite has been sent to ${receiver}`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: "Invite failed!",
            description: "Something went wrong while sending invite!",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
      // sending mail to receiver
      await axios.post("http://127.0.0.1:8000/sendMail", {
        to: inputFields[index],
        name: senderName,
        subject: "Community Invite!",
        body: `<p>Dear ${username},</p>
           <p>You have been invited to community "${communityName}" by ${senderName}.</p>`,
      });
    } else {
      toast({
        title: "Cannot invite!",
        description: "You cannot invite yourself!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Layout>
      <div className="add-people">
        <div className="container">
          <div className="input-container">
            {inputFields.map((value, index) => (
              <div className="input-and-button-container" key={index}>
                <div className="label-and-input-container">
                  <label className="email-label">Email:</label>
                  <input
                    className="input-field"
                    type="text"
                    value={value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder="ali@gmail.com"
                  />
                </div>
                <button
                  onClick={() => handleSendInvite(index)}
                  className="send-invite-button"
                >
                  Send Invite
                </button>
              </div>
            ))}
          </div>
          <div className="button-container">
            <Link href="../community/community">
              <button className="finish-button">Go Back</button>
            </Link>
            <Box
              cursor="pointer"
              onClick={handleAddField}
              className="add-new-field-button-container"
            >
              <img style={{ height: 12, width: 12 }} src="/images/plus.png" />
              <button className="add-new-field-button">Add New Field</button>
            </Box>
          </div>
        </div>
      </div>
    </Layout>
  );
}
