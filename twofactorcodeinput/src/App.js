import { useState, createContext, useContext } from "react";

const AppContext = createContext();

function App() {
  const [state, setState] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
    focus: 0,
    backgroundColor: "white",
  });
  const authCodeTyped = `${state["0"]}${state["1"]}${state["2"]}${state["3"]}`;

  const { focus } = state;

  const authCode = "1448";

  const inputStyle = {
    flexGrow: "1",
    width: "1rem",
    textAlign: "center",
    height: "1rem",
  };

  const TwoFAInput = (props) => {
    const { state, setState } = useContext(AppContext);
    const { index } = props;

    return (
      <input
        disabled={index !== focus}
        id={index}
        style={inputStyle}
        value={state[index.toString()]}
        autoFocus={index === focus}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d$/.test(value)) {
            setState({
              ...state,
              [index]: value,
              focus: index + 1,
            });
          }
          if (/^\d{0}$/.test(value)) {
            setState({
              ...state,
              [index]: value,
            });
          }
        }}
        onKeyDown={(e) => {
          const value = e.target.value;
          if (e.keyCode === 8) {
            setState({
              ...state,
              [index]: value,
              focus: index - 1,
            });
          }
        }}
      ></input>
    );
  };

  return (
    <AppContext.Provider value={{ state, setState }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setState({
            ...state,
            backgroundColor: authCode === authCodeTyped ? "#90EE90" : "#ffcccb",
          });
        }}
      >
        <div
          style={{
            padding: "24px",
            margin: "12px",
            width: "10rem",
            height: "4rem",
            borderStyle: "solid",
            borderColor: "black",
            borderWidth: "1px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              width: "100%",
              marginBottom: "12px",
            }}
          >
            {[0, 1, 2, 3].map((index) => (
              <TwoFAInput key={index} index={index} />
            ))}
          </div>
          <div>
            <button
              key={focus}
              autoFocus={focus === 4}
              style={{ width: "100%", backgroundColor: state.backgroundColor }}
            >
              SUBMIT
            </button>
          </div>
        </div>
      </form>
    </AppContext.Provider>
  );
}

export default App;
