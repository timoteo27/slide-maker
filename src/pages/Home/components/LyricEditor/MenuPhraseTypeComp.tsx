import React from 'react';
import { useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { LyricLine } from '../../types';
import './MenuPhraseTypeComp.css'

type MenuPhraseProps = {
  lyricValue: LyricLine,
  onChange: (lyricValue: LyricLine) => void,
}

export default function MenuPhraseTypeComp(
  {lyricValue, onChange}: MenuPhraseProps ) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
    const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = (phraseType:string) => {
      lyricValue.type = phraseType;
      onChange(lyricValue);
      setAnchorEl(null);
    };
  
    return (
      <div className="main-div">
        <input 
          type="text" 
          id={`inputType_${lyricValue.id}`} 
          value={lyricValue.type.toUpperCase().charAt(0)} 
          aria-controls="simple-menu" 
          aria-haspopup="true" 
          onClick={handleClick}
          readOnly/>        
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleClose('title')}>Título</MenuItem>
          <MenuItem onClick={() => handleClose('phrase')}>Frase</MenuItem>
          <MenuItem onClick={() => handleClose('author')}>Autor</MenuItem>
        </Menu>
      </div>
    );
  }