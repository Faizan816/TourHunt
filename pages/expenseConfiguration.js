import Layout from "../components/layout";
import {
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import styles from "../styles/ExpenseConfiguration.module.css";
import Navbar from "../components/navbar";
import { useRouter } from "next/router";
import { useContext } from "react";
import { ActiveContext } from "../components/layout";
import { useDispatch } from "react-redux";
import { setTourPackageBudget } from "../budgetSlice";
import { setAccommodationBudget } from "../budgetSlice";
import { setRestaurantBudget } from "../budgetSlice";
import { setTransportBudget } from "../budgetSlice";

export default function ExpenseConfiguration() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [tpExpense, setTpExpense] = useState("");
  const [hotelExpense, sethotelExpense] = useState("");
  const [transportExpense, settransportExpense] = useState("");
  const [guideExpense, setguideExpense] = useState("");
  const [restaurantExpense, setrestaurantExpense] = useState("");

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "50%",
          }}
        >
          <div>
            <Heading style={{ textAlign: "center" }}>
              Expenses Configuration
            </Heading>
          </div>
          <div className="paddingTop">
            <FormControl>
              <FormLabel>Tour Package Expense:</FormLabel>
              <Input
                placeholder="Enter Tour Package Expense"
                type="number"
                value={tpExpense}
                onChange={(e) => setTpExpense(e.target.value)}
              />
            </FormControl>
          </div>
          <div className="paddingTop">
            <FormControl>
              <FormLabel>Hotel Expense:</FormLabel>
              <Input
                placeholder="Enter Hotel Expense"
                type="number"
                value={hotelExpense}
                onChange={(e) => sethotelExpense(e.target.value)}
              />
            </FormControl>
          </div>
          <div className="paddingTop">
            <FormControl>
              <FormLabel>Transport Expense:</FormLabel>
              <Input
                placeholder="Enter Transport Expense"
                type="number"
                value={transportExpense}
                onChange={(e) => settransportExpense(e.target.value)}
              />
            </FormControl>
          </div>
          <div className="paddingTop">
            <FormControl>
              <FormLabel>Restaurant Expense:</FormLabel>
              <Input
                placeholder="Enter Restaurant Expense"
                type="number"
                value={restaurantExpense}
                onChange={(e) => setrestaurantExpense(e.target.value)}
              />
            </FormControl>
          </div>
          {/* <div className="paddingTop">
            <FormControl>
              <FormLabel>Guide Expense:</FormLabel>
              <Input
                placeholder="Enter Guide Expense"
                type="number"
                value={guideExpense}
                onChange={(e) => setguideExpense(e.target.value)}
              />
            </FormControl>
          </div> */}
          <div className={["paddingTop", styles.center].join(" ")}>
            <div className={styles.buttonContainer}>
              <div>
                <Button
                  onClick={() => {
                    dispatch(setTourPackageBudget(tpExpense));
                    dispatch(setAccommodationBudget(hotelExpense));
                    dispatch(setRestaurantBudget(restaurantExpense));
                    dispatch(setTransportBudget(transportExpense));
                    router.push("results");
                  }}
                  colorScheme="green"
                >
                  Submit
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => {
                    router.push("home");
                  }}
                  colorScheme="blue"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
