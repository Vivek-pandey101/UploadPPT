import React from "react";
import { useSelector } from "react-redux";
import styles from "./TeachingProgress.module.css";
import { Link } from "react-router-dom";
import Loader from "../component/Loader";
import { FaArrowLeft } from "react-icons/fa";

// Helper function to format milliseconds to minutes:seconds
const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}m ${seconds}s`;
};

const TeachingProgress = () => {
  const { imageArr, isLoading } = useSelector((state) => state.images);

  if (isLoading) {
    return <Loader />;
  }

  if (!imageArr || imageArr.length === 0) {
    return (
      <>
        <div className={styles.back}>
          <Link to={"/admin-page"}>
            <FaArrowLeft />
            Back
          </Link>
        </div>
        <div className={styles.NoDatacontainer}>No data available</div>;
      </>
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
      {imageArr?.map((result, index) => (
        <div key={index}>
          {(result.timeStamp.length > 0 || result.timeSpent?.length > 0) && (
            <>
              <h2 className={styles.heading}>
                Teaching Progress - {result.name}
              </h2>

              {/* Completion Markers Table */}
              {result.timeStamp.length > 0 && (
                <div className={styles.section}>
                  <h3>Completion Markers</h3>
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
                          <tr key={`timestamp-${i}`}>
                            <td>{entry.email}</td>
                            <td>{entry.userName}</td>
                            <td>{entry.clickedIndex + 1}</td>
                            <td>{entry.actionTimestamp}</td>
                            <td>{entry.docName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Time Tracking Table */}
              {result.timeSpent?.length > 0 && (
                <div className={styles.section}>
                  <h3>Time Spent per Slide</h3>
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Email</th>
                          <th>Slide Index</th>
                          <th>Time Spent</th>
                          <th>Session Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.timeSpent.map((entry, i) => (
                          <tr key={`timespent-${i}`}>
                            <td>{entry.email}</td>
                            <td>{entry.slideIndex}</td>
                            <td>{formatDuration(entry.duration)}</td>
                            <td>
                              {new Date(entry.timestamp).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default TeachingProgress;
