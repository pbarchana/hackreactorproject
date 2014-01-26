(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @license AngularJS v1.2.11-build.2186+sha.766b3d5
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/* jshint maxlen: false */

/**
 * @ngdoc overview
 * @name ngAnimate
 * @description
 *
 * # ngAnimate
 *
 * The `ngAnimate` module provides support for JavaScript, CSS3 transition and CSS3 keyframe animation hooks within existing core and custom directives.
 *
 * {@installModule animate}
 *
 * <div doc-module-components="ngAnimate"></div>
 *
 * # Usage
 *
 * To see animations in action, all that is required is to define the appropriate CSS classes
 * or to register a JavaScript animation via the myModule.animation() function. The directives that support animation automatically are:
 * `ngRepeat`, `ngInclude`, `ngIf`, `ngSwitch`, `ngShow`, `ngHide`, `ngView` and `ngClass`. Custom directives can take advantage of animation
 * by using the `$animate` service.
 *
 * Below is a more detailed breakdown of the supported animation events provided by pre-existing ng directives:
 *
 * | Directive                                                 | Supported Animations                               |
 * |---------------------------------------------------------- |----------------------------------------------------|
 * | {@link ng.directive:ngRepeat#usage_animations ngRepeat}         | enter, leave and move                              |
 * | {@link ngRoute.directive:ngView#usage_animations ngView}        | enter and leave                                    |
 * | {@link ng.directive:ngInclude#usage_animations ngInclude}       | enter and leave                                    |
 * | {@link ng.directive:ngSwitch#usage_animations ngSwitch}         | enter and leave                                    |
 * | {@link ng.directive:ngIf#usage_animations ngIf}                 | enter and leave                                    |
 * | {@link ng.directive:ngClass#usage_animations ngClass}           | add and remove                                     |
 * | {@link ng.directive:ngShow#usage_animations ngShow & ngHide}    | add and remove (the ng-hide class value)           |
 *
 * You can find out more information about animations upon visiting each directive page.
 *
 * Below is an example of how to apply animations to a directive that supports animation hooks:
 *
 * <pre>
 * <style type="text/css">
 * .slide.ng-enter, .slide.ng-leave {
 *   -webkit-transition:0.5s linear all;
 *   transition:0.5s linear all;
 * }
 *
 * .slide.ng-enter { }        /&#42; starting animations for enter &#42;/
 * .slide.ng-enter-active { } /&#42; terminal animations for enter &#42;/
 * .slide.ng-leave { }        /&#42; starting animations for leave &#42;/
 * .slide.ng-leave-active { } /&#42; terminal animations for leave &#42;/
 * </style>
 *
 * <!--
 * the animate service will automatically add .ng-enter and .ng-leave to the element
 * to trigger the CSS transition/animations
 * -->
 * <ANY class="slide" ng-include="..."></ANY>
 * </pre>
 *
 * Keep in mind that if an animation is running, any child elements cannot be animated until the parent element's
 * animation has completed.
 *
 * <h2>CSS-defined Animations</h2>
 * The animate service will automatically apply two CSS classes to the animated element and these two CSS classes
 * are designed to contain the start and end CSS styling. Both CSS transitions and keyframe animations are supported
 * and can be used to play along with this naming structure.
 *
 * The following code below demonstrates how to perform animations using **CSS transitions** with Angular:
 *
 * <pre>
 * <style type="text/css">
 * /&#42;
 *  The animate class is apart of the element and the ng-enter class
 *  is attached to the element once the enter animation event is triggered
 * &#42;/
 * .reveal-animation.ng-enter {
 *  -webkit-transition: 1s linear all; /&#42; Safari/Chrome &#42;/
 *  transition: 1s linear all; /&#42; All other modern browsers and IE10+ &#42;/
 *
 *  /&#42; The animation preparation code &#42;/
 *  opacity: 0;
 * }
 *
 * /&#42;
 *  Keep in mind that you want to combine both CSS
 *  classes together to avoid any CSS-specificity
 *  conflicts
 * &#42;/
 * .reveal-animation.ng-enter.ng-enter-active {
 *  /&#42; The animation code itself &#42;/
 *  opacity: 1;
 * }
 * </style>
 *
 * <div class="view-container">
 *   <div ng-view class="reveal-animation"></div>
 * </div>
 * </pre>
 *
 * The following code below demonstrates how to perform animations using **CSS animations** with Angular:
 *
 * <pre>
 * <style type="text/css">
 * .reveal-animation.ng-enter {
 *   -webkit-animation: enter_sequence 1s linear; /&#42; Safari/Chrome &#42;/
 *   animation: enter_sequence 1s linear; /&#42; IE10+ and Future Browsers &#42;/
 * }
 * &#64-webkit-keyframes enter_sequence {
 *   from { opacity:0; }
 *   to { opacity:1; }
 * }
 * &#64keyframes enter_sequence {
 *   from { opacity:0; }
 *   to { opacity:1; }
 * }
 * </style>
 *
 * <div class="view-container">
 *   <div ng-view class="reveal-animation"></div>
 * </div>
 * </pre>
 *
 * Both CSS3 animations and transitions can be used together and the animate service will figure out the correct duration and delay timing.
 *
 * Upon DOM mutation, the event class is added first (something like `ng-enter`), then the browser prepares itself to add
 * the active class (in this case `ng-enter-active`) which then triggers the animation. The animation module will automatically
 * detect the CSS code to determine when the animation ends. Once the animation is over then both CSS classes will be
 * removed from the DOM. If a browser does not support CSS transitions or CSS animations then the animation will start and end
 * immediately resulting in a DOM element that is at its final state. This final state is when the DOM element
 * has no CSS transition/animation classes applied to it.
 *
 * <h3>CSS Staggering Animations</h3>
 * A Staggering animation is a collection of animations that are issued with a slight delay in between each successive operation resulting in a
 * curtain-like effect. The ngAnimate module, as of 1.2.0, supports staggering animations and the stagger effect can be
 * performed by creating a **ng-EVENT-stagger** CSS class and attaching that class to the base CSS class used for
 * the animation. The style property expected within the stagger class can either be a **transition-delay** or an
 * **animation-delay** property (or both if your animation contains both transitions and keyframe animations).
 *
 * <pre>
 * .my-animation.ng-enter {
 *   /&#42; standard transition code &#42;/
 *   -webkit-transition: 1s linear all;
 *   transition: 1s linear all;
 *   opacity:0;
 * }
 * .my-animation.ng-enter-stagger {
 *   /&#42; this will have a 100ms delay between each successive leave animation &#42;/
 *   -webkit-transition-delay: 0.1s;
 *   transition-delay: 0.1s;
 *
 *   /&#42; in case the stagger doesn't work then these two values
 *    must be set to 0 to avoid an accidental CSS inheritance &#42;/
 *   -webkit-transition-duration: 0s;
 *   transition-duration: 0s;
 * }
 * .my-animation.ng-enter.ng-enter-active {
 *   /&#42; standard transition styles &#42;/
 *   opacity:1;
 * }
 * </pre>
 *
 * Staggering animations work by default in ngRepeat (so long as the CSS class is defined). Outside of ngRepeat, to use staggering animations
 * on your own, they can be triggered by firing multiple calls to the same event on $animate. However, the restrictions surrounding this
 * are that each of the elements must have the same CSS className value as well as the same parent element. A stagger operation
 * will also be reset if more than 10ms has passed after the last animation has been fired.
 *
 * The following code will issue the **ng-leave-stagger** event on the element provided:
 *
 * <pre>
 * var kids = parent.children();
 *
 * $animate.leave(kids[0]); //stagger index=0
 * $animate.leave(kids[1]); //stagger index=1
 * $animate.leave(kids[2]); //stagger index=2
 * $animate.leave(kids[3]); //stagger index=3
 * $animate.leave(kids[4]); //stagger index=4
 *
 * $timeout(function() {
 *   //stagger has reset itself
 *   $animate.leave(kids[5]); //stagger index=0
 *   $animate.leave(kids[6]); //stagger index=1
 * }, 100, false);
 * </pre>
 *
 * Stagger animations are currently only supported within CSS-defined animations.
 *
 * <h2>JavaScript-defined Animations</h2>
 * In the event that you do not want to use CSS3 transitions or CSS3 animations or if you wish to offer animations on browsers that do not
 * yet support CSS transitions/animations, then you can make use of JavaScript animations defined inside of your AngularJS module.
 *
 * <pre>
 * //!annotate="YourApp" Your AngularJS Module|Replace this or ngModule with the module that you used to define your application.
 * var ngModule = angular.module('YourApp', ['ngAnimate']);
 * ngModule.animation('.my-crazy-animation', function() {
 *   return {
 *     enter: function(element, done) {
 *       //run the animation here and call done when the animation is complete
 *       return function(cancelled) {
 *         //this (optional) function will be called when the animation
 *         //completes or when the animation is cancelled (the cancelled
 *         //flag will be set to true if cancelled).
 *       };
 *     },
 *     leave: function(element, done) { },
 *     move: function(element, done) { },
 *
 *     //animation that can be triggered before the class is added
 *     beforeAddClass: function(element, className, done) { },
 *
 *     //animation that can be triggered after the class is added
 *     addClass: function(element, className, done) { },
 *
 *     //animation that can be triggered before the class is removed
 *     beforeRemoveClass: function(element, className, done) { },
 *
 *     //animation that can be triggered after the class is removed
 *     removeClass: function(element, className, done) { }
 *   };
 * });
 * </pre>
 *
 * JavaScript-defined animations are created with a CSS-like class selector and a collection of events which are set to run
 * a javascript callback function. When an animation is triggered, $animate will look for a matching animation which fits
 * the element's CSS class attribute value and then run the matching animation event function (if found).
 * In other words, if the CSS classes present on the animated element match any of the JavaScript animations then the callback function will
 * be executed. It should be also noted that only simple, single class selectors are allowed (compound class selectors are not supported).
 *
 * Within a JavaScript animation, an object containing various event callback animation functions is expected to be returned.
 * As explained above, these callbacks are triggered based on the animation event. Therefore if an enter animation is run,
 * and the JavaScript animation is found, then the enter callback will handle that animation (in addition to the CSS keyframe animation
 * or transition code that is defined via a stylesheet).
 *
 */

angular.module('ngAnimate', ['ng'])

  /**
   * @ngdoc object
   * @name ngAnimate.$animateProvider
   * @description
   *
   * The `$animateProvider` allows developers to register JavaScript animation event handlers directly inside of a module.
   * When an animation is triggered, the $animate service will query the $animate service to find any animations that match
   * the provided name value.
   *
   * Requires the {@link ngAnimate `ngAnimate`} module to be installed.
   *
   * Please visit the {@link ngAnimate `ngAnimate`} module overview page learn more about how to use animations in your application.
   *
   */
  .factory('$$animateReflow', ['$window', '$timeout', function($window, $timeout) {
    var requestAnimationFrame = $window.requestAnimationFrame       ||
                                $window.webkitRequestAnimationFrame ||
                                function(fn) {
                                  return $timeout(fn, 10, false);
                                };

    var cancelAnimationFrame = $window.cancelAnimationFrame       ||
                               $window.webkitCancelAnimationFrame ||
                               function(timer) {
                                 return $timeout.cancel(timer);
                               };
    return function(fn) {
      var id = requestAnimationFrame(fn);
      return function() {
        cancelAnimationFrame(id);
      };
    };
  }])

  .config(['$provide', '$animateProvider', function($provide, $animateProvider) {
    var noop = angular.noop;
    var forEach = angular.forEach;
    var selectors = $animateProvider.$$selectors;

    var ELEMENT_NODE = 1;
    var NG_ANIMATE_STATE = '$$ngAnimateState';
    var NG_ANIMATE_CLASS_NAME = 'ng-animate';
    var rootAnimateState = {running: true};

    function extractElementNode(element) {
      for(var i = 0; i < element.length; i++) {
        var elm = element[i];
        if(elm.nodeType == ELEMENT_NODE) {
          return elm;
        }
      }
    }

    function isMatchingElement(elm1, elm2) {
      return extractElementNode(elm1) == extractElementNode(elm2);
    }

    $provide.decorator('$animate', ['$delegate', '$injector', '$sniffer', '$rootElement', '$timeout', '$rootScope', '$document',
                            function($delegate,   $injector,   $sniffer,   $rootElement,   $timeout,   $rootScope,   $document) {

      $rootElement.data(NG_ANIMATE_STATE, rootAnimateState);

      // disable animations during bootstrap, but once we bootstrapped, wait again
      // for another digest until enabling animations. The reason why we digest twice
      // is because all structural animations (enter, leave and move) all perform a
      // post digest operation before animating. If we only wait for a single digest
      // to pass then the structural animation would render its animation on page load.
      // (which is what we're trying to avoid when the application first boots up.)
      $rootScope.$$postDigest(function() {
        $rootScope.$$postDigest(function() {
          rootAnimateState.running = false;
        });
      });

      var classNameFilter = $animateProvider.classNameFilter();
      var isAnimatableClassName = !classNameFilter
              ? function() { return true; }
              : function(className) {
                return classNameFilter.test(className);
              };

      function async(fn) {
        return $timeout(fn, 0, false);
      }

      function lookup(name) {
        if (name) {
          var matches = [],
              flagMap = {},
              classes = name.substr(1).split('.');

          //the empty string value is the default animation
          //operation which performs CSS transition and keyframe
          //animations sniffing. This is always included for each
          //element animation procedure if the browser supports
          //transitions and/or keyframe animations
          if ($sniffer.transitions || $sniffer.animations) {
            classes.push('');
          }

          for(var i=0; i < classes.length; i++) {
            var klass = classes[i],
                selectorFactoryName = selectors[klass];
            if(selectorFactoryName && !flagMap[klass]) {
              matches.push($injector.get(selectorFactoryName));
              flagMap[klass] = true;
            }
          }
          return matches;
        }
      }

      /**
       * @ngdoc object
       * @name ngAnimate.$animate
       * @function
       *
       * @description
       * The `$animate` service provides animation detection support while performing DOM operations (enter, leave and move) as well as during addClass and removeClass operations.
       * When any of these operations are run, the $animate service
       * will examine any JavaScript-defined animations (which are defined by using the $animateProvider provider object)
       * as well as any CSS-defined animations against the CSS classes present on the element once the DOM operation is run.
       *
       * The `$animate` service is used behind the scenes with pre-existing directives and animation with these directives
       * will work out of the box without any extra configuration.
       *
       * Requires the {@link ngAnimate `ngAnimate`} module to be installed.
       *
       * Please visit the {@link ngAnimate `ngAnimate`} module overview page learn more about how to use animations in your application.
       *
       */
      return {
        /**
         * @ngdoc function
         * @name ngAnimate.$animate#enter
         * @methodOf ngAnimate.$animate
         * @function
         *
         * @description
         * Appends the element to the parentElement element that resides in the document and then runs the enter animation. Once
         * the animation is started, the following CSS classes will be present on the element for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during enter animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.enter(...) is called                                                             | class="my-animation"                        |
         * | 2. element is inserted into the parentElement element or beside the afterElement element     | class="my-animation"                        |
         * | 3. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 4. the .ng-enter class is added to the element                                               | class="my-animation ng-animate ng-enter"    |
         * | 5. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-enter"    |
         * | 6. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-enter"    |
         * | 7. the .ng-enter-active and .ng-animate-active classes are added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-enter ng-enter-active" |
         * | 8. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-enter ng-enter-active" |
         * | 9. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 10. The doneCallback() callback is fired (if provided)                                       | class="my-animation"                        |
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the enter animation
         * @param {jQuery/jqLite element} parentElement the parent element of the element that will be the focus of the enter animation
         * @param {jQuery/jqLite element} afterElement the sibling element (which is the previous element) of the element that will be the focus of the enter animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        enter : function(element, parentElement, afterElement, doneCallback) {
          this.enabled(false, element);
          $delegate.enter(element, parentElement, afterElement);
          $rootScope.$$postDigest(function() {
            performAnimation('enter', 'ng-enter', element, parentElement, afterElement, noop, doneCallback);
          });
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#leave
         * @methodOf ngAnimate.$animate
         * @function
         *
         * @description
         * Runs the leave animation operation and, upon completion, removes the element from the DOM. Once
         * the animation is started, the following CSS classes will be added for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during leave animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.leave(...) is called                                                             | class="my-animation"                        |
         * | 2. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 3. the .ng-leave class is added to the element                                               | class="my-animation ng-animate ng-leave"    |
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-leave"    |
         * | 5. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-leave"    |
         * | 6. the .ng-leave-active and .ng-animate-active classes is added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-leave ng-leave-active" |
         * | 7. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-leave ng-leave-active" |
         * | 8. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 9. The element is removed from the DOM                                                       | ...                                         |
         * | 10. The doneCallback() callback is fired (if provided)                                       | ...                                         |
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the leave animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        leave : function(element, doneCallback) {
          cancelChildAnimations(element);
          this.enabled(false, element);
          $rootScope.$$postDigest(function() {
            performAnimation('leave', 'ng-leave', element, null, null, function() {
              $delegate.leave(element);
            }, doneCallback);
          });
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#move
         * @methodOf ngAnimate.$animate
         * @function
         *
         * @description
         * Fires the move DOM operation. Just before the animation starts, the animate service will either append it into the parentElement container or
         * add the element directly after the afterElement element if present. Then the move animation will be run. Once
         * the animation is started, the following CSS classes will be added for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during move animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.move(...) is called                                                              | class="my-animation"                        |
         * | 2. element is moved into the parentElement element or beside the afterElement element        | class="my-animation"                        |
         * | 3. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 4. the .ng-move class is added to the element                                                | class="my-animation ng-animate ng-move"     |
         * | 5. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-move"     |
         * | 6. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-move"     |
         * | 7. the .ng-move-active and .ng-animate-active classes is added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-move ng-move-active" |
         * | 8. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-move ng-move-active" |
         * | 9. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 10. The doneCallback() callback is fired (if provided)                                       | class="my-animation"                        |
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the move animation
         * @param {jQuery/jqLite element} parentElement the parentElement element of the element that will be the focus of the move animation
         * @param {jQuery/jqLite element} afterElement the sibling element (which is the previous element) of the element that will be the focus of the move animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        move : function(element, parentElement, afterElement, doneCallback) {
          cancelChildAnimations(element);
          this.enabled(false, element);
          $delegate.move(element, parentElement, afterElement);
          $rootScope.$$postDigest(function() {
            performAnimation('move', 'ng-move', element, parentElement, afterElement, noop, doneCallback);
          });
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#addClass
         * @methodOf ngAnimate.$animate
         *
         * @description
         * Triggers a custom animation event based off the className variable and then attaches the className value to the element as a CSS class.
         * Unlike the other animation methods, the animate service will suffix the className value with {@type -add} in order to provide
         * the animate service the setup and active CSS classes in order to trigger the animation (this will be skipped if no CSS transitions
         * or keyframes are defined on the -add or base CSS class).
         *
         * Below is a breakdown of each step that occurs during addClass animation:
         *
         * | Animation Step                                                                                 | What the element class attribute looks like |
         * |------------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.addClass(element, 'super') is called                                               | class="my-animation"                        |
         * | 2. $animate runs any JavaScript-defined animations on the element                              | class="my-animation ng-animate"             |
         * | 3. the .super-add class are added to the element                                               | class="my-animation ng-animate super-add"   |
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay    | class="my-animation ng-animate super-add"   |
         * | 5. $animate waits for 10ms (this performs a reflow)                                            | class="my-animation ng-animate super-add"   |
         * | 6. the .super, .super-add-active and .ng-animate-active classes are added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active super super-add super-add-active"          |
         * | 7. $animate waits for X milliseconds for the animation to complete                             | class="my-animation super-add super-add-active"  |
         * | 8. The animation ends and all generated CSS classes are removed from the element               | class="my-animation super"                  |
         * | 9. The super class is kept on the element                                                      | class="my-animation super"                  |
         * | 10. The doneCallback() callback is fired (if provided)                                         | class="my-animation super"                  |
         *
         * @param {jQuery/jqLite element} element the element that will be animated
         * @param {string} className the CSS class that will be added to the element and then animated
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        addClass : function(element, className, doneCallback) {
          performAnimation('addClass', className, element, null, null, function() {
            $delegate.addClass(element, className);
          }, doneCallback);
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#removeClass
         * @methodOf ngAnimate.$animate
         *
         * @description
         * Triggers a custom animation event based off the className variable and then removes the CSS class provided by the className value
         * from the element. Unlike the other animation methods, the animate service will suffix the className value with {@type -remove} in
         * order to provide the animate service the setup and active CSS classes in order to trigger the animation (this will be skipped if
         * no CSS transitions or keyframes are defined on the -remove or base CSS classes).
         *
         * Below is a breakdown of each step that occurs during removeClass animation:
         *
         * | Animation Step                                                                                | What the element class attribute looks like     |
         * |-----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.removeClass(element, 'super') is called                                           | class="my-animation super"                  |
         * | 2. $animate runs any JavaScript-defined animations on the element                             | class="my-animation super ng-animate"       |
         * | 3. the .super-remove class are added to the element                                           | class="my-animation super ng-animate super-remove"|
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay   | class="my-animation super ng-animate super-remove"   |
         * | 5. $animate waits for 10ms (this performs a reflow)                                           | class="my-animation super ng-animate super-remove"   |
         * | 6. the .super-remove-active and .ng-animate-active classes are added and .super is removed (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active super-remove super-remove-active"          |
         * | 7. $animate waits for X milliseconds for the animation to complete                            | class="my-animation ng-animate ng-animate-active super-remove super-remove-active"   |
         * | 8. The animation ends and all generated CSS classes are removed from the element              | class="my-animation"                        |
         * | 9. The doneCallback() callback is fired (if provided)                                         | class="my-animation"                        |
         *
         *
         * @param {jQuery/jqLite element} element the element that will be animated
         * @param {string} className the CSS class that will be animated and then removed from the element
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        removeClass : function(element, className, doneCallback) {
          performAnimation('removeClass', className, element, null, null, function() {
            $delegate.removeClass(element, className);
          }, doneCallback);
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#enabled
         * @methodOf ngAnimate.$animate
         * @function
         *
         * @param {boolean=} value If provided then set the animation on or off.
         * @param {jQuery/jqLite element=} element If provided then the element will be used to represent the enable/disable operation
         * @return {boolean} Current animation state.
         *
         * @description
         * Globally enables/disables animations.
         *
        */
        enabled : function(value, element) {
          switch(arguments.length) {
            case 2:
              if(value) {
                cleanup(element);
              } else {
                var data = element.data(NG_ANIMATE_STATE) || {};
                data.disabled = true;
                element.data(NG_ANIMATE_STATE, data);
              }
            break;

            case 1:
              rootAnimateState.disabled = !value;
            break;

            default:
              value = !rootAnimateState.disabled;
            break;
          }
          return !!value;
         }
      };

      /*
        all animations call this shared animation triggering function internally.
        The animationEvent variable refers to the JavaScript animation event that will be triggered
        and the className value is the name of the animation that will be applied within the
        CSS code. Element, parentElement and afterElement are provided DOM elements for the animation
        and the onComplete callback will be fired once the animation is fully complete.
      */
      function performAnimation(animationEvent, className, element, parentElement, afterElement, domOperation, doneCallback) {
        var currentClassName, classes, node = extractElementNode(element);
        if(node) {
          currentClassName = node.className;
          classes = currentClassName + ' ' + className;
        }

        //transcluded directives may sometimes fire an animation using only comment nodes
        //best to catch this early on to prevent any animation operations from occurring
        if(!node || !isAnimatableClassName(classes)) {
          fireDOMOperation();
          fireBeforeCallbackAsync();
          fireAfterCallbackAsync();
          closeAnimation();
          return;
        }

        var animationLookup = (' ' + classes).replace(/\s+/g,'.');
        if (!parentElement) {
          parentElement = afterElement ? afterElement.parent() : element.parent();
        }

        var matches = lookup(animationLookup);
        var isClassBased = animationEvent == 'addClass' || animationEvent == 'removeClass';
        var ngAnimateState = element.data(NG_ANIMATE_STATE) || {};

        //skip the animation if animations are disabled, a parent is already being animated,
        //the element is not currently attached to the document body or then completely close
        //the animation if any matching animations are not found at all.
        //NOTE: IE8 + IE9 should close properly (run closeAnimation()) in case a NO animation is not found.
        if (animationsDisabled(element, parentElement) || matches.length === 0) {
          fireDOMOperation();
          fireBeforeCallbackAsync();
          fireAfterCallbackAsync();
          closeAnimation();
          return;
        }

        var animations = [];

        //only add animations if the currently running animation is not structural
        //or if there is no animation running at all
        var allowAnimations = isClassBased ?
          !ngAnimateState.disabled && (!ngAnimateState.running || !ngAnimateState.structural) :
          true;

        if(allowAnimations) {
          forEach(matches, function(animation) {
            //add the animation to the queue to if it is allowed to be cancelled
            if(!animation.allowCancel || animation.allowCancel(element, animationEvent, className)) {
              var beforeFn, afterFn = animation[animationEvent];

              //Special case for a leave animation since there is no point in performing an
              //animation on a element node that has already been removed from the DOM
              if(animationEvent == 'leave') {
                beforeFn = afterFn;
                afterFn = null; //this must be falsy so that the animation is skipped for leave
              } else {
                beforeFn = animation['before' + animationEvent.charAt(0).toUpperCase() + animationEvent.substr(1)];
              }
              animations.push({
                before : beforeFn,
                after : afterFn
              });
            }
          });
        }

        //this would mean that an animation was not allowed so let the existing
        //animation do it's thing and close this one early
        if(animations.length === 0) {
          fireDOMOperation();
          fireBeforeCallbackAsync();
          fireAfterCallbackAsync();
          fireDoneCallbackAsync();
          return;
        }

        var ONE_SPACE = ' ';
        //this value will be searched for class-based CSS className lookup. Therefore,
        //we prefix and suffix the current className value with spaces to avoid substring
        //lookups of className tokens
        var futureClassName = ONE_SPACE + currentClassName + ONE_SPACE;
        if(ngAnimateState.running) {
          //if an animation is currently running on the element then lets take the steps
          //to cancel that animation and fire any required callbacks
          $timeout.cancel(ngAnimateState.closeAnimationTimeout);
          cleanup(element);
          cancelAnimations(ngAnimateState.animations);

          //in the event that the CSS is class is quickly added and removed back
          //then we don't want to wait until after the reflow to add/remove the CSS
          //class since both class animations may run into a race condition.
          //The code below will check to see if that is occurring and will
          //immediately remove the former class before the reflow so that the
          //animation can snap back to the original animation smoothly
          var isFullyClassBasedAnimation = isClassBased && !ngAnimateState.structural;
          var isRevertingClassAnimation = isFullyClassBasedAnimation &&
                                          ngAnimateState.className == className &&
                                          animationEvent != ngAnimateState.event;

          //if the class is removed during the reflow then it will revert the styles temporarily
          //back to the base class CSS styling causing a jump-like effect to occur. This check
          //here ensures that the domOperation is only performed after the reflow has commenced
          if(ngAnimateState.beforeComplete || isRevertingClassAnimation) {
            (ngAnimateState.done || noop)(true);
          } else if(isFullyClassBasedAnimation) {
            //class-based animations will compare element className values after cancelling the
            //previous animation to see if the element properties already contain the final CSS
            //class and if so then the animation will be skipped. Since the domOperation will
            //be performed only after the reflow is complete then our element's className value
            //will be invalid. Therefore the same string manipulation that would occur within the
            //DOM operation will be performed below so that the class comparison is valid...
            futureClassName = ngAnimateState.event == 'removeClass' ?
              futureClassName.replace(ONE_SPACE + ngAnimateState.className + ONE_SPACE, ONE_SPACE) :
              futureClassName + ngAnimateState.className + ONE_SPACE;
          }
        }

        //There is no point in perform a class-based animation if the element already contains
        //(on addClass) or doesn't contain (on removeClass) the className being animated.
        //The reason why this is being called after the previous animations are cancelled
        //is so that the CSS classes present on the element can be properly examined.
        var classNameToken = ONE_SPACE + className + ONE_SPACE;
        if((animationEvent == 'addClass'    && futureClassName.indexOf(classNameToken) >= 0) ||
           (animationEvent == 'removeClass' && futureClassName.indexOf(classNameToken) == -1)) {
          fireDOMOperation();
          fireBeforeCallbackAsync();
          fireAfterCallbackAsync();
          fireDoneCallbackAsync();
          return;
        }

        //the ng-animate class does nothing, but it's here to allow for
        //parent animations to find and cancel child animations when needed
        element.addClass(NG_ANIMATE_CLASS_NAME);

        element.data(NG_ANIMATE_STATE, {
          running:true,
          event:animationEvent,
          className:className,
          structural:!isClassBased,
          animations:animations,
          done:onBeforeAnimationsComplete
        });

        //first we run the before animations and when all of those are complete
        //then we perform the DOM operation and run the next set of animations
        invokeRegisteredAnimationFns(animations, 'before', onBeforeAnimationsComplete);

        function onBeforeAnimationsComplete(cancelled) {
          fireDOMOperation();
          if(cancelled === true) {
            closeAnimation();
            return;
          }

          //set the done function to the final done function
          //so that the DOM event won't be executed twice by accident
          //if the after animation is cancelled as well
          var data = element.data(NG_ANIMATE_STATE);
          if(data) {
            data.done = closeAnimation;
            element.data(NG_ANIMATE_STATE, data);
          }
          invokeRegisteredAnimationFns(animations, 'after', closeAnimation);
        }

        function invokeRegisteredAnimationFns(animations, phase, allAnimationFnsComplete) {
          phase == 'after' ?
            fireAfterCallbackAsync() :
            fireBeforeCallbackAsync();

          var endFnName = phase + 'End';
          forEach(animations, function(animation, index) {
            var animationPhaseCompleted = function() {
              progress(index, phase);
            };

            //there are no before functions for enter + move since the DOM
            //operations happen before the performAnimation method fires
            if(phase == 'before' && (animationEvent == 'enter' || animationEvent == 'move')) {
              animationPhaseCompleted();
              return;
            }

            if(animation[phase]) {
              animation[endFnName] = isClassBased ?
                animation[phase](element, className, animationPhaseCompleted) :
                animation[phase](element, animationPhaseCompleted);
            } else {
              animationPhaseCompleted();
            }
          });

          function progress(index, phase) {
            var phaseCompletionFlag = phase + 'Complete';
            var currentAnimation = animations[index];
            currentAnimation[phaseCompletionFlag] = true;
            (currentAnimation[endFnName] || noop)();

            for(var i=0;i<animations.length;i++) {
              if(!animations[i][phaseCompletionFlag]) return;
            }

            allAnimationFnsComplete();
          }
        }

        function fireDOMCallback(animationPhase) {
          element.triggerHandler('$animate:' + animationPhase, {
            event : animationEvent,
            className : className
          });
        }

        function fireBeforeCallbackAsync() {
          async(function() {
            fireDOMCallback('before');
          });
        }

        function fireAfterCallbackAsync() {
          async(function() {
            fireDOMCallback('after');
          });
        }

        function fireDoneCallbackAsync() {
          async(function() {
            fireDOMCallback('close');
            doneCallback && doneCallback();
          });
        }

        //it is less complicated to use a flag than managing and cancelling
        //timeouts containing multiple callbacks.
        function fireDOMOperation() {
          if(!fireDOMOperation.hasBeenRun) {
            fireDOMOperation.hasBeenRun = true;
            domOperation();
          }
        }

        function closeAnimation() {
          if(!closeAnimation.hasBeenRun) {
            closeAnimation.hasBeenRun = true;
            var data = element.data(NG_ANIMATE_STATE);
            if(data) {
              /* only structural animations wait for reflow before removing an
                 animation, but class-based animations don't. An example of this
                 failing would be when a parent HTML tag has a ng-class attribute
                 causing ALL directives below to skip animations during the digest */
              if(isClassBased) {
                cleanup(element);
              } else {
                data.closeAnimationTimeout = async(function() {
                  cleanup(element);
                });
                element.data(NG_ANIMATE_STATE, data);
              }
            }
            fireDoneCallbackAsync();
          }
        }
      }

      function cancelChildAnimations(element) {
        var node = extractElementNode(element);
        forEach(node.querySelectorAll('.' + NG_ANIMATE_CLASS_NAME), function(element) {
          element = angular.element(element);
          var data = element.data(NG_ANIMATE_STATE);
          if(data) {
            cancelAnimations(data.animations);
            cleanup(element);
          }
        });
      }

      function cancelAnimations(animations) {
        var isCancelledFlag = true;
        forEach(animations, function(animation) {
          if(!animation.beforeComplete) {
            (animation.beforeEnd || noop)(isCancelledFlag);
          }
          if(!animation.afterComplete) {
            (animation.afterEnd || noop)(isCancelledFlag);
          }
        });
      }

      function cleanup(element) {
        if(isMatchingElement(element, $rootElement)) {
          if(!rootAnimateState.disabled) {
            rootAnimateState.running = false;
            rootAnimateState.structural = false;
          }
        } else {
          element.removeClass(NG_ANIMATE_CLASS_NAME);
          element.removeData(NG_ANIMATE_STATE);
        }
      }

      function animationsDisabled(element, parentElement) {
        if (rootAnimateState.disabled) return true;

        if(isMatchingElement(element, $rootElement)) {
          return rootAnimateState.disabled || rootAnimateState.running;
        }

        do {
          //the element did not reach the root element which means that it
          //is not apart of the DOM. Therefore there is no reason to do
          //any animations on it
          if(parentElement.length === 0) break;

          var isRoot = isMatchingElement(parentElement, $rootElement);
          var state = isRoot ? rootAnimateState : parentElement.data(NG_ANIMATE_STATE);
          var result = state && (!!state.disabled || !!state.running);
          if(isRoot || result) {
            return result;
          }

          if(isRoot) return true;
        }
        while(parentElement = parentElement.parent());

        return true;
      }
    }]);

    $animateProvider.register('', ['$window', '$sniffer', '$timeout', '$$animateReflow',
                           function($window,   $sniffer,   $timeout,   $$animateReflow) {
      // Detect proper transitionend/animationend event names.
      var CSS_PREFIX = '', TRANSITION_PROP, TRANSITIONEND_EVENT, ANIMATION_PROP, ANIMATIONEND_EVENT;

      // If unprefixed events are not supported but webkit-prefixed are, use the latter.
      // Otherwise, just use W3C names, browsers not supporting them at all will just ignore them.
      // Note: Chrome implements `window.onwebkitanimationend` and doesn't implement `window.onanimationend`
      // but at the same time dispatches the `animationend` event and not `webkitAnimationEnd`.
      // Register both events in case `window.onanimationend` is not supported because of that,
      // do the same for `transitionend` as Safari is likely to exhibit similar behavior.
      // Also, the only modern browser that uses vendor prefixes for transitions/keyframes is webkit
      // therefore there is no reason to test anymore for other vendor prefixes: http://caniuse.com/#search=transition
      if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
        CSS_PREFIX = '-webkit-';
        TRANSITION_PROP = 'WebkitTransition';
        TRANSITIONEND_EVENT = 'webkitTransitionEnd transitionend';
      } else {
        TRANSITION_PROP = 'transition';
        TRANSITIONEND_EVENT = 'transitionend';
      }

      if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
        CSS_PREFIX = '-webkit-';
        ANIMATION_PROP = 'WebkitAnimation';
        ANIMATIONEND_EVENT = 'webkitAnimationEnd animationend';
      } else {
        ANIMATION_PROP = 'animation';
        ANIMATIONEND_EVENT = 'animationend';
      }

      var DURATION_KEY = 'Duration';
      var PROPERTY_KEY = 'Property';
      var DELAY_KEY = 'Delay';
      var ANIMATION_ITERATION_COUNT_KEY = 'IterationCount';
      var NG_ANIMATE_PARENT_KEY = '$$ngAnimateKey';
      var NG_ANIMATE_CSS_DATA_KEY = '$$ngAnimateCSS3Data';
      var ELAPSED_TIME_MAX_DECIMAL_PLACES = 3;
      var CLOSING_TIME_BUFFER = 1.5;
      var ONE_SECOND = 1000;

      var animationCounter = 0;
      var lookupCache = {};
      var parentCounter = 0;
      var animationReflowQueue = [];
      var animationElementQueue = [];
      var cancelAnimationReflow;
      var closingAnimationTime = 0;
      var timeOut = false;
      function afterReflow(element, callback) {
        if(cancelAnimationReflow) {
          cancelAnimationReflow();
        }

        animationReflowQueue.push(callback);

        var node = extractElementNode(element);
        element = angular.element(node);
        animationElementQueue.push(element);

        var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);

        var stagger = elementData.stagger;
        var staggerTime = elementData.itemIndex * (Math.max(stagger.animationDelay, stagger.transitionDelay) || 0);

        var animationTime = (elementData.maxDelay + elementData.maxDuration) * CLOSING_TIME_BUFFER;
        closingAnimationTime = Math.max(closingAnimationTime, (staggerTime + animationTime) * ONE_SECOND);

        //by placing a counter we can avoid an accidental
        //race condition which may close an animation when
        //a follow-up animation is midway in its animation
        elementData.animationCount = animationCounter;

        cancelAnimationReflow = $$animateReflow(function() {
          forEach(animationReflowQueue, function(fn) {
            fn();
          });

          //copy the list of elements so that successive
          //animations won't conflict if they're added before
          //the closing animation timeout has run
          var elementQueueSnapshot = [];
          var animationCounterSnapshot = animationCounter;
          forEach(animationElementQueue, function(elm) {
            elementQueueSnapshot.push(elm);
          });

          $timeout(function() {
            closeAllAnimations(elementQueueSnapshot, animationCounterSnapshot);
            elementQueueSnapshot = null;
          }, closingAnimationTime, false);

          animationReflowQueue = [];
          animationElementQueue = [];
          cancelAnimationReflow = null;
          lookupCache = {};
          closingAnimationTime = 0;
          animationCounter++;
        });
      }

      function closeAllAnimations(elements, count) {
        forEach(elements, function(element) {
          var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
          if(elementData && elementData.animationCount == count) {
            (elementData.closeAnimationFn || noop)();
          }
        });
      }

      function getElementAnimationDetails(element, cacheKey) {
        var data = cacheKey ? lookupCache[cacheKey] : null;
        if(!data) {
          var transitionDuration = 0;
          var transitionDelay = 0;
          var animationDuration = 0;
          var animationDelay = 0;
          var transitionDelayStyle;
          var animationDelayStyle;
          var transitionDurationStyle;
          var transitionPropertyStyle;

          //we want all the styles defined before and after
          forEach(element, function(element) {
            if (element.nodeType == ELEMENT_NODE) {
              var elementStyles = $window.getComputedStyle(element) || {};

              transitionDurationStyle = elementStyles[TRANSITION_PROP + DURATION_KEY];

              transitionDuration = Math.max(parseMaxTime(transitionDurationStyle), transitionDuration);

              transitionPropertyStyle = elementStyles[TRANSITION_PROP + PROPERTY_KEY];

              transitionDelayStyle = elementStyles[TRANSITION_PROP + DELAY_KEY];

              transitionDelay  = Math.max(parseMaxTime(transitionDelayStyle), transitionDelay);

              animationDelayStyle = elementStyles[ANIMATION_PROP + DELAY_KEY];

              animationDelay   = Math.max(parseMaxTime(animationDelayStyle), animationDelay);

              var aDuration  = parseMaxTime(elementStyles[ANIMATION_PROP + DURATION_KEY]);

              if(aDuration > 0) {
                aDuration *= parseInt(elementStyles[ANIMATION_PROP + ANIMATION_ITERATION_COUNT_KEY], 10) || 1;
              }

              animationDuration = Math.max(aDuration, animationDuration);
            }
          });
          data = {
            total : 0,
            transitionPropertyStyle: transitionPropertyStyle,
            transitionDurationStyle: transitionDurationStyle,
            transitionDelayStyle: transitionDelayStyle,
            transitionDelay: transitionDelay,
            transitionDuration: transitionDuration,
            animationDelayStyle: animationDelayStyle,
            animationDelay: animationDelay,
            animationDuration: animationDuration
          };
          if(cacheKey) {
            lookupCache[cacheKey] = data;
          }
        }
        return data;
      }

      function parseMaxTime(str) {
        var maxValue = 0;
        var values = angular.isString(str) ?
          str.split(/\s*,\s*/) :
          [];
        forEach(values, function(value) {
          maxValue = Math.max(parseFloat(value) || 0, maxValue);
        });
        return maxValue;
      }

      function getCacheKey(element) {
        var parentElement = element.parent();
        var parentID = parentElement.data(NG_ANIMATE_PARENT_KEY);
        if(!parentID) {
          parentElement.data(NG_ANIMATE_PARENT_KEY, ++parentCounter);
          parentID = parentCounter;
        }
        return parentID + '-' + extractElementNode(element).className;
      }

      function animateSetup(element, className, calculationDecorator) {
        var cacheKey = getCacheKey(element);
        var eventCacheKey = cacheKey + ' ' + className;
        var stagger = {};
        var itemIndex = lookupCache[eventCacheKey] ? ++lookupCache[eventCacheKey].total : 0;

        if(itemIndex > 0) {
          var staggerClassName = className + '-stagger';
          var staggerCacheKey = cacheKey + ' ' + staggerClassName;
          var applyClasses = !lookupCache[staggerCacheKey];

          applyClasses && element.addClass(staggerClassName);

          stagger = getElementAnimationDetails(element, staggerCacheKey);

          applyClasses && element.removeClass(staggerClassName);
        }

        /* the animation itself may need to add/remove special CSS classes
         * before calculating the anmation styles */
        calculationDecorator = calculationDecorator ||
                               function(fn) { return fn(); };

        element.addClass(className);

        var timings = calculationDecorator(function() {
          return getElementAnimationDetails(element, eventCacheKey);
        });

        /* there is no point in performing a reflow if the animation
           timeout is empty (this would cause a flicker bug normally
           in the page. There is also no point in performing an animation
           that only has a delay and no duration */
        var maxDelay = Math.max(timings.transitionDelay, timings.animationDelay);
        var maxDuration = Math.max(timings.transitionDuration, timings.animationDuration);
        if(maxDuration === 0) {
          element.removeClass(className);
          return false;
        }

        //temporarily disable the transition so that the enter styles
        //don't animate twice (this is here to avoid a bug in Chrome/FF).
        var activeClassName = '';
        timings.transitionDuration > 0 ?
          blockTransitions(element) :
          blockKeyframeAnimations(element);

        forEach(className.split(' '), function(klass, i) {
          activeClassName += (i > 0 ? ' ' : '') + klass + '-active';
        });

        element.data(NG_ANIMATE_CSS_DATA_KEY, {
          className : className,
          activeClassName : activeClassName,
          maxDuration : maxDuration,
          maxDelay : maxDelay,
          classes : className + ' ' + activeClassName,
          timings : timings,
          stagger : stagger,
          itemIndex : itemIndex
        });

        return true;
      }

      function blockTransitions(element) {
        extractElementNode(element).style[TRANSITION_PROP + PROPERTY_KEY] = 'none';
      }

      function blockKeyframeAnimations(element) {
        extractElementNode(element).style[ANIMATION_PROP] = 'none 0s';
      }

      function unblockTransitions(element) {
        var prop = TRANSITION_PROP + PROPERTY_KEY;
        var node = extractElementNode(element);
        if(node.style[prop] && node.style[prop].length > 0) {
          node.style[prop] = '';
        }
      }

      function unblockKeyframeAnimations(element) {
        var prop = ANIMATION_PROP;
        var node = extractElementNode(element);
        if(node.style[prop] && node.style[prop].length > 0) {
          node.style[prop] = '';
        }
      }

      function animateRun(element, className, activeAnimationComplete) {
        var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
        var node = extractElementNode(element);
        if(node.className.indexOf(className) == -1 || !elementData) {
          activeAnimationComplete();
          return;
        }

        var timings = elementData.timings;
        var stagger = elementData.stagger;
        var maxDuration = elementData.maxDuration;
        var activeClassName = elementData.activeClassName;
        var maxDelayTime = Math.max(timings.transitionDelay, timings.animationDelay) * ONE_SECOND;
        var startTime = Date.now();
        var css3AnimationEvents = ANIMATIONEND_EVENT + ' ' + TRANSITIONEND_EVENT;
        var itemIndex = elementData.itemIndex;

        var style = '', appliedStyles = [];
        if(timings.transitionDuration > 0) {
          var propertyStyle = timings.transitionPropertyStyle;
          if(propertyStyle.indexOf('all') == -1) {
            style += CSS_PREFIX + 'transition-property: ' + propertyStyle + ';';
            style += CSS_PREFIX + 'transition-duration: ' + timings.transitionDurationStyle + ';';
            appliedStyles.push(CSS_PREFIX + 'transition-property');
            appliedStyles.push(CSS_PREFIX + 'transition-duration');
          }
        }

        if(itemIndex > 0) {
          if(stagger.transitionDelay > 0 && stagger.transitionDuration === 0) {
            var delayStyle = timings.transitionDelayStyle;
            style += CSS_PREFIX + 'transition-delay: ' +
                     prepareStaggerDelay(delayStyle, stagger.transitionDelay, itemIndex) + '; ';
            appliedStyles.push(CSS_PREFIX + 'transition-delay');
          }

          if(stagger.animationDelay > 0 && stagger.animationDuration === 0) {
            style += CSS_PREFIX + 'animation-delay: ' +
                     prepareStaggerDelay(timings.animationDelayStyle, stagger.animationDelay, itemIndex) + '; ';
            appliedStyles.push(CSS_PREFIX + 'animation-delay');
          }
        }

        if(appliedStyles.length > 0) {
          //the element being animated may sometimes contain comment nodes in
          //the jqLite object, so we're safe to use a single variable to house
          //the styles since there is always only one element being animated
          var oldStyle = node.getAttribute('style') || '';
          node.setAttribute('style', oldStyle + ' ' + style);
        }

        element.on(css3AnimationEvents, onAnimationProgress);
        element.addClass(activeClassName);
        elementData.closeAnimationFn = function() {
          onEnd();
          activeAnimationComplete();
        };
        return onEnd;

        // This will automatically be called by $animate so
        // there is no need to attach this internally to the
        // timeout done method.
        function onEnd(cancelled) {
          element.off(css3AnimationEvents, onAnimationProgress);
          element.removeClass(activeClassName);
          animateClose(element, className);
          var node = extractElementNode(element);
          for (var i in appliedStyles) {
            node.style.removeProperty(appliedStyles[i]);
          }
        }

        function onAnimationProgress(event) {
          event.stopPropagation();
          var ev = event.originalEvent || event;
          var timeStamp = ev.$manualTimeStamp || ev.timeStamp || Date.now();
          
          /* Firefox (or possibly just Gecko) likes to not round values up
           * when a ms measurement is used for the animation */
          var elapsedTime = parseFloat(ev.elapsedTime.toFixed(ELAPSED_TIME_MAX_DECIMAL_PLACES));

          /* $manualTimeStamp is a mocked timeStamp value which is set
           * within browserTrigger(). This is only here so that tests can
           * mock animations properly. Real events fallback to event.timeStamp,
           * or, if they don't, then a timeStamp is automatically created for them.
           * We're checking to see if the timeStamp surpasses the expected delay,
           * but we're using elapsedTime instead of the timeStamp on the 2nd
           * pre-condition since animations sometimes close off early */
          if(Math.max(timeStamp - startTime, 0) >= maxDelayTime && elapsedTime >= maxDuration) {
            activeAnimationComplete();
          }
        }
      }

      function prepareStaggerDelay(delayStyle, staggerDelay, index) {
        var style = '';
        forEach(delayStyle.split(','), function(val, i) {
          style += (i > 0 ? ',' : '') +
                   (index * staggerDelay + parseInt(val, 10)) + 's';
        });
        return style;
      }

      function animateBefore(element, className, calculationDecorator) {
        if(animateSetup(element, className, calculationDecorator)) {
          return function(cancelled) {
            cancelled && animateClose(element, className);
          };
        }
      }

      function animateAfter(element, className, afterAnimationComplete) {
        if(element.data(NG_ANIMATE_CSS_DATA_KEY)) {
          return animateRun(element, className, afterAnimationComplete);
        } else {
          animateClose(element, className);
          afterAnimationComplete();
        }
      }

      function animate(element, className, animationComplete) {
        //If the animateSetup function doesn't bother returning a
        //cancellation function then it means that there is no animation
        //to perform at all
        var preReflowCancellation = animateBefore(element, className);
        if(!preReflowCancellation) {
          animationComplete();
          return;
        }

        //There are two cancellation functions: one is before the first
        //reflow animation and the second is during the active state
        //animation. The first function will take care of removing the
        //data from the element which will not make the 2nd animation
        //happen in the first place
        var cancel = preReflowCancellation;
        afterReflow(element, function() {
          unblockTransitions(element);
          unblockKeyframeAnimations(element);
          //once the reflow is complete then we point cancel to
          //the new cancellation function which will remove all of the
          //animation properties from the active animation
          cancel = animateAfter(element, className, animationComplete);
        });

        return function(cancelled) {
          (cancel || noop)(cancelled);
        };
      }

      function animateClose(element, className) {
        element.removeClass(className);
        element.removeData(NG_ANIMATE_CSS_DATA_KEY);
      }

      return {
        allowCancel : function(element, animationEvent, className) {
          //always cancel the current animation if it is a
          //structural animation
          var oldClasses = (element.data(NG_ANIMATE_CSS_DATA_KEY) || {}).classes;
          if(!oldClasses || ['enter','leave','move'].indexOf(animationEvent) >= 0) {
            return true;
          }

          var parentElement = element.parent();
          var clone = angular.element(extractElementNode(element).cloneNode());

          //make the element super hidden and override any CSS style values
          clone.attr('style','position:absolute; top:-9999px; left:-9999px');
          clone.removeAttr('id');
          clone.empty();

          forEach(oldClasses.split(' '), function(klass) {
            clone.removeClass(klass);
          });

          var suffix = animationEvent == 'addClass' ? '-add' : '-remove';
          clone.addClass(suffixClasses(className, suffix));
          parentElement.append(clone);

          var timings = getElementAnimationDetails(clone);
          clone.remove();

          return Math.max(timings.transitionDuration, timings.animationDuration) > 0;
        },

        enter : function(element, animationCompleted) {
          return animate(element, 'ng-enter', animationCompleted);
        },

        leave : function(element, animationCompleted) {
          return animate(element, 'ng-leave', animationCompleted);
        },

        move : function(element, animationCompleted) {
          return animate(element, 'ng-move', animationCompleted);
        },

        beforeAddClass : function(element, className, animationCompleted) {
          var cancellationMethod = animateBefore(element, suffixClasses(className, '-add'), function(fn) {

            /* when a CSS class is added to an element then the transition style that
             * is applied is the transition defined on the element when the CSS class
             * is added at the time of the animation. This is how CSS3 functions
             * outside of ngAnimate. */
            element.addClass(className);
            var timings = fn();
            element.removeClass(className);
            return timings;
          });

          if(cancellationMethod) {
            afterReflow(element, function() {
              unblockTransitions(element);
              unblockKeyframeAnimations(element);
              animationCompleted();
            });
            return cancellationMethod;
          }
          animationCompleted();
        },

        addClass : function(element, className, animationCompleted) {
          return animateAfter(element, suffixClasses(className, '-add'), animationCompleted);
        },

        beforeRemoveClass : function(element, className, animationCompleted) {
          var cancellationMethod = animateBefore(element, suffixClasses(className, '-remove'), function(fn) {
            /* when classes are removed from an element then the transition style
             * that is applied is the transition defined on the element without the
             * CSS class being there. This is how CSS3 functions outside of ngAnimate.
             * http://plnkr.co/edit/j8OzgTNxHTb4n3zLyjGW?p=preview */
            var klass = element.attr('class');
            element.removeClass(className);
            var timings = fn();
            element.attr('class', klass);
            return timings;
          });

          if(cancellationMethod) {
            afterReflow(element, function() {
              unblockTransitions(element);
              unblockKeyframeAnimations(element);
              animationCompleted();
            });
            return cancellationMethod;
          }
          animationCompleted();
        },

        removeClass : function(element, className, animationCompleted) {
          return animateAfter(element, suffixClasses(className, '-remove'), animationCompleted);
        }
      };

      function suffixClasses(classes, suffix) {
        var className = '';
        classes = angular.isArray(classes) ? classes : classes.split(/\s+/);
        forEach(classes, function(klass, i) {
          if(klass && klass.length > 0) {
            className += (i > 0 ? ' ' : '') + klass + suffix;
          }
        });
        return className;
      }
    }]);
  }]);


})(window, window.angular);

},{}],2:[function(require,module,exports){
/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.10.0 - 2014-01-13
 * License: MIT
 */
angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.transition","ui.bootstrap.collapse","ui.bootstrap.accordion","ui.bootstrap.alert","ui.bootstrap.bindHtml","ui.bootstrap.buttons","ui.bootstrap.carousel","ui.bootstrap.position","ui.bootstrap.datepicker","ui.bootstrap.dropdownToggle","ui.bootstrap.modal","ui.bootstrap.pagination","ui.bootstrap.tooltip","ui.bootstrap.popover","ui.bootstrap.progressbar","ui.bootstrap.rating","ui.bootstrap.tabs","ui.bootstrap.timepicker","ui.bootstrap.typeahead"]);
angular.module("ui.bootstrap.tpls", ["template/accordion/accordion-group.html","template/accordion/accordion.html","template/alert/alert.html","template/carousel/carousel.html","template/carousel/slide.html","template/datepicker/datepicker.html","template/datepicker/popup.html","template/modal/backdrop.html","template/modal/window.html","template/pagination/pager.html","template/pagination/pagination.html","template/tooltip/tooltip-html-unsafe-popup.html","template/tooltip/tooltip-popup.html","template/popover/popover.html","template/progressbar/bar.html","template/progressbar/progress.html","template/progressbar/progressbar.html","template/rating/rating.html","template/tabs/tab.html","template/tabs/tabset.html","template/timepicker/timepicker.html","template/typeahead/typeahead-match.html","template/typeahead/typeahead-popup.html"]);
angular.module('ui.bootstrap.transition', [])

/**
 * $transition service provides a consistent interface to trigger CSS 3 transitions and to be informed when they complete.
 * @param  {DOMElement} element  The DOMElement that will be animated.
 * @param  {string|object|function} trigger  The thing that will cause the transition to start:
 *   - As a string, it represents the css class to be added to the element.
 *   - As an object, it represents a hash of style attributes to be applied to the element.
 *   - As a function, it represents a function to be called that will cause the transition to occur.
 * @return {Promise}  A promise that is resolved when the transition finishes.
 */
.factory('$transition', ['$q', '$timeout', '$rootScope', function($q, $timeout, $rootScope) {

  var $transition = function(element, trigger, options) {
    options = options || {};
    var deferred = $q.defer();
    var endEventName = $transition[options.animation ? "animationEndEventName" : "transitionEndEventName"];

    var transitionEndHandler = function(event) {
      $rootScope.$apply(function() {
        element.unbind(endEventName, transitionEndHandler);
        deferred.resolve(element);
      });
    };

    if (endEventName) {
      element.bind(endEventName, transitionEndHandler);
    }

    // Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
    $timeout(function() {
      if ( angular.isString(trigger) ) {
        element.addClass(trigger);
      } else if ( angular.isFunction(trigger) ) {
        trigger(element);
      } else if ( angular.isObject(trigger) ) {
        element.css(trigger);
      }
      //If browser does not support transitions, instantly resolve
      if ( !endEventName ) {
        deferred.resolve(element);
      }
    });

    // Add our custom cancel function to the promise that is returned
    // We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
    // i.e. it will therefore never raise a transitionEnd event for that transition
    deferred.promise.cancel = function() {
      if ( endEventName ) {
        element.unbind(endEventName, transitionEndHandler);
      }
      deferred.reject('Transition cancelled');
    };

    return deferred.promise;
  };

  // Work out the name of the transitionEnd event
  var transElement = document.createElement('trans');
  var transitionEndEventNames = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'transition': 'transitionend'
  };
  var animationEndEventNames = {
    'WebkitTransition': 'webkitAnimationEnd',
    'MozTransition': 'animationend',
    'OTransition': 'oAnimationEnd',
    'transition': 'animationend'
  };
  function findEndEventName(endEventNames) {
    for (var name in endEventNames){
      if (transElement.style[name] !== undefined) {
        return endEventNames[name];
      }
    }
  }
  $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
  $transition.animationEndEventName = findEndEventName(animationEndEventNames);
  return $transition;
}]);

angular.module('ui.bootstrap.collapse', ['ui.bootstrap.transition'])

  .directive('collapse', ['$transition', function ($transition, $timeout) {

    return {
      link: function (scope, element, attrs) {

        var initialAnimSkip = true;
        var currentTransition;

        function doTransition(change) {
          var newTransition = $transition(element, change);
          if (currentTransition) {
            currentTransition.cancel();
          }
          currentTransition = newTransition;
          newTransition.then(newTransitionDone, newTransitionDone);
          return newTransition;

          function newTransitionDone() {
            // Make sure it's this transition, otherwise, leave it alone.
            if (currentTransition === newTransition) {
              currentTransition = undefined;
            }
          }
        }

        function expand() {
          if (initialAnimSkip) {
            initialAnimSkip = false;
            expandDone();
          } else {
            element.removeClass('collapse').addClass('collapsing');
            doTransition({ height: element[0].scrollHeight + 'px' }).then(expandDone);
          }
        }

        function expandDone() {
          element.removeClass('collapsing');
          element.addClass('collapse in');
          element.css({height: 'auto'});
        }

        function collapse() {
          if (initialAnimSkip) {
            initialAnimSkip = false;
            collapseDone();
            element.css({height: 0});
          } else {
            // CSS transitions don't work with height: auto, so we have to manually change the height to a specific value
            element.css({ height: element[0].scrollHeight + 'px' });
            //trigger reflow so a browser realizes that height was updated from auto to a specific value
            var x = element[0].offsetWidth;

            element.removeClass('collapse in').addClass('collapsing');

            doTransition({ height: 0 }).then(collapseDone);
          }
        }

        function collapseDone() {
          element.removeClass('collapsing');
          element.addClass('collapse');
        }

        scope.$watch(attrs.collapse, function (shouldCollapse) {
          if (shouldCollapse) {
            collapse();
          } else {
            expand();
          }
        });
      }
    };
  }]);

angular.module('ui.bootstrap.accordion', ['ui.bootstrap.collapse'])

.constant('accordionConfig', {
  closeOthers: true
})

.controller('AccordionController', ['$scope', '$attrs', 'accordionConfig', function ($scope, $attrs, accordionConfig) {

  // This array keeps track of the accordion groups
  this.groups = [];

  // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
  this.closeOthers = function(openGroup) {
    var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
    if ( closeOthers ) {
      angular.forEach(this.groups, function (group) {
        if ( group !== openGroup ) {
          group.isOpen = false;
        }
      });
    }
  };
  
  // This is called from the accordion-group directive to add itself to the accordion
  this.addGroup = function(groupScope) {
    var that = this;
    this.groups.push(groupScope);

    groupScope.$on('$destroy', function (event) {
      that.removeGroup(groupScope);
    });
  };

  // This is called from the accordion-group directive when to remove itself
  this.removeGroup = function(group) {
    var index = this.groups.indexOf(group);
    if ( index !== -1 ) {
      this.groups.splice(this.groups.indexOf(group), 1);
    }
  };

}])

// The accordion directive simply sets up the directive controller
// and adds an accordion CSS class to itself element.
.directive('accordion', function () {
  return {
    restrict:'EA',
    controller:'AccordionController',
    transclude: true,
    replace: false,
    templateUrl: 'template/accordion/accordion.html'
  };
})

// The accordion-group directive indicates a block of html that will expand and collapse in an accordion
.directive('accordionGroup', ['$parse', function($parse) {
  return {
    require:'^accordion',         // We need this directive to be inside an accordion
    restrict:'EA',
    transclude:true,              // It transcludes the contents of the directive into the template
    replace: true,                // The element containing the directive will be replaced with the template
    templateUrl:'template/accordion/accordion-group.html',
    scope:{ heading:'@' },        // Create an isolated scope and interpolate the heading attribute onto this scope
    controller: function() {
      this.setHeading = function(element) {
        this.heading = element;
      };
    },
    link: function(scope, element, attrs, accordionCtrl) {
      var getIsOpen, setIsOpen;

      accordionCtrl.addGroup(scope);

      scope.isOpen = false;
      
      if ( attrs.isOpen ) {
        getIsOpen = $parse(attrs.isOpen);
        setIsOpen = getIsOpen.assign;

        scope.$parent.$watch(getIsOpen, function(value) {
          scope.isOpen = !!value;
        });
      }

      scope.$watch('isOpen', function(value) {
        if ( value ) {
          accordionCtrl.closeOthers(scope);
        }
        if ( setIsOpen ) {
          setIsOpen(scope.$parent, value);
        }
      });
    }
  };
}])

// Use accordion-heading below an accordion-group to provide a heading containing HTML
// <accordion-group>
//   <accordion-heading>Heading containing HTML - <img src="..."></accordion-heading>
// </accordion-group>
.directive('accordionHeading', function() {
  return {
    restrict: 'EA',
    transclude: true,   // Grab the contents to be used as the heading
    template: '',       // In effect remove this element!
    replace: true,
    require: '^accordionGroup',
    compile: function(element, attr, transclude) {
      return function link(scope, element, attr, accordionGroupCtrl) {
        // Pass the heading to the accordion-group controller
        // so that it can be transcluded into the right place in the template
        // [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
        accordionGroupCtrl.setHeading(transclude(scope, function() {}));
      };
    }
  };
})

// Use in the accordion-group template to indicate where you want the heading to be transcluded
// You must provide the property on the accordion-group controller that will hold the transcluded element
// <div class="accordion-group">
//   <div class="accordion-heading" ><a ... accordion-transclude="heading">...</a></div>
//   ...
// </div>
.directive('accordionTransclude', function() {
  return {
    require: '^accordionGroup',
    link: function(scope, element, attr, controller) {
      scope.$watch(function() { return controller[attr.accordionTransclude]; }, function(heading) {
        if ( heading ) {
          element.html('');
          element.append(heading);
        }
      });
    }
  };
});

angular.module("ui.bootstrap.alert", [])

.controller('AlertController', ['$scope', '$attrs', function ($scope, $attrs) {
  $scope.closeable = 'close' in $attrs;
}])

.directive('alert', function () {
  return {
    restrict:'EA',
    controller:'AlertController',
    templateUrl:'template/alert/alert.html',
    transclude:true,
    replace:true,
    scope: {
      type: '=',
      close: '&'
    }
  };
});

angular.module('ui.bootstrap.bindHtml', [])

  .directive('bindHtmlUnsafe', function () {
    return function (scope, element, attr) {
      element.addClass('ng-binding').data('$binding', attr.bindHtmlUnsafe);
      scope.$watch(attr.bindHtmlUnsafe, function bindHtmlUnsafeWatchAction(value) {
        element.html(value || '');
      });
    };
  });
angular.module('ui.bootstrap.buttons', [])

.constant('buttonConfig', {
  activeClass: 'active',
  toggleEvent: 'click'
})

.controller('ButtonsController', ['buttonConfig', function(buttonConfig) {
  this.activeClass = buttonConfig.activeClass || 'active';
  this.toggleEvent = buttonConfig.toggleEvent || 'click';
}])

.directive('btnRadio', function () {
  return {
    require: ['btnRadio', 'ngModel'],
    controller: 'ButtonsController',
    link: function (scope, element, attrs, ctrls) {
      var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      //model -> UI
      ngModelCtrl.$render = function () {
        element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.btnRadio)));
      };

      //ui->model
      element.bind(buttonsCtrl.toggleEvent, function () {
        if (!element.hasClass(buttonsCtrl.activeClass)) {
          scope.$apply(function () {
            ngModelCtrl.$setViewValue(scope.$eval(attrs.btnRadio));
            ngModelCtrl.$render();
          });
        }
      });
    }
  };
})

.directive('btnCheckbox', function () {
  return {
    require: ['btnCheckbox', 'ngModel'],
    controller: 'ButtonsController',
    link: function (scope, element, attrs, ctrls) {
      var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      function getTrueValue() {
        return getCheckboxValue(attrs.btnCheckboxTrue, true);
      }

      function getFalseValue() {
        return getCheckboxValue(attrs.btnCheckboxFalse, false);
      }
      
      function getCheckboxValue(attributeValue, defaultValue) {
        var val = scope.$eval(attributeValue);
        return angular.isDefined(val) ? val : defaultValue;
      }

      //model -> UI
      ngModelCtrl.$render = function () {
        element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, getTrueValue()));
      };

      //ui->model
      element.bind(buttonsCtrl.toggleEvent, function () {
        scope.$apply(function () {
          ngModelCtrl.$setViewValue(element.hasClass(buttonsCtrl.activeClass) ? getFalseValue() : getTrueValue());
          ngModelCtrl.$render();
        });
      });
    }
  };
});

/**
* @ngdoc overview
* @name ui.bootstrap.carousel
*
* @description
* AngularJS version of an image carousel.
*
*/
angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition'])
.controller('CarouselController', ['$scope', '$timeout', '$transition', '$q', function ($scope, $timeout, $transition, $q) {
  var self = this,
    slides = self.slides = [],
    currentIndex = -1,
    currentTimeout, isPlaying;
  self.currentSlide = null;

  var destroyed = false;
  /* direction: "prev" or "next" */
  self.select = function(nextSlide, direction) {
    var nextIndex = slides.indexOf(nextSlide);
    //Decide direction if it's not given
    if (direction === undefined) {
      direction = nextIndex > currentIndex ? "next" : "prev";
    }
    if (nextSlide && nextSlide !== self.currentSlide) {
      if ($scope.$currentTransition) {
        $scope.$currentTransition.cancel();
        //Timeout so ng-class in template has time to fix classes for finished slide
        $timeout(goNext);
      } else {
        goNext();
      }
    }
    function goNext() {
      // Scope has been destroyed, stop here.
      if (destroyed) { return; }
      //If we have a slide to transition from and we have a transition type and we're allowed, go
      if (self.currentSlide && angular.isString(direction) && !$scope.noTransition && nextSlide.$element) {
        //We shouldn't do class manip in here, but it's the same weird thing bootstrap does. need to fix sometime
        nextSlide.$element.addClass(direction);
        var reflow = nextSlide.$element[0].offsetWidth; //force reflow

        //Set all other slides to stop doing their stuff for the new transition
        angular.forEach(slides, function(slide) {
          angular.extend(slide, {direction: '', entering: false, leaving: false, active: false});
        });
        angular.extend(nextSlide, {direction: direction, active: true, entering: true});
        angular.extend(self.currentSlide||{}, {direction: direction, leaving: true});

        $scope.$currentTransition = $transition(nextSlide.$element, {});
        //We have to create new pointers inside a closure since next & current will change
        (function(next,current) {
          $scope.$currentTransition.then(
            function(){ transitionDone(next, current); },
            function(){ transitionDone(next, current); }
          );
        }(nextSlide, self.currentSlide));
      } else {
        transitionDone(nextSlide, self.currentSlide);
      }
      self.currentSlide = nextSlide;
      currentIndex = nextIndex;
      //every time you change slides, reset the timer
      restartTimer();
    }
    function transitionDone(next, current) {
      angular.extend(next, {direction: '', active: true, leaving: false, entering: false});
      angular.extend(current||{}, {direction: '', active: false, leaving: false, entering: false});
      $scope.$currentTransition = null;
    }
  };
  $scope.$on('$destroy', function () {
    destroyed = true;
  });

  /* Allow outside people to call indexOf on slides array */
  self.indexOfSlide = function(slide) {
    return slides.indexOf(slide);
  };

  $scope.next = function() {
    var newIndex = (currentIndex + 1) % slides.length;

    //Prevent this user-triggered transition from occurring if there is already one in progress
    if (!$scope.$currentTransition) {
      return self.select(slides[newIndex], 'next');
    }
  };

  $scope.prev = function() {
    var newIndex = currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1;

    //Prevent this user-triggered transition from occurring if there is already one in progress
    if (!$scope.$currentTransition) {
      return self.select(slides[newIndex], 'prev');
    }
  };

  $scope.select = function(slide) {
    self.select(slide);
  };

  $scope.isActive = function(slide) {
     return self.currentSlide === slide;
  };

  $scope.slides = function() {
    return slides;
  };

  $scope.$watch('interval', restartTimer);
  $scope.$on('$destroy', resetTimer);

  function restartTimer() {
    resetTimer();
    var interval = +$scope.interval;
    if (!isNaN(interval) && interval>=0) {
      currentTimeout = $timeout(timerFn, interval);
    }
  }

  function resetTimer() {
    if (currentTimeout) {
      $timeout.cancel(currentTimeout);
      currentTimeout = null;
    }
  }

  function timerFn() {
    if (isPlaying) {
      $scope.next();
      restartTimer();
    } else {
      $scope.pause();
    }
  }

  $scope.play = function() {
    if (!isPlaying) {
      isPlaying = true;
      restartTimer();
    }
  };
  $scope.pause = function() {
    if (!$scope.noPause) {
      isPlaying = false;
      resetTimer();
    }
  };

  self.addSlide = function(slide, element) {
    slide.$element = element;
    slides.push(slide);
    //if this is the first slide or the slide is set to active, select it
    if(slides.length === 1 || slide.active) {
      self.select(slides[slides.length-1]);
      if (slides.length == 1) {
        $scope.play();
      }
    } else {
      slide.active = false;
    }
  };

  self.removeSlide = function(slide) {
    //get the index of the slide inside the carousel
    var index = slides.indexOf(slide);
    slides.splice(index, 1);
    if (slides.length > 0 && slide.active) {
      if (index >= slides.length) {
        self.select(slides[index-1]);
      } else {
        self.select(slides[index]);
      }
    } else if (currentIndex > index) {
      currentIndex--;
    }
  };

}])

/**
 * @ngdoc directive
 * @name ui.bootstrap.carousel.directive:carousel
 * @restrict EA
 *
 * @description
 * Carousel is the outer container for a set of image 'slides' to showcase.
 *
 * @param {number=} interval The time, in milliseconds, that it will take the carousel to go to the next slide.
 * @param {boolean=} noTransition Whether to disable transitions on the carousel.
 * @param {boolean=} noPause Whether to disable pausing on the carousel (by default, the carousel interval pauses on hover).
 *
 * @example
<example module="ui.bootstrap">
  <file name="index.html">
    <carousel>
      <slide>
        <img src="http://placekitten.com/150/150" style="margin:auto;">
        <div class="carousel-caption">
          <p>Beautiful!</p>
        </div>
      </slide>
      <slide>
        <img src="http://placekitten.com/100/150" style="margin:auto;">
        <div class="carousel-caption">
          <p>D'aww!</p>
        </div>
      </slide>
    </carousel>
  </file>
  <file name="demo.css">
    .carousel-indicators {
      top: auto;
      bottom: 15px;
    }
  </file>
</example>
 */
.directive('carousel', [function() {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    controller: 'CarouselController',
    require: 'carousel',
    templateUrl: 'template/carousel/carousel.html',
    scope: {
      interval: '=',
      noTransition: '=',
      noPause: '='
    }
  };
}])

/**
 * @ngdoc directive
 * @name ui.bootstrap.carousel.directive:slide
 * @restrict EA
 *
 * @description
 * Creates a slide inside a {@link ui.bootstrap.carousel.directive:carousel carousel}.  Must be placed as a child of a carousel element.
 *
 * @param {boolean=} active Model binding, whether or not this slide is currently active.
 *
 * @example
<example module="ui.bootstrap">
  <file name="index.html">
<div ng-controller="CarouselDemoCtrl">
  <carousel>
    <slide ng-repeat="slide in slides" active="slide.active">
      <img ng-src="{{slide.image}}" style="margin:auto;">
      <div class="carousel-caption">
        <h4>Slide {{$index}}</h4>
        <p>{{slide.text}}</p>
      </div>
    </slide>
  </carousel>
  <div class="row-fluid">
    <div class="span6">
      <ul>
        <li ng-repeat="slide in slides">
          <button class="btn btn-mini" ng-class="{'btn-info': !slide.active, 'btn-success': slide.active}" ng-disabled="slide.active" ng-click="slide.active = true">select</button>
          {{$index}}: {{slide.text}}
        </li>
      </ul>
      <a class="btn" ng-click="addSlide()">Add Slide</a>
    </div>
    <div class="span6">
      Interval, in milliseconds: <input type="number" ng-model="myInterval">
      <br />Enter a negative number to stop the interval.
    </div>
  </div>
</div>
  </file>
  <file name="script.js">
function CarouselDemoCtrl($scope) {
  $scope.myInterval = 5000;
  var slides = $scope.slides = [];
  $scope.addSlide = function() {
    var newWidth = 200 + ((slides.length + (25 * slides.length)) % 150);
    slides.push({
      image: 'http://placekitten.com/' + newWidth + '/200',
      text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' '
        ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
    });
  };
  for (var i=0; i<4; i++) $scope.addSlide();
}
  </file>
  <file name="demo.css">
    .carousel-indicators {
      top: auto;
      bottom: 15px;
    }
  </file>
</example>
*/

.directive('slide', ['$parse', function($parse) {
  return {
    require: '^carousel',
    restrict: 'EA',
    transclude: true,
    replace: true,
    templateUrl: 'template/carousel/slide.html',
    scope: {
    },
    link: function (scope, element, attrs, carouselCtrl) {
      //Set up optional 'active' = binding
      if (attrs.active) {
        var getActive = $parse(attrs.active);
        var setActive = getActive.assign;
        var lastValue = scope.active = getActive(scope.$parent);
        scope.$watch(function parentActiveWatch() {
          var parentActive = getActive(scope.$parent);

          if (parentActive !== scope.active) {
            // we are out of sync and need to copy
            if (parentActive !== lastValue) {
              // parent changed and it has precedence
              lastValue = scope.active = parentActive;
            } else {
              // if the parent can be assigned then do so
              setActive(scope.$parent, parentActive = lastValue = scope.active);
            }
          }
          return parentActive;
        });
      }

      carouselCtrl.addSlide(scope, element);
      //when the scope is destroyed then remove the slide from the current slides array
      scope.$on('$destroy', function() {
        carouselCtrl.removeSlide(scope);
      });

      scope.$watch('active', function(active) {
        if (active) {
          carouselCtrl.select(scope);
        }
      });
    }
  };
}]);

angular.module('ui.bootstrap.position', [])

/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
  .factory('$position', ['$document', '$window', function ($document, $window) {

    function getStyle(el, cssprop) {
      if (el.currentStyle) { //IE
        return el.currentStyle[cssprop];
      } else if ($window.getComputedStyle) {
        return $window.getComputedStyle(el)[cssprop];
      }
      // finally try and get inline style
      return el.style[cssprop];
    }

    /**
     * Checks if a given element is statically positioned
     * @param element - raw DOM element
     */
    function isStaticPositioned(element) {
      return (getStyle(element, "position") || 'static' ) === 'static';
    }

    /**
     * returns the closest, non-statically positioned parentOffset of a given element
     * @param element
     */
    var parentOffsetEl = function (element) {
      var docDomEl = $document[0];
      var offsetParent = element.offsetParent || docDomEl;
      while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || docDomEl;
    };

    return {
      /**
       * Provides read-only equivalent of jQuery's position function:
       * http://api.jquery.com/position/
       */
      position: function (element) {
        var elBCR = this.offset(element);
        var offsetParentBCR = { top: 0, left: 0 };
        var offsetParentEl = parentOffsetEl(element[0]);
        if (offsetParentEl != $document[0]) {
          offsetParentBCR = this.offset(angular.element(offsetParentEl));
          offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
          offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
        }

        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: elBCR.top - offsetParentBCR.top,
          left: elBCR.left - offsetParentBCR.left
        };
      },

      /**
       * Provides read-only equivalent of jQuery's offset function:
       * http://api.jquery.com/offset/
       */
      offset: function (element) {
        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: boundingClientRect.top + ($window.pageYOffset || $document[0].body.scrollTop || $document[0].documentElement.scrollTop),
          left: boundingClientRect.left + ($window.pageXOffset || $document[0].body.scrollLeft  || $document[0].documentElement.scrollLeft)
        };
      }
    };
  }]);

angular.module('ui.bootstrap.datepicker', ['ui.bootstrap.position'])

.constant('datepickerConfig', {
  dayFormat: 'dd',
  monthFormat: 'MMMM',
  yearFormat: 'yyyy',
  dayHeaderFormat: 'EEE',
  dayTitleFormat: 'MMMM yyyy',
  monthTitleFormat: 'yyyy',
  showWeeks: true,
  startingDay: 0,
  yearRange: 20,
  minDate: null,
  maxDate: null
})

.controller('DatepickerController', ['$scope', '$attrs', 'dateFilter', 'datepickerConfig', function($scope, $attrs, dateFilter, dtConfig) {
  var format = {
    day:        getValue($attrs.dayFormat,        dtConfig.dayFormat),
    month:      getValue($attrs.monthFormat,      dtConfig.monthFormat),
    year:       getValue($attrs.yearFormat,       dtConfig.yearFormat),
    dayHeader:  getValue($attrs.dayHeaderFormat,  dtConfig.dayHeaderFormat),
    dayTitle:   getValue($attrs.dayTitleFormat,   dtConfig.dayTitleFormat),
    monthTitle: getValue($attrs.monthTitleFormat, dtConfig.monthTitleFormat)
  },
  startingDay = getValue($attrs.startingDay,      dtConfig.startingDay),
  yearRange =   getValue($attrs.yearRange,        dtConfig.yearRange);

  this.minDate = dtConfig.minDate ? new Date(dtConfig.minDate) : null;
  this.maxDate = dtConfig.maxDate ? new Date(dtConfig.maxDate) : null;

  function getValue(value, defaultValue) {
    return angular.isDefined(value) ? $scope.$parent.$eval(value) : defaultValue;
  }

  function getDaysInMonth( year, month ) {
    return new Date(year, month, 0).getDate();
  }

  function getDates(startDate, n) {
    var dates = new Array(n);
    var current = startDate, i = 0;
    while (i < n) {
      dates[i++] = new Date(current);
      current.setDate( current.getDate() + 1 );
    }
    return dates;
  }

  function makeDate(date, format, isSelected, isSecondary) {
    return { date: date, label: dateFilter(date, format), selected: !!isSelected, secondary: !!isSecondary };
  }

  this.modes = [
    {
      name: 'day',
      getVisibleDates: function(date, selected) {
        var year = date.getFullYear(), month = date.getMonth(), firstDayOfMonth = new Date(year, month, 1);
        var difference = startingDay - firstDayOfMonth.getDay(),
        numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : - difference,
        firstDate = new Date(firstDayOfMonth), numDates = 0;

        if ( numDisplayedFromPreviousMonth > 0 ) {
          firstDate.setDate( - numDisplayedFromPreviousMonth + 1 );
          numDates += numDisplayedFromPreviousMonth; // Previous
        }
        numDates += getDaysInMonth(year, month + 1); // Current
        numDates += (7 - numDates % 7) % 7; // Next

        var days = getDates(firstDate, numDates), labels = new Array(7);
        for (var i = 0; i < numDates; i ++) {
          var dt = new Date(days[i]);
          days[i] = makeDate(dt, format.day, (selected && selected.getDate() === dt.getDate() && selected.getMonth() === dt.getMonth() && selected.getFullYear() === dt.getFullYear()), dt.getMonth() !== month);
        }
        for (var j = 0; j < 7; j++) {
          labels[j] = dateFilter(days[j].date, format.dayHeader);
        }
        return { objects: days, title: dateFilter(date, format.dayTitle), labels: labels };
      },
      compare: function(date1, date2) {
        return (new Date( date1.getFullYear(), date1.getMonth(), date1.getDate() ) - new Date( date2.getFullYear(), date2.getMonth(), date2.getDate() ) );
      },
      split: 7,
      step: { months: 1 }
    },
    {
      name: 'month',
      getVisibleDates: function(date, selected) {
        var months = new Array(12), year = date.getFullYear();
        for ( var i = 0; i < 12; i++ ) {
          var dt = new Date(year, i, 1);
          months[i] = makeDate(dt, format.month, (selected && selected.getMonth() === i && selected.getFullYear() === year));
        }
        return { objects: months, title: dateFilter(date, format.monthTitle) };
      },
      compare: function(date1, date2) {
        return new Date( date1.getFullYear(), date1.getMonth() ) - new Date( date2.getFullYear(), date2.getMonth() );
      },
      split: 3,
      step: { years: 1 }
    },
    {
      name: 'year',
      getVisibleDates: function(date, selected) {
        var years = new Array(yearRange), year = date.getFullYear(), startYear = parseInt((year - 1) / yearRange, 10) * yearRange + 1;
        for ( var i = 0; i < yearRange; i++ ) {
          var dt = new Date(startYear + i, 0, 1);
          years[i] = makeDate(dt, format.year, (selected && selected.getFullYear() === dt.getFullYear()));
        }
        return { objects: years, title: [years[0].label, years[yearRange - 1].label].join(' - ') };
      },
      compare: function(date1, date2) {
        return date1.getFullYear() - date2.getFullYear();
      },
      split: 5,
      step: { years: yearRange }
    }
  ];

  this.isDisabled = function(date, mode) {
    var currentMode = this.modes[mode || 0];
    return ((this.minDate && currentMode.compare(date, this.minDate) < 0) || (this.maxDate && currentMode.compare(date, this.maxDate) > 0) || ($scope.dateDisabled && $scope.dateDisabled({date: date, mode: currentMode.name})));
  };
}])

.directive( 'datepicker', ['dateFilter', '$parse', 'datepickerConfig', '$log', function (dateFilter, $parse, datepickerConfig, $log) {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'template/datepicker/datepicker.html',
    scope: {
      dateDisabled: '&'
    },
    require: ['datepicker', '?^ngModel'],
    controller: 'DatepickerController',
    link: function(scope, element, attrs, ctrls) {
      var datepickerCtrl = ctrls[0], ngModel = ctrls[1];

      if (!ngModel) {
        return; // do nothing if no ng-model
      }

      // Configuration parameters
      var mode = 0, selected = new Date(), showWeeks = datepickerConfig.showWeeks;

      if (attrs.showWeeks) {
        scope.$parent.$watch($parse(attrs.showWeeks), function(value) {
          showWeeks = !! value;
          updateShowWeekNumbers();
        });
      } else {
        updateShowWeekNumbers();
      }

      if (attrs.min) {
        scope.$parent.$watch($parse(attrs.min), function(value) {
          datepickerCtrl.minDate = value ? new Date(value) : null;
          refill();
        });
      }
      if (attrs.max) {
        scope.$parent.$watch($parse(attrs.max), function(value) {
          datepickerCtrl.maxDate = value ? new Date(value) : null;
          refill();
        });
      }

      function updateShowWeekNumbers() {
        scope.showWeekNumbers = mode === 0 && showWeeks;
      }

      // Split array into smaller arrays
      function split(arr, size) {
        var arrays = [];
        while (arr.length > 0) {
          arrays.push(arr.splice(0, size));
        }
        return arrays;
      }

      function refill( updateSelected ) {
        var date = null, valid = true;

        if ( ngModel.$modelValue ) {
          date = new Date( ngModel.$modelValue );

          if ( isNaN(date) ) {
            valid = false;
            $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
          } else if ( updateSelected ) {
            selected = date;
          }
        }
        ngModel.$setValidity('date', valid);

        var currentMode = datepickerCtrl.modes[mode], data = currentMode.getVisibleDates(selected, date);
        angular.forEach(data.objects, function(obj) {
          obj.disabled = datepickerCtrl.isDisabled(obj.date, mode);
        });

        ngModel.$setValidity('date-disabled', (!date || !datepickerCtrl.isDisabled(date)));

        scope.rows = split(data.objects, currentMode.split);
        scope.labels = data.labels || [];
        scope.title = data.title;
      }

      function setMode(value) {
        mode = value;
        updateShowWeekNumbers();
        refill();
      }

      ngModel.$render = function() {
        refill( true );
      };

      scope.select = function( date ) {
        if ( mode === 0 ) {
          var dt = ngModel.$modelValue ? new Date( ngModel.$modelValue ) : new Date(0, 0, 0, 0, 0, 0, 0);
          dt.setFullYear( date.getFullYear(), date.getMonth(), date.getDate() );
          ngModel.$setViewValue( dt );
          refill( true );
        } else {
          selected = date;
          setMode( mode - 1 );
        }
      };
      scope.move = function(direction) {
        var step = datepickerCtrl.modes[mode].step;
        selected.setMonth( selected.getMonth() + direction * (step.months || 0) );
        selected.setFullYear( selected.getFullYear() + direction * (step.years || 0) );
        refill();
      };
      scope.toggleMode = function() {
        setMode( (mode + 1) % datepickerCtrl.modes.length );
      };
      scope.getWeekNumber = function(row) {
        return ( mode === 0 && scope.showWeekNumbers && row.length === 7 ) ? getISO8601WeekNumber(row[0].date) : null;
      };

      function getISO8601WeekNumber(date) {
        var checkDate = new Date(date);
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
        var time = checkDate.getTime();
        checkDate.setMonth(0); // Compare with Jan 1
        checkDate.setDate(1);
        return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
      }
    }
  };
}])

.constant('datepickerPopupConfig', {
  dateFormat: 'yyyy-MM-dd',
  currentText: 'Today',
  toggleWeeksText: 'Weeks',
  clearText: 'Clear',
  closeText: 'Done',
  closeOnDateSelection: true,
  appendToBody: false,
  showButtonBar: true
})

.directive('datepickerPopup', ['$compile', '$parse', '$document', '$position', 'dateFilter', 'datepickerPopupConfig', 'datepickerConfig',
function ($compile, $parse, $document, $position, dateFilter, datepickerPopupConfig, datepickerConfig) {
  return {
    restrict: 'EA',
    require: 'ngModel',
    link: function(originalScope, element, attrs, ngModel) {
      var scope = originalScope.$new(), // create a child scope so we are not polluting original one
          dateFormat,
          closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? originalScope.$eval(attrs.closeOnDateSelection) : datepickerPopupConfig.closeOnDateSelection,
          appendToBody = angular.isDefined(attrs.datepickerAppendToBody) ? originalScope.$eval(attrs.datepickerAppendToBody) : datepickerPopupConfig.appendToBody;

      attrs.$observe('datepickerPopup', function(value) {
          dateFormat = value || datepickerPopupConfig.dateFormat;
          ngModel.$render();
      });

      scope.showButtonBar = angular.isDefined(attrs.showButtonBar) ? originalScope.$eval(attrs.showButtonBar) : datepickerPopupConfig.showButtonBar;

      originalScope.$on('$destroy', function() {
        $popup.remove();
        scope.$destroy();
      });

      attrs.$observe('currentText', function(text) {
        scope.currentText = angular.isDefined(text) ? text : datepickerPopupConfig.currentText;
      });
      attrs.$observe('toggleWeeksText', function(text) {
        scope.toggleWeeksText = angular.isDefined(text) ? text : datepickerPopupConfig.toggleWeeksText;
      });
      attrs.$observe('clearText', function(text) {
        scope.clearText = angular.isDefined(text) ? text : datepickerPopupConfig.clearText;
      });
      attrs.$observe('closeText', function(text) {
        scope.closeText = angular.isDefined(text) ? text : datepickerPopupConfig.closeText;
      });

      var getIsOpen, setIsOpen;
      if ( attrs.isOpen ) {
        getIsOpen = $parse(attrs.isOpen);
        setIsOpen = getIsOpen.assign;

        originalScope.$watch(getIsOpen, function updateOpen(value) {
          scope.isOpen = !! value;
        });
      }
      scope.isOpen = getIsOpen ? getIsOpen(originalScope) : false; // Initial state

      function setOpen( value ) {
        if (setIsOpen) {
          setIsOpen(originalScope, !!value);
        } else {
          scope.isOpen = !!value;
        }
      }

      var documentClickBind = function(event) {
        if (scope.isOpen && event.target !== element[0]) {
          scope.$apply(function() {
            setOpen(false);
          });
        }
      };

      var elementFocusBind = function() {
        scope.$apply(function() {
          setOpen( true );
        });
      };

      // popup element used to display calendar
      var popupEl = angular.element('<div datepicker-popup-wrap><div datepicker></div></div>');
      popupEl.attr({
        'ng-model': 'date',
        'ng-change': 'dateSelection()'
      });
      var datepickerEl = angular.element(popupEl.children()[0]),
          datepickerOptions = {};
      if (attrs.datepickerOptions) {
        datepickerOptions = originalScope.$eval(attrs.datepickerOptions);
        datepickerEl.attr(angular.extend({}, datepickerOptions));
      }

      // TODO: reverse from dateFilter string to Date object
      function parseDate(viewValue) {
        if (!viewValue) {
          ngModel.$setValidity('date', true);
          return null;
        } else if (angular.isDate(viewValue)) {
          ngModel.$setValidity('date', true);
          return viewValue;
        } else if (angular.isString(viewValue)) {
          var date = new Date(viewValue);
          if (isNaN(date)) {
            ngModel.$setValidity('date', false);
            return undefined;
          } else {
            ngModel.$setValidity('date', true);
            return date;
          }
        } else {
          ngModel.$setValidity('date', false);
          return undefined;
        }
      }
      ngModel.$parsers.unshift(parseDate);

      // Inner change
      scope.dateSelection = function(dt) {
        if (angular.isDefined(dt)) {
          scope.date = dt;
        }
        ngModel.$setViewValue(scope.date);
        ngModel.$render();

        if (closeOnDateSelection) {
          setOpen( false );
        }
      };

      element.bind('input change keyup', function() {
        scope.$apply(function() {
          scope.date = ngModel.$modelValue;
        });
      });

      // Outter change
      ngModel.$render = function() {
        var date = ngModel.$viewValue ? dateFilter(ngModel.$viewValue, dateFormat) : '';
        element.val(date);
        scope.date = ngModel.$modelValue;
      };

      function addWatchableAttribute(attribute, scopeProperty, datepickerAttribute) {
        if (attribute) {
          originalScope.$watch($parse(attribute), function(value){
            scope[scopeProperty] = value;
          });
          datepickerEl.attr(datepickerAttribute || scopeProperty, scopeProperty);
        }
      }
      addWatchableAttribute(attrs.min, 'min');
      addWatchableAttribute(attrs.max, 'max');
      if (attrs.showWeeks) {
        addWatchableAttribute(attrs.showWeeks, 'showWeeks', 'show-weeks');
      } else {
        scope.showWeeks = 'show-weeks' in datepickerOptions ? datepickerOptions['show-weeks'] : datepickerConfig.showWeeks;
        datepickerEl.attr('show-weeks', 'showWeeks');
      }
      if (attrs.dateDisabled) {
        datepickerEl.attr('date-disabled', attrs.dateDisabled);
      }

      function updatePosition() {
        scope.position = appendToBody ? $position.offset(element) : $position.position(element);
        scope.position.top = scope.position.top + element.prop('offsetHeight');
      }

      var documentBindingInitialized = false, elementFocusInitialized = false;
      scope.$watch('isOpen', function(value) {
        if (value) {
          updatePosition();
          $document.bind('click', documentClickBind);
          if(elementFocusInitialized) {
            element.unbind('focus', elementFocusBind);
          }
          element[0].focus();
          documentBindingInitialized = true;
        } else {
          if(documentBindingInitialized) {
            $document.unbind('click', documentClickBind);
          }
          element.bind('focus', elementFocusBind);
          elementFocusInitialized = true;
        }

        if ( setIsOpen ) {
          setIsOpen(originalScope, value);
        }
      });

      scope.today = function() {
        scope.dateSelection(new Date());
      };
      scope.clear = function() {
        scope.dateSelection(null);
      };

      var $popup = $compile(popupEl)(scope);
      if ( appendToBody ) {
        $document.find('body').append($popup);
      } else {
        element.after($popup);
      }
    }
  };
}])

.directive('datepickerPopupWrap', function() {
  return {
    restrict:'EA',
    replace: true,
    transclude: true,
    templateUrl: 'template/datepicker/popup.html',
    link:function (scope, element, attrs) {
      element.bind('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
      });
    }
  };
});

/*
 * dropdownToggle - Provides dropdown menu functionality in place of bootstrap js
 * @restrict class or attribute
 * @example:
   <li class="dropdown">
     <a class="dropdown-toggle">My Dropdown Menu</a>
     <ul class="dropdown-menu">
       <li ng-repeat="choice in dropChoices">
         <a ng-href="{{choice.href}}">{{choice.text}}</a>
       </li>
     </ul>
   </li>
 */

angular.module('ui.bootstrap.dropdownToggle', []).directive('dropdownToggle', ['$document', '$location', function ($document, $location) {
  var openElement = null,
      closeMenu   = angular.noop;
  return {
    restrict: 'CA',
    link: function(scope, element, attrs) {
      scope.$watch('$location.path', function() { closeMenu(); });
      element.parent().bind('click', function() { closeMenu(); });
      element.bind('click', function (event) {

        var elementWasOpen = (element === openElement);

        event.preventDefault();
        event.stopPropagation();

        if (!!openElement) {
          closeMenu();
        }

        if (!elementWasOpen && !element.hasClass('disabled') && !element.prop('disabled')) {
          element.parent().addClass('open');
          openElement = element;
          closeMenu = function (event) {
            if (event) {
              event.preventDefault();
              event.stopPropagation();
            }
            $document.unbind('click', closeMenu);
            element.parent().removeClass('open');
            closeMenu = angular.noop;
            openElement = null;
          };
          $document.bind('click', closeMenu);
        }
      });
    }
  };
}]);

angular.module('ui.bootstrap.modal', ['ui.bootstrap.transition'])

/**
 * A helper, internal data structure that acts as a map but also allows getting / removing
 * elements in the LIFO order
 */
  .factory('$$stackedMap', function () {
    return {
      createNew: function () {
        var stack = [];

        return {
          add: function (key, value) {
            stack.push({
              key: key,
              value: value
            });
          },
          get: function (key) {
            for (var i = 0; i < stack.length; i++) {
              if (key == stack[i].key) {
                return stack[i];
              }
            }
          },
          keys: function() {
            var keys = [];
            for (var i = 0; i < stack.length; i++) {
              keys.push(stack[i].key);
            }
            return keys;
          },
          top: function () {
            return stack[stack.length - 1];
          },
          remove: function (key) {
            var idx = -1;
            for (var i = 0; i < stack.length; i++) {
              if (key == stack[i].key) {
                idx = i;
                break;
              }
            }
            return stack.splice(idx, 1)[0];
          },
          removeTop: function () {
            return stack.splice(stack.length - 1, 1)[0];
          },
          length: function () {
            return stack.length;
          }
        };
      }
    };
  })

/**
 * A helper directive for the $modal service. It creates a backdrop element.
 */
  .directive('modalBackdrop', ['$timeout', function ($timeout) {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'template/modal/backdrop.html',
      link: function (scope) {

        scope.animate = false;

        //trigger CSS transitions
        $timeout(function () {
          scope.animate = true;
        });
      }
    };
  }])

  .directive('modalWindow', ['$modalStack', '$timeout', function ($modalStack, $timeout) {
    return {
      restrict: 'EA',
      scope: {
        index: '@',
        animate: '='
      },
      replace: true,
      transclude: true,
      templateUrl: 'template/modal/window.html',
      link: function (scope, element, attrs) {
        scope.windowClass = attrs.windowClass || '';

        $timeout(function () {
          // trigger CSS transitions
          scope.animate = true;
          // focus a freshly-opened modal
          element[0].focus();
        });

        scope.close = function (evt) {
          var modal = $modalStack.getTop();
          if (modal && modal.value.backdrop && modal.value.backdrop != 'static' && (evt.target === evt.currentTarget)) {
            evt.preventDefault();
            evt.stopPropagation();
            $modalStack.dismiss(modal.key, 'backdrop click');
          }
        };
      }
    };
  }])

  .factory('$modalStack', ['$transition', '$timeout', '$document', '$compile', '$rootScope', '$$stackedMap',
    function ($transition, $timeout, $document, $compile, $rootScope, $$stackedMap) {

      var OPENED_MODAL_CLASS = 'modal-open';

      var backdropDomEl, backdropScope;
      var openedWindows = $$stackedMap.createNew();
      var $modalStack = {};

      function backdropIndex() {
        var topBackdropIndex = -1;
        var opened = openedWindows.keys();
        for (var i = 0; i < opened.length; i++) {
          if (openedWindows.get(opened[i]).value.backdrop) {
            topBackdropIndex = i;
          }
        }
        return topBackdropIndex;
      }

      $rootScope.$watch(backdropIndex, function(newBackdropIndex){
        if (backdropScope) {
          backdropScope.index = newBackdropIndex;
        }
      });

      function removeModalWindow(modalInstance) {

        var body = $document.find('body').eq(0);
        var modalWindow = openedWindows.get(modalInstance).value;

        //clean up the stack
        openedWindows.remove(modalInstance);

        //remove window DOM element
        removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, 300, checkRemoveBackdrop);
        body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
      }

      function checkRemoveBackdrop() {
          //remove backdrop if no longer needed
          if (backdropDomEl && backdropIndex() == -1) {
            var backdropScopeRef = backdropScope;
            removeAfterAnimate(backdropDomEl, backdropScope, 150, function () {
              backdropScopeRef.$destroy();
              backdropScopeRef = null;
            });
            backdropDomEl = undefined;
            backdropScope = undefined;
          }
      }

      function removeAfterAnimate(domEl, scope, emulateTime, done) {
        // Closing animation
        scope.animate = false;

        var transitionEndEventName = $transition.transitionEndEventName;
        if (transitionEndEventName) {
          // transition out
          var timeout = $timeout(afterAnimating, emulateTime);

          domEl.bind(transitionEndEventName, function () {
            $timeout.cancel(timeout);
            afterAnimating();
            scope.$apply();
          });
        } else {
          // Ensure this call is async
          $timeout(afterAnimating, 0);
        }

        function afterAnimating() {
          if (afterAnimating.done) {
            return;
          }
          afterAnimating.done = true;

          domEl.remove();
          if (done) {
            done();
          }
        }
      }

      $document.bind('keydown', function (evt) {
        var modal;

        if (evt.which === 27) {
          modal = openedWindows.top();
          if (modal && modal.value.keyboard) {
            $rootScope.$apply(function () {
              $modalStack.dismiss(modal.key);
            });
          }
        }
      });

      $modalStack.open = function (modalInstance, modal) {

        openedWindows.add(modalInstance, {
          deferred: modal.deferred,
          modalScope: modal.scope,
          backdrop: modal.backdrop,
          keyboard: modal.keyboard
        });

        var body = $document.find('body').eq(0),
            currBackdropIndex = backdropIndex();

        if (currBackdropIndex >= 0 && !backdropDomEl) {
          backdropScope = $rootScope.$new(true);
          backdropScope.index = currBackdropIndex;
          backdropDomEl = $compile('<div modal-backdrop></div>')(backdropScope);
          body.append(backdropDomEl);
        }
          
        var angularDomEl = angular.element('<div modal-window></div>');
        angularDomEl.attr('window-class', modal.windowClass);
        angularDomEl.attr('index', openedWindows.length() - 1);
        angularDomEl.attr('animate', 'animate');
        angularDomEl.html(modal.content);

        var modalDomEl = $compile(angularDomEl)(modal.scope);
        openedWindows.top().value.modalDomEl = modalDomEl;
        body.append(modalDomEl);
        body.addClass(OPENED_MODAL_CLASS);
      };

      $modalStack.close = function (modalInstance, result) {
        var modalWindow = openedWindows.get(modalInstance).value;
        if (modalWindow) {
          modalWindow.deferred.resolve(result);
          removeModalWindow(modalInstance);
        }
      };

      $modalStack.dismiss = function (modalInstance, reason) {
        var modalWindow = openedWindows.get(modalInstance).value;
        if (modalWindow) {
          modalWindow.deferred.reject(reason);
          removeModalWindow(modalInstance);
        }
      };

      $modalStack.dismissAll = function (reason) {
        var topModal = this.getTop();
        while (topModal) {
          this.dismiss(topModal.key, reason);
          topModal = this.getTop();
        }
      };

      $modalStack.getTop = function () {
        return openedWindows.top();
      };

      return $modalStack;
    }])

  .provider('$modal', function () {

    var $modalProvider = {
      options: {
        backdrop: true, //can be also false or 'static'
        keyboard: true
      },
      $get: ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$modalStack',
        function ($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) {

          var $modal = {};

          function getTemplatePromise(options) {
            return options.template ? $q.when(options.template) :
              $http.get(options.templateUrl, {cache: $templateCache}).then(function (result) {
                return result.data;
              });
          }

          function getResolvePromises(resolves) {
            var promisesArr = [];
            angular.forEach(resolves, function (value, key) {
              if (angular.isFunction(value) || angular.isArray(value)) {
                promisesArr.push($q.when($injector.invoke(value)));
              }
            });
            return promisesArr;
          }

          $modal.open = function (modalOptions) {

            var modalResultDeferred = $q.defer();
            var modalOpenedDeferred = $q.defer();

            //prepare an instance of a modal to be injected into controllers and returned to a caller
            var modalInstance = {
              result: modalResultDeferred.promise,
              opened: modalOpenedDeferred.promise,
              close: function (result) {
                $modalStack.close(modalInstance, result);
              },
              dismiss: function (reason) {
                $modalStack.dismiss(modalInstance, reason);
              }
            };

            //merge and clean up options
            modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
            modalOptions.resolve = modalOptions.resolve || {};

            //verify options
            if (!modalOptions.template && !modalOptions.templateUrl) {
              throw new Error('One of template or templateUrl options is required.');
            }

            var templateAndResolvePromise =
              $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));


            templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {

              var modalScope = (modalOptions.scope || $rootScope).$new();
              modalScope.$close = modalInstance.close;
              modalScope.$dismiss = modalInstance.dismiss;

              var ctrlInstance, ctrlLocals = {};
              var resolveIter = 1;

              //controllers
              if (modalOptions.controller) {
                ctrlLocals.$scope = modalScope;
                ctrlLocals.$modalInstance = modalInstance;
                angular.forEach(modalOptions.resolve, function (value, key) {
                  ctrlLocals[key] = tplAndVars[resolveIter++];
                });

                ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
              }

              $modalStack.open(modalInstance, {
                scope: modalScope,
                deferred: modalResultDeferred,
                content: tplAndVars[0],
                backdrop: modalOptions.backdrop,
                keyboard: modalOptions.keyboard,
                windowClass: modalOptions.windowClass
              });

            }, function resolveError(reason) {
              modalResultDeferred.reject(reason);
            });

            templateAndResolvePromise.then(function () {
              modalOpenedDeferred.resolve(true);
            }, function () {
              modalOpenedDeferred.reject(false);
            });

            return modalInstance;
          };

          return $modal;
        }]
    };

    return $modalProvider;
  });

angular.module('ui.bootstrap.pagination', [])

.controller('PaginationController', ['$scope', '$attrs', '$parse', '$interpolate', function ($scope, $attrs, $parse, $interpolate) {
  var self = this,
      setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

  this.init = function(defaultItemsPerPage) {
    if ($attrs.itemsPerPage) {
      $scope.$parent.$watch($parse($attrs.itemsPerPage), function(value) {
        self.itemsPerPage = parseInt(value, 10);
        $scope.totalPages = self.calculateTotalPages();
      });
    } else {
      this.itemsPerPage = defaultItemsPerPage;
    }
  };

  this.noPrevious = function() {
    return this.page === 1;
  };
  this.noNext = function() {
    return this.page === $scope.totalPages;
  };

  this.isActive = function(page) {
    return this.page === page;
  };

  this.calculateTotalPages = function() {
    var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
    return Math.max(totalPages || 0, 1);
  };

  this.getAttributeValue = function(attribute, defaultValue, interpolate) {
    return angular.isDefined(attribute) ? (interpolate ? $interpolate(attribute)($scope.$parent) : $scope.$parent.$eval(attribute)) : defaultValue;
  };

  this.render = function() {
    this.page = parseInt($scope.page, 10) || 1;
    if (this.page > 0 && this.page <= $scope.totalPages) {
      $scope.pages = this.getPages(this.page, $scope.totalPages);
    }
  };

  $scope.selectPage = function(page) {
    if ( ! self.isActive(page) && page > 0 && page <= $scope.totalPages) {
      $scope.page = page;
      $scope.onSelectPage({ page: page });
    }
  };

  $scope.$watch('page', function() {
    self.render();
  });

  $scope.$watch('totalItems', function() {
    $scope.totalPages = self.calculateTotalPages();
  });

  $scope.$watch('totalPages', function(value) {
    setNumPages($scope.$parent, value); // Readonly variable

    if ( self.page > value ) {
      $scope.selectPage(value);
    } else {
      self.render();
    }
  });
}])

.constant('paginationConfig', {
  itemsPerPage: 10,
  boundaryLinks: false,
  directionLinks: true,
  firstText: 'First',
  previousText: 'Previous',
  nextText: 'Next',
  lastText: 'Last',
  rotate: true
})

.directive('pagination', ['$parse', 'paginationConfig', function($parse, config) {
  return {
    restrict: 'EA',
    scope: {
      page: '=',
      totalItems: '=',
      onSelectPage:' &'
    },
    controller: 'PaginationController',
    templateUrl: 'template/pagination/pagination.html',
    replace: true,
    link: function(scope, element, attrs, paginationCtrl) {

      // Setup configuration parameters
      var maxSize,
      boundaryLinks  = paginationCtrl.getAttributeValue(attrs.boundaryLinks,  config.boundaryLinks      ),
      directionLinks = paginationCtrl.getAttributeValue(attrs.directionLinks, config.directionLinks     ),
      firstText      = paginationCtrl.getAttributeValue(attrs.firstText,      config.firstText,     true),
      previousText   = paginationCtrl.getAttributeValue(attrs.previousText,   config.previousText,  true),
      nextText       = paginationCtrl.getAttributeValue(attrs.nextText,       config.nextText,      true),
      lastText       = paginationCtrl.getAttributeValue(attrs.lastText,       config.lastText,      true),
      rotate         = paginationCtrl.getAttributeValue(attrs.rotate,         config.rotate);

      paginationCtrl.init(config.itemsPerPage);

      if (attrs.maxSize) {
        scope.$parent.$watch($parse(attrs.maxSize), function(value) {
          maxSize = parseInt(value, 10);
          paginationCtrl.render();
        });
      }

      // Create page object used in template
      function makePage(number, text, isActive, isDisabled) {
        return {
          number: number,
          text: text,
          active: isActive,
          disabled: isDisabled
        };
      }

      paginationCtrl.getPages = function(currentPage, totalPages) {
        var pages = [];

        // Default page limits
        var startPage = 1, endPage = totalPages;
        var isMaxSized = ( angular.isDefined(maxSize) && maxSize < totalPages );

        // recompute if maxSize
        if ( isMaxSized ) {
          if ( rotate ) {
            // Current page is displayed in the middle of the visible ones
            startPage = Math.max(currentPage - Math.floor(maxSize/2), 1);
            endPage   = startPage + maxSize - 1;

            // Adjust if limit is exceeded
            if (endPage > totalPages) {
              endPage   = totalPages;
              startPage = endPage - maxSize + 1;
            }
          } else {
            // Visible pages are paginated with maxSize
            startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

            // Adjust last page if limit is exceeded
            endPage = Math.min(startPage + maxSize - 1, totalPages);
          }
        }

        // Add page number links
        for (var number = startPage; number <= endPage; number++) {
          var page = makePage(number, number, paginationCtrl.isActive(number), false);
          pages.push(page);
        }

        // Add links to move between page sets
        if ( isMaxSized && ! rotate ) {
          if ( startPage > 1 ) {
            var previousPageSet = makePage(startPage - 1, '...', false, false);
            pages.unshift(previousPageSet);
          }

          if ( endPage < totalPages ) {
            var nextPageSet = makePage(endPage + 1, '...', false, false);
            pages.push(nextPageSet);
          }
        }

        // Add previous & next links
        if (directionLinks) {
          var previousPage = makePage(currentPage - 1, previousText, false, paginationCtrl.noPrevious());
          pages.unshift(previousPage);

          var nextPage = makePage(currentPage + 1, nextText, false, paginationCtrl.noNext());
          pages.push(nextPage);
        }

        // Add first & last links
        if (boundaryLinks) {
          var firstPage = makePage(1, firstText, false, paginationCtrl.noPrevious());
          pages.unshift(firstPage);

          var lastPage = makePage(totalPages, lastText, false, paginationCtrl.noNext());
          pages.push(lastPage);
        }

        return pages;
      };
    }
  };
}])

.constant('pagerConfig', {
  itemsPerPage: 10,
  previousText: '« Previous',
  nextText: 'Next »',
  align: true
})

.directive('pager', ['pagerConfig', function(config) {
  return {
    restrict: 'EA',
    scope: {
      page: '=',
      totalItems: '=',
      onSelectPage:' &'
    },
    controller: 'PaginationController',
    templateUrl: 'template/pagination/pager.html',
    replace: true,
    link: function(scope, element, attrs, paginationCtrl) {

      // Setup configuration parameters
      var previousText = paginationCtrl.getAttributeValue(attrs.previousText, config.previousText, true),
      nextText         = paginationCtrl.getAttributeValue(attrs.nextText,     config.nextText,     true),
      align            = paginationCtrl.getAttributeValue(attrs.align,        config.align);

      paginationCtrl.init(config.itemsPerPage);

      // Create page object used in template
      function makePage(number, text, isDisabled, isPrevious, isNext) {
        return {
          number: number,
          text: text,
          disabled: isDisabled,
          previous: ( align && isPrevious ),
          next: ( align && isNext )
        };
      }

      paginationCtrl.getPages = function(currentPage) {
        return [
          makePage(currentPage - 1, previousText, paginationCtrl.noPrevious(), true, false),
          makePage(currentPage + 1, nextText, paginationCtrl.noNext(), false, true)
        ];
      };
    }
  };
}]);

/**
 * The following features are still outstanding: animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, html tooltips, and selector delegation.
 */
angular.module( 'ui.bootstrap.tooltip', [ 'ui.bootstrap.position', 'ui.bootstrap.bindHtml' ] )

/**
 * The $tooltip service creates tooltip- and popover-like directives as well as
 * houses global options for them.
 */
.provider( '$tooltip', function () {
  // The default options tooltip and popover.
  var defaultOptions = {
    placement: 'top',
    animation: true,
    popupDelay: 0
  };

  // Default hide triggers for each show trigger
  var triggerMap = {
    'mouseenter': 'mouseleave',
    'click': 'click',
    'focus': 'blur'
  };

  // The options specified to the provider globally.
  var globalOptions = {};
  
  /**
   * `options({})` allows global configuration of all tooltips in the
   * application.
   *
   *   var app = angular.module( 'App', ['ui.bootstrap.tooltip'], function( $tooltipProvider ) {
   *     // place tooltips left instead of top by default
   *     $tooltipProvider.options( { placement: 'left' } );
   *   });
   */
	this.options = function( value ) {
		angular.extend( globalOptions, value );
	};

  /**
   * This allows you to extend the set of trigger mappings available. E.g.:
   *
   *   $tooltipProvider.setTriggers( 'openTrigger': 'closeTrigger' );
   */
  this.setTriggers = function setTriggers ( triggers ) {
    angular.extend( triggerMap, triggers );
  };

  /**
   * This is a helper function for translating camel-case to snake-case.
   */
  function snake_case(name){
    var regexp = /[A-Z]/g;
    var separator = '-';
    return name.replace(regexp, function(letter, pos) {
      return (pos ? separator : '') + letter.toLowerCase();
    });
  }

  /**
   * Returns the actual instance of the $tooltip service.
   * TODO support multiple triggers
   */
  this.$get = [ '$window', '$compile', '$timeout', '$parse', '$document', '$position', '$interpolate', function ( $window, $compile, $timeout, $parse, $document, $position, $interpolate ) {
    return function $tooltip ( type, prefix, defaultTriggerShow ) {
      var options = angular.extend( {}, defaultOptions, globalOptions );

      /**
       * Returns an object of show and hide triggers.
       *
       * If a trigger is supplied,
       * it is used to show the tooltip; otherwise, it will use the `trigger`
       * option passed to the `$tooltipProvider.options` method; else it will
       * default to the trigger supplied to this directive factory.
       *
       * The hide trigger is based on the show trigger. If the `trigger` option
       * was passed to the `$tooltipProvider.options` method, it will use the
       * mapped trigger from `triggerMap` or the passed trigger if the map is
       * undefined; otherwise, it uses the `triggerMap` value of the show
       * trigger; else it will just use the show trigger.
       */
      function getTriggers ( trigger ) {
        var show = trigger || options.trigger || defaultTriggerShow;
        var hide = triggerMap[show] || show;
        return {
          show: show,
          hide: hide
        };
      }

      var directiveName = snake_case( type );

      var startSym = $interpolate.startSymbol();
      var endSym = $interpolate.endSymbol();
      var template = 
        '<div '+ directiveName +'-popup '+
          'title="'+startSym+'tt_title'+endSym+'" '+
          'content="'+startSym+'tt_content'+endSym+'" '+
          'placement="'+startSym+'tt_placement'+endSym+'" '+
          'animation="tt_animation" '+
          'is-open="tt_isOpen"'+
          '>'+
        '</div>';

      return {
        restrict: 'EA',
        scope: true,
        compile: function (tElem, tAttrs) {
          var tooltipLinker = $compile( template );

          return function link ( scope, element, attrs ) {
            var tooltip;
            var transitionTimeout;
            var popupTimeout;
            var appendToBody = angular.isDefined( options.appendToBody ) ? options.appendToBody : false;
            var triggers = getTriggers( undefined );
            var hasRegisteredTriggers = false;
            var hasEnableExp = angular.isDefined(attrs[prefix+'Enable']);

            var positionTooltip = function (){
              var position,
                ttWidth,
                ttHeight,
                ttPosition;
              // Get the position of the directive element.
              position = appendToBody ? $position.offset( element ) : $position.position( element );

              // Get the height and width of the tooltip so we can center it.
              ttWidth = tooltip.prop( 'offsetWidth' );
              ttHeight = tooltip.prop( 'offsetHeight' );

              // Calculate the tooltip's top and left coordinates to center it with
              // this directive.
              switch ( scope.tt_placement ) {
                case 'right':
                  ttPosition = {
                    top: position.top + position.height / 2 - ttHeight / 2,
                    left: position.left + position.width
                  };
                  break;
                case 'bottom':
                  ttPosition = {
                    top: position.top + position.height,
                    left: position.left + position.width / 2 - ttWidth / 2
                  };
                  break;
                case 'left':
                  ttPosition = {
                    top: position.top + position.height / 2 - ttHeight / 2,
                    left: position.left - ttWidth
                  };
                  break;
                default:
                  ttPosition = {
                    top: position.top - ttHeight,
                    left: position.left + position.width / 2 - ttWidth / 2
                  };
                  break;
              }

              ttPosition.top += 'px';
              ttPosition.left += 'px';

              // Now set the calculated positioning.
              tooltip.css( ttPosition );

            };

            // By default, the tooltip is not open.
            // TODO add ability to start tooltip opened
            scope.tt_isOpen = false;

            function toggleTooltipBind () {
              if ( ! scope.tt_isOpen ) {
                showTooltipBind();
              } else {
                hideTooltipBind();
              }
            }

            // Show the tooltip with delay if specified, otherwise show it immediately
            function showTooltipBind() {
              if(hasEnableExp && !scope.$eval(attrs[prefix+'Enable'])) {
                return;
              }
              if ( scope.tt_popupDelay ) {
                popupTimeout = $timeout( show, scope.tt_popupDelay, false );
                popupTimeout.then(function(reposition){reposition();});
              } else {
                show()();
              }
            }

            function hideTooltipBind () {
              scope.$apply(function () {
                hide();
              });
            }

            // Show the tooltip popup element.
            function show() {


              // Don't show empty tooltips.
              if ( ! scope.tt_content ) {
                return angular.noop;
              }

              createTooltip();

              // If there is a pending remove transition, we must cancel it, lest the
              // tooltip be mysteriously removed.
              if ( transitionTimeout ) {
                $timeout.cancel( transitionTimeout );
              }

              // Set the initial positioning.
              tooltip.css({ top: 0, left: 0, display: 'block' });

              // Now we add it to the DOM because need some info about it. But it's not 
              // visible yet anyway.
              if ( appendToBody ) {
                  $document.find( 'body' ).append( tooltip );
              } else {
                element.after( tooltip );
              }

              positionTooltip();

              // And show the tooltip.
              scope.tt_isOpen = true;
              scope.$digest(); // digest required as $apply is not called

              // Return positioning function as promise callback for correct
              // positioning after draw.
              return positionTooltip;
            }

            // Hide the tooltip popup element.
            function hide() {
              // First things first: we don't show it anymore.
              scope.tt_isOpen = false;

              //if tooltip is going to be shown after delay, we must cancel this
              $timeout.cancel( popupTimeout );

              // And now we remove it from the DOM. However, if we have animation, we 
              // need to wait for it to expire beforehand.
              // FIXME: this is a placeholder for a port of the transitions library.
              if ( scope.tt_animation ) {
                transitionTimeout = $timeout(removeTooltip, 500);
              } else {
                removeTooltip();
              }
            }

            function createTooltip() {
              // There can only be one tooltip element per directive shown at once.
              if (tooltip) {
                removeTooltip();
              }
              tooltip = tooltipLinker(scope, function () {});

              // Get contents rendered into the tooltip
              scope.$digest();
            }

            function removeTooltip() {
              if (tooltip) {
                tooltip.remove();
                tooltip = null;
              }
            }

            /**
             * Observe the relevant attributes.
             */
            attrs.$observe( type, function ( val ) {
              scope.tt_content = val;

              if (!val && scope.tt_isOpen ) {
                hide();
              }
            });

            attrs.$observe( prefix+'Title', function ( val ) {
              scope.tt_title = val;
            });

            attrs.$observe( prefix+'Placement', function ( val ) {
              scope.tt_placement = angular.isDefined( val ) ? val : options.placement;
            });

            attrs.$observe( prefix+'PopupDelay', function ( val ) {
              var delay = parseInt( val, 10 );
              scope.tt_popupDelay = ! isNaN(delay) ? delay : options.popupDelay;
            });

            var unregisterTriggers = function() {
              if (hasRegisteredTriggers) {
                element.unbind( triggers.show, showTooltipBind );
                element.unbind( triggers.hide, hideTooltipBind );
              }
            };

            attrs.$observe( prefix+'Trigger', function ( val ) {
              unregisterTriggers();

              triggers = getTriggers( val );

              if ( triggers.show === triggers.hide ) {
                element.bind( triggers.show, toggleTooltipBind );
              } else {
                element.bind( triggers.show, showTooltipBind );
                element.bind( triggers.hide, hideTooltipBind );
              }

              hasRegisteredTriggers = true;
            });

            var animation = scope.$eval(attrs[prefix + 'Animation']);
            scope.tt_animation = angular.isDefined(animation) ? !!animation : options.animation;

            attrs.$observe( prefix+'AppendToBody', function ( val ) {
              appendToBody = angular.isDefined( val ) ? $parse( val )( scope ) : appendToBody;
            });

            // if a tooltip is attached to <body> we need to remove it on
            // location change as its parent scope will probably not be destroyed
            // by the change.
            if ( appendToBody ) {
              scope.$on('$locationChangeSuccess', function closeTooltipOnLocationChangeSuccess () {
              if ( scope.tt_isOpen ) {
                hide();
              }
            });
            }

            // Make sure tooltip is destroyed and removed.
            scope.$on('$destroy', function onDestroyTooltip() {
              $timeout.cancel( transitionTimeout );
              $timeout.cancel( popupTimeout );
              unregisterTriggers();
              removeTooltip();
            });
          };
        }
      };
    };
  }];
})

.directive( 'tooltipPopup', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: { content: '@', placement: '@', animation: '&', isOpen: '&' },
    templateUrl: 'template/tooltip/tooltip-popup.html'
  };
})

.directive( 'tooltip', [ '$tooltip', function ( $tooltip ) {
  return $tooltip( 'tooltip', 'tooltip', 'mouseenter' );
}])

.directive( 'tooltipHtmlUnsafePopup', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: { content: '@', placement: '@', animation: '&', isOpen: '&' },
    templateUrl: 'template/tooltip/tooltip-html-unsafe-popup.html'
  };
})

.directive( 'tooltipHtmlUnsafe', [ '$tooltip', function ( $tooltip ) {
  return $tooltip( 'tooltipHtmlUnsafe', 'tooltip', 'mouseenter' );
}]);

/**
 * The following features are still outstanding: popup delay, animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, html popovers, and selector delegatation.
 */
angular.module( 'ui.bootstrap.popover', [ 'ui.bootstrap.tooltip' ] )

.directive( 'popoverPopup', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: { title: '@', content: '@', placement: '@', animation: '&', isOpen: '&' },
    templateUrl: 'template/popover/popover.html'
  };
})

.directive( 'popover', [ '$tooltip', function ( $tooltip ) {
  return $tooltip( 'popover', 'popover', 'click' );
}]);

angular.module('ui.bootstrap.progressbar', ['ui.bootstrap.transition'])

.constant('progressConfig', {
  animate: true,
  max: 100
})

.controller('ProgressController', ['$scope', '$attrs', 'progressConfig', '$transition', function($scope, $attrs, progressConfig, $transition) {
    var self = this,
        bars = [],
        max = angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : progressConfig.max,
        animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : progressConfig.animate;

    this.addBar = function(bar, element) {
        var oldValue = 0, index = bar.$parent.$index;
        if ( angular.isDefined(index) &&  bars[index] ) {
            oldValue = bars[index].value;
        }
        bars.push(bar);

        this.update(element, bar.value, oldValue);

        bar.$watch('value', function(value, oldValue) {
            if (value !== oldValue) {
                self.update(element, value, oldValue);
            }
        });

        bar.$on('$destroy', function() {
            self.removeBar(bar);
        });
    };

    // Update bar element width
    this.update = function(element, newValue, oldValue) {
        var percent = this.getPercentage(newValue);

        if (animate) {
            element.css('width', this.getPercentage(oldValue) + '%');
            $transition(element, {width: percent + '%'});
        } else {
            element.css({'transition': 'none', 'width': percent + '%'});
        }
    };

    this.removeBar = function(bar) {
        bars.splice(bars.indexOf(bar), 1);
    };

    this.getPercentage = function(value) {
        return Math.round(100 * value / max);
    };
}])

.directive('progress', function() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        controller: 'ProgressController',
        require: 'progress',
        scope: {},
        template: '<div class="progress" ng-transclude></div>'
        //templateUrl: 'template/progressbar/progress.html' // Works in AngularJS 1.2
    };
})

.directive('bar', function() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        require: '^progress',
        scope: {
            value: '=',
            type: '@'
        },
        templateUrl: 'template/progressbar/bar.html',
        link: function(scope, element, attrs, progressCtrl) {
            progressCtrl.addBar(scope, element);
        }
    };
})

.directive('progressbar', function() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        controller: 'ProgressController',
        scope: {
            value: '=',
            type: '@'
        },
        templateUrl: 'template/progressbar/progressbar.html',
        link: function(scope, element, attrs, progressCtrl) {
            progressCtrl.addBar(scope, angular.element(element.children()[0]));
        }
    };
});
angular.module('ui.bootstrap.rating', [])

.constant('ratingConfig', {
  max: 5,
  stateOn: null,
  stateOff: null
})

.controller('RatingController', ['$scope', '$attrs', '$parse', 'ratingConfig', function($scope, $attrs, $parse, ratingConfig) {

  this.maxRange = angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max;
  this.stateOn = angular.isDefined($attrs.stateOn) ? $scope.$parent.$eval($attrs.stateOn) : ratingConfig.stateOn;
  this.stateOff = angular.isDefined($attrs.stateOff) ? $scope.$parent.$eval($attrs.stateOff) : ratingConfig.stateOff;

  this.createRateObjects = function(states) {
    var defaultOptions = {
      stateOn: this.stateOn,
      stateOff: this.stateOff
    };

    for (var i = 0, n = states.length; i < n; i++) {
      states[i] = angular.extend({ index: i }, defaultOptions, states[i]);
    }
    return states;
  };

  // Get objects used in template
  $scope.range = angular.isDefined($attrs.ratingStates) ?  this.createRateObjects(angular.copy($scope.$parent.$eval($attrs.ratingStates))): this.createRateObjects(new Array(this.maxRange));

  $scope.rate = function(value) {
    if ( $scope.value !== value && !$scope.readonly ) {
      $scope.value = value;
    }
  };

  $scope.enter = function(value) {
    if ( ! $scope.readonly ) {
      $scope.val = value;
    }
    $scope.onHover({value: value});
  };

  $scope.reset = function() {
    $scope.val = angular.copy($scope.value);
    $scope.onLeave();
  };

  $scope.$watch('value', function(value) {
    $scope.val = value;
  });

  $scope.readonly = false;
  if ($attrs.readonly) {
    $scope.$parent.$watch($parse($attrs.readonly), function(value) {
      $scope.readonly = !!value;
    });
  }
}])

.directive('rating', function() {
  return {
    restrict: 'EA',
    scope: {
      value: '=',
      onHover: '&',
      onLeave: '&'
    },
    controller: 'RatingController',
    templateUrl: 'template/rating/rating.html',
    replace: true
  };
});

/**
 * @ngdoc overview
 * @name ui.bootstrap.tabs
 *
 * @description
 * AngularJS version of the tabs directive.
 */

angular.module('ui.bootstrap.tabs', [])

.controller('TabsetController', ['$scope', function TabsetCtrl($scope) {
  var ctrl = this,
      tabs = ctrl.tabs = $scope.tabs = [];

  ctrl.select = function(tab) {
    angular.forEach(tabs, function(tab) {
      tab.active = false;
    });
    tab.active = true;
  };

  ctrl.addTab = function addTab(tab) {
    tabs.push(tab);
    if (tabs.length === 1 || tab.active) {
      ctrl.select(tab);
    }
  };

  ctrl.removeTab = function removeTab(tab) {
    var index = tabs.indexOf(tab);
    //Select a new tab if the tab to be removed is selected
    if (tab.active && tabs.length > 1) {
      //If this is the last tab, select the previous tab. else, the next tab.
      var newActiveIndex = index == tabs.length - 1 ? index - 1 : index + 1;
      ctrl.select(tabs[newActiveIndex]);
    }
    tabs.splice(index, 1);
  };
}])

/**
 * @ngdoc directive
 * @name ui.bootstrap.tabs.directive:tabset
 * @restrict EA
 *
 * @description
 * Tabset is the outer container for the tabs directive
 *
 * @param {boolean=} vertical Whether or not to use vertical styling for the tabs.
 * @param {boolean=} justified Whether or not to use justified styling for the tabs.
 *
 * @example
<example module="ui.bootstrap">
  <file name="index.html">
    <tabset>
      <tab heading="Tab 1"><b>First</b> Content!</tab>
      <tab heading="Tab 2"><i>Second</i> Content!</tab>
    </tabset>
    <hr />
    <tabset vertical="true">
      <tab heading="Vertical Tab 1"><b>First</b> Vertical Content!</tab>
      <tab heading="Vertical Tab 2"><i>Second</i> Vertical Content!</tab>
    </tabset>
    <tabset justified="true">
      <tab heading="Justified Tab 1"><b>First</b> Justified Content!</tab>
      <tab heading="Justified Tab 2"><i>Second</i> Justified Content!</tab>
    </tabset>
  </file>
</example>
 */
.directive('tabset', function() {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    scope: {},
    controller: 'TabsetController',
    templateUrl: 'template/tabs/tabset.html',
    link: function(scope, element, attrs) {
      scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : false;
      scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : false;
      scope.type = angular.isDefined(attrs.type) ? scope.$parent.$eval(attrs.type) : 'tabs';
    }
  };
})

/**
 * @ngdoc directive
 * @name ui.bootstrap.tabs.directive:tab
 * @restrict EA
 *
 * @param {string=} heading The visible heading, or title, of the tab. Set HTML headings with {@link ui.bootstrap.tabs.directive:tabHeading tabHeading}.
 * @param {string=} select An expression to evaluate when the tab is selected.
 * @param {boolean=} active A binding, telling whether or not this tab is selected.
 * @param {boolean=} disabled A binding, telling whether or not this tab is disabled.
 *
 * @description
 * Creates a tab with a heading and content. Must be placed within a {@link ui.bootstrap.tabs.directive:tabset tabset}.
 *
 * @example
<example module="ui.bootstrap">
  <file name="index.html">
    <div ng-controller="TabsDemoCtrl">
      <button class="btn btn-small" ng-click="items[0].active = true">
        Select item 1, using active binding
      </button>
      <button class="btn btn-small" ng-click="items[1].disabled = !items[1].disabled">
        Enable/disable item 2, using disabled binding
      </button>
      <br />
      <tabset>
        <tab heading="Tab 1">First Tab</tab>
        <tab select="alertMe()">
          <tab-heading><i class="icon-bell"></i> Alert me!</tab-heading>
          Second Tab, with alert callback and html heading!
        </tab>
        <tab ng-repeat="item in items"
          heading="{{item.title}}"
          disabled="item.disabled"
          active="item.active">
          {{item.content}}
        </tab>
      </tabset>
    </div>
  </file>
  <file name="script.js">
    function TabsDemoCtrl($scope) {
      $scope.items = [
        { title:"Dynamic Title 1", content:"Dynamic Item 0" },
        { title:"Dynamic Title 2", content:"Dynamic Item 1", disabled: true }
      ];

      $scope.alertMe = function() {
        setTimeout(function() {
          alert("You've selected the alert tab!");
        });
      };
    };
  </file>
</example>
 */

/**
 * @ngdoc directive
 * @name ui.bootstrap.tabs.directive:tabHeading
 * @restrict EA
 *
 * @description
 * Creates an HTML heading for a {@link ui.bootstrap.tabs.directive:tab tab}. Must be placed as a child of a tab element.
 *
 * @example
<example module="ui.bootstrap">
  <file name="index.html">
    <tabset>
      <tab>
        <tab-heading><b>HTML</b> in my titles?!</tab-heading>
        And some content, too!
      </tab>
      <tab>
        <tab-heading><i class="icon-heart"></i> Icon heading?!?</tab-heading>
        That's right.
      </tab>
    </tabset>
  </file>
</example>
 */
.directive('tab', ['$parse', function($parse) {
  return {
    require: '^tabset',
    restrict: 'EA',
    replace: true,
    templateUrl: 'template/tabs/tab.html',
    transclude: true,
    scope: {
      heading: '@',
      onSelect: '&select', //This callback is called in contentHeadingTransclude
                          //once it inserts the tab's content into the dom
      onDeselect: '&deselect'
    },
    controller: function() {
      //Empty controller so other directives can require being 'under' a tab
    },
    compile: function(elm, attrs, transclude) {
      return function postLink(scope, elm, attrs, tabsetCtrl) {
        var getActive, setActive;
        if (attrs.active) {
          getActive = $parse(attrs.active);
          setActive = getActive.assign;
          scope.$parent.$watch(getActive, function updateActive(value, oldVal) {
            // Avoid re-initializing scope.active as it is already initialized
            // below. (watcher is called async during init with value ===
            // oldVal)
            if (value !== oldVal) {
              scope.active = !!value;
            }
          });
          scope.active = getActive(scope.$parent);
        } else {
          setActive = getActive = angular.noop;
        }

        scope.$watch('active', function(active) {
          // Note this watcher also initializes and assigns scope.active to the
          // attrs.active expression.
          setActive(scope.$parent, active);
          if (active) {
            tabsetCtrl.select(scope);
            scope.onSelect();
          } else {
            scope.onDeselect();
          }
        });

        scope.disabled = false;
        if ( attrs.disabled ) {
          scope.$parent.$watch($parse(attrs.disabled), function(value) {
            scope.disabled = !! value;
          });
        }

        scope.select = function() {
          if ( ! scope.disabled ) {
            scope.active = true;
          }
        };

        tabsetCtrl.addTab(scope);
        scope.$on('$destroy', function() {
          tabsetCtrl.removeTab(scope);
        });


        //We need to transclude later, once the content container is ready.
        //when this link happens, we're inside a tab heading.
        scope.$transcludeFn = transclude;
      };
    }
  };
}])

.directive('tabHeadingTransclude', [function() {
  return {
    restrict: 'A',
    require: '^tab',
    link: function(scope, elm, attrs, tabCtrl) {
      scope.$watch('headingElement', function updateHeadingElement(heading) {
        if (heading) {
          elm.html('');
          elm.append(heading);
        }
      });
    }
  };
}])

.directive('tabContentTransclude', function() {
  return {
    restrict: 'A',
    require: '^tabset',
    link: function(scope, elm, attrs) {
      var tab = scope.$eval(attrs.tabContentTransclude);

      //Now our tab is ready to be transcluded: both the tab heading area
      //and the tab content area are loaded.  Transclude 'em both.
      tab.$transcludeFn(tab.$parent, function(contents) {
        angular.forEach(contents, function(node) {
          if (isTabHeading(node)) {
            //Let tabHeadingTransclude know.
            tab.headingElement = node;
          } else {
            elm.append(node);
          }
        });
      });
    }
  };
  function isTabHeading(node) {
    return node.tagName &&  (
      node.hasAttribute('tab-heading') ||
      node.hasAttribute('data-tab-heading') ||
      node.tagName.toLowerCase() === 'tab-heading' ||
      node.tagName.toLowerCase() === 'data-tab-heading'
    );
  }
})

;

angular.module('ui.bootstrap.timepicker', [])

.constant('timepickerConfig', {
  hourStep: 1,
  minuteStep: 1,
  showMeridian: true,
  meridians: null,
  readonlyInput: false,
  mousewheel: true
})

.directive('timepicker', ['$parse', '$log', 'timepickerConfig', '$locale', function ($parse, $log, timepickerConfig, $locale) {
  return {
    restrict: 'EA',
    require:'?^ngModel',
    replace: true,
    scope: {},
    templateUrl: 'template/timepicker/timepicker.html',
    link: function(scope, element, attrs, ngModel) {
      if ( !ngModel ) {
        return; // do nothing if no ng-model
      }

      var selected = new Date(),
          meridians = angular.isDefined(attrs.meridians) ? scope.$parent.$eval(attrs.meridians) : timepickerConfig.meridians || $locale.DATETIME_FORMATS.AMPMS;

      var hourStep = timepickerConfig.hourStep;
      if (attrs.hourStep) {
        scope.$parent.$watch($parse(attrs.hourStep), function(value) {
          hourStep = parseInt(value, 10);
        });
      }

      var minuteStep = timepickerConfig.minuteStep;
      if (attrs.minuteStep) {
        scope.$parent.$watch($parse(attrs.minuteStep), function(value) {
          minuteStep = parseInt(value, 10);
        });
      }

      // 12H / 24H mode
      scope.showMeridian = timepickerConfig.showMeridian;
      if (attrs.showMeridian) {
        scope.$parent.$watch($parse(attrs.showMeridian), function(value) {
          scope.showMeridian = !!value;

          if ( ngModel.$error.time ) {
            // Evaluate from template
            var hours = getHoursFromTemplate(), minutes = getMinutesFromTemplate();
            if (angular.isDefined( hours ) && angular.isDefined( minutes )) {
              selected.setHours( hours );
              refresh();
            }
          } else {
            updateTemplate();
          }
        });
      }

      // Get scope.hours in 24H mode if valid
      function getHoursFromTemplate ( ) {
        var hours = parseInt( scope.hours, 10 );
        var valid = ( scope.showMeridian ) ? (hours > 0 && hours < 13) : (hours >= 0 && hours < 24);
        if ( !valid ) {
          return undefined;
        }

        if ( scope.showMeridian ) {
          if ( hours === 12 ) {
            hours = 0;
          }
          if ( scope.meridian === meridians[1] ) {
            hours = hours + 12;
          }
        }
        return hours;
      }

      function getMinutesFromTemplate() {
        var minutes = parseInt(scope.minutes, 10);
        return ( minutes >= 0 && minutes < 60 ) ? minutes : undefined;
      }

      function pad( value ) {
        return ( angular.isDefined(value) && value.toString().length < 2 ) ? '0' + value : value;
      }

      // Input elements
      var inputs = element.find('input'), hoursInputEl = inputs.eq(0), minutesInputEl = inputs.eq(1);

      // Respond on mousewheel spin
      var mousewheel = (angular.isDefined(attrs.mousewheel)) ? scope.$eval(attrs.mousewheel) : timepickerConfig.mousewheel;
      if ( mousewheel ) {

        var isScrollingUp = function(e) {
          if (e.originalEvent) {
            e = e.originalEvent;
          }
          //pick correct delta variable depending on event
          var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
          return (e.detail || delta > 0);
        };

        hoursInputEl.bind('mousewheel wheel', function(e) {
          scope.$apply( (isScrollingUp(e)) ? scope.incrementHours() : scope.decrementHours() );
          e.preventDefault();
        });

        minutesInputEl.bind('mousewheel wheel', function(e) {
          scope.$apply( (isScrollingUp(e)) ? scope.incrementMinutes() : scope.decrementMinutes() );
          e.preventDefault();
        });
      }

      scope.readonlyInput = (angular.isDefined(attrs.readonlyInput)) ? scope.$eval(attrs.readonlyInput) : timepickerConfig.readonlyInput;
      if ( ! scope.readonlyInput ) {

        var invalidate = function(invalidHours, invalidMinutes) {
          ngModel.$setViewValue( null );
          ngModel.$setValidity('time', false);
          if (angular.isDefined(invalidHours)) {
            scope.invalidHours = invalidHours;
          }
          if (angular.isDefined(invalidMinutes)) {
            scope.invalidMinutes = invalidMinutes;
          }
        };

        scope.updateHours = function() {
          var hours = getHoursFromTemplate();

          if ( angular.isDefined(hours) ) {
            selected.setHours( hours );
            refresh( 'h' );
          } else {
            invalidate(true);
          }
        };

        hoursInputEl.bind('blur', function(e) {
          if ( !scope.validHours && scope.hours < 10) {
            scope.$apply( function() {
              scope.hours = pad( scope.hours );
            });
          }
        });

        scope.updateMinutes = function() {
          var minutes = getMinutesFromTemplate();

          if ( angular.isDefined(minutes) ) {
            selected.setMinutes( minutes );
            refresh( 'm' );
          } else {
            invalidate(undefined, true);
          }
        };

        minutesInputEl.bind('blur', function(e) {
          if ( !scope.invalidMinutes && scope.minutes < 10 ) {
            scope.$apply( function() {
              scope.minutes = pad( scope.minutes );
            });
          }
        });
      } else {
        scope.updateHours = angular.noop;
        scope.updateMinutes = angular.noop;
      }

      ngModel.$render = function() {
        var date = ngModel.$modelValue ? new Date( ngModel.$modelValue ) : null;

        if ( isNaN(date) ) {
          ngModel.$setValidity('time', false);
          $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
        } else {
          if ( date ) {
            selected = date;
          }
          makeValid();
          updateTemplate();
        }
      };

      // Call internally when we know that model is valid.
      function refresh( keyboardChange ) {
        makeValid();
        ngModel.$setViewValue( new Date(selected) );
        updateTemplate( keyboardChange );
      }

      function makeValid() {
        ngModel.$setValidity('time', true);
        scope.invalidHours = false;
        scope.invalidMinutes = false;
      }

      function updateTemplate( keyboardChange ) {
        var hours = selected.getHours(), minutes = selected.getMinutes();

        if ( scope.showMeridian ) {
          hours = ( hours === 0 || hours === 12 ) ? 12 : hours % 12; // Convert 24 to 12 hour system
        }
        scope.hours =  keyboardChange === 'h' ? hours : pad(hours);
        scope.minutes = keyboardChange === 'm' ? minutes : pad(minutes);
        scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];
      }

      function addMinutes( minutes ) {
        var dt = new Date( selected.getTime() + minutes * 60000 );
        selected.setHours( dt.getHours(), dt.getMinutes() );
        refresh();
      }

      scope.incrementHours = function() {
        addMinutes( hourStep * 60 );
      };
      scope.decrementHours = function() {
        addMinutes( - hourStep * 60 );
      };
      scope.incrementMinutes = function() {
        addMinutes( minuteStep );
      };
      scope.decrementMinutes = function() {
        addMinutes( - minuteStep );
      };
      scope.toggleMeridian = function() {
        addMinutes( 12 * 60 * (( selected.getHours() < 12 ) ? 1 : -1) );
      };
    }
  };
}]);

angular.module('ui.bootstrap.typeahead', ['ui.bootstrap.position', 'ui.bootstrap.bindHtml'])

/**
 * A helper service that can parse typeahead's syntax (string provided by users)
 * Extracted to a separate service for ease of unit testing
 */
  .factory('typeaheadParser', ['$parse', function ($parse) {

  //                      00000111000000000000022200000000000000003333333333333330000000000044000
  var TYPEAHEAD_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;

  return {
    parse:function (input) {

      var match = input.match(TYPEAHEAD_REGEXP), modelMapper, viewMapper, source;
      if (!match) {
        throw new Error(
          "Expected typeahead specification in form of '_modelValue_ (as _label_)? for _item_ in _collection_'" +
            " but got '" + input + "'.");
      }

      return {
        itemName:match[3],
        source:$parse(match[4]),
        viewMapper:$parse(match[2] || match[1]),
        modelMapper:$parse(match[1])
      };
    }
  };
}])

  .directive('typeahead', ['$compile', '$parse', '$q', '$timeout', '$document', '$position', 'typeaheadParser',
    function ($compile, $parse, $q, $timeout, $document, $position, typeaheadParser) {

  var HOT_KEYS = [9, 13, 27, 38, 40];

  return {
    require:'ngModel',
    link:function (originalScope, element, attrs, modelCtrl) {

      //SUPPORTED ATTRIBUTES (OPTIONS)

      //minimal no of characters that needs to be entered before typeahead kicks-in
      var minSearch = originalScope.$eval(attrs.typeaheadMinLength) || 1;

      //minimal wait time after last character typed before typehead kicks-in
      var waitTime = originalScope.$eval(attrs.typeaheadWaitMs) || 0;

      //should it restrict model values to the ones selected from the popup only?
      var isEditable = originalScope.$eval(attrs.typeaheadEditable) !== false;

      //binding to a variable that indicates if matches are being retrieved asynchronously
      var isLoadingSetter = $parse(attrs.typeaheadLoading).assign || angular.noop;

      //a callback executed when a match is selected
      var onSelectCallback = $parse(attrs.typeaheadOnSelect);

      var inputFormatter = attrs.typeaheadInputFormatter ? $parse(attrs.typeaheadInputFormatter) : undefined;

      var appendToBody =  attrs.typeaheadAppendToBody ? $parse(attrs.typeaheadAppendToBody) : false;

      //INTERNAL VARIABLES

      //model setter executed upon match selection
      var $setModelValue = $parse(attrs.ngModel).assign;

      //expressions used by typeahead
      var parserResult = typeaheadParser.parse(attrs.typeahead);

      var hasFocus;

      //pop-up element used to display matches
      var popUpEl = angular.element('<div typeahead-popup></div>');
      popUpEl.attr({
        matches: 'matches',
        active: 'activeIdx',
        select: 'select(activeIdx)',
        query: 'query',
        position: 'position'
      });
      //custom item template
      if (angular.isDefined(attrs.typeaheadTemplateUrl)) {
        popUpEl.attr('template-url', attrs.typeaheadTemplateUrl);
      }

      //create a child scope for the typeahead directive so we are not polluting original scope
      //with typeahead-specific data (matches, query etc.)
      var scope = originalScope.$new();
      originalScope.$on('$destroy', function(){
        scope.$destroy();
      });

      var resetMatches = function() {
        scope.matches = [];
        scope.activeIdx = -1;
      };

      var getMatchesAsync = function(inputValue) {

        var locals = {$viewValue: inputValue};
        isLoadingSetter(originalScope, true);
        $q.when(parserResult.source(originalScope, locals)).then(function(matches) {

          //it might happen that several async queries were in progress if a user were typing fast
          //but we are interested only in responses that correspond to the current view value
          if (inputValue === modelCtrl.$viewValue && hasFocus) {
            if (matches.length > 0) {

              scope.activeIdx = 0;
              scope.matches.length = 0;

              //transform labels
              for(var i=0; i<matches.length; i++) {
                locals[parserResult.itemName] = matches[i];
                scope.matches.push({
                  label: parserResult.viewMapper(scope, locals),
                  model: matches[i]
                });
              }

              scope.query = inputValue;
              //position pop-up with matches - we need to re-calculate its position each time we are opening a window
              //with matches as a pop-up might be absolute-positioned and position of an input might have changed on a page
              //due to other elements being rendered
              scope.position = appendToBody ? $position.offset(element) : $position.position(element);
              scope.position.top = scope.position.top + element.prop('offsetHeight');

            } else {
              resetMatches();
            }
            isLoadingSetter(originalScope, false);
          }
        }, function(){
          resetMatches();
          isLoadingSetter(originalScope, false);
        });
      };

      resetMatches();

      //we need to propagate user's query so we can higlight matches
      scope.query = undefined;

      //Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later 
      var timeoutPromise;

      //plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
      //$parsers kick-in on all the changes coming from the view as well as manually triggered by $setViewValue
      modelCtrl.$parsers.unshift(function (inputValue) {

        hasFocus = true;

        if (inputValue && inputValue.length >= minSearch) {
          if (waitTime > 0) {
            if (timeoutPromise) {
              $timeout.cancel(timeoutPromise);//cancel previous timeout
            }
            timeoutPromise = $timeout(function () {
              getMatchesAsync(inputValue);
            }, waitTime);
          } else {
            getMatchesAsync(inputValue);
          }
        } else {
          isLoadingSetter(originalScope, false);
          resetMatches();
        }

        if (isEditable) {
          return inputValue;
        } else {
          if (!inputValue) {
            // Reset in case user had typed something previously.
            modelCtrl.$setValidity('editable', true);
            return inputValue;
          } else {
            modelCtrl.$setValidity('editable', false);
            return undefined;
          }
        }
      });

      modelCtrl.$formatters.push(function (modelValue) {

        var candidateViewValue, emptyViewValue;
        var locals = {};

        if (inputFormatter) {

          locals['$model'] = modelValue;
          return inputFormatter(originalScope, locals);

        } else {

          //it might happen that we don't have enough info to properly render input value
          //we need to check for this situation and simply return model value if we can't apply custom formatting
          locals[parserResult.itemName] = modelValue;
          candidateViewValue = parserResult.viewMapper(originalScope, locals);
          locals[parserResult.itemName] = undefined;
          emptyViewValue = parserResult.viewMapper(originalScope, locals);

          return candidateViewValue!== emptyViewValue ? candidateViewValue : modelValue;
        }
      });

      scope.select = function (activeIdx) {
        //called from within the $digest() cycle
        var locals = {};
        var model, item;

        locals[parserResult.itemName] = item = scope.matches[activeIdx].model;
        model = parserResult.modelMapper(originalScope, locals);
        $setModelValue(originalScope, model);
        modelCtrl.$setValidity('editable', true);

        onSelectCallback(originalScope, {
          $item: item,
          $model: model,
          $label: parserResult.viewMapper(originalScope, locals)
        });

        resetMatches();

        //return focus to the input element if a mach was selected via a mouse click event
        element[0].focus();
      };

      //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
      element.bind('keydown', function (evt) {

        //typeahead is open and an "interesting" key was pressed
        if (scope.matches.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
          return;
        }

        evt.preventDefault();

        if (evt.which === 40) {
          scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length;
          scope.$digest();

        } else if (evt.which === 38) {
          scope.activeIdx = (scope.activeIdx ? scope.activeIdx : scope.matches.length) - 1;
          scope.$digest();

        } else if (evt.which === 13 || evt.which === 9) {
          scope.$apply(function () {
            scope.select(scope.activeIdx);
          });

        } else if (evt.which === 27) {
          evt.stopPropagation();

          resetMatches();
          scope.$digest();
        }
      });

      element.bind('blur', function (evt) {
        hasFocus = false;
      });

      // Keep reference to click handler to unbind it.
      var dismissClickHandler = function (evt) {
        if (element[0] !== evt.target) {
          resetMatches();
          scope.$digest();
        }
      };

      $document.bind('click', dismissClickHandler);

      originalScope.$on('$destroy', function(){
        $document.unbind('click', dismissClickHandler);
      });

      var $popup = $compile(popUpEl)(scope);
      if ( appendToBody ) {
        $document.find('body').append($popup);
      } else {
        element.after($popup);
      }
    }
  };

}])

  .directive('typeaheadPopup', function () {
    return {
      restrict:'EA',
      scope:{
        matches:'=',
        query:'=',
        active:'=',
        position:'=',
        select:'&'
      },
      replace:true,
      templateUrl:'template/typeahead/typeahead-popup.html',
      link:function (scope, element, attrs) {

        scope.templateUrl = attrs.templateUrl;

        scope.isOpen = function () {
          return scope.matches.length > 0;
        };

        scope.isActive = function (matchIdx) {
          return scope.active == matchIdx;
        };

        scope.selectActive = function (matchIdx) {
          scope.active = matchIdx;
        };

        scope.selectMatch = function (activeIdx) {
          scope.select({activeIdx:activeIdx});
        };
      }
    };
  })

  .directive('typeaheadMatch', ['$http', '$templateCache', '$compile', '$parse', function ($http, $templateCache, $compile, $parse) {
    return {
      restrict:'EA',
      scope:{
        index:'=',
        match:'=',
        query:'='
      },
      link:function (scope, element, attrs) {
        var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || 'template/typeahead/typeahead-match.html';
        $http.get(tplUrl, {cache: $templateCache}).success(function(tplContent){
           element.replaceWith($compile(tplContent.trim())(scope));
        });
      }
    };
  }])

  .filter('typeaheadHighlight', function() {

    function escapeRegexp(queryToEscape) {
      return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    }

    return function(matchItem, query) {
      return query ? matchItem.replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem;
    };
  });
angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/accordion/accordion-group.html",
    "<div class=\"panel panel-default\">\n" +
    "  <div class=\"panel-heading\">\n" +
    "    <h4 class=\"panel-title\">\n" +
    "      <a class=\"accordion-toggle\" ng-click=\"isOpen = !isOpen\" accordion-transclude=\"heading\">{{heading}}</a>\n" +
    "    </h4>\n" +
    "  </div>\n" +
    "  <div class=\"panel-collapse\" collapse=\"!isOpen\">\n" +
    "	  <div class=\"panel-body\" ng-transclude></div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("template/accordion/accordion.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/accordion/accordion.html",
    "<div class=\"panel-group\" ng-transclude></div>");
}]);

angular.module("template/alert/alert.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/alert/alert.html",
    "<div class='alert' ng-class='\"alert-\" + (type || \"warning\")'>\n" +
    "    <button ng-show='closeable' type='button' class='close' ng-click='close()'>&times;</button>\n" +
    "    <div ng-transclude></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/carousel/carousel.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/carousel/carousel.html",
    "<div ng-mouseenter=\"pause()\" ng-mouseleave=\"play()\" class=\"carousel\">\n" +
    "    <ol class=\"carousel-indicators\" ng-show=\"slides().length > 1\">\n" +
    "        <li ng-repeat=\"slide in slides()\" ng-class=\"{active: isActive(slide)}\" ng-click=\"select(slide)\"></li>\n" +
    "    </ol>\n" +
    "    <div class=\"carousel-inner\" ng-transclude></div>\n" +
    "    <a class=\"left carousel-control\" ng-click=\"prev()\" ng-show=\"slides().length > 1\"><span class=\"icon-prev\"></span></a>\n" +
    "    <a class=\"right carousel-control\" ng-click=\"next()\" ng-show=\"slides().length > 1\"><span class=\"icon-next\"></span></a>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/carousel/slide.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/carousel/slide.html",
    "<div ng-class=\"{\n" +
    "    'active': leaving || (active && !entering),\n" +
    "    'prev': (next || active) && direction=='prev',\n" +
    "    'next': (next || active) && direction=='next',\n" +
    "    'right': direction=='prev',\n" +
    "    'left': direction=='next'\n" +
    "  }\" class=\"item text-center\" ng-transclude></div>\n" +
    "");
}]);

angular.module("template/datepicker/datepicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/datepicker/datepicker.html",
    "<table>\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
    "      <th colspan=\"{{rows[0].length - 2 + showWeekNumbers}}\"><button type=\"button\" class=\"btn btn-default btn-sm btn-block\" ng-click=\"toggleMode()\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
    "    </tr>\n" +
    "    <tr ng-show=\"labels.length > 0\" class=\"h6\">\n" +
    "      <th ng-show=\"showWeekNumbers\" class=\"text-center\">#</th>\n" +
    "      <th ng-repeat=\"label in labels\" class=\"text-center\">{{label}}</th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr ng-repeat=\"row in rows\">\n" +
    "      <td ng-show=\"showWeekNumbers\" class=\"text-center\"><em>{{ getWeekNumber(row) }}</em></td>\n" +
    "      <td ng-repeat=\"dt in row\" class=\"text-center\">\n" +
    "        <button type=\"button\" style=\"width:100%;\" class=\"btn btn-default btn-sm\" ng-class=\"{'btn-info': dt.selected}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\"><span ng-class=\"{'text-muted': dt.secondary}\">{{dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
}]);

angular.module("template/datepicker/popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/datepicker/popup.html",
    "<ul class=\"dropdown-menu\" ng-style=\"{display: (isOpen && 'block') || 'none', top: position.top+'px', left: position.left+'px'}\">\n" +
    "	<li ng-transclude></li>\n" +
    "	<li ng-show=\"showButtonBar\" style=\"padding:10px 9px 2px\">\n" +
    "		<span class=\"btn-group\">\n" +
    "			<button type=\"button\" class=\"btn btn-sm btn-info\" ng-click=\"today()\">{{currentText}}</button>\n" +
    "			<button type=\"button\" class=\"btn btn-sm btn-default\" ng-click=\"showWeeks = ! showWeeks\" ng-class=\"{active: showWeeks}\">{{toggleWeeksText}}</button>\n" +
    "			<button type=\"button\" class=\"btn btn-sm btn-danger\" ng-click=\"clear()\">{{clearText}}</button>\n" +
    "		</span>\n" +
    "		<button type=\"button\" class=\"btn btn-sm btn-success pull-right\" ng-click=\"isOpen = false\">{{closeText}}</button>\n" +
    "	</li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("template/modal/backdrop.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/modal/backdrop.html",
    "<div class=\"modal-backdrop fade\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 1040 + index*10}\"></div>");
}]);

angular.module("template/modal/window.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/modal/window.html",
    "<div tabindex=\"-1\" class=\"modal fade {{ windowClass }}\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 1050 + index*10, display: 'block'}\" ng-click=\"close($event)\">\n" +
    "    <div class=\"modal-dialog\"><div class=\"modal-content\" ng-transclude></div></div>\n" +
    "</div>");
}]);

angular.module("template/pagination/pager.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/pagination/pager.html",
    "<ul class=\"pager\">\n" +
    "  <li ng-repeat=\"page in pages\" ng-class=\"{disabled: page.disabled, previous: page.previous, next: page.next}\"><a ng-click=\"selectPage(page.number)\">{{page.text}}</a></li>\n" +
    "</ul>");
}]);

angular.module("template/pagination/pagination.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/pagination/pagination.html",
    "<ul class=\"pagination\">\n" +
    "  <li ng-repeat=\"page in pages\" ng-class=\"{active: page.active, disabled: page.disabled}\"><a ng-click=\"selectPage(page.number)\">{{page.text}}</a></li>\n" +
    "</ul>");
}]);

angular.module("template/tooltip/tooltip-html-unsafe-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/tooltip/tooltip-html-unsafe-popup.html",
    "<div class=\"tooltip {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
    "  <div class=\"tooltip-arrow\"></div>\n" +
    "  <div class=\"tooltip-inner\" bind-html-unsafe=\"content\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/tooltip/tooltip-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/tooltip/tooltip-popup.html",
    "<div class=\"tooltip {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
    "  <div class=\"tooltip-arrow\"></div>\n" +
    "  <div class=\"tooltip-inner\" ng-bind=\"content\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/popover/popover.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/popover/popover.html",
    "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
    "  <div class=\"arrow\"></div>\n" +
    "\n" +
    "  <div class=\"popover-inner\">\n" +
    "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-show=\"title\"></h3>\n" +
    "      <div class=\"popover-content\" ng-bind=\"content\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/progressbar/bar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/progressbar/bar.html",
    "<div class=\"progress-bar\" ng-class=\"type && 'progress-bar-' + type\" ng-transclude></div>");
}]);

angular.module("template/progressbar/progress.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/progressbar/progress.html",
    "<div class=\"progress\" ng-transclude></div>");
}]);

angular.module("template/progressbar/progressbar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/progressbar/progressbar.html",
    "<div class=\"progress\"><div class=\"progress-bar\" ng-class=\"type && 'progress-bar-' + type\" ng-transclude></div></div>");
}]);

angular.module("template/rating/rating.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/rating/rating.html",
    "<span ng-mouseleave=\"reset()\">\n" +
    "    <i ng-repeat=\"r in range\" ng-mouseenter=\"enter($index + 1)\" ng-click=\"rate($index + 1)\" class=\"glyphicon\" ng-class=\"$index < val && (r.stateOn || 'glyphicon-star') || (r.stateOff || 'glyphicon-star-empty')\"></i>\n" +
    "</span>");
}]);

angular.module("template/tabs/tab.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/tabs/tab.html",
    "<li ng-class=\"{active: active, disabled: disabled}\">\n" +
    "  <a ng-click=\"select()\" tab-heading-transclude>{{heading}}</a>\n" +
    "</li>\n" +
    "");
}]);

angular.module("template/tabs/tabset-titles.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/tabs/tabset-titles.html",
    "<ul class=\"nav {{type && 'nav-' + type}}\" ng-class=\"{'nav-stacked': vertical}\">\n" +
    "</ul>\n" +
    "");
}]);

angular.module("template/tabs/tabset.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/tabs/tabset.html",
    "\n" +
    "<div class=\"tabbable\">\n" +
    "  <ul class=\"nav {{type && 'nav-' + type}}\" ng-class=\"{'nav-stacked': vertical, 'nav-justified': justified}\" ng-transclude></ul>\n" +
    "  <div class=\"tab-content\">\n" +
    "    <div class=\"tab-pane\" \n" +
    "         ng-repeat=\"tab in tabs\" \n" +
    "         ng-class=\"{active: tab.active}\"\n" +
    "         tab-content-transclude=\"tab\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/timepicker/timepicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/timepicker/timepicker.html",
    "<table>\n" +
    "	<tbody>\n" +
    "		<tr class=\"text-center\">\n" +
    "			<td><a ng-click=\"incrementHours()\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
    "			<td>&nbsp;</td>\n" +
    "			<td><a ng-click=\"incrementMinutes()\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
    "			<td ng-show=\"showMeridian\"></td>\n" +
    "		</tr>\n" +
    "		<tr>\n" +
    "			<td style=\"width:50px;\" class=\"form-group\" ng-class=\"{'has-error': invalidHours}\">\n" +
    "				<input type=\"text\" ng-model=\"hours\" ng-change=\"updateHours()\" class=\"form-control text-center\" ng-mousewheel=\"incrementHours()\" ng-readonly=\"readonlyInput\" maxlength=\"2\">\n" +
    "			</td>\n" +
    "			<td>:</td>\n" +
    "			<td style=\"width:50px;\" class=\"form-group\" ng-class=\"{'has-error': invalidMinutes}\">\n" +
    "				<input type=\"text\" ng-model=\"minutes\" ng-change=\"updateMinutes()\" class=\"form-control text-center\" ng-readonly=\"readonlyInput\" maxlength=\"2\">\n" +
    "			</td>\n" +
    "			<td ng-show=\"showMeridian\"><button type=\"button\" class=\"btn btn-default text-center\" ng-click=\"toggleMeridian()\">{{meridian}}</button></td>\n" +
    "		</tr>\n" +
    "		<tr class=\"text-center\">\n" +
    "			<td><a ng-click=\"decrementHours()\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
    "			<td>&nbsp;</td>\n" +
    "			<td><a ng-click=\"decrementMinutes()\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
    "			<td ng-show=\"showMeridian\"></td>\n" +
    "		</tr>\n" +
    "	</tbody>\n" +
    "</table>\n" +
    "");
}]);

angular.module("template/typeahead/typeahead-match.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/typeahead/typeahead-match.html",
    "<a tabindex=\"-1\" bind-html-unsafe=\"match.label | typeaheadHighlight:query\"></a>");
}]);

angular.module("template/typeahead/typeahead-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/typeahead/typeahead-popup.html",
    "<ul class=\"dropdown-menu\" ng-style=\"{display: isOpen()&&'block' || 'none', top: position.top+'px', left: position.left+'px'}\">\n" +
    "    <li ng-repeat=\"match in matches\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\" ng-click=\"selectMatch($index)\">\n" +
    "        <div typeahead-match index=\"$index\" match=\"match\" query=\"query\" template-url=\"templateUrl\"></div>\n" +
    "    </li>\n" +
    "</ul>");
}]);

},{}],3:[function(require,module,exports){
/**
 * @license AngularJS v1.2.11-build.2186+sha.766b3d5
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/**
 * @ngdoc overview
 * @name ngRoute
 * @description
 *
 * # ngRoute
 *
 * The `ngRoute` module provides routing and deeplinking services and directives for angular apps.
 *
 * ## Example
 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
 * 
 * {@installModule route}
 *
 * <div doc-module-components="ngRoute"></div>
 */
 /* global -ngRouteModule */
var ngRouteModule = angular.module('ngRoute', ['ng']).
                        provider('$route', $RouteProvider);

/**
 * @ngdoc object
 * @name ngRoute.$routeProvider
 * @function
 *
 * @description
 *
 * Used for configuring routes.
 * 
 * ## Example
 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
 *
 * ## Dependencies
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 */
function $RouteProvider(){
  function inherit(parent, extra) {
    return angular.extend(new (angular.extend(function() {}, {prototype:parent}))(), extra);
  }

  var routes = {};

  /**
   * @ngdoc method
   * @name ngRoute.$routeProvider#when
   * @methodOf ngRoute.$routeProvider
   *
   * @param {string} path Route path (matched against `$location.path`). If `$location.path`
   *    contains redundant trailing slash or is missing one, the route will still match and the
   *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
   *    route definition.
   *
   *      * `path` can contain named groups starting with a colon: e.g. `:name`. All characters up
   *        to the next slash are matched and stored in `$routeParams` under the given `name`
   *        when the route matches.
   *      * `path` can contain named groups starting with a colon and ending with a star:
   *        e.g.`:name*`. All characters are eagerly stored in `$routeParams` under the given `name`
   *        when the route matches.
   *      * `path` can contain optional named groups with a question mark: e.g.`:name?`.
   *
   *    For example, routes like `/color/:color/largecode/:largecode*\/edit` will match
   *    `/color/brown/largecode/code/with/slashs/edit` and extract:
   *
   *      * `color: brown`
   *      * `largecode: code/with/slashs`.
   *
   *
   * @param {Object} route Mapping information to be assigned to `$route.current` on route
   *    match.
   *
   *    Object properties:
   *
   *    - `controller` – `{(string|function()=}` – Controller fn that should be associated with
   *      newly created scope or the name of a {@link angular.Module#controller registered
   *      controller} if passed as a string.
   *    - `controllerAs` – `{string=}` – A controller alias name. If present the controller will be
   *      published to scope under the `controllerAs` name.
   *    - `template` – `{string=|function()=}` – html template as a string or a function that
   *      returns an html template as a string which should be used by {@link
   *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
   *      This property takes precedence over `templateUrl`.
   *
   *      If `template` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *    - `templateUrl` – `{string=|function()=}` – path or function that returns a path to an html
   *      template that should be used by {@link ngRoute.directive:ngView ngView}.
   *
   *      If `templateUrl` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
   *      be injected into the controller. If any of these dependencies are promises, the router
   *      will wait for them all to be resolved or one to be rejected before the controller is
   *      instantiated.
   *      If all the promises are resolved successfully, the values of the resolved promises are
   *      injected and {@link ngRoute.$route#$routeChangeSuccess $routeChangeSuccess} event is
   *      fired. If any of the promises are rejected the
   *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event is fired. The map object
   *      is:
   *
   *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
   *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
   *        Otherwise if function, then it is {@link api/AUTO.$injector#invoke injected}
   *        and the return value is treated as the dependency. If the result is a promise, it is
   *        resolved before its value is injected into the controller. Be aware that
   *        `ngRoute.$routeParams` will still refer to the previous route within these resolve
   *        functions.  Use `$route.current.params` to access the new route parameters, instead.
   *
   *    - `redirectTo` – {(string|function())=} – value to update
   *      {@link ng.$location $location} path with and trigger route redirection.
   *
   *      If `redirectTo` is a function, it will be called with the following parameters:
   *
   *      - `{Object.<string>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route templateUrl.
   *      - `{string}` - current `$location.path()`
   *      - `{Object}` - current `$location.search()`
   *
   *      The custom `redirectTo` function is expected to return a string which will be used
   *      to update `$location.path()` and `$location.search()`.
   *
   *    - `[reloadOnSearch=true]` - {boolean=} - reload route when only `$location.search()`
   *      or `$location.hash()` changes.
   *
   *      If the option is set to `false` and url in the browser changes, then
   *      `$routeUpdate` event is broadcasted on the root scope.
   *
   *    - `[caseInsensitiveMatch=false]` - {boolean=} - match routes without being case sensitive
   *
   *      If the option is set to `true`, then the particular route can be matched without being
   *      case sensitive
   *
   * @returns {Object} self
   *
   * @description
   * Adds a new route definition to the `$route` service.
   */
  this.when = function(path, route) {
    routes[path] = angular.extend(
      {reloadOnSearch: true},
      route,
      path && pathRegExp(path, route)
    );

    // create redirection for trailing slashes
    if (path) {
      var redirectPath = (path[path.length-1] == '/')
            ? path.substr(0, path.length-1)
            : path +'/';

      routes[redirectPath] = angular.extend(
        {redirectTo: path},
        pathRegExp(redirectPath, route)
      );
    }

    return this;
  };

   /**
    * @param path {string} path
    * @param opts {Object} options
    * @return {?Object}
    *
    * @description
    * Normalizes the given path, returning a regular expression
    * and the original path.
    *
    * Inspired by pathRexp in visionmedia/express/lib/utils.js.
    */
  function pathRegExp(path, opts) {
    var insensitive = opts.caseInsensitiveMatch,
        ret = {
          originalPath: path,
          regexp: path
        },
        keys = ret.keys = [];

    path = path
      .replace(/([().])/g, '\\$1')
      .replace(/(\/)?:(\w+)([\?\*])?/g, function(_, slash, key, option){
        var optional = option === '?' ? option : null;
        var star = option === '*' ? option : null;
        keys.push({ name: key, optional: !!optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (star && '(.+?)' || '([^/]+)')
          + (optional || '')
          + ')'
          + (optional || '');
      })
      .replace(/([\/$\*])/g, '\\$1');

    ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
    return ret;
  }

  /**
   * @ngdoc method
   * @name ngRoute.$routeProvider#otherwise
   * @methodOf ngRoute.$routeProvider
   *
   * @description
   * Sets route definition that will be used on route change when no other route definition
   * is matched.
   *
   * @param {Object} params Mapping information to be assigned to `$route.current`.
   * @returns {Object} self
   */
  this.otherwise = function(params) {
    this.when(null, params);
    return this;
  };


  this.$get = ['$rootScope',
               '$location',
               '$routeParams',
               '$q',
               '$injector',
               '$http',
               '$templateCache',
               '$sce',
      function($rootScope, $location, $routeParams, $q, $injector, $http, $templateCache, $sce) {

    /**
     * @ngdoc object
     * @name ngRoute.$route
     * @requires $location
     * @requires $routeParams
     *
     * @property {Object} current Reference to the current route definition.
     * The route definition contains:
     *
     *   - `controller`: The controller constructor as define in route definition.
     *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for
     *     controller instantiation. The `locals` contain
     *     the resolved values of the `resolve` map. Additionally the `locals` also contain:
     *
     *     - `$scope` - The current route scope.
     *     - `$template` - The current route template HTML.
     *
     * @property {Array.<Object>} routes Array of all configured routes.
     *
     * @description
     * `$route` is used for deep-linking URLs to controllers and views (HTML partials).
     * It watches `$location.url()` and tries to map the path to an existing route definition.
     *
     * Requires the {@link ngRoute `ngRoute`} module to be installed.
     *
     * You can define routes through {@link ngRoute.$routeProvider $routeProvider}'s API.
     *
     * The `$route` service is typically used in conjunction with the
     * {@link ngRoute.directive:ngView `ngView`} directive and the
     * {@link ngRoute.$routeParams `$routeParams`} service.
     *
     * @example
       This example shows how changing the URL hash causes the `$route` to match a route against the
       URL, and the `ngView` pulls in the partial.

       Note that this example is using {@link ng.directive:script inlined templates}
       to get it working on jsfiddle as well.

     <example module="ngViewExample" deps="angular-route.js">
       <file name="index.html">
         <div ng-controller="MainCntl">
           Choose:
           <a href="Book/Moby">Moby</a> |
           <a href="Book/Moby/ch/1">Moby: Ch1</a> |
           <a href="Book/Gatsby">Gatsby</a> |
           <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
           <a href="Book/Scarlet">Scarlet Letter</a><br/>

           <div ng-view></div>
           <hr />

           <pre>$location.path() = {{$location.path()}}</pre>
           <pre>$route.current.templateUrl = {{$route.current.templateUrl}}</pre>
           <pre>$route.current.params = {{$route.current.params}}</pre>
           <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>
           <pre>$routeParams = {{$routeParams}}</pre>
         </div>
       </file>

       <file name="book.html">
         controller: {{name}}<br />
         Book Id: {{params.bookId}}<br />
       </file>

       <file name="chapter.html">
         controller: {{name}}<br />
         Book Id: {{params.bookId}}<br />
         Chapter Id: {{params.chapterId}}
       </file>

       <file name="script.js">
         angular.module('ngViewExample', ['ngRoute'])

         .config(function($routeProvider, $locationProvider) {
           $routeProvider.when('/Book/:bookId', {
             templateUrl: 'book.html',
             controller: BookCntl,
             resolve: {
               // I will cause a 1 second delay
               delay: function($q, $timeout) {
                 var delay = $q.defer();
                 $timeout(delay.resolve, 1000);
                 return delay.promise;
               }
             }
           });
           $routeProvider.when('/Book/:bookId/ch/:chapterId', {
             templateUrl: 'chapter.html',
             controller: ChapterCntl
           });

           // configure html5 to get links working on jsfiddle
           $locationProvider.html5Mode(true);
         });

         function MainCntl($scope, $route, $routeParams, $location) {
           $scope.$route = $route;
           $scope.$location = $location;
           $scope.$routeParams = $routeParams;
         }

         function BookCntl($scope, $routeParams) {
           $scope.name = "BookCntl";
           $scope.params = $routeParams;
         }

         function ChapterCntl($scope, $routeParams) {
           $scope.name = "ChapterCntl";
           $scope.params = $routeParams;
         }
       </file>

       <file name="scenario.js">
         it('should load and compile correct template', function() {
           element('a:contains("Moby: Ch1")').click();
           var content = element('.doc-example-live [ng-view]').text();
           expect(content).toMatch(/controller\: ChapterCntl/);
           expect(content).toMatch(/Book Id\: Moby/);
           expect(content).toMatch(/Chapter Id\: 1/);

           element('a:contains("Scarlet")').click();
           sleep(2); // promises are not part of scenario waiting
           content = element('.doc-example-live [ng-view]').text();
           expect(content).toMatch(/controller\: BookCntl/);
           expect(content).toMatch(/Book Id\: Scarlet/);
         });
       </file>
     </example>
     */

    /**
     * @ngdoc event
     * @name ngRoute.$route#$routeChangeStart
     * @eventOf ngRoute.$route
     * @eventType broadcast on root scope
     * @description
     * Broadcasted before a route change. At this  point the route services starts
     * resolving all of the dependencies needed for the route change to occur.
     * Typically this involves fetching the view template as well as any dependencies
     * defined in `resolve` route property. Once  all of the dependencies are resolved
     * `$routeChangeSuccess` is fired.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} next Future route information.
     * @param {Route} current Current route information.
     */

    /**
     * @ngdoc event
     * @name ngRoute.$route#$routeChangeSuccess
     * @eventOf ngRoute.$route
     * @eventType broadcast on root scope
     * @description
     * Broadcasted after a route dependencies are resolved.
     * {@link ngRoute.directive:ngView ngView} listens for the directive
     * to instantiate the controller and render the view.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} current Current route information.
     * @param {Route|Undefined} previous Previous route information, or undefined if current is
     * first route entered.
     */

    /**
     * @ngdoc event
     * @name ngRoute.$route#$routeChangeError
     * @eventOf ngRoute.$route
     * @eventType broadcast on root scope
     * @description
     * Broadcasted if any of the resolve promises are rejected.
     *
     * @param {Object} angularEvent Synthetic event object
     * @param {Route} current Current route information.
     * @param {Route} previous Previous route information.
     * @param {Route} rejection Rejection of the promise. Usually the error of the failed promise.
     */

    /**
     * @ngdoc event
     * @name ngRoute.$route#$routeUpdate
     * @eventOf ngRoute.$route
     * @eventType broadcast on root scope
     * @description
     *
     * The `reloadOnSearch` property has been set to false, and we are reusing the same
     * instance of the Controller.
     */

    var forceReload = false,
        $route = {
          routes: routes,

          /**
           * @ngdoc method
           * @name ngRoute.$route#reload
           * @methodOf ngRoute.$route
           *
           * @description
           * Causes `$route` service to reload the current route even if
           * {@link ng.$location $location} hasn't changed.
           *
           * As a result of that, {@link ngRoute.directive:ngView ngView}
           * creates new scope, reinstantiates the controller.
           */
          reload: function() {
            forceReload = true;
            $rootScope.$evalAsync(updateRoute);
          }
        };

    $rootScope.$on('$locationChangeSuccess', updateRoute);

    return $route;

    /////////////////////////////////////////////////////

    /**
     * @param on {string} current url
     * @param route {Object} route regexp to match the url against
     * @return {?Object}
     *
     * @description
     * Check if the route matches the current url.
     *
     * Inspired by match in
     * visionmedia/express/lib/router/router.js.
     */
    function switchRouteMatcher(on, route) {
      var keys = route.keys,
          params = {};

      if (!route.regexp) return null;

      var m = route.regexp.exec(on);
      if (!m) return null;

      for (var i = 1, len = m.length; i < len; ++i) {
        var key = keys[i - 1];

        var val = 'string' == typeof m[i]
              ? decodeURIComponent(m[i])
              : m[i];

        if (key && val) {
          params[key.name] = val;
        }
      }
      return params;
    }

    function updateRoute() {
      var next = parseRoute(),
          last = $route.current;

      if (next && last && next.$$route === last.$$route
          && angular.equals(next.pathParams, last.pathParams)
          && !next.reloadOnSearch && !forceReload) {
        last.params = next.params;
        angular.copy(last.params, $routeParams);
        $rootScope.$broadcast('$routeUpdate', last);
      } else if (next || last) {
        forceReload = false;
        $rootScope.$broadcast('$routeChangeStart', next, last);
        $route.current = next;
        if (next) {
          if (next.redirectTo) {
            if (angular.isString(next.redirectTo)) {
              $location.path(interpolate(next.redirectTo, next.params)).search(next.params)
                       .replace();
            } else {
              $location.url(next.redirectTo(next.pathParams, $location.path(), $location.search()))
                       .replace();
            }
          }
        }

        $q.when(next).
          then(function() {
            if (next) {
              var locals = angular.extend({}, next.resolve),
                  template, templateUrl;

              angular.forEach(locals, function(value, key) {
                locals[key] = angular.isString(value) ?
                    $injector.get(value) : $injector.invoke(value);
              });

              if (angular.isDefined(template = next.template)) {
                if (angular.isFunction(template)) {
                  template = template(next.params);
                }
              } else if (angular.isDefined(templateUrl = next.templateUrl)) {
                if (angular.isFunction(templateUrl)) {
                  templateUrl = templateUrl(next.params);
                }
                templateUrl = $sce.getTrustedResourceUrl(templateUrl);
                if (angular.isDefined(templateUrl)) {
                  next.loadedTemplateUrl = templateUrl;
                  template = $http.get(templateUrl, {cache: $templateCache}).
                      then(function(response) { return response.data; });
                }
              }
              if (angular.isDefined(template)) {
                locals['$template'] = template;
              }
              return $q.all(locals);
            }
          }).
          // after route change
          then(function(locals) {
            if (next == $route.current) {
              if (next) {
                next.locals = locals;
                angular.copy(next.params, $routeParams);
              }
              $rootScope.$broadcast('$routeChangeSuccess', next, last);
            }
          }, function(error) {
            if (next == $route.current) {
              $rootScope.$broadcast('$routeChangeError', next, last, error);
            }
          });
      }
    }


    /**
     * @returns the current active route, by matching it against the URL
     */
    function parseRoute() {
      // Match a route
      var params, match;
      angular.forEach(routes, function(route, path) {
        if (!match && (params = switchRouteMatcher($location.path(), route))) {
          match = inherit(route, {
            params: angular.extend({}, $location.search(), params),
            pathParams: params});
          match.$$route = route;
        }
      });
      // No route matched; fallback to "otherwise" route
      return match || routes[null] && inherit(routes[null], {params: {}, pathParams:{}});
    }

    /**
     * @returns interpolation of the redirect path with the parameters
     */
    function interpolate(string, params) {
      var result = [];
      angular.forEach((string||'').split(':'), function(segment, i) {
        if (i === 0) {
          result.push(segment);
        } else {
          var segmentMatch = segment.match(/(\w+)(.*)/);
          var key = segmentMatch[1];
          result.push(params[key]);
          result.push(segmentMatch[2] || '');
          delete params[key];
        }
      });
      return result.join('');
    }
  }];
}

ngRouteModule.provider('$routeParams', $RouteParamsProvider);


/**
 * @ngdoc object
 * @name ngRoute.$routeParams
 * @requires $route
 *
 * @description
 * The `$routeParams` service allows you to retrieve the current set of route parameters.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * The route parameters are a combination of {@link ng.$location `$location`}'s
 * {@link ng.$location#methods_search `search()`} and {@link ng.$location#methods_path `path()`}.
 * The `path` parameters are extracted when the {@link ngRoute.$route `$route`} path is matched.
 *
 * In case of parameter name collision, `path` params take precedence over `search` params.
 *
 * The service guarantees that the identity of the `$routeParams` object will remain unchanged
 * (but its properties will likely change) even when a route change occurs.
 *
 * Note that the `$routeParams` are only updated *after* a route change completes successfully.
 * This means that you cannot rely on `$routeParams` being correct in route resolve functions.
 * Instead you can use `$route.current.params` to access the new route's parameters.
 *
 * @example
 * <pre>
 *  // Given:
 *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby
 *  // Route: /Chapter/:chapterId/Section/:sectionId
 *  //
 *  // Then
 *  $routeParams ==> {chapterId:1, sectionId:2, search:'moby'}
 * </pre>
 */
function $RouteParamsProvider() {
  this.$get = function() { return {}; };
}

ngRouteModule.directive('ngView', ngViewFactory);
ngRouteModule.directive('ngView', ngViewFillContentFactory);


/**
 * @ngdoc directive
 * @name ngRoute.directive:ngView
 * @restrict ECA
 *
 * @description
 * # Overview
 * `ngView` is a directive that complements the {@link ngRoute.$route $route} service by
 * including the rendered template of the current route into the main layout (`index.html`) file.
 * Every time the current route changes, the included view changes with it according to the
 * configuration of the `$route` service.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * @animations
 * enter - animation is used to bring new content into the browser.
 * leave - animation is used to animate existing content away.
 *
 * The enter and leave animation occur concurrently.
 *
 * @scope
 * @priority 400
 * @param {string=} onload Expression to evaluate whenever the view updates.
 *
 * @param {string=} autoscroll Whether `ngView` should call {@link ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the view is updated.
 *
 *                  - If the attribute is not set, disable scrolling.
 *                  - If the attribute is set without value, enable scrolling.
 *                  - Otherwise enable scrolling only if the `autoscroll` attribute value evaluated
 *                    as an expression yields a truthy value.
 * @example
    <example module="ngViewExample" deps="angular-route.js" animations="true">
      <file name="index.html">
        <div ng-controller="MainCntl as main">
          Choose:
          <a href="Book/Moby">Moby</a> |
          <a href="Book/Moby/ch/1">Moby: Ch1</a> |
          <a href="Book/Gatsby">Gatsby</a> |
          <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
          <a href="Book/Scarlet">Scarlet Letter</a><br/>

          <div class="view-animate-container">
            <div ng-view class="view-animate"></div>
          </div>
          <hr />

          <pre>$location.path() = {{main.$location.path()}}</pre>
          <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>
          <pre>$route.current.params = {{main.$route.current.params}}</pre>
          <pre>$route.current.scope.name = {{main.$route.current.scope.name}}</pre>
          <pre>$routeParams = {{main.$routeParams}}</pre>
        </div>
      </file>

      <file name="book.html">
        <div>
          controller: {{book.name}}<br />
          Book Id: {{book.params.bookId}}<br />
        </div>
      </file>

      <file name="chapter.html">
        <div>
          controller: {{chapter.name}}<br />
          Book Id: {{chapter.params.bookId}}<br />
          Chapter Id: {{chapter.params.chapterId}}
        </div>
      </file>

      <file name="animations.css">
        .view-animate-container {
          position:relative;
          height:100px!important;
          position:relative;
          background:white;
          border:1px solid black;
          height:40px;
          overflow:hidden;
        }

        .view-animate {
          padding:10px;
        }

        .view-animate.ng-enter, .view-animate.ng-leave {
          -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;
          transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;

          display:block;
          width:100%;
          border-left:1px solid black;

          position:absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          padding:10px;
        }

        .view-animate.ng-enter {
          left:100%;
        }
        .view-animate.ng-enter.ng-enter-active {
          left:0;
        }
        .view-animate.ng-leave.ng-leave-active {
          left:-100%;
        }
      </file>

      <file name="script.js">
        angular.module('ngViewExample', ['ngRoute', 'ngAnimate'],
          function($routeProvider, $locationProvider) {
            $routeProvider.when('/Book/:bookId', {
              templateUrl: 'book.html',
              controller: BookCntl,
              controllerAs: 'book'
            });
            $routeProvider.when('/Book/:bookId/ch/:chapterId', {
              templateUrl: 'chapter.html',
              controller: ChapterCntl,
              controllerAs: 'chapter'
            });

            // configure html5 to get links working on jsfiddle
            $locationProvider.html5Mode(true);
        });

        function MainCntl($route, $routeParams, $location) {
          this.$route = $route;
          this.$location = $location;
          this.$routeParams = $routeParams;
        }

        function BookCntl($routeParams) {
          this.name = "BookCntl";
          this.params = $routeParams;
        }

        function ChapterCntl($routeParams) {
          this.name = "ChapterCntl";
          this.params = $routeParams;
        }
      </file>

      <file name="scenario.js">
        it('should load and compile correct template', function() {
          element('a:contains("Moby: Ch1")').click();
          var content = element('.doc-example-live [ng-view]').text();
          expect(content).toMatch(/controller\: ChapterCntl/);
          expect(content).toMatch(/Book Id\: Moby/);
          expect(content).toMatch(/Chapter Id\: 1/);

          element('a:contains("Scarlet")').click();
          content = element('.doc-example-live [ng-view]').text();
          expect(content).toMatch(/controller\: BookCntl/);
          expect(content).toMatch(/Book Id\: Scarlet/);
        });
      </file>
    </example>
 */


/**
 * @ngdoc event
 * @name ngRoute.directive:ngView#$viewContentLoaded
 * @eventOf ngRoute.directive:ngView
 * @eventType emit on the current ngView scope
 * @description
 * Emitted every time the ngView content is reloaded.
 */
ngViewFactory.$inject = ['$route', '$anchorScroll', '$animate'];
function ngViewFactory(   $route,   $anchorScroll,   $animate) {
  return {
    restrict: 'ECA',
    terminal: true,
    priority: 400,
    transclude: 'element',
    link: function(scope, $element, attr, ctrl, $transclude) {
        var currentScope,
            currentElement,
            autoScrollExp = attr.autoscroll,
            onloadExp = attr.onload || '';

        scope.$on('$routeChangeSuccess', update);
        update();

        function cleanupLastView() {
          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if(currentElement) {
            $animate.leave(currentElement);
            currentElement = null;
          }
        }

        function update() {
          var locals = $route.current && $route.current.locals,
              template = locals && locals.$template;

          if (angular.isDefined(template)) {
            var newScope = scope.$new();
            var current = $route.current;

            // Note: This will also link all children of ng-view that were contained in the original
            // html. If that content contains controllers, ... they could pollute/change the scope.
            // However, using ng-view on an element with additional content does not make sense...
            // Note: We can't remove them in the cloneAttchFn of $transclude as that
            // function is called before linking the content, which would apply child
            // directives to non existing elements.
            var clone = $transclude(newScope, function(clone) {
              $animate.enter(clone, null, currentElement || $element, function onNgViewEnter () {
                if (angular.isDefined(autoScrollExp)
                  && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }
              });
              cleanupLastView();
            });

            currentElement = clone;
            currentScope = current.scope = newScope;
            currentScope.$emit('$viewContentLoaded');
            currentScope.$eval(onloadExp);
          } else {
            cleanupLastView();
          }
        }
    }
  };
}

// This directive is called during the $transclude call of the first `ngView` directive.
// It will replace and compile the content of the element with the loaded template.
// We need this directive so that the element content is already filled when
// the link function of another directive on the same element as ngView
// is called.
ngViewFillContentFactory.$inject = ['$compile', '$controller', '$route'];
function ngViewFillContentFactory($compile, $controller, $route) {
  return {
    restrict: 'ECA',
    priority: -400,
    link: function(scope, $element) {
      var current = $route.current,
          locals = current.locals;

      $element.html(locals.$template);

      var link = $compile($element.contents());

      if (current.controller) {
        locals.$scope = scope;
        var controller = $controller(current.controller, locals);
        if (current.controllerAs) {
          scope[current.controllerAs] = controller;
        }
        $element.data('$ngControllerController', controller);
        $element.children().data('$ngControllerController', controller);
      }

      link(scope);
    }
  };
}


})(window, window.angular);

},{}],4:[function(require,module,exports){
require('./lib/angular.min.js');

module.exports = angular;

},{"./lib/angular.min.js":5}],5:[function(require,module,exports){
/*
 AngularJS v1.2.7
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(Z,Q,r){'use strict';function F(b){return function(){var a=arguments[0],c,a="["+(b?b+":":"")+a+"] http://errors.angularjs.org/1.2.7/"+(b?b+"/":"")+a;for(c=1;c<arguments.length;c++)a=a+(1==c?"?":"&")+"p"+(c-1)+"="+encodeURIComponent("function"==typeof arguments[c]?arguments[c].toString().replace(/ \{[\s\S]*$/,""):"undefined"==typeof arguments[c]?"undefined":"string"!=typeof arguments[c]?JSON.stringify(arguments[c]):arguments[c]);return Error(a)}}function qb(b){if(null==b||za(b))return!1;var a=
b.length;return 1===b.nodeType&&a?!0:D(b)||K(b)||0===a||"number"===typeof a&&0<a&&a-1 in b}function q(b,a,c){var d;if(b)if(L(b))for(d in b)"prototype"==d||("length"==d||"name"==d||b.hasOwnProperty&&!b.hasOwnProperty(d))||a.call(c,b[d],d);else if(b.forEach&&b.forEach!==q)b.forEach(a,c);else if(qb(b))for(d=0;d<b.length;d++)a.call(c,b[d],d);else for(d in b)b.hasOwnProperty(d)&&a.call(c,b[d],d);return b}function Ob(b){var a=[],c;for(c in b)b.hasOwnProperty(c)&&a.push(c);return a.sort()}function Oc(b,
a,c){for(var d=Ob(b),e=0;e<d.length;e++)a.call(c,b[d[e]],d[e]);return d}function Pb(b){return function(a,c){b(c,a)}}function Ya(){for(var b=ka.length,a;b;){b--;a=ka[b].charCodeAt(0);if(57==a)return ka[b]="A",ka.join("");if(90==a)ka[b]="0";else return ka[b]=String.fromCharCode(a+1),ka.join("")}ka.unshift("0");return ka.join("")}function Qb(b,a){a?b.$$hashKey=a:delete b.$$hashKey}function t(b){var a=b.$$hashKey;q(arguments,function(a){a!==b&&q(a,function(a,c){b[c]=a})});Qb(b,a);return b}function S(b){return parseInt(b,
10)}function Rb(b,a){return t(new (t(function(){},{prototype:b})),a)}function w(){}function Aa(b){return b}function $(b){return function(){return b}}function z(b){return"undefined"===typeof b}function B(b){return"undefined"!==typeof b}function X(b){return null!=b&&"object"===typeof b}function D(b){return"string"===typeof b}function rb(b){return"number"===typeof b}function Ja(b){return"[object Date]"===Za.call(b)}function K(b){return"[object Array]"===Za.call(b)}function L(b){return"function"===typeof b}
function $a(b){return"[object RegExp]"===Za.call(b)}function za(b){return b&&b.document&&b.location&&b.alert&&b.setInterval}function Pc(b){return!(!b||!(b.nodeName||b.on&&b.find))}function Qc(b,a,c){var d=[];q(b,function(b,g,f){d.push(a.call(c,b,g,f))});return d}function ab(b,a){if(b.indexOf)return b.indexOf(a);for(var c=0;c<b.length;c++)if(a===b[c])return c;return-1}function Ka(b,a){var c=ab(b,a);0<=c&&b.splice(c,1);return a}function fa(b,a){if(za(b)||b&&b.$evalAsync&&b.$watch)throw La("cpws");if(a){if(b===
a)throw La("cpi");if(K(b))for(var c=a.length=0;c<b.length;c++)a.push(fa(b[c]));else{c=a.$$hashKey;q(a,function(b,c){delete a[c]});for(var d in b)a[d]=fa(b[d]);Qb(a,c)}}else(a=b)&&(K(b)?a=fa(b,[]):Ja(b)?a=new Date(b.getTime()):$a(b)?a=RegExp(b.source):X(b)&&(a=fa(b,{})));return a}function Sb(b,a){a=a||{};for(var c in b)b.hasOwnProperty(c)&&("$"!==c.charAt(0)&&"$"!==c.charAt(1))&&(a[c]=b[c]);return a}function ua(b,a){if(b===a)return!0;if(null===b||null===a)return!1;if(b!==b&&a!==a)return!0;var c=typeof b,
d;if(c==typeof a&&"object"==c)if(K(b)){if(!K(a))return!1;if((c=b.length)==a.length){for(d=0;d<c;d++)if(!ua(b[d],a[d]))return!1;return!0}}else{if(Ja(b))return Ja(a)&&b.getTime()==a.getTime();if($a(b)&&$a(a))return b.toString()==a.toString();if(b&&b.$evalAsync&&b.$watch||a&&a.$evalAsync&&a.$watch||za(b)||za(a)||K(a))return!1;c={};for(d in b)if("$"!==d.charAt(0)&&!L(b[d])){if(!ua(b[d],a[d]))return!1;c[d]=!0}for(d in a)if(!c.hasOwnProperty(d)&&"$"!==d.charAt(0)&&a[d]!==r&&!L(a[d]))return!1;return!0}return!1}
function Tb(){return Q.securityPolicy&&Q.securityPolicy.isActive||Q.querySelector&&!(!Q.querySelector("[ng-csp]")&&!Q.querySelector("[data-ng-csp]"))}function bb(b,a){var c=2<arguments.length?va.call(arguments,2):[];return!L(a)||a instanceof RegExp?a:c.length?function(){return arguments.length?a.apply(b,c.concat(va.call(arguments,0))):a.apply(b,c)}:function(){return arguments.length?a.apply(b,arguments):a.call(b)}}function Rc(b,a){var c=a;"string"===typeof b&&"$"===b.charAt(0)?c=r:za(a)?c="$WINDOW":
a&&Q===a?c="$DOCUMENT":a&&(a.$evalAsync&&a.$watch)&&(c="$SCOPE");return c}function pa(b,a){return"undefined"===typeof b?r:JSON.stringify(b,Rc,a?"  ":null)}function Ub(b){return D(b)?JSON.parse(b):b}function Ma(b){"function"===typeof b?b=!0:b&&0!==b.length?(b=x(""+b),b=!("f"==b||"0"==b||"false"==b||"no"==b||"n"==b||"[]"==b)):b=!1;return b}function ga(b){b=A(b).clone();try{b.empty()}catch(a){}var c=A("<div>").append(b).html();try{return 3===b[0].nodeType?x(c):c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,
function(a,b){return"<"+x(b)})}catch(d){return x(c)}}function Vb(b){try{return decodeURIComponent(b)}catch(a){}}function Wb(b){var a={},c,d;q((b||"").split("&"),function(b){b&&(c=b.split("="),d=Vb(c[0]),B(d)&&(b=B(c[1])?Vb(c[1]):!0,a[d]?K(a[d])?a[d].push(b):a[d]=[a[d],b]:a[d]=b))});return a}function Xb(b){var a=[];q(b,function(b,d){K(b)?q(b,function(b){a.push(wa(d,!0)+(!0===b?"":"="+wa(b,!0)))}):a.push(wa(d,!0)+(!0===b?"":"="+wa(b,!0)))});return a.length?a.join("&"):""}function sb(b){return wa(b,
!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+")}function wa(b,a){return encodeURIComponent(b).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,a?"%20":"+")}function Sc(b,a){function c(a){a&&d.push(a)}var d=[b],e,g,f=["ng:app","ng-app","x-ng-app","data-ng-app"],h=/\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;q(f,function(a){f[a]=!0;c(Q.getElementById(a));a=a.replace(":","\\:");b.querySelectorAll&&(q(b.querySelectorAll("."+a),c),q(b.querySelectorAll("."+
a+"\\:"),c),q(b.querySelectorAll("["+a+"]"),c))});q(d,function(a){if(!e){var b=h.exec(" "+a.className+" ");b?(e=a,g=(b[2]||"").replace(/\s+/g,",")):q(a.attributes,function(b){!e&&f[b.name]&&(e=a,g=b.value)})}});e&&a(e,g?[g]:[])}function Yb(b,a){var c=function(){b=A(b);if(b.injector()){var c=b[0]===Q?"document":ga(b);throw La("btstrpd",c);}a=a||[];a.unshift(["$provide",function(a){a.value("$rootElement",b)}]);a.unshift("ng");c=Zb(a);c.invoke(["$rootScope","$rootElement","$compile","$injector","$animate",
function(a,b,c,d,e){a.$apply(function(){b.data("$injector",d);c(b)(a)})}]);return c},d=/^NG_DEFER_BOOTSTRAP!/;if(Z&&!d.test(Z.name))return c();Z.name=Z.name.replace(d,"");Na.resumeBootstrap=function(b){q(b,function(b){a.push(b)});c()}}function cb(b,a){a=a||"_";return b.replace(Tc,function(b,d){return(d?a:"")+b.toLowerCase()})}function tb(b,a,c){if(!b)throw La("areq",a||"?",c||"required");return b}function Oa(b,a,c){c&&K(b)&&(b=b[b.length-1]);tb(L(b),a,"not a function, got "+(b&&"object"==typeof b?
b.constructor.name||"Object":typeof b));return b}function xa(b,a){if("hasOwnProperty"===b)throw La("badname",a);}function ub(b,a,c){if(!a)return b;a=a.split(".");for(var d,e=b,g=a.length,f=0;f<g;f++)d=a[f],b&&(b=(e=b)[d]);return!c&&L(b)?bb(e,b):b}function vb(b){var a=b[0];b=b[b.length-1];if(a===b)return A(a);var c=[a];do{a=a.nextSibling;if(!a)break;c.push(a)}while(a!==b);return A(c)}function Uc(b){var a=F("$injector"),c=F("ng");b=b.angular||(b.angular={});b.$$minErr=b.$$minErr||F;return b.module||
(b.module=function(){var b={};return function(e,g,f){if("hasOwnProperty"===e)throw c("badname","module");g&&b.hasOwnProperty(e)&&(b[e]=null);return b[e]||(b[e]=function(){function b(a,d,e){return function(){c[e||"push"]([a,d,arguments]);return n}}if(!g)throw a("nomod",e);var c=[],d=[],l=b("$injector","invoke"),n={_invokeQueue:c,_runBlocks:d,requires:g,name:e,provider:b("$provide","provider"),factory:b("$provide","factory"),service:b("$provide","service"),value:b("$provide","value"),constant:b("$provide",
"constant","unshift"),animation:b("$animateProvider","register"),filter:b("$filterProvider","register"),controller:b("$controllerProvider","register"),directive:b("$compileProvider","directive"),config:l,run:function(a){d.push(a);return this}};f&&l(f);return n}())}}())}function Pa(b){return b.replace(Vc,function(a,b,d,e){return e?d.toUpperCase():d}).replace(Wc,"Moz$1")}function wb(b,a,c,d){function e(b){var e=c&&b?[this.filter(b)]:[this],m=a,k,l,n,p,s,C;if(!d||null!=b)for(;e.length;)for(k=e.shift(),
l=0,n=k.length;l<n;l++)for(p=A(k[l]),m?p.triggerHandler("$destroy"):m=!m,s=0,p=(C=p.children()).length;s<p;s++)e.push(Ba(C[s]));return g.apply(this,arguments)}var g=Ba.fn[b],g=g.$original||g;e.$original=g;Ba.fn[b]=e}function O(b){if(b instanceof O)return b;if(!(this instanceof O)){if(D(b)&&"<"!=b.charAt(0))throw xb("nosel");return new O(b)}if(D(b)){var a=Q.createElement("div");a.innerHTML="<div>&#160;</div>"+b;a.removeChild(a.firstChild);yb(this,a.childNodes);A(Q.createDocumentFragment()).append(this)}else yb(this,
b)}function zb(b){return b.cloneNode(!0)}function Ca(b){$b(b);var a=0;for(b=b.childNodes||[];a<b.length;a++)Ca(b[a])}function ac(b,a,c,d){if(B(d))throw xb("offargs");var e=la(b,"events");la(b,"handle")&&(z(a)?q(e,function(a,c){Ab(b,c,a);delete e[c]}):q(a.split(" "),function(a){z(c)?(Ab(b,a,e[a]),delete e[a]):Ka(e[a]||[],c)}))}function $b(b,a){var c=b[db],d=Qa[c];d&&(a?delete Qa[c].data[a]:(d.handle&&(d.events.$destroy&&d.handle({},"$destroy"),ac(b)),delete Qa[c],b[db]=r))}function la(b,a,c){var d=
b[db],d=Qa[d||-1];if(B(c))d||(b[db]=d=++Xc,d=Qa[d]={}),d[a]=c;else return d&&d[a]}function bc(b,a,c){var d=la(b,"data"),e=B(c),g=!e&&B(a),f=g&&!X(a);d||f||la(b,"data",d={});if(e)d[a]=c;else if(g){if(f)return d&&d[a];t(d,a)}else return d}function Bb(b,a){return b.getAttribute?-1<(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").indexOf(" "+a+" "):!1}function Cb(b,a){a&&b.setAttribute&&q(a.split(" "),function(a){b.setAttribute("class",aa((" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g,
" ").replace(" "+aa(a)+" "," ")))})}function Db(b,a){if(a&&b.setAttribute){var c=(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ");q(a.split(" "),function(a){a=aa(a);-1===c.indexOf(" "+a+" ")&&(c+=a+" ")});b.setAttribute("class",aa(c))}}function yb(b,a){if(a){a=a.nodeName||!B(a.length)||za(a)?[a]:a;for(var c=0;c<a.length;c++)b.push(a[c])}}function cc(b,a){return eb(b,"$"+(a||"ngController")+"Controller")}function eb(b,a,c){b=A(b);9==b[0].nodeType&&(b=b.find("html"));for(a=K(a)?a:[a];b.length;){for(var d=
0,e=a.length;d<e;d++)if((c=b.data(a[d]))!==r)return c;b=b.parent()}}function dc(b){for(var a=0,c=b.childNodes;a<c.length;a++)Ca(c[a]);for(;b.firstChild;)b.removeChild(b.firstChild)}function ec(b,a){var c=fb[a.toLowerCase()];return c&&fc[b.nodeName]&&c}function Yc(b,a){var c=function(c,e){c.preventDefault||(c.preventDefault=function(){c.returnValue=!1});c.stopPropagation||(c.stopPropagation=function(){c.cancelBubble=!0});c.target||(c.target=c.srcElement||Q);if(z(c.defaultPrevented)){var g=c.preventDefault;
c.preventDefault=function(){c.defaultPrevented=!0;g.call(c)};c.defaultPrevented=!1}c.isDefaultPrevented=function(){return c.defaultPrevented||!1===c.returnValue};var f=Sb(a[e||c.type]||[]);q(f,function(a){a.call(b,c)});8>=M?(c.preventDefault=null,c.stopPropagation=null,c.isDefaultPrevented=null):(delete c.preventDefault,delete c.stopPropagation,delete c.isDefaultPrevented)};c.elem=b;return c}function Da(b){var a=typeof b,c;"object"==a&&null!==b?"function"==typeof(c=b.$$hashKey)?c=b.$$hashKey():c===
r&&(c=b.$$hashKey=Ya()):c=b;return a+":"+c}function Ra(b){q(b,this.put,this)}function gc(b){var a,c;"function"==typeof b?(a=b.$inject)||(a=[],b.length&&(c=b.toString().replace(Zc,""),c=c.match($c),q(c[1].split(ad),function(b){b.replace(bd,function(b,c,d){a.push(d)})})),b.$inject=a):K(b)?(c=b.length-1,Oa(b[c],"fn"),a=b.slice(0,c)):Oa(b,"fn",!0);return a}function Zb(b){function a(a){return function(b,c){if(X(b))q(b,Pb(a));else return a(b,c)}}function c(a,b){xa(a,"service");if(L(b)||K(b))b=n.instantiate(b);
if(!b.$get)throw Sa("pget",a);return l[a+h]=b}function d(a,b){return c(a,{$get:b})}function e(a){var b=[],c,d,g,h;q(a,function(a){if(!k.get(a)){k.put(a,!0);try{if(D(a))for(c=Ta(a),b=b.concat(e(c.requires)).concat(c._runBlocks),d=c._invokeQueue,g=0,h=d.length;g<h;g++){var f=d[g],m=n.get(f[0]);m[f[1]].apply(m,f[2])}else L(a)?b.push(n.invoke(a)):K(a)?b.push(n.invoke(a)):Oa(a,"module")}catch(l){throw K(a)&&(a=a[a.length-1]),l.message&&(l.stack&&-1==l.stack.indexOf(l.message))&&(l=l.message+"\n"+l.stack),
Sa("modulerr",a,l.stack||l.message||l);}}});return b}function g(a,b){function c(d){if(a.hasOwnProperty(d)){if(a[d]===f)throw Sa("cdep",m.join(" <- "));return a[d]}try{return m.unshift(d),a[d]=f,a[d]=b(d)}catch(e){throw a[d]===f&&delete a[d],e;}finally{m.shift()}}function d(a,b,e){var g=[],h=gc(a),f,k,m;k=0;for(f=h.length;k<f;k++){m=h[k];if("string"!==typeof m)throw Sa("itkn",m);g.push(e&&e.hasOwnProperty(m)?e[m]:c(m))}a.$inject||(a=a[f]);return a.apply(b,g)}return{invoke:d,instantiate:function(a,
b){var c=function(){},e;c.prototype=(K(a)?a[a.length-1]:a).prototype;c=new c;e=d(a,c,b);return X(e)||L(e)?e:c},get:c,annotate:gc,has:function(b){return l.hasOwnProperty(b+h)||a.hasOwnProperty(b)}}}var f={},h="Provider",m=[],k=new Ra,l={$provide:{provider:a(c),factory:a(d),service:a(function(a,b){return d(a,["$injector",function(a){return a.instantiate(b)}])}),value:a(function(a,b){return d(a,$(b))}),constant:a(function(a,b){xa(a,"constant");l[a]=b;p[a]=b}),decorator:function(a,b){var c=n.get(a+h),
d=c.$get;c.$get=function(){var a=s.invoke(d,c);return s.invoke(b,null,{$delegate:a})}}}},n=l.$injector=g(l,function(){throw Sa("unpr",m.join(" <- "));}),p={},s=p.$injector=g(p,function(a){a=n.get(a+h);return s.invoke(a.$get,a)});q(e(b),function(a){s.invoke(a||w)});return s}function cd(){var b=!0;this.disableAutoScrolling=function(){b=!1};this.$get=["$window","$location","$rootScope",function(a,c,d){function e(a){var b=null;q(a,function(a){b||"a"!==x(a.nodeName)||(b=a)});return b}function g(){var b=
c.hash(),d;b?(d=f.getElementById(b))?d.scrollIntoView():(d=e(f.getElementsByName(b)))?d.scrollIntoView():"top"===b&&a.scrollTo(0,0):a.scrollTo(0,0)}var f=a.document;b&&d.$watch(function(){return c.hash()},function(){d.$evalAsync(g)});return g}]}function dd(b,a,c,d){function e(a){try{a.apply(null,va.call(arguments,1))}finally{if(C--,0===C)for(;y.length;)try{y.pop()()}catch(b){c.error(b)}}}function g(a,b){(function T(){q(E,function(a){a()});u=b(T,a)})()}function f(){v=null;R!=h.url()&&(R=h.url(),q(ha,
function(a){a(h.url())}))}var h=this,m=a[0],k=b.location,l=b.history,n=b.setTimeout,p=b.clearTimeout,s={};h.isMock=!1;var C=0,y=[];h.$$completeOutstandingRequest=e;h.$$incOutstandingRequestCount=function(){C++};h.notifyWhenNoOutstandingRequests=function(a){q(E,function(a){a()});0===C?a():y.push(a)};var E=[],u;h.addPollFn=function(a){z(u)&&g(100,n);E.push(a);return a};var R=k.href,H=a.find("base"),v=null;h.url=function(a,c){k!==b.location&&(k=b.location);l!==b.history&&(l=b.history);if(a){if(R!=a)return R=
a,d.history?c?l.replaceState(null,"",a):(l.pushState(null,"",a),H.attr("href",H.attr("href"))):(v=a,c?k.replace(a):k.href=a),h}else return v||k.href.replace(/%27/g,"'")};var ha=[],N=!1;h.onUrlChange=function(a){if(!N){if(d.history)A(b).on("popstate",f);if(d.hashchange)A(b).on("hashchange",f);else h.addPollFn(f);N=!0}ha.push(a);return a};h.baseHref=function(){var a=H.attr("href");return a?a.replace(/^(https?\:)?\/\/[^\/]*/,""):""};var V={},J="",ba=h.baseHref();h.cookies=function(a,b){var d,e,g,h;if(a)b===
r?m.cookie=escape(a)+"=;path="+ba+";expires=Thu, 01 Jan 1970 00:00:00 GMT":D(b)&&(d=(m.cookie=escape(a)+"="+escape(b)+";path="+ba).length+1,4096<d&&c.warn("Cookie '"+a+"' possibly not set or overflowed because it was too large ("+d+" > 4096 bytes)!"));else{if(m.cookie!==J)for(J=m.cookie,d=J.split("; "),V={},g=0;g<d.length;g++)e=d[g],h=e.indexOf("="),0<h&&(a=unescape(e.substring(0,h)),V[a]===r&&(V[a]=unescape(e.substring(h+1))));return V}};h.defer=function(a,b){var c;C++;c=n(function(){delete s[c];
e(a)},b||0);s[c]=!0;return c};h.defer.cancel=function(a){return s[a]?(delete s[a],p(a),e(w),!0):!1}}function ed(){this.$get=["$window","$log","$sniffer","$document",function(b,a,c,d){return new dd(b,d,a,c)}]}function fd(){this.$get=function(){function b(b,d){function e(a){a!=n&&(p?p==a&&(p=a.n):p=a,g(a.n,a.p),g(a,n),n=a,n.n=null)}function g(a,b){a!=b&&(a&&(a.p=b),b&&(b.n=a))}if(b in a)throw F("$cacheFactory")("iid",b);var f=0,h=t({},d,{id:b}),m={},k=d&&d.capacity||Number.MAX_VALUE,l={},n=null,p=null;
return a[b]={put:function(a,b){var c=l[a]||(l[a]={key:a});e(c);if(!z(b))return a in m||f++,m[a]=b,f>k&&this.remove(p.key),b},get:function(a){var b=l[a];if(b)return e(b),m[a]},remove:function(a){var b=l[a];b&&(b==n&&(n=b.p),b==p&&(p=b.n),g(b.n,b.p),delete l[a],delete m[a],f--)},removeAll:function(){m={};f=0;l={};n=p=null},destroy:function(){l=h=m=null;delete a[b]},info:function(){return t({},h,{size:f})}}}var a={};b.info=function(){var b={};q(a,function(a,e){b[e]=a.info()});return b};b.get=function(b){return a[b]};
return b}}function gd(){this.$get=["$cacheFactory",function(b){return b("templates")}]}function ic(b,a){var c={},d="Directive",e=/^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/,g=/(([\d\w\-_]+)(?:\:([^;]+))?;?)/,f=/^(on[a-z]+|formaction)$/;this.directive=function m(a,e){xa(a,"directive");D(a)?(tb(e,"directiveFactory"),c.hasOwnProperty(a)||(c[a]=[],b.factory(a+d,["$injector","$exceptionHandler",function(b,d){var e=[];q(c[a],function(c,g){try{var f=b.invoke(c);L(f)?f={compile:$(f)}:!f.compile&&f.link&&(f.compile=
$(f.link));f.priority=f.priority||0;f.index=g;f.name=f.name||a;f.require=f.require||f.controller&&f.name;f.restrict=f.restrict||"A";e.push(f)}catch(m){d(m)}});return e}])),c[a].push(e)):q(a,Pb(m));return this};this.aHrefSanitizationWhitelist=function(b){return B(b)?(a.aHrefSanitizationWhitelist(b),this):a.aHrefSanitizationWhitelist()};this.imgSrcSanitizationWhitelist=function(b){return B(b)?(a.imgSrcSanitizationWhitelist(b),this):a.imgSrcSanitizationWhitelist()};this.$get=["$injector","$interpolate",
"$exceptionHandler","$http","$templateCache","$parse","$controller","$rootScope","$document","$sce","$animate","$$sanitizeUri",function(a,b,l,n,p,s,C,y,E,u,R,H){function v(a,b,c,d,e){a instanceof A||(a=A(a));q(a,function(b,c){3==b.nodeType&&b.nodeValue.match(/\S+/)&&(a[c]=A(b).wrap("<span></span>").parent()[0])});var g=N(a,b,a,c,d,e);ha(a,"ng-scope");return function(b,c,d){tb(b,"scope");var e=c?Ea.clone.call(a):a;q(d,function(a,b){e.data("$"+b+"Controller",a)});d=0;for(var f=e.length;d<f;d++){var k=
e[d].nodeType;1!==k&&9!==k||e.eq(d).data("$scope",b)}c&&c(e,b);g&&g(b,e,e);return e}}function ha(a,b){try{a.addClass(b)}catch(c){}}function N(a,b,c,d,e,g){function f(a,c,d,e){var g,m,l,s,n,p,I;g=c.length;var C=Array(g);for(n=0;n<g;n++)C[n]=c[n];I=n=0;for(p=k.length;n<p;I++)m=C[I],c=k[n++],g=k[n++],l=A(m),c?(c.scope?(s=a.$new(),l.data("$scope",s)):s=a,(l=c.transclude)||!e&&b?c(g,s,m,d,V(a,l||b)):c(g,s,m,d,e)):g&&g(a,m.childNodes,r,e)}for(var k=[],m,l,s,n,p=0;p<a.length;p++)m=new Eb,l=J(a[p],[],m,0===
p?d:r,e),(g=l.length?ia(l,a[p],m,b,c,null,[],[],g):null)&&g.scope&&ha(A(a[p]),"ng-scope"),m=g&&g.terminal||!(s=a[p].childNodes)||!s.length?null:N(s,g?g.transclude:b),k.push(g,m),n=n||g||m,g=null;return n?f:null}function V(a,b){return function(c,d,e){var g=!1;c||(c=a.$new(),g=c.$$transcluded=!0);d=b(c,d,e);if(g)d.on("$destroy",bb(c,c.$destroy));return d}}function J(a,b,c,d,f){var k=c.$attr,m;switch(a.nodeType){case 1:T(b,ma(Fa(a).toLowerCase()),"E",d,f);var l,s,n;m=a.attributes;for(var p=0,C=m&&m.length;p<
C;p++){var y=!1,R=!1;l=m[p];if(!M||8<=M||l.specified){s=l.name;n=ma(s);W.test(n)&&(s=cb(n.substr(6),"-"));var v=n.replace(/(Start|End)$/,"");n===v+"Start"&&(y=s,R=s.substr(0,s.length-5)+"end",s=s.substr(0,s.length-6));n=ma(s.toLowerCase());k[n]=s;c[n]=l=aa(l.value);ec(a,n)&&(c[n]=!0);S(a,b,l,n);T(b,n,"A",d,f,y,R)}}a=a.className;if(D(a)&&""!==a)for(;m=g.exec(a);)n=ma(m[2]),T(b,n,"C",d,f)&&(c[n]=aa(m[3])),a=a.substr(m.index+m[0].length);break;case 3:F(b,a.nodeValue);break;case 8:try{if(m=e.exec(a.nodeValue))n=
ma(m[1]),T(b,n,"M",d,f)&&(c[n]=aa(m[2]))}catch(E){}}b.sort(z);return b}function ba(a,b,c){var d=[],e=0;if(b&&a.hasAttribute&&a.hasAttribute(b)){do{if(!a)throw ja("uterdir",b,c);1==a.nodeType&&(a.hasAttribute(b)&&e++,a.hasAttribute(c)&&e--);d.push(a);a=a.nextSibling}while(0<e)}else d.push(a);return A(d)}function P(a,b,c){return function(d,e,g,f,m){e=ba(e[0],b,c);return a(d,e,g,f,m)}}function ia(a,c,d,e,g,f,m,n,p){function y(a,b,c,d){if(a){c&&(a=P(a,c,d));a.require=G.require;if(H===G||G.$$isolateScope)a=
jc(a,{isolateScope:!0});m.push(a)}if(b){c&&(b=P(b,c,d));b.require=G.require;if(H===G||G.$$isolateScope)b=jc(b,{isolateScope:!0});n.push(b)}}function R(a,b,c){var d,e="data",g=!1;if(D(a)){for(;"^"==(d=a.charAt(0))||"?"==d;)a=a.substr(1),"^"==d&&(e="inheritedData"),g=g||"?"==d;d=null;c&&"data"===e&&(d=c[a]);d=d||b[e]("$"+a+"Controller");if(!d&&!g)throw ja("ctreq",a,ca);}else K(a)&&(d=[],q(a,function(a){d.push(R(a,b,c))}));return d}function E(a,e,g,f,p){function y(a,b){var c;2>arguments.length&&(b=a,
a=r);z&&(c=ba);return p(a,b,c)}var I,v,N,u,P,J,ba={},gb;I=c===g?d:Sb(d,new Eb(A(g),d.$attr));v=I.$$element;if(H){var T=/^\s*([@=&])(\??)\s*(\w*)\s*$/;f=A(g);J=e.$new(!0);ia&&ia===H.$$originalDirective?f.data("$isolateScope",J):f.data("$isolateScopeNoTemplate",J);ha(f,"ng-isolate-scope");q(H.scope,function(a,c){var d=a.match(T)||[],g=d[3]||c,f="?"==d[2],d=d[1],m,l,n,p;J.$$isolateBindings[c]=d+g;switch(d){case "@":I.$observe(g,function(a){J[c]=a});I.$$observers[g].$$scope=e;I[g]&&(J[c]=b(I[g])(e));
break;case "=":if(f&&!I[g])break;l=s(I[g]);p=l.literal?ua:function(a,b){return a===b};n=l.assign||function(){m=J[c]=l(e);throw ja("nonassign",I[g],H.name);};m=J[c]=l(e);J.$watch(function(){var a=l(e);p(a,J[c])||(p(a,m)?n(e,a=J[c]):J[c]=a);return m=a},null,l.literal);break;case "&":l=s(I[g]);J[c]=function(a){return l(e,a)};break;default:throw ja("iscp",H.name,c,a);}})}gb=p&&y;V&&q(V,function(a){var b={$scope:a===H||a.$$isolateScope?J:e,$element:v,$attrs:I,$transclude:gb},c;P=a.controller;"@"==P&&(P=
I[a.name]);c=C(P,b);ba[a.name]=c;z||v.data("$"+a.name+"Controller",c);a.controllerAs&&(b.$scope[a.controllerAs]=c)});f=0;for(N=m.length;f<N;f++)try{u=m[f],u(u.isolateScope?J:e,v,I,u.require&&R(u.require,v,ba),gb)}catch(G){l(G,ga(v))}f=e;H&&(H.template||null===H.templateUrl)&&(f=J);a&&a(f,g.childNodes,r,p);for(f=n.length-1;0<=f;f--)try{u=n[f],u(u.isolateScope?J:e,v,I,u.require&&R(u.require,v,ba),gb)}catch(B){l(B,ga(v))}}p=p||{};var N=-Number.MAX_VALUE,u,V=p.controllerDirectives,H=p.newIsolateScopeDirective,
ia=p.templateDirective;p=p.nonTlbTranscludeDirective;for(var T=!1,z=!1,t=d.$$element=A(c),G,ca,U,F=e,O,M=0,na=a.length;M<na;M++){G=a[M];var Ua=G.$$start,S=G.$$end;Ua&&(t=ba(c,Ua,S));U=r;if(N>G.priority)break;if(U=G.scope)u=u||G,G.templateUrl||(x("new/isolated scope",H,G,t),X(U)&&(H=G));ca=G.name;!G.templateUrl&&G.controller&&(U=G.controller,V=V||{},x("'"+ca+"' controller",V[ca],G,t),V[ca]=G);if(U=G.transclude)T=!0,G.$$tlb||(x("transclusion",p,G,t),p=G),"element"==U?(z=!0,N=G.priority,U=ba(c,Ua,S),
t=d.$$element=A(Q.createComment(" "+ca+": "+d[ca]+" ")),c=t[0],hb(g,A(va.call(U,0)),c),F=v(U,e,N,f&&f.name,{nonTlbTranscludeDirective:p})):(U=A(zb(c)).contents(),t.empty(),F=v(U,e));if(G.template)if(x("template",ia,G,t),ia=G,U=L(G.template)?G.template(t,d):G.template,U=Y(U),G.replace){f=G;U=A("<div>"+aa(U)+"</div>").contents();c=U[0];if(1!=U.length||1!==c.nodeType)throw ja("tplrt",ca,"");hb(g,t,c);na={$attr:{}};U=J(c,[],na);var W=a.splice(M+1,a.length-(M+1));H&&hc(U);a=a.concat(U).concat(W);B(d,na);
na=a.length}else t.html(U);if(G.templateUrl)x("template",ia,G,t),ia=G,G.replace&&(f=G),E=w(a.splice(M,a.length-M),t,d,g,F,m,n,{controllerDirectives:V,newIsolateScopeDirective:H,templateDirective:ia,nonTlbTranscludeDirective:p}),na=a.length;else if(G.compile)try{O=G.compile(t,d,F),L(O)?y(null,O,Ua,S):O&&y(O.pre,O.post,Ua,S)}catch(Z){l(Z,ga(t))}G.terminal&&(E.terminal=!0,N=Math.max(N,G.priority))}E.scope=u&&!0===u.scope;E.transclude=T&&F;return E}function hc(a){for(var b=0,c=a.length;b<c;b++)a[b]=Rb(a[b],
{$$isolateScope:!0})}function T(b,e,g,f,k,s,n){if(e===k)return null;k=null;if(c.hasOwnProperty(e)){var p;e=a.get(e+d);for(var C=0,y=e.length;C<y;C++)try{p=e[C],(f===r||f>p.priority)&&-1!=p.restrict.indexOf(g)&&(s&&(p=Rb(p,{$$start:s,$$end:n})),b.push(p),k=p)}catch(v){l(v)}}return k}function B(a,b){var c=b.$attr,d=a.$attr,e=a.$$element;q(a,function(d,e){"$"!=e.charAt(0)&&(b[e]&&(d+=("style"===e?";":" ")+b[e]),a.$set(e,d,!0,c[e]))});q(b,function(b,g){"class"==g?(ha(e,b),a["class"]=(a["class"]?a["class"]+
" ":"")+b):"style"==g?(e.attr("style",e.attr("style")+";"+b),a.style=(a.style?a.style+";":"")+b):"$"==g.charAt(0)||a.hasOwnProperty(g)||(a[g]=b,d[g]=c[g])})}function w(a,b,c,d,e,g,f,m){var k=[],l,s,C=b[0],y=a.shift(),v=t({},y,{templateUrl:null,transclude:null,replace:null,$$originalDirective:y}),R=L(y.templateUrl)?y.templateUrl(b,c):y.templateUrl;b.empty();n.get(u.getTrustedResourceUrl(R),{cache:p}).success(function(n){var p,E;n=Y(n);if(y.replace){n=A("<div>"+aa(n)+"</div>").contents();p=n[0];if(1!=
n.length||1!==p.nodeType)throw ja("tplrt",y.name,R);n={$attr:{}};hb(d,b,p);var u=J(p,[],n);X(y.scope)&&hc(u);a=u.concat(a);B(c,n)}else p=C,b.html(n);a.unshift(v);l=ia(a,p,c,e,b,y,g,f,m);q(d,function(a,c){a==p&&(d[c]=b[0])});for(s=N(b[0].childNodes,e);k.length;){n=k.shift();E=k.shift();var H=k.shift(),ha=k.shift(),u=b[0];E!==C&&(u=zb(p),hb(H,A(E),u));E=l.transclude?V(n,l.transclude):ha;l(s,n,u,d,E)}k=null}).error(function(a,b,c,d){throw ja("tpload",d.url);});return function(a,b,c,d,e){k?(k.push(b),
k.push(c),k.push(d),k.push(e)):l(s,b,c,d,e)}}function z(a,b){var c=b.priority-a.priority;return 0!==c?c:a.name!==b.name?a.name<b.name?-1:1:a.index-b.index}function x(a,b,c,d){if(b)throw ja("multidir",b.name,c.name,a,ga(d));}function F(a,c){var d=b(c,!0);d&&a.push({priority:0,compile:$(function(a,b){var c=b.parent(),e=c.data("$binding")||[];e.push(d);ha(c.data("$binding",e),"ng-binding");a.$watch(d,function(a){b[0].nodeValue=a})})})}function O(a,b){if("srcdoc"==b)return u.HTML;var c=Fa(a);if("xlinkHref"==
b||"FORM"==c&&"action"==b||"IMG"!=c&&("src"==b||"ngSrc"==b))return u.RESOURCE_URL}function S(a,c,d,e){var g=b(d,!0);if(g){if("multiple"===e&&"SELECT"===Fa(a))throw ja("selmulti",ga(a));c.push({priority:100,compile:function(){return{pre:function(c,d,m){d=m.$$observers||(m.$$observers={});if(f.test(e))throw ja("nodomevents");if(g=b(m[e],!0,O(a,e)))m[e]=g(c),(d[e]||(d[e]=[])).$$inter=!0,(m.$$observers&&m.$$observers[e].$$scope||c).$watch(g,function(a,b){"class"===e&&a!=b?m.$updateClass(a,b):m.$set(e,
a)})}}}})}}function hb(a,b,c){var d=b[0],e=b.length,g=d.parentNode,f,m;if(a)for(f=0,m=a.length;f<m;f++)if(a[f]==d){a[f++]=c;m=f+e-1;for(var k=a.length;f<k;f++,m++)m<k?a[f]=a[m]:delete a[f];a.length-=e-1;break}g&&g.replaceChild(c,d);a=Q.createDocumentFragment();a.appendChild(d);c[A.expando]=d[A.expando];d=1;for(e=b.length;d<e;d++)g=b[d],A(g).remove(),a.appendChild(g),delete b[d];b[0]=c;b.length=1}function jc(a,b){return t(function(){return a.apply(null,arguments)},a,b)}var Eb=function(a,b){this.$$element=
a;this.$attr=b||{}};Eb.prototype={$normalize:ma,$addClass:function(a){a&&0<a.length&&R.addClass(this.$$element,a)},$removeClass:function(a){a&&0<a.length&&R.removeClass(this.$$element,a)},$updateClass:function(a,b){this.$removeClass(kc(b,a));this.$addClass(kc(a,b))},$set:function(a,b,c,d){var e=ec(this.$$element[0],a);e&&(this.$$element.prop(a,b),d=e);this[a]=b;d?this.$attr[a]=d:(d=this.$attr[a])||(this.$attr[a]=d=cb(a,"-"));e=Fa(this.$$element);if("A"===e&&"href"===a||"IMG"===e&&"src"===a)this[a]=
b=H(b,"src"===a);!1!==c&&(null===b||b===r?this.$$element.removeAttr(d):this.$$element.attr(d,b));(c=this.$$observers)&&q(c[a],function(a){try{a(b)}catch(c){l(c)}})},$observe:function(a,b){var c=this,d=c.$$observers||(c.$$observers={}),e=d[a]||(d[a]=[]);e.push(b);y.$evalAsync(function(){e.$$inter||b(c[a])});return b}};var ca=b.startSymbol(),na=b.endSymbol(),Y="{{"==ca||"}}"==na?Aa:function(a){return a.replace(/\{\{/g,ca).replace(/}}/g,na)},W=/^ngAttr[A-Z]/;return v}]}function ma(b){return Pa(b.replace(hd,
""))}function kc(b,a){var c="",d=b.split(/\s+/),e=a.split(/\s+/),g=0;a:for(;g<d.length;g++){for(var f=d[g],h=0;h<e.length;h++)if(f==e[h])continue a;c+=(0<c.length?" ":"")+f}return c}function id(){var b={},a=/^(\S+)(\s+as\s+(\w+))?$/;this.register=function(a,d){xa(a,"controller");X(a)?t(b,a):b[a]=d};this.$get=["$injector","$window",function(c,d){return function(e,g){var f,h,m;D(e)&&(f=e.match(a),h=f[1],m=f[3],e=b.hasOwnProperty(h)?b[h]:ub(g.$scope,h,!0)||ub(d,h,!0),Oa(e,h,!0));f=c.instantiate(e,g);
if(m){if(!g||"object"!=typeof g.$scope)throw F("$controller")("noscp",h||e.name,m);g.$scope[m]=f}return f}}]}function jd(){this.$get=["$window",function(b){return A(b.document)}]}function kd(){this.$get=["$log",function(b){return function(a,c){b.error.apply(b,arguments)}}]}function lc(b){var a={},c,d,e;if(!b)return a;q(b.split("\n"),function(b){e=b.indexOf(":");c=x(aa(b.substr(0,e)));d=aa(b.substr(e+1));c&&(a[c]=a[c]?a[c]+(", "+d):d)});return a}function mc(b){var a=X(b)?b:r;return function(c){a||
(a=lc(b));return c?a[x(c)]||null:a}}function nc(b,a,c){if(L(c))return c(b,a);q(c,function(c){b=c(b,a)});return b}function ld(){var b=/^\s*(\[|\{[^\{])/,a=/[\}\]]\s*$/,c=/^\)\]\}',?\n/,d={"Content-Type":"application/json;charset=utf-8"},e=this.defaults={transformResponse:[function(d){D(d)&&(d=d.replace(c,""),b.test(d)&&a.test(d)&&(d=Ub(d)));return d}],transformRequest:[function(a){return X(a)&&"[object File]"!==Za.call(a)?pa(a):a}],headers:{common:{Accept:"application/json, text/plain, */*"},post:d,
put:d,patch:d},xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN"},g=this.interceptors=[],f=this.responseInterceptors=[];this.$get=["$httpBackend","$browser","$cacheFactory","$rootScope","$q","$injector",function(a,b,c,d,n,p){function s(a){function c(a){var b=t({},a,{data:nc(a.data,a.headers,d.transformResponse)});return 200<=a.status&&300>a.status?b:n.reject(b)}var d={transformRequest:e.transformRequest,transformResponse:e.transformResponse},g=function(a){function b(a){var c;q(a,function(b,
d){L(b)&&(c=b(),null!=c?a[d]=c:delete a[d])})}var c=e.headers,d=t({},a.headers),g,f,c=t({},c.common,c[x(a.method)]);b(c);b(d);a:for(g in c){a=x(g);for(f in d)if(x(f)===a)continue a;d[g]=c[g]}return d}(a);t(d,a);d.headers=g;d.method=Ga(d.method);(a=Fb(d.url)?b.cookies()[d.xsrfCookieName||e.xsrfCookieName]:r)&&(g[d.xsrfHeaderName||e.xsrfHeaderName]=a);var f=[function(a){g=a.headers;var b=nc(a.data,mc(g),a.transformRequest);z(a.data)&&q(g,function(a,b){"content-type"===x(b)&&delete g[b]});z(a.withCredentials)&&
!z(e.withCredentials)&&(a.withCredentials=e.withCredentials);return C(a,b,g).then(c,c)},r],h=n.when(d);for(q(u,function(a){(a.request||a.requestError)&&f.unshift(a.request,a.requestError);(a.response||a.responseError)&&f.push(a.response,a.responseError)});f.length;){a=f.shift();var k=f.shift(),h=h.then(a,k)}h.success=function(a){h.then(function(b){a(b.data,b.status,b.headers,d)});return h};h.error=function(a){h.then(null,function(b){a(b.data,b.status,b.headers,d)});return h};return h}function C(b,
c,g){function f(a,b,c){u&&(200<=a&&300>a?u.put(r,[a,b,lc(c)]):u.remove(r));m(b,a,c);d.$$phase||d.$apply()}function m(a,c,d){c=Math.max(c,0);(200<=c&&300>c?p.resolve:p.reject)({data:a,status:c,headers:mc(d),config:b})}function k(){var a=ab(s.pendingRequests,b);-1!==a&&s.pendingRequests.splice(a,1)}var p=n.defer(),C=p.promise,u,q,r=y(b.url,b.params);s.pendingRequests.push(b);C.then(k,k);(b.cache||e.cache)&&(!1!==b.cache&&"GET"==b.method)&&(u=X(b.cache)?b.cache:X(e.cache)?e.cache:E);if(u)if(q=u.get(r),
B(q)){if(q.then)return q.then(k,k),q;K(q)?m(q[1],q[0],fa(q[2])):m(q,200,{})}else u.put(r,C);z(q)&&a(b.method,r,c,f,g,b.timeout,b.withCredentials,b.responseType);return C}function y(a,b){if(!b)return a;var c=[];Oc(b,function(a,b){null===a||z(a)||(K(a)||(a=[a]),q(a,function(a){X(a)&&(a=pa(a));c.push(wa(b)+"="+wa(a))}))});return a+(-1==a.indexOf("?")?"?":"&")+c.join("&")}var E=c("$http"),u=[];q(g,function(a){u.unshift(D(a)?p.get(a):p.invoke(a))});q(f,function(a,b){var c=D(a)?p.get(a):p.invoke(a);u.splice(b,
0,{response:function(a){return c(n.when(a))},responseError:function(a){return c(n.reject(a))}})});s.pendingRequests=[];(function(a){q(arguments,function(a){s[a]=function(b,c){return s(t(c||{},{method:a,url:b}))}})})("get","delete","head","jsonp");(function(a){q(arguments,function(a){s[a]=function(b,c,d){return s(t(d||{},{method:a,url:b,data:c}))}})})("post","put");s.defaults=e;return s}]}function md(b){return 8>=M&&"patch"===x(b)?new ActiveXObject("Microsoft.XMLHTTP"):new Z.XMLHttpRequest}function nd(){this.$get=
["$browser","$window","$document",function(b,a,c){return od(b,md,b.defer,a.angular.callbacks,c[0])}]}function od(b,a,c,d,e){function g(a,b){var c=e.createElement("script"),d=function(){c.onreadystatechange=c.onload=c.onerror=null;e.body.removeChild(c);b&&b()};c.type="text/javascript";c.src=a;M&&8>=M?c.onreadystatechange=function(){/loaded|complete/.test(c.readyState)&&d()}:c.onload=c.onerror=function(){d()};e.body.appendChild(c);return d}var f=-1;return function(e,m,k,l,n,p,s,C){function y(){u=f;
H&&H();v&&v.abort()}function E(a,d,e,g){var f=qa(m).protocol;r&&c.cancel(r);H=v=null;d="file"==f&&0===d?e?200:404:d;a(1223==d?204:d,e,g);b.$$completeOutstandingRequest(w)}var u;b.$$incOutstandingRequestCount();m=m||b.url();if("jsonp"==x(e)){var R="_"+(d.counter++).toString(36);d[R]=function(a){d[R].data=a};var H=g(m.replace("JSON_CALLBACK","angular.callbacks."+R),function(){d[R].data?E(l,200,d[R].data):E(l,u||-2);delete d[R]})}else{var v=a(e);v.open(e,m,!0);q(n,function(a,b){B(a)&&v.setRequestHeader(b,
a)});v.onreadystatechange=function(){if(v&&4==v.readyState){var a=null,b=null;u!==f&&(a=v.getAllResponseHeaders(),b=v.responseType?v.response:v.responseText);E(l,u||v.status,b,a)}};s&&(v.withCredentials=!0);C&&(v.responseType=C);v.send(k||null)}if(0<p)var r=c(y,p);else p&&p.then&&p.then(y)}}function pd(){var b="{{",a="}}";this.startSymbol=function(a){return a?(b=a,this):b};this.endSymbol=function(b){return b?(a=b,this):a};this.$get=["$parse","$exceptionHandler","$sce",function(c,d,e){function g(g,
k,l){for(var n,p,s=0,C=[],y=g.length,E=!1,u=[];s<y;)-1!=(n=g.indexOf(b,s))&&-1!=(p=g.indexOf(a,n+f))?(s!=n&&C.push(g.substring(s,n)),C.push(s=c(E=g.substring(n+f,p))),s.exp=E,s=p+h,E=!0):(s!=y&&C.push(g.substring(s)),s=y);(y=C.length)||(C.push(""),y=1);if(l&&1<C.length)throw oc("noconcat",g);if(!k||E)return u.length=y,s=function(a){try{for(var b=0,c=y,f;b<c;b++)"function"==typeof(f=C[b])&&(f=f(a),f=l?e.getTrusted(l,f):e.valueOf(f),null===f||z(f)?f="":"string"!=typeof f&&(f=pa(f))),u[b]=f;return u.join("")}catch(h){a=
oc("interr",g,h.toString()),d(a)}},s.exp=g,s.parts=C,s}var f=b.length,h=a.length;g.startSymbol=function(){return b};g.endSymbol=function(){return a};return g}]}function qd(){this.$get=["$rootScope","$window","$q",function(b,a,c){function d(d,f,h,m){var k=a.setInterval,l=a.clearInterval,n=c.defer(),p=n.promise,s=0,C=B(m)&&!m;h=B(h)?h:0;p.then(null,null,d);p.$$intervalId=k(function(){n.notify(s++);0<h&&s>=h&&(n.resolve(s),l(p.$$intervalId),delete e[p.$$intervalId]);C||b.$apply()},f);e[p.$$intervalId]=
n;return p}var e={};d.cancel=function(a){return a&&a.$$intervalId in e?(e[a.$$intervalId].reject("canceled"),clearInterval(a.$$intervalId),delete e[a.$$intervalId],!0):!1};return d}]}function rd(){this.$get=function(){return{id:"en-us",NUMBER_FORMATS:{DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{minInt:1,minFrac:0,maxFrac:3,posPre:"",posSuf:"",negPre:"-",negSuf:"",gSize:3,lgSize:3},{minInt:1,minFrac:2,maxFrac:2,posPre:"\u00a4",posSuf:"",negPre:"(\u00a4",negSuf:")",gSize:3,lgSize:3}],CURRENCY_SYM:"$"},
DATETIME_FORMATS:{MONTH:"January February March April May June July August September October November December".split(" "),SHORTMONTH:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),DAY:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),SHORTDAY:"Sun Mon Tue Wed Thu Fri Sat".split(" "),AMPMS:["AM","PM"],medium:"MMM d, y h:mm:ss a","short":"M/d/yy h:mm a",fullDate:"EEEE, MMMM d, y",longDate:"MMMM d, y",mediumDate:"MMM d, y",shortDate:"M/d/yy",mediumTime:"h:mm:ss a",
shortTime:"h:mm a"},pluralCat:function(b){return 1===b?"one":"other"}}}}function pc(b){b=b.split("/");for(var a=b.length;a--;)b[a]=sb(b[a]);return b.join("/")}function qc(b,a,c){b=qa(b,c);a.$$protocol=b.protocol;a.$$host=b.hostname;a.$$port=S(b.port)||sd[b.protocol]||null}function rc(b,a,c){var d="/"!==b.charAt(0);d&&(b="/"+b);b=qa(b,c);a.$$path=decodeURIComponent(d&&"/"===b.pathname.charAt(0)?b.pathname.substring(1):b.pathname);a.$$search=Wb(b.search);a.$$hash=decodeURIComponent(b.hash);a.$$path&&
"/"!=a.$$path.charAt(0)&&(a.$$path="/"+a.$$path)}function oa(b,a){if(0===a.indexOf(b))return a.substr(b.length)}function Va(b){var a=b.indexOf("#");return-1==a?b:b.substr(0,a)}function Gb(b){return b.substr(0,Va(b).lastIndexOf("/")+1)}function sc(b,a){this.$$html5=!0;a=a||"";var c=Gb(b);qc(b,this,b);this.$$parse=function(a){var e=oa(c,a);if(!D(e))throw Hb("ipthprfx",a,c);rc(e,this,b);this.$$path||(this.$$path="/");this.$$compose()};this.$$compose=function(){var a=Xb(this.$$search),b=this.$$hash?"#"+
sb(this.$$hash):"";this.$$url=pc(this.$$path)+(a?"?"+a:"")+b;this.$$absUrl=c+this.$$url.substr(1)};this.$$rewrite=function(d){var e;if((e=oa(b,d))!==r)return d=e,(e=oa(a,e))!==r?c+(oa("/",e)||e):b+d;if((e=oa(c,d))!==r)return c+e;if(c==d+"/")return c}}function Ib(b,a){var c=Gb(b);qc(b,this,b);this.$$parse=function(d){var e=oa(b,d)||oa(c,d),e="#"==e.charAt(0)?oa(a,e):this.$$html5?e:"";if(!D(e))throw Hb("ihshprfx",d,a);rc(e,this,b);d=this.$$path;var g=/^\/?.*?:(\/.*)/;0===e.indexOf(b)&&(e=e.replace(b,
""));g.exec(e)||(d=(e=g.exec(d))?e[1]:d);this.$$path=d;this.$$compose()};this.$$compose=function(){var c=Xb(this.$$search),e=this.$$hash?"#"+sb(this.$$hash):"";this.$$url=pc(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=b+(this.$$url?a+this.$$url:"")};this.$$rewrite=function(a){if(Va(b)==Va(a))return a}}function tc(b,a){this.$$html5=!0;Ib.apply(this,arguments);var c=Gb(b);this.$$rewrite=function(d){var e;if(b==Va(d))return d;if(e=oa(c,d))return b+a+e;if(c===d+"/")return c}}function ib(b){return function(){return this[b]}}
function uc(b,a){return function(c){if(z(c))return this[b];this[b]=a(c);this.$$compose();return this}}function td(){var b="",a=!1;this.hashPrefix=function(a){return B(a)?(b=a,this):b};this.html5Mode=function(b){return B(b)?(a=b,this):a};this.$get=["$rootScope","$browser","$sniffer","$rootElement",function(c,d,e,g){function f(a){c.$broadcast("$locationChangeSuccess",h.absUrl(),a)}var h,m=d.baseHref(),k=d.url();a?(m=k.substring(0,k.indexOf("/",k.indexOf("//")+2))+(m||"/"),e=e.history?sc:tc):(m=Va(k),
e=Ib);h=new e(m,"#"+b);h.$$parse(h.$$rewrite(k));g.on("click",function(a){if(!a.ctrlKey&&!a.metaKey&&2!=a.which){for(var b=A(a.target);"a"!==x(b[0].nodeName);)if(b[0]===g[0]||!(b=b.parent())[0])return;var e=b.prop("href");X(e)&&"[object SVGAnimatedString]"===e.toString()&&(e=qa(e.animVal).href);var f=h.$$rewrite(e);e&&(!b.attr("target")&&f&&!a.isDefaultPrevented())&&(a.preventDefault(),f!=d.url()&&(h.$$parse(f),c.$apply(),Z.angular["ff-684208-preventDefault"]=!0))}});h.absUrl()!=k&&d.url(h.absUrl(),
!0);d.onUrlChange(function(a){h.absUrl()!=a&&(c.$evalAsync(function(){var b=h.absUrl();h.$$parse(a);c.$broadcast("$locationChangeStart",a,b).defaultPrevented?(h.$$parse(b),d.url(b)):f(b)}),c.$$phase||c.$digest())});var l=0;c.$watch(function(){var a=d.url(),b=h.$$replace;l&&a==h.absUrl()||(l++,c.$evalAsync(function(){c.$broadcast("$locationChangeStart",h.absUrl(),a).defaultPrevented?h.$$parse(a):(d.url(h.absUrl(),b),f(a))}));h.$$replace=!1;return l});return h}]}function ud(){var b=!0,a=this;this.debugEnabled=
function(a){return B(a)?(b=a,this):b};this.$get=["$window",function(c){function d(a){a instanceof Error&&(a.stack?a=a.message&&-1===a.stack.indexOf(a.message)?"Error: "+a.message+"\n"+a.stack:a.stack:a.sourceURL&&(a=a.message+"\n"+a.sourceURL+":"+a.line));return a}function e(a){var b=c.console||{},e=b[a]||b.log||w;a=!1;try{a=!!e.apply}catch(m){}return a?function(){var a=[];q(arguments,function(b){a.push(d(b))});return e.apply(b,a)}:function(a,b){e(a,null==b?"":b)}}return{log:e("log"),info:e("info"),
warn:e("warn"),error:e("error"),debug:function(){var c=e("debug");return function(){b&&c.apply(a,arguments)}}()}}]}function da(b,a){if("constructor"===b)throw ya("isecfld",a);return b}function Wa(b,a){if(b){if(b.constructor===b)throw ya("isecfn",a);if(b.document&&b.location&&b.alert&&b.setInterval)throw ya("isecwindow",a);if(b.children&&(b.nodeName||b.on&&b.find))throw ya("isecdom",a);}return b}function jb(b,a,c,d,e){e=e||{};a=a.split(".");for(var g,f=0;1<a.length;f++){g=da(a.shift(),d);var h=b[g];
h||(h={},b[g]=h);b=h;b.then&&e.unwrapPromises&&(ra(d),"$$v"in b||function(a){a.then(function(b){a.$$v=b})}(b),b.$$v===r&&(b.$$v={}),b=b.$$v)}g=da(a.shift(),d);return b[g]=c}function vc(b,a,c,d,e,g,f){da(b,g);da(a,g);da(c,g);da(d,g);da(e,g);return f.unwrapPromises?function(f,m){var k=m&&m.hasOwnProperty(b)?m:f,l;if(null==k)return k;(k=k[b])&&k.then&&(ra(g),"$$v"in k||(l=k,l.$$v=r,l.then(function(a){l.$$v=a})),k=k.$$v);if(null==k)return a?r:k;(k=k[a])&&k.then&&(ra(g),"$$v"in k||(l=k,l.$$v=r,l.then(function(a){l.$$v=
a})),k=k.$$v);if(null==k)return c?r:k;(k=k[c])&&k.then&&(ra(g),"$$v"in k||(l=k,l.$$v=r,l.then(function(a){l.$$v=a})),k=k.$$v);if(null==k)return d?r:k;(k=k[d])&&k.then&&(ra(g),"$$v"in k||(l=k,l.$$v=r,l.then(function(a){l.$$v=a})),k=k.$$v);if(null==k)return e?r:k;(k=k[e])&&k.then&&(ra(g),"$$v"in k||(l=k,l.$$v=r,l.then(function(a){l.$$v=a})),k=k.$$v);return k}:function(g,f){var k=f&&f.hasOwnProperty(b)?f:g;if(null==k)return k;k=k[b];if(null==k)return a?r:k;k=k[a];if(null==k)return c?r:k;k=k[c];if(null==
k)return d?r:k;k=k[d];return null==k?e?r:k:k=k[e]}}function vd(b,a){da(b,a);return function(a,d){return null==a?r:(d&&d.hasOwnProperty(b)?d:a)[b]}}function wd(b,a,c){da(b,c);da(a,c);return function(c,e){if(null==c)return r;c=(e&&e.hasOwnProperty(b)?e:c)[b];return null==c?r:c[a]}}function wc(b,a,c){if(Jb.hasOwnProperty(b))return Jb[b];var d=b.split("."),e=d.length,g;if(a.unwrapPromises||1!==e)if(a.unwrapPromises||2!==e)if(a.csp)g=6>e?vc(d[0],d[1],d[2],d[3],d[4],c,a):function(b,g){var f=0,h;do h=vc(d[f++],
d[f++],d[f++],d[f++],d[f++],c,a)(b,g),g=r,b=h;while(f<e);return h};else{var f="var p;\n";q(d,function(b,d){da(b,c);f+="if(s == null) return undefined;\ns="+(d?"s":'((k&&k.hasOwnProperty("'+b+'"))?k:s)')+'["'+b+'"];\n'+(a.unwrapPromises?'if (s && s.then) {\n pw("'+c.replace(/(["\r\n])/g,"\\$1")+'");\n if (!("$$v" in s)) {\n p=s;\n p.$$v = undefined;\n p.then(function(v) {p.$$v=v;});\n}\n s=s.$$v\n}\n':"")});var f=f+"return s;",h=new Function("s","k","pw",f);h.toString=$(f);g=a.unwrapPromises?function(a,
b){return h(a,b,ra)}:h}else g=wd(d[0],d[1],c);else g=vd(d[0],c);"hasOwnProperty"!==b&&(Jb[b]=g);return g}function xd(){var b={},a={csp:!1,unwrapPromises:!1,logPromiseWarnings:!0};this.unwrapPromises=function(b){return B(b)?(a.unwrapPromises=!!b,this):a.unwrapPromises};this.logPromiseWarnings=function(b){return B(b)?(a.logPromiseWarnings=b,this):a.logPromiseWarnings};this.$get=["$filter","$sniffer","$log",function(c,d,e){a.csp=d.csp;ra=function(b){a.logPromiseWarnings&&!xc.hasOwnProperty(b)&&(xc[b]=
!0,e.warn("[$parse] Promise found in the expression `"+b+"`. Automatic unwrapping of promises in Angular expressions is deprecated."))};return function(d){var e;switch(typeof d){case "string":if(b.hasOwnProperty(d))return b[d];e=new Kb(a);e=(new Xa(e,c,a)).parse(d,!1);"hasOwnProperty"!==d&&(b[d]=e);return e;case "function":return d;default:return w}}}]}function yd(){this.$get=["$rootScope","$exceptionHandler",function(b,a){return zd(function(a){b.$evalAsync(a)},a)}]}function zd(b,a){function c(a){return a}
function d(a){return f(a)}var e=function(){var h=[],m,k;return k={resolve:function(a){if(h){var c=h;h=r;m=g(a);c.length&&b(function(){for(var a,b=0,d=c.length;b<d;b++)a=c[b],m.then(a[0],a[1],a[2])})}},reject:function(a){k.resolve(f(a))},notify:function(a){if(h){var c=h;h.length&&b(function(){for(var b,d=0,e=c.length;d<e;d++)b=c[d],b[2](a)})}},promise:{then:function(b,g,f){var k=e(),C=function(d){try{k.resolve((L(b)?b:c)(d))}catch(e){k.reject(e),a(e)}},y=function(b){try{k.resolve((L(g)?g:d)(b))}catch(c){k.reject(c),
a(c)}},E=function(b){try{k.notify((L(f)?f:c)(b))}catch(d){a(d)}};h?h.push([C,y,E]):m.then(C,y,E);return k.promise},"catch":function(a){return this.then(null,a)},"finally":function(a){function b(a,c){var d=e();c?d.resolve(a):d.reject(a);return d.promise}function d(e,g){var f=null;try{f=(a||c)()}catch(h){return b(h,!1)}return f&&L(f.then)?f.then(function(){return b(e,g)},function(a){return b(a,!1)}):b(e,g)}return this.then(function(a){return d(a,!0)},function(a){return d(a,!1)})}}}},g=function(a){return a&&
L(a.then)?a:{then:function(c){var d=e();b(function(){d.resolve(c(a))});return d.promise}}},f=function(c){return{then:function(g,f){var l=e();b(function(){try{l.resolve((L(f)?f:d)(c))}catch(b){l.reject(b),a(b)}});return l.promise}}};return{defer:e,reject:f,when:function(h,m,k,l){var n=e(),p,s=function(b){try{return(L(m)?m:c)(b)}catch(d){return a(d),f(d)}},C=function(b){try{return(L(k)?k:d)(b)}catch(c){return a(c),f(c)}},y=function(b){try{return(L(l)?l:c)(b)}catch(d){a(d)}};b(function(){g(h).then(function(a){p||
(p=!0,n.resolve(g(a).then(s,C,y)))},function(a){p||(p=!0,n.resolve(C(a)))},function(a){p||n.notify(y(a))})});return n.promise},all:function(a){var b=e(),c=0,d=K(a)?[]:{};q(a,function(a,e){c++;g(a).then(function(a){d.hasOwnProperty(e)||(d[e]=a,--c||b.resolve(d))},function(a){d.hasOwnProperty(e)||b.reject(a)})});0===c&&b.resolve(d);return b.promise}}}function Ad(){var b=10,a=F("$rootScope"),c=null;this.digestTtl=function(a){arguments.length&&(b=a);return b};this.$get=["$injector","$exceptionHandler",
"$parse","$browser",function(d,e,g,f){function h(){this.$id=Ya();this.$$phase=this.$parent=this.$$watchers=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null;this["this"]=this.$root=this;this.$$destroyed=!1;this.$$asyncQueue=[];this.$$postDigestQueue=[];this.$$listeners={};this.$$listenerCount={};this.$$isolateBindings={}}function m(b){if(p.$$phase)throw a("inprog",p.$$phase);p.$$phase=b}function k(a,b){var c=g(a);Oa(c,b);return c}function l(a,b,c){do a.$$listenerCount[c]-=
b,0===a.$$listenerCount[c]&&delete a.$$listenerCount[c];while(a=a.$parent)}function n(){}h.prototype={constructor:h,$new:function(a){a?(a=new h,a.$root=this.$root,a.$$asyncQueue=this.$$asyncQueue,a.$$postDigestQueue=this.$$postDigestQueue):(a=function(){},a.prototype=this,a=new a,a.$id=Ya());a["this"]=a;a.$$listeners={};a.$$listenerCount={};a.$parent=this;a.$$watchers=a.$$nextSibling=a.$$childHead=a.$$childTail=null;a.$$prevSibling=this.$$childTail;this.$$childHead?this.$$childTail=this.$$childTail.$$nextSibling=
a:this.$$childHead=this.$$childTail=a;return a},$watch:function(a,b,d){var e=k(a,"watch"),g=this.$$watchers,f={fn:b,last:n,get:e,exp:a,eq:!!d};c=null;if(!L(b)){var h=k(b||w,"listener");f.fn=function(a,b,c){h(c)}}if("string"==typeof a&&e.constant){var m=f.fn;f.fn=function(a,b,c){m.call(this,a,b,c);Ka(g,f)}}g||(g=this.$$watchers=[]);g.unshift(f);return function(){Ka(g,f);c=null}},$watchCollection:function(a,b){var c=this,d,e,f=0,h=g(a),m=[],k={},l=0;return this.$watch(function(){e=h(c);var a,b;if(X(e))if(qb(e))for(d!==
m&&(d=m,l=d.length=0,f++),a=e.length,l!==a&&(f++,d.length=l=a),b=0;b<a;b++)d[b]!==e[b]&&(f++,d[b]=e[b]);else{d!==k&&(d=k={},l=0,f++);a=0;for(b in e)e.hasOwnProperty(b)&&(a++,d.hasOwnProperty(b)?d[b]!==e[b]&&(f++,d[b]=e[b]):(l++,d[b]=e[b],f++));if(l>a)for(b in f++,d)d.hasOwnProperty(b)&&!e.hasOwnProperty(b)&&(l--,delete d[b])}else d!==e&&(d=e,f++);return f},function(){b(e,d,c)})},$digest:function(){var d,f,g,h,k=this.$$asyncQueue,l=this.$$postDigestQueue,q,v,r=b,N,V=[],J,A,P;m("$digest");c=null;do{v=
!1;for(N=this;k.length;){try{P=k.shift(),P.scope.$eval(P.expression)}catch(B){p.$$phase=null,e(B)}c=null}a:do{if(h=N.$$watchers)for(q=h.length;q--;)try{if(d=h[q])if((f=d.get(N))!==(g=d.last)&&!(d.eq?ua(f,g):"number"==typeof f&&"number"==typeof g&&isNaN(f)&&isNaN(g)))v=!0,c=d,d.last=d.eq?fa(f):f,d.fn(f,g===n?f:g,N),5>r&&(J=4-r,V[J]||(V[J]=[]),A=L(d.exp)?"fn: "+(d.exp.name||d.exp.toString()):d.exp,A+="; newVal: "+pa(f)+"; oldVal: "+pa(g),V[J].push(A));else if(d===c){v=!1;break a}}catch(t){p.$$phase=
null,e(t)}if(!(h=N.$$childHead||N!==this&&N.$$nextSibling))for(;N!==this&&!(h=N.$$nextSibling);)N=N.$parent}while(N=h);if(v&&!r--)throw p.$$phase=null,a("infdig",b,pa(V));}while(v||k.length);for(p.$$phase=null;l.length;)try{l.shift()()}catch(z){e(z)}},$destroy:function(){if(!this.$$destroyed){var a=this.$parent;this.$broadcast("$destroy");this.$$destroyed=!0;this!==p&&(q(this.$$listenerCount,bb(null,l,this)),a.$$childHead==this&&(a.$$childHead=this.$$nextSibling),a.$$childTail==this&&(a.$$childTail=
this.$$prevSibling),this.$$prevSibling&&(this.$$prevSibling.$$nextSibling=this.$$nextSibling),this.$$nextSibling&&(this.$$nextSibling.$$prevSibling=this.$$prevSibling),this.$parent=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null)}},$eval:function(a,b){return g(a)(this,b)},$evalAsync:function(a){p.$$phase||p.$$asyncQueue.length||f.defer(function(){p.$$asyncQueue.length&&p.$digest()});this.$$asyncQueue.push({scope:this,expression:a})},$$postDigest:function(a){this.$$postDigestQueue.push(a)},
$apply:function(a){try{return m("$apply"),this.$eval(a)}catch(b){e(b)}finally{p.$$phase=null;try{p.$digest()}catch(c){throw e(c),c;}}},$on:function(a,b){var c=this.$$listeners[a];c||(this.$$listeners[a]=c=[]);c.push(b);var d=this;do d.$$listenerCount[a]||(d.$$listenerCount[a]=0),d.$$listenerCount[a]++;while(d=d.$parent);var e=this;return function(){c[ab(c,b)]=null;l(e,1,a)}},$emit:function(a,b){var c=[],d,f=this,g=!1,h={name:a,targetScope:f,stopPropagation:function(){g=!0},preventDefault:function(){h.defaultPrevented=
!0},defaultPrevented:!1},m=[h].concat(va.call(arguments,1)),k,l;do{d=f.$$listeners[a]||c;h.currentScope=f;k=0;for(l=d.length;k<l;k++)if(d[k])try{d[k].apply(null,m)}catch(p){e(p)}else d.splice(k,1),k--,l--;if(g)break;f=f.$parent}while(f);return h},$broadcast:function(a,b){for(var c=this,d=this,f={name:a,targetScope:this,preventDefault:function(){f.defaultPrevented=!0},defaultPrevented:!1},g=[f].concat(va.call(arguments,1)),h,k;c=d;){f.currentScope=c;d=c.$$listeners[a]||[];h=0;for(k=d.length;h<k;h++)if(d[h])try{d[h].apply(null,
g)}catch(m){e(m)}else d.splice(h,1),h--,k--;if(!(d=c.$$listenerCount[a]&&c.$$childHead||c!==this&&c.$$nextSibling))for(;c!==this&&!(d=c.$$nextSibling);)c=c.$parent}return f}};var p=new h;return p}]}function Bd(){var b=/^\s*(https?|ftp|mailto|tel|file):/,a=/^\s*(https?|ftp|file):|data:image\//;this.aHrefSanitizationWhitelist=function(a){return B(a)?(b=a,this):b};this.imgSrcSanitizationWhitelist=function(b){return B(b)?(a=b,this):a};this.$get=function(){return function(c,d){var e=d?a:b,g;if(!M||8<=
M)if(g=qa(c).href,""!==g&&!g.match(e))return"unsafe:"+g;return c}}}function Cd(b){if("self"===b)return b;if(D(b)){if(-1<b.indexOf("***"))throw sa("iwcard",b);b=b.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08").replace("\\*\\*",".*").replace("\\*","[^:/.?&;]*");return RegExp("^"+b+"$")}if($a(b))return RegExp("^"+b.source+"$");throw sa("imatcher");}function yc(b){var a=[];B(b)&&q(b,function(b){a.push(Cd(b))});return a}function Dd(){this.SCE_CONTEXTS=ea;var b=["self"],a=[];this.resourceUrlWhitelist=
function(a){arguments.length&&(b=yc(a));return b};this.resourceUrlBlacklist=function(b){arguments.length&&(a=yc(b));return a};this.$get=["$injector",function(c){function d(a){var b=function(a){this.$$unwrapTrustedValue=function(){return a}};a&&(b.prototype=new a);b.prototype.valueOf=function(){return this.$$unwrapTrustedValue()};b.prototype.toString=function(){return this.$$unwrapTrustedValue().toString()};return b}var e=function(a){throw sa("unsafe");};c.has("$sanitize")&&(e=c.get("$sanitize"));
var g=d(),f={};f[ea.HTML]=d(g);f[ea.CSS]=d(g);f[ea.URL]=d(g);f[ea.JS]=d(g);f[ea.RESOURCE_URL]=d(f[ea.URL]);return{trustAs:function(a,b){var c=f.hasOwnProperty(a)?f[a]:null;if(!c)throw sa("icontext",a,b);if(null===b||b===r||""===b)return b;if("string"!==typeof b)throw sa("itype",a);return new c(b)},getTrusted:function(c,d){if(null===d||d===r||""===d)return d;var g=f.hasOwnProperty(c)?f[c]:null;if(g&&d instanceof g)return d.$$unwrapTrustedValue();if(c===ea.RESOURCE_URL){var g=qa(d.toString()),l,n,p=
!1;l=0;for(n=b.length;l<n;l++)if("self"===b[l]?Fb(g):b[l].exec(g.href)){p=!0;break}if(p)for(l=0,n=a.length;l<n;l++)if("self"===a[l]?Fb(g):a[l].exec(g.href)){p=!1;break}if(p)return d;throw sa("insecurl",d.toString());}if(c===ea.HTML)return e(d);throw sa("unsafe");},valueOf:function(a){return a instanceof g?a.$$unwrapTrustedValue():a}}}]}function Ed(){var b=!0;this.enabled=function(a){arguments.length&&(b=!!a);return b};this.$get=["$parse","$sniffer","$sceDelegate",function(a,c,d){if(b&&c.msie&&8>c.msieDocumentMode)throw sa("iequirks");
var e=fa(ea);e.isEnabled=function(){return b};e.trustAs=d.trustAs;e.getTrusted=d.getTrusted;e.valueOf=d.valueOf;b||(e.trustAs=e.getTrusted=function(a,b){return b},e.valueOf=Aa);e.parseAs=function(b,c){var d=a(c);return d.literal&&d.constant?d:function(a,c){return e.getTrusted(b,d(a,c))}};var g=e.parseAs,f=e.getTrusted,h=e.trustAs;q(ea,function(a,b){var c=x(b);e[Pa("parse_as_"+c)]=function(b){return g(a,b)};e[Pa("get_trusted_"+c)]=function(b){return f(a,b)};e[Pa("trust_as_"+c)]=function(b){return h(a,
b)}});return e}]}function Fd(){this.$get=["$window","$document",function(b,a){var c={},d=S((/android (\d+)/.exec(x((b.navigator||{}).userAgent))||[])[1]),e=/Boxee/i.test((b.navigator||{}).userAgent),g=a[0]||{},f=g.documentMode,h,m=/^(Moz|webkit|O|ms)(?=[A-Z])/,k=g.body&&g.body.style,l=!1,n=!1;if(k){for(var p in k)if(l=m.exec(p)){h=l[0];h=h.substr(0,1).toUpperCase()+h.substr(1);break}h||(h="WebkitOpacity"in k&&"webkit");l=!!("transition"in k||h+"Transition"in k);n=!!("animation"in k||h+"Animation"in
k);!d||l&&n||(l=D(g.body.style.webkitTransition),n=D(g.body.style.webkitAnimation))}return{history:!(!b.history||!b.history.pushState||4>d||e),hashchange:"onhashchange"in b&&(!f||7<f),hasEvent:function(a){if("input"==a&&9==M)return!1;if(z(c[a])){var b=g.createElement("div");c[a]="on"+a in b}return c[a]},csp:Tb(),vendorPrefix:h,transitions:l,animations:n,android:d,msie:M,msieDocumentMode:f}}]}function Gd(){this.$get=["$rootScope","$browser","$q","$exceptionHandler",function(b,a,c,d){function e(e,h,
m){var k=c.defer(),l=k.promise,n=B(m)&&!m;h=a.defer(function(){try{k.resolve(e())}catch(a){k.reject(a),d(a)}finally{delete g[l.$$timeoutId]}n||b.$apply()},h);l.$$timeoutId=h;g[h]=k;return l}var g={};e.cancel=function(b){return b&&b.$$timeoutId in g?(g[b.$$timeoutId].reject("canceled"),delete g[b.$$timeoutId],a.defer.cancel(b.$$timeoutId)):!1};return e}]}function qa(b,a){var c=b;M&&(Y.setAttribute("href",c),c=Y.href);Y.setAttribute("href",c);return{href:Y.href,protocol:Y.protocol?Y.protocol.replace(/:$/,
""):"",host:Y.host,search:Y.search?Y.search.replace(/^\?/,""):"",hash:Y.hash?Y.hash.replace(/^#/,""):"",hostname:Y.hostname,port:Y.port,pathname:"/"===Y.pathname.charAt(0)?Y.pathname:"/"+Y.pathname}}function Fb(b){b=D(b)?qa(b):b;return b.protocol===zc.protocol&&b.host===zc.host}function Hd(){this.$get=$(Z)}function Ac(b){function a(d,e){if(X(d)){var g={};q(d,function(b,c){g[c]=a(c,b)});return g}return b.factory(d+c,e)}var c="Filter";this.register=a;this.$get=["$injector",function(a){return function(b){return a.get(b+
c)}}];a("currency",Bc);a("date",Cc);a("filter",Id);a("json",Jd);a("limitTo",Kd);a("lowercase",Ld);a("number",Dc);a("orderBy",Ec);a("uppercase",Md)}function Id(){return function(b,a,c){if(!K(b))return b;var d=typeof c,e=[];e.check=function(a){for(var b=0;b<e.length;b++)if(!e[b](a))return!1;return!0};"function"!==d&&(c="boolean"===d&&c?function(a,b){return Na.equals(a,b)}:function(a,b){b=(""+b).toLowerCase();return-1<(""+a).toLowerCase().indexOf(b)});var g=function(a,b){if("string"==typeof b&&"!"===
b.charAt(0))return!g(a,b.substr(1));switch(typeof a){case "boolean":case "number":case "string":return c(a,b);case "object":switch(typeof b){case "object":return c(a,b);default:for(var d in a)if("$"!==d.charAt(0)&&g(a[d],b))return!0}return!1;case "array":for(d=0;d<a.length;d++)if(g(a[d],b))return!0;return!1;default:return!1}};switch(typeof a){case "boolean":case "number":case "string":a={$:a};case "object":for(var f in a)"$"==f?function(){if(a[f]){var b=f;e.push(function(c){return g(c,a[b])})}}():
function(){if("undefined"!=typeof a[f]){var b=f;e.push(function(c){return g(ub(c,b),a[b])})}}();break;case "function":e.push(a);break;default:return b}for(var d=[],h=0;h<b.length;h++){var m=b[h];e.check(m)&&d.push(m)}return d}}function Bc(b){var a=b.NUMBER_FORMATS;return function(b,d){z(d)&&(d=a.CURRENCY_SYM);return Fc(b,a.PATTERNS[1],a.GROUP_SEP,a.DECIMAL_SEP,2).replace(/\u00A4/g,d)}}function Dc(b){var a=b.NUMBER_FORMATS;return function(b,d){return Fc(b,a.PATTERNS[0],a.GROUP_SEP,a.DECIMAL_SEP,d)}}
function Fc(b,a,c,d,e){if(isNaN(b)||!isFinite(b))return"";var g=0>b;b=Math.abs(b);var f=b+"",h="",m=[],k=!1;if(-1!==f.indexOf("e")){var l=f.match(/([\d\.]+)e(-?)(\d+)/);l&&"-"==l[2]&&l[3]>e+1?f="0":(h=f,k=!0)}if(k)0<e&&(-1<b&&1>b)&&(h=b.toFixed(e));else{f=(f.split(Gc)[1]||"").length;z(e)&&(e=Math.min(Math.max(a.minFrac,f),a.maxFrac));f=Math.pow(10,e);b=Math.round(b*f)/f;b=(""+b).split(Gc);f=b[0];b=b[1]||"";var l=0,n=a.lgSize,p=a.gSize;if(f.length>=n+p)for(l=f.length-n,k=0;k<l;k++)0===(l-k)%p&&0!==
k&&(h+=c),h+=f.charAt(k);for(k=l;k<f.length;k++)0===(f.length-k)%n&&0!==k&&(h+=c),h+=f.charAt(k);for(;b.length<e;)b+="0";e&&"0"!==e&&(h+=d+b.substr(0,e))}m.push(g?a.negPre:a.posPre);m.push(h);m.push(g?a.negSuf:a.posSuf);return m.join("")}function Lb(b,a,c){var d="";0>b&&(d="-",b=-b);for(b=""+b;b.length<a;)b="0"+b;c&&(b=b.substr(b.length-a));return d+b}function W(b,a,c,d){c=c||0;return function(e){e=e["get"+b]();if(0<c||e>-c)e+=c;0===e&&-12==c&&(e=12);return Lb(e,a,d)}}function kb(b,a){return function(c,
d){var e=c["get"+b](),g=Ga(a?"SHORT"+b:b);return d[g][e]}}function Cc(b){function a(a){var b;if(b=a.match(c)){a=new Date(0);var g=0,f=0,h=b[8]?a.setUTCFullYear:a.setFullYear,m=b[8]?a.setUTCHours:a.setHours;b[9]&&(g=S(b[9]+b[10]),f=S(b[9]+b[11]));h.call(a,S(b[1]),S(b[2])-1,S(b[3]));g=S(b[4]||0)-g;f=S(b[5]||0)-f;h=S(b[6]||0);b=Math.round(1E3*parseFloat("0."+(b[7]||0)));m.call(a,g,f,h,b)}return a}var c=/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
return function(c,e){var g="",f=[],h,m;e=e||"mediumDate";e=b.DATETIME_FORMATS[e]||e;D(c)&&(c=Nd.test(c)?S(c):a(c));rb(c)&&(c=new Date(c));if(!Ja(c))return c;for(;e;)(m=Od.exec(e))?(f=f.concat(va.call(m,1)),e=f.pop()):(f.push(e),e=null);q(f,function(a){h=Pd[a];g+=h?h(c,b.DATETIME_FORMATS):a.replace(/(^'|'$)/g,"").replace(/''/g,"'")});return g}}function Jd(){return function(b){return pa(b,!0)}}function Kd(){return function(b,a){if(!K(b)&&!D(b))return b;a=S(a);if(D(b))return a?0<=a?b.slice(0,a):b.slice(a,
b.length):"";var c=[],d,e;a>b.length?a=b.length:a<-b.length&&(a=-b.length);0<a?(d=0,e=a):(d=b.length+a,e=b.length);for(;d<e;d++)c.push(b[d]);return c}}function Ec(b){return function(a,c,d){function e(a,b){return Ma(b)?function(b,c){return a(c,b)}:a}if(!K(a)||!c)return a;c=K(c)?c:[c];c=Qc(c,function(a){var c=!1,d=a||Aa;if(D(a)){if("+"==a.charAt(0)||"-"==a.charAt(0))c="-"==a.charAt(0),a=a.substring(1);d=b(a)}return e(function(a,b){var c;c=d(a);var e=d(b),f=typeof c,g=typeof e;f==g?("string"==f&&(c=
c.toLowerCase(),e=e.toLowerCase()),c=c===e?0:c<e?-1:1):c=f<g?-1:1;return c},c)});for(var g=[],f=0;f<a.length;f++)g.push(a[f]);return g.sort(e(function(a,b){for(var d=0;d<c.length;d++){var e=c[d](a,b);if(0!==e)return e}return 0},d))}}function ta(b){L(b)&&(b={link:b});b.restrict=b.restrict||"AC";return $(b)}function Hc(b,a){function c(a,c){c=c?"-"+cb(c,"-"):"";b.removeClass((a?lb:mb)+c).addClass((a?mb:lb)+c)}var d=this,e=b.parent().controller("form")||nb,g=0,f=d.$error={},h=[];d.$name=a.name||a.ngForm;
d.$dirty=!1;d.$pristine=!0;d.$valid=!0;d.$invalid=!1;e.$addControl(d);b.addClass(Ha);c(!0);d.$addControl=function(a){xa(a.$name,"input");h.push(a);a.$name&&(d[a.$name]=a)};d.$removeControl=function(a){a.$name&&d[a.$name]===a&&delete d[a.$name];q(f,function(b,c){d.$setValidity(c,!0,a)});Ka(h,a)};d.$setValidity=function(a,b,h){var n=f[a];if(b)n&&(Ka(n,h),n.length||(g--,g||(c(b),d.$valid=!0,d.$invalid=!1),f[a]=!1,c(!0,a),e.$setValidity(a,!0,d)));else{g||c(b);if(n){if(-1!=ab(n,h))return}else f[a]=n=[],
g++,c(!1,a),e.$setValidity(a,!1,d);n.push(h);d.$valid=!1;d.$invalid=!0}};d.$setDirty=function(){b.removeClass(Ha).addClass(ob);d.$dirty=!0;d.$pristine=!1;e.$setDirty()};d.$setPristine=function(){b.removeClass(ob).addClass(Ha);d.$dirty=!1;d.$pristine=!0;q(h,function(a){a.$setPristine()})}}function pb(b,a,c,d,e,g){if(!e.android){var f=!1;a.on("compositionstart",function(a){f=!0});a.on("compositionend",function(){f=!1})}var h=function(){if(!f){var e=a.val();Ma(c.ngTrim||"T")&&(e=aa(e));d.$viewValue!==
e&&(b.$$phase?d.$setViewValue(e):b.$apply(function(){d.$setViewValue(e)}))}};if(e.hasEvent("input"))a.on("input",h);else{var m,k=function(){m||(m=g.defer(function(){h();m=null}))};a.on("keydown",function(a){a=a.keyCode;91===a||(15<a&&19>a||37<=a&&40>=a)||k()});if(e.hasEvent("paste"))a.on("paste cut",k)}a.on("change",h);d.$render=function(){a.val(d.$isEmpty(d.$viewValue)?"":d.$viewValue)};var l=c.ngPattern,n=function(a,b){if(d.$isEmpty(b)||a.test(b))return d.$setValidity("pattern",!0),b;d.$setValidity("pattern",
!1);return r};l&&((e=l.match(/^\/(.*)\/([gim]*)$/))?(l=RegExp(e[1],e[2]),e=function(a){return n(l,a)}):e=function(c){var d=b.$eval(l);if(!d||!d.test)throw F("ngPattern")("noregexp",l,d,ga(a));return n(d,c)},d.$formatters.push(e),d.$parsers.push(e));if(c.ngMinlength){var p=S(c.ngMinlength);e=function(a){if(!d.$isEmpty(a)&&a.length<p)return d.$setValidity("minlength",!1),r;d.$setValidity("minlength",!0);return a};d.$parsers.push(e);d.$formatters.push(e)}if(c.ngMaxlength){var s=S(c.ngMaxlength);e=function(a){if(!d.$isEmpty(a)&&
a.length>s)return d.$setValidity("maxlength",!1),r;d.$setValidity("maxlength",!0);return a};d.$parsers.push(e);d.$formatters.push(e)}}function Mb(b,a){b="ngClass"+b;return function(){return{restrict:"AC",link:function(c,d,e){function g(b){if(!0===a||c.$index%2===a){var d=f(b||"");h?ua(b,h)||e.$updateClass(d,f(h)):e.$addClass(d)}h=fa(b)}function f(a){if(K(a))return a.join(" ");if(X(a)){var b=[];q(a,function(a,c){a&&b.push(c)});return b.join(" ")}return a}var h;c.$watch(e[b],g,!0);e.$observe("class",
function(a){g(c.$eval(e[b]))});"ngClass"!==b&&c.$watch("$index",function(d,g){var h=d&1;if(h!==g&1){var n=f(c.$eval(e[b]));h===a?e.$addClass(n):e.$removeClass(n)}})}}}}var x=function(b){return D(b)?b.toLowerCase():b},Ga=function(b){return D(b)?b.toUpperCase():b},M,A,Ba,va=[].slice,Qd=[].push,Za=Object.prototype.toString,La=F("ng"),Na=Z.angular||(Z.angular={}),Ta,Fa,ka=["0","0","0"];M=S((/msie (\d+)/.exec(x(navigator.userAgent))||[])[1]);isNaN(M)&&(M=S((/trident\/.*; rv:(\d+)/.exec(x(navigator.userAgent))||
[])[1]));w.$inject=[];Aa.$inject=[];var aa=function(){return String.prototype.trim?function(b){return D(b)?b.trim():b}:function(b){return D(b)?b.replace(/^\s\s*/,"").replace(/\s\s*$/,""):b}}();Fa=9>M?function(b){b=b.nodeName?b:b[0];return b.scopeName&&"HTML"!=b.scopeName?Ga(b.scopeName+":"+b.nodeName):b.nodeName}:function(b){return b.nodeName?b.nodeName:b[0].nodeName};var Tc=/[A-Z]/g,Rd={full:"1.2.7",major:1,minor:2,dot:7,codeName:"emoji-clairvoyance"},Qa=O.cache={},db=O.expando="ng-"+(new Date).getTime(),
Xc=1,Ic=Z.document.addEventListener?function(b,a,c){b.addEventListener(a,c,!1)}:function(b,a,c){b.attachEvent("on"+a,c)},Ab=Z.document.removeEventListener?function(b,a,c){b.removeEventListener(a,c,!1)}:function(b,a,c){b.detachEvent("on"+a,c)},Vc=/([\:\-\_]+(.))/g,Wc=/^moz([A-Z])/,xb=F("jqLite"),Ea=O.prototype={ready:function(b){function a(){c||(c=!0,b())}var c=!1;"complete"===Q.readyState?setTimeout(a):(this.on("DOMContentLoaded",a),O(Z).on("load",a))},toString:function(){var b=[];q(this,function(a){b.push(""+
a)});return"["+b.join(", ")+"]"},eq:function(b){return 0<=b?A(this[b]):A(this[this.length+b])},length:0,push:Qd,sort:[].sort,splice:[].splice},fb={};q("multiple selected checked disabled readOnly required open".split(" "),function(b){fb[x(b)]=b});var fc={};q("input select option textarea button form details".split(" "),function(b){fc[Ga(b)]=!0});q({data:bc,inheritedData:eb,scope:function(b){return A(b).data("$scope")||eb(b.parentNode||b,["$isolateScope","$scope"])},isolateScope:function(b){return A(b).data("$isolateScope")||
A(b).data("$isolateScopeNoTemplate")},controller:cc,injector:function(b){return eb(b,"$injector")},removeAttr:function(b,a){b.removeAttribute(a)},hasClass:Bb,css:function(b,a,c){a=Pa(a);if(B(c))b.style[a]=c;else{var d;8>=M&&(d=b.currentStyle&&b.currentStyle[a],""===d&&(d="auto"));d=d||b.style[a];8>=M&&(d=""===d?r:d);return d}},attr:function(b,a,c){var d=x(a);if(fb[d])if(B(c))c?(b[a]=!0,b.setAttribute(a,d)):(b[a]=!1,b.removeAttribute(d));else return b[a]||(b.attributes.getNamedItem(a)||w).specified?
d:r;else if(B(c))b.setAttribute(a,c);else if(b.getAttribute)return b=b.getAttribute(a,2),null===b?r:b},prop:function(b,a,c){if(B(c))b[a]=c;else return b[a]},text:function(){function b(b,d){var e=a[b.nodeType];if(z(d))return e?b[e]:"";b[e]=d}var a=[];9>M?(a[1]="innerText",a[3]="nodeValue"):a[1]=a[3]="textContent";b.$dv="";return b}(),val:function(b,a){if(z(a)){if("SELECT"===Fa(b)&&b.multiple){var c=[];q(b.options,function(a){a.selected&&c.push(a.value||a.text)});return 0===c.length?null:c}return b.value}b.value=
a},html:function(b,a){if(z(a))return b.innerHTML;for(var c=0,d=b.childNodes;c<d.length;c++)Ca(d[c]);b.innerHTML=a},empty:dc},function(b,a){O.prototype[a]=function(a,d){var e,g;if(b!==dc&&(2==b.length&&b!==Bb&&b!==cc?a:d)===r){if(X(a)){for(e=0;e<this.length;e++)if(b===bc)b(this[e],a);else for(g in a)b(this[e],g,a[g]);return this}e=b.$dv;g=e===r?Math.min(this.length,1):this.length;for(var f=0;f<g;f++){var h=b(this[f],a,d);e=e?e+h:h}return e}for(e=0;e<this.length;e++)b(this[e],a,d);return this}});q({removeData:$b,
dealoc:Ca,on:function a(c,d,e,g){if(B(g))throw xb("onargs");var f=la(c,"events"),h=la(c,"handle");f||la(c,"events",f={});h||la(c,"handle",h=Yc(c,f));q(d.split(" "),function(d){var g=f[d];if(!g){if("mouseenter"==d||"mouseleave"==d){var l=Q.body.contains||Q.body.compareDocumentPosition?function(a,c){var d=9===a.nodeType?a.documentElement:a,e=c&&c.parentNode;return a===e||!!(e&&1===e.nodeType&&(d.contains?d.contains(e):a.compareDocumentPosition&&a.compareDocumentPosition(e)&16))}:function(a,c){if(c)for(;c=
c.parentNode;)if(c===a)return!0;return!1};f[d]=[];a(c,{mouseleave:"mouseout",mouseenter:"mouseover"}[d],function(a){var c=a.relatedTarget;c&&(c===this||l(this,c))||h(a,d)})}else Ic(c,d,h),f[d]=[];g=f[d]}g.push(e)})},off:ac,one:function(a,c,d){a=A(a);a.on(c,function g(){a.off(c,d);a.off(c,g)});a.on(c,d)},replaceWith:function(a,c){var d,e=a.parentNode;Ca(a);q(new O(c),function(c){d?e.insertBefore(c,d.nextSibling):e.replaceChild(c,a);d=c})},children:function(a){var c=[];q(a.childNodes,function(a){1===
a.nodeType&&c.push(a)});return c},contents:function(a){return a.childNodes||[]},append:function(a,c){q(new O(c),function(c){1!==a.nodeType&&11!==a.nodeType||a.appendChild(c)})},prepend:function(a,c){if(1===a.nodeType){var d=a.firstChild;q(new O(c),function(c){a.insertBefore(c,d)})}},wrap:function(a,c){c=A(c)[0];var d=a.parentNode;d&&d.replaceChild(c,a);c.appendChild(a)},remove:function(a){Ca(a);var c=a.parentNode;c&&c.removeChild(a)},after:function(a,c){var d=a,e=a.parentNode;q(new O(c),function(a){e.insertBefore(a,
d.nextSibling);d=a})},addClass:Db,removeClass:Cb,toggleClass:function(a,c,d){z(d)&&(d=!Bb(a,c));(d?Db:Cb)(a,c)},parent:function(a){return(a=a.parentNode)&&11!==a.nodeType?a:null},next:function(a){if(a.nextElementSibling)return a.nextElementSibling;for(a=a.nextSibling;null!=a&&1!==a.nodeType;)a=a.nextSibling;return a},find:function(a,c){return a.getElementsByTagName?a.getElementsByTagName(c):[]},clone:zb,triggerHandler:function(a,c,d){c=(la(a,"events")||{})[c];d=d||[];var e=[{preventDefault:w,stopPropagation:w}];
q(c,function(c){c.apply(a,e.concat(d))})}},function(a,c){O.prototype[c]=function(c,e,g){for(var f,h=0;h<this.length;h++)z(f)?(f=a(this[h],c,e,g),B(f)&&(f=A(f))):yb(f,a(this[h],c,e,g));return B(f)?f:this};O.prototype.bind=O.prototype.on;O.prototype.unbind=O.prototype.off});Ra.prototype={put:function(a,c){this[Da(a)]=c},get:function(a){return this[Da(a)]},remove:function(a){var c=this[a=Da(a)];delete this[a];return c}};var $c=/^function\s*[^\(]*\(\s*([^\)]*)\)/m,ad=/,/,bd=/^\s*(_?)(\S+?)\1\s*$/,Zc=
/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,Sa=F("$injector"),Sd=F("$animate"),Td=["$provide",function(a){this.$$selectors={};this.register=function(c,d){var e=c+"-animation";if(c&&"."!=c.charAt(0))throw Sd("notcsel",c);this.$$selectors[c.substr(1)]=e;a.factory(e,d)};this.classNameFilter=function(a){1===arguments.length&&(this.$$classNameFilter=a instanceof RegExp?a:null);return this.$$classNameFilter};this.$get=["$timeout",function(a){return{enter:function(d,e,g,f){g?g.after(d):(e&&e[0]||(e=g.parent()),e.append(d));
f&&a(f,0,!1)},leave:function(d,e){d.remove();e&&a(e,0,!1)},move:function(a,c,g,f){this.enter(a,c,g,f)},addClass:function(d,e,g){e=D(e)?e:K(e)?e.join(" "):"";q(d,function(a){Db(a,e)});g&&a(g,0,!1)},removeClass:function(d,e,g){e=D(e)?e:K(e)?e.join(" "):"";q(d,function(a){Cb(a,e)});g&&a(g,0,!1)},enabled:w}}]}],ja=F("$compile");ic.$inject=["$provide","$$sanitizeUriProvider"];var hd=/^(x[\:\-_]|data[\:\-_])/i,oc=F("$interpolate"),Ud=/^([^\?#]*)(\?([^#]*))?(#(.*))?$/,sd={http:80,https:443,ftp:21},Hb=F("$location");
tc.prototype=Ib.prototype=sc.prototype={$$html5:!1,$$replace:!1,absUrl:ib("$$absUrl"),url:function(a,c){if(z(a))return this.$$url;var d=Ud.exec(a);d[1]&&this.path(decodeURIComponent(d[1]));(d[2]||d[1])&&this.search(d[3]||"");this.hash(d[5]||"",c);return this},protocol:ib("$$protocol"),host:ib("$$host"),port:ib("$$port"),path:uc("$$path",function(a){return"/"==a.charAt(0)?a:"/"+a}),search:function(a,c){switch(arguments.length){case 0:return this.$$search;case 1:if(D(a))this.$$search=Wb(a);else if(X(a))this.$$search=
a;else throw Hb("isrcharg");break;default:z(c)||null===c?delete this.$$search[a]:this.$$search[a]=c}this.$$compose();return this},hash:uc("$$hash",Aa),replace:function(){this.$$replace=!0;return this}};var ya=F("$parse"),xc={},ra,Ia={"null":function(){return null},"true":function(){return!0},"false":function(){return!1},undefined:w,"+":function(a,c,d,e){d=d(a,c);e=e(a,c);return B(d)?B(e)?d+e:d:B(e)?e:r},"-":function(a,c,d,e){d=d(a,c);e=e(a,c);return(B(d)?d:0)-(B(e)?e:0)},"*":function(a,c,d,e){return d(a,
c)*e(a,c)},"/":function(a,c,d,e){return d(a,c)/e(a,c)},"%":function(a,c,d,e){return d(a,c)%e(a,c)},"^":function(a,c,d,e){return d(a,c)^e(a,c)},"=":w,"===":function(a,c,d,e){return d(a,c)===e(a,c)},"!==":function(a,c,d,e){return d(a,c)!==e(a,c)},"==":function(a,c,d,e){return d(a,c)==e(a,c)},"!=":function(a,c,d,e){return d(a,c)!=e(a,c)},"<":function(a,c,d,e){return d(a,c)<e(a,c)},">":function(a,c,d,e){return d(a,c)>e(a,c)},"<=":function(a,c,d,e){return d(a,c)<=e(a,c)},">=":function(a,c,d,e){return d(a,
c)>=e(a,c)},"&&":function(a,c,d,e){return d(a,c)&&e(a,c)},"||":function(a,c,d,e){return d(a,c)||e(a,c)},"&":function(a,c,d,e){return d(a,c)&e(a,c)},"|":function(a,c,d,e){return e(a,c)(a,c,d(a,c))},"!":function(a,c,d){return!d(a,c)}},Vd={n:"\n",f:"\f",r:"\r",t:"\t",v:"\v","'":"'",'"':'"'},Kb=function(a){this.options=a};Kb.prototype={constructor:Kb,lex:function(a){this.text=a;this.index=0;this.ch=r;this.lastCh=":";this.tokens=[];var c;for(a=[];this.index<this.text.length;){this.ch=this.text.charAt(this.index);
if(this.is("\"'"))this.readString(this.ch);else if(this.isNumber(this.ch)||this.is(".")&&this.isNumber(this.peek()))this.readNumber();else if(this.isIdent(this.ch))this.readIdent(),this.was("{,")&&("{"===a[0]&&(c=this.tokens[this.tokens.length-1]))&&(c.json=-1===c.text.indexOf("."));else if(this.is("(){}[].,;:?"))this.tokens.push({index:this.index,text:this.ch,json:this.was(":[,")&&this.is("{[")||this.is("}]:,")}),this.is("{[")&&a.unshift(this.ch),this.is("}]")&&a.shift(),this.index++;else if(this.isWhitespace(this.ch)){this.index++;
continue}else{var d=this.ch+this.peek(),e=d+this.peek(2),g=Ia[this.ch],f=Ia[d],h=Ia[e];h?(this.tokens.push({index:this.index,text:e,fn:h}),this.index+=3):f?(this.tokens.push({index:this.index,text:d,fn:f}),this.index+=2):g?(this.tokens.push({index:this.index,text:this.ch,fn:g,json:this.was("[,:")&&this.is("+-")}),this.index+=1):this.throwError("Unexpected next character ",this.index,this.index+1)}this.lastCh=this.ch}return this.tokens},is:function(a){return-1!==a.indexOf(this.ch)},was:function(a){return-1!==
a.indexOf(this.lastCh)},peek:function(a){a=a||1;return this.index+a<this.text.length?this.text.charAt(this.index+a):!1},isNumber:function(a){return"0"<=a&&"9">=a},isWhitespace:function(a){return" "===a||"\r"===a||"\t"===a||"\n"===a||"\v"===a||"\u00a0"===a},isIdent:function(a){return"a"<=a&&"z">=a||"A"<=a&&"Z">=a||"_"===a||"$"===a},isExpOperator:function(a){return"-"===a||"+"===a||this.isNumber(a)},throwError:function(a,c,d){d=d||this.index;c=B(c)?"s "+c+"-"+this.index+" ["+this.text.substring(c,d)+
"]":" "+d;throw ya("lexerr",a,c,this.text);},readNumber:function(){for(var a="",c=this.index;this.index<this.text.length;){var d=x(this.text.charAt(this.index));if("."==d||this.isNumber(d))a+=d;else{var e=this.peek();if("e"==d&&this.isExpOperator(e))a+=d;else if(this.isExpOperator(d)&&e&&this.isNumber(e)&&"e"==a.charAt(a.length-1))a+=d;else if(!this.isExpOperator(d)||e&&this.isNumber(e)||"e"!=a.charAt(a.length-1))break;else this.throwError("Invalid exponent")}this.index++}a*=1;this.tokens.push({index:c,
text:a,json:!0,fn:function(){return a}})},readIdent:function(){for(var a=this,c="",d=this.index,e,g,f,h;this.index<this.text.length;){h=this.text.charAt(this.index);if("."===h||this.isIdent(h)||this.isNumber(h))"."===h&&(e=this.index),c+=h;else break;this.index++}if(e)for(g=this.index;g<this.text.length;){h=this.text.charAt(g);if("("===h){f=c.substr(e-d+1);c=c.substr(0,e-d);this.index=g;break}if(this.isWhitespace(h))g++;else break}d={index:d,text:c};if(Ia.hasOwnProperty(c))d.fn=Ia[c],d.json=Ia[c];
else{var m=wc(c,this.options,this.text);d.fn=t(function(a,c){return m(a,c)},{assign:function(d,e){return jb(d,c,e,a.text,a.options)}})}this.tokens.push(d);f&&(this.tokens.push({index:e,text:".",json:!1}),this.tokens.push({index:e+1,text:f,json:!1}))},readString:function(a){var c=this.index;this.index++;for(var d="",e=a,g=!1;this.index<this.text.length;){var f=this.text.charAt(this.index),e=e+f;if(g)"u"===f?(f=this.text.substring(this.index+1,this.index+5),f.match(/[\da-f]{4}/i)||this.throwError("Invalid unicode escape [\\u"+
f+"]"),this.index+=4,d+=String.fromCharCode(parseInt(f,16))):d=(g=Vd[f])?d+g:d+f,g=!1;else if("\\"===f)g=!0;else{if(f===a){this.index++;this.tokens.push({index:c,text:e,string:d,json:!0,fn:function(){return d}});return}d+=f}this.index++}this.throwError("Unterminated quote",c)}};var Xa=function(a,c,d){this.lexer=a;this.$filter=c;this.options=d};Xa.ZERO=function(){return 0};Xa.prototype={constructor:Xa,parse:function(a,c){this.text=a;this.json=c;this.tokens=this.lexer.lex(a);c&&(this.assignment=this.logicalOR,
this.functionCall=this.fieldAccess=this.objectIndex=this.filterChain=function(){this.throwError("is not valid json",{text:a,index:0})});var d=c?this.primary():this.statements();0!==this.tokens.length&&this.throwError("is an unexpected token",this.tokens[0]);d.literal=!!d.literal;d.constant=!!d.constant;return d},primary:function(){var a;if(this.expect("("))a=this.filterChain(),this.consume(")");else if(this.expect("["))a=this.arrayDeclaration();else if(this.expect("{"))a=this.object();else{var c=
this.expect();(a=c.fn)||this.throwError("not a primary expression",c);c.json&&(a.constant=!0,a.literal=!0)}for(var d;c=this.expect("(","[",".");)"("===c.text?(a=this.functionCall(a,d),d=null):"["===c.text?(d=a,a=this.objectIndex(a)):"."===c.text?(d=a,a=this.fieldAccess(a)):this.throwError("IMPOSSIBLE");return a},throwError:function(a,c){throw ya("syntax",c.text,a,c.index+1,this.text,this.text.substring(c.index));},peekToken:function(){if(0===this.tokens.length)throw ya("ueoe",this.text);return this.tokens[0]},
peek:function(a,c,d,e){if(0<this.tokens.length){var g=this.tokens[0],f=g.text;if(f===a||f===c||f===d||f===e||!(a||c||d||e))return g}return!1},expect:function(a,c,d,e){return(a=this.peek(a,c,d,e))?(this.json&&!a.json&&this.throwError("is not valid json",a),this.tokens.shift(),a):!1},consume:function(a){this.expect(a)||this.throwError("is unexpected, expecting ["+a+"]",this.peek())},unaryFn:function(a,c){return t(function(d,e){return a(d,e,c)},{constant:c.constant})},ternaryFn:function(a,c,d){return t(function(e,
g){return a(e,g)?c(e,g):d(e,g)},{constant:a.constant&&c.constant&&d.constant})},binaryFn:function(a,c,d){return t(function(e,g){return c(e,g,a,d)},{constant:a.constant&&d.constant})},statements:function(){for(var a=[];;)if(0<this.tokens.length&&!this.peek("}",")",";","]")&&a.push(this.filterChain()),!this.expect(";"))return 1===a.length?a[0]:function(c,d){for(var e,g=0;g<a.length;g++){var f=a[g];f&&(e=f(c,d))}return e}},filterChain:function(){for(var a=this.expression(),c;;)if(c=this.expect("|"))a=
this.binaryFn(a,c.fn,this.filter());else return a},filter:function(){for(var a=this.expect(),c=this.$filter(a.text),d=[];;)if(a=this.expect(":"))d.push(this.expression());else{var e=function(a,e,h){h=[h];for(var m=0;m<d.length;m++)h.push(d[m](a,e));return c.apply(a,h)};return function(){return e}}},expression:function(){return this.assignment()},assignment:function(){var a=this.ternary(),c,d;return(d=this.expect("="))?(a.assign||this.throwError("implies assignment but ["+this.text.substring(0,d.index)+
"] can not be assigned to",d),c=this.ternary(),function(d,g){return a.assign(d,c(d,g),g)}):a},ternary:function(){var a=this.logicalOR(),c,d;if(this.expect("?")){c=this.ternary();if(d=this.expect(":"))return this.ternaryFn(a,c,this.ternary());this.throwError("expected :",d)}else return a},logicalOR:function(){for(var a=this.logicalAND(),c;;)if(c=this.expect("||"))a=this.binaryFn(a,c.fn,this.logicalAND());else return a},logicalAND:function(){var a=this.equality(),c;if(c=this.expect("&&"))a=this.binaryFn(a,
c.fn,this.logicalAND());return a},equality:function(){var a=this.relational(),c;if(c=this.expect("==","!=","===","!=="))a=this.binaryFn(a,c.fn,this.equality());return a},relational:function(){var a=this.additive(),c;if(c=this.expect("<",">","<=",">="))a=this.binaryFn(a,c.fn,this.relational());return a},additive:function(){for(var a=this.multiplicative(),c;c=this.expect("+","-");)a=this.binaryFn(a,c.fn,this.multiplicative());return a},multiplicative:function(){for(var a=this.unary(),c;c=this.expect("*",
"/","%");)a=this.binaryFn(a,c.fn,this.unary());return a},unary:function(){var a;return this.expect("+")?this.primary():(a=this.expect("-"))?this.binaryFn(Xa.ZERO,a.fn,this.unary()):(a=this.expect("!"))?this.unaryFn(a.fn,this.unary()):this.primary()},fieldAccess:function(a){var c=this,d=this.expect().text,e=wc(d,this.options,this.text);return t(function(c,d,h){return e(h||a(c,d),d)},{assign:function(e,f,h){return jb(a(e,h),d,f,c.text,c.options)}})},objectIndex:function(a){var c=this,d=this.expression();
this.consume("]");return t(function(e,g){var f=a(e,g),h=d(e,g),m;if(!f)return r;(f=Wa(f[h],c.text))&&(f.then&&c.options.unwrapPromises)&&(m=f,"$$v"in f||(m.$$v=r,m.then(function(a){m.$$v=a})),f=f.$$v);return f},{assign:function(e,g,f){var h=d(e,f);return Wa(a(e,f),c.text)[h]=g}})},functionCall:function(a,c){var d=[];if(")"!==this.peekToken().text){do d.push(this.expression());while(this.expect(","))}this.consume(")");var e=this;return function(g,f){for(var h=[],m=c?c(g,f):g,k=0;k<d.length;k++)h.push(d[k](g,
f));k=a(g,f,m)||w;Wa(m,e.text);Wa(k,e.text);h=k.apply?k.apply(m,h):k(h[0],h[1],h[2],h[3],h[4]);return Wa(h,e.text)}},arrayDeclaration:function(){var a=[],c=!0;if("]"!==this.peekToken().text){do{var d=this.expression();a.push(d);d.constant||(c=!1)}while(this.expect(","))}this.consume("]");return t(function(c,d){for(var f=[],h=0;h<a.length;h++)f.push(a[h](c,d));return f},{literal:!0,constant:c})},object:function(){var a=[],c=!0;if("}"!==this.peekToken().text){do{var d=this.expect(),d=d.string||d.text;
this.consume(":");var e=this.expression();a.push({key:d,value:e});e.constant||(c=!1)}while(this.expect(","))}this.consume("}");return t(function(c,d){for(var e={},m=0;m<a.length;m++){var k=a[m];e[k.key]=k.value(c,d)}return e},{literal:!0,constant:c})}};var Jb={},sa=F("$sce"),ea={HTML:"html",CSS:"css",URL:"url",RESOURCE_URL:"resourceUrl",JS:"js"},Y=Q.createElement("a"),zc=qa(Z.location.href,!0);Ac.$inject=["$provide"];Bc.$inject=["$locale"];Dc.$inject=["$locale"];var Gc=".",Pd={yyyy:W("FullYear",4),
yy:W("FullYear",2,0,!0),y:W("FullYear",1),MMMM:kb("Month"),MMM:kb("Month",!0),MM:W("Month",2,1),M:W("Month",1,1),dd:W("Date",2),d:W("Date",1),HH:W("Hours",2),H:W("Hours",1),hh:W("Hours",2,-12),h:W("Hours",1,-12),mm:W("Minutes",2),m:W("Minutes",1),ss:W("Seconds",2),s:W("Seconds",1),sss:W("Milliseconds",3),EEEE:kb("Day"),EEE:kb("Day",!0),a:function(a,c){return 12>a.getHours()?c.AMPMS[0]:c.AMPMS[1]},Z:function(a){a=-1*a.getTimezoneOffset();return a=(0<=a?"+":"")+(Lb(Math[0<a?"floor":"ceil"](a/60),2)+
Lb(Math.abs(a%60),2))}},Od=/((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,Nd=/^\-?\d+$/;Cc.$inject=["$locale"];var Ld=$(x),Md=$(Ga);Ec.$inject=["$parse"];var Wd=$({restrict:"E",compile:function(a,c){8>=M&&(c.href||c.name||c.$set("href",""),a.append(Q.createComment("IE fix")));if(!c.href&&!c.name)return function(a,c){c.on("click",function(a){c.attr("href")||a.preventDefault()})}}}),Nb={};q(fb,function(a,c){if("multiple"!=a){var d=ma("ng-"+c);Nb[d]=function(){return{priority:100,
compile:function(){return function(a,g,f){a.$watch(f[d],function(a){f.$set(c,!!a)})}}}}}});q(["src","srcset","href"],function(a){var c=ma("ng-"+a);Nb[c]=function(){return{priority:99,link:function(d,e,g){g.$observe(c,function(c){c&&(g.$set(a,c),M&&e.prop(a,g[a]))})}}}});var nb={$addControl:w,$removeControl:w,$setValidity:w,$setDirty:w,$setPristine:w};Hc.$inject=["$element","$attrs","$scope"];var Jc=function(a){return["$timeout",function(c){return{name:"form",restrict:a?"EAC":"E",controller:Hc,compile:function(){return{pre:function(a,
e,g,f){if(!g.action){var h=function(a){a.preventDefault?a.preventDefault():a.returnValue=!1};Ic(e[0],"submit",h);e.on("$destroy",function(){c(function(){Ab(e[0],"submit",h)},0,!1)})}var m=e.parent().controller("form"),k=g.name||g.ngForm;k&&jb(a,k,f,k);if(m)e.on("$destroy",function(){m.$removeControl(f);k&&jb(a,k,r,k);t(f,nb)})}}}}}]},Xd=Jc(),Yd=Jc(!0),Zd=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,$d=/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/,ae=
/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,Kc={text:pb,number:function(a,c,d,e,g,f){pb(a,c,d,e,g,f);e.$parsers.push(function(a){var c=e.$isEmpty(a);if(c||ae.test(a))return e.$setValidity("number",!0),""===a?null:c?a:parseFloat(a);e.$setValidity("number",!1);return r});e.$formatters.push(function(a){return e.$isEmpty(a)?"":""+a});d.min&&(a=function(a){var c=parseFloat(d.min);if(!e.$isEmpty(a)&&a<c)return e.$setValidity("min",!1),r;e.$setValidity("min",!0);return a},e.$parsers.push(a),e.$formatters.push(a));
d.max&&(a=function(a){var c=parseFloat(d.max);if(!e.$isEmpty(a)&&a>c)return e.$setValidity("max",!1),r;e.$setValidity("max",!0);return a},e.$parsers.push(a),e.$formatters.push(a));e.$formatters.push(function(a){if(e.$isEmpty(a)||rb(a))return e.$setValidity("number",!0),a;e.$setValidity("number",!1);return r})},url:function(a,c,d,e,g,f){pb(a,c,d,e,g,f);a=function(a){if(e.$isEmpty(a)||Zd.test(a))return e.$setValidity("url",!0),a;e.$setValidity("url",!1);return r};e.$formatters.push(a);e.$parsers.push(a)},
email:function(a,c,d,e,g,f){pb(a,c,d,e,g,f);a=function(a){if(e.$isEmpty(a)||$d.test(a))return e.$setValidity("email",!0),a;e.$setValidity("email",!1);return r};e.$formatters.push(a);e.$parsers.push(a)},radio:function(a,c,d,e){z(d.name)&&c.attr("name",Ya());c.on("click",function(){c[0].checked&&a.$apply(function(){e.$setViewValue(d.value)})});e.$render=function(){c[0].checked=d.value==e.$viewValue};d.$observe("value",e.$render)},checkbox:function(a,c,d,e){var g=d.ngTrueValue,f=d.ngFalseValue;D(g)||
(g=!0);D(f)||(f=!1);c.on("click",function(){a.$apply(function(){e.$setViewValue(c[0].checked)})});e.$render=function(){c[0].checked=e.$viewValue};e.$isEmpty=function(a){return a!==g};e.$formatters.push(function(a){return a===g});e.$parsers.push(function(a){return a?g:f})},hidden:w,button:w,submit:w,reset:w},Lc=["$browser","$sniffer",function(a,c){return{restrict:"E",require:"?ngModel",link:function(d,e,g,f){f&&(Kc[x(g.type)]||Kc.text)(d,e,g,f,c,a)}}}],mb="ng-valid",lb="ng-invalid",Ha="ng-pristine",
ob="ng-dirty",be=["$scope","$exceptionHandler","$attrs","$element","$parse",function(a,c,d,e,g){function f(a,c){c=c?"-"+cb(c,"-"):"";e.removeClass((a?lb:mb)+c).addClass((a?mb:lb)+c)}this.$modelValue=this.$viewValue=Number.NaN;this.$parsers=[];this.$formatters=[];this.$viewChangeListeners=[];this.$pristine=!0;this.$dirty=!1;this.$valid=!0;this.$invalid=!1;this.$name=d.name;var h=g(d.ngModel),m=h.assign;if(!m)throw F("ngModel")("nonassign",d.ngModel,ga(e));this.$render=w;this.$isEmpty=function(a){return z(a)||
""===a||null===a||a!==a};var k=e.inheritedData("$formController")||nb,l=0,n=this.$error={};e.addClass(Ha);f(!0);this.$setValidity=function(a,c){n[a]!==!c&&(c?(n[a]&&l--,l||(f(!0),this.$valid=!0,this.$invalid=!1)):(f(!1),this.$invalid=!0,this.$valid=!1,l++),n[a]=!c,f(c,a),k.$setValidity(a,c,this))};this.$setPristine=function(){this.$dirty=!1;this.$pristine=!0;e.removeClass(ob).addClass(Ha)};this.$setViewValue=function(d){this.$viewValue=d;this.$pristine&&(this.$dirty=!0,this.$pristine=!1,e.removeClass(Ha).addClass(ob),
k.$setDirty());q(this.$parsers,function(a){d=a(d)});this.$modelValue!==d&&(this.$modelValue=d,m(a,d),q(this.$viewChangeListeners,function(a){try{a()}catch(d){c(d)}}))};var p=this;a.$watch(function(){var c=h(a);if(p.$modelValue!==c){var d=p.$formatters,e=d.length;for(p.$modelValue=c;e--;)c=d[e](c);p.$viewValue!==c&&(p.$viewValue=c,p.$render())}return c})}],ce=function(){return{require:["ngModel","^?form"],controller:be,link:function(a,c,d,e){var g=e[0],f=e[1]||nb;f.$addControl(g);a.$on("$destroy",
function(){f.$removeControl(g)})}}},de=$({require:"ngModel",link:function(a,c,d,e){e.$viewChangeListeners.push(function(){a.$eval(d.ngChange)})}}),Mc=function(){return{require:"?ngModel",link:function(a,c,d,e){if(e){d.required=!0;var g=function(a){if(d.required&&e.$isEmpty(a))e.$setValidity("required",!1);else return e.$setValidity("required",!0),a};e.$formatters.push(g);e.$parsers.unshift(g);d.$observe("required",function(){g(e.$viewValue)})}}}},ee=function(){return{require:"ngModel",link:function(a,
c,d,e){var g=(a=/\/(.*)\//.exec(d.ngList))&&RegExp(a[1])||d.ngList||",";e.$parsers.push(function(a){if(!z(a)){var c=[];a&&q(a.split(g),function(a){a&&c.push(aa(a))});return c}});e.$formatters.push(function(a){return K(a)?a.join(", "):r});e.$isEmpty=function(a){return!a||!a.length}}}},fe=/^(true|false|\d+)$/,ge=function(){return{priority:100,compile:function(a,c){return fe.test(c.ngValue)?function(a,c,g){g.$set("value",a.$eval(g.ngValue))}:function(a,c,g){a.$watch(g.ngValue,function(a){g.$set("value",
a)})}}}},he=ta(function(a,c,d){c.addClass("ng-binding").data("$binding",d.ngBind);a.$watch(d.ngBind,function(a){c.text(a==r?"":a)})}),ie=["$interpolate",function(a){return function(c,d,e){c=a(d.attr(e.$attr.ngBindTemplate));d.addClass("ng-binding").data("$binding",c);e.$observe("ngBindTemplate",function(a){d.text(a)})}}],je=["$sce","$parse",function(a,c){return function(d,e,g){e.addClass("ng-binding").data("$binding",g.ngBindHtml);var f=c(g.ngBindHtml);d.$watch(function(){return(f(d)||"").toString()},
function(c){e.html(a.getTrustedHtml(f(d))||"")})}}],ke=Mb("",!0),le=Mb("Odd",0),me=Mb("Even",1),ne=ta({compile:function(a,c){c.$set("ngCloak",r);a.removeClass("ng-cloak")}}),oe=[function(){return{scope:!0,controller:"@",priority:500}}],Nc={};q("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "),function(a){var c=ma("ng-"+a);Nc[c]=["$parse",function(d){return{compile:function(e,g){var f=d(g[c]);return function(c,
d,e){d.on(x(a),function(a){c.$apply(function(){f(c,{$event:a})})})}}}}]});var pe=["$animate",function(a){return{transclude:"element",priority:600,terminal:!0,restrict:"A",$$tlb:!0,link:function(c,d,e,g,f){var h,m;c.$watch(e.ngIf,function(g){Ma(g)?m||(m=c.$new(),f(m,function(c){c[c.length++]=Q.createComment(" end ngIf: "+e.ngIf+" ");h={clone:c};a.enter(c,d.parent(),d)})):(m&&(m.$destroy(),m=null),h&&(a.leave(vb(h.clone)),h=null))})}}}],qe=["$http","$templateCache","$anchorScroll","$animate","$sce",
function(a,c,d,e,g){return{restrict:"ECA",priority:400,terminal:!0,transclude:"element",controller:Na.noop,compile:function(f,h){var m=h.ngInclude||h.src,k=h.onload||"",l=h.autoscroll;return function(f,h,q,r,y){var A=0,u,t,H=function(){u&&(u.$destroy(),u=null);t&&(e.leave(t),t=null)};f.$watch(g.parseAsResourceUrl(m),function(g){var m=function(){!B(l)||l&&!f.$eval(l)||d()},q=++A;g?(a.get(g,{cache:c}).success(function(a){if(q===A){var c=f.$new();r.template=a;a=y(c,function(a){H();e.enter(a,null,h,m)});
u=c;t=a;u.$emit("$includeContentLoaded");f.$eval(k)}}).error(function(){q===A&&H()}),f.$emit("$includeContentRequested")):(H(),r.template=null)})}}}}],re=["$compile",function(a){return{restrict:"ECA",priority:-400,require:"ngInclude",link:function(c,d,e,g){d.html(g.template);a(d.contents())(c)}}}],se=ta({priority:450,compile:function(){return{pre:function(a,c,d){a.$eval(d.ngInit)}}}}),te=ta({terminal:!0,priority:1E3}),ue=["$locale","$interpolate",function(a,c){var d=/{}/g;return{restrict:"EA",link:function(e,
g,f){var h=f.count,m=f.$attr.when&&g.attr(f.$attr.when),k=f.offset||0,l=e.$eval(m)||{},n={},p=c.startSymbol(),s=c.endSymbol(),r=/^when(Minus)?(.+)$/;q(f,function(a,c){r.test(c)&&(l[x(c.replace("when","").replace("Minus","-"))]=g.attr(f.$attr[c]))});q(l,function(a,e){n[e]=c(a.replace(d,p+h+"-"+k+s))});e.$watch(function(){var c=parseFloat(e.$eval(h));if(isNaN(c))return"";c in l||(c=a.pluralCat(c-k));return n[c](e,g,!0)},function(a){g.text(a)})}}}],ve=["$parse","$animate",function(a,c){var d=F("ngRepeat");
return{transclude:"element",priority:1E3,terminal:!0,$$tlb:!0,link:function(e,g,f,h,m){var k=f.ngRepeat,l=k.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),n,p,s,r,y,t,u={$id:Da};if(!l)throw d("iexp",k);f=l[1];h=l[2];(l=l[3])?(n=a(l),p=function(a,c,d){t&&(u[t]=a);u[y]=c;u.$index=d;return n(e,u)}):(s=function(a,c){return Da(c)},r=function(a){return a});l=f.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);if(!l)throw d("iidexp",f);y=l[3]||l[1];t=l[2];var B={};e.$watchCollection(h,
function(a){var f,h,l=g[0],n,u={},z,P,D,x,T,w,F=[];if(qb(a))T=a,n=p||s;else{n=p||r;T=[];for(D in a)a.hasOwnProperty(D)&&"$"!=D.charAt(0)&&T.push(D);T.sort()}z=T.length;h=F.length=T.length;for(f=0;f<h;f++)if(D=a===T?f:T[f],x=a[D],x=n(D,x,f),xa(x,"`track by` id"),B.hasOwnProperty(x))w=B[x],delete B[x],u[x]=w,F[f]=w;else{if(u.hasOwnProperty(x))throw q(F,function(a){a&&a.scope&&(B[a.id]=a)}),d("dupes",k,x);F[f]={id:x};u[x]=!1}for(D in B)B.hasOwnProperty(D)&&(w=B[D],f=vb(w.clone),c.leave(f),q(f,function(a){a.$$NG_REMOVED=
!0}),w.scope.$destroy());f=0;for(h=T.length;f<h;f++){D=a===T?f:T[f];x=a[D];w=F[f];F[f-1]&&(l=F[f-1].clone[F[f-1].clone.length-1]);if(w.scope){P=w.scope;n=l;do n=n.nextSibling;while(n&&n.$$NG_REMOVED);w.clone[0]!=n&&c.move(vb(w.clone),null,A(l));l=w.clone[w.clone.length-1]}else P=e.$new();P[y]=x;t&&(P[t]=D);P.$index=f;P.$first=0===f;P.$last=f===z-1;P.$middle=!(P.$first||P.$last);P.$odd=!(P.$even=0===(f&1));w.scope||m(P,function(a){a[a.length++]=Q.createComment(" end ngRepeat: "+k+" ");c.enter(a,null,
A(l));l=a;w.scope=P;w.clone=a;u[w.id]=w})}B=u})}}}],we=["$animate",function(a){return function(c,d,e){c.$watch(e.ngShow,function(c){a[Ma(c)?"removeClass":"addClass"](d,"ng-hide")})}}],xe=["$animate",function(a){return function(c,d,e){c.$watch(e.ngHide,function(c){a[Ma(c)?"addClass":"removeClass"](d,"ng-hide")})}}],ye=ta(function(a,c,d){a.$watch(d.ngStyle,function(a,d){d&&a!==d&&q(d,function(a,d){c.css(d,"")});a&&c.css(a)},!0)}),ze=["$animate",function(a){return{restrict:"EA",require:"ngSwitch",controller:["$scope",
function(){this.cases={}}],link:function(c,d,e,g){var f,h,m=[];c.$watch(e.ngSwitch||e.on,function(d){for(var l=0,n=m.length;l<n;l++)m[l].$destroy(),a.leave(h[l]);h=[];m=[];if(f=g.cases["!"+d]||g.cases["?"])c.$eval(e.change),q(f,function(d){var e=c.$new();m.push(e);d.transclude(e,function(c){var e=d.element;h.push(c);a.enter(c,e.parent(),e)})})})}}}],Ae=ta({transclude:"element",priority:800,require:"^ngSwitch",compile:function(a,c){return function(a,e,g,f,h){f.cases["!"+c.ngSwitchWhen]=f.cases["!"+
c.ngSwitchWhen]||[];f.cases["!"+c.ngSwitchWhen].push({transclude:h,element:e})}}}),Be=ta({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,c,d,e,g){e.cases["?"]=e.cases["?"]||[];e.cases["?"].push({transclude:g,element:c})}}),Ce=ta({controller:["$element","$transclude",function(a,c){if(!c)throw F("ngTransclude")("orphan",ga(a));this.$transclude=c}],link:function(a,c,d,e){e.$transclude(function(a){c.empty();c.append(a)})}}),De=["$templateCache",function(a){return{restrict:"E",terminal:!0,
compile:function(c,d){"text/ng-template"==d.type&&a.put(d.id,c[0].text)}}}],Ee=F("ngOptions"),Fe=$({terminal:!0}),Ge=["$compile","$parse",function(a,c){var d=/^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/,e={$setViewValue:w};return{restrict:"E",require:["select","?ngModel"],controller:["$element","$scope","$attrs",function(a,c,d){var m=this,k={},l=e,n;m.databound=d.ngModel;
m.init=function(a,c,d){l=a;n=d};m.addOption=function(c){xa(c,'"option value"');k[c]=!0;l.$viewValue==c&&(a.val(c),n.parent()&&n.remove())};m.removeOption=function(a){this.hasOption(a)&&(delete k[a],l.$viewValue==a&&this.renderUnknownOption(a))};m.renderUnknownOption=function(c){c="? "+Da(c)+" ?";n.val(c);a.prepend(n);a.val(c);n.prop("selected",!0)};m.hasOption=function(a){return k.hasOwnProperty(a)};c.$on("$destroy",function(){m.renderUnknownOption=w})}],link:function(e,f,h,m){function k(a,c,d,e){d.$render=
function(){var a=d.$viewValue;e.hasOption(a)?(x.parent()&&x.remove(),c.val(a),""===a&&w.prop("selected",!0)):z(a)&&w?c.val(""):e.renderUnknownOption(a)};c.on("change",function(){a.$apply(function(){x.parent()&&x.remove();d.$setViewValue(c.val())})})}function l(a,c,d){var e;d.$render=function(){var a=new Ra(d.$viewValue);q(c.find("option"),function(c){c.selected=B(a.get(c.value))})};a.$watch(function(){ua(e,d.$viewValue)||(e=fa(d.$viewValue),d.$render())});c.on("change",function(){a.$apply(function(){var a=
[];q(c.find("option"),function(c){c.selected&&a.push(c.value)});d.$setViewValue(a)})})}function n(e,f,g){function h(){var a={"":[]},c=[""],d,k,r,t,v;t=g.$modelValue;v=A(e)||[];var C=n?Ob(v):v,F,I,z;I={};r=!1;var E,H;if(s)if(w&&K(t))for(r=new Ra([]),z=0;z<t.length;z++)I[l]=t[z],r.put(w(e,I),t[z]);else r=new Ra(t);for(z=0;F=C.length,z<F;z++){k=z;if(n){k=C[z];if("$"===k.charAt(0))continue;I[n]=k}I[l]=v[k];d=p(e,I)||"";(k=a[d])||(k=a[d]=[],c.push(d));s?d=B(r.remove(w?w(e,I):q(e,I))):(w?(d={},d[l]=t,d=
w(e,d)===w(e,I)):d=t===q(e,I),r=r||d);E=m(e,I);E=B(E)?E:"";k.push({id:w?w(e,I):n?C[z]:z,label:E,selected:d})}s||(y||null===t?a[""].unshift({id:"",label:"",selected:!r}):r||a[""].unshift({id:"?",label:"",selected:!0}));I=0;for(C=c.length;I<C;I++){d=c[I];k=a[d];x.length<=I?(t={element:D.clone().attr("label",d),label:k.label},v=[t],x.push(v),f.append(t.element)):(v=x[I],t=v[0],t.label!=d&&t.element.attr("label",t.label=d));E=null;z=0;for(F=k.length;z<F;z++)r=k[z],(d=v[z+1])?(E=d.element,d.label!==r.label&&
E.text(d.label=r.label),d.id!==r.id&&E.val(d.id=r.id),E[0].selected!==r.selected&&E.prop("selected",d.selected=r.selected)):(""===r.id&&y?H=y:(H=u.clone()).val(r.id).attr("selected",r.selected).text(r.label),v.push({element:H,label:r.label,id:r.id,selected:r.selected}),E?E.after(H):t.element.append(H),E=H);for(z++;v.length>z;)v.pop().element.remove()}for(;x.length>I;)x.pop()[0].element.remove()}var k;if(!(k=t.match(d)))throw Ee("iexp",t,ga(f));var m=c(k[2]||k[1]),l=k[4]||k[6],n=k[5],p=c(k[3]||""),
q=c(k[2]?k[1]:l),A=c(k[7]),w=k[8]?c(k[8]):null,x=[[{element:f,label:""}]];y&&(a(y)(e),y.removeClass("ng-scope"),y.remove());f.empty();f.on("change",function(){e.$apply(function(){var a,c=A(e)||[],d={},h,k,m,p,t,u,v;if(s)for(k=[],p=0,u=x.length;p<u;p++)for(a=x[p],m=1,t=a.length;m<t;m++){if((h=a[m].element)[0].selected){h=h.val();n&&(d[n]=h);if(w)for(v=0;v<c.length&&(d[l]=c[v],w(e,d)!=h);v++);else d[l]=c[h];k.push(q(e,d))}}else if(h=f.val(),"?"==h)k=r;else if(""===h)k=null;else if(w)for(v=0;v<c.length;v++){if(d[l]=
c[v],w(e,d)==h){k=q(e,d);break}}else d[l]=c[h],n&&(d[n]=h),k=q(e,d);g.$setViewValue(k)})});g.$render=h;e.$watch(h)}if(m[1]){var p=m[0];m=m[1];var s=h.multiple,t=h.ngOptions,y=!1,w,u=A(Q.createElement("option")),D=A(Q.createElement("optgroup")),x=u.clone();h=0;for(var v=f.children(),F=v.length;h<F;h++)if(""===v[h].value){w=y=v.eq(h);break}p.init(m,y,x);s&&(m.$isEmpty=function(a){return!a||0===a.length});t?n(e,f,m):s?l(e,f,m):k(e,f,m,p)}}}}],He=["$interpolate",function(a){var c={addOption:w,removeOption:w};
return{restrict:"E",priority:100,compile:function(d,e){if(z(e.value)){var g=a(d.text(),!0);g||e.$set("value",d.text())}return function(a,d,e){var k=d.parent(),l=k.data("$selectController")||k.parent().data("$selectController");l&&l.databound?d.prop("selected",!1):l=c;g?a.$watch(g,function(a,c){e.$set("value",a);a!==c&&l.removeOption(c);l.addOption(a)}):l.addOption(e.value);d.on("$destroy",function(){l.removeOption(e.value)})}}}}],Ie=$({restrict:"E",terminal:!0});(Ba=Z.jQuery)?(A=Ba,t(Ba.fn,{scope:Ea.scope,
isolateScope:Ea.isolateScope,controller:Ea.controller,injector:Ea.injector,inheritedData:Ea.inheritedData}),wb("remove",!0,!0,!1),wb("empty",!1,!1,!1),wb("html",!1,!1,!0)):A=O;Na.element=A;(function(a){t(a,{bootstrap:Yb,copy:fa,extend:t,equals:ua,element:A,forEach:q,injector:Zb,noop:w,bind:bb,toJson:pa,fromJson:Ub,identity:Aa,isUndefined:z,isDefined:B,isString:D,isFunction:L,isObject:X,isNumber:rb,isElement:Pc,isArray:K,version:Rd,isDate:Ja,lowercase:x,uppercase:Ga,callbacks:{counter:0},$$minErr:F,
$$csp:Tb});Ta=Uc(Z);try{Ta("ngLocale")}catch(c){Ta("ngLocale",[]).provider("$locale",rd)}Ta("ng",["ngLocale"],["$provide",function(a){a.provider({$$sanitizeUri:Bd});a.provider("$compile",ic).directive({a:Wd,input:Lc,textarea:Lc,form:Xd,script:De,select:Ge,style:Ie,option:He,ngBind:he,ngBindHtml:je,ngBindTemplate:ie,ngClass:ke,ngClassEven:me,ngClassOdd:le,ngCloak:ne,ngController:oe,ngForm:Yd,ngHide:xe,ngIf:pe,ngInclude:qe,ngInit:se,ngNonBindable:te,ngPluralize:ue,ngRepeat:ve,ngShow:we,ngStyle:ye,ngSwitch:ze,
ngSwitchWhen:Ae,ngSwitchDefault:Be,ngOptions:Fe,ngTransclude:Ce,ngModel:ce,ngList:ee,ngChange:de,required:Mc,ngRequired:Mc,ngValue:ge}).directive({ngInclude:re}).directive(Nb).directive(Nc);a.provider({$anchorScroll:cd,$animate:Td,$browser:ed,$cacheFactory:fd,$controller:id,$document:jd,$exceptionHandler:kd,$filter:Ac,$interpolate:pd,$interval:qd,$http:ld,$httpBackend:nd,$location:td,$log:ud,$parse:xd,$rootScope:Ad,$q:yd,$sce:Ed,$sceDelegate:Dd,$sniffer:Fd,$templateCache:gd,$timeout:Gd,$window:Hd})}])})(Na);
A(Q).ready(function(){Sc(Q,Yb)})})(window,document);!angular.$$csp()&&angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}</style>');
//# sourceMappingURL=angular.min.js.map

},{}],6:[function(require,module,exports){
var angular = require('angular');

angular.module('d3', [])

.factory('d3Service', ['$document', '$q', '$rootScope',
  function($document, $q, $rootScope) {
    var d = $q.defer();
    function onScriptLoad() {
      // Load client in the browser
      $rootScope.$apply(function() { d.resolve(window.d3); });
    }
    // Create a script tag with d3 as the source
    // and call our onScriptLoad callback when it
    // has been loaded
    var scriptTag = $document[0].createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = '../lib/d3/d3.min.js';
    scriptTag.onreadystatechange = function () {
      if (this.readyState == 'complete') onScriptLoad();
    };
    scriptTag.onload = onScriptLoad;

    var s = $document[0].getElementsByTagName('body')[0];
    s.appendChild(scriptTag);

    return {
      d3: function() { return d.promise; }
    };
  }
]);

module.exports = angular.module('app', ['ngRoute', 'd3', 'ui.bootstrap', 'ngAnimate']);


},{"angular":4}],7:[function(require,module,exports){
var angular = require('angular');

module.exports = angular.module('app')
.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		controller: 'mainController',
		templateUrl: 'client/views/main.html'
	})
  .when('/dataCenter', {
		controller: 'dataCenterController',
		templateUrl: 'client/views/dataCenter.html'
  })
	.when('/zoomIn', {
		controller: 'zoomInController',
		templateUrl: 'client/views/zoomIn.html'
	});
});
},{"angular":4}],8:[function(require,module,exports){
var angular = require('angular');

module.exports = angular.module('app')
.controller('accordionController', function($scope, $rootScope) {
  $scope.oneAtATime = false;

  $scope.isPrimitive = function(value, key) {
    if (Array.isArray(value)) return false;
    if (typeof value === 'object') return false;
    if (key) {
      if (key[0] === '_') return false; // ignore hidden variables
    }
    return true;
  };

});


},{"angular":4}],9:[function(require,module,exports){
var angular = require('angular');

module.exports = angular.module('app')
.controller('d3Controller', function($scope, NetworkDataService) {
  $rootScope.chartData = [21,1,5];
  $scope.nodeData = [100, 200];
});


},{"angular":4}],10:[function(require,module,exports){
var angular = require('angular');

module.exports = angular.module('app')
.controller('dataCenterController', function($scope, $location, NetworkDataService){
  $scope.loading = true;

  NetworkDataService.getAllDataCenters()
  .then(function(data) {
    // $scope.selectedNode = data.dataCenters[0];
    $scope.ctldata = data.dataCenters;
    $scope.connections = data.connections;
  }, function errorFunction(reason) {
    $scope.error = reason;
  });

  $scope.select = function(node) {
    $scope.selectedNode = node;
    $scope.liveSearch = '';
  };
});
},{"angular":4}],11:[function(require,module,exports){
var angular = require('angular');

module.exports = angular.module('app')
.controller('mainController', function($scope, $location, NetworkDataService){
  $scope.loading = true;

  NetworkDataService.getAllFlattened()
  .then(function(data) {
    $scope.ctldata = data;
    console.log(data);
    $scope.nodes = data.nodes;
    $scope.links = data.links;
  }, function errorFunction(reason) {
    $scope.error = reason;
  });

  $scope.formatUUID = function(UUID) {
    return UUID.split('-')[0];
  };

  $scope.select = function(node) {
    $scope.selectedNode = node;
    $scope.liveSearch = "";
  };
});

},{"angular":4}],12:[function(require,module,exports){
var angular = require('angular');

module.exports = angular.module('app')
.controller('zoomInController', function($scope){

	alert("Inside zoomInController");
});
},{"angular":4}],13:[function(require,module,exports){

// Due to D3's inability to interpolate 'classed' values on transition()
// the .style() method must be used and each value set individually after
// using transition() :(


 //find all nodes connected to selected node  -- NOT USED
var neighbors = function(target, source, linkDirectory){
  return linkDirectory[target + "," + source] ||
    linkDirectory[source + "," + target];
};

//Called on edge hover
var showLinkDetails = function(link){
  console.log('d target ', link.target);

  d3.select(this)
    .style('stroke-opacity', 1)
    .style('stroke', 'black');
};

//Called on edge mouse out
var hideLinkDetails = function(link){
  d3.select(this)
    .style('stroke-opacity', 0.3)
    .style('stroke', '#999');
};

var selectNode = function(node, i){
  d3.selectAll('.node')
  .attr('nodeSelected', false)
  .style('stroke', 'white')
  .style('stroke-width', '3px');

  d3.select(this)
  .attr('nodeSelected', true)
  .transition()
  .style('stroke', '#bada55')
  .style('stroke-width', '5px');
};

var selectLink = function(link, i, selected_link){
  if (selected_link !== null) {
    d3.select(".linkSelected")
    .transition()
    .style("stroke", "#999")
    .style("stroke-width", '2px')
    .style("stroke-opacity", 0.3)
    .style("stroke-dasharray", "none");
    d3.select('.linkSelected')
    .classed('linkSelected', false);
  }
  else if(selected_link === link){
    selected_link = null;
    return;
  } else {
    selected_link = link;
  }

  d3.select(this)
  .classed('linkSelected', true)
  .transition()
  .style('stroke', 'black')
  .style("stroke-dasharray", ("3, 3"))
  .style('stroke-width', '6px');
};

var showNodeDetails = function(node){
  var selected = d3.select(this).attr('nodeSelected');

  if(selected === 'false'){
    d3.select(this).style('stroke', '#bada55');
  }

  d3.selectAll(".link").transition()
    .style("stroke", function(l) {
      if (l.source === node || l.target === node) {
        return "black";
      } else {
        return "#999";
      }
    })
    .style("stroke-opacity", function(l) {
      if (l.source === node || l.target === node) {
        return 1.0;
      } else {
        return 0.1;
      }
  });
};

var hideNodeDetails = function(node){
  var selected = d3.select(this).attr('nodeSelected');
  if(selected === 'false'){
    d3.select(this)
    .transition()
    .style('stroke', 'white');
  }
  d3.selectAll(".link").transition()
  .style("stroke", "#999")
  .style("stroke-opacity", '0.3');
};



module.exports.drawLinks = function(link, force){
  link.data(force.links())
  .enter().append("path")
  .attr('d', function(d){
    var dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = Math.sqrt(dx * dx + dy * dy),
      rdr = -(dr);
    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
  })
  .attr('pointer-events', 'stroke')
  .attr('fill', 'none')
  .attr("class", "link")
  .on('click', selectLink)
  .on('mouseover', showLinkDetails)
  .on('mouseout', hideLinkDetails);
};

module.exports.drawNodes = function(node, link, force, scope){
  node.data(force.nodes())
    .enter().append("circle")
    .attr("class", "node")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", 15)
    .attr('nodeSelected', 'false')
    .on('click.selectNode', selectNode)
    .on("click", function(d){
      scope.$apply(function () {
        scope.$parent.selectedNode1 = scope.$parent.selectedNode;
        scope.$parent.selectedNode = d;
        scope.$parent.$parent.selectedNode  = d;
        if (scope.$parent.selectedNode !== undefined &&
          scope.$parent.selectedNode1 !== undefined &&
          scope.$parent.selectedNode1 !== scope.$parent.selectedNode) {
          console.log("node", scope.$parent.selectedNode);
          console.log("node1", scope.$parent.selectedNode1);

          var testLink = {};
          var testLinkArray = [];
          testLink.source = scope.$parent.selectedNode1;
          testLink.target = scope.$parent.selectedNode;
          testLinkArray.push(testLink);
          force.links().push(testLink);

          link
            .data(testLinkArray)
            .enter().insert("path", ".node")
            .attr('d', function(d){
              var dx = d.target.x - d.source.x,
                   dy = d.target.y - d.source.y,
                   dr = Math.sqrt(dx * dx + dy * dy),
                   rdr = -(dr);
               return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
            })
            .attr('fill', 'none')
            .attr("class", "link");
          showNodeDetails(d);
        }
      });
    })
    .attr("fill", function(d, i){
      if (d.type === 'server') {
        return "#444";
      } else {
      return "#888";
      }
    })
    .on('mouseover', showNodeDetails)
    .on('mouseout', hideNodeDetails)
    .append("title").text(function(d, i) {
      var retString =
        "Vendor: " + d.attributes.vendor + "\n" +
        "Platform: " + d.attributes.platform + "\n" +
        "UUID: " + (d.attributes.UUID.slice(0, 4)) + " ... " + (d.attributes.UUID.slice(-4));
      return retString;
    });
};

//adds stringified link to directory
module.exports.addLink = function(a, b, linkDirectory){
  linkDirectory[a + "," + b] = 1;
  linkDirectory[b + "," + a] = 1;
};


module.exports.keydown = function (d, selected_link) {
  d3.event.preventDefault();
  console.log("Inside keydown");
  // ctrl
  if(d3.event.keyCode === 17) {
  circle.call(force.drag);
  svg.classed('ctrl', true);
  }

  if(!selected_link) return;
  switch(d3.event.keyCode) {
    case 8: // backspace
    case 46: // delete
      if(selected_link) {
        var n = force.links().indexOf(selected_link);
        if(n >= 0) {
          force.links().splice(n, 1);
          d3.select(".linkSelected").remove();
        }
      }
      selected_link = null;
      break;
  }
};



//function to map MAC address of nic to containing host
module.exports.mapMac = function(nodes) {
  var tempNode;
  var nics;
  var nodesMap = d3.map();
  nodes.forEach(function(n){
    tempNode = n;
    nics = n.components.nics;
    nics.forEach(function(n){
      nodesMap.set(n.mac, tempNode);
    });
  });
  return nodesMap;
};

},{}],14:[function(require,module,exports){
var angular = require('angular');

var createMap = function (scope, elem, attrs) {
  // generate map
  var mapOptions, map;
  mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(37.76487, -122.41948),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };
  map = new google.maps.Map(elem[0], mapOptions);

  // generate map overlay
  setTimeout(function() {
    var selectedMarker;
    var data = scope.nwdata;
    data.forEach(function(node, i) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(node.latitude, node.longitude),
        map: map,
        icon: getCircle(),
      });
      marker.setTitle(node.name);
      // attachSecretMessage(marker, i);
      google.maps.event.addListener(marker, 'click', function(data) {
        if (selectedMarker) selectedMarker.setIcon(getCircle());
        selectedMarker = marker;
        marker.setIcon(getBlueCircle());
        scope.$apply(function() {
          scope.selectedNode = node;
        });

        // var infowindow = new google.maps.InfoWindow({
        //   content: node.name,
        //   size: new google.maps.Size(50,50)
        // });
        // infowindow.open(map, marker);
      });

      google.maps.event.addListener(marker, 'dblclick', function() {
        window.location = '/?id=' + node._id;
        // alert(JSON.stringify(node._id));
      });
    });

    scope.connections.forEach(function(connection) {
      debugger;
      var coordinates = [
        new google.maps.LatLng(connection[0][0], connection[0][1]),
        new google.maps.LatLng(connection[1][0], connection[1][1])
      ];
      var line = new google.maps.Polyline({
        path: coordinates,
        map: map,
        geodesic: true,
        strokeColor: '#7555DA',
        strokeOpacity: 0.6,
        strokeWeight: 2
      });
    });

    function getCircle() {
      var circle = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillOpacity: 1,
        fillColor: 'grey',
        strokeColor: 'black',
        strokeWeight: 1.5
      };
      return circle;
    }
    function getBlueCircle() {
      var circle = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillOpacity: 1,
        fillColor: 'BADA55',
        strokeColor: 'black',
        strokeWeight: 1.5
      };
      return circle;
    }
    scope.$apply(function() {
      scope.loading = false;
    });
  }, 1000);
 
};

var app = angular.module('app');
module.exports = app.directive('map', [function() {
  return {
    restrict: 'EA',
    scope: {
      nwdata: '=',
      selectedNode: '=',
      loading: '=',
      connections: '='
    },
    link: createMap
  };
}]);

},{"angular":4}],15:[function(require,module,exports){
var angular = require('angular');
var helpers = require('./helpers.js');

var app = angular.module('app');
var bootstrapd3 = function(scope, element, attrs, d3Service) {
  setTimeout(function(){
    var d3serve = d3Service.d3().then(function(d3) {

 function redraw() {
          svg.attr('transform', 'translate(' +
            d3.event.translate + ')' +
          ' scale(' + d3.event.scale + ')');
        }

      //View window width and height
      var viewWidth = element[0].offsetWidth;
      var viewHeight = element[0].offsetHeight;
      var linkDirectory = {};
      var selected_link = null;
      var link;
      var node;

      d3.select('link')
        .on('keydown', helpers.keydown);

      var force = d3.layout.force()
        .charge(-2000)
        .linkStrength(0.2)
        .linkDistance(200)
        .size([viewWidth, viewHeight]);

      //Create view window SVG
      var svg =  d3.select(element[0])
        .append('svg')
        .attr('width', viewWidth)
        .attr('height', viewHeight)
        .attr("pointer-events", "all")
        .append('g')
        .call(d3.behavior.zoom().on("zoom", redraw))
        .append('g');


      //map mac addresses to nodes
      var map = helpers.mapMac(scope.nwdata.nodes);

      //set link source and target to node instead of mac address
      scope.nwdata.links.forEach(function(l){
        helpers.addLink(l.source, l.target, linkDirectory);
        l.source = map.get(l.source);
        l.target = map.get(l.target);
      });

      // This function is an attempt to set a fixed position on all
      // switch nodes ... not yet working. It should take the node array
      // and return an array with only the switch nodes value 'fixed'
      // set to true. It will be passed into the force.nodes method below
      var allNodes = function(){
        console.log(scope.nwdata.nodes);
        var nodes = scope.nwdata.nodes;
        var result = [];
        var switches = [];
        // nodes.forEach(function(node, i){
        //   if(node.type === 'switch'){
        //     switches.push(node);
        //   }
        // });

        // switches.forEach(function(s, i){
        //   console.log(s, i);
        //   node.fixed = true;
        //   node.cx = viewWidth / 2;
        //   node.cy = (viewHeight / nodes.length) * i;
        //   console.log('PYPYPY ',node.cy);
        //   result.push(s);
        // });

        nodes.forEach(function(n){
          result.push(n);
        });
        console.log('result ------ ', result);
        return result;
      };

      // Start the force physics
      force
        .links(scope.nwdata.links)
        .nodes(scope.nwdata.nodes)
        .start();

      for(var i = scope.nwdata.nodes + scope.nwdata.nodes; i > 0; --i) {
        force.tick();
      }
      // use a timeout to allow the rest of the page to load first
      setTimeout(function(){
        force.stop();

        link = svg.append('g').selectAll(".link")
        helpers.drawLinks(link, force);

        node = svg.append('g').selectAll(".node");
        helpers.drawNodes(node, link, force, scope);

        scope.$apply(function() {
          scope.loading = false;
        });

      }, 500);

      // Browser onresize event
      window.onresize = function() {
        scope.$apply();
      };
    });

  }, 300);

};



app.directive('networkGraph', ['d3Service', function(d3Service) {
  return {
    restrict: 'EA',
    scope: {
      nwdata: '=',
      loading: '='
    },
    link: function(scope, element, attrs) {
      setTimeout(function() {
        bootstrapd3(scope, element, attrs, d3Service);
      }, 1000);
      // bootstrapd3(scope, element, attrs, d3Service);
    }
  };
}]);
},{"./helpers.js":13,"angular":4}],16:[function(require,module,exports){
var angular = require('angular');

var app = angular.module('app');
module.exports = app.factory('NetworkDataService', function($q, $http/* DI */) {
  var service = {
    
    getAll: function() {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/all'
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    },

    getAllFlattened: function() {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/all-flattened'
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    },
   
   // Information required for drawing the network
    getInitialDrawData: function() {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/d3data'
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    },

    getAllServers: function() {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/server'
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    },

    getAllDataCenters: function() {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/datacenter'
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    },
    getAllDataCenterConnections: function() {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/dataCenterConnections'
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    },

    getAllSwitches: function() {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/switch'
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    },

    getAllConnections: function() {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/connection'
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    },

    getTheServerInfo: function(id) {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/server/' + id
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    },

    getTheSwitchInfo: function(id) {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/switch/'+id
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    }
  };
  return service;
});



},{"angular":4}],17:[function(require,module,exports){
// angular setup
require('angular');
require('angular-route/angular-route');
require('angular-animate/angular-animate');
require('angular-bootstrap/ui-bootstrap-tpls');

require("./client/app.js");

require("./client/services/networkDataService.js");

require("./client/controllers/d3Controller.js");
require("./client/controllers/accordionController.js");
require("./client/controllers/mainController.js");
require("./client/controllers/zoomInController.js");
require("./client/controllers/dataCenterController.js");

require("./client/directives/map.js");
require("./client/directives/networkGraph.js");

require("./client/config/routes.js");
},{"./client/app.js":6,"./client/config/routes.js":7,"./client/controllers/accordionController.js":8,"./client/controllers/d3Controller.js":9,"./client/controllers/dataCenterController.js":10,"./client/controllers/mainController.js":11,"./client/controllers/zoomInController.js":12,"./client/directives/map.js":14,"./client/directives/networkGraph.js":15,"./client/services/networkDataService.js":16,"angular":4,"angular-animate/angular-animate":1,"angular-bootstrap/ui-bootstrap-tpls":2,"angular-route/angular-route":3}]},{},[17])