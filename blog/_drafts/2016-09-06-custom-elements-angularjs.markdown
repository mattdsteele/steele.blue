---
layout: post
title: Building Custom Elements That Work With Angular 1 and 2
---

So Web Components! They've recently gotten [a lot of love][wcyay], and [a lot of hate][wcboo].

Let's talk about Custom Elements in particular.
This is the technology that lets you drop `<relative-time>` on a page, and it renders into something usable and pretty. No framework required.

The [Web Components proponents propose composing](http://staltz.com/react-could-love-web-components.html) Web Components into existing frameworks, particularly as leaf nodes.
So you'd write an Angular component that contained your business logic, and part of its `template` would be some Custom Elements, alongside standard HTML and an Angular component or two.

I haven't seen this interop story in action (or documented) in many places.
In particular, **how do you build a Custom Element that'll work in both Angular 1 and Angular 2 apps**?

I've been feeling sick this weekend, so what better time to investigate a new technology and make thought-leader-y proclamations?

*Note*: I'll be using on the new "V1" version of the Web Component spec. [Here's a good intro article](https://developers.google.com/web/fundamentals/primers/customelements/), and [here's a polyfill](https://github.com/WebReflection/document-register-element).

## Building The Web Component

Let's make a `<countdown-timer>` Custom Element.
You give it the number of seconds you want the timer to run, and it'll spit out an event (with a message) when the countdown ends.

We'll use a "one-way data flow" architecture - the element will accept its inputs via properties, and spit out DOM Events for its outputs. 
This is the architecture Angular 2 uses, (and [the recommended approach for modern Angular 1 apps][ng2patterns].

Here's the component in all its dumb glory:

```javascript
class CountdownTimer extends HTMLElement {
	connectedCallback() {
		const template = `
			<button class="countdown-start">Start the countdown</button>
			<span class="seconds-left"></span>
			`;
		this.innerHTML = template;

		// Useful references
		this.button = this.querySelector('.countdown-start');
		this.secondsDisplay = this.querySelector('.seconds-left');

		// Initialize
		this.button.addEventListener('click', () => this.handleClick());
	}

	handleClick() {
		this.updateTimer();
		this.button.disabled = true;
		this.button.innerHTML = 'YOU DID IT';
		this.updateTimer();
		const counter = window.setInterval(() => {
			this.seconds--;
			this.updateTimer();
			if (this.seconds === 0) {
				window.clearInterval(counter);
				console.info('BOOM');
			}
		}, 1000);
	}

	updateTimer() {
		this.secondsDisplay.innerHTML = this.seconds;
	}

}

window.customElements.define('countdown-timer', CountdownTimer);
```

Not much to it - initialize stuff in the `connectedCallback` hook, and then add your functionality.

## Angular 2

Consuming this in Angular 2 is pretty straightforward: you use the `[prop]="value"` syntax to bind to a property, and the `(event)="handler()"` syntax to bind to events.

An Angular component that uses it might look like:

{% raw %}
```javascript
import { Component } from '@angular/core';

@Component({
  selector: 'countdown-component',
  template: `
    <h2>Countdown Timer</h2>

    <countdown-timer 
      [seconds]="countdownSeconds" 
      (countdownEnded)="onCountdownEnded($event.detail.message)"
    ></countdown-timer>

    <p>Message from timer: {{countdownEndedMessage}}</p>
  `
})
export class CountdownComponent {
  countdownSeconds = 6;
  onCountdownEnded(message) {
    this.countdownEndedMessage = message;
  }
}
```
{% endraw %}

One thing to watch out for, if you get an error like this:

```
Can't bind to 'seconds' since it isn't a known property of 'countdown-timer'.
1. If 'countdown-timer' is an Angular component and it has 'seconds' input, then verify that it is part of this module.
2. If 'countdown-timer' is a Web Component then add "CUSTOM_ELEMENTS_SCHEMA" to the '@NgModule.schema' of this component to suppress this message.
```

You'll need to add `CUSTOM_ELEMENTS_SCHEMA` to your `@NgModule` declaration, via:

```javascript
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  // module boilerplate
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
```

## Angular 1

Out of the box, our Web Component won't play nicely with Angular 1. There are two problems:

* Its templating system binds to an element's attributes, while our component updates the element's properties
* Angular isn't aware of the events your Custom Element fires

So! We have two ways we can fix this.

### Option 1: Change the Custom Element

On the input side, we can add some code to our Custom Element that looks for attribute changes, using a few CE lifecycle hooks:

```javascript
static get observedAttributes() {
  return ['seconds'];
}

attributeChangedCallback(name, oldVal, newVal) {
  if (name === 'seconds') {
    this.seconds = newVal;
  }
}
```

{% raw %}
And then bind to the attribute in our template (note the use of `ng-attr` to prevent the CE from seeing the raw `{{expression}}`):

```html
<countdown-timer ng-attr-seconds="{{$ctrl.secondsLeft}}"></countdown-timer>
```
{% endraw %}

On the output side, we can bind to the event manually, and wrap it in `$scope.$apply()` to make sure the digest call gets invoked:

```javascript
$element.on('countdownEnded', (e) => {
  // If we don't do a digest, this doesn't get picked up immediately
  $scope.$apply(() => {
    this.message = e.detail.message;
  });
});
```

And even this has limitations:

* Binding to attributes means you're limited to passing String expressions to your custom element
* You lose encapsulation by binding to the Custom Element's events in your Angular controller. Ideally you'd write a wrapper component that provided an `on-countdown-ended` attribute and ran a digest manually, but now you're writing wrapper components for *every* Custom Element you import, and we were trying to get away from that!
* Plus, you're modifying your supposedly framework-agnostic Custom Element to satisfy a particular framework

So yeah, that sucks. Hope there's a better way!

### Option 2: Use a Glue Library

Should've read ahead in my post, I guess.

Rob Dodson wrote a [set of directives to help Custom Elements interop with Angular 1](https://github.com/robdodson/angular-custom-elements). It's labelled for use with the Polymer project, but it'll work for any Custom Element, including ours.

After you've installed it in your project (check the README), you can start using it.
Since we're using a one-way data flow, we can add the `ce-one-way` directive to our Angular template:

```html
<countdown-timer ce-one-way
  seconds="$ctrl.secondsLeft" 
  on-countdown-ended="$ctrl.countdownEnded()"
></countdown-timer>
```

We did have to make one tweak to our Custom Element to make this work:
we renamed the Event to `countdown-ended`, to match the naming pattern library expects.
Could be worse, I suppose.

## Custom Elements as a Framework Migration Strategy

At my work, we maintain an enterprise component library. It's currently built as a set of Angular 1 directives.
As we begin the process of migrating to Angular 2, we want to make the process smooth as butter.

We *could* rebuild our component library as a set of Angular 2 components.
Angular 1 interoperability could come using [ngUpgrade](https://angular.io/docs/ts/latest/guide/upgrade.html), but this begs the question: what happens when we ditch Angular 2?

Our components are still dependent on a single framework, and they'll have to be rewritten once we move away from Angular 2, to whatever the latest shiny component library is.

Building your company's component library on Custom Elements solves multiple problems. Short-term, it helps you migrate from Angular 1 to Angular 2, since both applications can use the same component library.

Long-term, it helps isolate your company's component library from the Sturm und Drang of front-end frameworks.
So long as a framework speaks Web Component-ese, they can use the company's components.
So you can support that weird Ember team, the stodgy server-rendered JSP folks, and even the framework-less static page hipsters.

So yeah, give Custom Elements a looksie. You have nothing to lose but a future rewrite.
And as Dion Almaer noted: [How would the component landscape look if we weren’t all rebuilding our own houses?](https://medium.com/ben-and-dion/web-components-building-web-tools-for-future-dion-1d0e731c96d2#.inn076mvm)

[wcyay]: https://medium.com/dev-channel/the-case-for-custom-elements-part-1-65d807b4b439#.inbchipy8
[wcboo]: https://medium.com/@tomdale/that-would-be-nice-but-in-my-experience-framework-agnostic-components-are-a-long-way-off-8c1cd5efcb7#.2sexknttl
[ng2demo]: http://plnkr.co/edit/DChy5JG3QaqOVVmauZCb?p=preview
[ng2patterns]: http://www.angular2patterns.com/
