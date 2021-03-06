class Mozart {
    constructor(name) {
      this.name               = name;
      Mozart.index[this.name] = this;
      this.function_methods   = [];
      this.object_methods     = { priv: [], pub: [] };
      return this;
    }
  
    jquery_exists() { typeof(jQuery) == "object" }
  
    add_function_method(name, fn) {
      if (this.function_methods.includes(fn)) return;
      this.function_methods.push(fn);
      this[name] = fn;
    }
  
    add_object_method(name, obj, priv)  {
      if (priv) {
  
        if (this.object_methods.priv.includes([name, obj])) return;
        this.object_methods.priv.push([name, obj]);
      }
      else {
        if (this.object_methods.pub.includes([name, obj])) return;
        this.object_methods.pub.push([name, obj]);
        this[name] = obj;
      }
    }
  
    parse_object(obj, fn) {
      var _obj = {};
  
      for (var key in obj) {
        ((obj, _obj, key, fn) => {
          var _fn = args => { return fn.call(this, obj, args, key); }
          if (key != "priv") _obj[key] = _fn;
        })(obj, _obj, key, fn);
      }
  
      return _obj;
    }
  
    acts(obj) {
      var public_obj = this.parse_object(obj.priv, (obj, args, key) => {
        var _$ = this.scoped_selector();
        return obj[key](_$, args);
      });
  
      this.add_object_method("act", public_obj, true);
      this.add_object_method("acts", public_obj, true);
  
      var private_obj = this.parse_object(obj, (obj, args, key) => {
        var _$ = this.scoped_selector();
        return obj[key](_$, args);
      });
  
      this.add_object_method("act", private_obj);
      this.add_object_method("acts", private_obj);
    }
  
    act(obj) { return this.acts(obj); }
  
    routes(obj) {
      var _obj = this.parse_object(obj, (obj, args, key) => {
        var __obj = JSON.parse(JSON.stringify(obj[key]));
        __obj.url = obj[key].url.interpolate(args);
        __obj.data = args;
  
        Object.keys(args).forEach(_key => {
          if (!!obj[key].url.match(_key)) {
            delete __obj.data[_key];
          }
        });
  
        return __obj;
      });
  
      this.add_object_method("route", _obj);
      this.add_object_method("routes", _obj);
    }
  
    route(obj) { return this.routes(obj); }
  
    events(fn)  {
      this.add_function_method("events", fn);
      this.add_function_method("event", fn);
    }
  
    event(fn) { return this.events(fn); }
  
    scoped_selector() {
      var _scoped_selector = (selector) => {
        var selector_string = `[data-component~='${this.name}'] ${selector}`;
        if (this.jquery_exists()) return $(selector_string);
        var selector_array = document.querySelectorAll(selector_string);
        return (selector_array.length == 1 ? selector_array[0] : selector_array);
      }
  
      var all_obj_methods_pub_and_priv = this.object_methods.pub.concat(
        this.object_methods.priv
      );
  
      all_obj_methods_pub_and_priv.forEach(object_method => {
        var name, object;
        [name, object] = object_method; 
        _scoped_selector[name] = _scoped_selector[name] || {};
  
        Object.keys(object).forEach(key => {
          _scoped_selector[name][key] = object[key];
        });
      });
  
      var component_name_for_element = (element) => {
        return (element.dataset.component || "")
      }
  
      var find_component = (child) => {
        var attempts = 0,
            parent_node = child.parentNode;
  
        if (component_name_for_element(child) == this.name) {
          return child;
        }
  
        while(attempts++ < 200) {
          var name = component_name_for_element(parent_node);
          if (name == this.name) break; 
          else parent_node = parent_node.parentNode;
        }
        return parent_node;
      }
  
      _scoped_selector.me = (element) => {
        var selector_string = `[data-component~='${this.name}']`,
            element_result;  
        return (element ? find_component(element) : _scoped_selector(""));
      };
  
      return _scoped_selector;
    }
  
    init() {
      this.function_methods.forEach(function_method => {
        var _$ = this.scoped_selector();
        function_method(_$);
      });
    }
  };
  
  Mozart.index = {};
  
  Mozart.init = () => {
    for (var component_name in Mozart.index) {
      var component = Mozart.index[component_name];
      component.init();
    }
  }
  
  Mozart.register = function(components) {
    return [components].flat().forEach(component => new this(component));
  }
  
  String.prototype.interpolate = function(o) {
    return this.replace(/#\{(.+?)\}/g,
      function (a, b) {
        var r = o[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
      }
    );
  };