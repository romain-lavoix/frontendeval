import { useState, createContext, useContext } from "react";

// FTL: You don't need context if it's just within one component.
const AppContext = createContext();

function App() {
  const [state, setState] = useState({
    // FTL: Not great design to mix up the value fields with
    // the other fields. They should be nested under another key.

    // FTL: Your component is not very reusable given that the
    // user cannot easily make the number of digits customizable.
    // There are too many places which hardcode the logic for a
    // 4-value input.
    0: "",
    1: "",
    2: "",
    3: "",
    focus: 0,
    // FTL: Instead of putting the background color in state,
    // record the validation status of the component instead.
    // Separate the data model vs the presentation.
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

  // FTL: Declare components outside, otherwise you're recreating
  // the function on every render, which is unnecessary.
  const TwoFAInput = (props) => {
    // FTL: Context is unnecessary here because:
    // - You can pass state as props since it's only one level
    // - You declared this component within the App component
    //   and it has access to the component state.
    const { state, setState } = useContext(AppContext);
    const { index } = props;

    return (
      <input
        // FTL: There's a bug now where I cannot change
        // any previously-typed fields because they're being disabled.
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
          // FTL: Better to define the enum as a constant
          // so that readers (and even for yourself) know what
          // key this keyCode is for.
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

  // FTL: The appearance of the UI looks ok, but
  // remember that inline styles are not recommended.
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
            {/* Array(4).fill(null) is better */}
            {[0, 1, 2, 3].map((index) => (
              <TwoFAInput key={index} index={index} />
            ))}
          </div>
          <div>
            <button
              // FTL: Why do you need key here?
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
