import { useState, useEffect, useRef } from "react";
import axios from "axios";
require("./App.css");

function App() {
  const [word, setWord] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [currentCell, setCurrentCell] = useState([0, 0]);
  const [message, setMessage] = useState("");
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
          const copyLines = [...lines];
          guess.split("").forEach((letter, idx) => {
            if (letter === word[idx]) {
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

          if (guess === word) {
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
                `You correctly guessed the word in ${currentLine + 1} tries!`
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
          gap: "50px",
          margin: "12px",
        }}
      >
        <div
          style={{ alignSelf: "center", fontSize: "24px", fontWeight: "bold" }}
        >
          {message}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 66px)",
            gridTemplateRows: "repeat(6, 66px)",
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
            if (lines[i][j].p === 1) {
              backgroundColor = "lightgreen";
            } else if (lines[i][j].p === 2) {
              backgroundColor = "#FED8B1";
            } else if (lines[i][j].p === 3) {
              backgroundColor = "lightgrey";
            }
            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  fontWeight: "bold",
                  fontSize: "24px",
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
