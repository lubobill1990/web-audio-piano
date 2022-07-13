import { Piano as PianoRenderer, KeyboardShortcuts, MidiNumbers } from "react-piano";

export function Piano(props: {
  playNote: (val: number) => void;
  stopNote: (val: number) => void;
}) {
  const { playNote, stopNote } = props;
  const firstNote = MidiNumbers.fromNote("a0");
  const lastNote = MidiNumbers.fromNote("f6");
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });
  return (
    <div className="piano-wrap">
      <PianoRenderer
        noteRange={{ first: firstNote, last: lastNote }}
        playNote={playNote}
        stopNote={stopNote}
        keyboardShortcuts={keyboardShortcuts}
      />
    </div>
  );
}
