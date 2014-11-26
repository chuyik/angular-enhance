/**
 * @author Edward Chu
 * License: MIT
 */
(function(window, angular) {'use strict';

var app = angular.module('ngEnhance');

// Service //////////////////////////////////

/**
 * Add put method to $resource
 */
app.factory('myResource', function($resource) {
  return function(url, params, methods) {
    var id = (params && params.id && params.id.charAt(0) == '@' ?
              params.id.substr(1) : params.id) || '_id';

    var defaults = {
      update: {method: 'put', isArray: false},
      create: {method: 'post'}
    };

    methods = angular.extend(defaults, methods);

    var resource = $resource(url, params, methods);

    resource.prototype.$save = function(arg) {
      if (!this[id]) {
        return this.$create(arg);
      }
      else {
        return this.$update(arg);
      }
    };

    return resource;
  };
});

// Directive //////////////////////////////////

/**
 * Evaluate an expression when enter key is pressed
 * @source https://gist.github.com/EpokK/5884263
 */
app.directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.on("keypress", function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
});

/**
 * Smoothly Scroll to an HTML element
 *
 * @usage
    provide a variable:
    <a scroll-to="msg.id" ng-repeat="msg in msgs">
      Click and scroll
    </a>

    provide a string:
    <a scroll-to="nav">
      Click and scroll
    </a>

    use href @attribute itself:
    <a href="nav" scroll-to>
      Click and scroll
    </a>

 * @source https://gist.github.com/justinmc/d72f38339e0c654437a2
 */
app.directive('scrollTo', function($location){
  var scrollTo = function scrollTo(eID) {
    var i;
    var startY = currentYPosition();
    var stopY = elmYPosition(eID);
    var distance = stopY > startY ? stopY - startY : startY - stopY;
    var speed = Math.round(distance / 100);
    if (speed >= 20) speed = 20;
    var step = Math.round(distance / 25);
    var leapY = stopY > startY ? startY + step : startY - step;
    var timer = 0;
    if (stopY > startY) {
      for (i = startY; i < stopY; i += step) {
        setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
        leapY += step;
        if (leapY > stopY) leapY = stopY;
        timer++;
      }
      return;
    }
    for (i = startY; i > stopY; i -= step) {
      setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
      leapY -= step;
      if (leapY < stopY) leapY = stopY;
      timer++;
    }
  };

  var currentYPosition = function currentYPosition() {
    // Firefox, Chrome, Opera, Safari
    if (window.pageYOffset) {
      return window.pageYOffset;
    }
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop) {
      return document.documentElement.scrollTop;
    }
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) {
      return document.body.scrollTop;
    }
    return 0;
  };

  var elmYPosition = function elmYPosition(eID) {
    var elm = document.getElementById(eID);
    var y = elm.offsetTop;
    var node = elm;
    while (node.offsetParent && node.offsetParent != document.body) {
      node = node.offsetParent;
      y += node.offsetTop;
    }
    return y;
  };

  return {
    rescrict: 'A',
    scope: {
      scrollTo: '='
    },
    link: function(scope, elem, attrs){
      elem.css('cursor', 'pointer');
      elem.on('click', function(ev) {
        var anchor = scope.scrollTo || attrs.scrollTo || attrs.href;
        if(anchor[0] === '#'){
          anchor = anchor.slice(1);
        }
        if(anchor){
          scrollTo(anchor);
        }
        ev.preventDefault();
      });
    }
  };
});


// Filter //////////////////////////////////

/**
 * Prettify Json
 * @return {String} Prettified Json
 */
app.filter('prettyJson', function() {
  return function (input) {
    return angular.toJson(input, true);
  };
});


/**
 * Truncate string with ellipsis
 *
 * @usage
    default length: 10
    {{ 'Lorum ipsum dolor sit amet' | ellipsis }}
    provide a number as length
    {{ 'Lorum ipsum dolor sit amet' | ellipsis : 8 }}
 *
 * @return {String} truncated string
 */
app.filter('ellipsis', function () {
  return function (input, len) {
    len = len || 10;
    if (input && input.length > len) {
      return input.substring(0, len) + '...';
    }else {
      return input;
    }
  };
});

/**
 * Change a number to a letter
 *
 * @usage
    {{ 3 | toLetter }} => C
 */
app.filter('toLetter', function() {
  return function(num){
    if(num) return String.fromCharCode(64 + num);
  };
});