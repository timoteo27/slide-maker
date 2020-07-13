import React from 'react';
import { ChangeEvent, useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { NavigateNext, NavigateBefore, VisibilityOff} from '@material-ui/icons';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

import './style.css';
import { LyricLine, SlideOutput } from './types';

export default function Home() {

    const defaultCSS: CSSProperties[] = [{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
        fontSize: '24px',
        color: 'white',
        width: '512px',
        height: '360px',
    }, {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
        fontSize: '16px',
        color: 'white',
        width: '512px',
        height: '50px',
    }]

    const defaultLyrics: string = `REINA EM MIM 

Sobre toda a terra Tu és o Rei
Sobre as montanhas e o pôr-do-sol
Uma coisa só meu desejo é
Vem reinar de novo em mim

Reina em mim com Teu poder
Sobre a escuridão
Sobre os sonhos meus
Tu és o Senhor de tudo o que sou
Vem reinar em mim, Senhor

Sobre o meu pensar, tudo que eu falar
Faz-me refletir a beleza que há em ti
Tu és para mim mais que tudo aqui
Vem reinar de novo em mim

Reina em mim com Teu poder
Sobre a escuridão
Sobre os sonhos meus
Tu és o Senhor de tudo o que sou
Vem reinar em mim, Senhor
Sobre o meu pensar, tudo que eu falar
Faz-me refletir a beleza que há em ti
Tu és para mim mais que tudo aqui
Vem reinar de novo em mim

Reina em mim com Teu poder
Sobre a escuridão
Sobre os sonhos meus
Tu és o Senhor de tudo o que sou
Vem reinar em mim, Senhor

Reina em mim com Teu poder
Sobre a escuridão
Sobre os sonhos meus
Tu és o Senhor de tudo o que sou
Vem reinar em mim, Senhor
Reina sobre mim
Vem reinar em mim, Senhor
Reina sobre mim
Vem reinar em mim, Senhor`;

    const [stringCSSJson, setStringCSSJson] = useState<string>(JSON.stringify(defaultCSS));
    const [cssSlide, setCssSlide] = useState<CSSProperties>(defaultCSS[0]);
    const [cssSubtitle, setCssSubtitle] = useState<CSSProperties>(defaultCSS[1]);
    const [nPhraseSlide, setNPhraseSlide] = useState<number>(10);
    const [nPhraseSubtitle, setNPhraseSubtitle] = useState<number>(2);
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [phrases, setPhrases] = useState<LyricLine[]>([]);
    const [slideOutput, setSlideOutput] = useState<SlideOutput>({ slideLines: ['Linha 1', 'Linha 2'], subtitleLines: ['Sub 1', 'Sub 2'] })

    const [currentSubtitle, setCurrentSubtitle] = useState(0)

    useEffect(() => {
        console.log(phrases);
    },
        [phrases]);

    useEffect(() => {
        if (currentSubtitle > 0){
            let newSlideOutput: SlideOutput = { slideLines: [], subtitleLines: [] };        
    
            let filteredSubtitles = phrases.filter(phrase => phrase.id_subtitle === currentSubtitle);
    
            let currentSlide = filteredSubtitles[0].id_slide;
            let filteredSlides = phrases.filter((value) => value.id_slide === currentSlide);
    
            filteredSlides.forEach((slide) => {                
                newSlideOutput.slideLines.push(slide.value);
            });
            filteredSubtitles.forEach((subtitle) => {
                newSlideOutput.subtitleLines.push(subtitle.value);
            });
    
            setSlideOutput(newSlideOutput);
        }
    },[currentSubtitle])

    const handleClick = () => {
        setOpen(true);
    };

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
    }

    function handleChangeCSS(event: ChangeEvent<HTMLTextAreaElement>) {
        const { value } = event.target;
        setStringCSSJson(value);
    }

    function handleMakeSlides() {
        defaultLyrics.split('\n').map((line, count) => {
            let nSlide = ~~(count / nPhraseSlide) + 1;       // ~~ to return the integer part.
            let nSubtitle = ~~(count / nPhraseSubtitle) + 1; // ~~ to return the integer part.
            setPhrases(result => [...result, { id: count, type: 'phrase', id_slide: nSlide, id_subtitle: nSubtitle, value: line }]);
        })
    }

    function handleSlideNavigation(value:number) {

        if (phrases.length === 0){
            setSnackbarMessage('Nenhum slide carregado!');
            setOpen(true);
            return false;
        }

        setCurrentSubtitle(currentSubtitle+value);        
    }

    return (
        <div className="main-container">
            <div className="left-panel">
                <TextField
                    id="multilineLyrics"
                    label="Letra"
                    multiline
                    rows={30}
                    defaultValue={defaultLyrics}
                    variant="outlined"
                    fullWidth
                />
                <Button id="buttonApplyCSS" color="primary" onClick={handleMakeSlides}>Make Slides!</Button>
                <TextField id="textNPhraseSlide" label="Frases por Slides" variant="outlined" size="small"
                    value={nPhraseSlide} onChange={(e: ChangeEvent<HTMLInputElement>) => setNPhraseSlide(Number.parseInt(e.target.value))} />
                <TextField id="textNPhrasSubtitle" label="Frases por Subtítulo" variant="outlined" size="small"
                    value={nPhraseSubtitle} onChange={(e: ChangeEvent<HTMLInputElement>) => setNPhraseSubtitle(Number.parseInt(e.target.value))} />
            </div>
            <div className="right-panel">
                <TextField
                    id="multilineCSS"
                    label="CSS"
                    multiline
                    rows={5}
                    value={stringCSSJson}
                    onChange={handleChangeCSS}
                    variant="outlined"
                    fullWidth
                />
                <Button id="buttonApplyCSS" onClick={handleApplyCSS}>Aplicar</Button>


                <div id="slideContainer" className="slide-container">
                    <div id="slideOutput" style={cssSlide}>
                        {slideOutput.slideLines.map((strSlide, count) => (
                            <span key={`slideKey_${count}`}>{strSlide}</span>
                        ))}
                    </div>
                    <div id="subtitleOutput" style={cssSubtitle}>
                        {slideOutput.subtitleLines.map((strSlide, count) => (
                            <span key={`subtitleKey_${count}`}>{strSlide}</span>
                        ))}
                    </div>
                </div>

                <Fab color="primary" aria-label="add" onClick={() => handleSlideNavigation(-1)}>
                    <NavigateBefore />
                </Fab>
                <Fab color="secondary" aria-label="add" onClick={() => handleSlideNavigation(+1)}>
                    <VisibilityOff />
                </Fab>
                <Fab color="primary" aria-label="add" onClick={() => handleSlideNavigation(+1)}>
                    <NavigateNext />
                </Fab>

            </div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="warning">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    )
}