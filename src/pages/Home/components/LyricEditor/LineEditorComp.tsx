import React, { 
    useState, 
    CSSProperties, 
    FocusEvent, KeyboardEvent, ChangeEvent, MouseEvent } from 'react';
import MenuPhraseTypeComp from './MenuPhraseTypeComp';
import { LyricLine } from '../../types';

type LineEditorProps = {
    initialValue: LyricLine,
    currentSlide: number,
    currentSubtitle: number,
    onLineSubmit: (l:LyricLine) => void,
    onLineControlClick: (l:LyricLine) => void,   
}

export default function LineEditorComp(
    {initialValue, currentSlide, currentSubtitle, onLineSubmit, onLineControlClick}:LineEditorProps
) {

    const [ lyricEdit, setLyricEdit ] = useState<LyricLine>(initialValue)
    
    const isShowingSlide: CSSProperties = {
        backgroundColor: "blue",
    }

    const isShowingSubtitle: CSSProperties = {
        backgroundColor: "green",
    }
  
    function handleFocusInput(e: FocusEvent<HTMLInputElement>){
        e.target.select();
    }

    function handlePhraseTypeChanged(lyricValue: LyricLine){
        setLyricEdit(lyricValue);
    }

    function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>){
        if (e.keyCode === 13){
            onLineSubmit(lyricEdit);
        }
    }      

    function handleChangeLyricLine(e: ChangeEvent<HTMLInputElement>){
        const {name, value} = e.target;
        setLyricEdit({...lyricEdit, [name]: value });
    }

    function handleContolClick(e: MouseEvent<HTMLInputElement>){
        if (e.ctrlKey){
            onLineControlClick(lyricEdit)
        }
    }

    return (
        <div className="line">
            <div className="column-params">
                <MenuPhraseTypeComp lyricValue={lyricEdit} onChange={handlePhraseTypeChanged}/>                        
                <input 
                    name="id_slide"
                    type="text" 
                    maxLength={1}
                    id={`inputNumSl_${lyricEdit.id}`} 
                    value={lyricEdit.id_slide} 
                    style={lyricEdit.id_slide===currentSlide ? isShowingSlide : {}} 
                    onFocus={handleFocusInput}
                    onKeyDown={handleInputKeyDown}
                    onChange={handleChangeLyricLine}/>
                <input 
                    name="id_subtitle"
                    type="text" 
                    maxLength={1}
                    id={`inputNumSu_${lyricEdit.id}`} 
                    value={lyricEdit.id_subtitle} 
                    style={lyricEdit.id_subtitle===currentSubtitle ? isShowingSubtitle : {} } 
                    onFocus={handleFocusInput}
                    onKeyDown={handleInputKeyDown}
                    onChange={handleChangeLyricLine}/>
            </div>
            <div className="column-phrase">
                <input 
                    name="phrase"
                    type="text" 
                    id={`inputPhrase_${lyricEdit.id}`} 
                    value={lyricEdit.phrase} 
                    onClick={handleContolClick}
                    onKeyDown={handleInputKeyDown}
                    onChange={handleChangeLyricLine}
                    />
            </div>
        </div>
    )
}