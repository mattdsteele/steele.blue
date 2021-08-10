# Stuff I learned working with the JavaScript Temporal API

# Pretty similar to Java Time API

The existing JavaScript `Date` API sucks. And like many things, it's Java's fault, and Java's fixing it.

The APIs were [originally ported wholesale from the Java 1.1 era](https://maggiepint.com/2017/04/09/fixing-javascript-date-getting-started/), with all the bugs and warts therein.

Java's APIs sucked badly enough, and long enough, that most devs started using userland libraries, in particular [Joda Time](https://www.joda.org/joda-time/). Eventually the lead maintainer of Joda Time was recruited to create a [new standard date and time library](https://jcp.org/aboutJava/communityprocess/pfd/jsr310/JSR-310-guide.html).

Similarly, a thousand Node flowers have bloomed, all trying to provide a saner date library (including a [port of Joda Time](https://js-joda.github.io/js-joda/), incidentally). And [Maggie Johnson-Pint](https://maggiepint.com/), the core maintainer of Moment.js, has been championing the Temporal API. which is [now in Stage 3](https://tc39.es/proposal-temporal/docs/).

Having worked with both of the "new standards" I'm pretty impressed at the conceptual convergence! Most of the base classes are available in both libraries: from [ZonedDateTime](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/time/ZonedDateTime.html) to [Duration](https://tc39.es/proposal-temporal/docs/#Temporal-Duration), to [Instant](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/time/Instant.html). And combined with the polyfill's [nice TypeScript definitions](https://www.npmjs.com/package/@js-temporal/polyfill), it's really straightforward to just start working with the library, and autocomplete your way to development. 

# No parsing or displaying human-readable dates

# Plays well with Intl API though
