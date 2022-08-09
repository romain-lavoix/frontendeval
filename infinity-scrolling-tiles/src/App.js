import React, { useState, useEffect, useRef } from "react";
import "./App.module.css";
import { KITTENS, PUPPIES, PAWS, PLAY } from "./constants";

const App = () => {
  const [buttonPressed, setButtonPressed] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const requestAnimationFrameRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  const step = (timestamp) => {
    const row1Step = 10 / 1000;
    const row2Step = 20 / 1000;

    row1Ref.current.style.transform = `translateX(-${row1Step * timestamp}px)`;
    row2Ref.current.style.transform = `translateX(-${row2Step * timestamp}px)`;

    if (!buttonPressed) {
      requestAnimationFrameRef.current = requestAnimationFrame(step);
    }
  };

  useEffect(() => {
    requestAnimationFrameRef.current = requestAnimationFrame(step);
  }, []);

  return (
    <div className="container">
      <div className="button-container">
        <button
          onClick={() => {
            setButtonPressed(!buttonPressed);
          }}
        >
          {buttonPressed ? PLAY : PAWS}
        </button>
      </div>
      <div
        ref={row1Ref}
        className="row row1-animation"
        style={{
          animationPlayState: buttonPressed ? "paused" : "running",
        }}
      >
        {PUPPIES.map((puppy) => {
          return (
            <div id="row1" key={puppy}>
              <img
                alt={"puppy"}
                src={puppy}
                className="image"
                onClick={() => setSelectedImage(puppy)}
              ></img>
            </div>
          );
        })}
      </div>
      <div
        ref={row2Ref}
        className="row row2-animation"
        style={{
          animationPlayState: buttonPressed ? "paused" : "running",
        }}
      >
        {KITTENS.map((kitten) => {
          return (
            <div id="row2" key={kitten}>
              <img
                alt={"kitten"}
                onClick={() => setSelectedImage(kitten)}
                src={kitten}
                className="image"
              ></img>
            </div>
          );
        })}
      </div>
      <div>
        <img
          alt={"selected image"}
          className="selected-image"
          src={selectedImage}
        ></img>
      </div>
    </div>
  );
};

export default App;
