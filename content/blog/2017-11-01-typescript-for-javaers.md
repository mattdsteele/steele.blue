---
layout: post
title: Every Java Developer Should Learn TypeScript
---

I gave a talk to the Omaha Java Users Group about [TypeScript][ts]:

`youtube:https://www.youtube.com/embed/7v9GxHR2Ffg`

I think there's a lot of things TypeScript has to offer Java developers, namely:

**Static Typing** - This one's obvious; if you're used to a compiler providing thousands of tiny continuously-running unit tests, you're going to miss that on the front-end.

But what's even cooler is TypeScript's features of _incremental_ and _inferred_ typing. You can achieve full type safety in this code:

```typescript
class MathFns {
  static for(val) {
    return {
      square() {
        return val * val
      },
    }
  }
}

const fns = MathFns.for(5)
console.log(fns.square())
```

By adding a single type token:

```typescript
class MathFns {
  static for(val: number) {
    return {
      square() {
        return val * val
      },
    }
  }
}

const fns = MathFns.for(5)
console.log(fns.square())
```

Inferred typing means you add drastically fewer tokens than you would to make Java code typesafe; conservatively you'd have to add least six type tokens in an equivalent Java program. Incremental typing means you can convert existing JavaScript code into TypeScript without it being all-or-nothing.

I also appreciate TypeScript's _structural type system_, which also provides strong type-safety without having to declare that a function implements a particular interface, or extends from a parent class, etc. [This article][structural] goes deep into the differences.

It's also easy to **integrate into a Java workflow**, with [Maven](https://github.com/gnkoshelev/typescript-maven-plugin) and [Gradle](https://github.com/sothmann/typescript-gradle-plugin) plugins if you wanna use them, as well as tooling for Eclipse, IntelliJ, and other IDEs.

I'm still getting over the cognitive dissonance that a tool from Microsoft, created by the C# language designer, might be the best way to ease Java developers into the front-end. But now that I'm used to static typing, I get _angry_ when I have to go back to vanilla JavaScript, and I have TypeScript to thank for that.

Regardless of what [Rich Hickey][clj] says.

[ts]: http://typescriptlang.org/
[structural]: https://www.triplet.fi/blog/type-system-differences-in-typescript-structural-type-system-vs-c-java-nominal-type-system/
[clj]: https://www.youtube.com/watch?v=2V1FtfBDsLU
