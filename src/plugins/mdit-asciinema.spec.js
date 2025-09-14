import markdownit from 'markdown-it';
import { asciinema } from './mdit-asciinema.js';

const test = async () => {
    const md = markdownit();
    md.use(asciinema);

    const out = md.render('[asciinema /static/videos/asc.cast]');
    console.log(out);

    const out2 = md.render(`# hello

[asciinema /foo/bar.cast]

# bar`);
    console.log(out2);

}

test();