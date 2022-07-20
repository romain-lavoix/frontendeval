import { useState, useContext, createContext } from "react";
import cx from "classnames";

function NextButton() {
  const { state, setState } = useContext(AppContext);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        setState({
          ...state,
          step: ++state.step,
        });
      }}
      style={{
        width: "fit-content",
      }}
    >
      Next
    </button>
  );
}

function BackButton(props) {
  const { state, setState } = useContext(AppContext);
  return (
    <a
      style={{
        visibility: props.hidden ? "hidden" : "unset",
        width: "fit-content",
        color: "blue",
        marginBottom: "8px",
      }}
      onClick={(e) => {
        e.preventDefault();
        setState({
          ...state,
          step: --state.step,
        });
      }}
    >
      {`< Back`}
    </a>
  );
}

const stepStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  alignContent: "center",
};

function Step1() {
  const { state, setState } = useContext(AppContext);

  return (
    <div id={"screen1"} style={stepStyle}>
      <BackButton hidden />
      <label>Name</label>
      <input
        type={"text"}
        name={"name"}
        value={state.name}
        placeholder={"name"}
        onChange={(e) =>
          setState({
            ...state,
            name: e.target.value,
          })
        }
      />
      <NextButton />
    </div>
  );
}

function Step2(props) {
  const { state, setState } = useContext(AppContext);

  return (
    <div id={"screen2"} style={stepStyle}>
      <BackButton />
      <label>Email</label>
      <input
        placeholder="email"
        type="email"
        name={"email"}
        value={state.email}
        onChange={(e) =>
          setState({
            ...state,
            email: e.target.value,
          })
        }
      />
      <NextButton />
    </div>
  );
}

function Step3(props) {
  const { state, setState } = useContext(AppContext);

  return (
    <div id={"screen3"} style={stepStyle}>
      <BackButton />
      <label>Birthday</label>
      <input
        placeholder="birthday"
        type="date"
        name="birthday"
        value={state.birthday}
        onChange={(e) =>
          setState({
            ...state,
            birthday: e.target.value,
          })
        }
      />
      <NextButton />
    </div>
  );
}

function Step4(props) {
  const { state, setState } = useContext(AppContext);

  return (
    <div id={"screen4"} style={stepStyle}>
      <BackButton />
      <label>Password</label>
      <input
        placeholder="password"
        type="password"
        name="password"
        value={state.password}
        onChange={(e) =>
          setState({
            ...state,
            password: e.target.value,
          })
        }
      />
      <input type="submit" />
    </div>
  );
}

const AppContext = createContext();

function MultiStepForm() {
  const [state, setState] = useState({
    step: 1,
    name: "",
    emails: "",
    birthday: "",
    password: "",
  });

  const onSubmit = (data) => alert(data);

  const handleSubmit = () => {
    alert(`${state.name} ${state.birthday} ${state.email} ${state.password}`);
  };

  return (
    <AppContext.Provider value={{ state, setState }}>
      <div
        style={{
          width: "200px",
          height: "150px",
          padding: "24px",
          margin: "8px",
          outlineColor: "black",
          outlineStyle: "solid",
          display: "flex",
          alignContent: "center",
        }}
      >
        <div style={{ flexGrow: "1" }}>
          <form
            onChange={(e) => {
              e.preventDefault();
            }}
            onSubmit={handleSubmit}
          >
            {state.step === 1 && <Step1 />}
            {state.step === 2 && <Step2 />}
            {state.step === 3 && <Step3 />}
            {state.step === 4 && <Step4 />}
          </form>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default MultiStepForm;
