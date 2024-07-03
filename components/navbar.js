import styles from "../styles/Navbar.module.css";
import { useRouter } from "next/router";

export default function Navbar({ active }) {
  const router = useRouter();

  return (
    <div
      style={{
        justifyContent: "center",
        display: "flex",
        backgroundColor: "white",
      }}
    >
      <div style={{ width: "70%" }}>
        <ul
          style={{
            listStyleType: "none",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <li
            className={[
              styles.menulist,
              active === "Home" && styles.active,
            ].join(" ")}
          >
            <button
              onClick={() => {
                router.push("/home");
              }}
            >
              Home
            </button>
          </li>
          <li
            className={[
              styles.menulist,
              active === "Expense Configuration" && styles.active,
            ].join(" ")}
          >
            <button
              onClick={() => {
                router.push("/expenseConfiguration");
              }}
            >
              Expense Configuration
            </button>
          </li>
          <li
            className={[
              styles.menulist,
              active === "Results" && styles.active,
            ].join(" ")}
          >
            <button
              onClick={() => {
                router.push("/results");
              }}
            >
              Results
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
