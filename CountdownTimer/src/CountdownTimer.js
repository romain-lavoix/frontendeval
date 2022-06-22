/*
 * https://frontendeval.com/questions/countdown-timer
 *
 * Create a countdown timer that notifies the user
 */
import React, { useEffect, useState } from "react";
// var classNames = require("classnames");

const CountdownTimer = () => {
  const [started, setStarted] = useState(false);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [paused, setPaused] = useState(false);
  const [myInterval, setMyInterval] = useState();
  const [time, setTime] = useState(-1);

  const tick = () => {
    setTime((prevTime) => prevTime - 1);
  };

  useEffect(() => {
    let promise = Notification.requestPermission();
  }, []);

  useEffect(() => {
    if (started) {
      setTime(
        parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)
      );
      setMyInterval(setInterval(tick, 1000));
    } else {
      setHours("");
      setMinutes("");
      setSeconds("");
      clearInterval(myInterval);
    }
  }, [started]);

  useEffect(() => {
    if (paused && started) {
      clearInterval(myInterval);
    } else if (!paused && started) {
      setMyInterval(setInterval(tick, 1000));
    }
  }, [paused]);

  useEffect(() => {
    if (time === -1) {
      return;
    }
    if (time === 0) {
      setStarted(false);
      if (Notification.permission === "granted") {
        let notification = new Notification("The timer is over");
      } else {
        alert("The time is over");
      }
      return;
    }
    let temp_time = time;
    const h = Math.floor(temp_time / 3600);
    setHours(h < 10 ? `0${h} ` : `${h}`);
    temp_time -= h * 3600;
    const m = Math.floor(temp_time / 60);
    setMinutes(m < 10 ? `0${m} ` : `${m}`);
    temp_time -= m * 60;
    setSeconds(temp_time < 10 ? `0${temp_time}` : `${temp_time}`);
  }, [time]);

  return (
    <div style={{ padding: "8px" }}>
      <h1>Countdown timer</h1>
      <form
        onChange={(e) => {
          e.preventDefault();
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            id="hours"
            name="hours"
            placeholder="HH"
            maxLength="2"
            value={hours}
            onChange={(e) => {
              const h = e.target.value;
              setHours(h.length === 1 ? `0${h}` : `${h}`);
            }}
            style={{ width: "2em", textAlign: "center" }}
            disabled={started}
          />
          <span>:</span>
          <input
            id="minutes"
            name="minutes"
            placeholder="MM"
            maxLength="2"
            value={minutes}
            onChange={(e) => {
              const m = e.target.value;
              setMinutes(m.length === 1 ? `0${m}` : `${m}`);
            }}
            style={{ width: "2em", textAlign: "center" }}
            disabled={started}
          />
          <span>:</span>
          <input
            id="seconds"
            name="seconds"
            placeholder="SS"
            maxLength="2"
            value={seconds}
            onChange={(e) => {
              const s = e.target.value;
              setSeconds(s.length === 1 ? `0${s}` : `${s}`);
            }}
            style={{ width: "2em", textAlign: "center" }}
            disabled={started}
          />
          {started ? (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setPaused(!paused);
                }}
              >
                {" "}
                {paused ? "Start" : "Pause"}{" "}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setStarted(false);
                }}
              >
                {" "}
                Reset{" "}
              </button>
            </>
          ) : (
            <button onClick={() => setStarted(!started)}> Start </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CountdownTimer;
