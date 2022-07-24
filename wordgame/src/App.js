import { useState, useEffect, useRef } from "react";
import axios from "axios";
require("./App.css");

function App() {
  // FTL: In general, games have lots of complex state
  // and using useReducer() with the action/reducer pattern 
  // would be more appropriate.
  const [word, setWord] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [currentCell, setCurrentCell] = useState([0, 0]);
  const [message, setMessage] = useState("");
  // FTL: Initial state can be created outside of the component since it's constant.
  // FTL: Should try to reduce the code duplication.
  const [lines, setLines] = useState([
    [
      { c: "", p: 0 },
      { c: "", p: 0 },
      { c: "", p: 0 },
      { c: "", p: 0 },
      { c: "", p: 0 },
    ],
    [
      { c: "", p: 0 },
      { c: "", p: 0 },
      { c: "", p: 0 },
      { c: "", p: 0 },
      { c: "", p: 0 },
    ],
    [
      { c: "", p: 0 },
      { c: "", p: 0 },
      { c: "", p: 0 },
      { c: "", p: 0 },
      { c: "", p: 0 },
    ],
    [
      { c: "", p: 0 },
      { c: "", p: 0 },
      { c: "", p: 0 },
      { c: "", p: 0 },
      { c: "", p: 0 },
    ],
    [
      { c: "", p: 0 },
      { c: "", p: 0 },
      { c: "", p: 0 },
      { c: "", p: 0 },
      { c: "", p: 0 },
    ],
    [
      { c: "", p: 0 },
      { c: "", p: 0 },
      { c: "", p: 0 },
      { c: "", p: 0 },
      { c: "", p: 0 },
    ],
  ]);
  const ref = useRef();

  useEffect(() => {
    // FTL: These days browser fetch() is good enough, no need for axios.
    axios.get("https://api.frontendeval.com/fake/word").then((response) => {
      setWord(response.data);
    });
    ref.current.focus();
  }, []);

  const ar = [];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      ar.push([i, j]);
    }
  }

  const setMessageWithTimeout = (message) => {
    setMessage(message);
    // FTL: Timeouts should always be cleared. Otherwise for multi-page apps,
    // if you navigate away from the page and the component is unmounted, 
    // there will be an error "cannot set state on unmounted component" or something.
    // This applies to async stuff - network requests, timeout.
    // Read more - https://stackoverflow.com/questions/53949393/cant-perform-a-react-state-update-on-an-unmounted-component
    // For clearing timeouts, you can create a useTimeout hook like https://www.30secondsofcode.org/react/s/use-timeout
    setTimeout(() => setMessage(""), 3000);
  };

  const verifyGuess = async (guess) => {
    return axios
      .post("https://api.frontendeval.com/fake/word/valid", {
        word: guess,
      })
      .then((response) => {
        if (response.data === false) {
          return {
            valid: false,
            found: false,
          };
        } else {
          // FTL: By doing this you're only performing a shallow clone here
          // but you're mutating the inner nested array.
          // It's better to do a deep clone, you can then mutate however 
          // you like. You can use lodash's deepClone or use an immutable
          // library like immer.
          const copyLines = [...lines];
          guess.split("").forEach((letter, idx) => {
            if (letter === word[idx]) {
              // FTL: Use enums over raw integer values for representating 
              // enumerated state. You could do something like
              // const RIGHT_POSITION = 1;
              // const WRONG_POSITION = 2;
              // const LETTER_NOT_IN_WORD = 3;

              // letter in the right position
              copyLines[currentLine][idx].p = 1;
            } else if (word.includes(letter)) {
              // letter in word, but not right position
              copyLines[currentLine][idx].p = 2;
            } else {
              // letter not in word
              copyLines[currentLine][idx].p = 3;
            }
          });
          setLines(copyLines);

          // FTL: The following can be simplified into one single line.
          // return { valid: true, found: guess === word }
          if (guess === word) {
            // FTL: What is this line for?
            const copyLines = [...lines];

            return {
              valid: true,
              found: true,
            };
          } else {
            return {
              valid: true,
              found: false,
            };
          }
        }
      })
      .catch((error) => false);
  };

  return (
    <div
      ref={ref}
      // FTL: Use CSS modules or just raw CSS. Inline styles should be avoided
      // especially for elements which are rendered multiple times.
      style={{
        display: "flex",
        width: "98vw",
        height: "80vh",
        justifyContent: "center",
        alignItems: "center",
      }}
      onKeyDown={async (e) => {
        const i = currentCell[0];
        const j = currentCell[1];
        if (/^[A-Za-z]$/.test(e.key)) {
          const copyLines = [...lines];
          if (copyLines[i][j].c === "") {
            copyLines[i][j].c = e.key.toUpperCase();
          } else if (j < 4) {
            copyLines[i][j + 1].c = e.key.toUpperCase();
            setCurrentCell([i, j + 1]);
          }
          setLines(copyLines);
        } else if (e.key === "Backspace") {
          const copyLines = [...lines];
          copyLines[i][j].c = "";
          setLines(copyLines);
          setCurrentCell([i, j ? j - 1 : j]);
        } else if (e.key === "Enter") {
          const guess = lines[currentLine]
            .map((elt) => elt.c)
            .join("")
            .toLowerCase();

          if (guess.length !== 5) {
            setMessageWithTimeout("not enough letters");
          } else {
            const results = await verifyGuess(guess);
            if (!results.valid) {
              setMessageWithTimeout("this word is not in the dictionary");
            } else if (results.found) {
              setMessage(
                `You correctly guessed the word in ${currentLine + 1} tr${
                  currentLine ? "ies" : "y"
                }!`
              );
            } else {
              const remainingTries = 6 - (currentLine + 1);
              if (remainingTries) {
                setMessage(`You have ${remainingTries} guesses remaining`);
                setCurrentLine(currentLine + 1);
                setCurrentCell([currentLine + 1, 0]);
              } else {
                setMessage(`The word was '${word}'`);
              }
            }
          }
        }
      }}
      tabIndex={-1}
      onBlur={() => {
        ref.current.focus();
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "50px",
          margin: "5px",
        }}
      >
        {/* FTL: message is not always being rendered, so it'd be better
        to conditionally render this <div> based on whether message is a truthy value. */}
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {message}
        </div>
        <div
          style={{
            // FTL: Good use of Grid!
            display: "grid",
            width: "25rem",
            height: "20rem",
            justifyContent: "center",
            justifyItems: "stretch",
            gridTemplateColumns: "repeat(5, 1fr)",
            gridTemplateRows: "repeat(6, 1fr)",
            columnGap: "10px",
            rowGap: "10px",
          }}
        >
          {ar.map((elt) => {
            const i = elt[0];
            const j = elt[1];
            const empty = !lines[i][j].c.length;
            let focused = false;
            if (i === currentCell[0] && j === currentCell[1]) {
              focused = true;
            }
            const key = `${i}-${j}`;
            let backgroundColor = "none";
            // FTL: Using enums like I mentioned above will greatly improve the
            // code readability here.
            if (lines[i][j].p === 1) {
              backgroundColor = "lightgreen";
            } else if (lines[i][j].p === 2) {
              backgroundColor = "#FED8B1";
            } else if (lines[i][j].p === 3) {
              backgroundColor = "lightgrey";
            }
            return (
              // FTL: Using inline styles for repeated elements will bloat up the DOM.
              // Inspect the DOM to see the repeated styles all over.
              <div
                key={key}
                style={{
                  display: "flex",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: focused && !empty ? "grey" : "lightgrey",
                  borderStyle: "solid",
                  borderWidth: "2px",
                  backgroundColor,
                }}
              >
                <div>{lines[i][j].c}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
