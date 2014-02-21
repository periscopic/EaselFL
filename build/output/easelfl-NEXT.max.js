/*
 * EaselFL
 *
 * EaselFL is EaselJS rendering to Flash and designed
 * to work with browsers (including IE8) that have
 * Adobe Flash Player 9 or higher.
 * @author Brett Johnson, periscopic.com
 * 
 * http://github.com/periscopic/EaselFL
 * 
 * Distributed under the terms of the MIT license.
 */

/*
* EaselJS
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2011 gskinner.com, inc.
* 
* Distributed under the terms of the MIT license.
* http://www.opensource.org/licenses/mit-license.html
*
* This notice shall be included in all copies or substantial portions of the Software.
*/
(function() {
  if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(item) {
      for(var i = 0, l = this.length;i < l;i++) {
        if(this[i] === item) {
          return i
        }
      }
      return-1
    }
  }
  if(!Date.now) {
    Date.now = function() {
      return(new Date).valueOf()
    }
  }
})();
this.createjs = this.createjs || {};
(function() {
  var UID = function() {
    throw"UID cannot be instantiated";
  };
  UID._nextID = 0;
  UID.get = function() {
    return UID._nextID++
  };
  createjs.UID = UID
})();
this.createjs = this.createjs || {};
(function() {
  var Log = {};
  Log.NONE = 0;
  Log.ERROR = 1;
  Log.WARNING = 2;
  Log.TRACE = 3;
  Log.ALL = 255;
  Log.out = function(message, details, level) {
    if(level <= Log.level && window.console) {
      if(details === undefined) {
        console.log(message)
      }else {
        console.log(message, details)
      }
    }
  };
  Log.level = 255;
  Log._keys = [];
  Log.addKeys = function(keys) {
    Log._keys.unshift(keys)
  };
  Log.log = function(message, details, level) {
    var out = Log.out;
    if(!out) {
      return
    }
    var keys = Log._keys;
    if(level == null) {
      level = 3
    }
    for(var i = 0;i < keys.length;i++) {
      if(keys[i][message]) {
        message = keys[i][message];
        break
      }
    }
    out(message, details, level)
  };
  createjs.Log = Log
})();
this.createjs = this.createjs || {};
(function() {
  var Event = function(type, bubbles, cancelable) {
    this.initialize(type, bubbles, cancelable)
  };
  var p = Event.prototype;
  p.type = null;
  p.target = null;
  p.currentTarget = null;
  p.eventPhase = 0;
  p.bubbles = false;
  p.cancelable = false;
  p.timeStamp = 0;
  p.defaultPrevented = false;
  p.propagationStopped = false;
  p.immediatePropagationStopped = false;
  p.removed = false;
  p.initialize = function(type, bubbles, cancelable) {
    this.type = type;
    this.bubbles = bubbles;
    this.cancelable = cancelable;
    this.timeStamp = (new Date).getTime()
  };
  p.preventDefault = function() {
    this.defaultPrevented = true
  };
  p.stopPropagation = function() {
    this.propagationStopped = true
  };
  p.stopImmediatePropagation = function() {
    this.immediatePropagationStopped = this.propagationStopped = true
  };
  p.remove = function() {
    this.removed = true
  };
  p.clone = function() {
    return new Event(this.type, this.bubbles, this.cancelable)
  };
  p.toString = function() {
    return"[Event (type=" + this.type + ")]"
  };
  createjs.Event = Event
})();
this.createjs = this.createjs || {};
(function() {
  var EventDispatcher = function() {
    this.initialize()
  };
  var p = EventDispatcher.prototype;
  EventDispatcher.initialize = function(target) {
    target.addEventListener = p.addEventListener;
    target.on = p.on;
    target.removeEventListener = target.off = p.removeEventListener;
    target.removeAllEventListeners = p.removeAllEventListeners;
    target.hasEventListener = p.hasEventListener;
    target.dispatchEvent = p.dispatchEvent;
    target._dispatchEvent = p._dispatchEvent
  };
  p._listeners = null;
  p._captureListeners = null;
  p.initialize = function() {
  };
  p.addEventListener = function(type, listener, useCapture) {
    var listeners;
    if(useCapture) {
      listeners = this._captureListeners = this._captureListeners || {}
    }else {
      listeners = this._listeners = this._listeners || {}
    }
    var arr = listeners[type];
    if(arr) {
      this.removeEventListener(type, listener, useCapture)
    }
    arr = listeners[type];
    if(!arr) {
      listeners[type] = [listener]
    }else {
      arr.push(listener)
    }
    return listener
  };
  p.on = function(type, listener, scope, once, data, useCapture) {
    if(listener.handleEvent) {
      scope = scope || listener;
      listener = listener.handleEvent
    }
    scope = scope || this;
    return this.addEventListener(type, function(evt) {
      listener.call(scope, evt, data);
      once && evt.remove()
    }, useCapture)
  };
  p.removeEventListener = function(type, listener, useCapture) {
    var listeners = useCapture ? this._captureListeners : this._listeners;
    if(!listeners) {
      return
    }
    var arr = listeners[type];
    if(!arr) {
      return
    }
    for(var i = 0, l = arr.length;i < l;i++) {
      if(arr[i] == listener) {
        if(l == 1) {
          delete listeners[type]
        }else {
          arr.splice(i, 1)
        }
        break
      }
    }
  };
  p.off = p.removeEventListener;
  p.removeAllEventListeners = function(type) {
    if(!type) {
      this._listeners = this._captureListeners = null
    }else {
      if(this._listeners) {
        delete this._listeners[type]
      }
      if(this._captureListeners) {
        delete this._captureListeners[type]
      }
    }
  };
  p.dispatchEvent = function(eventObj, target) {
    if(typeof eventObj == "string") {
      var listeners = this._listeners;
      if(!listeners || !listeners[eventObj]) {
        return false
      }
      eventObj = new createjs.Event(eventObj)
    }
    eventObj.target = target || this;
    if(!eventObj.bubbles || !this.parent) {
      this._dispatchEvent(eventObj, 2)
    }else {
      var top = this, list = [top];
      while(top.parent) {
        list.push(top = top.parent)
      }
      var i, l = list.length;
      for(i = l - 1;i >= 0 && !eventObj.propagationStopped;i--) {
        list[i]._dispatchEvent(eventObj, 1 + (i == 0))
      }
      for(i = 1;i < l && !eventObj.propagationStopped;i++) {
        list[i]._dispatchEvent(eventObj, 3)
      }
    }
    return eventObj.defaultPrevented
  };
  p.hasEventListener = function(type) {
    var listeners = this._listeners, captureListeners = this._captureListeners;
    return!!(listeners && listeners[type] || captureListeners && captureListeners[type])
  };
  p.toString = function() {
    return"[EventDispatcher]"
  };
  p._dispatchEvent = function(eventObj, eventPhase) {
    var l, listeners = eventPhase == 1 ? this._captureListeners : this._listeners;
    if(eventObj && listeners) {
      var arr = listeners[eventObj.type];
      if(!arr || !(l = arr.length)) {
        return
      }
      eventObj.currentTarget = this;
      eventObj.eventPhase = eventPhase;
      eventObj.removed = false;
      arr = arr.slice();
      for(var i = 0;i < l && !eventObj.immediatePropagationStopped;i++) {
        var o = arr[i];
        if(o.handleEvent) {
          o.handleEvent(eventObj)
        }else {
          o(eventObj)
        }
        if(eventObj.removed) {
          this.off(eventObj.type, o, eventPhase == 1);
          eventObj.removed = false
        }
      }
    }
  };
  createjs.EventDispatcher = EventDispatcher
})();
this.createjs = this.createjs || {};
(function() {
  var Ticker = function() {
    throw"Ticker cannot be instantiated.";
  };
  Ticker.useRAF = false;
  Ticker.addEventListener = null;
  Ticker.removeEventListener = null;
  Ticker.removeAllEventListeners = null;
  Ticker.dispatchEvent = null;
  Ticker.hasEventListener = null;
  Ticker._listeners = null;
  createjs.EventDispatcher.initialize(Ticker);
  Ticker._listeners = null;
  Ticker._pauseable = null;
  Ticker._paused = false;
  Ticker._inited = false;
  Ticker._startTime = 0;
  Ticker._pausedTime = 0;
  Ticker._ticks = 0;
  Ticker._pausedTicks = 0;
  Ticker._interval = 50;
  Ticker._lastTime = 0;
  Ticker._times = null;
  Ticker._tickTimes = null;
  Ticker._rafActive = false;
  Ticker._timeoutID = null;
  Ticker.addListener = function(o, pauseable) {
    if(o == null) {
      return
    }
    Ticker.removeListener(o);
    Ticker._pauseable[Ticker._listeners.length] = pauseable == null ? true : pauseable;
    Ticker._listeners.push(o)
  };
  Ticker.init = function() {
    Ticker._inited = true;
    Ticker._times = [];
    Ticker._tickTimes = [];
    Ticker._pauseable = [];
    Ticker._listeners = [];
    Ticker._times.push(Ticker._lastTime = Ticker._startTime = Ticker._getTime());
    Ticker.setInterval(Ticker._interval)
  };
  Ticker.removeListener = function(o) {
    var listeners = Ticker._listeners;
    if(!listeners) {
      return
    }
    var index = listeners.indexOf(o);
    if(index != -1) {
      listeners.splice(index, 1);
      Ticker._pauseable.splice(index, 1)
    }
  };
  Ticker.removeAllListeners = function() {
    Ticker._listeners = [];
    Ticker._pauseable = []
  };
  Ticker.setInterval = function(interval) {
    Ticker._interval = interval;
    if(!Ticker._inited) {
      return
    }
    Ticker._setupTick()
  };
  Ticker.getInterval = function() {
    return Ticker._interval
  };
  Ticker.setFPS = function(value) {
    Ticker.setInterval(1E3 / value)
  };
  Ticker.getFPS = function() {
    return 1E3 / Ticker._interval
  };
  Ticker.getMeasuredFPS = function(ticks) {
    if(Ticker._times.length < 2) {
      return-1
    }
    if(ticks == null) {
      ticks = Ticker.getFPS() | 0
    }
    ticks = Math.min(Ticker._times.length - 1, ticks);
    return 1E3 / ((Ticker._times[0] - Ticker._times[ticks]) / ticks)
  };
  Ticker.setPaused = function(value) {
    Ticker._paused = value
  };
  Ticker.getPaused = function() {
    return Ticker._paused
  };
  Ticker.getTime = function(runTime) {
    return Ticker._getTime() - Ticker._startTime - (runTime ? Ticker._pausedTime : 0)
  };
  Ticker.getTicks = function(pauseable) {
    return Ticker._ticks - (pauseable ? Ticker._pausedTicks : 0)
  };
  Ticker._handleAF = function() {
    Ticker._rafActive = false;
    Ticker._setupTick();
    if(Ticker._getTime() - Ticker._lastTime >= (Ticker._interval - 1) * 0.97) {
      Ticker._tick()
    }
  };
  Ticker._handleTimeout = function() {
    Ticker.timeoutID = null;
    Ticker._setupTick();
    Ticker._tick()
  };
  Ticker._setupTick = function() {
    if(Ticker._rafActive || Ticker.timeoutID != null) {
      return
    }
    if(Ticker.useRAF) {
      var f = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
      if(f) {
        f(Ticker._handleAF);
        Ticker._rafActive = true;
        return
      }
    }
    Ticker.timeoutID = setTimeout(Ticker._handleTimeout, Ticker._interval)
  };
  Ticker._tick = function() {
    var time = Ticker._getTime();
    Ticker._ticks++;
    var elapsedTime = time - Ticker._lastTime;
    var paused = Ticker._paused;
    if(paused) {
      Ticker._pausedTicks++;
      Ticker._pausedTime += elapsedTime
    }
    Ticker._lastTime = time;
    var pauseable = Ticker._pauseable;
    var listeners = Ticker._listeners.slice();
    var l = listeners ? listeners.length : 0;
    for(var i = 0;i < l;i++) {
      var listener = listeners[i];
      if(listener == null || paused && pauseable[i]) {
        continue
      }
      if(listener.tick) {
        listener.tick(elapsedTime, paused)
      }else {
        if(listener instanceof Function) {
          listener(elapsedTime, paused)
        }
      }
    }
    Ticker.dispatchEvent({type:"tick", paused:paused, delta:elapsedTime, time:time, runTime:time - Ticker._pausedTime});
    Ticker._tickTimes.unshift(Ticker._getTime() - time);
    while(Ticker._tickTimes.length > 100) {
      Ticker._tickTimes.pop()
    }
    Ticker._times.unshift(time);
    while(Ticker._times.length > 100) {
      Ticker._times.pop()
    }
  };
  var now = window.performance && (performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow);
  Ticker._getTime = function() {
    return now && now.call(performance) || (new Date).getTime()
  };
  Ticker.init();
  createjs.Ticker = Ticker
})();
this.createjs = this.createjs || {};
(function() {
  var MouseEvent = function(type, stageX, stageY, target, nativeEvent, pointerID, primary, rawX, rawY) {
    this.initialize(type, stageX, stageY, target, nativeEvent, pointerID, primary, rawX, rawY)
  };
  var p = MouseEvent.prototype;
  p.stageX = 0;
  p.stageY = 0;
  p.rawX = 0;
  p.rawY = 0;
  p.type = null;
  p.nativeEvent = null;
  p.onMouseMove = null;
  p.onMouseUp = null;
  p.target = null;
  p.pointerID = 0;
  p.primary = false;
  p.addEventListener = null;
  p.removeEventListener = null;
  p.removeAllEventListeners = null;
  p.dispatchEvent = null;
  p.hasEventListener = null;
  p._listeners = null;
  createjs.EventDispatcher.initialize(p);
  p.initialize = function(type, stageX, stageY, target, nativeEvent, pointerID, primary, rawX, rawY) {
    this.type = type;
    this.stageX = stageX;
    this.stageY = stageY;
    this.target = target;
    this.nativeEvent = nativeEvent;
    this.pointerID = pointerID;
    this.primary = primary;
    this.rawX = rawX == null ? stageX : rawX;
    this.rawY = rawY == null ? stageY : rawY
  };
  p.clone = function() {
    return new MouseEvent(this.type, this.stageX, this.stageY, this.target, this.nativeEvent, this.pointerID, this.primary, this.rawX, this.rawY)
  };
  p.toString = function() {
    return"[MouseEvent (type=" + this.type + " stageX=" + this.stageX + " stageY=" + this.stageY + ")]"
  };
  createjs.MouseEvent = MouseEvent
})();
this.createjs = this.createjs || {};
(function() {
  var Matrix2D = function(a, b, c, d, tx, ty) {
    this.initialize(a, b, c, d, tx, ty)
  };
  var p = Matrix2D.prototype;
  Matrix2D.identity = null;
  Matrix2D.DEG_TO_RAD = Math.PI / 180;
  p.a = 1;
  p.b = 0;
  p.c = 0;
  p.d = 1;
  p.tx = 0;
  p.ty = 0;
  p.alpha = 1;
  p.shadow = null;
  p.compositeOperation = null;
  p.initialize = function(a, b, c, d, tx, ty) {
    if(a != null) {
      this.a = a
    }
    this.b = b || 0;
    this.c = c || 0;
    if(d != null) {
      this.d = d
    }
    this.tx = tx || 0;
    this.ty = ty || 0;
    return this
  };
  p.prepend = function(a, b, c, d, tx, ty) {
    var tx1 = this.tx;
    if(a != 1 || b != 0 || c != 0 || d != 1) {
      var a1 = this.a;
      var c1 = this.c;
      this.a = a1 * a + this.b * c;
      this.b = a1 * b + this.b * d;
      this.c = c1 * a + this.d * c;
      this.d = c1 * b + this.d * d
    }
    this.tx = tx1 * a + this.ty * c + tx;
    this.ty = tx1 * b + this.ty * d + ty;
    return this
  };
  p.append = function(a, b, c, d, tx, ty) {
    var a1 = this.a;
    var b1 = this.b;
    var c1 = this.c;
    var d1 = this.d;
    this.a = a * a1 + b * c1;
    this.b = a * b1 + b * d1;
    this.c = c * a1 + d * c1;
    this.d = c * b1 + d * d1;
    this.tx = tx * a1 + ty * c1 + this.tx;
    this.ty = tx * b1 + ty * d1 + this.ty;
    return this
  };
  p.prependMatrix = function(matrix) {
    this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    this.prependProperties(matrix.alpha, matrix.shadow, matrix.compositeOperation);
    return this
  };
  p.appendMatrix = function(matrix) {
    this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    this.appendProperties(matrix.alpha, matrix.shadow, matrix.compositeOperation);
    return this
  };
  p.prependTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
    if(rotation % 360) {
      var r = rotation * Matrix2D.DEG_TO_RAD;
      var cos = Math.cos(r);
      var sin = Math.sin(r)
    }else {
      cos = 1;
      sin = 0
    }
    if(regX || regY) {
      this.tx -= regX;
      this.ty -= regY
    }
    if(skewX || skewY) {
      skewX *= Matrix2D.DEG_TO_RAD;
      skewY *= Matrix2D.DEG_TO_RAD;
      this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
      this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y)
    }else {
      this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y)
    }
    return this
  };
  p.appendTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
    if(rotation % 360) {
      var r = rotation * Matrix2D.DEG_TO_RAD;
      var cos = Math.cos(r);
      var sin = Math.sin(r)
    }else {
      cos = 1;
      sin = 0
    }
    if(skewX || skewY) {
      skewX *= Matrix2D.DEG_TO_RAD;
      skewY *= Matrix2D.DEG_TO_RAD;
      this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
      this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0)
    }else {
      this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y)
    }
    if(regX || regY) {
      this.tx -= regX * this.a + regY * this.c;
      this.ty -= regX * this.b + regY * this.d
    }
    return this
  };
  p.rotate = function(angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    var a1 = this.a;
    var c1 = this.c;
    var tx1 = this.tx;
    this.a = a1 * cos - this.b * sin;
    this.b = a1 * sin + this.b * cos;
    this.c = c1 * cos - this.d * sin;
    this.d = c1 * sin + this.d * cos;
    this.tx = tx1 * cos - this.ty * sin;
    this.ty = tx1 * sin + this.ty * cos;
    return this
  };
  p.skew = function(skewX, skewY) {
    skewX = skewX * Matrix2D.DEG_TO_RAD;
    skewY = skewY * Matrix2D.DEG_TO_RAD;
    this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
    return this
  };
  p.scale = function(x, y) {
    this.a *= x;
    this.d *= y;
    this.tx *= x;
    this.ty *= y;
    return this
  };
  p.translate = function(x, y) {
    this.tx += x;
    this.ty += y;
    return this
  };
  p.identity = function() {
    this.alpha = this.a = this.d = 1;
    this.b = this.c = this.tx = this.ty = 0;
    this.shadow = this.compositeOperation = null;
    return this
  };
  p.invert = function() {
    var a1 = this.a;
    var b1 = this.b;
    var c1 = this.c;
    var d1 = this.d;
    var tx1 = this.tx;
    var n = a1 * d1 - b1 * c1;
    this.a = d1 / n;
    this.b = -b1 / n;
    this.c = -c1 / n;
    this.d = a1 / n;
    this.tx = (c1 * this.ty - d1 * tx1) / n;
    this.ty = -(a1 * this.ty - b1 * tx1) / n;
    return this
  };
  p.isIdentity = function() {
    return this.tx == 0 && this.ty == 0 && this.a == 1 && this.b == 0 && this.c == 0 && this.d == 1
  };
  p.decompose = function(target) {
    if(target == null) {
      target = {}
    }
    target.x = this.tx;
    target.y = this.ty;
    target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
    target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
    var skewX = Math.atan2(-this.c, this.d);
    var skewY = Math.atan2(this.b, this.a);
    if(skewX == skewY) {
      target.rotation = skewY / Matrix2D.DEG_TO_RAD;
      if(this.a < 0 && this.d >= 0) {
        target.rotation += target.rotation <= 0 ? 180 : -180
      }
      target.skewX = target.skewY = 0
    }else {
      target.skewX = skewX / Matrix2D.DEG_TO_RAD;
      target.skewY = skewY / Matrix2D.DEG_TO_RAD
    }
    return target
  };
  p.reinitialize = function(a, b, c, d, tx, ty, alpha, shadow, compositeOperation) {
    this.initialize(a, b, c, d, tx, ty);
    this.alpha = alpha || 1;
    this.shadow = shadow;
    this.compositeOperation = compositeOperation;
    return this
  };
  p.copy = function(matrix) {
    return this.reinitialize(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty, matrix.alpha, matrix.shadow, matrix.compositeOperation)
  };
  p.appendProperties = function(alpha, shadow, compositeOperation) {
    this.alpha *= alpha;
    this.shadow = shadow || this.shadow;
    this.compositeOperation = compositeOperation || this.compositeOperation;
    return this
  };
  p.prependProperties = function(alpha, shadow, compositeOperation) {
    this.alpha *= alpha;
    this.shadow = this.shadow || shadow;
    this.compositeOperation = this.compositeOperation || compositeOperation;
    return this
  };
  p.clone = function() {
    var mtx = new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
    mtx.shadow = this.shadow;
    mtx.alpha = this.alpha;
    mtx.compositeOperation = this.compositeOperation;
    return mtx
  };
  p.toString = function() {
    return"[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]"
  };
  Matrix2D.identity = new Matrix2D(1, 0, 0, 1, 0, 0);
  createjs.Matrix2D = Matrix2D
})();
this.createjs = this.createjs || {};
(function() {
  var Point = function(x, y) {
    this.initialize(x, y)
  };
  var p = Point.prototype;
  p.x = 0;
  p.y = 0;
  p.initialize = function(x, y) {
    this.x = x == null ? 0 : x;
    this.y = y == null ? 0 : y
  };
  p.clone = function() {
    return new Point(this.x, this.y)
  };
  p.toString = function() {
    return"[Point (x=" + this.x + " y=" + this.y + ")]"
  };
  createjs.Point = Point
})();
this.createjs = this.createjs || {};
(function() {
  var Rectangle = function(x, y, width, height) {
    this.initialize(x, y, width, height)
  };
  var p = Rectangle.prototype;
  p.x = 0;
  p.y = 0;
  p.width = 0;
  p.height = 0;
  p.initialize = function(x, y, width, height) {
    this.x = x == null ? 0 : x;
    this.y = y == null ? 0 : y;
    this.width = width == null ? 0 : width;
    this.height = height == null ? 0 : height;
    this._flId = createjs.UID.get()
  };
  p.clone = function() {
    return new Rectangle(this.x, this.y, this.width, this.height)
  };
  p.toString = function() {
    return"[Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")]"
  };
  p._flType = "rct";
  p._flX = 0;
  p._flY = 0;
  p._flWidth = 0;
  p._flHeight = 0;
  p._flCtx = null;
  p._flId = null;
  p._flRefs = 0;
  p._flSync = function() {
    if(this._flCtx && (this._flX !== this.x || this._flY !== this.y || this._flWidth !== this.width || this._flHeight !== this.height)) {
      this._flX = this.x;
      this._flY = this.y;
      this._flWidth = this.width;
      this._flHeight = this.height;
      this._flCtx._flChange.push([this._flId, "dim", [this.x, this.y, this.width, this.height]])
    }
  };
  p._flResetProps = function() {
    this._flX = this._flY = this._flWidth = this._flHeight = 0;
    this._flSourceRect = this._flCtx = null
  };
  p._flRetain = function(ctx) {
    this._flRefs++;
    if(!this._flCtx) {
      this._flCtx = ctx;
      ctx._flCreate.push([this._flType, this])
    }
  };
  p._flDeretain = function() {
    this._flRefs--
  };
  createjs.Rectangle = Rectangle
})();
this.createjs = this.createjs || {};
(function() {
  var ButtonHelper = function(target, outLabel, overLabel, downLabel, play, hitArea, hitLabel) {
    this.initialize(target, outLabel, overLabel, downLabel, play, hitArea, hitLabel)
  };
  var p = ButtonHelper.prototype;
  p.target = null;
  p.overLabel = null;
  p.outLabel = null;
  p.downLabel = null;
  p.play = false;
  p._isPressed = false;
  p._isOver = false;
  p.initialize = function(target, outLabel, overLabel, downLabel, play, hitArea, hitLabel) {
    if(!target.addEventListener) {
      return
    }
    this.target = target;
    target.cursor = "pointer";
    this.overLabel = overLabel == null ? "over" : overLabel;
    this.outLabel = outLabel == null ? "out" : outLabel;
    this.downLabel = downLabel == null ? "down" : downLabel;
    this.play = play;
    this.setEnabled(true);
    this.handleEvent({});
    if(hitArea) {
      if(hitLabel) {
        hitArea.actionsEnabled = false;
        hitArea.gotoAndStop && hitArea.gotoAndStop(hitLabel)
      }
      target.hitArea = hitArea
    }
  };
  p.setEnabled = function(value) {
    var o = this.target;
    if(value) {
      o.addEventListener("mouseover", this);
      o.addEventListener("mouseout", this);
      o.addEventListener("mousedown", this)
    }else {
      o.removeEventListener("mouseover", this);
      o.removeEventListener("mouseout", this);
      o.removeEventListener("mousedown", this)
    }
  };
  p.toString = function() {
    return"[ButtonHelper]"
  };
  p.handleEvent = function(evt) {
    var label, t = this.target, type = evt.type;
    if(type == "mousedown") {
      evt.addEventListener("mouseup", this);
      this._isPressed = true;
      label = this.downLabel
    }else {
      if(type == "mouseup") {
        this._isPressed = false;
        label = this._isOver ? this.overLabel : this.outLabel
      }else {
        if(type == "mouseover") {
          this._isOver = true;
          label = this._isPressed ? this.downLabel : this.overLabel
        }else {
          this._isOver = false;
          label = this._isPressed ? this.overLabel : this.outLabel
        }
      }
    }
    if(this.play) {
      t.gotoAndPlay && t.gotoAndPlay(label)
    }else {
      t.gotoAndStop && t.gotoAndStop(label)
    }
  };
  createjs.ButtonHelper = ButtonHelper
})();
this.createjs = this.createjs || {};
(function() {
  function ContextFl(thecanvas) {
    this.initialize(thecanvas)
  }
  var p = ContextFl.prototype;
  p._flCommandQueues = null;
  p._flInstance = null;
  p._flInstanceID = null;
  p._flChange = null;
  p._flCreate = null;
  p._flItemIndex = null;
  p._flCurPressEvent = null;
  p._flCanvas = null;
  p._flFlushCount = 0;
  p._flFlush = function() {
    if(this.flReady) {
      var inst = this._flInstance, index = this._flItemIndex, item;
      if(this._flCommands.length) {
        inst.sendCommands(this._flCommands);
        this._flCommands = []
      }
      if(this._flCreate.length) {
        var creates = this._flCreate;
        for(var i = 0, l = creates.length;i < l;++i) {
          item = creates[i][1];
          creates[i][1] = item._flId;
          index[item._flId] = item
        }
        inst.sendCreate(this._flCreate);
        this._flCreate = []
      }
      if(this._flChange.length) {
        inst.sendChange(this._flChange);
        this._flChange = []
      }
      this._flFlushCount++;
      if(this._flFlushCount % CanvasFl.FL_GC_INTERVAL === 0) {
        this._flCollectGarbage()
      }
    }
  };
  p._flCollectGarbage = function() {
    var destroys, prop, index, inst, item;
    destroys = [];
    index = this._flItemIndex;
    for(prop in index) {
      if(index[prop]._flRefs < 1) {
        item = index[prop];
        destroys.push([item._flType, item._flId]);
        delete index[prop];
        item._flResetProps()
      }
    }
    if(destroys.length) {
      this._flInstance.sendDestroy(destroys)
    }
  };
  p.flInvoke = function(id, methodId, args) {
    if(this._flInstance) {
      return this._flInstance.sendInvoke([id, methodId, args])
    }
    return null
  };
  p._flOnReady = function() {
    this._flInstance = ContextFl._flGetInstance(this._flInstanceID);
    this.flReady = true;
    this._flFlush();
    if(this._flCanvas._stage && this._flCanvas._stage.flOnReady) {
      this._flCanvas._stage.flReady = true;
      this._flCanvas._stage.flOnReady(this._flCanvas._stage)
    }
  };
  p.initialize = function(thecanvas) {
    var myID, self = this;
    var cnvID = thecanvas.getAttribute("id"), fl_swf_url = thecanvas.getAttribute("fl_swf_url") || CanvasFl.FL_URL;
    function handleEvents(obj) {
      var evt, item, target, evtKeyVal;
      evtKeyVal = ContextFl._flEventMap[obj.type];
      if(evtKeyVal) {
        if(obj.type === "mousemove" || obj.type === "mouseup") {
          item = self._flCurPressEvent;
          target = item.target;
          if(obj.type === "mouseup") {
            self._flCurPressEvent = null
          }
        }else {
          if(obj.type === "stagemousedown" || obj.type === "stagemouseup") {
            item = target = self._flCanvas._stage
          }else {
            item = target = self._flItemIndex[obj.id]
          }
        }
        if(item && (item[evtKeyVal] || item.hasEventListener(obj.type))) {
          evt = new createjs.MouseEvent(obj.type, obj.stageX, obj.stageY, target, null);
          item[evtKeyVal] && item[evtKeyVal](evt);
          item.dispatchEvent(evt);
          if(obj.type === "mousedown") {
            self._flCurPressEvent = evt
          }
        }
      }
    }
    this._flCreate = [];
    this._flChange = [];
    this._flCommands = [];
    this._flItemIndex = {};
    myID = "EaselFl_" + ContextFl._flCount++;
    this._flInstanceID = cnvID || myID;
    if(cnvID !== this._flInstanceID) {
      thecanvas.setAttribute("id", myID)
    }
    CanvasFl._flHooks[myID] = function() {
      CanvasFl._flHooks[myID] = handleEvents;
      self._flOnReady()
    };
    ContextFl._flLoadInstance(myID, thecanvas.width, thecanvas.height, thecanvas.transparent, this._flInstanceID, fl_swf_url)
  };
  ContextFl._flEventMap = {dblclick:"onDblClick", click:"onClick", mousemove:"onMouseMove", mouseout:"onMouseOut", mouseover:"onMouseOver", mousedown:"onPress", mouseup:"onMouseUp", stagemousedown:"onMouseDown", stagemouseup:"onMouseUp"};
  ContextFl._flCount = 0;
  ContextFl._flLoadInstance = function(id, width, height, transparent, elementId, swfUrl) {
    var flashvars = {id:id};
    var params = {scale:"noscale", salign:"TL", wmode:transparent ? "transparent" : "opaque"};
    swfobject.embedSWF(swfUrl, elementId, width.toString(), height.toString(), "9.0.0", false, flashvars, params)
  };
  ContextFl._flGetInstance = function(id) {
    return document.getElementById(id)
  };
  function CanvasFl(thecanvas) {
    var trans;
    thecanvas.width = parseFloat(thecanvas.getAttribute("width") || CanvasFl.FL_WIDTH);
    thecanvas.height = parseFloat(thecanvas.getAttribute("height") || CanvasFl.FL_HEIGHT);
    trans = thecanvas.getAttribute("transparent");
    thecanvas.transparent = !trans || trans === true || trans.toLowerCase() === "true";
    this._ctx = new ContextFl(thecanvas);
    this._ctx._flCanvas = this;
    this.width = thecanvas.width;
    this.height = thecanvas.height
  }
  p = CanvasFl.prototype;
  p._ctx = null;
  p._stage = null;
  p.width = 0;
  p.height = 0;
  p.transparent = true;
  p.isFl = true;
  p.getContext = function(type) {
    if(type === "2d") {
      return this._ctx
    }
    return null
  };
  CanvasFl.FL_URL = "EaselFl.swf";
  CanvasFl.FL_WIDTH = "400";
  CanvasFl.FL_HEIGHT = "400";
  CanvasFl.FL_GC_INTERVAL = 360;
  CanvasFl._flHooks = {};
  createjs.CanvasFl = CanvasFl
})();
this.createjs = this.createjs || {};
(function() {
  var ImageFl = function(img) {
    this._flId = createjs.UID.get();
    this._img = img
  };
  var p = ImageFl.prototype;
  p._flType = "img";
  p._flId = null;
  p._img = null;
  p._flCtx = null;
  p._flSrc = null;
  p.sync = function() {
    if(this._flSrc !== this._img.src) {
      this._flSrc = this._img.src;
      this._flCtx._flChange.push([this._flId, "src", this._flSrc])
    }
    return this
  };
  p._flRefs = 0;
  p.retain = function(ctx) {
    this._flRefs++;
    if(!this._flCtx) {
      this._flCtx = ctx;
      ctx._flCreate.push([this._flType, this])
    }
    return this
  };
  p.deretain = function() {
    this._flRefs--
  };
  p._flResetProps = function() {
    this._flCtx = this._flSrc = null
  };
  ImageFl.watch = function(HTMLImageElement) {
    if(!HTMLImageElement.__fl) {
      HTMLImageElement.__fl = new ImageFl(HTMLImageElement);
      return true
    }
    return false
  };
  createjs.ImageFl = ImageFl
})();
this.createjs = this.createjs || {};
(function() {
  var Shadow = function(color, offsetX, offsetY, blur) {
    this.initialize(color, offsetX, offsetY, blur)
  };
  var p = Shadow.prototype;
  Shadow.identity = null;
  p.color = null;
  p.offsetX = 0;
  p.offsetY = 0;
  p.blur = 0;
  p.initialize = function(color, offsetX, offsetY, blur) {
    this.color = color;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.blur = blur;
    this._flId = createjs.UID.get()
  };
  p.toString = function() {
    return"[Shadow]"
  };
  p.clone = function() {
    return new Shadow(this.color, this.offsetX, this.offsetY, this.blur)
  };
  p._flType = "shd";
  p._flRefs = 0;
  p._flId = null;
  p._flCtx = null;
  p._flColor = null;
  p._flOffsetX = 0;
  p._flOffsetY = 0;
  p._flBlur = 0;
  p._flSyncProps = function() {
    if(this.color !== this._flColor || this.offsetX !== this._flOffsetX || this.offsetY !== this._flOffsetY || this.blur !== this._flBlur) {
      this._flCtx._flChange.push([this._flId, "shd", [this.color, this.offsetX, this.offsetY, this.blur]]);
      this._flColor = this.color;
      this._flOffsetX = this.offsetX;
      this._flOffsetY = this.offsetY;
      this._flBlur = this.blur
    }
  };
  p._flRetain = function(ctx) {
    if(!this._flCtx) {
      this._flCtx = ctx;
      ctx._flCreate.push([this._flType, this])
    }
    this._flRefs++
  };
  p._flDeretain = function() {
    this._flRefs--
  };
  p._flResetProps = function() {
    this._flCtx = this._flColor = null;
    this._flOffsetX = this._flOffsetY = this._flBlur = 0
  };
  Shadow.identity = new Shadow("transparent", 0, 0, 0);
  createjs.Shadow = Shadow
})();
this.createjs = this.createjs || {};
(function() {
  var FrameFl = function(frame) {
    this._flId = createjs.UID.get();
    this._frame = frame
  };
  var p = FrameFl.prototype;
  p._flId = null;
  p._frame = null;
  p._flCtx = null;
  p._flRefs = 0;
  p._flType = "frm";
  p._flDep = null;
  p.retain = function(ctx) {
    this._flRefs++;
    if(!this._flCtx) {
      var f = this._frame;
      this._flCtx = ctx;
      ctx._flCreate.push([this._flType, this]);
      if(f.flip) {
        FrameFl.watch(f.src);
        this._flDep = f.src.__fl;
        this._flDep.retain(ctx);
        ctx._flChange.push([this._flId, "flp", [this._flDep._flId, f.h, f.v]])
      }else {
        createjs.ImageFl.watch(f.image);
        this._flDep = f.image.__fl;
        this._flDep.retain(ctx).sync();
        ctx._flChange.push([this._flId, "init", [this._flDep._flId, f.rect.x, f.rect.y, f.rect.width, f.rect.height, f.regX, f.regY]])
      }
    }else {
      this._flDep.retain(ctx)
    }
  };
  p.deretain = function() {
    this._flRefs--;
    this._flDep.deretain()
  };
  p._flResetProps = function() {
    this._flCtx = this._flDep = null
  };
  FrameFl.watch = function(frame) {
    if(!frame.__fl) {
      frame.__fl = new FrameFl(frame);
      return true
    }
    return false
  };
  createjs.FrameFl = FrameFl
})();
this.createjs = this.createjs || {};
(function() {
  var SpriteSheet = function(data) {
    this.initialize(data)
  };
  var p = SpriteSheet.prototype;
  p.complete = true;
  p.onComplete = null;
  p.addEventListener = null;
  p.removeEventListener = null;
  p.removeAllEventListeners = null;
  p.dispatchEvent = null;
  p.hasEventListener = null;
  p._listeners = null;
  createjs.EventDispatcher.initialize(p);
  p._animations = null;
  p._frames = null;
  p._images = null;
  p._data = null;
  p._loadCount = 0;
  p._frameHeight = 0;
  p._frameWidth = 0;
  p._numFrames = 0;
  p._regX = 0;
  p._regY = 0;
  p.initialize = function(data) {
    var i, l, o, a;
    if(data == null) {
      return
    }
    if(data.images && (l = data.images.length) > 0) {
      a = this._images = [];
      for(i = 0;i < l;i++) {
        var img = data.images[i], src = null;
        if(typeof img == "string") {
          src = img;
          img = new Image
        }
        a.push(img);
        if(!img.getContext && !img.complete && img.readyState !== "complete") {
          this._loadCount++;
          this.complete = false;
          (function(o) {
            img.onload = function() {
              o._handleImageLoad()
            }
          })(this)
        }
        if(src) {
          img.src = src
        }
      }
    }
    if(data.frames == null) {
    }else {
      if(data.frames instanceof Array) {
        this._frames = [];
        a = data.frames;
        for(i = 0, l = a.length;i < l;i++) {
          var arr = a[i];
          this._frames.push({image:this._images[arr[4] ? arr[4] : 0], rect:new createjs.Rectangle(arr[0], arr[1], arr[2], arr[3]), regX:arr[5] || 0, regY:arr[6] || 0})
        }
      }else {
        o = data.frames;
        this._frameWidth = o.width;
        this._frameHeight = o.height;
        this._regX = o.regX || 0;
        this._regY = o.regY || 0;
        this._numFrames = o.count;
        if(this._loadCount == 0) {
          this._calculateFrames()
        }
      }
    }
    if((o = data.animations) != null) {
      this._animations = [];
      this._data = {};
      var name;
      for(name in o) {
        var anim = {name:name};
        var obj = o[name];
        if(typeof obj == "number") {
          a = anim.frames = [obj]
        }else {
          if(obj instanceof Array) {
            if(obj.length == 1) {
              anim.frames = [obj[0]]
            }else {
              anim.frequency = obj[3];
              anim.next = obj[2];
              a = anim.frames = [];
              for(i = obj[0];i <= obj[1];i++) {
                a.push(i)
              }
            }
          }else {
            anim.frequency = obj.frequency;
            anim.next = obj.next;
            var frames = obj.frames;
            a = anim.frames = typeof frames == "number" ? [frames] : frames.slice(0)
          }
        }
        anim.next = a.length < 2 || anim.next == false ? null : anim.next == null || anim.next == true ? name : anim.next;
        if(!anim.frequency) {
          anim.frequency = 1
        }
        this._animations.push(name);
        this._data[name] = anim
      }
    }
  };
  p.getNumFrames = function(animation) {
    if(animation == null) {
      return this._frames ? this._frames.length : this._numFrames
    }else {
      var data = this._data[animation];
      if(data == null) {
        return 0
      }else {
        return data.frames.length
      }
    }
  };
  p.getAnimations = function() {
    return this._animations.slice(0)
  };
  p.getAnimation = function(name) {
    return this._data[name]
  };
  p.getFrame = function(frameIndex) {
    var frame;
    if(this.complete && this._frames && (frame = this._frames[frameIndex])) {
      return frame
    }
    return null
  };
  p.getFrameBounds = function(frameIndex) {
    var frame = this.getFrame(frameIndex);
    return frame ? new createjs.Rectangle(-frame.regX, -frame.regY, frame.rect.width, frame.rect.height) : null
  };
  p.toString = function() {
    return"[SpriteSheet]"
  };
  p.clone = function() {
    var o = new SpriteSheet;
    o.complete = this.complete;
    o._animations = this._animations;
    o._frames = this._frames;
    o._images = this._images;
    o._data = this._data;
    o._frameHeight = this._frameHeight;
    o._frameWidth = this._frameWidth;
    o._numFrames = this._numFrames;
    o._loadCount = this._loadCount;
    return o
  };
  p._handleImageLoad = function() {
    if(--this._loadCount == 0) {
      this._calculateFrames();
      this.complete = true;
      this.onComplete && this.onComplete();
      this.dispatchEvent("complete")
    }
  };
  p._calculateFrames = function() {
    if(this._frames || this._frameWidth == 0) {
      return
    }
    this._frames = [];
    var ttlFrames = 0;
    var fw = this._frameWidth;
    var fh = this._frameHeight;
    for(var i = 0, imgs = this._images;i < imgs.length;i++) {
      var img = imgs[i];
      var cols = (img.width + 1) / fw | 0;
      var rows = (img.height + 1) / fh | 0;
      var ttl = this._numFrames > 0 ? Math.min(this._numFrames - ttlFrames, cols * rows) : cols * rows;
      for(var j = 0;j < ttl;j++) {
        this._frames.push({image:img, rect:new createjs.Rectangle(j % cols * fw, (j / cols | 0) * fh, fw, fh), regX:this._regX, regY:this._regY})
      }
      ttlFrames += ttl
    }
    this._numFrames = ttlFrames
  };
  createjs.SpriteSheet = SpriteSheet
})();
this.createjs = this.createjs || {};
(function() {
  var Graphics = function() {
    this.initialize()
  };
  var p = Graphics.prototype;
  Graphics.getRGB = function(r, g, b, alpha) {
    if(r != null && b == null) {
      alpha = g;
      b = r & 255;
      g = r >> 8 & 255;
      r = r >> 16 & 255
    }
    if(alpha == null) {
      return"rgb(" + r + "," + g + "," + b + ")"
    }else {
      return"rgba(" + r + "," + g + "," + b + "," + alpha + ")"
    }
  };
  Graphics.getHSL = function(hue, saturation, lightness, alpha) {
    if(alpha == null) {
      return"hsl(" + hue % 360 + "," + saturation + "%," + lightness + "%)"
    }else {
      return"hsla(" + hue % 360 + "," + saturation + "%," + lightness + "%," + alpha + ")"
    }
  };
  Graphics.BASE_64 = {"A":0, "B":1, "C":2, "D":3, "E":4, "F":5, "G":6, "H":7, "I":8, "J":9, "K":10, "L":11, "M":12, "N":13, "O":14, "P":15, "Q":16, "R":17, "S":18, "T":19, "U":20, "V":21, "W":22, "X":23, "Y":24, "Z":25, "a":26, "b":27, "c":28, "d":29, "e":30, "f":31, "g":32, "h":33, "i":34, "j":35, "k":36, "l":37, "m":38, "n":39, "o":40, "p":41, "q":42, "r":43, "s":44, "t":45, "u":46, "v":47, "w":48, "x":49, "y":50, "z":51, "0":52, 1:53, 2:54, 3:55, 4:56, 5:57, 6:58, 7:59, 8:60, 9:61, "+":62, "/":63};
  Graphics.STROKE_CAPS_MAP = ["butt", "round", "square"];
  Graphics.STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
  p._strokeInstructions = null;
  p._strokeStyleInstructions = null;
  p._ignoreScaleStroke = false;
  p._fillInstructions = null;
  p._instructions = null;
  p._oldInstructions = null;
  p._activeInstructions = null;
  p._active = false;
  p._dirty = false;
  p.initialize = function() {
    this._flId = this.id = createjs.UID.get();
    this._flChange = [];
    this._flState = [];
    this._flImageRequests = [];
    this._flImageLinks = []
  };
  p.isEmpty = function() {
    return!this._flState.length
  };
  p.draw = function(ctx) {
    while(this._flImageRequests.length) {
      this._flImageLinks.push(this._flImageRequests.pop().retain(ctx).sync())
    }
    if(this._flChange.length) {
      for(var i = 0, l = this._flChange.length;i < l;++i) {
        ctx._flChange.push(this._flChange[i])
      }
      this._flChange = []
    }
  };
  p.moveTo = function(x, y) {
    this._flRecord([this._flId, "mt", [x, y]]);
    return this
  };
  p.lineTo = function(x, y) {
    this._flRecord([this._flId, "lt", [x, y]]);
    return this
  };
  p.arcTo = function(x1, y1, x2, y2, radius) {
    this._flRecord([this._flId, "at", [x1, y1, x2, y2, radius]]);
    return this
  };
  p.arc = function(x, y, radius, startAngle, endAngle, anticlockwise) {
    if(anticlockwise == null) {
      anticlockwise = false
    }
    this._flRecord([this._flId, "a", [x, y, radius, startAngle, endAngle, anticlockwise]]);
    return this
  };
  p.quadraticCurveTo = function(cpx, cpy, x, y) {
    this._flRecord([this._flId, "qt", [cpx, cpy, x, y]]);
    return this
  };
  p.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
    this._flRecord([this._flId, "bt", [cp1x, cp1y, cp2x, cp2y, x, y]]);
    return this
  };
  p.rect = function(x, y, w, h) {
    this._flRecord([this._flId, "dr", [x, y, w, h]]);
    return this
  };
  p.closePath = function() {
    this._flRecord([this._flId, "cp"]);
    return this
  };
  p.clear = function() {
    this._flRecord([this._flId, "c"]);
    return this
  };
  p.beginFill = function(color) {
    this._flRecord([this._flId, "f", [color]]);
    return this
  };
  p.beginLinearGradientFill = function(colors, ratios, x0, y0, x1, y1) {
    this._flRecord([this._flId, "lf", [colors, ratios, x0, y0, x1, y1]]);
    return this
  };
  p.beginRadialGradientFill = function(colors, ratios, x0, y0, r0, x1, y1, r1) {
    this._flRecord([this._flId, "rf", [colors, ratios, x0, y0, r0, x1, y1, r1]]);
    return this
  };
  p.beginBitmapFill = function(image, repetition, matrix) {
    if(createjs.Stage.FL_LOG_PART_IMPLEMENTED && (repetition && repetition === "repeat-x" || repetition === "repeat-y")) {
      createjs.Log.log("EaselFl:Graphics.beginBitmapFill currently does not implement repeat-x or repeat-y", null, createjs.Log.WARNING)
    }
    createjs.ImageFl.watch(image);
    this._flImageRequests.push(image.__fl);
    this._flRecord([this._flId, "bf", [image.__fl._flId, repetition, !matrix ? null : [matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty]]]);
    return this
  };
  p.endFill = function() {
    this._flRecord([this._flId, "ef"]);
    return this
  };
  p.setStrokeStyle = function(thickness, caps, joints, miterLimit, ignoreScale) {
    this._flRecord([this._flId, "ss", [thickness, caps, joints, miterLimit, !!ignoreScale]]);
    return this
  };
  p.beginStroke = function(color) {
    this._flRecord([this._flId, "s", color]);
    return this
  };
  p.beginLinearGradientStroke = function(colors, ratios, x0, y0, x1, y1) {
    this._flRecord([this._flId, "ls", [colors, ratios, x0, y0, x1, y1]]);
    return this
  };
  p.beginRadialGradientStroke = function(colors, ratios, x0, y0, r0, x1, y1, r1) {
    this._flRecord([this._flId, "rs", [colors, ratios, x0, y0, r0, x1, y1, r1]]);
    return this
  };
  p.beginBitmapStroke = function(image, repetition) {
    createjs.ImageFl.watch(image);
    this._flImageRequests.push(image.__fl);
    this._flRecord([this._flId, "bs", [image.__fl._flId, repetition]]);
    return this
  };
  p.endStroke = function() {
    this._flRecord([this._flId, "es"]);
    return this
  };
  p.curveTo = p.quadraticCurveTo;
  p.drawRect = p.rect;
  p.drawRoundRect = function(x, y, w, h, radius) {
    this._flRecord([this._flId, "rr", [x, y, w, h, radius]]);
    return this
  };
  p.drawRoundRectComplex = function(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
    this._flRecord([this._flId, "rc", [x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL]]);
    return this
  };
  p.drawCircle = function(x, y, radius) {
    this._flRecord([this._flId, "dc", [x, y, radius]]);
    return this
  };
  p.drawEllipse = function(x, y, w, h) {
    this._flRecord([this._flId, "de", [x, y, w, h]]);
    return this
  };
  p.drawPolyStar = function(x, y, radius, sides, pointSize, angle) {
    this._flRecord([this._flId, "dp", [x, y, radius, sides, pointSize, angle]]);
    return this
  };
  p.decodePath = function(str) {
    var instructions = [this.moveTo, this.lineTo, this.quadraticCurveTo, this.bezierCurveTo, this.closePath];
    var paramCount = [2, 2, 4, 6, 0];
    var i = 0, l = str.length;
    var params = [];
    var x = 0, y = 0;
    var base64 = Graphics.BASE_64;
    while(i < l) {
      var c = str.charAt(i);
      var n = base64[c];
      var fi = n >> 3;
      var f = instructions[fi];
      if(!f || n & 3) {
        throw"bad path data (@" + i + "): " + c;
      }
      var pl = paramCount[fi];
      if(!fi) {
        x = y = 0
      }
      params.length = 0;
      i++;
      var charCount = (n >> 2 & 1) + 2;
      for(var p = 0;p < pl;p++) {
        var num = base64[str.charAt(i)];
        var sign = num >> 5 ? -1 : 1;
        num = (num & 31) << 6 | base64[str.charAt(i + 1)];
        if(charCount == 3) {
          num = num << 6 | base64[str.charAt(i + 2)]
        }
        num = sign * num / 10;
        if(p % 2) {
          x = num += x
        }else {
          y = num += y
        }
        params[p] = num;
        i += charCount
      }
      f.apply(this, params)
    }
    return this
  };
  p.clone = function() {
    var o = new Graphics;
    var state = o._flState = new Array(this._flState.length);
    for(var i = 0, l = state.length;i < l;++i) {
      state[i] = this._flState[i].slice();
      state[i][0] = o._flId
    }
    o._flChange = state.slice();
    o._flImageRequests = this._flImageLinks.slice().concat(this._flImageRequests);
    return o
  };
  p.toString = function() {
    return"[Graphics]"
  };
  p.mt = p.moveTo;
  p.lt = p.lineTo;
  p.at = p.arcTo;
  p.bt = p.bezierCurveTo;
  p.qt = p.quadraticCurveTo;
  p.a = p.arc;
  p.r = p.rect;
  p.cp = p.closePath;
  p.c = p.clear;
  p.f = p.beginFill;
  p.lf = p.beginLinearGradientFill;
  p.rf = p.beginRadialGradientFill;
  p.bf = p.beginBitmapFill;
  p.ef = p.endFill;
  p.ss = p.setStrokeStyle;
  p.s = p.beginStroke;
  p.ls = p.beginLinearGradientStroke;
  p.rs = p.beginRadialGradientStroke;
  p.bs = p.beginBitmapStroke;
  p.es = p.endStroke;
  p.dr = p.drawRect;
  p.rr = p.drawRoundRect;
  p.rc = p.drawRoundRectComplex;
  p.dc = p.drawCircle;
  p.de = p.drawEllipse;
  p.dp = p.drawPolyStar;
  p.p = p.decodePath;
  p._flChange = null;
  p._flChildImages = null;
  p._flId = -1;
  p._flState = null;
  p._flImageRequests = null;
  p._flImageLinks = null;
  p._flRefs = 0;
  p._flCtx = null;
  p._flType = "gfx";
  p._flRetain = function(ctx) {
    this._flRefs += 1;
    if(!this._flCtx) {
      this._flCtx = ctx;
      ctx._flCreate.push(["gfx", this])
    }
  };
  p._flDeretain = function() {
    this._flRefs -= 1
  };
  p._flResetProps = function() {
    this._flChange = this._flState.slice(0);
    this._flCtx = null;
    while(this._flImageLinks.length) {
      this._flImageLinks.pop().deretain()
    }
  };
  p._flRecord = function(command) {
    this._flChange.push(command);
    this._flState.push(command)
  };
  createjs.Graphics = Graphics
})();
this.createjs = this.createjs || {};
(function() {
  var DisplayObject = function() {
    this.initialize()
  };
  var p = DisplayObject.prototype;
  DisplayObject.suppressCrossDomainErrors = false;
  p.alpha = 1;
  p.cacheCanvas = null;
  p.id = -1;
  p.mouseEnabled = true;
  p.name = null;
  p.parent = null;
  p.regX = 0;
  p.regY = 0;
  p.rotation = 0;
  p.scaleX = 1;
  p.scaleY = 1;
  p.skewX = 0;
  p.skewY = 0;
  p.shadow = null;
  p.visible = true;
  p.x = 0;
  p.y = 0;
  p.compositeOperation = null;
  p.snapToPixel = false;
  p.onPress = null;
  p.onClick = null;
  p.onDoubleClick = null;
  p.onMouseOver = null;
  p.onMouseOut = null;
  p.onTick = null;
  p.filters = null;
  p.cacheID = 0;
  p.mask = null;
  p.hitArea = null;
  p.cursor = null;
  p.addEventListener = null;
  p.removeEventListener = null;
  p.removeAllEventListeners = null;
  p.dispatchEvent = null;
  p.hasEventListener = null;
  p._listeners = null;
  createjs.EventDispatcher.initialize(p);
  p._cacheOffsetX = 0;
  p._cacheOffsetY = 0;
  p._cacheScale = 1;
  p._cacheDataURLID = 0;
  p._cacheDataURL = null;
  p._matrix = null;
  p.initialize = function() {
    this.id = this._flId = createjs.UID.get();
    this._matrix = new createjs.Matrix2D;
    this._flChange = []
  };
  p.isVisible = function() {
    return!!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0)
  };
  p.draw = function(ctx, ignoreCache) {
    this._flSyncProps(ctx);
    if(this._flChange.length) {
      for(var i = 0, l = this._flChange.length;i < l;++i) {
        ctx._flChange.push(this._flChange[i])
      }
      this._flChange = []
    }
  };
  p.updateContext = function(ctx) {
    if(createjs.Stage.FL_THROW_UNIMPLEMENTED) {
      throw"EaselFl::DisplayObject.updateContext not yet implemented";
    }
  };
  p.cache = function(x, y, width, height, scale) {
    this._flCache = true;
    this._flCached = false;
    this._flFiltersDirty = true
  };
  p.updateCache = function(compositeOperation) {
    this._flCache = true;
    this._flCached = false;
    this._flFiltersDirty = true
  };
  p.uncache = function() {
    this._flCache = this._flCached = false
  };
  p.getCacheDataURL = function() {
    if(createjs.Stage.FL_THROW_UNIMPLEMENTED) {
      throw"EaselFl::DisplayObject.getCacheDataURL not yet implemented";
    }
  };
  p.getStage = function() {
    var o = this;
    while(o.parent) {
      o = o.parent
    }
    if(o instanceof createjs["Stage"]) {
      return o
    }
    return null
  };
  p.localToGlobal = function(x, y) {
    var mtx = this.getConcatenatedMatrix(this._matrix);
    if(mtx == null) {
      return null
    }
    mtx.append(1, 0, 0, 1, x, y);
    return new createjs.Point(mtx.tx, mtx.ty)
  };
  p.globalToLocal = function(x, y) {
    var mtx = this.getConcatenatedMatrix(this._matrix);
    if(mtx == null) {
      return null
    }
    mtx.invert();
    mtx.append(1, 0, 0, 1, x, y);
    return new createjs.Point(mtx.tx, mtx.ty)
  };
  p.localToLocal = function(x, y, target) {
    var pt = this.localToGlobal(x, y);
    return target.globalToLocal(pt.x, pt.y)
  };
  p.setTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
    this.x = x || 0;
    this.y = y || 0;
    this.scaleX = scaleX == null ? 1 : scaleX;
    this.scaleY = scaleY == null ? 1 : scaleY;
    this.rotation = rotation || 0;
    this.skewX = skewX || 0;
    this.skewY = skewY || 0;
    this.regX = regX || 0;
    this.regY = regY || 0;
    return this
  };
  p.getMatrix = function(matrix) {
    var o = this;
    return(matrix ? matrix.identity() : new createjs.Matrix2D).appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY).appendProperties(o.alpha, o.shadow, o.compositeOperation)
  };
  p.getConcatenatedMatrix = function(matrix) {
    if(matrix) {
      matrix.identity()
    }else {
      matrix = new createjs.Matrix2D
    }
    var o = this;
    while(o != null) {
      matrix.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY).prependProperties(o.alpha, o.shadow, o.compositeOperation);
      o = o.parent
    }
    return matrix
  };
  p.hitTest = function(x, y) {
    if(this._flCtx) {
      var val = this._flCtx.flInvoke(this.id, "htp", [x, y]);
      return val
    }
    return false
  };
  p.set = function(props) {
    for(var n in props) {
      this[n] = props[n]
    }
    return this
  };
  p.clone = function() {
    if(createjs.Stage.FL_THROW_UNIMPLEMENTED) {
      throw"EaselFl::DisplayObject.clone not yet implemented";
    }
    return false
  };
  p.toString = function() {
    return"[DisplayObject (name=" + this.name + ")]"
  };
  p.cloneProps = function(o) {
    o.alpha = this.alpha;
    o.name = this.name;
    o.regX = this.regX;
    o.regY = this.regY;
    o.rotation = this.rotation;
    o.scaleX = this.scaleX;
    o.scaleY = this.scaleY;
    o.shadow = this.shadow;
    o.skewX = this.skewX;
    o.skewY = this.skewY;
    o.visible = this.visible;
    o.x = this.x;
    o.y = this.y;
    o.mouseEnabled = this.mouseEnabled;
    o.compositeOperation = this.compositeOperation;
    o._flCache = this._flCache
  };
  p._tick = function(params) {
    this.onTick && this.onTick.apply(this, params);
    var ls = this._listeners;
    if(ls && ls["tick"]) {
      this.dispatchEvent({type:"tick", params:params})
    }
  };
  p._flId = -1;
  p._flRefs = 0;
  p._flCtx = null;
  p._flX = 0;
  p._flY = 0;
  p._flScaleX = 1;
  p._flScaleY = 1;
  p._flRotation = 0;
  p._flSkewX = 0;
  p._flSkewY = 0;
  p._flRegX = 0;
  p._flRegY = 0;
  p._flVisible = true;
  p._flAlpha = 1;
  p._flMouseEnabled = true;
  p._flMouseOver = false;
  p._flMouseOut = false;
  p._flMouseDown = false;
  p._flClick = false;
  p._flDblClick = false;
  p._flMask = null;
  p._flShadow = null;
  p._flCursor = null;
  p._flChange = null;
  p._flCache = false;
  p._flCached = false;
  p._flFiltersDirty = false;
  p._flFilters = null;
  p._flResetProps = function() {
    this._flVisible = true;
    this._flX = this._flY = this._flRotation = this._flRegX = this._flRegY = this._flSkewX = this._flSkeyY = 0;
    this._flAlpha = this._flScaleX = this._flScaleY = 1;
    this._flChange = [];
    this._flCtx = this._flShadow = this._flMask = this._flMouseEnabled = null;
    this._flMouseDown = this._flMouseOver = this._flMouseOut = this._flDblClick = this._flClick = this._flCache = this._flCached = this._flFiltersDirty = this._flUseHandCursor = this._flButtonMode = false
  };
  p._flSyncProps = function(ctx) {
    if(this.visible !== this._flVisible) {
      this._flVisible = this.visible;
      this._flChange.push([this._flId, "vs", this.visible])
    }
    if(!this.visible) {
      return
    }
    if(this.mouseEnabled !== this._flMouseEnabled) {
      this._flMouseEnabled = this.mouseEnabled;
      this._flChange.push([this._flId, "smen", this.mouseEnabled])
    }
    if(this.mouseEnabled) {
      var ls = this._listeners;
      if(Boolean(this.onPress || ls && ls.mousedown) !== this._flMouseDown) {
        this._flMouseDown = !this._flMouseDown;
        this._flChange.push([this._flId, this._flMouseDown ? "amod" : "rmod"])
      }
      if(Boolean(this.onMouseOver || ls && ls.mouseover) !== this._flMouseOver) {
        this._flMouseOver = !this._flMouseOver;
        this._flChange.push([this._flId, this._flMouseOver ? "amov" : "rmov"])
      }
      if(Boolean(this.onMouseOut || ls && ls.mouseout) !== this._flMouseOut) {
        this._flMouseOut = !this._flMouseOut;
        this._flChange.push([this._flId, this._flMouseOut ? "amot" : "rmot"])
      }
      if(Boolean(this.onClick || ls && ls.click) !== this._flClick) {
        this._flClick = !this._flClick;
        this._flChange.push([this._flId, this._flClick ? "amck" : "rmck"])
      }
      if(Boolean(this.onDblClick || ls && ls.dblclick) !== this._flDblClick) {
        this._flDblClick = !this._flDblClick;
        this._flChange.push([this._flId, this._flDblClick ? "adck" : "rdck"])
      }
    }
    if(this.cursor !== this._flCursor) {
      this._flChange.push([this._flId, "scrs", this.cursor]);
      this._flCursor = this.cursor
    }
    if(this.alpha !== this._flAlpha) {
      this._flAlpha = this.alpha;
      this._flChange.push([this._flId, "op", this.alpha])
    }
    if(this.shadow !== this._flShadow) {
      if(this._flShadow) {
        this._flShadow._flDeretain()
      }
      this._flShadow = this.shadow;
      if(this._flShadow) {
        this._flShadow._flRetain(ctx)
      }
      this._flChange.push([this._flId, "shd", this._flShadow ? this._flShadow._flId : null])
    }
    if(this.shadow) {
      this.shadow._flSyncProps()
    }
    if(this._flFiltersDirty) {
      var filterIDs, i, l;
      this._flFiltersDirty = false;
      if(this._flFilters) {
        for(i = 0, l = this._flFilters.length;i < l;++i) {
          this._flFilters[i]._flDeretain()
        }
        this._flFilters = null
      }
      if(this.filters && this.filters.length > 0) {
        filterIDs = [];
        for(i = 0, l = this.filters.length;i < l;i++) {
          var flt = this.filters[i];
          flt._flRetain(ctx);
          flt._flSyncProps(ctx);
          filterIDs[i] = flt._flId
        }
        this._flFilters = this.filters.slice(0);
        this._flChange.push([this._flId, "flts", filterIDs])
      }
    }
    if(this.mask !== this._flMask) {
      if(this._flMask) {
        this._flMask._flDeretain()
      }
      this._flMask = this.mask;
      if(this._flMask) {
        this._flMask._flRetain(ctx)
      }
      this._flChange.push([this._flId, "msk", this.mask ? this.mask._flId : null])
    }
    if(this._flMask) {
      this._flMask.draw(ctx)
    }
    if(this.x !== this._flX || this.y !== this._flY || this.scaleX !== this._flScaleX || this.scaleY !== this._flScaleY || this.rotation !== this._flRotation || this.skewX !== this._flSkewX || this.skewY !== this._flSkewY || this.regX !== this._flRegX || this.regY !== this._flRegY) {
      this._flX = this.x;
      this._flY = this.y;
      this._flScaleX = this.scaleX;
      this._flScaleY = this.scaleY;
      this._flRotation = this.rotation;
      this._flSkewX = this.skewX;
      this._flSkewY = this.skewY;
      this._flRegX = this.regX;
      this._flRegY = this.regY;
      var mtx = DisplayObject._flTempMtx;
      mtx.identity();
      mtx.prependTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.regX, this.regY);
      this._flChange.push([this._flId, "mtx", [mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty]])
    }
  };
  p._flRetain = function(ctx) {
    this._flRefs += 1;
    if(!this._flCtx) {
      this._flRunCreate(ctx)
    }
    if(this._flMask) {
      this._flMask._flRetain()
    }
    if(this._flShadow) {
      this._flShadow._flRetain()
    }
    if(this._flFilters) {
      for(var i = 0, l = this._flFilters.length;i < l;++i) {
        this._flFilters[i]._flRetain()
      }
    }
  };
  p._flDeretain = function() {
    this._flRefs -= 1;
    if(this._flMask) {
      this._flMask._flDeretain()
    }
    if(this._flShadow) {
      this._flShadow._flDeretain()
    }
    if(this._flFilters) {
      for(var i = 0, l = this._flFilters.length;i < l;++i) {
        this._flFilters[i]._flDeretain()
      }
    }
  };
  p._flRunCreate = function(ctx) {
    this._flCtx = ctx;
    ctx._flCreate.push([this._flType, this])
  };
  p.flSetCursorMode = function(useHandCursor, buttonMode) {
    createjs.Log.log("flSetCursorMode has been deprecated and will be removed in a future version; use EaselJS 'cursor' property instead", null, createjs.Log.WARNING)
  };
  DisplayObject._flTempMtx = new createjs.Matrix2D;
  createjs.DisplayObject = DisplayObject
})();
this.createjs = this.createjs || {};
(function() {
  var Container = function() {
    this.initialize()
  };
  var p = Container.prototype = new createjs.DisplayObject;
  p.children = null;
  p.DisplayObject_initialize = p.initialize;
  p.initialize = function() {
    this.DisplayObject_initialize();
    this.children = []
  };
  p.isVisible = function() {
    return this.visible && this.alpha > 0 && this.children.length && this.scaleX != 0 && this.scaleY != 0
  };
  p.DisplayObject_draw = p.draw;
  p.draw = function(ctx, ignoreCache) {
    this.DisplayObject_draw(ctx, ignoreCache);
    if(this._flCached && !ignoreCache || !this.isVisible()) {
      return true
    }
    this._flCached = this._flCache;
    var l = this.children.length;
    var list = this.children.slice(0);
    for(var i = 0;i < l;i++) {
      var child = list[i];
      child.draw(ctx, false)
    }
    return true
  };
  p.addChild = function(child) {
    if(child == null) {
      return child
    }
    var l = arguments.length;
    if(l > 1) {
      for(var i = 0;i < l;i++) {
        this.addChild(arguments[i])
      }
      return arguments[l - 1]
    }
    if(child.parent) {
      child.parent.removeChild(child)
    }
    child.parent = this;
    this.children.push(child);
    if(this._flCtx) {
      child._flRetain(this._flCtx)
    }
    this._flDisplayListDirty = true;
    return child
  };
  p.addChildAt = function(child, index) {
    var l = arguments.length;
    if(l > 2) {
      index = arguments[i - 1];
      for(var i = 0;i < l - 1;i++) {
        this.addChildAt(arguments[i], index + i)
      }
      return arguments[l - 2]
    }
    if(child.parent) {
      child.parent.removeChild(child)
    }
    child.parent = this;
    this.children.splice(index, 0, child);
    if(this._flCtx) {
      child._flRetain(this._flCtx)
    }
    this._flDisplayListDirty = true;
    return child
  };
  p.removeChild = function(child) {
    var l = arguments.length;
    if(l > 1) {
      var good = true;
      for(var i = 0;i < l;i++) {
        good = good && this.removeChild(arguments[i])
      }
      return good
    }
    return this.removeChildAt(this.children.indexOf(child))
  };
  p.removeChildAt = function(index) {
    var l = arguments.length;
    if(l > 1) {
      var a = [];
      for(var i = 0;i < l;i++) {
        a[i] = arguments[i]
      }
      a.sort(function(a, b) {
        return b - a
      });
      var good = true;
      for(var i = 0;i < l;i++) {
        good = good && this.removeChildAt(a[i])
      }
      return good
    }
    if(index < 0 || index > this.children.length - 1) {
      return false
    }
    var child = this.children[index];
    if(child != null) {
      child.parent = null
    }
    if(child != null) {
      child.parent = null;
      if(this._flCtx) {
        child._flDeretain()
      }
    }
    this.children.splice(index, 1);
    this._flDisplayListDirty = true;
    return true
  };
  p.removeAllChildren = function() {
    var kids, kid;
    kids = this.children;
    while(kids.length) {
      kid = kids.pop();
      if(this._flCtx) {
        kid._flDeretain()
      }
      kid.parent = null
    }
    this._flDisplayListDirty = true
  };
  p.getChildAt = function(index) {
    return this.children[index]
  };
  p.getChildByName = function(name) {
    var kids = this.children;
    for(var i = 0, l = kids.length;i < l;i++) {
      if(kids[i].name == name) {
        return kids[i]
      }
    }
    return null
  };
  p.sortChildren = function(sortFunction) {
    if(createjs.Stage.FL_THROW_UNIMPLEMENTED) {
      throw"EaselFl:Container.sortChildren not yet implemented";
    }
  };
  p.getChildIndex = function(child) {
    return this.children.indexOf(child)
  };
  p.getNumChildren = function() {
    return this.children.length
  };
  p.swapChildrenAt = function(index1, index2) {
    var kids = this.children;
    var o1 = kids[index1];
    var o2 = kids[index2];
    if(!o1 || !o2) {
      return
    }
    kids[index1] = o2;
    kids[index2] = o1
  };
  p.swapChildren = function(child1, child2) {
    var kids = this.children;
    var index1, index2;
    for(var i = 0, l = kids.length;i < l;i++) {
      if(kids[i] == child1) {
        index1 = i
      }
      if(kids[i] == child2) {
        index2 = i
      }
      if(index1 != null && index2 != null) {
        break
      }
    }
    if(i == l) {
      return
    }
    kids[index1] = child2;
    kids[index2] = child1
  };
  p.setChildIndex = function(child, index) {
    if(createjs.Stage.FL_THROW_UNIMPLEMENTED) {
      throw"EaselFl:Container.setChildIndex not yet implemented";
    }
  };
  p.contains = function(child) {
    while(child) {
      if(child == this) {
        return true
      }
      child = child.parent
    }
    return false
  };
  p.getObjectsUnderPoint = function(x, y) {
    var arr = [];
    var pt = this.localToGlobal(x, y);
    this._getObjectsUnderPoint(pt.x, pt.y, arr);
    return arr
  };
  p.getObjectUnderPoint = function(x, y) {
    var pt = this.localToGlobal(x, y);
    return this._getObjectsUnderPoint(pt.x, pt.y)
  };
  p.clone = function(recursive) {
    var o = new Container;
    this.cloneProps(o);
    if(recursive) {
      var arr = o.children = [];
      for(var i = 0, l = this.children.length;i < l;i++) {
        var clone = this.children[i].clone(recursive);
        clone.parent = o;
        arr.push(clone)
      }
    }
    return o
  };
  p.toString = function() {
    return"[Container (name=" + this.name + ")]"
  };
  p.DisplayObject__tick = p._tick;
  p._tick = function(params) {
    for(var i = this.children.length - 1;i >= 0;i--) {
      var child = this.children[i];
      if(child._tick) {
        child._tick(params)
      }
    }
    this.DisplayObject__tick(params)
  };
  p._getObjectsUnderPoint = function(x, y, arr, mouseEvents) {
    if(createjs.Stage.FL_THROW_UNIMPLEMENTED) {
      throw"EaselFl:Container._getObjectsUnderPoint not yet implemented";
    }
  };
  p._flType = "cnt";
  p._flDisplayListDirty = false;
  p._flCtx = null;
  p._flDisplayObjectSyncProps = p._flSyncProps;
  p._flSyncProps = function(ctx) {
    this._flDisplayObjectSyncProps(ctx);
    if(this._flDisplayListDirty) {
      var list, children;
      list = [];
      children = this.children;
      for(var i = 0, l = children.length;i < l;++i) {
        list[i] = children[i]._flId
      }
      this._flChange.push([this._flId, "dl", list]);
      this._flDisplayListDirty = false
    }
  };
  p._flDisplayObjectRetain = p._flRetain;
  p._flRetain = function(ctx) {
    this._flDisplayObjectRetain(ctx);
    if(this.children.length) {
      for(var i = 0, l = this.children.length;i < l;++i) {
        this.children[i]._flRetain(ctx)
      }
      this._flDisplayListDirty = true
    }
  };
  p._flDisplayObjectDeretain = p._flDeretain;
  p._flDeretain = function() {
    this._flDisplayObjectDeretain();
    for(var i = 0, l = this.children.length;i < l;++i) {
      this.children[i]._flDeretain()
    }
  };
  createjs.Container = Container
})();
this.createjs = this.createjs || {};
(function() {
  var Stage = function(canvas) {
    this.initialize(canvas)
  };
  var p = Stage.prototype = new createjs.Container;
  p.autoClear = true;
  p.canvas = null;
  p.mouseX = 0;
  p.mouseY = 0;
  p.onMouseMove = null;
  p.onMouseUp = null;
  p.onMouseDown = null;
  p.snapToPixelEnabled = false;
  p.mouseInBounds = false;
  p.tickOnUpdate = true;
  p.mouseMoveOutside = false;
  p._pointerData = null;
  p._pointerCount = 0;
  p._primaryPointerID = null;
  p._mouseOverIntervalID = null;
  p.Container_initialize = p.initialize;
  p.initialize = function(canvas) {
    if(canvas.isFl === true) {
      this.canvas = canvas
    }else {
      canvas = typeof canvas == "string" ? document.getElementById(canvas) : canvas;
      this.canvas = new createjs.CanvasFl(canvas)
    }
    this.canvas._stage = this;
    this.Container_initialize();
    this._pointerData = {};
    this.enableDOMEvents(true);
    var ctx = this.canvas.getContext("2d");
    this._flCtx = ctx;
    ctx._flCreate.push(["stg", this])
  };
  p.update = function() {
    if(!(this.canvas && this.canvas._ctx)) {
      return
    }
    if(this.autoClear === false) {
      this._flAutoClear = this.autoClear;
      this.canvas._ctx._flChange.push([this.id, "blt"])
    }else {
      if(this._flAutoClear === false) {
        this._flAutoClear = true;
        this.canvas._ctx._flChange.push([this.id, "aclr"])
      }
    }
    Stage._snapToPixelEnabled = this.snapToPixelEnabled;
    if(this.tickOnUpdate) {
      this.dispatchEvent("tickstart");
      this._tick(arguments.length ? arguments : null);
      this.dispatchEvent("tickend")
    }
    this.dispatchEvent("drawstart");
    this.draw(this.canvas._ctx, false, this.getConcatenatedMatrix(this._matrix));
    this.canvas._ctx._flFlush();
    this.dispatchEvent("drawend")
  };
  p.tick = p.update;
  p.handleEvent = function(evt) {
    if(evt.type == "tick") {
      this.update(evt)
    }
  };
  p.clear = function() {
    if(!(this.canvas && this.canvas._ctx && this.canvas._ctx.flReady)) {
      return
    }
    this.canvas._ctx._flChange.push([this.id, "clr"]);
    this.canvas._ctx._flFlush()
  };
  p.toDataURL = function(backgroundColor, mimeType) {
    if(Stage.FL_THROW_UNIMPLEMENTED) {
      throw"Stage.toDataURL not implemented in EaselFl";
    }
    return null
  };
  p.enableMouseOver = function(frequency) {
  };
  p.enableDOMEvents = function(enable) {
    var n, o, ls, t, bind, unbind, ms, _this;
    if(enable == null) {
      enable = true
    }
    ms = Stage.__MS_BINDING;
    if(!enable && ls) {
      unbind = ms ? "detachEvent" : "removeEventListener";
      for(n in ls) {
        o = ls[n];
        o.t[unbind](o.evtString, o.f)
      }
    }else {
      if(enable && !ls) {
        _this = this;
        bind = ms ? "attachEvent" : "addEventListener";
        t = document[bind] ? document : window;
        ls = this._eventListeners = {};
        ls["mousemove"] = {t:t, evtString:ms ? "onmousemove" : "mousemove", f:function(e) {
          _this._handleMouseMove(e)
        }};
        for(n in ls) {
          o = ls[n];
          o.t[bind](o.evtString, o.f)
        }
      }
    }
  };
  p.clone = function() {
    var o = new Stage(null);
    this.cloneProps(o);
    return o
  };
  p.toString = function() {
    return"[Stage (name=" + this.name + ")]"
  };
  p._getPointerData = function(id) {
    var data = this._pointerData[id];
    if(!data) {
      data = this._pointerData[id] = {x:0, y:0};
      if(this._primaryPointerID == null) {
        this._primaryPointerID = id
      }
    }
    return data
  };
  p._handleMouseMove = function(e) {
    e = this._flNormalizeMouseEvent(e);
    this._handlePointerMove(-1, e, e.pageX, e.pageY)
  };
  p._handlePointerMove = function(id, e, pageX, pageY) {
    if(!this.canvas) {
      return
    }
    var evt;
    var o = this._getPointerData(id);
    var inBounds = o.inBounds;
    this._updatePointerPosition(id, pageX, pageY);
    if(!inBounds && !o.inBounds && !this.mouseMoveOutside) {
      return
    }
    if(this.onMouseMove || this.hasEventListener("stagemousemove")) {
      evt = new createjs.MouseEvent("stagemousemove", o.x, o.y, this, e, id, id == this._primaryPointerID, o.rawX, o.rawY);
      this.onMouseMove && this.onMouseMove(evt);
      this.dispatchEvent(evt)
    }
    var oEvt = o.event;
    if(oEvt && (oEvt.onMouseMove || oEvt.hasEventListener("mousemove"))) {
      evt = new createjs.MouseEvent("mousemove", o.x, o.y, oEvt.target, e, id, id == this._primaryPointerID, o.rawX, o.rawY);
      oEvt.onMouseMove && oEvt.onMouseMove(evt);
      oEvt.dispatchEvent(evt, oEvt.target)
    }
  };
  p._updatePointerPosition = function(id, pageX, pageY) {
    if(!this.canvas._ctx._flInstance) {
      return
    }
    var rect = this._getElementRect(this.canvas._ctx._flInstance);
    pageX -= rect.left;
    pageY -= rect.top;
    var w = this.canvas.width;
    var h = this.canvas.height;
    pageX /= (rect.right - rect.left) / w;
    pageY /= (rect.bottom - rect.top) / h;
    var o = this._getPointerData(id);
    if(o.inBounds = pageX >= 0 && pageY >= 0 && pageX <= w - 1 && pageY <= h - 1) {
      o.x = pageX;
      o.y = pageY
    }else {
      if(this.mouseMoveOutside) {
        o.x = pageX < 0 ? 0 : pageX > w - 1 ? w - 1 : pageX;
        o.y = pageY < 0 ? 0 : pageY > h - 1 ? h - 1 : pageY
      }
    }
    o.rawX = pageX;
    o.rawY = pageY;
    if(id == this._primaryPointerID) {
      this.mouseX = o.x;
      this.mouseY = o.y;
      this.mouseInBounds = o.inBounds
    }
  };
  p._getElementRect = function(e) {
    function parse(s) {
      return parseInt(s.replace("px", ""), 10) || 0
    }
    var bounds;
    try {
      bounds = e.getBoundingClientRect()
    }catch(err) {
      bounds = {top:e.offsetTop, left:e.offsetLeft, width:e.offsetWidth, height:e.offsetHeight}
    }
    var offX = (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || document.body.clientLeft || 0);
    var offY = (window.pageYOffset || document.scrollTop || 0) - (document.clientTop || document.body.clientTop || 0);
    var styles = window.getComputedStyle ? getComputedStyle(e) : e.currentStyle;
    var padL = parse(styles.paddingLeft) + parse(styles.borderLeftWidth);
    var padT = parse(styles.paddingTop) + parse(styles.borderTopWidth);
    var padR = parse(styles.paddingRight) + parse(styles.borderRightWidth);
    var padB = parse(styles.paddingBottom) + parse(styles.borderBottomWidth);
    return{left:bounds.left + offX + padL, right:bounds.right + offX - padR, top:bounds.top + offY + padT, bottom:bounds.bottom + offY - padB}
  };
  p._handleDoubleClick = function(e) {
  };
  p._flRefs = 1;
  p._flCtx = null;
  p._flAutoClear = true;
  p.flOnReady = null;
  p.flReady = false;
  p.flEmbedFonts = function(fontList, fontFileURL) {
    this.canvas._ctx._flCommands.push(["fnts", [fontList, fontFileURL]])
  };
  p._flNormalizeMouseEvent = function(e) {
    if(!e) {
      e = window.event
    }
    if(e.pageX === void 0) {
      e.pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      e.pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
    }
    return e
  };
  Stage.isEaselFl = Stage.isEaselFL = true;
  Stage.__MS_BINDING = window.addEventListener || document.addEventListener ? false : true;
  Stage.FL_THROW_UNIMPLEMENTED = true;
  Stage.FL_LOG_PART_IMPLEMENTED = true;
  createjs.Stage = Stage
})();
this.createjs = this.createjs || {};
(function() {
  var Bitmap = function(imageOrUri) {
    this.initialize(imageOrUri)
  };
  var p = Bitmap.prototype = new createjs.DisplayObject;
  p.image = null;
  p.snapToPixel = true;
  p.sourceRect = null;
  p.DisplayObject_initialize = p.initialize;
  p.initialize = function(imageOrUri) {
    this.DisplayObject_initialize();
    if(typeof imageOrUri == "string") {
      this.image = new Image;
      this.image.src = imageOrUri
    }else {
      this.image = imageOrUri
    }
  };
  p.isVisible = function() {
    var hasContent = this.image && (this.image.complete || this.image.readyState >= 2);
    return!!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent)
  };
  p.DisplayObject_draw = p.draw;
  p.draw = function(ctx, ignoreCache) {
    if(this.DisplayObject_draw(ctx, ignoreCache)) {
      return true
    }
    if(this.image !== this._flImg) {
      if(this._flImg) {
        this._flImg.__fl.deretain()
      }
      this._flImg = this.image;
      if(this.image) {
        createjs.ImageFl.watch(this.image);
        this._flImg.__fl.retain(ctx);
        ctx._flChange.push([this._flId, "img", this.image.__fl._flId])
      }else {
        ctx._flChange.push([this._flId, "img", null])
      }
    }
    if(this.image) {
      this.image.__fl.sync()
    }
    if(this.sourceRect !== this._flSourceRect) {
      if(this._flSourceRect) {
        this._flSourceRect._flDeretain()
      }
      this._flSourceRect = this.sourceRect;
      if(this._flSourceRect) {
        this._flSourceRect._flRetain(ctx)
      }
      ctx._flChange.push([this._flId, "rct", this.sourceRect ? this.sourceRect._flId : null])
    }
    if(this.sourceRect) {
      this.sourceRect._flSync()
    }
    return true
  };
  p.clone = function() {
    var o = new Bitmap(this.image);
    if(this.sourceRect) {
      o.sourceRect = this.sourceRect.clone()
    }
    this.cloneProps(o);
    return o
  };
  p.toString = function() {
    return"[Bitmap (name=" + this.name + ")]"
  };
  p._flType = "bmp";
  p._flCtx = null;
  p._flImg = null;
  p._flSourceRect = null;
  p._flSmoothing = false;
  p.flSmoothing = false;
  p.flSetSmoothing = function(smooth) {
    if(this._flCtx && smooth !== this._flSmoothing) {
      this.flSmoothing = this._flSmoothing = smooth;
      this._flCtx._flChange.push([this._flId, "smth", smooth])
    }else {
      this.flSmoothing = smooth
    }
  };
  p._flDisplayObjectRunCreate = p._flRunCreate;
  p._flRunCreate = function(ctx) {
    this._flDisplayObjectRunCreate(ctx);
    this.flSetSmoothing(this.flSmoothing)
  };
  p._flDisplayObjectResetProps = p._flResetProps;
  p._flResetProps = function() {
    this._flDisplayObjectResetProps();
    this._flSourceRect = this._flImg = null
  };
  p._flDisplayObjectRetain = p._flRetain;
  p._flRetain = function(ctx) {
    this._flDisplayObjectRetain(ctx);
    if(this._flSourceRect) {
      this._flSourceRect._flRetain()
    }
    if(this._flImg) {
      this._flImg.__fl.retain()
    }
  };
  p._flDisplayObjectDeretain = p._flDeretain;
  p._flDeretain = function() {
    this._flDisplayObjectDeretain();
    if(this._flSourceRect) {
      this._flSourceRect._flDeretain()
    }
    if(this._flImg) {
      this._flImg.__fl.deretain()
    }
  };
  createjs.Bitmap = Bitmap
})();
this.createjs = this.createjs || {};
(function() {
  var BitmapAnimation = function(spriteSheet) {
    this.initialize(spriteSheet)
  };
  var p = BitmapAnimation.prototype = new createjs.DisplayObject;
  p.onAnimationEnd = null;
  p.currentFrame = -1;
  p.currentAnimation = null;
  p.paused = true;
  p.spriteSheet = null;
  p.snapToPixel = true;
  p.offset = 0;
  p.currentAnimationFrame = 0;
  p.addEventListener = null;
  p.removeEventListener = null;
  p.removeAllEventListeners = null;
  p.dispatchEvent = null;
  p.hasEventListener = null;
  p._listeners = null;
  createjs.EventDispatcher.initialize(p);
  p._advanceCount = 0;
  p._animation = null;
  p.DisplayObject_initialize = p.initialize;
  p.initialize = function(spriteSheet) {
    this.DisplayObject_initialize();
    this.spriteSheet = spriteSheet
  };
  p.isVisible = function() {
    return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.spriteSheet.complete && this.currentFrame >= 0
  };
  p.DisplayObject_draw = p.draw;
  p.draw = function(ctx, ignoreCache) {
    if(this.DisplayObject_draw(ctx, ignoreCache)) {
      return true
    }
    this._normalizeFrame();
    var o = this.spriteSheet.getFrame(this.currentFrame);
    if(!o) {
      return false
    }
    if(o !== this._flFrame) {
      if(this._flFrame) {
        this._flFrame.__fl.deretain()
      }
      if(o) {
        createjs.FrameFl.watch(o);
        o.__fl.retain(ctx)
      }
      this._flFrame = o;
      ctx._flChange.push([this._flId, "frm", o ? o.__fl._flId : null])
    }
    return true
  };
  p.play = function() {
    this.paused = false
  };
  p.stop = function() {
    this.paused = true
  };
  p.gotoAndPlay = function(frameOrAnimation) {
    this.paused = false;
    this._goto(frameOrAnimation)
  };
  p.gotoAndStop = function(frameOrAnimation) {
    this.paused = true;
    this._goto(frameOrAnimation)
  };
  p.advance = function() {
    if(this._animation) {
      this.currentAnimationFrame++
    }else {
      this.currentFrame++
    }
    this._normalizeFrame()
  };
  p.getBounds = function() {
    return this.spriteSheet.getFrameBounds(this.currentFrame)
  };
  p.clone = function() {
    var o = new BitmapAnimation(this.spriteSheet);
    this.cloneProps(o);
    return o
  };
  p.toString = function() {
    return"[BitmapAnimation (name=" + this.name + ")]"
  };
  p.DisplayObject__tick = p._tick;
  p._tick = function(params) {
    var f = this._animation ? this._animation.frequency : 1;
    if(!this.paused && (++this._advanceCount + this.offset) % f == 0) {
      this.advance()
    }
    this.DisplayObject__tick(params)
  };
  p._normalizeFrame = function() {
    var animation = this._animation;
    var frame = this.currentFrame;
    var paused = this.paused;
    var l;
    if(animation) {
      l = animation.frames.length;
      if(this.currentAnimationFrame >= l) {
        var next = animation.next;
        if(this._dispatchAnimationEnd(animation, frame, paused, next, l - 1)) {
        }else {
          if(next) {
            this._goto(next)
          }else {
            this.paused = true;
            this.currentAnimationFrame = animation.frames.length - 1;
            this.currentFrame = animation.frames[this.currentAnimationFrame]
          }
        }
      }else {
        this.currentFrame = animation.frames[this.currentAnimationFrame]
      }
    }else {
      l = this.spriteSheet.getNumFrames();
      if(frame >= l) {
        if(!this._dispatchAnimationEnd(animation, frame, paused, l - 1)) {
          this.currentFrame = 0
        }
      }
    }
  };
  p._dispatchAnimationEnd = function(animation, frame, paused, next, end) {
    var name = animation ? animation.name : null;
    this.onAnimationEnd && this.onAnimationEnd(this, name, next);
    this.dispatchEvent({type:"animationend", name:name, next:next});
    if(!paused && this.paused) {
      this.currentAnimationFrame = end
    }
    return this.paused != paused || this._animation != animation || this.currentFrame != frame
  };
  p.DisplayObject_cloneProps = p.cloneProps;
  p.cloneProps = function(o) {
    this.DisplayObject_cloneProps(o);
    o.onAnimationEnd = this.onAnimationEnd;
    o.currentFrame = this.currentFrame;
    o.currentAnimation = this.currentAnimation;
    o.paused = this.paused;
    o.offset = this.offset;
    o._animation = this._animation;
    o.currentAnimationFrame = this.currentAnimationFrame
  };
  p._goto = function(frameOrAnimation) {
    if(isNaN(frameOrAnimation)) {
      var data = this.spriteSheet.getAnimation(frameOrAnimation);
      if(data) {
        this.currentAnimationFrame = 0;
        this._animation = data;
        this.currentAnimation = frameOrAnimation;
        this._normalizeFrame()
      }
    }else {
      this.currentAnimation = this._animation = null;
      this.currentFrame = frameOrAnimation
    }
  };
  p._flType = "ban";
  p._flFrame = null;
  p._flSmoothing = false;
  p.flSmoothing = false;
  p.flSetSmoothing = function(smooth) {
    if(this._flCtx && smooth !== this._flSmoothing) {
      this.flSmoothing = this._flSmoothing = smooth;
      this._flCtx._flChange.push([this._flId, "smth", smooth])
    }else {
      this.flSmoothing = smooth
    }
  };
  p._flRunCreate = function(ctx) {
    if(this._flCtx !== ctx) {
      this._flCtx = ctx;
      ctx._flCreate.push([this._flType, this]);
      this.flSetSmoothing(this.flSmoothing)
    }
  };
  p._flDisplayObjectRetain = p._flRetain;
  p._flRetain = function(ctx) {
    this._flDisplayObjectRetain(ctx);
    if(this._flFrame) {
      this._flFrame.__fl.retain(ctx)
    }
  };
  p._flDisplayObjectDeretain = p._flDeretain;
  p._flDeretain = function() {
    this._flDisplayObjectDeretain();
    if(this._flFrame) {
      this._flFrame.__fl.deretain();
      this._flFrame = null
    }
  };
  p._flDisplayObjectResetProps = p._flResetProps;
  p._flResetProps = function() {
    this._flDisplayObjectResetProps();
    this._flFrame = null
  };
  createjs.BitmapAnimation = BitmapAnimation
})();
this.createjs = this.createjs || {};
(function() {
  var Shape = function(graphics) {
    this.initialize(graphics)
  };
  var p = Shape.prototype = new createjs.DisplayObject;
  p.graphics = null;
  p.DisplayObject_initialize = p.initialize;
  p.initialize = function(graphics) {
    this.DisplayObject_initialize();
    this.graphics = graphics ? graphics : new createjs.Graphics
  };
  p.isVisible = function() {
    var hasContent = this.cacheCanvas || this.graphics && !this.graphics.isEmpty();
    return!!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent)
  };
  p.DisplayObject_draw = p.draw;
  p.draw = function(ctx, ignoreCache) {
    if(this.DisplayObject_draw(ctx, ignoreCache)) {
      return true
    }
    if(!this._flCached) {
      this._flCached = this._flCache;
      this.graphics.draw(ctx)
    }
    return true
  };
  p.clone = function(recursive) {
    if(createjs.Stage.FL_LOG_PART_IMPLEMENTED && !recursive) {
      createjs.Log.log("EaselFL:Shape.clone is currently always recursive", null, createjs.Log.WARNING)
    }
    var o = new Shape(this.graphics ? this.graphics.clone() : null);
    this.cloneProps(o);
    return o
  };
  p.toString = function() {
    return"[Shape (name=" + this.name + ")]"
  };
  p._flType = "shp";
  p._flCtx = null;
  p._flDisplayObjectRetain = p._flRetain;
  p._flRetain = function(ctx) {
    this._flDisplayObjectRetain(ctx);
    this.graphics._flRetain(ctx)
  };
  p._flDisplayObjectDeretain = p._flDeretain;
  p._flDeretain = function() {
    this._flDisplayObjectDeretain();
    this.graphics._flDeretain()
  };
  p._flDisplayObjectRunCreate = p._flRunCreate;
  p._flRunCreate = function(ctx) {
    this._flDisplayObjectRunCreate(ctx);
    ctx._flChange.push([this._flId, "gfx", [this.graphics._flId]])
  };
  createjs.Shape = Shape
})();
this.createjs = this.createjs || {};
(function() {
  var Text = function(text, font, color) {
    this.initialize(text, font, color)
  };
  var p = Text.prototype = new createjs.DisplayObject;
  p.text = "";
  p.font = null;
  p.color = "#000";
  p.textAlign = "left";
  p.textBaseline = "top";
  p.maxWidth = null;
  p.outline = false;
  p.lineHeight = 0;
  p.lineWidth = null;
  p.DisplayObject_initialize = p.initialize;
  p.initialize = function(text, font, color) {
    this.DisplayObject_initialize();
    this.text = text;
    this.font = font;
    this.color = color ? color : "#000"
  };
  p.isVisible = function() {
    var hasContent = this.text != null && this.text !== "";
    return Boolean(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent)
  };
  p.DisplayObject_draw = p.draw;
  p.draw = function(ctx, ignoreCache) {
    if(this.DisplayObject_draw(ctx, ignoreCache)) {
      return true
    }
    if(this.text !== this._flText) {
      ctx._flChange.push([this.id, "txt", this.text]);
      this._flText = this.text
    }
    if(this.color !== this._flColor) {
      ctx._flChange.push([this.id, "clr", this.color]);
      this._flColor = this.color
    }
    if(this.font !== this._flFont) {
      ctx._flChange.push([this.id, "fnt", this.font]);
      this._flFont = this.font
    }
    if(this.textBaseline !== this._flTextBaseline) {
      ctx._flChange.push([this.id, "bsl", this.textBaseline]);
      this._flTextBaseline = this.textBaseline
    }
    if(this.textAlign !== this._flTextAlign) {
      ctx._flChange.push([this.id, "aln", this.textAlign]);
      this._flTextAlign = this.textAlign
    }
    if(this.lineWidth !== this._flLineWidth) {
      ctx._flChange.push([this.id, "lwd", this.lineWidth]);
      this._flLineWidth = this.lineWidth
    }
    if(this.lineHeight !== this._flLineHeight) {
      ctx._flChange.push([this.id, "lht", !this.lineHeight === 0 ? null : this.lineHeight]);
      this._flLineHeight = this.lineHeight
    }
    if(this.outline !== this._flOutline) {
      ctx._flChange.push([this.id, "otl", this.outline]);
      this._flOutline = this.outline
    }
    return true
  };
  p.getMeasuredWidth = function() {
    if(createjs.Stage.FL_THROW_UNIMPLEMENTED) {
      throw"EaseFl:Text.getMeasuredWidth not yet implemented";
    }
    return null
  };
  p.getMeasuredLineHeight = function() {
    if(createjs.Stage.FL_THROW_UNIMPLEMENTED) {
      throw"EaseFl:Text.getMeasuredLineHeight not yet implemented";
    }
    return null
  };
  p.getMeasuredHeight = function() {
    if(createjs.Stage.FL_THROW_UNIMPLEMENTED) {
      throw"EaseFl:Text.getMeasuredHeight not yet implemented";
    }
    return null
  };
  p.clone = function() {
    var o = new Text(this.text, this.font, this.color);
    this.cloneProps(o);
    return o
  };
  p.toString = function() {
    return"[Text (text=" + (this.text.length > 20 ? this.text.substr(0, 17) + "..." : this.text) + ")]"
  };
  p.DisplayObject_cloneProps = p.cloneProps;
  p.cloneProps = function(o) {
    this.DisplayObject_cloneProps(o);
    o.textAlign = this.textAlign;
    o.textBaseline = this.textBaseline;
    o.maxWidth = this.maxWidth;
    o.outline = this.outline;
    o.lineHeight = this.lineHeight;
    o.lineWidth = this.lineWidth
  };
  p._flFont = null;
  p._flText = "";
  p._flColor = "#000";
  p._flTextAlign = "left";
  p._flTextBaseline = "top";
  p._flOutline = false;
  p._flLineHeight = 0;
  p._flLineWidth = null;
  p._flType = "txt";
  p._flDisplayObjectResetProps = p._flResetProps;
  p._flResetProps = function() {
    this._flDisplayObjectResetProps();
    this._flFont = this._flColor = this._flTextAlign = this._flTextBaseline = this._flLineWidth = null;
    this._flText = "";
    this._flOutline = false;
    this._flLineHiehgt = 0
  };
  createjs.Text = Text
})();
this.createjs = this.createjs || {};
(function() {
  var SpriteSheetUtils = function() {
    throw"SpriteSheetUtils cannot be instantiated";
  };
  SpriteSheetUtils.addFlippedFrames = function(spriteSheet, horizontal, vertical, both) {
    if(!horizontal && !vertical && !both) {
      return
    }
    var count = 0;
    if(horizontal) {
      SpriteSheetUtils._flip(spriteSheet, ++count, true, false)
    }
    if(vertical) {
      SpriteSheetUtils._flip(spriteSheet, ++count, false, true)
    }
    if(both) {
      SpriteSheetUtils._flip(spriteSheet, ++count, true, true)
    }
  };
  SpriteSheetUtils.extractFrame = function(spriteSheet, frame) {
    if(createjs.Stage.FL_THROW_UNIMPLEMENTED) {
      throw"EaselFl::SpriteSheetUtils.extractFrame not yet implemented";
    }
  };
  SpriteSheetUtils.mergeAlpha = function(rgbImage, alphaImage, canvas) {
    if(createjs.Stage.FL_THROW_UNIMPLEMENTED) {
      throw"EaselFl::SpriteSheetUtils.mergeAlpha not yet implemented";
    }
  };
  SpriteSheetUtils._flip = function(spriteSheet, count, h, v) {
    var frame;
    var frames = spriteSheet._frames;
    var fl = frames.length / count;
    for(i = 0;i < fl;i++) {
      src = frames[i];
      frame = {flip:true, src:src, h:h, v:v};
      frames.push(frame)
    }
    var sfx = "_" + (h ? "h" : "") + (v ? "v" : "");
    var names = spriteSheet._animations;
    var data = spriteSheet._data;
    var al = names.length / count;
    for(i = 0;i < al;i++) {
      var name = names[i];
      src = data[name];
      var anim = {name:name + sfx, frequency:src.frequency, next:src.next, frames:[]};
      if(src.next) {
        anim.next += sfx
      }
      frames = src.frames;
      for(var j = 0, l = frames.length;j < l;j++) {
        anim.frames.push(frames[j] + fl * count)
      }
      data[anim.name] = anim;
      names.push(anim.name)
    }
  };
  createjs.SpriteSheetUtils = SpriteSheetUtils
})();
this.createjs = this.createjs || {};
(function() {
  var transformProp, transformPropOrigin, transformUnit, isModern;
  transformProp = function(element) {
    var properties = ["transform", "WebkitTransform", "msTransform", "MozTransform", "OTransform", "filter"];
    var p;
    do {
      p = properties.shift();
      if(typeof element.style[p] != "undefined") {
        return p
      }
    }while(properties.length);
    return false
  }(document.createElement("div"));
  isModern = transformProp !== "filter" && transformProp;
  transformPropOrigin = transformProp + "Origin";
  transformUnit = transformProp === "MozTransform" ? "px" : "";
  var DOMElement = function(htmlElement) {
    this.initialize(htmlElement)
  };
  var p = DOMElement.prototype = new createjs.DisplayObject;
  p.htmlElement = null;
  p._oldMtx = null;
  p._visible = false;
  p.DisplayObject_initialize = p.initialize;
  p.initialize = function(htmlElement) {
    if(typeof htmlElement == "string") {
      htmlElement = document.getElementById(htmlElement)
    }
    this.DisplayObject_initialize();
    this.mouseEnabled = false;
    this.htmlElement = htmlElement;
    if(htmlElement) {
      var style = htmlElement.style;
      style.position = "absolute";
      style.visibility = "hidden";
      style.top = style.left = 0;
      if(isModern) {
        style[transformPropOrigin] = "0% 0%"
      }
    }
  };
  p.isVisible = function() {
    return this.htmlElement != null
  };
  p.draw = function(ctx, ignoreCache) {
    if(this.visible) {
      this._visible = true
    }
    return true
  };
  p.cache = function() {
  };
  p.uncache = function() {
  };
  p.updateCache = function() {
  };
  p.hitTest = function() {
  };
  p.localToGlobal = function() {
  };
  p.globalToLocal = function() {
  };
  p.localToLocal = function() {
  };
  p.clone = function() {
    throw"DOMElement cannot be cloned.";
  };
  p.toString = function() {
    return"[DOMElement (name=" + this.name + ")]"
  };
  p.DisplayObject__tick = p._tick;
  p._tick = function(params) {
    var stage = this.getStage();
    this._visible = false;
    stage && stage.on("drawend", isModern ? this._handleDrawEnd : this._handleDrawEndOld, this, true);
    this.DisplayObject__tick(params)
  };
  p._handleDrawEnd = function(evt) {
    var o = this.htmlElement;
    if(!o) {
      return
    }
    var style = o.style;
    var visibility = this._visible ? "visible" : "hidden";
    if(visibility != style.visibility) {
      style.visibility = visibility
    }
    if(!this._visible) {
      return
    }
    var mtx = this.getConcatenatedMatrix(this._matrix);
    var oMtx = this._oldMtx;
    if(!oMtx || oMtx.alpha != mtx.alpha) {
      style.opacity = "" + mtx.alpha;
      if(oMtx) {
        oMtx.alpha = mtx.alpha
      }
    }
    if(!oMtx || oMtx.tx != mtx.tx || oMtx.ty != mtx.ty || oMtx.a != mtx.a || oMtx.b != mtx.b || oMtx.c != mtx.c || oMtx.d != mtx.d) {
      style.transform = style.WebkitTransform = style.OTransform = style.msTransform = ["matrix(" + mtx.a.toFixed(3), mtx.b.toFixed(3), mtx.c.toFixed(3), mtx.d.toFixed(3), mtx.tx + 0.5 | 0, (mtx.ty + 0.5 | 0) + ")"].join(",");
      style.MozTransform = ["matrix(" + mtx.a.toFixed(3), mtx.b.toFixed(3), mtx.c.toFixed(3), mtx.d.toFixed(3), (mtx.tx + 0.5 | 0) + "px", (mtx.ty + 0.5 | 0) + "px)"].join(",");
      this._oldMtx = oMtx ? oMtx.copy(mtx) : mtx.clone()
    }
  };
  p._flWidth = 0;
  p._flHeight = 0;
  p._flBx = 0;
  p._flBy = 0;
  p._flMsMtx = "";
  p._flMsAlpha = "";
  p._flMsCum = " ";
  p._flParentNode = null;
  p._flType = "dom";
  p._handleDrawEndOld = function(evt) {
    var o = this.htmlElement;
    if(!o) {
      return
    }
    var style = o.style;
    var visibility = this._visible ? "visible" : "hidden";
    if(visibility != style.visibility) {
      style.visibility = visibility
    }
    if(!this._visible) {
      return
    }
    var mtx = this.getConcatenatedMatrix(this._matrix);
    var oMtx = this._oldMtx;
    if(o.parentNode !== this._flParentNode && o.parentNode) {
      this._flParentNode = this.htmlElement.parentNode;
      this.flUpdateBounds()
    }
    if(mtx.alpha < 1) {
      this._flMsAlpha = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + Math.round(100 * mtx.alpha) + ")"
    }else {
      this._flMsAlpha = ""
    }
    if(!(oMtx && mtx.a === oMtx.a && mtx.b === oMtx.b && mtx.c === oMtx.c && mtx.d === oMtx.d && mtx.e === oMtx.e && mtx.f === oMtx.f)) {
      if(mtx.a === 1 && mtx.b === 0 && mtx.a === mtx.d && mtx.b === mtx.c) {
        this._flMsMtx = "";
        style.left = mtx.tx + "px";
        style.top = mtx.ty + "px"
      }else {
        if(!(oMtx && oMtx.a === mtx.a && oMtx.b === mtx.b && oMtx.c === mtx.c && oMtx.d === mtx.d)) {
          this._flMsMtx = "progid:DXImageTransform.Microsoft.Matrix(" + "M11=" + mtx.a.toFixed(4) + ", M12=" + mtx.c.toFixed(4) + ", M21=" + mtx.b.toFixed(4) + ", M22=" + mtx.d.toFixed(4) + ', sizingMethod="auto expand")';
          var wd = this._flWidth;
          var ht = this._flHeight;
          var hfwd = wd * 0.5;
          var hfht = ht * 0.5;
          var ltx = hfwd * mtx.a + hfht * mtx.c;
          var lty = hfwd * mtx.b + hfht * mtx.d;
          var rtx = -hfwd * mtx.a + hfht * mtx.c;
          var rty = -hfwd * mtx.b + hfht * mtx.d;
          wd = Math.max(Math.abs(ltx), Math.abs(rtx));
          ht = Math.max(Math.abs(lty), Math.abs(rty));
          this._flBx = -(wd - ltx);
          this._flBy = -(ht - lty);
          style.zIndex = 0
        }
        style.left = mtx.tx + this._flBx + "px";
        style.top = mtx.ty + this._flBy + "px"
      }
    }
    var msCum = this._flMsMtx + " " + this._flMsAlpha;
    if(msCum !== this._flMsCum) {
      this._flMsCum = msCum;
      style[transformProp] = msCum
    }
  };
  p.flUpdateBounds = function() {
    var el, style, trans;
    el = this.htmlElement;
    style = el.style;
    trans = style[transformProp];
    style[transformProp] = "";
    this._flWidth = el.offsetWidth;
    this._flHeight = el.offsetHeight;
    style[transformProp] = trans
  };
  createjs.DOMElement = DOMElement
})();
this.createjs = this.createjs || {};
(function() {
  var Filter = function() {
    this.initialize()
  };
  var p = Filter.prototype;
  p.initialize = function() {
  };
  p.getBounds = function() {
    return new createjs.Rectangle(0, 0, 0, 0)
  };
  p.applyFilter = function(ctx, x, y, width, height, targetCtx, targetX, targetY) {
  };
  p.toString = function() {
    return"[Filter]"
  };
  p.clone = function() {
    return new Filter
  };
  p._flRefs = 0;
  p._flCtx = null;
  p._flId = null;
  p._flRetain = function(ctx) {
    if(!this._flCtx) {
      this._flCtx = ctx;
      ctx._flCreate.push([this._flType, this])
    }
    this._flRefs++
  };
  p._flDeretain = function() {
    this._flRefs--
  };
  createjs.Filter = Filter
})();
(function() {
  var o = this.createjs = this.createjs || {};
  o = o.EaselJS = o.EaselJS || {};
  o.version = "NEXT";
  o.buildDate = "Fri, 21 Feb 2014 22:11:25 GMT"
})();

