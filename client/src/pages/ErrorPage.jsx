import React from "react";
import { Link } from "react-router-dom";
import styles from "./ErrorPage.module.css"

const ErrorPage = () => {
  return (
    <main className={styles.ErrorPageContainer}>
      <div className={styles.ErrorPage}>
        <p className={styles.error}>404</p>
        <h1 className={styles.errorContent}>
          Page not found
        </h1>
        <p className={styles.sorryContent}>
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className={styles.backButton}>
          <Link
            to="/"
            className=""
          >
            Go back home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
