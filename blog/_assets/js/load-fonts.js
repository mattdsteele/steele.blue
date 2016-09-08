import FontFaceObserver from 'fontfaceobserver';

class FontLoader {
  constructor(fontFace) {
    if (!document.body.classList) {
      return;
    }

    let observer = new FontFaceObserver(fontFace);

    observer.load().then(() => {
      let className = fontFace.toLowerCase().replace(' ', '-');
      document.body.classList.add(`font-${className}`);
    });
  }
}

new FontLoader('Enriqueta');
new FontLoader('Istok Web');
