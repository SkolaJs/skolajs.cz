'use strict';

(function(root) {
  'use strict';

  JsReference.identifiers = [];
  JsReference.instances = [];

  JsReference.valuesByType = {
    'object': [],
    'function': []
  };
  JsReference.descByType = {
    'object': [],
    'function': []
  };

  JsReference.needDiscovery = [];

  JsReference.luid = 0;


  function JsReference(value) {
    this.luid = ++ JsReference.luid;
    this.value = value;
    this.className = JsReference.className(value);
    this.members = {};
    this.parent = null;
    this.proto = null;
    this.prototyp = null;
    this.identifiers = [];
    JsReference.needDiscovery.push(this);
  };


  JsReference.className = function(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  };


  JsReference.get = function(value) {
    if (value === null)
      return null;

    if (value instanceof window.Node)
      return null;

    var type = typeof value;
    var lookupTable = JsReference.valuesByType[type];

    if (!lookupTable)
      return null;

    var index = lookupTable.indexOf(value);
    if (index !== -1) {
      return JsReference.descByType[type][index];
    } else {
      var result = new JsReference(value);
      lookupTable.push(value);
      JsReference.descByType[type].push(result);
      return result;
    }
  };


  JsReference.findByIdentifier = function(id) {
    var index = JsReference.identifiers.indexOf(id);
    if (index === -1)
      return null;
    return JsReference.instances[index];
  };


  JsReference.deepDiscovery = function() {
    var list = JsReference.needDiscovery.slice();
    JsReference.needDiscovery = [];
    list.forEach(function(ref) {
      ref.discovery();
    });
    return JsReference.needDiscovery.length > 0;
  };


  JsReference.prototype.addIdentifier = function(name) {
    if (name[0] === '.')
      throw new Error('Invalid name');

    if (this.identifiers.indexOf(name) === -1) {

      if (JsReference.identifiers.indexOf(name) !== -1)
        throw new Error('Duplicate identifier on global space');

      JsReference.identifiers.push(name);
      JsReference.instances.push(this);

      this.identifiers.push(name);
      return true;
    }
    return false;
  };


  JsReference.prototype.discovery = function() {
    var type = typeof this.value;
    if (this[type + 'Discovery'])
      return this[type + 'Discovery']();
    return false;
  };


  JsReference.prototype.objectDiscovery = function() {
    if (this.identifiers.length === 0)
      return false;

    this.proto = this.getMember('__proto__', true);

    var prefix = (this.identifiers[0] === '') ? '' : this.identifiers[0] + '.';

    try {
      var properties = Object.getOwnPropertyNames(this.value);
    } catch (err) {
      console.error(this, err);
      return false;
    }

    var i, l = properties.length;
    for (i = 0; i < l; i++) {
      var property = properties[i];
      if (/^\d+$/.test(property))
        continue;

      var info = this.getMember(property);

      if (info) {
        info.addIdentifier(prefix + property);
      }
    }
    return true;
  };


  JsReference.prototype.functionDiscovery = function() {
    this.objectDiscovery();
    if (!this.value.prototype)
      return;

    this.prototyp = JsReference.get(this.value.prototype);

    if (this.prototyp)
      this.parent = JsReference.get(this.value.prototype.__proto__);
  };


  JsReference.prototype.getMember = function(name, force) {
    var d = Object.getOwnPropertyDescriptor(this.value, name);
    if (force && !d) {
      d = { value: this.value[name] };
    }

    if (!d)
      return null;
    if (d.get || d.set) {
      return null; // TODO
    }
    if (d.hasOwnProperty('value')) {
      var result = JsReference.get(d.value);
      if (result && this.identifiers.length > 0) {
        var prefix = (this.identifiers[0]) ? this.identifiers[0] + '.' : '';
        result.addIdentifier(prefix + name);
      }

      if (result) {
        this.members['.' + name] = result;
      } else {
        this.members['.' + name] = {name: name, value: d.value};
      }

      return result;
    }
  };


  JsReference.prototype.toString = function() {
    return (this.identifiers.length > 0) ?
        this.identifiers[0] :
        'luid:' + this.luid;
  };


  JsReference.prototype.toJSON = function() {
    var result = {
      id: this.luid,
      ids: this.identifiers,
      members: {},
      className: this.className
    };
    for (var name in this.members) {
      if (name[0] !== '.')
        continue;

      var member = this.members[name];

      if (member.luid)
        result.members[name] = (member.luid);
      else {
        var target = result.members[name] = {
          t: typeof member.value,
          c: JsReference.className(member.value)
        };
        if (target.t === 'number' || target.t === 'string')
          target.v = member.value;
      }
    }
    return result;
  };


  JsReference.get(Object).addIdentifier('Object');
  JsReference.get(Function).addIdentifier('Function');
  JsReference.get(Array).addIdentifier('Array');

  JsReference.get(window).addIdentifier('');
  //JsReference.get(Object.__proto__).addIdentifier('Object.__proto__');

  while (JsReference.deepDiscovery()) {
    console.log('iteration');
  }

  window.JsReference = JsReference;

})(window);
