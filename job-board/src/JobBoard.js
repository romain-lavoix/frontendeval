import "./JobBoard.css";
import { useEffect, useState } from "react";
import { fetchJobIds, fetchJobMetadata, fetchJobsMetadata } from "./fetch";

function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [cursor, setCursor] = useState(9);

  useEffect(() => {
    async function fetchData() {
      const newJobs = await fetchJobsMetadata(0, cursor);
      setJobs(newJobs);
    }
    fetchData().then();
  }, []);

  return (
    <div className="main">
      <div className="title">
        <h1>HN Jobs</h1>
      </div>
      <div className="job-board">
        {jobs.map((job) => {
          const title = job.title.split(" ").splice(0, 3).join(" ");
          const description = job.title.split(" ").splice(3).join(" ");
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
      </div>
      <div>
        <button
          className="button"
          onClick={async () => {
            const newJobs = await fetchJobsMetadata(cursor, cursor + 6);
            setJobs((oldJobs) => oldJobs.concat(newJobs));
            setCursor(cursor + 6);
          }}
        >
          Load more
        </button>
      </div>
    </div>
  );
}

export default JobBoard;
