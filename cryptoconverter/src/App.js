import { useEffect, useReducer, useRef } from "react";
import { debounce } from "underscore";

const reducer = (state, action) => {
  console.log(`${action.type} ${action.payload}`);
  switch (action.type) {
    case "SET_FIAT_AMOUNT":
      return {
        ...state,
        fiatAmount: action.payload,
      };
    case "SET_WUC_AMOUNT":
      return {
        ...state,
        wucAmount: action.payload,
      };
    case "SET_WUC_AMOUNT_AND_PRICE_CHANGE":
      return {
        ...state,
        wucAmount: action.payload,
        priceChange: action.payload - state.wucAmount,
      };
    case "SET_CURRENCY":
      return {
        ...state,
        currency: action.payload,
      };
    default:
      return state;
  }
};

function App() {
  const currencies = ["USD", "EUR", "GBP", "CNY", "JPY"];
  const [state, dispatch] = useReducer(reducer, {
    fiatAmount: "",
    wucAmount: "",
    currency: "USD",
    priceChange: null,
  });

  const intervalRef = useRef();
  const fiatAmountRef = useRef(null);
  const currencyRef = useRef(null);
  const debFetch = debounce(() => {
    fetch(
      `https://api.frontendeval.com/fake/crypto/${state.currency.toLowerCase()}`
    )
      .then((response) => response.json())
      .then((data) => {
        dispatch({
          type: "SET_WUC_AMOUNT",
          payload: parseInt(state.fiatAmount) * data.value,
        });

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
          // Should I use refs instead of state here ??
          fetch(
            `https://api.frontendeval.com/fake/crypto/${currencyRef.current.value.toLowerCase()}`
          )
            .then((response) => response.json())
            .then((data) => {
              dispatch({
                type: "SET_WUC_AMOUNT_AND_PRICE_CHANGE",
                payload: parseInt(fiatAmountRef.current.value) * data.value,
              });
            });

          return () => {
            clearInterval(intervalRef.current);
          };
        }, 3000);
      });
  }, 300);

  return (
    <div style={{ margin: "50px", width: "400px" }}>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <form>
          <input
            ref={fiatAmountRef}
            type="text"
            name="fiat"
            value={state.fiatAmount}
            placeholder={1000}
            autoFocus={true}
            onChange={(e) => {
              dispatch({
                type: "SET_FIAT_AMOUNT",
                payload: parseInt(e.target.value),
              });
              debFetch();
            }}
            style={{
              marginRight: "10px",
              width: "5rem",
              textAlign: "center",
            }}
          ></input>
          <select
            ref={currencyRef}
            value={state.currency}
            onChange={(e) => {
              dispatch({ type: "SET_CURRENCY", payload: e.target.value });
              if (state.fiatAmount !== "") {
                debFetch();
              }
            }}
          >
            {currencies.map((currency) => {
              return <option key={currency}>{currency}</option>;
            })}
          </select>
        </form>
      </div>
      {state.wucAmount && (
        <div
          style={{
            textAlign: "center",
            display: "flex",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <div>{state.wucAmount.toFixed(2)}</div>
          <div>WUC</div>
          {state.priceChange && (
            <div
              style={{
                color: state.priceChange >= 0 ? "green" : "red",
              }}
            >
              {`${
                state.priceChange >= 0 ? "↑" : "↓"
              } ${state.priceChange.toFixed(2)}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
