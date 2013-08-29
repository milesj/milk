 __    __     __     __         __  __
/\ "-./  \   /\ \   /\ \       /\ \/ /
\ \ \-./\ \  \ \ \  \ \ \____  \ \  _"-.
 \ \_\ \ \_\  \ \_\  \ \_____\  \ \_\ \_\
  \/_/  \/_/   \/_/   \/_____/   \/_/\/_/

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Milk is a fork of the popular MooTools library which aims to refactor it for prime time.

### What's new? ###

Milk will now require Lodash (or another equivalent library like Underscore, Sugar or Async) for prototype and utility functionality.
These vendors provide extensive compatibility, robust performance, and thorough unit test coverage. Why re-create the wheel?

Besides the vendor requirement, the following new features can be found.

* Extending native prototypes with vendor functions (above)
* Event namespacing
* Promises or callback deferring
* Method aliases (appendTo(), etc)
* CSS3 support (box-sizing, etc)
* Pseudo selectors

And the following MooTools More modules have been merged into the core of Milk.

* `Class.Binds`
* `Elements.from`'
* `Element.Event.Pseudos`
* `Element.Measure`
* `Element.Position`
* `Element.Shortcuts`

### What's changed? ###

The following MooTools Core modules have been removed from Milk. Either their functionality is obsolete,
or a replacement has been provided.

* Deprecated 1.2/1.3 functionality like `chk`, `pick`, etc
* Old browser compatibility
* `Browser` - Use feature detection instead
* `Fx` - Use CSS3 transitions and animations instead
* `Slick` - Replaced with `querySelectorAll()` and other built-in browser functionality
* `Array`, `Number`, `Object`, `String` - Prototype functions will be inherited through Lodash (or Underscore)
* `JSON` - Use the built-in browser functionality instead

Most, if not all of the MooTools More modules will no longer be compatible.
Supporting More modules will be on a case by case basis.

### Supported Browsers ###

* Chrome 8+
* Firefox 4+
* Internet Explorer 9+
* Safari 4+
* Opera 10.5+

Why a minimum requirement of IE9? Simply put, IE8 and below do not support functionality like `getComputedStyle()`,
`getElementsByClassName()`, `matchesSelector()`, class lists, advanced CSS3 selectors, HTML5 elements, event handling, and much more.
By removing these outdated browsers as a dependency, the code base can be greatly reduced.

Furthermore, Milk is intended to be used in modern browsers supporting the latest and greatest.
It's best to start preparing for the future.