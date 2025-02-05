import React from "react";
import { useSelector } from "react-redux";
import styles from "./TeachingProgress.module.css";
import { Link } from "react-router-dom";
import Loader from "../component/Loader";
import { FaArrowLeft } from "react-icons/fa";

const TeachingProgress = () => {
  const { imageArr, isLoading } = useSelector((state) => state.images);

  if (isLoading) {
    return <Loader />;
  }

  if (!imageArr || imageArr.length === 0) {
    return (
      <div className={styles.noDataContainer}>
        <img
          src="https://via.placeholder.com/150" // Replace with a relevant illustration
          alt="No data"
          className={styles.noDataImage}
        />
        <p className={styles.noDataText}>
          No teaching progress data available. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.back}>
        <Link to={"/admin-page"}>
          <FaArrowLeft />
          Back
        </Link>
      </div>
      {imageArr?.map((result, index) => {
        return (
          <div key={index}>
            {result.timeStamp.length > 0 ? (
              <>
                <h2 className={styles.heading}>Teaching Progress</h2>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>User Name</th>
                        <th>Completed Page</th>
                        <th>Timestamp</th>
                        <th>Document Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.timeStamp.map((entry, i) => (
                        <tr key={i}>
                          <td>{entry.email}</td>
                          <td>{entry.userName}</td>
                          <td>{entry.clickedIndex}</td>
                          <td>{entry.actionTimestamp}</td>
                          <td>{entry.docName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className={styles.noDataContainer}>
                <p className={styles.noDataText}>No teaching progress found.</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TeachingProgress;
