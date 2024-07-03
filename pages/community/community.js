import Link from "next/link";
import { setCommunity } from "../../communitySlice";
import Layout from "../../components/layout";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { app } from "../../components/firebase/firebase";
import LeaveDialog from "../../components/LeaveDialog";

import {
  getFirestore,
  collection,
  onSnapshot,
  ref,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import CommunityInviteModal from "../../components/CommunityInviteModal";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

function AlertDialogExample({
  isOpen,
  onOpen,
  onClose,
  action,
  text,
  actionButtonText,
  title,
}) {
  const cancelRef = useRef();

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="#1F516D">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="white">
              {title}
            </AlertDialogHeader>

            <AlertDialogBody color="white">{text}</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                bg="#2A656D"
                color="white"
                ref={cancelRef}
                onClick={onClose}
                _hover={{ bg: "rgb(73, 119, 134)" }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  action();
                  onClose();
                }}
                ml={3}
              >
                {actionButtonText}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default function Community() {
  const [communities, setCommunities] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [showModal, setShowModal] = useState(false);
  const [e, setE] = useState();
  const [c, setC] = useState();
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const snapshot = collection(getFirestore(app), "communities");
  const q = query(snapshot, ref);
  let fetchedCommunities;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // const loadCommunities = async () => {
    //   const response = await axios.get("http://127.0.0.1:8000/communities");
    //   console.log(response.data);
    //   setCommunities(response.data);
    // };

    // const getCurrentUser = async () => {
    //   const response = await axios.get("http://127.0.0.1:8000/getCurrentUser");
    //   console.log(response.data[0].email);
    //   setCurrentUser(response.data[0].email);
    // };

    const loadData = () => {
      onSnapshot(q, (snapshot) => {
        const documents = snapshot.docs
          .filter((doc) =>
            doc
              .data()
              .users.some(
                (u) => u.email === localStorage.getItem("currentUser")
              )
          )
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        setCommunities(documents);
        console.log(documents);
      });
    };

    // loadCommunities();
    // getCurrentUser();

    // Check if localStorage is available (client-side)
    if (!localStorage.getItem("currentUser")) {
      router.push("../login");
    } else {
      setIsLoggedIn(true);
      loadData();
    }
  }, []);

  // const communities = useSelector((s) => s.community.communities);
  let admins = [];
  communities &&
    communities.map((c) =>
      c.users.map((u) => {
        if (u.role === "admin") {
          admins.push({ email: u.email, id: u._id });
        }
      })
    );
  console.log(admins);

  const handleLeave = async () => {
    e.preventDefault();

    const users = c.users.filter(
      (u) => u.email !== localStorage.getItem("currentUser")
    );
    updateDoc(doc(getFirestore(app), "communities", c.id), {
      users,
    })
      .then(() => {
        console.log("Data updated successfully!");
      })
      .catch((err) => {
        console.log(err);
      });

    setShowLeaveDialog(false);
  };

  const handleDelete = async () => {
    e.preventDefault();
    deleteDoc(doc(getFirestore(app), "communities", c.id))
      .then(() => {
        console.log("Data Deleted successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const isAdmin = (community) => {
    return (
      community &&
      community.users.some(
        (u) =>
          u.email === localStorage.getItem("currentUser") && u.role === "admin"
      )
    );
  };

  return (
    isLoggedIn && (
      <Layout>
        {showLeaveDialog && (
          <AlertDialogExample
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            action={handleLeave}
            title="Leave Community"
            actionButtonText="Leave"
            text={`Are you sure you want to leave ${c && c.name}?`}
          />
        )}
        {showDeleteDialog && (
          <AlertDialogExample
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            action={handleDelete}
            title="Delete Community"
            actionButtonText="Delete"
            text={`Are you sure you want to delete ${c && c.name}?`}
          />
        )}

        {/* {showLeaveDialog && (
        <LeaveDialog
          onContinue={handleLeave}
          message={`Are you sure you want to leave?`}
          onCancel={() => setShowLeaveDialog(false)}
        />
      )} */}
        {showModal && (
          <CommunityInviteModal onClose={() => setShowModal(false)} />
        )}
        <div className="community-wrapper">
          <div className="community-container">
            <div className="community-header">
              <span className="community-label">Communities</span>
              <div id="create-invite-container">
                <Link href="../community/createCommunity">
                  <div className="create-community-button">
                    <img
                      style={{ height: 12, width: 12 }}
                      src="/images/plus.png"
                    />
                    <span>Create a community</span>
                  </div>
                </Link>
                <img
                  onClick={() => {
                    setShowModal(!showModal);
                  }}
                  id="invitation"
                  style={{ height: 20, width: 20 }}
                  src="/images/invitation.png"
                />
              </div>
            </div>
            <Link href="../community/communityChat">
              {communities &&
                communities.map((c, i) => (
                  <div
                    key={c._id}
                    className="communities"
                    onClick={() => {
                      localStorage.setItem("currentCommunity", c._id);
                    }}
                  >
                    <div>
                      <p className="community-name">{c.name}</p>
                      <p className="community-admin">
                        Admin: {admins[i].email}
                      </p>
                      <p className="community-members">
                        Members: {c.users.length}
                      </p>
                    </div>
                    <div className="controls">
                      {isAdmin(c) ? (
                        <div className="control-buttons-container">
                          <Link
                            onClick={() => {
                              localStorage.setItem("currentCommunity", c._id);
                            }}
                            href="../community/addPeople"
                          >
                            <img
                              className="add-people"
                              style={{ height: 20, width: 20 }}
                              src="/images/add-user.png"
                            />
                          </Link>
                          <Link
                            onClick={() => {
                              localStorage.setItem("currentCommunity", c._id);
                            }}
                            href="../community/editCommunity"
                          >
                            <img
                              className="edit-community"
                              style={{ height: 20, width: 20 }}
                              src="/images/edit.png"
                            />
                          </Link>
                          <img
                            onClick={(e) => {
                              e.preventDefault();
                              setShowLeaveDialog(false);
                              setShowDeleteDialog(true);
                              setE(e);
                              setC(c);
                              onOpen();
                            }}
                            className="delete-community"
                            style={{ height: 20, width: 20 }}
                            src="/images/delete.png"
                          />
                        </div>
                      ) : (
                        <img
                          // onClick={(e) => handleLeave(e, c)}
                          onClick={(e) => {
                            e.preventDefault();
                            setShowLeaveDialog(true);
                            setShowDeleteDialog(false);
                            setE(e);
                            setC(c);
                            onOpen();
                          }}
                          id="leave-community"
                          style={{ height: 20, width: 20 }}
                          src="/images/exit.png"
                        />
                      )}
                    </div>
                  </div>
                ))}
            </Link>
          </div>
        </div>
      </Layout>
    )
  );
}
