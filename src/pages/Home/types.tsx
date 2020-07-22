export type Lyric = {
    id: string,           // Identificador único
    lyric_name: string,   // Nome da música. O mesmo que LyricLine.type = 'Title'
    lines: LyricLine[];   // Linhas da música
    lines_slide: number;    // Quantidade de linhas por slide 
    lines_subtitle: number; // Quantidade de linhas por subtítulo
    total_slides: number; // Numero total de slides
}

export type LyricLine = {
    id: string;          // Identificador único
    type: string | 'title' | 'phrase' | 'author';      // Tipo da linha
    id_slide: number;    // Numero do slide
    id_subtitle: number; // Numero do subtítulo
    phrase: string;       // Conteúda da linha, letra da musica
    showing?: boolean,   // Indica se está sendo apresentado
}

export type SlideOutput = {
    slide_lines: string[],
    subtitle_lines: string[],
    current_slide: number,
    current_subtitle: number,
}