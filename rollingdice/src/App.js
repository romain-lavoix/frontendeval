import { useState } from "react";

function App() {
  const [nbDices, setNbDices] = useState(0);
  const [dices, setDices] = useState([]);

  return (
    <div
      id="main container"
      style={{
        display: "flex",
        justifyContent: "center",
        width: "800px",
        borderColor: "black",
        borderStyle: "solid",
        padding: "24px",
      }}
    >
      <div
        id="main"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "stretch",
        }}
      >
        <div style={{ textAlign: "center", fontWeight: "bold" }}>
          Number of dice
        </div>
        <div>
          <input
            style={{
              width: "-webkit-fill-available",
            }}
            type="number"
            placeholder="number of dices"
            value={nbDices}
            onChange={(e) => setNbDices(parseInt(e.target.value))}
          />
        </div>
        <div>
          <button
            style={{ width: "100%" }}
            onClick={(e) => {
              e.preventDefault();
              const newDices = [];
              for (let i = 0; i < nbDices; i++) {
                newDices.push(Math.floor(Math.random() * 6) + 1);
              }
              setDices(newDices);
            }}
          >
            Roll
          </button>
        </div>
        <div
          id="dices"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(3, 100px)`,
            justifyContent: "center",
            alignItems: "stretch",
            gridTemplateRows: `repeat(${Math.ceil(nbDices / 3)}, 100px)`,
            columnGap: "10px",
            rowGap: "10px",
          }}
        >
          {dices.map((dice, idx) => {
            return (
              <div
                key={`dice-${idx}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gridTemplateRows: "repeat(3, 1fr)",
                  borderColor: "black",
                  borderStyle: "solid",
                  justifyItems: "center",
                  alignItems: "stretch",
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => {
                  let visible = false;
                  if (dice === 1 && number === 5) {
                    visible = true;
                  }
                  if (dice === 2 && [3, 7].includes(number)) {
                    visible = true;
                  }
                  if (dice === 3 && [3, 5, 7].includes(number)) {
                    visible = true;
                  }
                  if (dice === 4 && [1, 3, 7, 9].includes(number)) {
                    visible = true;
                  }
                  if (dice === 5 && [1, 3, 5, 7, 9].includes(number)) {
                    visible = true;
                  }
                  if (dice === 6 && [1, 3, 4, 6, 7, 9].includes(number)) {
                    visible = true;
                  }
                  return (
                    <div
                      key={`dice-${idx}-face${number}`}
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                      }}
                    >
                      {visible ? "." : ""}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
