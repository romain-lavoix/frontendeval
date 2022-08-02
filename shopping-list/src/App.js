import { useEffect, useState } from "react";
import { debounce } from "underscore";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (input.length > 1) {
      debounce(
        axios
          .get(`https://api.frontendeval.com/fake/food/${input}`)
          .then((res) => {
            setSearchResults(res.data);
          }),
        500
      );
    }
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
        <input
          type="text"
          value={input}
          onChange={(e) => {
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
          {searchResults.map((searchResult, searchResults_idx) => {
            return (
              <div
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
