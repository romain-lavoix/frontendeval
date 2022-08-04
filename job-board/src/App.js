import "./App.css";
import { useEffect, useState } from "react";

const fetchJobIds = async () => {
  let jobIds = [];
  await fetch("https://hacker-news.firebaseio.com/v0/jobstories.json")
    .then((response) => response.json())
    .then((data) => {
      jobIds = data.slice(0, 9);
    });
  return jobIds;
};

const fetchJobMetadata = async (id) => {
  let metadata;
  await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    .then((response) => response.json())
    .then((data) => (metadata = data));
  return metadata;
};

function App() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const jobIds = await fetchJobIds();
      let jobsMetadata = [];
      for (let i = 0; i < jobIds.length; i++) {
        const jobMetadata = await fetchJobMetadata(jobIds[i]);
        jobsMetadata.push(jobMetadata);
      }
      setJobs(jobsMetadata);
    }
    fetchData();
  }, []);

  return <div></div>;
}

export default App;
