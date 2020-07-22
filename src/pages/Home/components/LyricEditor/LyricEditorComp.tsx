import React, {useState, useEffect, MouseEvent, ChangeEvent } from 'react';
import { nanoid } from "nanoid";
import './LyricEditorComp.css';
import {LyricLine, Lyric} from '../../types'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import LineEditorComp from './LineEditorComp';

type LyricEditorProps = {
    lyric: Lyric,
    currentSlide: number,
    currentSubtitle: number,
    editLyric: (l:Lyric, newLyric?: boolean) => void,
    onLyricLineDoubleClick: (l:LyricLine) => void,
    onLyricLineChanged: (l:LyricLine) => void,
}

export default function LyricEditorComp(
    { lyric, currentSlide, currentSubtitle, editLyric, onLyricLineDoubleClick: onLyricLineControlClick, onLyricLineChanged }: LyricEditorProps) {

    const [lyricSwitch, setLyricSwitch] = useState({
        checkedA: true,
        checkedB: false,
    });
    const [currentPhraseInput, setCurrentPhraseInput] = useState('');
    const [nPhraseSlide, setNPhraseSlide] = useState<number>(10);
    const [nPhraseSubtitle, setNPhraseSubtitle] = useState<number>(2);
    
    useEffect(()=> {
        setCurrentPhraseInput(lyric.lines.map(r => r.phrase).join('\n'));
    }, [lyric.lines])

    function handleAddLyric() {
        let newLyric = makeLyric();
        editLyric(newLyric, true);
        setCurrentPhraseInput('');
    }

    function handleAlterLyric() {
        let newLyric = makeLyric();
        editLyric(newLyric, false);
    }

    function makeLyric() {
        let newLyricLines: LyricLine[] = [];

        currentPhraseInput.split('\n').map((line, count) => {
            let nSlide = ~~(count / nPhraseSlide) + 1;       // ~~ to return the integer part.
            let nSubtitle = ~~(count / nPhraseSubtitle) + 1; // ~~ to return the integer part.
            newLyricLines = [...newLyricLines, { id: nanoid(), type: 'phrase', id_slide: nSlide, id_subtitle: nSubtitle, phrase: line }];
        })
        let newLyric: Lyric = {
            id: nanoid(),
            lyric_name: newLyricLines[0].phrase,
            lines: newLyricLines,
            lines_slide: nPhraseSlide,
            lines_subtitle: nPhraseSubtitle,
            total_slides: ~~(newLyricLines.length / nPhraseSubtitle),
        }
        return newLyric;
    }  

    const inputLyricTemplate = 
        <TextField
            id="multilineLyrics"
            label="Letra"
            multiline
            rows={25}
            value={currentPhraseInput}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCurrentPhraseInput(e.target.value)}
            variant="outlined"
            fullWidth
        />
    
    const editLyricTemplate = 
        lyric.lines.map(l =>                 
            <LineEditorComp
                key={l.id}
                initialValue={l}
                currentSlide={currentSlide}
                currentSubtitle={currentSubtitle}
                onLineSubmit={onLyricLineChanged}
                onLineControlClick={onLyricLineControlClick}                    
            />
        )                    
        
    return (
        <div className="teste">
            <Switch
                checked={lyricSwitch.checkedA}
                onChange={(event) => setLyricSwitch({ ...lyricSwitch, [event.target.name]: event.target.checked })}
                name="checkedA"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
            
            {lyricSwitch.checkedA ? inputLyricTemplate : editLyricTemplate}                          

            <div className="slide-config-inputs">
                <TextField id="textNPhraseSlide" label="Frases por Slides" variant="outlined" size="small"
                    value={nPhraseSlide} onChange={(e: ChangeEvent<HTMLInputElement>) => setNPhraseSlide(Number.parseInt(e.target.value))} />
                <TextField id="textNPhrasSubtitle" label="Frases por Subtítulo" variant="outlined" size="small"
                    value={nPhraseSubtitle} onChange={(e: ChangeEvent<HTMLInputElement>) => setNPhraseSubtitle(Number.parseInt(e.target.value))} />
                <Button id="buttonMakeSlides" variant="contained" color="primary" onClick={handleAddLyric}>Adicionar</Button>
                <Button id="buttonMakeSlides" variant="contained" color="primary" onClick={handleAlterLyric}>Alterar</Button>
            </div>
        </div>
        
    )
}