import React, { useState, useEffect, ChangeEvent } from 'react';

import {
  Box,
  Button,
  Fab,
  Snackbar,
  FormControl,
  Select,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import {
  NavigateNext,
  NavigateBefore,
  VisibilityOff,
  Visibility,
} from '@material-ui/icons';

import { SlideOutput, Lyric, LyricLine } from './types';

import SlideOutputComp from './components/SlideOutputComp';
import CSSPanelComp from './components/CSSPanelComp';
import LyricEditorComp from './components/LyricEditorComp';
import './App.css';

import DATAJSON_LYRICS from './data/lyrics.json';
import { nanoid } from 'nanoid';
import moment from 'moment';
import { socket, socketUrlServer } from './service/socket';

export default function App() {
  const defaultCSS: CSSProperties[] = [
    {
      //CSS Slide
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'blue',
      fontSize: '24px',
      fontFamily: 'Arial-Rounded, Segoe UI',
      textShadow: '2px 2px #00000044',
      color: 'white',
      width: '512px',
      height: '360px',
      whiteSpace: 'pre-wrap',
    },
    {
      //CSS Subtitle
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      //backgroundColor: 'green',
      backgroundImage: 'url(title_background.png)',
      fontSize: '16px',
      fontFamily: 'Arial-Rounded, Segoe UI',
      fontWeight: 'bold',
      textShadow: '1.5px 1.5px #000000aa',
      color: 'white',
      width: '512px',
      height: '50px',
    },
    {
      //CSS Blank Slide
      backgroundColor: 'black',
      width: '512px',
      height: '360px',
    },
  ];

  const [loadedLyrics, setLoadedLyrics] = useState<Lyric[]>([]);

  const [stringCSSJson, setStringCSSJson] = useState<string>(
    JSON.stringify(defaultCSS, undefined, 4)
  );
  const [cssSlide, setCssSlide] = useState<CSSProperties>(defaultCSS[0]);
  const [cssSubtitle, setCssSubtitle] = useState<CSSProperties>(defaultCSS[1]);
  const [cssBlank, setCssBlank] = useState<CSSProperties>(defaultCSS[2]);
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [hideSlide, setHideSlide] = useState(false);

  const [currentLyric, setCurrentLyric] = useState<Lyric>({
    id: '',
    lyric_name: '',
    lines: [],
    lines_subtitle: 0,
    total_slides: 0,
  });
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number[]>([]);
  const [slideOutput, setSlideOutput] = useState<SlideOutput>({
    slide_lines: [],
    subtitle_lines: [],
    subtitle_background: '',
    current_slide: 0,
    current_subtitle: 0,
  });
  const [urlServer, setUrlServer] = useState('Não informado');
  const [statusServer, setStatusServer] = useState('Não conectado');
  const [currentSubtitle, setCurrentSubtitle] = useState(1);

  useEffect(() => {
    refreshSlideOutput(currentSubtitle);
  }, [currentLyric, currentSubtitle]);

  useEffect(() => {
    if (socket.connected) {
      setUrlServer(socketUrlServer);
      setStatusServer(`Ativo :) ${returnNow()}`);

      socket.on('connect_error', () => {
        setStatusServer(`Erro ao tentar conectar... ${returnNow()}`);
      });

      socket.on('connect', () => {
        setStatusServer(`Ativo :) ${returnNow()}`);
      });

      socket.on('disconnect', () => {
        setStatusServer(`Inativo :( ${returnNow()}`);
      });

      socket.on('reconnect', () => {
        setStatusServer(`Reconectou... Ativo :) ${returnNow()}`);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket.connected) {
      socket.emit('SlideOutput Update', slideOutput);
    }
  }, [slideOutput]);

  function returnNow() {
    return moment().format('LTS');
  }

  function refreshSlideOutput(subtitleID: number) {
    if (currentLyric.lines.length === 0) {
      return false;
    }

    if (currentSubtitle === 0) {
      subtitleID = 1;
    }

    let newSlideOutput: SlideOutput = {
      slide_lines: [],
      subtitle_lines: [],
      subtitle_background: '',
      current_slide: 0,
      current_subtitle: 0,
    };

    const filteredSubtitles = currentLyric.lines.filter(
      (phrase) => phrase.id_subtitle === subtitleID
    );

    const currentSlide = filteredSubtitles[0].id_slide;
    const filteredSlides = currentLyric.lines.filter(
      (value) => value.id_slide === currentSlide
    );

    filteredSlides.forEach((slide) => {
      newSlideOutput.slide_lines.push(slide.phrase);
    });
    filteredSubtitles.forEach((subtitle) => {
      newSlideOutput.subtitle_lines.push(subtitle.phrase);
    });

    if (filteredSubtitles.findIndex((line) => line.type === 'title') >= 0) {
      newSlideOutput.subtitle_background =
        './assets/images/title_background.png';
    }

    newSlideOutput.current_slide = currentSlide;
    newSlideOutput.current_subtitle = currentSubtitle;

    setSlideOutput(newSlideOutput);
  }

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  function handleApplyCSS() {
    const jsonCSS = JSON.parse(stringCSSJson);
    setCssSlide(jsonCSS[0]);
    setCssSubtitle(jsonCSS[1]);
    setCssBlank(jsonCSS[2]);
  }

  function handleChangeCSS(event: ChangeEvent<HTMLTextAreaElement>) {
    const { value } = event.target;
    setStringCSSJson(value);
  }

  function handleHideShowSlide() {
    if (!hideSlide) {
      handleSlideNavigation('blank');
    } else {
      refreshSlideOutput(currentSubtitle);
    }

    hideSlide ? setHideSlide(false) : setHideSlide(true);
  }

  function handleSlideNavigation(command: 'next' | 'previous' | 'blank') {
    if (currentLyric?.lines.length === 0) {
      setSnackbarMessage('Nenhum slide carregado!');
      setOpen(true);
      return false;
    }

    function blankSlide() {
      const newSlideOutput: SlideOutput = {
        ...slideOutput,
        slide_lines: [],
        subtitle_lines: [],
      };
      setSlideOutput(newSlideOutput);
    }

    switch (command) {
      case 'blank':
        blankSlide();
        break;
      case 'next':
        if (currentSubtitle === currentLyric.total_slides) {
          blankSlide();
        } else {
          setCurrentSubtitle(currentSubtitle + 1);
        }
        break;
      case 'previous':
        if (currentSubtitle > 1) {
          setCurrentSubtitle(currentSubtitle - 1);
        }
        break;
    }
  }

  function handleChangeLyricSelect(event: ChangeEvent<{ value: unknown }>) {
    const { options } = event.target as HTMLSelectElement;

    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        setCurrentLyric(loadedLyrics[i]);
        setCurrentLyricIndex([i]);
        setCurrentSubtitle(1);
        break;
      }
    }
  }

  function handleExportLyrics() {
    let filename = 'data.json';
    let jsonData = JSON.stringify(loadedLyrics, null, 1);

    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,' + jsonData);
    a.setAttribute('download', filename);
    a.click();
  }

  function handleNewLyric() {
    setCurrentLyric({
      id: '',
      lyric_name: '',
      lines: [],
      lines_subtitle: 0,
      total_slides: 0,
    });
    setCurrentSubtitle(0);
  }

  function handleImportLyrics() {
    let dadosJson: Lyric[] = DATAJSON_LYRICS;
    setLoadedLyrics(dadosJson);
  }

  function handleChangeSubtitleSelected(lyricLine: LyricLine) {
    setCurrentSubtitle(lyricLine.id_subtitle);
  }

  function handleChangeLyricLine(
    lyric: LyricLine,
    command: 'add' | 'update' | 'remove'
  ) {
    switch (command) {
      case 'add':
        const indexNewLine = currentLyric.lines.findIndex(
          (e) => e.id === lyric.id
        );

        const currentLyricClone = { ...currentLyric };
        currentLyricClone.lines.splice(indexNewLine + 1, 0, {
          id: nanoid(),
          type: 'phrase',
          id_slide: lyric.id_slide,
          id_subtitle: lyric.id_subtitle,
          phrase: '',
        });
        setCurrentLyric(currentLyricClone);
        break;
      case 'remove':
        const removeLineArray = currentLyric.lines.filter(
          (l) => l.id !== lyric.id
        );
        setCurrentLyric({ ...currentLyric, lines: removeLineArray });
        break;

      case 'update':
        const updateLineArray = currentLyric.lines.map((l) =>
          l.id === lyric.id ? lyric : l
        );
        setCurrentLyric({ ...currentLyric, lines: updateLineArray });
        break;

      default:
        break;
    }
  }

  function handleEditLyric(
    editedLyric: Lyric,
    command: 'add' | 'update' | 'remove'
  ) {
    switch (command) {
      case 'add':
        setLoadedLyrics([...loadedLyrics, editedLyric]);
        break;
      case 'update':
        const newLyrics = loadedLyrics.map((lyric) =>
          lyric.id === editedLyric.id ? editedLyric : lyric
        );
        console.dir(editedLyric);
        console.dir(loadedLyrics);
        console.dir(newLyrics);
        setLoadedLyrics(newLyrics);
        break;
      case 'remove':
        const removedLyric = loadedLyrics.filter(
          (lyric) => lyric.id !== editedLyric.id
        );
        setLoadedLyrics(removedLyric);
        break;
    }
  }

  return (
    <>
      <div className="server-status">
        <span>Conectado ao servidor: {urlServer}</span>
        <span>Status: {statusServer}</span>
      </div>
      <div className="main-container">
        <div className="left-panel">
          <div className="lyric-select">
            <FormControl id="formLyricSelect" variant="outlined">
              <Select
                id="selectLyric"
                aria-label=""
                multiple
                native
                label="Músicas"
                value={currentLyricIndex}
                onChange={handleChangeLyricSelect}
              >
                {loadedLyrics.map((lyric, index) => (
                  <option key={index} value={index}>
                    {lyric.lyric_name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <div className="lyrics-buttons">
              <Button
                id="buttonExportJSON"
                variant="contained"
                onClick={handleNewLyric}
              >
                Nova Música
              </Button>
              <Button
                id="buttonExportJSON"
                variant="contained"
                onClick={handleImportLyrics}
              >
                Importar
              </Button>
              <Button
                id="buttonExportJSON"
                variant="contained"
                onClick={handleExportLyrics}
              >
                Exportar
              </Button>
            </div>
          </div>
          <div className="lyric-edit">
            <LyricEditorComp
              lyric={currentLyric}
              currentSlide={slideOutput.current_slide}
              currentSubtitle={currentSubtitle}
              editLyric={handleEditLyric}
              onLyricLineDoubleClick={handleChangeSubtitleSelected}
              onLyricLineChanged={handleChangeLyricLine}
            />
          </div>
        </div>
        <div className="right-panel">
          <CSSPanelComp
            handleApplyCSS={handleApplyCSS}
            handleChangeCSS={handleChangeCSS}
            stringCSSJson={stringCSSJson}
          />

          <SlideOutputComp
            cssSlide={cssSlide}
            cssSubtitle={cssSubtitle}
            cssBlank={cssBlank}
            slideOut={slideOutput}
            hideSlide={hideSlide}
          />

          <div className="slide-control-buttons">
            <div className="place-center">
              <Fab
                color="primary"
                aria-label="add"
                onClick={() => handleSlideNavigation('previous')}
              >
                <NavigateBefore />
              </Fab>
              <Fab
                color="secondary"
                aria-label="add"
                onClick={() => handleHideShowSlide()}
              >
                {hideSlide ? <VisibilityOff /> : <Visibility />}
              </Fab>
              <Fab
                color="primary"
                aria-label="add"
                onClick={() => handleSlideNavigation('next')}
              >
                <NavigateNext />
              </Fab>
            </div>

            <div className="place-right">
              {currentLyric?.total_slides > 0 ? (
                <Box position="relative" display="inline-flex">
                  <CircularProgress
                    variant="static"
                    size="56px"
                    value={(currentSubtitle * 100) / currentLyric.total_slides}
                  />
                  <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography
                      variant="caption"
                      component="div"
                      color="textSecondary"
                    >{`
                                    ${currentSubtitle} / ${currentLyric.total_slides}`}</Typography>
                  </Box>
                </Box>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleClose}
            severity="warning"
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </div>
    </>
  );
}
