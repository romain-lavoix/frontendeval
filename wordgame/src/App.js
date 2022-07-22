import { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [word, setWord] = useState("");
  const [trial, setTrial] = useState(0);
  const [autoFocus, setAutoFocus] = useState([0, 0, 0]);
  const [lines, setLines] = useState([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);

  useEffect(() => {
    axios.get("https://api.frontendeval.com/fake/word").then((response) => {
      setWord(response.data);
    });
  }, []);

  const guess = (word) => {
    axios
      .post("https://api.frontendeval.com/fake/word/valid", {
        word,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ar = [];
  const refs = [];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      ar.push([i, j]);
    }
  }

  const incrementAutoFocus = () => {
    const i = autoFocus[0];
    const j = autoFocus[1];
    const k = autoFocus[2];

    if (j <= 3) {
      setAutoFocus([i, j + 1, k + 1]);
    } else if (j === 4) {
      if (i <= 4) {
        setAutoFocus([i + 1, 0, k + 1]);
      } else if (i === 5) {
        // stop
      }
    }
  };

  const decrementAutoFocus = () => {
    const i = autoFocus[0];
    const j = autoFocus[1];
    const k = autoFocus[2];

    if (j > 0) {
      setAutoFocus([i, j - 1, k + 1]);
    } else if (j === 0) {
      if (i > 0) {
        setAutoFocus([i - 1, 4, k + 1]);
      } else if (i === 0) {
        // stop
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "99vw",
        height: "80vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form>
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
            let isAutoFocused = false;
            if (i === autoFocus[0] && j === autoFocus[1]) {
              isAutoFocused = true;
            }
            const key = `${i}-${j}-${autoFocus[2]}`;
            return (
              <input
                id={key}
                key={key}
                type="text"
                maxLength={1}
                autoFocus={isAutoFocused}
                value={lines[i][j]}
                onBlur={(e) => {
                  document.getElementById(key).focus();
                }}
                onChange={(e) => {
                  e.preventDefault();
                  if (/^[A-Za-z]/.test(e.target.value)) {
                    const copyLines = [...lines];
                    copyLines[i][j] = e.target.value.toUpperCase();
                    setLines(copyLines);
                    if (e.target.value.length !== 0 && trial === i && j !== 4) {
                      incrementAutoFocus();
                    }
                  }
                }}
                onKeyDown={(e) => {
                  // e.preventDefault();
                  if (e.code === "Backspace") {
                    const copyLines = [...lines];
                    copyLines[i][j] = "";
                    setLines(copyLines);
                    decrementAutoFocus();
                  }
                  if (e.code === "Enter") {
                    const guess = lines[i].slice(0, 5).join("");
                    console.log(guess);
                  }
                }}
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "24px",
                  caretColor: "transparent",
                }}
              ></input>
            );
          })}
        </div>
      </form>
    </div>
  );
}

export default App;
