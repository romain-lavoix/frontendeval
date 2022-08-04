import "./JobBoard.css";
import { useEffect, useState } from "react";
import { fetchJobsMetadata } from "./fetch";
import { LOADING_SIZE, MORE_LOADING_SIZE, DESC_CHAR_LIMIT } from "./constants";

function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [cursor, setCursor] = useState(LOADING_SIZE);
  const [loading, setLoading] = useState({ loading: false, nb: 0 });

  useEffect(() => {
    async function fetchData() {
      setLoading({ loading: true, nb: LOADING_SIZE });
      const newJobs = await fetchJobsMetadata(0, cursor);
      setLoading({ loading: false, nb: 0 });
      setJobs(newJobs);
    }
    fetchData().then();
  }, []);

  const loadingItems = [];
  for (let i = 0; i < loading.nb; i++) {
    loadingItems.push(i);
  }

  return (
    <div className="main-container">
      <div className="main">
        <div className="title">
          <h1>HN Jobs</h1>
        </div>
        <div className="job-board">
          {jobs.map((job) => {
            const title = job.title.split(" ").splice(0, 3).join(" ");
            let description = job.title.split(" ").splice(3).join(" ");
            if (description.length >= DESC_CHAR_LIMIT) {
              description = description.substring(0, DESC_CHAR_LIMIT) + "...";
            }
            return (
              <div
                key={job.title}
                className={"job-cell"}
                onClick={() => {
                  if (job.url) {
                    window.open(job.url, "_blank");
                  } else {
                    window.open(
                      `https://news.ycombinator.com/item?id=${job.id}`,
                      "_blank"
                    );
                  }
                }}
              >
                <div className="job-title">{title}</div>
                <div>{description}</div>
                <div className="job-date">
                  {new Date(job.time * 1000).toLocaleDateString()}
                </div>
              </div>
            );
          })}
          {loadingItems.map((idx) => {
            return (
              <div key={`loading=${idx}`} className={"loading-cell"}>
                <div className="job-title blur">Title (YC2020)</div>
                <div className="blur">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, ed
                </div>
                <div className="blur">01/01/2020</div>
              </div>
            );
          })}
        </div>
        <div>
          <button
            className="button"
            onClick={async () => {
              setLoading({ loading: true, nb: MORE_LOADING_SIZE });
              const newJobs = await fetchJobsMetadata(
                cursor,
                cursor + MORE_LOADING_SIZE
              );
              setLoading({ loading: false, nb: 0 });
              setJobs((oldJobs) => oldJobs.concat(newJobs));
              setCursor(cursor + MORE_LOADING_SIZE);
            }}
          >
            Load more
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobBoard;
