// FTL: By doing this, you're not using CSS modules and the CSS classes in JobBoard.css are defined in the global scope.
// That may be what you want, but there are better ways of doing it. Since you're using CRA, there's built-in support
// for CSS modules via webpack.
// Read up on CSS modules here: https://css-tricks.com/css-modules-part-1-need/
// Learn how to use it in your React app: https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/
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
      // FTL: Reading from localStorage can fail in certain situations:
      // 1. The localStorage value was corrupted (users can change it since it's in the client)
      // 2. In certain browsers + incognito mode, localStorage is not available.
      // Hence you should use try/catch whenever you load from localStorage and handle the
      // error cases gracefully.
      const cached_jobs = JSON.parse(window.localStorage.getItem("hn_jobs"));

      let newJobs = [];
      if (cached_jobs) {
        newJobs = cached_jobs.jobs.slice(0, LOADING_SIZE);
      } else {
        setLoading({ loading: true, nb: LOADING_SIZE });
        newJobs = await fetchJobsMetadata(0, cursor);
        setLoading({ loading: false, nb: 0 });
      }
      setJobs(newJobs);
    }
    // FTL: Since you're not awaiting fetchData to proceed before doing anything else
    // (there's no line after the next line), there's no need for `.then()`, it doesn't
    // do anything.
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
        {/* FTL: For rendering lists, add role="list" and role="listitem" accordingly 
        if you're not using the semantic HTML tags (ul/li). 
        https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/list_role
        */}
        <div className="job-board">
          {jobs.map((job) => {
            // FTL: This way of splitting the title is buggy and only works if the company name is a single world.
            // You should split using the (YC XXX) token instead. You can use Regex for it.
            const [title, description] = job.title.split(/\(YC \w+\)/).map(s => s.trim())
            if (description.length >= DESC_CHAR_LIMIT) {
              description = description.substring(0, DESC_CHAR_LIMIT) + "...";
            }
            return (
              <div
                // FTL: Titles does not make a great key because there's no guarantee
                // that they are unique. You should use the job.id instead.
                key={job.id}
                className="job-cell"
                onClick={() => {
                  if (job.url) {
                    // FTL: Avoid using JavaScript to do stuff that the browsers can already
                    // do. You should make the whole job posting a link instead. A link is
                    // more accessible (read up about a11y) because:
                    // 1. Screenreaders know it's a link and will announce that it's a link
                    // 2. Hovering over a link will show the link URL at the bottom of the browser
                    // 3. Users can choose to open in new tab if they want. For this qn the requirements state to open in a new tab so this point isn't too relevant
                    // 4. Users can copy the link by rightclicking on the card
                    // 5. Links have the pointer cursor styling which tells the user this is a link
                    // 6. Keyboard users can tab through the items and hit enter to navigate to a link. Divs by default are not focussable. 
                    //    You can mitigate this by adding tabIndex={0} to your <div> but the aria-role is still wrong and is not as good as using a link in the first place.
                    //    Currently your list is not usable by keyboard users at all.
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
                <div className="job-date-by">
                  <div className="job-date">
                    {/* There's the <time> tag which is more appropriate
                      https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
                    */}
                    {new Date(job.time * 1000).toLocaleDateString()}
                  </div>
                  <div
                    className="user-profile"
                    onClick={() => {
                      // Like before, don't use JavaScript to redirect if you
                      // can use HTML.
                      window.open(
                        `https://news.ycombinator.com/user?id=${job.by}`,
                        "_blank"
                      );
                    }}
                  >
                    {job.by}
                  </div>
                </div>
              </div>
            );
          })}
          {/* // FTL: Since this part never ever changes, aka static, you can extract it out outside of your component
            into the module scope. */}
          {loadingItems.map((idx) => {
            // FTL: This is really cool! A more common approach (as opposed to blurring) for
            // loading states of items which contain text is to use rectangles to replace the text instead
            // something like this: https://dribbble.com/shots/3826035-Loading-States-Shimmer
            // You'll see this effect on facebook.com if you scroll your feed fast. Blurring is actually quite uncommon.
            return (
              // FTL: The job cards should be extracted out into a component. Now you are rendering the job card
              // in two places, the actual one with the contents, and the placeholder. When you change one, you have 
              // to change the other for the loading state to make sense. You could create a new component JobCard, 
              // and has a prop called `blur`/`shimmer` which is set to true when you render the loading state.
              // This way, the layout between the actual and the loading state will be consistent.

              // FTL: Not sure if you're aware but the key only needs to be unique among
              // its siblings. So there's no need to add a prefix. You can just do `key={idx}`
              <div key={idx} className="loading-cell">
                <div className="job-title blur">Title (YC2020)</div>
                <div className="blur">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, ed
                </div>
                <div className="job-date-by">
                  <div className="job-date blur">01/01/2020</div>
                  <div className="user-profile blur">username</div>
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <button
            // FTL: Add cursor: pointer to buttons for better UX.
            // FTL: You typically also want to disable buttons whenever there's
            // a pending background request.
            className="button"
            onClick={async () => {
              // FTL: Use camelCase for variables in JavaScript
              const cached_jobs = JSON.parse(
                window.localStorage.getItem("hn_jobs")
              );
              // FTL: Your button shouldn't contain that much logic. It'd be
              // better to move the data fetching into a single module. You just
              // tell that module what data you need, and the module will return you 
              // the data without the caller caring or knowing how it's achieved.
              // In the module it will either fetch from the cache (localStorage)
              // or make a network request if it doesn't exist.
              if (cursor + MORE_LOADING_SIZE <= cached_jobs.cursor) {
                setJobs((currentJobs) =>
                  currentJobs.concat(
                    cached_jobs.jobs.slice(cursor, cursor + MORE_LOADING_SIZE)
                  )
                );
              } else {
                setLoading({ loading: true, nb: MORE_LOADING_SIZE });
                const newJobs = await fetchJobsMetadata(
                  cursor,
                  cursor + MORE_LOADING_SIZE
                );
                setLoading({ loading: false, nb: 0 });
                setJobs((currentJobs) => currentJobs.concat(newJobs));
              }

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
