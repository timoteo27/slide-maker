import React from 'react';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { SlideOutput } from '../types';
import titleBackground from '../assets/images/title_background.png';

type SlideOutputProps = {
  cssSlide: CSSProperties;
  cssSubtitle: CSSProperties;
  cssBlank: CSSProperties;
  slideOut: SlideOutput;
  hideSlide?: boolean;
};

export default function SlideOutputComp({
  cssSlide,
  cssSubtitle,
  cssBlank,
  slideOut,
  hideSlide,
}: SlideOutputProps) {
  if (slideOut === undefined) {
    return <div>Nenhum dado informado...</div>;
  }

  return (
    <div id="slideContainer" className="slide-container">
      <div id="slideOutput" style={hideSlide ? cssBlank : cssSlide}>
        {slideOut.slide_lines.map((strSlide, count) => (
          <span key={`slideKey_${count}`}>
            {strSlide === '' ? ' ' : strSlide}
          </span>
        ))}
      </div>
      <div id="subtitleOutput" style={cssSubtitle}>
        {slideOut.subtitle_lines.map((strSlide, count) => (
          <span key={`subtitleKey_${count}`}>
            {strSlide === '' ? ' ' : strSlide}
          </span>
        ))}
      </div>
    </div>
  );
}
