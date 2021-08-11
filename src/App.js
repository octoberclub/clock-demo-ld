import { useState, useEffect } from 'react';
import { withLDProvider, withLDConsumer } from 'launchdarkly-react-client-sdk'

import './App.css';

const Clock = ({hours, minutes, seconds}) => {
  const secondsDegrees = ((seconds / 60) * 360) + 90;
  const minDegrees = ((minutes / 60) * 360) + 90;
  const hourDegrees = ((hours / 12) * 360) + 90;

  return (
    <div class="clock">
      <div class="clock-face">
        <div class="hand hour-hand" style={{transform: `rotate(${hourDegrees}deg)`}}></div>
        <div class="hand min-hand"  style={{transform: `rotate(${minDegrees}deg)`}}></div>
        <div class="hand second-hand"  style={{transform: `rotate(${secondsDegrees}deg)`}}></div>
      </div>
    </div>  
  );
};

const TimeZonePicker = ({flags, selected, setTimeZone}) => {
  if(!flags.showTimeZonePicker) return null;

  const data=[
    {
      country:"NEW YORK",
      timeZone:"America/New_York",
    },
    {
      country:"LONDON",
      timeZone:"Europe/London"
    },
    {
      country:"BANGKOK",
      timeZone:"Asia/Bangkok"
    },
    {
      country:"TAIWAN",
      timeZone:"Asia/Taipei"
    },
    {
      country:"SYDNEY",
      timeZone:"Australia/Sydney"
    }
  ];

  return (
    <ul>
      {
        data.map(d => (
          <li 
            style={{
              color: d.timeZone===selected ? 'green' : 'grey',
              cursor: 'pointer',
            }}
            onClick={() => {
              setTimeZone(d.timeZone);
            }}
          >{d.country}: {d.timeZone}</li>
        ))
      }
    </ul>
  );
}

const LDTimeZonePicker = withLDConsumer()(TimeZonePicker);

function App() {
  const [timeZone, setTimeZone] = useState("Europe/London");
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timerId = setInterval(()=>setTime(new Date()), 1000);

    return () => {
      clearInterval(timerId);
    };
  });

  return (
    <div className="App">
      <header className="App-header">
        <small>You are running this application in <b>{process.env.NODE_ENV}</b> mode.</small>
        
        <Clock
          hours={time.toLocaleTimeString('en', {timeZone, hour: 'numeric', hour12: false})}
          minutes={time.toLocaleTimeString('en', {timeZone, minute: 'numeric'})} 
          seconds={time.toLocaleTimeString('en', {timeZone, second: 'numeric'})}
        />

        <LDTimeZonePicker
          selected={timeZone}
          setTimeZone={setTimeZone}
        />       

        <div>
          <p>{time.toLocaleTimeString('en', {timeZone})}</p>
        </div>
      </header>
    </div>
  );
}


export default withLDProvider({
  clientSideID: 'xyz', // insert client id from LaunchDarkly here
  user: {
    "key": "abcdefg",
    "name": "Grace Hopper",
    "email": "grace.happer@example.com"
  },
  options: { /* ... */ }
})(App);
