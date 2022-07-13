import React, { useCallback, useMemo, useRef, useState } from "react";
import { MidiNumbers } from "react-piano";

function getFrequency(midiKey: number) {
  const midiKeyA4 = MidiNumbers.fromNote("A4");
  const frequencyA4 = 440;
  const diffFromA4 = midiKey - midiKeyA4;
  const chromaticMultiple = Math.pow(2, 1 / 12);
  const frequencyMultipleFromA4 = Math.pow(chromaticMultiple, diffFromA4);
  return frequencyA4 * frequencyMultipleFromA4;
}

function getVibratoNode(
  audioContext: AudioContext,
  param: AudioParam,
  frequency: number,
  gain: number
) {
  const vibrato = audioContext.createOscillator();
  vibrato.frequency.setValueAtTime(frequency, 0);
  const vibratoGain = audioContext.createGain();
  vibratoGain.gain.setValueAtTime(gain, 0);
  vibrato.connect(vibratoGain);
  vibratoGain.connect(param);
  return vibrato;
}

function getADSREnvolopGain(audioContext: AudioContext, attack: number, decay: number, sustainLevel: number, release: number) {
    const gainNode = audioContext.createGain();
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, 0);
    gainNode.gain.linearRampToValueAtTime(1, now + attack);
    gainNode.gain.linearRampToValueAtTime(
      sustainLevel,
      now + attack + decay
    );
    gainNode.gain.setValueAtTime(sustainLevel, now + attack + decay);

    return gainNode;
}

export function PianoPlayer(props: {
  audioContext: AudioContext;
  outputNode: AudioNode;
  vibratoFrequency: number;
  vibratoRange: number;
  oscillatorType: OscillatorType;
  children: (
    playNote: (val: number) => void,
    stopNote: (val: number) => void
  ) => React.ReactNode;
}) {
  const { audioContext, outputNode, vibratoFrequency, vibratoRange, oscillatorType, children } = props;
  const playingNodes = useRef(new Map<number, [OscillatorNode, GainNode]>());

  const playNote = useCallback((val: number) => {
    console.log(MidiNumbers.getAttributes(val));
    const oscillator = audioContext.createOscillator();
    oscillator.type = oscillatorType;
    oscillator.frequency.setValueAtTime(getFrequency(val), 0);
    if (vibratoFrequency > 0) {
        const vibrato = getVibratoNode(audioContext, oscillator.frequency, vibratoFrequency, vibratoRange);
        vibrato.start();
    }

    const gainNode = getADSREnvolopGain(audioContext, 0.3, 0.2, 0.7, 0.2);
    
    // gainNode.gain.exponentialRampToValueAtTime(0.001, now + attack + decayTime + 0.5);
    oscillator.connect(gainNode);
    gainNode.connect(outputNode);
    playingNodes.current.set(val, [oscillator, gainNode]);
    // gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5)
    oscillator.start();
    // oscillator.stop(audioContext.currentTime + 1);
  }, [outputNode, audioContext, playingNodes, vibratoFrequency, vibratoRange, oscillatorType]);
  const stopNote = useCallback((val: number) => {
    const playingNode = playingNodes.current.get(val);
    if (playingNode) {
      console.log(MidiNumbers.getAttributes(val));
      playingNode[1].gain.linearRampToValueAtTime(
        0.01,
        audioContext.currentTime + 1
      );
      playingNode[0].stop(audioContext.currentTime + 1);
    }
  }, [playingNodes, audioContext]);
  return <>{children(playNote, stopNote)}</>;
}
