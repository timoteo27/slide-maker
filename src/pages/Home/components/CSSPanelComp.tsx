import React from 'react';
import { TextField, Button } from '@material-ui/core';
import { ChangeEvent } from 'react';

type CSSPanelProps = {
    stringCSSJson: string,
    handleChangeCSS: (e: ChangeEvent<HTMLTextAreaElement>) => void, 
    handleApplyCSS: () => void
}

export default function CSSPanelComp({stringCSSJson, handleChangeCSS, handleApplyCSS}: CSSPanelProps) {

    return (
        <div>
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
            <Button id="buttonApplyCSS" variant="contained" onClick={handleApplyCSS}>Aplicar</Button>
        </div>
    )
}