import React from 'react';
import { TextField, Button } from '@material-ui/core';
import { ChangeEvent } from 'react';
import './CSSPanelComp.css';

type CSSPanelProps = {
  stringCSSJson: string;
  handleChangeCSS: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleApplyCSS: () => void;
};

export default function CSSPanelComp({
  stringCSSJson,
  handleChangeCSS,
  handleApplyCSS,
}: CSSPanelProps) {
  return (
    <div className="css-panel">
      <div className="css-input">
        <TextField
          id="multilineCSS"
          label="CSS"
          multiline
          rows={6}
          value={stringCSSJson}
          onChange={handleChangeCSS}
          variant="outlined"
          fullWidth
        />
      </div>
      <div className="buttons">
        <Button
          id="buttonApplyCSS"
          variant="contained"
          onClick={handleApplyCSS}
        >
          Aplicar
        </Button>
      </div>
    </div>
  );
}
