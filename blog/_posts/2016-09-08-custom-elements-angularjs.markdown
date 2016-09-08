---
layout: post
title: Building Custom Elements That Work With Angular 1 and 2
---

So Web Components! They've recently gotten [a lot of love][wcyay], and [a lot of hate][wcboo].

Let's talk about Custom Elements in particular.
This is the technology that lets you drop `<relative-time>` on a page, and it renders into something usable and pretty. No framework required.

The [Web Components proponents propose composing](http://staltz.com/react-could-love-web-components.html) Web Components into existing frameworks, particularly as leaf nodes.
So you'd write your Angular/React/whatever app that contained your business logic, and its templates would be made up of Custom Elements, standard HTML, and other Angular/React/whatever components.

I haven't seen this interop story in action (or documented) in many places.
In particular, **how do you build a Custom Element that'll work in both Angular 1 and Angular 2 apps**?

*Note*: I'll be using on the new "V1" version of the Custom Elements spec. [Here's a good intro article](https://developers.google.com/web/fundamentals/primers/customelements/), and [here's a polyfill](https://github.com/WebReflection/document-register-element).

## Building The Custom Element ([View on GitHub](https://github.com/mattdsteele/countdown-timer-element))

Let's make a `<countdown-timer>` Custom Element.

You give it the number of seconds you want the timer to run, and it'll spit out an event (with a message) when the countdown ends.

We'll use a "one-way data flow" architecture - the element will accept its inputs via properties, and spit out DOM Events for its outputs. 
This is the architecture Angular 2 uses, (and [the recommended approach for modern Angular 1 apps][ng2patterns].

Here's the element in all its dumb glory:

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

## Angular 2 ([View Demo](http://plnkr.co/edit/wNkzWzRvTVGZL1SdQHFk?p=preview))

Consuming this in Angular 2 is pretty straightforward: you use the `[prop]="value"` syntax to bind to a property, and the `(event)="handler()"` syntax to bind to events.

A component that uses it might have a template that looks like:

{% raw %}
```javascript
    <p>
      <label>How long to count down? 
        <input [(ngModel)]="secondsLeft" type="number">
      </label>
    </p>
    <countdown-timer 
      [seconds]="secondsLeft" 
      (countdown-ended)="handleCountdownEnded($event.detail)">
    </countdown-timer>
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

## Angular 1 ([View Demo](http://plnkr.co/edit/3N3Kk7bSJVgPsSImYjrv?p=preview))

Out of the box, our Custom Element won't play nicely with Angular 1. There are two problems:

* Its templating system binds to an element's *attributes*, while our component updates the element's *properties*
* Angular isn't aware of the events your Custom Element fires, and doesn't hook into the normal `&` callback bindings

So! We can fix this in a couple different ways:

### Option 1: Change the Custom Element

On the input side, we can add some code to our Custom Element that looks for attribute changes.
There are lifecycle hooks in the spec for this:

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
And then bind to the attribute in our template (note the use of `ng-attr` to prevent the element from seeing the raw `{{expression}}`):

```html
<countdown-timer ng-attr-seconds="{{$ctrl.secondsLeft}}"></countdown-timer>
```
{% endraw %}

On the output side, we can bind to the event manually in our Angular controller, and wrap it in `$scope.$apply()` to make sure a digest runs:

```javascript
$element.on('countdownEnded', (e) => {
  // If we don't do a digest, this doesn't get picked up immediately
  $scope.$apply(() => {
    this.message = e.detail.message;
  });
});
```

But this has limitations:

* Binding to attributes means you're limited to passing String expressions to your Custom Element
* You lose encapsulation by binding to the Custom Element's events in your Angular controller. If you wanted to write idiomatic AngularJS, you'd have to create a wrapper component that provided an `on-countdown-ended` attribute, and run a digest manually. But now you're writing wrapper components for *every* Custom Element you import, and we were trying to get away from that!
* Plus, you're modifying your supposedly framework-agnostic Custom Element to satisfy a particular framework

So yeah, that sucks. Hope there's a better way!

### Option 2: Use a Glue Directive

Should've read ahead in my post, I guess.

Rob Dodson wrote a [set of directives to help Custom Elements interop with Angular 1](https://github.com/robdodson/angular-custom-elements). It's labelled for use with the Polymer project, but it'll work for any Custom Element, including ours.

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

## Framework Migration, and Framework Independence

At work, we maintain an enterprise component library, like many large orgs do.
It's currently built as a set of Angular 1 directives.
As we begin to investigate Angular 2, we want to make the migration process smooth as butter.

We *could* rebuild the component library as a set of Angular 2 components, and
Angular 1 interoperability could come through the [ngUpgrade module](https://angular.io/docs/ts/latest/guide/upgrade.html), probably.

But this begs the question: what happens when we ditch Angular 2? Our components would again be dependent on a single framework, and they'd have to be rewritten once again.

Building your company's component library on Custom Elements solves multiple problems.

Short-term, it helps you migrate from Angular 1 to Angular 2, since both applications can use the same component library.

Long-term, it helps isolate your company's component library from the Sturm und Drang of front-end frameworks.
So long as a framework interacts with the DOM (and they all do), they can use your components.

So you can support that weird Ember team, the stodgy server-rendered JSP folks, and even the framework-less static page hipsters.

So yeah, **Custom Elements are awesome** and you should give them a looskie.
As Dion Almaer noted: [How would the component landscape look if we weren’t all rebuilding our own houses?](https://medium.com/ben-and-dion/web-components-building-web-tools-for-future-dion-1d0e731c96d2#.inn076mvm)

[wcyay]: https://medium.com/dev-channel/the-case-for-custom-elements-part-1-65d807b4b439#.inbchipy8
[wcboo]: https://medium.com/@tomdale/that-would-be-nice-but-in-my-experience-framework-agnostic-components-are-a-long-way-off-8c1cd5efcb7#.2sexknttl
[ng2demo]: http://plnkr.co/edit/DChy5JG3QaqOVVmauZCb?p=preview
[ng2patterns]: http://www.angular2patterns.com/
