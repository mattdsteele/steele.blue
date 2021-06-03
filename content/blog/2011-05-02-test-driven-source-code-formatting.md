---
layout: post
title: Test-driven source code formatting
categories: []
tags: []
status: publish
type: post
published: true
meta:
  _elasticsearch_indexed_on: '2011-05-02 19:49:14'
---

This morning, I had to fight a production error in an application I support. It turns out that using SELECT \* statements with Spring JDBC can cause problems when you add new columns to the table. It has something to do with Oracle caching; I'm not sure.

So, SELECT \* statements are evil. But how do you ensure your codebase doesn't contain any? Being a good test-driven developer, I wanted to have a failing test before making wide swaths of changes to my source code.
The solution I settled on was to write a new static analysis rule, using Checkstyle, to warn me when it identified a SELECT \* statement. Here's what it looks like (you can put this in a Checkstyle v5 xml file):

```xml
<module name="RegexpSinglelineJava">
  <property name="format" value="SELECT.*[\. ]\*"/>
  <property name="ignoreComments" value="true"/>
  <property name="message" value="Do not use SELECT * statements"/>
</module>
```

It's a regular expression that looks for a SELECT, followed by anything, and then either a dot or a space followed by the asterisk. This way, we can capture:

```sql
SELECT * from table
SELECT t.* from table t
```

But not:

```sql
SELECT count(*) from table
```

Adding this check to our build immediately caught 13 instances where we performed this nefarious deed.  Using a continuous integration build like Hudson, it was easy to identify and track how we were progressing in removing these from the build:

![png](../images/png.png)

Of course, there a number of issues with this approach:

- Queries defined outside of a .java file aren't scanned
- The regex misses queries defined over multiple lines

But it's a nice quick solution to an immediate problem, and we can iterate to solve it.  I hadn't thought about using static analysis tools as a form of test-driven development, but it seems like a natural extension of the red/green/refactor cycle.
