declare module 'translit-rus-eng' {
  export default function translitRusEng(
    word: string,
    options: { slug?: boolean }
  ): string;
}
