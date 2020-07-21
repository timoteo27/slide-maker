import React from 'react';
import {useState, useEffect} from 'react';
import { CSSProperties, MouseEvent, ChangeEvent } from 'react';
import './LyricEditorComp.css';
import {LyricLine, Lyric} from '../types'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';

type LyricEditorProps = {
    lines: LyricLine[],
    currentSlide: number,
    currentSubtitle: number,
    editLyric: (l:Lyric, newLyric?: boolean) => void,
    onPhraseDoubleClick: (e:MouseEvent<HTMLInputElement, globalThis.MouseEvent>) => void,
    onPhraseChange: (e:ChangeEvent<HTMLInputElement>) => void,
}

export default function LyricEditorComp(
    { lines, currentSlide, currentSubtitle, onPhraseDoubleClick, onPhraseChange, editLyric }: LyricEditorProps) {

    const [lyricSwitch, setLyricSwitch] = useState({
        checkedA: true,
        checkedB: false,
    });
    const [currentPhraseInput, setCurrentPhraseInput] = useState('');
    const [nPhraseSlide, setNPhraseSlide] = useState<number>(10);
    const [nPhraseSubtitle, setNPhraseSubtitle] = useState<number>(2);

    useEffect(()=> {
        console.log('use effect !!!!! lines changed');
        setCurrentPhraseInput(lines.map(r => r.phrase).join('\n'));
    }, [lines])

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
            newLyricLines = [...newLyricLines, { id: count, type: 'phrase', id_slide: nSlide, id_subtitle: nSubtitle, phrase: line }];
        })
        let newLyric: Lyric = {
            lyric_name: newLyricLines[0].phrase,
            lines: newLyricLines,
            lines_slide: nPhraseSlide,
            lines_subtitle: nPhraseSubtitle,
            total_slides: ~~(newLyricLines.length / nPhraseSubtitle),
        }
        return newLyric;
    }

    const isShowingSlide: CSSProperties = {
        backgroundColor: "blue",
    }

    const isShowingSubtitle: CSSProperties = {
        backgroundColor: "green",
    }

    const inputLyricTemplate = 
        <TextField
            id="multilineLyrics"
            label="Letra"
            multiline
            rows={20}
            value={currentPhraseInput}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCurrentPhraseInput(e.target.value)}
            variant="outlined"
            fullWidth
        />
    
    const editLyricTemplate = 
        <div id="lyricEditTable">        
            {lines.map(l => (            
                <div id={`line_${l.id.toString()}`} className="line">
                    <div className="column-params">
                        <input type="text" id={`inputType_${l.id}`} value={l.type} />
                        <input type="text" id={`inputNumSl_${l.id}`} value={l.id_slide} style={l.id_slide===currentSlide ? isShowingSlide : {}}/>
                        <input type="text" id={`inputNumSu_${l.id}`} value={l.id_subtitle} style={l.id_subtitle===currentSubtitle ? isShowingSubtitle : {}}/>                        
                    </div>
                    <div className="column-phrase">
                        <input type="text" id={`${l.id}_${l.id_subtitle}`} value={l.phrase} 
                            onDoubleClick={onPhraseDoubleClick}
                            onChange={onPhraseChange}/>
                    </div>
                </div>
            ))}
            <Button variant="contained" id="buttonApply">Aplicar</Button>            
        </div>

    return (
        <div>
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