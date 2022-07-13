import { useRef, useState } from "react";
import "./App.css";
import "react-piano/dist/styles.css";
import { Piano } from "./Piano";
import { MidiNumbers } from "react-piano";

function getFrequency(midiKey: number) {
  const midiKeyA4 = MidiNumbers.fromNote("A4");
  const frequencyA4 = 440;
  const diffFromA4 = midiKey - midiKeyA4;
  const chromaticMultiple = Math.pow(2, 1 / 12);
  const frequencyMultipleFromA4 = Math.pow(chromaticMultiple, diffFromA4);
  return frequencyA4 * frequencyMultipleFromA4;
}

function getVibratoNode(audioContext: AudioContext, param: AudioParam, frequency: number, gain: number) {
  const vibrato = audioContext.createOscillator();
  vibrato.frequency.setValueAtTime(frequency, 0);
  const vibratoGain = audioContext.createGain();
  vibratoGain.gain.setValueAtTime(gain, 0);
  vibrato.connect(vibratoGain);
  vibratoGain.connect(param);
  return vibrato;
}

function getADSREnvolop(attack: number, decay:number, sustainLevel: number, ) {

}

function App() {
  const [audioContext, setAudioContext] = useState<AudioContext>();
  const playingNodes = useRef(new Map<number, [OscillatorNode, GainNode]>());
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
      {audioContext && (
        <Piano
          playNote={(val: number) => {
            console.log(MidiNumbers.getAttributes(val));
            const oscillator = audioContext.createOscillator();
            oscillator.frequency.setValueAtTime(getFrequency(val), 0);
            const gainNode = audioContext.createGain();
            const vibrato = getVibratoNode(audioContext, oscillator.frequency, 10, 2);
            
            const attack = 0.3;
            const decayTime = 0.2;
            const sustainLevel = 0.7;
            const releaseTime = 0.2;
            const now = audioContext.currentTime;
            gainNode.gain.setValueAtTime(0, 0);
            gainNode.gain.linearRampToValueAtTime(1, now + attack);
            gainNode.gain.linearRampToValueAtTime(sustainLevel, now + attack + decayTime);
            gainNode.gain.setValueAtTime(sustainLevel, now + attack + decayTime)
            // gainNode.gain.exponentialRampToValueAtTime(0.001, now + attack + decayTime + 0.5);
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            playingNodes.current.set(val, [oscillator, gainNode]);
            // gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5)
            vibrato.start();
            oscillator.start();
            // oscillator.stop(audioContext.currentTime + 1);
          }}
          stopNote={(val: number) => {
            const playingNode = playingNodes.current.get(val);
            if (playingNode) {
              console.log(MidiNumbers.getAttributes(val));
              playingNode[1].gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 1);
              playingNode[0].stop(audioContext.currentTime + 1);
            }
          }}
        ></Piano>
      )}
    </div>
  );
}

export default App;
