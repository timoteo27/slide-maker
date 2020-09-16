import React, {
  useState,
  CSSProperties,
  FocusEvent,
  KeyboardEvent,
  ChangeEvent,
  MouseEvent,
} from 'react';
import MenuPhraseTypeComp from './MenuPhraseTypeComp';
import EditButtonComp from './EditButtonComp';
import { LyricLine } from '../types';

type LineEditorProps = {
  initialValue: LyricLine;
  currentSlide: number;
  currentSubtitle: number;
  onLineSubmit: (l: LyricLine, command: 'add' | 'remove' | 'update') => void;
  onLineControlClick: (l: LyricLine) => void;
};

export default function LineEditorComp({
  initialValue,
  currentSlide,
  currentSubtitle,
  onLineSubmit,
  onLineControlClick,
}: LineEditorProps) {
  const [lyricEdit, setLyricEdit] = useState<LyricLine>(initialValue);

  const isShowingSlide: CSSProperties = {
    backgroundColor: 'blue',
  };

  const isShowingSubtitle: CSSProperties = {
    backgroundColor: 'green',
  };

  function handleFocusInput(e: FocusEvent<HTMLInputElement>) {
    e.target.select();
  }

  function handlePhraseTypeChanged(lyricValue: LyricLine) {
    setLyricEdit(lyricValue);
  }

  function handleChangeLyricLine(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name === 'id_slide' || name === 'id_subtitle') {
      setLyricEdit({ ...lyricEdit, [name]: Number(value) });
    } else {
      setLyricEdit({ ...lyricEdit, [name]: value });
    }
  }

  function handleContolClick(e: MouseEvent<HTMLInputElement>) {
    if (e.ctrlKey) {
      onLineControlClick(lyricEdit);
    }
  }

  function handleEditLyricLine(command: 'add' | 'remove' | 'update') {
    onLineSubmit(lyricEdit, command);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.keyCode === 13) {
      onLineSubmit(lyricEdit, 'update');
    }
  }

  return (
    <div className="line">
      <div className="column-params">
        <EditButtonComp
          sign="+"
          onButtonClick={handleEditLyricLine}
          command="add"
        />
        <EditButtonComp
          sign="-"
          onButtonClick={handleEditLyricLine}
          command="remove"
        />
        <MenuPhraseTypeComp
          lyricValue={lyricEdit}
          onChange={handlePhraseTypeChanged}
        />
        <input
          name="id_slide"
          type="text"
          maxLength={2}
          autoComplete="off"
          id={`inputNumSl_${lyricEdit.id}`}
          value={lyricEdit.id_slide}
          style={lyricEdit.id_slide === currentSlide ? isShowingSlide : {}}
          onFocus={handleFocusInput}
          onChange={handleChangeLyricLine}
          onKeyDown={handleKeyDown}
        />
        <input
          name="id_subtitle"
          type="text"
          maxLength={2}
          autoComplete="off"
          id={`inputNumSu_${lyricEdit.id}`}
          value={lyricEdit.id_subtitle}
          style={
            lyricEdit.id_subtitle === currentSubtitle ? isShowingSubtitle : {}
          }
          onFocus={handleFocusInput}
          onChange={handleChangeLyricLine}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="column-phrase">
        <input
          name="phrase"
          type="text"
          autoComplete="off"
          id={`inputPhrase_${lyricEdit.id}`}
          value={lyricEdit.phrase}
          onClick={handleContolClick}
          onChange={handleChangeLyricLine}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
