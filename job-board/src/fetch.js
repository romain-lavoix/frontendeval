export const fetchJobIds = async (start, end) => {
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

export const fetchJobsMetadata = async (start, end = []) => {
  let jobIds = await fetchJobIds(start, end);
  let promises = [];
  let newJobs = [];

  for (let i = 0; i < jobIds.length; i++) {
    promises.push(fetchJobMetadata(jobIds[i]));
  }

  await Promise.all(promises);
  await promises.forEach((job) => {
    job.then((data) => {
      newJobs.push(data);
    });
  });

  let cached_jobs = JSON.parse(window.localStorage.getItem("hn_jobs"));
  if (!cached_jobs) {
    cached_jobs = {
      jobs: [],
      cursor: 0,
    };
  }

  // FTL: All the reading from localStorage should be done in this file
  // to have better encapsulation. Now you are reading the data from multiple files
  // and it's harder to remember where to make changes related to reading from the cache.
  // The localStorage key is also repeated in several places of the code. 
  // It should be extracted out as a constant as well.

  // FTL: I would recommend caching the data in this format instead, an object of jobID to the
  // job posting data `{[jobID]: data}`.
  
  // Note that the question did not ask you to cache the list of IDs, it only asked that 
  // you cache the result for individual job postings.
  //
  // This is because the order of the results could change depending on certain conditions 
  // (e.g. as time passes, new posts come in. user might sort according to some keywords, popularity, etc)
  //
  // However, your current approach caches the entire list which works on first glance but is flawed
  // because I can never see the most updated data beyond the first load. If I visit your site
  // a few hours later, I still see the same results because you have cached the entire list + postings
  // and will never hit the network again. This is fine if your cache has an expiry, but your cache
  // currently lasts forever.

  // If you cached only the job data, after time passes, you'll still see new postings. 
  // Assuming a reverse chronological order, when you scroll down far enough, you'll 
  // reach the older results where you've seen before and this is where the cache comes in useful. 
  // The job posting data can be read from localStorage instead of fetching over the network. 

  // Let me know if this doesn't makes sense, I can explain further.
  window.localStorage.setItem(
    "hn_jobs",
    JSON.stringify({
      jobs: cached_jobs.jobs.concat(newJobs),
      cursor: end,
    })
  );
  return newJobs;
};
