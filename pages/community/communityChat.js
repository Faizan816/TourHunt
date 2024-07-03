import axios from "axios";
import Layout from "../../components/layout";
import { app, storage } from "../../components/firebase/firebase";
import {
  getFirestore,
  collection,
  onSnapshot,
  ref,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  ref as sRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@chakra-ui/react";

export default function CommunityChat() {
  const [communities, setCommunities] = useState();
  const [message, setMessage] = useState();
  const [sortedChats, setSortedChats] = useState();
  const snapshot = collection(getFirestore(app), "communities");
  const q = query(snapshot, ref);
  const [communityName, setCommunityName] = useState();
  const [selectedFile, setSelectedFile] = useState();
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const documents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCommunities(documents);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    sortChats();
  }, [communities]);

  // to automatically scroll down to the bottom of the chats
  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      // Scroll to the bottom of the chat container
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [sortedChats]);

  // Helper function to format the date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  function sortChats() {
    let chats = [];

    if (communities) {
      communities.forEach((c) => {
        if (c._id === localStorage.getItem("currentCommunity")) {
          setCommunityName(c.name);
          c.users.forEach((u) => {
            u.messages.forEach((m) => {
              chats.push({
                _id: u._id,
                email: u.email,
                message: m.message,
                image: m.image,
                time: new Date(`${m.date} ${m.time}`).getTime(),
                name: u.username,
                date: m.date,
              });
            });
          });
        }
      });
    }

    // Sorting chats by time
    const newlySortedChats = chats.sort((a, b) => a.time - b.time);
    setSortedChats(newlySortedChats);
  }

  // handle the file change
  const handleFileChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleCloseButton = () => {
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const handleSend = () => {
    if (selectedFile) {
      const storageRef = sRef(storage, `chatImages/${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);
      console.log(selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(snapshot);
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at: " + downloadURL);

            // after saving the image to firebase storage, save the entire data to firestore
            console.log("message sent");
            const currentCommunityId = localStorage.getItem("currentCommunity");

            // Assuming your state structure remains similar
            const updatedCommunities = communities.map((c) => {
              if (c._id === currentCommunityId) {
                const updatedUsers = c.users.map((u) => {
                  if (u.email === localStorage.getItem("currentUser")) {
                    // Append the new message to the end of the messages array
                    u.messages = [
                      ...u.messages,
                      {
                        message: message,
                        time: new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                        date: new Date().toISOString().split("T")[0],
                        image: downloadURL,
                      },
                    ];
                  }
                  return u;
                });

                return { ...c, users: updatedUsers };
              }

              return c;
            });

            console.log(updatedCommunities);

            // Update the state with the new data
            setCommunities(updatedCommunities);

            // getting the firestore community id
            const firestoreCommunityId = communities.filter(
              (c) => c._id === localStorage.getItem("currentCommunity")
            );

            console.log(firestoreCommunityId[0]);
            const users = firestoreCommunityId[0].users;

            // now updating the communities in the firestore
            updateDoc(
              doc(getFirestore(app), "communities", firestoreCommunityId[0].id),
              { users }
            )
              .then(() => {
                console.log("Firestore data updated successfully!");
              })
              .catch((err) => {
                console.log(err);
              });

            // Clear the message input
            setMessage("");

            //finally sort the chats
            sortChats();
          });
        }
      );
    }

    // then set the image to null
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const updateChats = () => {
    console.log("message sent");
    const currentCommunityId = localStorage.getItem("currentCommunity");

    // Assuming your state structure remains similar
    const updatedCommunities = communities.map((c) => {
      if (c._id === currentCommunityId) {
        const updatedUsers = c.users.map((u) => {
          if (u.email === localStorage.getItem("currentUser")) {
            // Append the new message to the end of the messages array
            u.messages = [
              ...u.messages,
              {
                message: message,
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                date: new Date().toISOString().split("T")[0],
                image: "",
              },
            ];
          }
          return u;
        });

        return { ...c, users: updatedUsers };
      }

      return c;
    });

    console.log(updatedCommunities);

    // Update the state with the new data
    setCommunities(updatedCommunities);

    // getting the firestore community id
    const firestoreCommunityId = communities.filter(
      (c) => c._id === localStorage.getItem("currentCommunity")
    );

    console.log(firestoreCommunityId[0]);
    const users = firestoreCommunityId[0].users;

    // now updating the communities in the firestore
    updateDoc(
      doc(getFirestore(app), "communities", firestoreCommunityId[0].id),
      { users }
    )
      .then(() => {
        console.log("Firestore data updated successfully!");
      })
      .catch((err) => {
        console.log(err);
      });

    // Clear the message input
    setMessage("");

    //finally sort the chats
    sortChats();
  };

  return (
    <Layout>
      <div className="community-chat">
        <div>
          <span>{communityName}</span>
        </div>
        <div id="chat-container" className="chat-container">
          <div className="messages">
            {sortedChats &&
              sortedChats.map((c, index) => (
                <div key={c._id + c.message}>
                  {/* Check if it's the first message or the date has changed */}
                  {(index === 0 || sortedChats[index - 1].date !== c.date) && (
                    <div className="date-header">{formatDate(c.date)}</div>
                  )}

                  <div
                    className={
                      c.email === localStorage.getItem("currentUser")
                        ? "message-container-right"
                        : "message-container-left"
                    }
                  >
                    <div>
                      <span>
                        {c.email === localStorage.getItem("currentUser")
                          ? "You"
                          : c.name}
                      </span>
                    </div>
                    <div className="message">
                      {c.image && (
                        <img
                          style={{
                            height: "100%",
                            width: "100%",
                            borderRadius: 20,
                          }}
                          src={c.image}
                        />
                      )}
                      <p>{c.message}</p>
                      <p className="time">
                        {new Date(c.time).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="chat-controls">
            <div className="message-input">
              <input
                id="type-message-input"
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div>
              {/* Input for file selection */}
              <input
                type="file"
                accept="image/*"
                id="file-input"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <label htmlFor="file-input">
                <img
                  id="paper-clip"
                  src="/images/paper-clip.png"
                  style={{ height: 25, width: 25, cursor: "pointer" }}
                />
              </label>
            </div>
            <div onClick={updateChats}>
              <img
                id="send-button"
                src="/images/send.png"
                style={{ height: 25, width: 25 }}
              />
            </div>
          </div>
          {previewImage && (
            <div className="modal-overlay">
              <div className="image-modal-container">
                <div className="close-container">
                  <img
                    onClick={handleCloseButton}
                    className="close-button"
                    src="/images/close.png"
                    style={{ height: 20, width: 20 }}
                  />
                </div>
                <div className="image-container">
                  <img src={previewImage} style={{ height: 300, width: 300 }} />
                </div>
                <div className="image-name">
                  <p>{selectedFile.name}</p>
                </div>
                <div className="chat-controls">
                  <div className="message-input">
                    <input
                      id="type-message-input"
                      type="text"
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <div onClick={handleSend}>
                    <img
                      id="send-button"
                      src="/images/send.png"
                      style={{ height: 25, width: 25 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
