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
    return <div className={styles.container}>No data available</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.back}>
        <Link to={"/admin-page"}>
          <FaArrowLeft />
          Back
        </Link>
      </div>
      {imageArr.map((result, index) => (
        <div key={index}>
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
        </div>
      ))}
    </div>
  );
};

export default TeachingProgress;
