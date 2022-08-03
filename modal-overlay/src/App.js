import { useEffect, useState } from "react";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [offerAccepted, setOfferAccepted] = useState(false);

  return (
    <>
      <div
        id="overlay"
        style={{
          display: showModal ? "unset" : "none",
          position: "fixed",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          cursor: "pointer",
        }}
      ></div>
      <div
        id="modal"
        style={{
          display: showModal ? "flex" : "none",
          position: "fixed",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "10px",
          zIndex: 1,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "300px",
          height: "200px",
          overflow: "auto",
          borderColor: "black",
          borderStyle: "solid",
          backgroundColor: "white",
        }}
      >
        <div>
          <button
            style={{ marginTop: "10px" }}
            onClick={() => setShowModal(false)}
          >
            X
          </button>
        </div>
        <div>Click the button below to accept our amazing offer !</div>
        <div style={{ textAlign: "center" }}>
          <button
            style={{ marginBottom: "10px" }}
            onClick={() => {
              setOfferAccepted(true);
              setShowModal(false);
            }}
          >
            Accept Offer
          </button>
        </div>
      </div>
      <div
        id="main"
        style={{
          height: "200vh",
        }}
      >
        <div
          id="offer_container"
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {offerAccepted ? (
            <div>Offer accepted !</div>
          ) : (
            <button onClick={() => setShowModal(!showModal)}>Show offer</button>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
