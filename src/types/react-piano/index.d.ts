import * as React from "react";

declare module "react-piano" {
  type MidiNumbers = {
    fromNote(note: string): number;
    getAttributes(midiNumber: number): {
      note: string;
      pitchName: string;
      octave: number;
      midiNumber: number;
      isAccidental: boolean;
    };
  };
  type Row = {
    natural: string;
    flat: string;
    sharp: string;
  };
  type Shortcut = {
    key: string;
    midiNumber: number;
  };
  type KeyboardShortcuts = {
    create: (param: {
      firstNote: number;
      lastNote: number;
      keyboardConfig: Row[];
    }) => Shortcut[];
    BOTTOM_ROW: Row[];
    HOME_ROW: Row[];
  };
  type PlayNoteCallback = (midiNumber: number) => void;
  type StopNoteCallback = (midiNumber: number) => void;
  declare const MidiNumbers: MidiNumbers;
  declare const KeyboardShortcuts: KeyboardShortcuts;
  declare class Piano extends React.Component {
    props: {
        noteRange: {
            first: number;
            last: number;
        };
        playNote: PlayNoteCallback;
        stopNote: StopNoteCallback;
        keyboardShortcuts?: Shortcut[];
        disabled?: boolean;
        width?: number;
        keyWidthToHeight?: number;
        renderNoteLabel?: () => void;
        onPlayNoteInput?: (midiNumber: number, param: {prevActiveNotes: number[]}) => void;
        onStopNoteInput?: (midiNumber: number, param: {prevActiveNotes: number[]}) => void;
        activeNotes?: number[]
    };
  }
}
