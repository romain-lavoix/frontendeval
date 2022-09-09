import { useState, useContext, createContext } from "react";
import cx from "classnames";

function NextButton() {
  // FTL: It's not a good to pass the entire application
  // state around. This button only needs to tell the parent
  // it is being clicked. The logic to increment the step
  // can be done within the parent.
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
  // FTL: It's not a good to pass the entire application
  // state around. This button only needs to tell the parent
  // it is being clicked. The logic to increment the step
  // can be done within the parent.
  const { state, setState } = useContext(AppContext);
  return (
    // FTL: Recommend using a button instead.
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
      {/* Use aria-hidden around the "<" otherwise screen
      readers will read out the link as "Less than back" */}
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
      {/* FTL: You can put the button outside the step components instead
      and let the app control the visibility. */}
      <BackButton hidden />
      {/* FTL: Use ids to link up the label and input fields.
       FTL: React 18 has a new useId() hook which can be used for such
       purposes. Reason to use this hook is that hardcoding static ids
       makes the component less reusable. */}
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
      {/* FTL: Likewise, the Next and Submit buttons can be put outside the step components instead
      and let the app control when to show which. 
      
      Imagine you had a new step to add/existing step to remove, you'd have to modify the existing Step components
      and shift the buttons in/out of the steps. */}
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
        // FTL: Nit, the placeholder should be mm/dd/yy.
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
        // FTL: Password fields don't need placeholders.
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
    // FTL: Better to separate out the step number vs the form data.
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
    // FTL: Context is not needed given you can pass them as props.
    // General tip: In interview settings given the amount of time you have
    // you usually won't need to build applications which are complex/big enough
    // that you need to use context.
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
