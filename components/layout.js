import { useState, createContext, useContext } from "react";
import Styles from "./layout.module.css";
import Logo from "./logo";
import Link from "next/link";

export default function Layout({ children }) {
  // const [active, setActive] = useState("Home");

  return (
    <div
      style={{
        backgroundColor: "#1F516D",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1 }}>
        <div className={Styles.logoContainer}>
          <Logo />
        </div>
        <div className={Styles.container}>{children}</div>
      </div>
      <div
        style={{
          width: "100%",
          paddingTop: 50,
          paddingBottom: 50,
          backgroundColor: "#143E56",
          marginTop: "20px",
        }}
      >
        <p style={{ textAlign: "center", fontSize: 12 }}>
          © 2024 Tour Hunt. All rights reserved.
        </p>
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            textDecoration: "underline",
          }}
        >
          Have a <Link href="../customer/complaint">complaint?</Link>
        </p>
      </div>
    </div>
  );
}
