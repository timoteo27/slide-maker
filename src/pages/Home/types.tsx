export type LyricLine = {
    id: number;          // Numero da linha 
    type: 'title' | 'phrase' | 'author';      // Tipo da linha
    id_slide: number;    // Numero do slide
    id_subtitle: number; // Numero do subtítulo
    value: string;       // Conteúda da linha, letra da musica
    showing?: boolean,   // Indica se está sendo apresentado
}

export type SlideOutput = {
    slideLines: string[],
    subtitleLines: string[],
}