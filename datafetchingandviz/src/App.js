import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [occs, setOccs] = useState([]);
  useEffect(() => {
    axios
      .get(
        "https://www.random.org/integers/?num=200&min=1&max=10&col=1&base=10&format=plain&rnd=new"
      )
      .then((res) => {
        // FTL: Nit - Use camelCase for variables.
        // FTL: It's more appropriate to use a hash map (Object) 
        // to tally counts.
        const occs_temp = [];
        res.data
          .split("\n")
          .map((elt) =>
            occs_temp[parseInt(elt)] === undefined
              ? (occs_temp[parseInt(elt)] = 1)
              : occs_temp[parseInt(elt)]++
          );
        setOccs(occs_temp);
      });
  }, []);

  let max = 0;
  // FTL: This can be done when the data is fetched
  // or with a reduce call.
  occs.forEach((occ) => {
    // FTL: max = Math.max(max, occ);
    // Alternatively, use `Math.max(res.data)`
    max = max > occ ? max : occ;
  });

  const x_unit = 1000 / max;
  // FTL: This unit is odd. 
  // Units should always be nice round numbers.
  const y_unit = max / 3;
  return occs.length ? (
    <div
      style={{
        display: "flex",
        margin: "25px",
        height: "1000px",
      }}
    >
      <div
        style={{
          marginRight: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {[max, Math.floor(y_unit * 2), Math.floor(y_unit), 0].map((elt) => {
          return (
            <div
              style={{
                fontWeight: "bold",
              }}
            >
              <div>{elt}</div>
            </div>
          );
        })}
      </div>
      <div id="graph">
        <div
          style={{
            width: "1000px",
            height: "1000px",
            borderColor: "black",
            borderLeftStyle: "solid",
            borderBottomStyle: "solid",
            display: "flex",
            alignItems: "flex-end",
            gap: "20px",
          }}
        >
          {occs.map((occ, point) => {
            const height = occ * x_unit;
            const top = 1050 - height;
            const left = point === 1 ? 50 : point * 100 - 50;
            return (
              <div
              id={point}
              style={{
                // FTL: It'd be better to use a % unit so that 
                // it's more responsive to different heights.
                height: `${height}px`,
                  width: "100px",
                  backgroundColor: "green",
                  // FTL: Look into just `justify-content: space-around`
                  // instead so that you don't need to do these arithmetic.
                  marginLeft: point === 1 ? "20px" : "unset",
                  marginRight: point === 10 ? "20px" : "unset",
                }}
              ></div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            gap: "20px",
            width: "1000px",
            marginTop: "10px",
          }}
        >
          {occs.map((occ, point) => {
            return (
              <div
                style={{
                  // FTL: Since these values need to be consistent with 
                  // the above to maintain the layout, it'd be better 
                  // to extract them out as common styles.
                  width: "100px",
                  marginLeft: point === 1 ? "20px" : "unset",
                  marginRight: point === 10 ? "20px" : "unset",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {point}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ) : (
    // FTL: Show an error message/empty state message.
    <></>
  );
}

export default App;
