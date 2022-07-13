import { useEffect, useRef, useState } from "react";
import "./App.css";
import "react-piano/dist/styles.css";
import { Piano } from "./piano";
import { PianoPlayer } from "./piano-player";

const WAVE_FORMS = ["sawtooth", "sine", "square", "triangle", "custom"];

function App() {
  const [audioContext, setAudioContext] = useState<AudioContext>();
  const [masterGainNode, setMasterGainNode] = useState<GainNode>();
  const [gain, setGain] = useState(0.5);
  const [vibratoFrequency, setVibratoFrequency] = useState(0);
  const [vibratoRange, setVibratoRange] = useState(0);
  const [waveForm, setWaveForm] = useState(0);

  useEffect(() => {
    if (audioContext) {
      const gainNode = audioContext.createGain();
      setMasterGainNode(gainNode);
      gainNode.connect(audioContext?.destination);
    }
  }, [audioContext]);
  useEffect(() => {
    if (masterGainNode) {
      masterGainNode.gain.setValueAtTime(gain, 0);
    }
  }, [gain, masterGainNode]);
  return (
    <div className="App">
      {!audioContext && (
        <button
          onClick={() => {
            setAudioContext(new AudioContext());
          }}
        >
          Init piano keyboard
        </button>
      )}
      {audioContext && masterGainNode && (
        <>
          <PianoPlayer
            audioContext={audioContext}
            outputNode={masterGainNode}
            vibratoFrequency={vibratoFrequency}
            vibratoRange={vibratoRange}
            oscillatorType={WAVE_FORMS[waveForm] as OscillatorType}
          >
            {(playNote, stopNote) => {
              return <Piano playNote={playNote} stopNote={stopNote}></Piano>;
            }}
          </PianoPlayer>
          <div className="control">
            <h2>
              Master gain <span>{gain}</span>
            </h2>
            <input
              type="range"
              min="0"
              max="1"
              step={0.01}
              value={gain}
              className="slider"
              onChange={(e) => setGain(parseFloat(e.target.value))}
            ></input>
            <h2>
              Vibrate Frequency <span>{vibratoFrequency}</span>
            </h2>
            <input
              type="range"
              min="0"
              max="100"
              step={1}
              value={vibratoFrequency}
              className="slider"
              onChange={(e) => setVibratoFrequency(parseFloat(e.target.value))}
            ></input>
            <h2>
              Vibrate Range <span>{vibratoRange}</span>
            </h2>
            <input
              type="range"
              min="0"
              max="100"
              step={1}
              value={vibratoRange}
              className="slider"
              onChange={(e) => setVibratoRange(parseFloat(e.target.value))}
            ></input>
            <h2>
              Wave form <span>{WAVE_FORMS[waveForm]}</span>
            </h2>
            <input
              type="range"
              min="0"
              max="3"
              step={1}
              value={waveForm}
              className="slider"
              onChange={(e) => setWaveForm(parseInt(e.target.value))}
            ></input>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
