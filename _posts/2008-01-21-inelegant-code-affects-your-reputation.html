---
layout: post
title: Inelegant code affects your reputation
categories: []
tags:
- mint
- security
status: publish
type: post
published: true
meta:
  _elasticsearch_indexed_on: '2008-01-22 04:51:05'
---
You've probably heard about (or signed up with) <a href="http://www.mint.com">Mint</a>, the startup which promises to liberate us all from the Quickens of the world and revolutionize personal finance.  It's gotten quite a few high-profile <a href="http://lifehacker.com/software/screenshot-tour/is-mint-ready-for-your-money-312083.php">positive reviews</a>.

Mint has an incredibly hard sell.  Before handing over all of your financial information to a startup run by <a href="http://www.mint.com/team.html">five folks</a>, they have to convince you to really, truly, <i>deeply</i> trust them.  You're handing over the user name, password, and any personal security questions for your banks and credit cards.  Mint has to overcome barriers not seen since Paypal's startup.  The site prominently displays <a href="http://www.mint.com/safe.html">page</a> after <a href="http://www.mint.com/security-faq.html">page</a> detailing their focus on security.

I was eventually convinced and signed up.  Mint's <a href="http://lifehacker.com/photogallery/Mint-Tour/2870585">account entry</a> page is well designed and ajax-y; set up a new account, and it fires off a few <a href="http://en.wikipedia.org/wiki/XMLHttpRequest">XHR</a>s, keeping you notified of login/signup activity.  Because I'm a curious fellow, I inspected the contents of one:
<pre>
&lt;ajax-response&gt;&lt;response type="" id=""&gt;	&lt;timestamp&gt;0&lt;/timestamp&gt;

&lt;json&gt;[{

"id":xxxx,

"name":"My Personal Bank",

"uri":"https://www.mypersonalbank.com",

"fiId":12345,

"status":123,

"terminal":false,

"balance":9999.99,

"refreshed":"01/21/2008 14:06:15",

"isFirst":false,

"html":"&lt;div class='cardfi ' id='pollElem-12341234'&gt;

&lt;table cellpadding='0' cellspacing='0'&gt;&lt;tbody&gt;&lt;tr&gt;&lt;td class='top-left'&gt;
<pre>			.... html continues ...</pre>
&lt;/table&gt;

&lt;/div&gt;"}]

&lt;/json&gt;

&lt;/response&gt;

&lt;/ajax-response&gt;</pre>
I've cleaned up the response and stripped out any of my personal data; for security, you know?

In any case, notice the data structure Mint's using to encapsulate its information.  The entire content is wrapped in XML, with an &lt;ajax-response&gt; element as its envelope.  There's a &lt;timestamp&gt; elemented appended too, but the bulk of the data is encoded in the &lt;json&gt; element.

In &lt;json&gt;, basic bank information is encoded in key-value pairs, such as the bank's name, URI, etc.  Then there's the "html" key.  Raw HTML lives here, containing mostly data stored in a &lt;table&gt; block.  This is the real meat and potatoes of the XHR; it shows the actual status of the connection.

So backtracking a bit, notice how that data is sent across the server.  The actual markup used to update the page is sent, wrapped in a JSON envelope, which is itself wrapped in an XML envelope.  Mint <i>must</i> be taking security seriously, as they require you to decode <i>three</i> completely different markup wrappers in the scope of a single ajax call.

In all seriousness, this isn't groundbreaking stuff.  Code like this goes up in enterprise applications all the time, and worse kludges won't make it to the <a href="http://thedailywtf.com/">Daily WTF</a> any time soon.

So why worry about it?

As Web apps become more complicated and handle ever increasing amounts of sensitive data, companies can no longer merely claim they are designed with a focus on security.  Fair or not, the code we write says just as much (maybe more!) about how much thought has gone into an application's design.  If your company is already fighting against a torrent of criticism that perceives your product as rapidly designed and possibly insecure, something as simple as redundant nested data structures can have a profound effect on what people think about you and your software.

Mint probably won't lose users explicitly because of the data format of their XHRs.  However, it provides one more piece of ammunition critics can use to paint it as untrustworthy, and may make prospective users just a little more wary of handing over their personal data.  In a hyper-competitive environment like startup software development, why risk it?
