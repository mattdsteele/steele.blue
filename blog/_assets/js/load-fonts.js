import FontFaceObserver from 'fontfaceobserver/fontfaceobserver';

class FontLoader {
  constructor(fontFace) {
    if (!document.body.classList) {
      return;
    }

    let observer = new FontFaceObserver(fontFace);

    observer.check().then(() => {
      let className = fontFace.toLowerCase().replace(' ', '-');
      document.body.classList.add(`font-${className}`);
    });
  }
}

new FontLoader('Enriqueta');
new FontLoader('Istok Web');
