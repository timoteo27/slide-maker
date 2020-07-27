import React,  { 
    useState, useEffect,
    ChangeEvent } from 'react';

import { nanoid } from "nanoid";

import { Box, Button, Fab, Snackbar, FormControl, Select, CircularProgress, Typography } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { NavigateNext, NavigateBefore, VisibilityOff, Visibility } from '@material-ui/icons';

import { SlideOutput, Lyric, LyricLine } from './types';

import SlideOutputComp from './components/SlideOutputComp';
import CSSPanelComp from './components/CSSPanelComp';
import LyricEditorComp from './components/LyricEditor/LyricEditorComp';
import './style.css';

import DATAJSON_LYRICS from '../../lyrics/data.json';

export default function Home() {

    const defaultCSS: CSSProperties[] = [
        { //CSS Slide
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'blue',
            fontSize: '24px',
            fontFamily: 'Segoe UI',
            textShadow: '2px 2px #00000044',
            color: 'white',
            width: '512px',
            height: '360px',
            whiteSpace: 'pre-wrap',
        }, { //CSS Subtitle
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'green',
            fontSize: '16px',
            fontFamily: 'Segoe UI',
            textShadow: '1.5px 1.5px #000000aa',
            color: 'white',
            width: '512px',
            height: '50px',
        }, { //CSS Blank Slide 
            backgroundColor: 'black',
            width: '512px',
            height: '360px',
        }]

    const [loadedLyrics, setLoadedLyrics] = useState<Lyric[]>([]);

    const [stringCSSJson, setStringCSSJson] = useState<string>(JSON.stringify(defaultCSS, undefined, 4));
    const [cssSlide, setCssSlide] = useState<CSSProperties>(defaultCSS[0]);
    const [cssSubtitle, setCssSubtitle] = useState<CSSProperties>(defaultCSS[1]);
    const [cssBlank, setCssBlank] = useState<CSSProperties>(defaultCSS[2]);
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [hideSlide, setHideSlide] = useState(false);

    const [currentLyric, setCurrentLyric] = useState<Lyric>({ id: '', lyric_name: '', lines: [], lines_slide: 0, lines_subtitle: 0, total_slides: 0 });
    const [currentLyricIndex, setCurrentLyricIndex] = useState<number[]>([]);
    const [slideOutput, setSlideOutput] = useState<SlideOutput>({ slide_lines: [], subtitle_lines: [], current_slide: 0, current_subtitle: 0 });

    const [currentSubtitle, setCurrentSubtitle] = useState(1)

    useEffect(() => {
        refreshSlideOutput(currentSubtitle);        
    }, [currentLyric, currentSubtitle]);

    function refreshSlideOutput(subtitleID: number) {
        if (currentLyric.lines.length === 0) {
            return false;
        }        
        
        if (currentSubtitle === 0){
            subtitleID = 1;
        }

        let newSlideOutput: SlideOutput = { slide_lines: [], subtitle_lines: [], current_slide: 0, current_subtitle: 0 };

        let filteredSubtitles = currentLyric.lines.filter(phrase => phrase.id_subtitle === subtitleID);

        let currentSlide = filteredSubtitles[0].id_slide;
        let filteredSlides = currentLyric.lines.filter((value) => value.id_slide === currentSlide);

        filteredSlides.forEach((slide) => {
            newSlideOutput.slide_lines.push(slide.phrase);
        });
        filteredSubtitles.forEach((subtitle) => {
            newSlideOutput.subtitle_lines.push(subtitle.phrase);
        });

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
            let newSlideOutput: SlideOutput = { ...slideOutput, slide_lines: [], subtitle_lines: [] };
            setSlideOutput(newSlideOutput);
        }

        switch (command) {
            case 'blank':
                blankSlide();
                break;
            case 'next':
                console.log(`${currentSubtitle} === ${currentLyric.total_slides}`)
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
        a.click()
    }

    function handleNewLyric() {
        setCurrentLyric({ id: '', lyric_name: '', lines: [], lines_slide: 0, lines_subtitle: 0, total_slides: 0 });        
        setCurrentSubtitle(0);

    }

    function handleImportLyrics() {
        console.log("handleImportLyrics");
        let dadosJson: Lyric[] = DATAJSON_LYRICS;
        console.log(dadosJson);
        setLoadedLyrics(dadosJson);
    }

    function handleChangeSubtitleSelected(lyricLine: LyricLine) {
        setCurrentSubtitle(lyricLine.id_subtitle)
    }

    function handleChangeLyricLine(lyric: LyricLine) {        
        const newLines = currentLyric.lines.map(l => l.id === lyric.id ? lyric : l);
        setCurrentLyric({...currentLyric, lines: newLines});
    }

    function handleEditLyric(editedLyric: Lyric, newLyric = false ){
        if(newLyric){
            setLoadedLyrics([...loadedLyrics, editedLyric])
        } else {
            let newLyrics = loadedLyrics.map(lyric => lyric.lyric_name === editedLyric.lyric_name ? editedLyric : lyric )
            setLoadedLyrics(newLyrics);
        }
    }

    
    return (
        <div className="main-container">
            <div className="left-panel">
                <div className="lyric-select">
                    <FormControl id="formLyricSelect" variant="outlined">
                        <Select
                            id="selectLyric"
                            multiple
                            native
                            label="Músicas"
                            labelWidth={70}
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
                        <Button id="buttonExportJSON" variant="contained" onClick={handleNewLyric}>Nova Música</Button>
                        <Button id="buttonExportJSON" variant="contained" onClick={handleImportLyrics}>Importar</Button>
                        <Button id="buttonExportJSON" variant="contained" onClick={handleExportLyrics}>Exportar</Button>
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
                    stringCSSJson={stringCSSJson} />
            
                <SlideOutputComp
                    cssSlide={cssSlide}
                    cssSubtitle={cssSubtitle}
                    cssBlank={cssBlank}
                    slideOut={slideOutput}
                    hideSlide={hideSlide} />

                <div className="slide-control-buttons">
                    <div className="place-center">
                        <Fab color="primary" aria-label="add" onClick={() => handleSlideNavigation('previous')}>
                            <NavigateBefore />
                        </Fab>
                        <Fab color="secondary" aria-label="add" onClick={() => handleHideShowSlide()}>
                            {hideSlide ? <VisibilityOff /> : <Visibility />}
                        </Fab>
                        <Fab color="primary" aria-label="add" onClick={() => handleSlideNavigation('next')}>
                            <NavigateNext />
                        </Fab>
                    </div>

                    <div className="place-right">
                        {currentLyric?.total_slides > 0 ?
                            <Box position="relative" display="inline-flex">
                                <CircularProgress variant="static" size="56px" value={(currentSubtitle * 100) / currentLyric.total_slides} />
                                <Box top={0} left={0} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center">
                                    <Typography variant="caption" component="div" color="textSecondary">{`
                                    ${currentSubtitle} / ${currentLyric.total_slides}`}</Typography>
                                </Box>
                            </Box>
                            : <></>}
                    </div>
                </div>

            </div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="warning">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    )
}