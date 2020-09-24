import React, { useState, useEffect, MouseEvent, ChangeEvent } from 'react';
import { nanoid } from 'nanoid';
import './LyricEditorComp.css';
import { LyricLine, Lyric } from '../types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import LineEditorComp from './LineEditorComp';

type LyricEditorProps = {
  lyric: Lyric;
  currentSlide: number;
  currentSubtitle: number;
  editLyric: (l: Lyric, command: 'add' | 'remove' | 'update') => void;
  onLyricLineDoubleClick: (l: LyricLine) => void;
  onLyricLineChanged: (
    l: LyricLine,
    command: 'add' | 'remove' | 'update'
  ) => void;
};

export default function LyricEditorComp({
  lyric,
  currentSlide,
  currentSubtitle,
  editLyric,
  onLyricLineDoubleClick: onLyricLineControlClick,
  onLyricLineChanged,
}: LyricEditorProps) {
  const [lyricSwitch, setLyricSwitch] = useState({
    checkedA: true,
    checkedB: false,
  });
  const [currentPhraseInput, setCurrentPhraseInput] = useState('');
  const [nPhraseSubtitle, setNPhraseSubtitle] = useState<number>(2);

  useEffect(() => {
    setCurrentPhraseInput(lyric.lines.map((r) => r.phrase).join('\n'));
  }, [lyric.lines]);

  function handleAddLyric() {
    const newLyric = makeLyric();
    editLyric(newLyric, 'add');
    setCurrentPhraseInput('');
  }

  function handleAlterLyric() {
    const editedLyric = makeLyric(lyric.id);
    editLyric(editedLyric, 'update');
  }

  function handleDeleteLyric() {
    editLyric(lyric, 'remove');
  }

  function makeLyric(lyricEditId?: string) {
    let newLyricLines: LyricLine[] = [];

    let nSlide = 1;
    let nSubtitle = 1;
    let type = '';
    let subtitleCount = 1;
    let countSameSubtitleId = 0;

    currentPhraseInput.split('\n').map((line, count) => {
      if (count === 0) {
        type = 'title';
      } else {
        type = 'phrase';
      }

      if (line !== '') {
        if (countSameSubtitleId >= nPhraseSubtitle) {
          nSubtitle++;
          countSameSubtitleId = 0;
          subtitleCount++;
        }
      }

      newLyricLines = [
        ...newLyricLines,
        {
          id: nanoid(),
          type,
          id_slide: nSlide,
          id_subtitle: nSubtitle,
          phrase: line,
        },
      ];

      countSameSubtitleId++;

      if (line === '') {
        nSlide++;
      }
    });

    const newLyric: Lyric = {
      id: lyricEditId === undefined ? nanoid() : lyricEditId,
      lyric_name: newLyricLines[0].phrase,
      lines: newLyricLines,
      lines_subtitle: nPhraseSubtitle,
      total_slides: subtitleCount,
    };
    return newLyric;
  }

  const inputLyricTemplate = (
    <TextField
      id="multilineLyrics"
      label="Letra"
      multiline
      rows={25}
      value={currentPhraseInput}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
        setCurrentPhraseInput(e.target.value)
      }
      variant="outlined"
      fullWidth
    />
  );

  const editLyricTemplate = lyric.lines.map((l) => (
    <LineEditorComp
      key={l.id}
      initialValue={l}
      currentSlide={currentSlide}
      currentSubtitle={currentSubtitle}
      onLineSubmit={onLyricLineChanged}
      onLineControlClick={onLyricLineControlClick}
    />
  ));

  return (
    <div className="main-box">
      <Switch
        checked={lyricSwitch.checkedA}
        onChange={(event) =>
          setLyricSwitch({
            ...lyricSwitch,
            [event.target.name]: event.target.checked,
          })
        }
        name="checkedA"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />

      {lyricSwitch.checkedA ? inputLyricTemplate : editLyricTemplate}

      <div className="slide-config-inputs">
        <TextField
          id="textNPhrasSubtitle"
          label="Frases por Subtítulo"
          variant="outlined"
          size="small"
          value={nPhraseSubtitle}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNPhraseSubtitle(Number.parseInt(e.target.value))
          }
        />
        <Button
          id="buttonMakeSlides"
          variant="contained"
          color="primary"
          onClick={handleAddLyric}
        >
          Adicionar
        </Button>
        <Button
          id="buttonMakeSlides"
          variant="contained"
          color="primary"
          onClick={handleAlterLyric}
        >
          Alterar
        </Button>
        <Button
          id="buttonMakeSlides"
          variant="contained"
          color="secondary"
          onClick={handleDeleteLyric}
        >
          Excluir
        </Button>
      </div>
    </div>
  );
}
