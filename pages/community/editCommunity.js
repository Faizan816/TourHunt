import Link from "next/link";
import Layout from "../../components/layout";
import { useEffect, useState, useRef } from "react";
import { app } from "../../components/firebase/firebase";
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
  where,
  getDocs,
} from "firebase/firestore";
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

export default function EditCommunity() {
  const [communityName, setCommunityName] = useState("");
  const snapshot = collection(getFirestore(app), "communities");
  const [community, setCommunity] = useState();
  const [users, setUsers] = useState();
  const q = query(snapshot, ref);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState();
  const [deleteUser, setDeleteuser] = useState(false);
  const [asAdmin, setAsAdmin] = useState();
  const [asUser, setAsUser] = useState();

  useEffect(() => {
    loadCommunity();
  }, []);

  const loadCommunity = async () => {
    const communitiesQuery = query(
      collection(getFirestore(app), "communities"),
      where("_id", "==", localStorage.getItem("currentCommunity"))
    );
    const querySnapshot = await getDocs(communitiesQuery);
    console.log(querySnapshot.docs[0].data());
    setCommunity(querySnapshot.docs[0].data());
    setCommunityName(querySnapshot.docs[0].data().name);
    setUsers(querySnapshot.docs[0].data().users);
  };

  const handleDone = async () => {
    const communitiesQuery = query(
      collection(getFirestore(app), "communities"),
      where("_id", "==", localStorage.getItem("currentCommunity"))
    );
    const querySnapshot = await getDocs(communitiesQuery);

    updateDoc(doc(getFirestore(app), "communities", querySnapshot.docs[0].id), {
      name: communityName,
      users: users,
    })
      .then(() => {
        console.log("Data updated successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteUser = async () => {
    const updatedUsers = community.users.filter((u) => u.email !== user.email);
    console.log(updatedUsers);
    setUsers(updatedUsers);
  };

  const handleAssignmAsAdmin = () => {
    const updatedUsers = community.users.map((u) => {
      if (u.email === user.email) {
        u.role = "admin";
        return u;
      }
      return u;
    });
    setUsers(updatedUsers);
  };

  const handleRemoveAsAdmin = () => {
    const updatedUsers = community.users.map((u) => {
      if (u.email === user.email) {
        u.role = "user";
        return u;
      }
      return u;
    });
    setUsers(updatedUsers);
  };

  return (
    <Layout>
      {deleteUser && (
        <AlertDialogExample
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          action={handleDeleteUser}
          title="Remove User?"
          actionButtonText="Remove"
          text={`Are you sure you want to remove ${user.username}?`}
        />
      )}
      {asUser && (
        <AlertDialogExample
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          action={handleRemoveAsAdmin}
          title="Remove as Admin?"
          actionButtonText="Remove as Admin"
          text={`Are you sure you want to remove ${user.username} as admin?`}
        />
      )}
      {asAdmin && (
        <AlertDialogExample
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          action={handleAssignmAsAdmin}
          title="Assign as Admin?"
          actionButtonText="Assign as Admin"
          text={`Are you sure you want to assign ${user.username} as admin?`}
        />
      )}

      <div className="edit-community">
        <div className="container">
          <div className="label-input-container">
            <label className="edit-label">Edit Community Name:</label>
            <input
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              className="edit-input"
              type="text"
              placeholder="Enter name"
            />
          </div>
          <div className="members-list">
            {users &&
              users.map((u) => {
                if (u.email !== localStorage.getItem("currentUser")) {
                  return (
                    <div className="member">
                      <div className="member-details">
                        <img
                          style={{ height: 40, width: 40 }}
                          src="/images/user.png"
                        />
                        <div>
                          <p>{u.username}</p>
                          <p>{u.email}</p>
                        </div>
                      </div>
                      <div className="member-controls">
                        {u.role === "user" ? (
                          <button
                            onClick={() => {
                              setUser(u);
                              setDeleteuser(false);
                              setAsAdmin(true);
                              setAsUser(false);
                              onOpen();
                            }}
                            className="assign-admin-button"
                          >
                            Assign as admin
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setUser(u);
                              setDeleteuser(false);
                              setAsAdmin(false);
                              setAsUser(true);
                              onOpen();
                            }}
                            className="assign-admin-button"
                          >
                            Remove as admin
                          </button>
                        )}

                        <img
                          onClick={() => {
                            setUser(u);
                            setDeleteuser(true);
                            setAsAdmin(false);
                            setAsUser(false);
                            onOpen();
                          }}
                          className="delete-icon"
                          style={{ height: 20, width: 20 }}
                          src="/images/delete.png"
                        />
                      </div>
                    </div>
                  );
                }
              })}
          </div>
          <div>
            <Link href="../community/community">
              <button onClick={handleDone} className="done-button">
                Done
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
