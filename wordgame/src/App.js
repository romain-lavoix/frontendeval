import { useState, useEffect, useRef } from "react";
import axios from "axios";
require("./App.css");

function App() {
  const [word, setWord] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [currentCell, setCurrentCell] = useState([0, 0]);
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
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      ar.push([i, j]);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
      onKeyDown={(e) => {
        const i = currentCell[0];
        const j = currentCell[1];
        if (/^[A-Za-z]$/.test(e.key)) {
          const copyLines = [...lines];
          if (copyLines[i][j] === "") {
            copyLines[i][j] = e.key.toUpperCase();
          } else if (j < 4) {
            copyLines[i][j + 1] = e.key.toUpperCase();
            setCurrentCell([i, j + 1]);
          }
          setLines(copyLines);
        } else if (e.key === "Backspace") {
          const copyLines = [...lines];
          copyLines[i][j] = "";
          setLines(copyLines);
          setCurrentCell([i, j ? j - 1 : j]);
        } else if (e.key === "Enter") {
        }
      }}
      tabIndex={-1}
    >
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
          let focused = false;
          if (i === currentCell[0] && j === currentCell[1]) {
            focused = true;
          }
          const key = `${i}-${j}`;
          return (
            <div
              key={key}
              style={{
                display: "flex",
                fontWeight: "bold",
                fontSize: "24px",
                alignItems: "center",
                justifyContent: "center",
                borderColor: focused ? "grey" : "grey",
                borderStyle: "solid",
                borderWidth: lines[i][j] !== "" ? "2px" : "1px",
              }}
            >
              <div>{lines[i][j]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
