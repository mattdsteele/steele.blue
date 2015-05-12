---
layout: post
title: Bringing ArnoldC to JavaScript
subtitle: Or, How to Learn to Write a Compiler Through Silliness
---

At [NebraskaJS][nejs] I introduced my dumbest project yet: a compiler which converts [ArnoldC][arnoldc] programs into JavaScript, with full support for [Source Maps](/source-maps).

{% youtube Jv52vFLnn54 %}

(Start at 17:46 for the ArnoldC action)

# ArnoldC

ArnoldC is a game changer in the world of software development.
It's a procedural language where every keyword is a catchphrase from an Arnold Schwarzenegger movie.

Here's `helloworld.arnoldc`:

```
IT'S SHOWTIME
  TALK TO THE HAND "hello world"
YOU HAVE BEEN TERMINATED
```

Or, to write `a = (b + 5) * 2`:

```
GET TO THE CHOPPER a
  HERE IS MY INVITATION b
  GET UP 5
  YOU'RE FIRED 2
ENOUGH TALK
```

(Note the unique order of operations in ArnoldC: mathematical operations are applied as a left-to-right stack, with no operator hierarchy.)

ArnoldC has been around for a few years, but it had one fatal flaw: the [reference implementation][arnoldc] compiles **JVM bytecode**.
And while Write Once Run Anywhere might have been portable enough for 1998, my programs need to run on the [Assembly Language of the Web](https://www.youtube.com/watch?v=PlmsweSNhTw).

## ArnoldC-to-JavaScript

To be honest, I didn't write most of the compiler.
I built on the excellent work done by [Thomas Crevoisier][thomasc], who did most of the heavy lifting with his [arnoldc-to-javascript](https://github.com/ThomasCrvsr/arnoldc-to-js) project.
I simply added Source Maps and did some refactoring. But I learned lots along the way!

## Demo

[Here's an AngularJS controller written in ArnoldC][demo], that simply prints out FizzBuzz up to 100. Hit F12 and check it out in its source-mapped glory.
Note that there are a few esoteric things ArnoldC can't do, such as understand what `this.value` means.
But thanks to a liberal use of `eval()`, anything is possible in arnoldc.js!
Just don't tell Douglas Crockford.

[Source code is available here][arnoldcsource].

# Build your own compiler

I never took a compilers course in school, but friends who graduated from better CS programs than me used descriptive phrases like "brain-melting" or "nightmare-ish".
Luckily, **you don't need to know how to write a compiler to write a compiler in JavaScript!**
If you understand a few key concepts, you can take advantage of libraries and tooling that make writing your own compiler a breeze.

I registered for a [Stanford compilers course][coursera], but only watched up through the "Parsing" section.
That's probably all you need to get started.

Broadly, a compiler works in two phases: lexing and parsing.
The *lexer* takes your source code and converts it into tokens, such as `START_IF_STATEMENT`, or `ADDITION_OPERATOR`. 

You then run your code through a *parser*, which is where the tokens get assembled into an Abstract Syntax Tree.
From here, you have a structured program and can write a translation from the input program into JavaScript.

## Jison

Writing lexers and parsers is difficult, so I've been told. But you don't have to do it!
Instead, you can define your language (keywords and structure) using regular expressions, and use [Jison](https://zaach.github.io/jison/docs/) to generate the lexer and parser automatically.

Jison was written by Mozilla's Zach Carter, and forms the spine of the ArnoldC compiler. Jison is a port of the C program [Bison(https://www.gnu.org/software/bison/), which performs a similar role using a less fun language. But many of its [docs](http://dinosaur.compilertools.net/bison/bison_4.html#SEC7) might be useful to peruse.

Here's part of [ArnoldC's lexer](https://github.com/mattdsteele/arnoldc.js/blob/master/lib/arnoldc.jison), written in Jison:

```
%lex
%%

\s+                             /* skip whitespaces */
"IT'S SHOWTIME"                 return 'BEGIN_MAIN'
"YOU HAVE BEEN TERMINATED"      return 'END_MAIN'
\-?[0-9]+                       return 'NUMBER'
"TALK TO THE HAND"              return 'PRINT'
"@I LIED"                       return 'FALSE'
<<EOF>>                         return 'EOF'

/lex
```

Keywords go on the left, and the name of the token is on the right.
The keywords are regular expressions, so they can be as complicated as you need.

The parser then takes these keywords and creates a language out of them. Here's a higher-level ArnoldC concept of a "statement":

```
statement
  : PRINT integer
      { $$ = new yy.PrintExpression(@1.first_line, @1.first_column, $2); }
  | PRINT string
      { $$ = new yy.PrintExpression(@1.first_line, @1.first_column, $2); }
  | DECLARE_INT variable SET_INITIAL_VALUE integer
      { $$ = new yy.IntDeclarationExpression(@1.first_line, @1.first_column, $2, $4); }
//etc
```

`integer`, `string`, etc each have their own definitions, as well.
There's a bunch of Jison-specific code here, but the gist is that a `statement` can look like any of these expressions.
And for each expression, you can write a JavaScript function that knows how to handle that code.
You can use Jison-specific variables like `$2`, which simply represents the actual value of `integer` in the source code (since it's the second token in the `PRINT integer` expression.

You can also see the use of `first_line` and `first_column`, which is the basis for the source maps the compiler generates.

So from there, you can assemble a bunch of `statement` expressions in a row, and create a `statements` meta-expression:

```
statements
  : statements statement
    { $$ = $1.concat($2); }
  |
    { $$ = []; }
  ;
```

This is a recursive definition that, at its root, creates an empty array. And for each statement in a row it finds, it just adds it to the array.
This recursive pattern tends to show up a lot Jison definitions.

So now, you can define an entire program like this:

```
program
  : methods BEGIN_MAIN statements END_MAIN methods EOF
      { return $1.concat($5).concat(new yy.MainExpression($3, @2.first_line, @2.first_column, @4.first_line, @4.first_column)); }
    ;
```

So you've got a `BEGIN_MAIN` keyword, a set of statements, an `END_MAIN` keyword, and on either side a set of `methods` expressions (which are defined similarly to `statements`).

## Parsing with Source Maps

The actual parsing and conversion to source maps is just standard JavaScript. You get your inputs (in this case, a set of tokens from an ArnoldC program), and return the JavaScript code that represents that section of code.

You have a few choices on what to return from your parser functions. The original ArnoldC compiler returned JavaScript Strings that simply got concatenated into the final `.js` file.
Or, you can use Mozilla's excellent [source-map](https://github.com/mozilla/source-map) library to return both the generated .js, as well as a Source Map you can define along the way.

I followed [Mozilla's guide][mozilla] essentially word-for-word, so I'll just link to that excellent article; you'll want to read it and re-read it.
It uses Jison, and also shows how to integrate Source Maps into a compiler.
This is where the bulk of the actual compiler work is done, and will be unique to each language.

[ArnoldC's parser functions](https://github.com/mattdsteele/arnoldc.js/blob/master/lib/ast.js) each returns a `SourceNode` object, which can contain other `SourceNode` objects. This is done for each expression in the abstract syntax tree you've built out.

Once you've parsed the entire AST, you can use the library's `toStringWithSourceMap` function - it returns an object with `map` and `code` properties, which can then be saved off to the file system.

Here's an example of the final code for transpiling ArnoldC's print expression `TALK TO THE HAND`: 

```javascript
PrintExpression.prototype.compile = function(indent, fileName) {
    return this._sn(indent, fileName, 'console.log( ')
        .add(this.value.compile(indent, fileName))
        .add(' );\n');
};
```

All of this might sound complicated (and at first it was), but I found that there's a pattern to it all, and once you learn that pattern, everything kind of falls into place.

## Other Resources

These videos from 2013 Front-Trends were super helpful for me to wrap my head around these concepts: [Zachary Carter's talk on Jison][video-jison], and [Nick Fitzgerald's overview of Source Maps][video-maps].

The original [ArnoldC][arnoldc] port has lots of great examples, including solutions to Project Euler problems.

Next up? [Chicken.js][chicken]

[thomasc]: http://thomascrvsr.github.io/
[nejs]: http://nebraskajs.com/
[arnoldc]: https://github.com/lhartikk/ArnoldC/wiki/ArnoldC
[video-jison]: https://vimeo.com/68477808
[video-maps]: https://vimeo.com/68680320
[coursera]: https://class.coursera.org/compilers/lecture
[mozilla]: https://hacks.mozilla.org/2013/05/compiling-to-javascript-and-debugging-with-source-maps/
[demo]: http://projects.steele.blue/source-maps/example3.html#/arnoldc
[arnoldcsource]: https://github.com/mattdsteele/sourcemaps-presentation/blob/master/examples/src/arnoldc/fizzbuzz.arnoldc
[chicken]: http://torso.me/chicken
