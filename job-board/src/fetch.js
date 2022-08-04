export const fetchJobIds = async (start = 0, end = 9) => {
  let jobIds = [];
  await fetch("https://hacker-news.firebaseio.com/v0/jobstories.json")
    .then((response) => response.json())
    .then((data) => {
      jobIds = data.slice(start, end);
    });
  return jobIds;
};
export const fetchJobMetadata = async (id) => {
  let metadata;
  await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    .then((response) => response.json())
    .then((data) => (metadata = data));
  return metadata;
};

export const fetchJobsMetadata = async (start, end) => {
  const jobIds = await fetchJobIds(start, end);
  let promises = [];
  let newJobs = [];
  for (let i = 0; i < jobIds.length; i++) {
    promises.push(fetchJobMetadata(jobIds[i]));
  }
  await Promise.all(promises);
  promises.forEach((job) => {
    job.then((data) => {
      newJobs.push(data);
    });
  });
  return newJobs;
};
