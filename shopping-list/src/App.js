import { useEffect, useState } from "react";
import { debounce } from "underscore";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (input.length > 1) {
      // FTL: Your debouncing is actually incorrect. You need to create a
      // debounced function of the API request and repeatedly call it.
      //
      // The debounce() call should take in a function that calls the API, but instead
      // you're calling the API request within a debounce() call.
      //
      // As a result, none of the API requests are debounced at all.
      debounce(
        axios
          // FTL: Use encodeURIComponent for better security.
          .get(`https://api.frontendeval.com/fake/food/${input}`)
          .then((res) => {
            setSearchResults(res.data);
          }),
        500
      );
    }
    // FTL: Suggest adding `else { setSearchResults([]); }`
  }, [input, setInput]);

  return (
    <div
      id="main"
      style={{
        width: "fit-content",
        display: "flex",
        borderColor: "black",
        borderStyle: "solid",
        flexDirection: "column",
        gap: "10px",
        padding: "24px",
      }}
    >
      {/* FTL: Use h1 to denote the title of the page. */}
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        My shopping List
      </div>
      <div>
        {/* FTL: Tip - Use input="search" to get a nice cross button at the end 
        which can clear out the input value. */}
        <input
          type="text"
          value={input}
          onChange={(e) => {
            // FTL: When the input clears, the suggestions should be removed as well.
            setInput(e.target.value);
          }}
        />
      </div>
      {searchResults.length ? (
        <div
          style={{
            borderColor: "grey",
            borderStyle: "solid",
            width: "100%",
            padding: "2px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {/* FTL: There probably isn't enough time during interviews to do it properly
           but the autocomplete list should be more more accessible, at the very least
           it should be tabbable/focusable, by adding tabIndex={0}.
           Some other things to add: 
           - Keyboard interaction to allow traversing the list up/down
           - Using more semantic HTML elements like ul/li or aria-role="list"
           - Defining a relation between the input and the list of results
           
           Read about this ARIA pattern here: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/combobox_role */}
          {searchResults.map((searchResult, searchResults_idx) => {
            return (
              <div
                tabIndex={0}
                key={searchResults_idx}
                onClick={(e) => {
                  setItems((old_items) => [
                    ...old_items,
                    { value: searchResult, checked: false },
                  ]);
                }}
              >
                {searchResult}
              </div>
            );
          })}
        </div>
      ) : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        {/* FTL: Using index as ID here works but if we do everything correctly (aka 
            using checkboxes for the cross or the checkmark), it won't work.
            
            In general, avoid using index as key as there are too many pitfalls 
            with doing that. It's only ok to use index as key if the contents 
            don't change at all, which is not the case here.
            Instead, generate a incrementing ID to use as the key.*/}
        {items.map((item, items_idx) => {
          return (
            <div
              key={items_idx}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                color: item.checked ? "grey" : "unset",
              }}
              onClick={(e) => {}}
            >
              <div
                style={{
                  display: "flex",
                  gap: "2px",
                  textDecoration: item.checked ? "line-through" : "unset",
                }}
              >
                <div
                  onClick={() => {
                    // FTL: Ideally we use a checkbox for this interaction,
                    // even though it will go against the specifications.
                    // This element also needs to be made focusable with tabIndex={0}.
                    // and should add a role="button" or role="checkbox" with aria-checked={true/boolean}
                    // Refer to https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/checkbox_role
                    const newItems = [...items];
                    items[items_idx].checked = !items[items_idx].checked;
                    setItems(newItems);
                  }}
                >
                  ✓
                </div>
                <div>{item.value}</div>
              </div>
              <div
                style={{ textAlign: "right" }}
                onClick={() => {
                  // FTL: Same comments regarding accessibility as per above.
                  const newItems = [...items];
                  newItems.splice(items_idx, 1);
                  setItems(newItems);
                }}
              >
                X
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
