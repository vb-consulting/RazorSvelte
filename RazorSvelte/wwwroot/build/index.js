var index = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    // Adapted from https://github.com/then/is-promise/blob/master/index.js
    // Distributed under MIT License https://github.com/then/is-promise/blob/master/LICENSE
    function is_promise(value) {
        return !!value && (typeof value === 'object' || typeof value === 'function') && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run$1(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run$1);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * Schedules a callback to run immediately before the component is updated after any state change.
     *
     * The first time the callback runs will be before the initial `onMount`
     *
     * https://svelte.dev/docs#run-time-svelte-beforeupdate
     */
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    /**
     * Schedules a callback to run immediately after the component has been updated.
     *
     * The first time the callback runs will be after the initial `onMount`
     */
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run$1).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getAugmentedNamespace(n) {
      if (n.__esModule) return n;
      var f = n.default;
    	if (typeof f == "function") {
    		var a = function a () {
    			if (this instanceof a) {
    				var args = [null];
    				args.push.apply(args, arguments);
    				var Ctor = Function.bind.apply(f, args);
    				return new Ctor();
    			}
    			return f.apply(this, arguments);
    		};
    		a.prototype = f.prototype;
      } else a = {};
      Object.defineProperty(a, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
    }

    var tooltipExports = {};
    var tooltip = {
      get exports(){ return tooltipExports; },
      set exports(v){ tooltipExports = v; },
    };

    var top = 'top';
    var bottom = 'bottom';
    var right = 'right';
    var left = 'left';
    var auto = 'auto';
    var basePlacements = [top, bottom, right, left];
    var start = 'start';
    var end = 'end';
    var clippingParents = 'clippingParents';
    var viewport = 'viewport';
    var popper = 'popper';
    var reference = 'reference';
    var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
      return acc.concat([placement + "-" + start, placement + "-" + end]);
    }, []);
    var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
      return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
    }, []); // modifiers that need to read the DOM

    var beforeRead = 'beforeRead';
    var read = 'read';
    var afterRead = 'afterRead'; // pure-logic modifiers

    var beforeMain = 'beforeMain';
    var main = 'main';
    var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

    var beforeWrite = 'beforeWrite';
    var write = 'write';
    var afterWrite = 'afterWrite';
    var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

    function getNodeName(element) {
      return element ? (element.nodeName || '').toLowerCase() : null;
    }

    function getWindow(node) {
      if (node == null) {
        return window;
      }

      if (node.toString() !== '[object Window]') {
        var ownerDocument = node.ownerDocument;
        return ownerDocument ? ownerDocument.defaultView || window : window;
      }

      return node;
    }

    function isElement(node) {
      var OwnElement = getWindow(node).Element;
      return node instanceof OwnElement || node instanceof Element;
    }

    function isHTMLElement(node) {
      var OwnElement = getWindow(node).HTMLElement;
      return node instanceof OwnElement || node instanceof HTMLElement;
    }

    function isShadowRoot(node) {
      // IE 11 has no ShadowRoot
      if (typeof ShadowRoot === 'undefined') {
        return false;
      }

      var OwnElement = getWindow(node).ShadowRoot;
      return node instanceof OwnElement || node instanceof ShadowRoot;
    }

    // and applies them to the HTMLElements such as popper and arrow

    function applyStyles(_ref) {
      var state = _ref.state;
      Object.keys(state.elements).forEach(function (name) {
        var style = state.styles[name] || {};
        var attributes = state.attributes[name] || {};
        var element = state.elements[name]; // arrow is optional + virtual elements

        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        } // Flow doesn't support to extend this property, but it's the most
        // effective way to apply styles to an HTMLElement
        // $FlowFixMe[cannot-write]


        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function (name) {
          var value = attributes[name];

          if (value === false) {
            element.removeAttribute(name);
          } else {
            element.setAttribute(name, value === true ? '' : value);
          }
        });
      });
    }

    function effect$2(_ref2) {
      var state = _ref2.state;
      var initialStyles = {
        popper: {
          position: state.options.strategy,
          left: '0',
          top: '0',
          margin: '0'
        },
        arrow: {
          position: 'absolute'
        },
        reference: {}
      };
      Object.assign(state.elements.popper.style, initialStyles.popper);
      state.styles = initialStyles;

      if (state.elements.arrow) {
        Object.assign(state.elements.arrow.style, initialStyles.arrow);
      }

      return function () {
        Object.keys(state.elements).forEach(function (name) {
          var element = state.elements[name];
          var attributes = state.attributes[name] || {};
          var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

          var style = styleProperties.reduce(function (style, property) {
            style[property] = '';
            return style;
          }, {}); // arrow is optional + virtual elements

          if (!isHTMLElement(element) || !getNodeName(element)) {
            return;
          }

          Object.assign(element.style, style);
          Object.keys(attributes).forEach(function (attribute) {
            element.removeAttribute(attribute);
          });
        });
      };
    } // eslint-disable-next-line import/no-unused-modules


    var applyStyles$1 = {
      name: 'applyStyles',
      enabled: true,
      phase: 'write',
      fn: applyStyles,
      effect: effect$2,
      requires: ['computeStyles']
    };

    function getBasePlacement(placement) {
      return placement.split('-')[0];
    }

    var max = Math.max;
    var min = Math.min;
    var round = Math.round;

    function getUAString() {
      var uaData = navigator.userAgentData;

      if (uaData != null && uaData.brands) {
        return uaData.brands.map(function (item) {
          return item.brand + "/" + item.version;
        }).join(' ');
      }

      return navigator.userAgent;
    }

    function isLayoutViewport() {
      return !/^((?!chrome|android).)*safari/i.test(getUAString());
    }

    function getBoundingClientRect(element, includeScale, isFixedStrategy) {
      if (includeScale === void 0) {
        includeScale = false;
      }

      if (isFixedStrategy === void 0) {
        isFixedStrategy = false;
      }

      var clientRect = element.getBoundingClientRect();
      var scaleX = 1;
      var scaleY = 1;

      if (includeScale && isHTMLElement(element)) {
        scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
        scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
      }

      var _ref = isElement(element) ? getWindow(element) : window,
          visualViewport = _ref.visualViewport;

      var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
      var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
      var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
      var width = clientRect.width / scaleX;
      var height = clientRect.height / scaleY;
      return {
        width: width,
        height: height,
        top: y,
        right: x + width,
        bottom: y + height,
        left: x,
        x: x,
        y: y
      };
    }

    // means it doesn't take into account transforms.

    function getLayoutRect(element) {
      var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
      // Fixes https://github.com/popperjs/popper-core/issues/1223

      var width = element.offsetWidth;
      var height = element.offsetHeight;

      if (Math.abs(clientRect.width - width) <= 1) {
        width = clientRect.width;
      }

      if (Math.abs(clientRect.height - height) <= 1) {
        height = clientRect.height;
      }

      return {
        x: element.offsetLeft,
        y: element.offsetTop,
        width: width,
        height: height
      };
    }

    function contains(parent, child) {
      var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

      if (parent.contains(child)) {
        return true;
      } // then fallback to custom implementation with Shadow DOM support
      else if (rootNode && isShadowRoot(rootNode)) {
          var next = child;

          do {
            if (next && parent.isSameNode(next)) {
              return true;
            } // $FlowFixMe[prop-missing]: need a better way to handle this...


            next = next.parentNode || next.host;
          } while (next);
        } // Give up, the result is false


      return false;
    }

    function getComputedStyle$1(element) {
      return getWindow(element).getComputedStyle(element);
    }

    function isTableElement(element) {
      return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
    }

    function getDocumentElement(element) {
      // $FlowFixMe[incompatible-return]: assume body is always available
      return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
      element.document) || window.document).documentElement;
    }

    function getParentNode(element) {
      if (getNodeName(element) === 'html') {
        return element;
      }

      return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
        // $FlowFixMe[incompatible-return]
        // $FlowFixMe[prop-missing]
        element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
        element.parentNode || ( // DOM Element detected
        isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
        // $FlowFixMe[incompatible-call]: HTMLElement is a Node
        getDocumentElement(element) // fallback

      );
    }

    function getTrueOffsetParent(element) {
      if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
      getComputedStyle$1(element).position === 'fixed') {
        return null;
      }

      return element.offsetParent;
    } // `.offsetParent` reports `null` for fixed elements, while absolute elements
    // return the containing block


    function getContainingBlock(element) {
      var isFirefox = /firefox/i.test(getUAString());
      var isIE = /Trident/i.test(getUAString());

      if (isIE && isHTMLElement(element)) {
        // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
        var elementCss = getComputedStyle$1(element);

        if (elementCss.position === 'fixed') {
          return null;
        }
      }

      var currentNode = getParentNode(element);

      if (isShadowRoot(currentNode)) {
        currentNode = currentNode.host;
      }

      while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
        var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
        // create a containing block.
        // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

        if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
          return currentNode;
        } else {
          currentNode = currentNode.parentNode;
        }
      }

      return null;
    } // Gets the closest ancestor positioned element. Handles some edge cases,
    // such as table ancestors and cross browser bugs.


    function getOffsetParent(element) {
      var window = getWindow(element);
      var offsetParent = getTrueOffsetParent(element);

      while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
        offsetParent = getTrueOffsetParent(offsetParent);
      }

      if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
        return window;
      }

      return offsetParent || getContainingBlock(element) || window;
    }

    function getMainAxisFromPlacement(placement) {
      return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
    }

    function within(min$1, value, max$1) {
      return max(min$1, min(value, max$1));
    }
    function withinMaxClamp(min, value, max) {
      var v = within(min, value, max);
      return v > max ? max : v;
    }

    function getFreshSideObject() {
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
    }

    function mergePaddingObject(paddingObject) {
      return Object.assign({}, getFreshSideObject(), paddingObject);
    }

    function expandToHashMap(value, keys) {
      return keys.reduce(function (hashMap, key) {
        hashMap[key] = value;
        return hashMap;
      }, {});
    }

    var toPaddingObject = function toPaddingObject(padding, state) {
      padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
        placement: state.placement
      })) : padding;
      return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
    };

    function arrow(_ref) {
      var _state$modifiersData$;

      var state = _ref.state,
          name = _ref.name,
          options = _ref.options;
      var arrowElement = state.elements.arrow;
      var popperOffsets = state.modifiersData.popperOffsets;
      var basePlacement = getBasePlacement(state.placement);
      var axis = getMainAxisFromPlacement(basePlacement);
      var isVertical = [left, right].indexOf(basePlacement) >= 0;
      var len = isVertical ? 'height' : 'width';

      if (!arrowElement || !popperOffsets) {
        return;
      }

      var paddingObject = toPaddingObject(options.padding, state);
      var arrowRect = getLayoutRect(arrowElement);
      var minProp = axis === 'y' ? top : left;
      var maxProp = axis === 'y' ? bottom : right;
      var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
      var startDiff = popperOffsets[axis] - state.rects.reference[axis];
      var arrowOffsetParent = getOffsetParent(arrowElement);
      var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
      var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
      // outside of the popper bounds

      var min = paddingObject[minProp];
      var max = clientSize - arrowRect[len] - paddingObject[maxProp];
      var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
      var offset = within(min, center, max); // Prevents breaking syntax highlighting...

      var axisProp = axis;
      state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
    }

    function effect$1(_ref2) {
      var state = _ref2.state,
          options = _ref2.options;
      var _options$element = options.element,
          arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

      if (arrowElement == null) {
        return;
      } // CSS selector


      if (typeof arrowElement === 'string') {
        arrowElement = state.elements.popper.querySelector(arrowElement);

        if (!arrowElement) {
          return;
        }
      }

      {
        if (!isHTMLElement(arrowElement)) {
          console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', 'To use an SVG arrow, wrap it in an HTMLElement that will be used as', 'the arrow.'].join(' '));
        }
      }

      if (!contains(state.elements.popper, arrowElement)) {
        {
          console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', 'element.'].join(' '));
        }

        return;
      }

      state.elements.arrow = arrowElement;
    } // eslint-disable-next-line import/no-unused-modules


    var arrow$1 = {
      name: 'arrow',
      enabled: true,
      phase: 'main',
      fn: arrow,
      effect: effect$1,
      requires: ['popperOffsets'],
      requiresIfExists: ['preventOverflow']
    };

    function getVariation(placement) {
      return placement.split('-')[1];
    }

    var unsetSides = {
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto'
    }; // Round the offsets to the nearest suitable subpixel based on the DPR.
    // Zooming can change the DPR, but it seems to report a value that will
    // cleanly divide the values into the appropriate subpixels.

    function roundOffsetsByDPR(_ref) {
      var x = _ref.x,
          y = _ref.y;
      var win = window;
      var dpr = win.devicePixelRatio || 1;
      return {
        x: round(x * dpr) / dpr || 0,
        y: round(y * dpr) / dpr || 0
      };
    }

    function mapToStyles(_ref2) {
      var _Object$assign2;

      var popper = _ref2.popper,
          popperRect = _ref2.popperRect,
          placement = _ref2.placement,
          variation = _ref2.variation,
          offsets = _ref2.offsets,
          position = _ref2.position,
          gpuAcceleration = _ref2.gpuAcceleration,
          adaptive = _ref2.adaptive,
          roundOffsets = _ref2.roundOffsets,
          isFixed = _ref2.isFixed;
      var _offsets$x = offsets.x,
          x = _offsets$x === void 0 ? 0 : _offsets$x,
          _offsets$y = offsets.y,
          y = _offsets$y === void 0 ? 0 : _offsets$y;

      var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
        x: x,
        y: y
      }) : {
        x: x,
        y: y
      };

      x = _ref3.x;
      y = _ref3.y;
      var hasX = offsets.hasOwnProperty('x');
      var hasY = offsets.hasOwnProperty('y');
      var sideX = left;
      var sideY = top;
      var win = window;

      if (adaptive) {
        var offsetParent = getOffsetParent(popper);
        var heightProp = 'clientHeight';
        var widthProp = 'clientWidth';

        if (offsetParent === getWindow(popper)) {
          offsetParent = getDocumentElement(popper);

          if (getComputedStyle$1(offsetParent).position !== 'static' && position === 'absolute') {
            heightProp = 'scrollHeight';
            widthProp = 'scrollWidth';
          }
        } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


        offsetParent = offsetParent;

        if (placement === top || (placement === left || placement === right) && variation === end) {
          sideY = bottom;
          var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
          offsetParent[heightProp];
          y -= offsetY - popperRect.height;
          y *= gpuAcceleration ? 1 : -1;
        }

        if (placement === left || (placement === top || placement === bottom) && variation === end) {
          sideX = right;
          var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
          offsetParent[widthProp];
          x -= offsetX - popperRect.width;
          x *= gpuAcceleration ? 1 : -1;
        }
      }

      var commonStyles = Object.assign({
        position: position
      }, adaptive && unsetSides);

      var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
        x: x,
        y: y
      }) : {
        x: x,
        y: y
      };

      x = _ref4.x;
      y = _ref4.y;

      if (gpuAcceleration) {
        var _Object$assign;

        return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
      }

      return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
    }

    function computeStyles(_ref5) {
      var state = _ref5.state,
          options = _ref5.options;
      var _options$gpuAccelerat = options.gpuAcceleration,
          gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
          _options$adaptive = options.adaptive,
          adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
          _options$roundOffsets = options.roundOffsets,
          roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

      {
        var transitionProperty = getComputedStyle$1(state.elements.popper).transitionProperty || '';

        if (adaptive && ['transform', 'top', 'right', 'bottom', 'left'].some(function (property) {
          return transitionProperty.indexOf(property) >= 0;
        })) {
          console.warn(['Popper: Detected CSS transitions on at least one of the following', 'CSS properties: "transform", "top", "right", "bottom", "left".', '\n\n', 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', 'for smooth transitions, or remove these properties from the CSS', 'transition declaration on the popper element if only transitioning', 'opacity or background-color for example.', '\n\n', 'We recommend using the popper element as a wrapper around an inner', 'element that can have any CSS property transitioned for animations.'].join(' '));
        }
      }

      var commonStyles = {
        placement: getBasePlacement(state.placement),
        variation: getVariation(state.placement),
        popper: state.elements.popper,
        popperRect: state.rects.popper,
        gpuAcceleration: gpuAcceleration,
        isFixed: state.options.strategy === 'fixed'
      };

      if (state.modifiersData.popperOffsets != null) {
        state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.popperOffsets,
          position: state.options.strategy,
          adaptive: adaptive,
          roundOffsets: roundOffsets
        })));
      }

      if (state.modifiersData.arrow != null) {
        state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.arrow,
          position: 'absolute',
          adaptive: false,
          roundOffsets: roundOffsets
        })));
      }

      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-placement': state.placement
      });
    } // eslint-disable-next-line import/no-unused-modules


    var computeStyles$1 = {
      name: 'computeStyles',
      enabled: true,
      phase: 'beforeWrite',
      fn: computeStyles,
      data: {}
    };

    var passive = {
      passive: true
    };

    function effect(_ref) {
      var state = _ref.state,
          instance = _ref.instance,
          options = _ref.options;
      var _options$scroll = options.scroll,
          scroll = _options$scroll === void 0 ? true : _options$scroll,
          _options$resize = options.resize,
          resize = _options$resize === void 0 ? true : _options$resize;
      var window = getWindow(state.elements.popper);
      var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

      if (scroll) {
        scrollParents.forEach(function (scrollParent) {
          scrollParent.addEventListener('scroll', instance.update, passive);
        });
      }

      if (resize) {
        window.addEventListener('resize', instance.update, passive);
      }

      return function () {
        if (scroll) {
          scrollParents.forEach(function (scrollParent) {
            scrollParent.removeEventListener('scroll', instance.update, passive);
          });
        }

        if (resize) {
          window.removeEventListener('resize', instance.update, passive);
        }
      };
    } // eslint-disable-next-line import/no-unused-modules


    var eventListeners = {
      name: 'eventListeners',
      enabled: true,
      phase: 'write',
      fn: function fn() {},
      effect: effect,
      data: {}
    };

    var hash$1 = {
      left: 'right',
      right: 'left',
      bottom: 'top',
      top: 'bottom'
    };
    function getOppositePlacement(placement) {
      return placement.replace(/left|right|bottom|top/g, function (matched) {
        return hash$1[matched];
      });
    }

    var hash = {
      start: 'end',
      end: 'start'
    };
    function getOppositeVariationPlacement(placement) {
      return placement.replace(/start|end/g, function (matched) {
        return hash[matched];
      });
    }

    function getWindowScroll(node) {
      var win = getWindow(node);
      var scrollLeft = win.pageXOffset;
      var scrollTop = win.pageYOffset;
      return {
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
      };
    }

    function getWindowScrollBarX(element) {
      // If <html> has a CSS width greater than the viewport, then this will be
      // incorrect for RTL.
      // Popper 1 is broken in this case and never had a bug report so let's assume
      // it's not an issue. I don't think anyone ever specifies width on <html>
      // anyway.
      // Browsers where the left scrollbar doesn't cause an issue report `0` for
      // this (e.g. Edge 2019, IE11, Safari)
      return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
    }

    function getViewportRect(element, strategy) {
      var win = getWindow(element);
      var html = getDocumentElement(element);
      var visualViewport = win.visualViewport;
      var width = html.clientWidth;
      var height = html.clientHeight;
      var x = 0;
      var y = 0;

      if (visualViewport) {
        width = visualViewport.width;
        height = visualViewport.height;
        var layoutViewport = isLayoutViewport();

        if (layoutViewport || !layoutViewport && strategy === 'fixed') {
          x = visualViewport.offsetLeft;
          y = visualViewport.offsetTop;
        }
      }

      return {
        width: width,
        height: height,
        x: x + getWindowScrollBarX(element),
        y: y
      };
    }

    // of the `<html>` and `<body>` rect bounds if horizontally scrollable

    function getDocumentRect(element) {
      var _element$ownerDocumen;

      var html = getDocumentElement(element);
      var winScroll = getWindowScroll(element);
      var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
      var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
      var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
      var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
      var y = -winScroll.scrollTop;

      if (getComputedStyle$1(body || html).direction === 'rtl') {
        x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
      }

      return {
        width: width,
        height: height,
        x: x,
        y: y
      };
    }

    function isScrollParent(element) {
      // Firefox wants us to check `-x` and `-y` variations as well
      var _getComputedStyle = getComputedStyle$1(element),
          overflow = _getComputedStyle.overflow,
          overflowX = _getComputedStyle.overflowX,
          overflowY = _getComputedStyle.overflowY;

      return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
    }

    function getScrollParent(node) {
      if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
        // $FlowFixMe[incompatible-return]: assume body is always available
        return node.ownerDocument.body;
      }

      if (isHTMLElement(node) && isScrollParent(node)) {
        return node;
      }

      return getScrollParent(getParentNode(node));
    }

    /*
    given a DOM element, return the list of all scroll parents, up the list of ancesors
    until we get to the top window object. This list is what we attach scroll listeners
    to, because if any of these parent elements scroll, we'll need to re-calculate the
    reference element's position.
    */

    function listScrollParents(element, list) {
      var _element$ownerDocumen;

      if (list === void 0) {
        list = [];
      }

      var scrollParent = getScrollParent(element);
      var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
      var win = getWindow(scrollParent);
      var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
      var updatedList = list.concat(target);
      return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
      updatedList.concat(listScrollParents(getParentNode(target)));
    }

    function rectToClientRect(rect) {
      return Object.assign({}, rect, {
        left: rect.x,
        top: rect.y,
        right: rect.x + rect.width,
        bottom: rect.y + rect.height
      });
    }

    function getInnerBoundingClientRect(element, strategy) {
      var rect = getBoundingClientRect(element, false, strategy === 'fixed');
      rect.top = rect.top + element.clientTop;
      rect.left = rect.left + element.clientLeft;
      rect.bottom = rect.top + element.clientHeight;
      rect.right = rect.left + element.clientWidth;
      rect.width = element.clientWidth;
      rect.height = element.clientHeight;
      rect.x = rect.left;
      rect.y = rect.top;
      return rect;
    }

    function getClientRectFromMixedType(element, clippingParent, strategy) {
      return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
    } // A "clipping parent" is an overflowable container with the characteristic of
    // clipping (or hiding) overflowing elements with a position different from
    // `initial`


    function getClippingParents(element) {
      var clippingParents = listScrollParents(getParentNode(element));
      var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
      var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

      if (!isElement(clipperElement)) {
        return [];
      } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


      return clippingParents.filter(function (clippingParent) {
        return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
      });
    } // Gets the maximum area that the element is visible in due to any number of
    // clipping parents


    function getClippingRect(element, boundary, rootBoundary, strategy) {
      var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
      var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
      var firstClippingParent = clippingParents[0];
      var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
        var rect = getClientRectFromMixedType(element, clippingParent, strategy);
        accRect.top = max(rect.top, accRect.top);
        accRect.right = min(rect.right, accRect.right);
        accRect.bottom = min(rect.bottom, accRect.bottom);
        accRect.left = max(rect.left, accRect.left);
        return accRect;
      }, getClientRectFromMixedType(element, firstClippingParent, strategy));
      clippingRect.width = clippingRect.right - clippingRect.left;
      clippingRect.height = clippingRect.bottom - clippingRect.top;
      clippingRect.x = clippingRect.left;
      clippingRect.y = clippingRect.top;
      return clippingRect;
    }

    function computeOffsets(_ref) {
      var reference = _ref.reference,
          element = _ref.element,
          placement = _ref.placement;
      var basePlacement = placement ? getBasePlacement(placement) : null;
      var variation = placement ? getVariation(placement) : null;
      var commonX = reference.x + reference.width / 2 - element.width / 2;
      var commonY = reference.y + reference.height / 2 - element.height / 2;
      var offsets;

      switch (basePlacement) {
        case top:
          offsets = {
            x: commonX,
            y: reference.y - element.height
          };
          break;

        case bottom:
          offsets = {
            x: commonX,
            y: reference.y + reference.height
          };
          break;

        case right:
          offsets = {
            x: reference.x + reference.width,
            y: commonY
          };
          break;

        case left:
          offsets = {
            x: reference.x - element.width,
            y: commonY
          };
          break;

        default:
          offsets = {
            x: reference.x,
            y: reference.y
          };
      }

      var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

      if (mainAxis != null) {
        var len = mainAxis === 'y' ? 'height' : 'width';

        switch (variation) {
          case start:
            offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
            break;

          case end:
            offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
            break;
        }
      }

      return offsets;
    }

    function detectOverflow(state, options) {
      if (options === void 0) {
        options = {};
      }

      var _options = options,
          _options$placement = _options.placement,
          placement = _options$placement === void 0 ? state.placement : _options$placement,
          _options$strategy = _options.strategy,
          strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
          _options$boundary = _options.boundary,
          boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
          _options$rootBoundary = _options.rootBoundary,
          rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
          _options$elementConte = _options.elementContext,
          elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
          _options$altBoundary = _options.altBoundary,
          altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
          _options$padding = _options.padding,
          padding = _options$padding === void 0 ? 0 : _options$padding;
      var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
      var altContext = elementContext === popper ? reference : popper;
      var popperRect = state.rects.popper;
      var element = state.elements[altBoundary ? altContext : elementContext];
      var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
      var referenceClientRect = getBoundingClientRect(state.elements.reference);
      var popperOffsets = computeOffsets({
        reference: referenceClientRect,
        element: popperRect,
        strategy: 'absolute',
        placement: placement
      });
      var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
      var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
      // 0 or negative = within the clipping rect

      var overflowOffsets = {
        top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
        bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
        left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
        right: elementClientRect.right - clippingClientRect.right + paddingObject.right
      };
      var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

      if (elementContext === popper && offsetData) {
        var offset = offsetData[placement];
        Object.keys(overflowOffsets).forEach(function (key) {
          var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
          var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
          overflowOffsets[key] += offset[axis] * multiply;
        });
      }

      return overflowOffsets;
    }

    function computeAutoPlacement(state, options) {
      if (options === void 0) {
        options = {};
      }

      var _options = options,
          placement = _options.placement,
          boundary = _options.boundary,
          rootBoundary = _options.rootBoundary,
          padding = _options.padding,
          flipVariations = _options.flipVariations,
          _options$allowedAutoP = _options.allowedAutoPlacements,
          allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
      var variation = getVariation(placement);
      var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
        return getVariation(placement) === variation;
      }) : basePlacements;
      var allowedPlacements = placements$1.filter(function (placement) {
        return allowedAutoPlacements.indexOf(placement) >= 0;
      });

      if (allowedPlacements.length === 0) {
        allowedPlacements = placements$1;

        {
          console.error(['Popper: The `allowedAutoPlacements` option did not allow any', 'placements. Ensure the `placement` option matches the variation', 'of the allowed placements.', 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(' '));
        }
      } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


      var overflows = allowedPlacements.reduce(function (acc, placement) {
        acc[placement] = detectOverflow(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding
        })[getBasePlacement(placement)];
        return acc;
      }, {});
      return Object.keys(overflows).sort(function (a, b) {
        return overflows[a] - overflows[b];
      });
    }

    function getExpandedFallbackPlacements(placement) {
      if (getBasePlacement(placement) === auto) {
        return [];
      }

      var oppositePlacement = getOppositePlacement(placement);
      return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
    }

    function flip(_ref) {
      var state = _ref.state,
          options = _ref.options,
          name = _ref.name;

      if (state.modifiersData[name]._skip) {
        return;
      }

      var _options$mainAxis = options.mainAxis,
          checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
          _options$altAxis = options.altAxis,
          checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
          specifiedFallbackPlacements = options.fallbackPlacements,
          padding = options.padding,
          boundary = options.boundary,
          rootBoundary = options.rootBoundary,
          altBoundary = options.altBoundary,
          _options$flipVariatio = options.flipVariations,
          flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
          allowedAutoPlacements = options.allowedAutoPlacements;
      var preferredPlacement = state.options.placement;
      var basePlacement = getBasePlacement(preferredPlacement);
      var isBasePlacement = basePlacement === preferredPlacement;
      var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
      var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
        return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding,
          flipVariations: flipVariations,
          allowedAutoPlacements: allowedAutoPlacements
        }) : placement);
      }, []);
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var checksMap = new Map();
      var makeFallbackChecks = true;
      var firstFittingPlacement = placements[0];

      for (var i = 0; i < placements.length; i++) {
        var placement = placements[i];

        var _basePlacement = getBasePlacement(placement);

        var isStartVariation = getVariation(placement) === start;
        var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
        var len = isVertical ? 'width' : 'height';
        var overflow = detectOverflow(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          altBoundary: altBoundary,
          padding: padding
        });
        var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

        if (referenceRect[len] > popperRect[len]) {
          mainVariationSide = getOppositePlacement(mainVariationSide);
        }

        var altVariationSide = getOppositePlacement(mainVariationSide);
        var checks = [];

        if (checkMainAxis) {
          checks.push(overflow[_basePlacement] <= 0);
        }

        if (checkAltAxis) {
          checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
        }

        if (checks.every(function (check) {
          return check;
        })) {
          firstFittingPlacement = placement;
          makeFallbackChecks = false;
          break;
        }

        checksMap.set(placement, checks);
      }

      if (makeFallbackChecks) {
        // `2` may be desired in some cases – research later
        var numberOfChecks = flipVariations ? 3 : 1;

        var _loop = function _loop(_i) {
          var fittingPlacement = placements.find(function (placement) {
            var checks = checksMap.get(placement);

            if (checks) {
              return checks.slice(0, _i).every(function (check) {
                return check;
              });
            }
          });

          if (fittingPlacement) {
            firstFittingPlacement = fittingPlacement;
            return "break";
          }
        };

        for (var _i = numberOfChecks; _i > 0; _i--) {
          var _ret = _loop(_i);

          if (_ret === "break") break;
        }
      }

      if (state.placement !== firstFittingPlacement) {
        state.modifiersData[name]._skip = true;
        state.placement = firstFittingPlacement;
        state.reset = true;
      }
    } // eslint-disable-next-line import/no-unused-modules


    var flip$1 = {
      name: 'flip',
      enabled: true,
      phase: 'main',
      fn: flip,
      requiresIfExists: ['offset'],
      data: {
        _skip: false
      }
    };

    function getSideOffsets(overflow, rect, preventedOffsets) {
      if (preventedOffsets === void 0) {
        preventedOffsets = {
          x: 0,
          y: 0
        };
      }

      return {
        top: overflow.top - rect.height - preventedOffsets.y,
        right: overflow.right - rect.width + preventedOffsets.x,
        bottom: overflow.bottom - rect.height + preventedOffsets.y,
        left: overflow.left - rect.width - preventedOffsets.x
      };
    }

    function isAnySideFullyClipped(overflow) {
      return [top, right, bottom, left].some(function (side) {
        return overflow[side] >= 0;
      });
    }

    function hide(_ref) {
      var state = _ref.state,
          name = _ref.name;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var preventedOffsets = state.modifiersData.preventOverflow;
      var referenceOverflow = detectOverflow(state, {
        elementContext: 'reference'
      });
      var popperAltOverflow = detectOverflow(state, {
        altBoundary: true
      });
      var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
      var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
      var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
      var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
      state.modifiersData[name] = {
        referenceClippingOffsets: referenceClippingOffsets,
        popperEscapeOffsets: popperEscapeOffsets,
        isReferenceHidden: isReferenceHidden,
        hasPopperEscaped: hasPopperEscaped
      };
      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-reference-hidden': isReferenceHidden,
        'data-popper-escaped': hasPopperEscaped
      });
    } // eslint-disable-next-line import/no-unused-modules


    var hide$1 = {
      name: 'hide',
      enabled: true,
      phase: 'main',
      requiresIfExists: ['preventOverflow'],
      fn: hide
    };

    function distanceAndSkiddingToXY(placement, rects, offset) {
      var basePlacement = getBasePlacement(placement);
      var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

      var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
        placement: placement
      })) : offset,
          skidding = _ref[0],
          distance = _ref[1];

      skidding = skidding || 0;
      distance = (distance || 0) * invertDistance;
      return [left, right].indexOf(basePlacement) >= 0 ? {
        x: distance,
        y: skidding
      } : {
        x: skidding,
        y: distance
      };
    }

    function offset(_ref2) {
      var state = _ref2.state,
          options = _ref2.options,
          name = _ref2.name;
      var _options$offset = options.offset,
          offset = _options$offset === void 0 ? [0, 0] : _options$offset;
      var data = placements.reduce(function (acc, placement) {
        acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
        return acc;
      }, {});
      var _data$state$placement = data[state.placement],
          x = _data$state$placement.x,
          y = _data$state$placement.y;

      if (state.modifiersData.popperOffsets != null) {
        state.modifiersData.popperOffsets.x += x;
        state.modifiersData.popperOffsets.y += y;
      }

      state.modifiersData[name] = data;
    } // eslint-disable-next-line import/no-unused-modules


    var offset$1 = {
      name: 'offset',
      enabled: true,
      phase: 'main',
      requires: ['popperOffsets'],
      fn: offset
    };

    function popperOffsets(_ref) {
      var state = _ref.state,
          name = _ref.name;
      // Offsets are the actual position the popper needs to have to be
      // properly positioned near its reference element
      // This is the most basic placement, and will be adjusted by
      // the modifiers in the next step
      state.modifiersData[name] = computeOffsets({
        reference: state.rects.reference,
        element: state.rects.popper,
        strategy: 'absolute',
        placement: state.placement
      });
    } // eslint-disable-next-line import/no-unused-modules


    var popperOffsets$1 = {
      name: 'popperOffsets',
      enabled: true,
      phase: 'read',
      fn: popperOffsets,
      data: {}
    };

    function getAltAxis(axis) {
      return axis === 'x' ? 'y' : 'x';
    }

    function preventOverflow(_ref) {
      var state = _ref.state,
          options = _ref.options,
          name = _ref.name;
      var _options$mainAxis = options.mainAxis,
          checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
          _options$altAxis = options.altAxis,
          checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
          boundary = options.boundary,
          rootBoundary = options.rootBoundary,
          altBoundary = options.altBoundary,
          padding = options.padding,
          _options$tether = options.tether,
          tether = _options$tether === void 0 ? true : _options$tether,
          _options$tetherOffset = options.tetherOffset,
          tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
      var overflow = detectOverflow(state, {
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
        altBoundary: altBoundary
      });
      var basePlacement = getBasePlacement(state.placement);
      var variation = getVariation(state.placement);
      var isBasePlacement = !variation;
      var mainAxis = getMainAxisFromPlacement(basePlacement);
      var altAxis = getAltAxis(mainAxis);
      var popperOffsets = state.modifiersData.popperOffsets;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
        placement: state.placement
      })) : tetherOffset;
      var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
        mainAxis: tetherOffsetValue,
        altAxis: tetherOffsetValue
      } : Object.assign({
        mainAxis: 0,
        altAxis: 0
      }, tetherOffsetValue);
      var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
      var data = {
        x: 0,
        y: 0
      };

      if (!popperOffsets) {
        return;
      }

      if (checkMainAxis) {
        var _offsetModifierState$;

        var mainSide = mainAxis === 'y' ? top : left;
        var altSide = mainAxis === 'y' ? bottom : right;
        var len = mainAxis === 'y' ? 'height' : 'width';
        var offset = popperOffsets[mainAxis];
        var min$1 = offset + overflow[mainSide];
        var max$1 = offset - overflow[altSide];
        var additive = tether ? -popperRect[len] / 2 : 0;
        var minLen = variation === start ? referenceRect[len] : popperRect[len];
        var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
        // outside the reference bounds

        var arrowElement = state.elements.arrow;
        var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
          width: 0,
          height: 0
        };
        var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
        var arrowPaddingMin = arrowPaddingObject[mainSide];
        var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
        // to include its full size in the calculation. If the reference is small
        // and near the edge of a boundary, the popper can overflow even if the
        // reference is not overflowing as well (e.g. virtual elements with no
        // width or height)

        var arrowLen = within(0, referenceRect[len], arrowRect[len]);
        var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
        var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
        var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
        var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
        var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
        var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
        var tetherMax = offset + maxOffset - offsetModifierValue;
        var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
        popperOffsets[mainAxis] = preventedOffset;
        data[mainAxis] = preventedOffset - offset;
      }

      if (checkAltAxis) {
        var _offsetModifierState$2;

        var _mainSide = mainAxis === 'x' ? top : left;

        var _altSide = mainAxis === 'x' ? bottom : right;

        var _offset = popperOffsets[altAxis];

        var _len = altAxis === 'y' ? 'height' : 'width';

        var _min = _offset + overflow[_mainSide];

        var _max = _offset - overflow[_altSide];

        var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

        var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

        var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

        var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

        var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

        popperOffsets[altAxis] = _preventedOffset;
        data[altAxis] = _preventedOffset - _offset;
      }

      state.modifiersData[name] = data;
    } // eslint-disable-next-line import/no-unused-modules


    var preventOverflow$1 = {
      name: 'preventOverflow',
      enabled: true,
      phase: 'main',
      fn: preventOverflow,
      requiresIfExists: ['offset']
    };

    function getHTMLElementScroll(element) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }

    function getNodeScroll(node) {
      if (node === getWindow(node) || !isHTMLElement(node)) {
        return getWindowScroll(node);
      } else {
        return getHTMLElementScroll(node);
      }
    }

    function isElementScaled(element) {
      var rect = element.getBoundingClientRect();
      var scaleX = round(rect.width) / element.offsetWidth || 1;
      var scaleY = round(rect.height) / element.offsetHeight || 1;
      return scaleX !== 1 || scaleY !== 1;
    } // Returns the composite rect of an element relative to its offsetParent.
    // Composite means it takes into account transforms as well as layout.


    function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
      if (isFixed === void 0) {
        isFixed = false;
      }

      var isOffsetParentAnElement = isHTMLElement(offsetParent);
      var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
      var documentElement = getDocumentElement(offsetParent);
      var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
      var scroll = {
        scrollLeft: 0,
        scrollTop: 0
      };
      var offsets = {
        x: 0,
        y: 0
      };

      if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
        if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
        isScrollParent(documentElement)) {
          scroll = getNodeScroll(offsetParent);
        }

        if (isHTMLElement(offsetParent)) {
          offsets = getBoundingClientRect(offsetParent, true);
          offsets.x += offsetParent.clientLeft;
          offsets.y += offsetParent.clientTop;
        } else if (documentElement) {
          offsets.x = getWindowScrollBarX(documentElement);
        }
      }

      return {
        x: rect.left + scroll.scrollLeft - offsets.x,
        y: rect.top + scroll.scrollTop - offsets.y,
        width: rect.width,
        height: rect.height
      };
    }

    function order(modifiers) {
      var map = new Map();
      var visited = new Set();
      var result = [];
      modifiers.forEach(function (modifier) {
        map.set(modifier.name, modifier);
      }); // On visiting object, check for its dependencies and visit them recursively

      function sort(modifier) {
        visited.add(modifier.name);
        var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
        requires.forEach(function (dep) {
          if (!visited.has(dep)) {
            var depModifier = map.get(dep);

            if (depModifier) {
              sort(depModifier);
            }
          }
        });
        result.push(modifier);
      }

      modifiers.forEach(function (modifier) {
        if (!visited.has(modifier.name)) {
          // check for visited object
          sort(modifier);
        }
      });
      return result;
    }

    function orderModifiers(modifiers) {
      // order based on dependencies
      var orderedModifiers = order(modifiers); // order based on phase

      return modifierPhases.reduce(function (acc, phase) {
        return acc.concat(orderedModifiers.filter(function (modifier) {
          return modifier.phase === phase;
        }));
      }, []);
    }

    function debounce(fn) {
      var pending;
      return function () {
        if (!pending) {
          pending = new Promise(function (resolve) {
            Promise.resolve().then(function () {
              pending = undefined;
              resolve(fn());
            });
          });
        }

        return pending;
      };
    }

    function format(str) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return [].concat(args).reduce(function (p, c) {
        return p.replace(/%s/, c);
      }, str);
    }

    var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
    var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
    var VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
    function validateModifiers(modifiers) {
      modifiers.forEach(function (modifier) {
        [].concat(Object.keys(modifier), VALID_PROPERTIES) // IE11-compatible replacement for `new Set(iterable)`
        .filter(function (value, index, self) {
          return self.indexOf(value) === index;
        }).forEach(function (key) {
          switch (key) {
            case 'name':
              if (typeof modifier.name !== 'string') {
                console.error(format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', "\"" + String(modifier.name) + "\""));
              }

              break;

            case 'enabled':
              if (typeof modifier.enabled !== 'boolean') {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\"" + String(modifier.enabled) + "\""));
              }

              break;

            case 'phase':
              if (modifierPhases.indexOf(modifier.phase) < 0) {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(', '), "\"" + String(modifier.phase) + "\""));
              }

              break;

            case 'fn':
              if (typeof modifier.fn !== 'function') {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', "\"" + String(modifier.fn) + "\""));
              }

              break;

            case 'effect':
              if (modifier.effect != null && typeof modifier.effect !== 'function') {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', "\"" + String(modifier.fn) + "\""));
              }

              break;

            case 'requires':
              if (modifier.requires != null && !Array.isArray(modifier.requires)) {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', "\"" + String(modifier.requires) + "\""));
              }

              break;

            case 'requiresIfExists':
              if (!Array.isArray(modifier.requiresIfExists)) {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\"" + String(modifier.requiresIfExists) + "\""));
              }

              break;

            case 'options':
            case 'data':
              break;

            default:
              console.error("PopperJS: an invalid property has been provided to the \"" + modifier.name + "\" modifier, valid properties are " + VALID_PROPERTIES.map(function (s) {
                return "\"" + s + "\"";
              }).join(', ') + "; but \"" + key + "\" was provided.");
          }

          modifier.requires && modifier.requires.forEach(function (requirement) {
            if (modifiers.find(function (mod) {
              return mod.name === requirement;
            }) == null) {
              console.error(format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
            }
          });
        });
      });
    }

    function uniqueBy(arr, fn) {
      var identifiers = new Set();
      return arr.filter(function (item) {
        var identifier = fn(item);

        if (!identifiers.has(identifier)) {
          identifiers.add(identifier);
          return true;
        }
      });
    }

    function mergeByName(modifiers) {
      var merged = modifiers.reduce(function (merged, current) {
        var existing = merged[current.name];
        merged[current.name] = existing ? Object.assign({}, existing, current, {
          options: Object.assign({}, existing.options, current.options),
          data: Object.assign({}, existing.data, current.data)
        }) : current;
        return merged;
      }, {}); // IE11 does not support Object.values

      return Object.keys(merged).map(function (key) {
        return merged[key];
      });
    }

    var INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
    var INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
    var DEFAULT_OPTIONS = {
      placement: 'bottom',
      modifiers: [],
      strategy: 'absolute'
    };

    function areValidElements() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return !args.some(function (element) {
        return !(element && typeof element.getBoundingClientRect === 'function');
      });
    }

    function popperGenerator(generatorOptions) {
      if (generatorOptions === void 0) {
        generatorOptions = {};
      }

      var _generatorOptions = generatorOptions,
          _generatorOptions$def = _generatorOptions.defaultModifiers,
          defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
          _generatorOptions$def2 = _generatorOptions.defaultOptions,
          defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
      return function createPopper(reference, popper, options) {
        if (options === void 0) {
          options = defaultOptions;
        }

        var state = {
          placement: 'bottom',
          orderedModifiers: [],
          options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
          modifiersData: {},
          elements: {
            reference: reference,
            popper: popper
          },
          attributes: {},
          styles: {}
        };
        var effectCleanupFns = [];
        var isDestroyed = false;
        var instance = {
          state: state,
          setOptions: function setOptions(setOptionsAction) {
            var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
            cleanupModifierEffects();
            state.options = Object.assign({}, defaultOptions, state.options, options);
            state.scrollParents = {
              reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
              popper: listScrollParents(popper)
            }; // Orders the modifiers based on their dependencies and `phase`
            // properties

            var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

            state.orderedModifiers = orderedModifiers.filter(function (m) {
              return m.enabled;
            }); // Validate the provided modifiers so that the consumer will get warned
            // if one of the modifiers is invalid for any reason

            {
              var modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
                var name = _ref.name;
                return name;
              });
              validateModifiers(modifiers);

              if (getBasePlacement(state.options.placement) === auto) {
                var flipModifier = state.orderedModifiers.find(function (_ref2) {
                  var name = _ref2.name;
                  return name === 'flip';
                });

                if (!flipModifier) {
                  console.error(['Popper: "auto" placements require the "flip" modifier be', 'present and enabled to work.'].join(' '));
                }
              }

              var _getComputedStyle = getComputedStyle$1(popper),
                  marginTop = _getComputedStyle.marginTop,
                  marginRight = _getComputedStyle.marginRight,
                  marginBottom = _getComputedStyle.marginBottom,
                  marginLeft = _getComputedStyle.marginLeft; // We no longer take into account `margins` on the popper, and it can
              // cause bugs with positioning, so we'll warn the consumer


              if ([marginTop, marginRight, marginBottom, marginLeft].some(function (margin) {
                return parseFloat(margin);
              })) {
                console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', 'between the popper and its reference element or boundary.', 'To replicate margin, use the `offset` modifier, as well as', 'the `padding` option in the `preventOverflow` and `flip`', 'modifiers.'].join(' '));
              }
            }

            runModifierEffects();
            return instance.update();
          },
          // Sync update – it will always be executed, even if not necessary. This
          // is useful for low frequency updates where sync behavior simplifies the
          // logic.
          // For high frequency updates (e.g. `resize` and `scroll` events), always
          // prefer the async Popper#update method
          forceUpdate: function forceUpdate() {
            if (isDestroyed) {
              return;
            }

            var _state$elements = state.elements,
                reference = _state$elements.reference,
                popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
            // anymore

            if (!areValidElements(reference, popper)) {
              {
                console.error(INVALID_ELEMENT_ERROR);
              }

              return;
            } // Store the reference and popper rects to be read by modifiers


            state.rects = {
              reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
              popper: getLayoutRect(popper)
            }; // Modifiers have the ability to reset the current update cycle. The
            // most common use case for this is the `flip` modifier changing the
            // placement, which then needs to re-run all the modifiers, because the
            // logic was previously ran for the previous placement and is therefore
            // stale/incorrect

            state.reset = false;
            state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
            // is filled with the initial data specified by the modifier. This means
            // it doesn't persist and is fresh on each update.
            // To ensure persistent data, use `${name}#persistent`

            state.orderedModifiers.forEach(function (modifier) {
              return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
            });
            var __debug_loops__ = 0;

            for (var index = 0; index < state.orderedModifiers.length; index++) {
              {
                __debug_loops__ += 1;

                if (__debug_loops__ > 100) {
                  console.error(INFINITE_LOOP_ERROR);
                  break;
                }
              }

              if (state.reset === true) {
                state.reset = false;
                index = -1;
                continue;
              }

              var _state$orderedModifie = state.orderedModifiers[index],
                  fn = _state$orderedModifie.fn,
                  _state$orderedModifie2 = _state$orderedModifie.options,
                  _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
                  name = _state$orderedModifie.name;

              if (typeof fn === 'function') {
                state = fn({
                  state: state,
                  options: _options,
                  name: name,
                  instance: instance
                }) || state;
              }
            }
          },
          // Async and optimistically optimized update – it will not be executed if
          // not necessary (debounced to run at most once-per-tick)
          update: debounce(function () {
            return new Promise(function (resolve) {
              instance.forceUpdate();
              resolve(state);
            });
          }),
          destroy: function destroy() {
            cleanupModifierEffects();
            isDestroyed = true;
          }
        };

        if (!areValidElements(reference, popper)) {
          {
            console.error(INVALID_ELEMENT_ERROR);
          }

          return instance;
        }

        instance.setOptions(options).then(function (state) {
          if (!isDestroyed && options.onFirstUpdate) {
            options.onFirstUpdate(state);
          }
        }); // Modifiers have the ability to execute arbitrary code before the first
        // update cycle runs. They will be executed in the same order as the update
        // cycle. This is useful when a modifier adds some persistent data that
        // other modifiers need to use, but the modifier is run after the dependent
        // one.

        function runModifierEffects() {
          state.orderedModifiers.forEach(function (_ref3) {
            var name = _ref3.name,
                _ref3$options = _ref3.options,
                options = _ref3$options === void 0 ? {} : _ref3$options,
                effect = _ref3.effect;

            if (typeof effect === 'function') {
              var cleanupFn = effect({
                state: state,
                name: name,
                instance: instance,
                options: options
              });

              var noopFn = function noopFn() {};

              effectCleanupFns.push(cleanupFn || noopFn);
            }
          });
        }

        function cleanupModifierEffects() {
          effectCleanupFns.forEach(function (fn) {
            return fn();
          });
          effectCleanupFns = [];
        }

        return instance;
      };
    }
    var createPopper$2 = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules

    var defaultModifiers$1 = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1];
    var createPopper$1 = /*#__PURE__*/popperGenerator({
      defaultModifiers: defaultModifiers$1
    }); // eslint-disable-next-line import/no-unused-modules

    var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
    var createPopper = /*#__PURE__*/popperGenerator({
      defaultModifiers: defaultModifiers
    }); // eslint-disable-next-line import/no-unused-modules

    var lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        afterMain: afterMain,
        afterRead: afterRead,
        afterWrite: afterWrite,
        applyStyles: applyStyles$1,
        arrow: arrow$1,
        auto: auto,
        basePlacements: basePlacements,
        beforeMain: beforeMain,
        beforeRead: beforeRead,
        beforeWrite: beforeWrite,
        bottom: bottom,
        clippingParents: clippingParents,
        computeStyles: computeStyles$1,
        createPopper: createPopper,
        createPopperBase: createPopper$2,
        createPopperLite: createPopper$1,
        detectOverflow: detectOverflow,
        end: end,
        eventListeners: eventListeners,
        flip: flip$1,
        hide: hide$1,
        left: left,
        main: main,
        modifierPhases: modifierPhases,
        offset: offset$1,
        placements: placements,
        popper: popper,
        popperGenerator: popperGenerator,
        popperOffsets: popperOffsets$1,
        preventOverflow: preventOverflow$1,
        read: read,
        reference: reference,
        right: right,
        start: start,
        top: top,
        variationPlacements: variationPlacements,
        viewport: viewport,
        write: write
    });

    var require$$0 = /*@__PURE__*/getAugmentedNamespace(lib);

    var utilExports = {};
    var util = {
      get exports(){ return utilExports; },
      set exports(v){ utilExports = v; },
    };

    /*!
      * Bootstrap index.js v5.3.0-alpha1 (https://getbootstrap.com/)
      * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
      */

    var hasRequiredUtil;

    function requireUtil () {
    	if (hasRequiredUtil) return utilExports;
    	hasRequiredUtil = 1;
    	(function (module, exports) {
    		(function (global, factory) {
    		  factory(exports) ;
    		})(commonjsGlobal, (function (exports) {
    		  /**
    		   * --------------------------------------------------------------------------
    		   * Bootstrap (v5.3.0-alpha1): util/index.js
    		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
    		   * --------------------------------------------------------------------------
    		   */

    		  const MAX_UID = 1000000;
    		  const MILLISECONDS_MULTIPLIER = 1000;
    		  const TRANSITION_END = 'transitionend';

    		  /**
    		   * Properly escape IDs selectors to handle weird IDs
    		   * @param {string} selector
    		   * @returns {string}
    		   */
    		  const parseSelector = selector => {
    		    if (selector && window.CSS && window.CSS.escape) {
    		      // document.querySelector needs escaping to handle IDs (html5+) containing for instance /
    		      selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
    		    }
    		    return selector;
    		  };

    		  // Shout-out Angus Croll (https://goo.gl/pxwQGp)
    		  const toType = object => {
    		    if (object === null || object === undefined) {
    		      return `${object}`;
    		    }
    		    return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
    		  };

    		  /**
    		   * Public Util API
    		   */

    		  const getUID = prefix => {
    		    do {
    		      prefix += Math.floor(Math.random() * MAX_UID);
    		    } while (document.getElementById(prefix));
    		    return prefix;
    		  };
    		  const getTransitionDurationFromElement = element => {
    		    if (!element) {
    		      return 0;
    		    }

    		    // Get transition-duration of the element
    		    let {
    		      transitionDuration,
    		      transitionDelay
    		    } = window.getComputedStyle(element);
    		    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    		    const floatTransitionDelay = Number.parseFloat(transitionDelay);

    		    // Return 0 if element or transition duration is not found
    		    if (!floatTransitionDuration && !floatTransitionDelay) {
    		      return 0;
    		    }

    		    // If multiple durations are defined, take the first
    		    transitionDuration = transitionDuration.split(',')[0];
    		    transitionDelay = transitionDelay.split(',')[0];
    		    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
    		  };
    		  const triggerTransitionEnd = element => {
    		    element.dispatchEvent(new Event(TRANSITION_END));
    		  };
    		  const isElement = object => {
    		    if (!object || typeof object !== 'object') {
    		      return false;
    		    }
    		    if (typeof object.jquery !== 'undefined') {
    		      object = object[0];
    		    }
    		    return typeof object.nodeType !== 'undefined';
    		  };
    		  const getElement = object => {
    		    // it's a jQuery object or a node element
    		    if (isElement(object)) {
    		      return object.jquery ? object[0] : object;
    		    }
    		    if (typeof object === 'string' && object.length > 0) {
    		      return document.querySelector(parseSelector(object));
    		    }
    		    return null;
    		  };
    		  const isVisible = element => {
    		    if (!isElement(element) || element.getClientRects().length === 0) {
    		      return false;
    		    }
    		    const elementIsVisible = getComputedStyle(element).getPropertyValue('visibility') === 'visible';
    		    // Handle `details` element as its content may falsie appear visible when it is closed
    		    const closedDetails = element.closest('details:not([open])');
    		    if (!closedDetails) {
    		      return elementIsVisible;
    		    }
    		    if (closedDetails !== element) {
    		      const summary = element.closest('summary');
    		      if (summary && summary.parentNode !== closedDetails) {
    		        return false;
    		      }
    		      if (summary === null) {
    		        return false;
    		      }
    		    }
    		    return elementIsVisible;
    		  };
    		  const isDisabled = element => {
    		    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    		      return true;
    		    }
    		    if (element.classList.contains('disabled')) {
    		      return true;
    		    }
    		    if (typeof element.disabled !== 'undefined') {
    		      return element.disabled;
    		    }
    		    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
    		  };
    		  const findShadowRoot = element => {
    		    if (!document.documentElement.attachShadow) {
    		      return null;
    		    }

    		    // Can find the shadow root otherwise it'll return the document
    		    if (typeof element.getRootNode === 'function') {
    		      const root = element.getRootNode();
    		      return root instanceof ShadowRoot ? root : null;
    		    }
    		    if (element instanceof ShadowRoot) {
    		      return element;
    		    }

    		    // when we don't find a shadow root
    		    if (!element.parentNode) {
    		      return null;
    		    }
    		    return findShadowRoot(element.parentNode);
    		  };
    		  const noop = () => {};

    		  /**
    		   * Trick to restart an element's animation
    		   *
    		   * @param {HTMLElement} element
    		   * @return void
    		   *
    		   * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
    		   */
    		  const reflow = element => {
    		    element.offsetHeight; // eslint-disable-line no-unused-expressions
    		  };

    		  const getjQuery = () => {
    		    if (window.jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
    		      return window.jQuery;
    		    }
    		    return null;
    		  };
    		  const DOMContentLoadedCallbacks = [];
    		  const onDOMContentLoaded = callback => {
    		    if (document.readyState === 'loading') {
    		      // add listener on the first call when the document is in loading state
    		      if (!DOMContentLoadedCallbacks.length) {
    		        document.addEventListener('DOMContentLoaded', () => {
    		          for (const callback of DOMContentLoadedCallbacks) {
    		            callback();
    		          }
    		        });
    		      }
    		      DOMContentLoadedCallbacks.push(callback);
    		    } else {
    		      callback();
    		    }
    		  };
    		  const isRTL = () => document.documentElement.dir === 'rtl';
    		  const defineJQueryPlugin = plugin => {
    		    onDOMContentLoaded(() => {
    		      const $ = getjQuery();
    		      /* istanbul ignore if */
    		      if ($) {
    		        const name = plugin.NAME;
    		        const JQUERY_NO_CONFLICT = $.fn[name];
    		        $.fn[name] = plugin.jQueryInterface;
    		        $.fn[name].Constructor = plugin;
    		        $.fn[name].noConflict = () => {
    		          $.fn[name] = JQUERY_NO_CONFLICT;
    		          return plugin.jQueryInterface;
    		        };
    		      }
    		    });
    		  };
    		  const execute = (possibleCallback, args = [], defaultValue = possibleCallback) => {
    		    return typeof possibleCallback === 'function' ? possibleCallback(...args) : defaultValue;
    		  };
    		  const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
    		    if (!waitForTransition) {
    		      execute(callback);
    		      return;
    		    }
    		    const durationPadding = 5;
    		    const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
    		    let called = false;
    		    const handler = ({
    		      target
    		    }) => {
    		      if (target !== transitionElement) {
    		        return;
    		      }
    		      called = true;
    		      transitionElement.removeEventListener(TRANSITION_END, handler);
    		      execute(callback);
    		    };
    		    transitionElement.addEventListener(TRANSITION_END, handler);
    		    setTimeout(() => {
    		      if (!called) {
    		        triggerTransitionEnd(transitionElement);
    		      }
    		    }, emulatedDuration);
    		  };

    		  /**
    		   * Return the previous/next element of a list.
    		   *
    		   * @param {array} list    The list of elements
    		   * @param activeElement   The active element
    		   * @param shouldGetNext   Choose to get next or previous element
    		   * @param isCycleAllowed
    		   * @return {Element|elem} The proper element
    		   */
    		  const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
    		    const listLength = list.length;
    		    let index = list.indexOf(activeElement);

    		    // if the element does not exist in the list return an element
    		    // depending on the direction and if cycle is allowed
    		    if (index === -1) {
    		      return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
    		    }
    		    index += shouldGetNext ? 1 : -1;
    		    if (isCycleAllowed) {
    		      index = (index + listLength) % listLength;
    		    }
    		    return list[Math.max(0, Math.min(index, listLength - 1))];
    		  };

    		  exports.defineJQueryPlugin = defineJQueryPlugin;
    		  exports.execute = execute;
    		  exports.executeAfterTransition = executeAfterTransition;
    		  exports.findShadowRoot = findShadowRoot;
    		  exports.getElement = getElement;
    		  exports.getNextActiveElement = getNextActiveElement;
    		  exports.getTransitionDurationFromElement = getTransitionDurationFromElement;
    		  exports.getUID = getUID;
    		  exports.getjQuery = getjQuery;
    		  exports.isDisabled = isDisabled;
    		  exports.isElement = isElement;
    		  exports.isRTL = isRTL;
    		  exports.isVisible = isVisible;
    		  exports.noop = noop;
    		  exports.onDOMContentLoaded = onDOMContentLoaded;
    		  exports.parseSelector = parseSelector;
    		  exports.reflow = reflow;
    		  exports.toType = toType;
    		  exports.triggerTransitionEnd = triggerTransitionEnd;

    		  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

    		}));
    		
    } (util, utilExports));
    	return utilExports;
    }

    var sanitizerExports = {};
    var sanitizer = {
      get exports(){ return sanitizerExports; },
      set exports(v){ sanitizerExports = v; },
    };

    /*!
      * Bootstrap sanitizer.js v5.3.0-alpha1 (https://getbootstrap.com/)
      * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
      */

    var hasRequiredSanitizer;

    function requireSanitizer () {
    	if (hasRequiredSanitizer) return sanitizerExports;
    	hasRequiredSanitizer = 1;
    	(function (module, exports) {
    		(function (global, factory) {
    		  factory(exports) ;
    		})(commonjsGlobal, (function (exports) {
    		  /**
    		   * --------------------------------------------------------------------------
    		   * Bootstrap (v5.3.0-alpha1): util/sanitizer.js
    		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
    		   * --------------------------------------------------------------------------
    		   */

    		  const uriAttributes = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);
    		  const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;

    		  /**
    		   * A pattern that recognizes a commonly useful subset of URLs that are safe.
    		   *
    		   * Shout-out to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
    		   */
    		  const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i;

    		  /**
    		   * A pattern that matches safe data URLs. Only matches image, video and audio types.
    		   *
    		   * Shout-out to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
    		   */
    		  const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;
    		  const allowedAttribute = (attribute, allowedAttributeList) => {
    		    const attributeName = attribute.nodeName.toLowerCase();
    		    if (allowedAttributeList.includes(attributeName)) {
    		      if (uriAttributes.has(attributeName)) {
    		        return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue) || DATA_URL_PATTERN.test(attribute.nodeValue));
    		      }
    		      return true;
    		    }

    		    // Check if a regular expression validates the attribute.
    		    return allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp).some(regex => regex.test(attributeName));
    		  };
    		  const DefaultAllowlist = {
    		    // Global attributes allowed on any supplied element below.
    		    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    		    a: ['target', 'href', 'title', 'rel'],
    		    area: [],
    		    b: [],
    		    br: [],
    		    col: [],
    		    code: [],
    		    div: [],
    		    em: [],
    		    hr: [],
    		    h1: [],
    		    h2: [],
    		    h3: [],
    		    h4: [],
    		    h5: [],
    		    h6: [],
    		    i: [],
    		    img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
    		    li: [],
    		    ol: [],
    		    p: [],
    		    pre: [],
    		    s: [],
    		    small: [],
    		    span: [],
    		    sub: [],
    		    sup: [],
    		    strong: [],
    		    u: [],
    		    ul: []
    		  };
    		  function sanitizeHtml(unsafeHtml, allowList, sanitizeFunction) {
    		    if (!unsafeHtml.length) {
    		      return unsafeHtml;
    		    }
    		    if (sanitizeFunction && typeof sanitizeFunction === 'function') {
    		      return sanitizeFunction(unsafeHtml);
    		    }
    		    const domParser = new window.DOMParser();
    		    const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
    		    const elements = [].concat(...createdDocument.body.querySelectorAll('*'));
    		    for (const element of elements) {
    		      const elementName = element.nodeName.toLowerCase();
    		      if (!Object.keys(allowList).includes(elementName)) {
    		        element.remove();
    		        continue;
    		      }
    		      const attributeList = [].concat(...element.attributes);
    		      const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || []);
    		      for (const attribute of attributeList) {
    		        if (!allowedAttribute(attribute, allowedAttributes)) {
    		          element.removeAttribute(attribute.nodeName);
    		        }
    		      }
    		    }
    		    return createdDocument.body.innerHTML;
    		  }

    		  exports.DefaultAllowlist = DefaultAllowlist;
    		  exports.sanitizeHtml = sanitizeHtml;

    		  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

    		}));
    		
    } (sanitizer, sanitizerExports));
    	return sanitizerExports;
    }

    var eventHandlerExports = {};
    var eventHandler = {
      get exports(){ return eventHandlerExports; },
      set exports(v){ eventHandlerExports = v; },
    };

    /*!
      * Bootstrap event-handler.js v5.3.0-alpha1 (https://getbootstrap.com/)
      * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
      */

    var hasRequiredEventHandler;

    function requireEventHandler () {
    	if (hasRequiredEventHandler) return eventHandlerExports;
    	hasRequiredEventHandler = 1;
    	(function (module, exports) {
    		(function (global, factory) {
    		  module.exports = factory(requireUtil()) ;
    		})(commonjsGlobal, (function (index_js) {
    		  /**
    		   * --------------------------------------------------------------------------
    		   * Bootstrap (v5.3.0-alpha1): dom/event-handler.js
    		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
    		   * --------------------------------------------------------------------------
    		   */

    		  /**
    		   * Constants
    		   */

    		  const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
    		  const stripNameRegex = /\..*/;
    		  const stripUidRegex = /::\d+$/;
    		  const eventRegistry = {}; // Events storage
    		  let uidEvent = 1;
    		  const customEvents = {
    		    mouseenter: 'mouseover',
    		    mouseleave: 'mouseout'
    		  };
    		  const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);

    		  /**
    		   * Private methods
    		   */

    		  function makeEventUid(element, uid) {
    		    return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
    		  }
    		  function getElementEvents(element) {
    		    const uid = makeEventUid(element);
    		    element.uidEvent = uid;
    		    eventRegistry[uid] = eventRegistry[uid] || {};
    		    return eventRegistry[uid];
    		  }
    		  function bootstrapHandler(element, fn) {
    		    return function handler(event) {
    		      hydrateObj(event, {
    		        delegateTarget: element
    		      });
    		      if (handler.oneOff) {
    		        EventHandler.off(element, event.type, fn);
    		      }
    		      return fn.apply(element, [event]);
    		    };
    		  }
    		  function bootstrapDelegationHandler(element, selector, fn) {
    		    return function handler(event) {
    		      const domElements = element.querySelectorAll(selector);
    		      for (let {
    		        target
    		      } = event; target && target !== this; target = target.parentNode) {
    		        for (const domElement of domElements) {
    		          if (domElement !== target) {
    		            continue;
    		          }
    		          hydrateObj(event, {
    		            delegateTarget: target
    		          });
    		          if (handler.oneOff) {
    		            EventHandler.off(element, event.type, selector, fn);
    		          }
    		          return fn.apply(target, [event]);
    		        }
    		      }
    		    };
    		  }
    		  function findHandler(events, callable, delegationSelector = null) {
    		    return Object.values(events).find(event => event.callable === callable && event.delegationSelector === delegationSelector);
    		  }
    		  function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
    		    const isDelegated = typeof handler === 'string';
    		    // todo: tooltip passes `false` instead of selector, so we need to check
    		    const callable = isDelegated ? delegationFunction : handler || delegationFunction;
    		    let typeEvent = getTypeEvent(originalTypeEvent);
    		    if (!nativeEvents.has(typeEvent)) {
    		      typeEvent = originalTypeEvent;
    		    }
    		    return [isDelegated, callable, typeEvent];
    		  }
    		  function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
    		    if (typeof originalTypeEvent !== 'string' || !element) {
    		      return;
    		    }
    		    let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);

    		    // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
    		    // this prevents the handler from being dispatched the same way as mouseover or mouseout does
    		    if (originalTypeEvent in customEvents) {
    		      const wrapFunction = fn => {
    		        return function (event) {
    		          if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
    		            return fn.call(this, event);
    		          }
    		        };
    		      };
    		      callable = wrapFunction(callable);
    		    }
    		    const events = getElementEvents(element);
    		    const handlers = events[typeEvent] || (events[typeEvent] = {});
    		    const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
    		    if (previousFunction) {
    		      previousFunction.oneOff = previousFunction.oneOff && oneOff;
    		      return;
    		    }
    		    const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ''));
    		    const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
    		    fn.delegationSelector = isDelegated ? handler : null;
    		    fn.callable = callable;
    		    fn.oneOff = oneOff;
    		    fn.uidEvent = uid;
    		    handlers[uid] = fn;
    		    element.addEventListener(typeEvent, fn, isDelegated);
    		  }
    		  function removeHandler(element, events, typeEvent, handler, delegationSelector) {
    		    const fn = findHandler(events[typeEvent], handler, delegationSelector);
    		    if (!fn) {
    		      return;
    		    }
    		    element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
    		    delete events[typeEvent][fn.uidEvent];
    		  }
    		  function removeNamespacedHandlers(element, events, typeEvent, namespace) {
    		    const storeElementEvent = events[typeEvent] || {};
    		    for (const [handlerKey, event] of Object.entries(storeElementEvent)) {
    		      if (handlerKey.includes(namespace)) {
    		        removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
    		      }
    		    }
    		  }
    		  function getTypeEvent(event) {
    		    // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
    		    event = event.replace(stripNameRegex, '');
    		    return customEvents[event] || event;
    		  }
    		  const EventHandler = {
    		    on(element, event, handler, delegationFunction) {
    		      addHandler(element, event, handler, delegationFunction, false);
    		    },
    		    one(element, event, handler, delegationFunction) {
    		      addHandler(element, event, handler, delegationFunction, true);
    		    },
    		    off(element, originalTypeEvent, handler, delegationFunction) {
    		      if (typeof originalTypeEvent !== 'string' || !element) {
    		        return;
    		      }
    		      const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
    		      const inNamespace = typeEvent !== originalTypeEvent;
    		      const events = getElementEvents(element);
    		      const storeElementEvent = events[typeEvent] || {};
    		      const isNamespace = originalTypeEvent.startsWith('.');
    		      if (typeof callable !== 'undefined') {
    		        // Simplest case: handler is passed, remove that listener ONLY.
    		        if (!Object.keys(storeElementEvent).length) {
    		          return;
    		        }
    		        removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
    		        return;
    		      }
    		      if (isNamespace) {
    		        for (const elementEvent of Object.keys(events)) {
    		          removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
    		        }
    		      }
    		      for (const [keyHandlers, event] of Object.entries(storeElementEvent)) {
    		        const handlerKey = keyHandlers.replace(stripUidRegex, '');
    		        if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
    		          removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
    		        }
    		      }
    		    },
    		    trigger(element, event, args) {
    		      if (typeof event !== 'string' || !element) {
    		        return null;
    		      }
    		      const $ = index_js.getjQuery();
    		      const typeEvent = getTypeEvent(event);
    		      const inNamespace = event !== typeEvent;
    		      let jQueryEvent = null;
    		      let bubbles = true;
    		      let nativeDispatch = true;
    		      let defaultPrevented = false;
    		      if (inNamespace && $) {
    		        jQueryEvent = $.Event(event, args);
    		        $(element).trigger(jQueryEvent);
    		        bubbles = !jQueryEvent.isPropagationStopped();
    		        nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
    		        defaultPrevented = jQueryEvent.isDefaultPrevented();
    		      }
    		      let evt = new Event(event, {
    		        bubbles,
    		        cancelable: true
    		      });
    		      evt = hydrateObj(evt, args);
    		      if (defaultPrevented) {
    		        evt.preventDefault();
    		      }
    		      if (nativeDispatch) {
    		        element.dispatchEvent(evt);
    		      }
    		      if (evt.defaultPrevented && jQueryEvent) {
    		        jQueryEvent.preventDefault();
    		      }
    		      return evt;
    		    }
    		  };
    		  function hydrateObj(obj, meta = {}) {
    		    for (const [key, value] of Object.entries(meta)) {
    		      try {
    		        obj[key] = value;
    		      } catch (_unused) {
    		        Object.defineProperty(obj, key, {
    		          configurable: true,
    		          get() {
    		            return value;
    		          }
    		        });
    		      }
    		    }
    		    return obj;
    		  }

    		  return EventHandler;

    		}));
    		
    } (eventHandler));
    	return eventHandlerExports;
    }

    var manipulatorExports = {};
    var manipulator = {
      get exports(){ return manipulatorExports; },
      set exports(v){ manipulatorExports = v; },
    };

    /*!
      * Bootstrap manipulator.js v5.3.0-alpha1 (https://getbootstrap.com/)
      * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
      */

    var hasRequiredManipulator;

    function requireManipulator () {
    	if (hasRequiredManipulator) return manipulatorExports;
    	hasRequiredManipulator = 1;
    	(function (module, exports) {
    		(function (global, factory) {
    		  module.exports = factory() ;
    		})(commonjsGlobal, (function () {
    		  /**
    		   * --------------------------------------------------------------------------
    		   * Bootstrap (v5.3.0-alpha1): dom/manipulator.js
    		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
    		   * --------------------------------------------------------------------------
    		   */

    		  function normalizeData(value) {
    		    if (value === 'true') {
    		      return true;
    		    }
    		    if (value === 'false') {
    		      return false;
    		    }
    		    if (value === Number(value).toString()) {
    		      return Number(value);
    		    }
    		    if (value === '' || value === 'null') {
    		      return null;
    		    }
    		    if (typeof value !== 'string') {
    		      return value;
    		    }
    		    try {
    		      return JSON.parse(decodeURIComponent(value));
    		    } catch (_unused) {
    		      return value;
    		    }
    		  }
    		  function normalizeDataKey(key) {
    		    return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
    		  }
    		  const Manipulator = {
    		    setDataAttribute(element, key, value) {
    		      element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
    		    },
    		    removeDataAttribute(element, key) {
    		      element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
    		    },
    		    getDataAttributes(element) {
    		      if (!element) {
    		        return {};
    		      }
    		      const attributes = {};
    		      const bsKeys = Object.keys(element.dataset).filter(key => key.startsWith('bs') && !key.startsWith('bsConfig'));
    		      for (const key of bsKeys) {
    		        let pureKey = key.replace(/^bs/, '');
    		        pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
    		        attributes[pureKey] = normalizeData(element.dataset[key]);
    		      }
    		      return attributes;
    		    },
    		    getDataAttribute(element, key) {
    		      return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
    		    }
    		  };

    		  return Manipulator;

    		}));
    		
    } (manipulator));
    	return manipulatorExports;
    }

    var baseComponentExports = {};
    var baseComponent = {
      get exports(){ return baseComponentExports; },
      set exports(v){ baseComponentExports = v; },
    };

    var dataExports = {};
    var data = {
      get exports(){ return dataExports; },
      set exports(v){ dataExports = v; },
    };

    /*!
      * Bootstrap data.js v5.3.0-alpha1 (https://getbootstrap.com/)
      * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
      */

    var hasRequiredData;

    function requireData () {
    	if (hasRequiredData) return dataExports;
    	hasRequiredData = 1;
    	(function (module, exports) {
    		(function (global, factory) {
    		  module.exports = factory() ;
    		})(commonjsGlobal, (function () {
    		  /**
    		   * --------------------------------------------------------------------------
    		   * Bootstrap (v5.3.0-alpha1): dom/data.js
    		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
    		   * --------------------------------------------------------------------------
    		   */

    		  /**
    		   * Constants
    		   */

    		  const elementMap = new Map();
    		  const data = {
    		    set(element, key, instance) {
    		      if (!elementMap.has(element)) {
    		        elementMap.set(element, new Map());
    		      }
    		      const instanceMap = elementMap.get(element);

    		      // make it clear we only want one instance per element
    		      // can be removed later when multiple key/instances are fine to be used
    		      if (!instanceMap.has(key) && instanceMap.size !== 0) {
    		        // eslint-disable-next-line no-console
    		        console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
    		        return;
    		      }
    		      instanceMap.set(key, instance);
    		    },
    		    get(element, key) {
    		      if (elementMap.has(element)) {
    		        return elementMap.get(element).get(key) || null;
    		      }
    		      return null;
    		    },
    		    remove(element, key) {
    		      if (!elementMap.has(element)) {
    		        return;
    		      }
    		      const instanceMap = elementMap.get(element);
    		      instanceMap.delete(key);

    		      // free up element references if there are no instances left for an element
    		      if (instanceMap.size === 0) {
    		        elementMap.delete(element);
    		      }
    		    }
    		  };

    		  return data;

    		}));
    		
    } (data));
    	return dataExports;
    }

    var configExports = {};
    var config = {
      get exports(){ return configExports; },
      set exports(v){ configExports = v; },
    };

    /*!
      * Bootstrap config.js v5.3.0-alpha1 (https://getbootstrap.com/)
      * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
      */

    var hasRequiredConfig;

    function requireConfig () {
    	if (hasRequiredConfig) return configExports;
    	hasRequiredConfig = 1;
    	(function (module, exports) {
    		(function (global, factory) {
    		  module.exports = factory(requireUtil(), requireManipulator()) ;
    		})(commonjsGlobal, (function (index_js, Manipulator) {
    		  /**
    		   * --------------------------------------------------------------------------
    		   * Bootstrap (v5.3.0-alpha1): util/config.js
    		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
    		   * --------------------------------------------------------------------------
    		   */

    		  /**
    		   * Class definition
    		   */

    		  class Config {
    		    // Getters
    		    static get Default() {
    		      return {};
    		    }
    		    static get DefaultType() {
    		      return {};
    		    }
    		    static get NAME() {
    		      throw new Error('You have to implement the static method "NAME", for each component!');
    		    }
    		    _getConfig(config) {
    		      config = this._mergeConfigObj(config);
    		      config = this._configAfterMerge(config);
    		      this._typeCheckConfig(config);
    		      return config;
    		    }
    		    _configAfterMerge(config) {
    		      return config;
    		    }
    		    _mergeConfigObj(config, element) {
    		      const jsonConfig = index_js.isElement(element) ? Manipulator.getDataAttribute(element, 'config') : {}; // try to parse

    		      return {
    		        ...this.constructor.Default,
    		        ...(typeof jsonConfig === 'object' ? jsonConfig : {}),
    		        ...(index_js.isElement(element) ? Manipulator.getDataAttributes(element) : {}),
    		        ...(typeof config === 'object' ? config : {})
    		      };
    		    }
    		    _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
    		      for (const [property, expectedTypes] of Object.entries(configTypes)) {
    		        const value = config[property];
    		        const valueType = index_js.isElement(value) ? 'element' : index_js.toType(value);
    		        if (!new RegExp(expectedTypes).test(valueType)) {
    		          throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
    		        }
    		      }
    		    }
    		  }

    		  return Config;

    		}));
    		
    } (config));
    	return configExports;
    }

    /*!
      * Bootstrap base-component.js v5.3.0-alpha1 (https://getbootstrap.com/)
      * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
      */

    var hasRequiredBaseComponent;

    function requireBaseComponent () {
    	if (hasRequiredBaseComponent) return baseComponentExports;
    	hasRequiredBaseComponent = 1;
    	(function (module, exports) {
    		(function (global, factory) {
    		  module.exports = factory(requireData(), requireUtil(), requireEventHandler(), requireConfig()) ;
    		})(commonjsGlobal, (function (Data, index_js, EventHandler, Config) {
    		  /**
    		   * --------------------------------------------------------------------------
    		   * Bootstrap (v5.3.0-alpha1): base-component.js
    		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
    		   * --------------------------------------------------------------------------
    		   */

    		  /**
    		   * Constants
    		   */

    		  const VERSION = '5.3.0-alpha1';

    		  /**
    		   * Class definition
    		   */

    		  class BaseComponent extends Config {
    		    constructor(element, config) {
    		      super();
    		      element = index_js.getElement(element);
    		      if (!element) {
    		        return;
    		      }
    		      this._element = element;
    		      this._config = this._getConfig(config);
    		      Data.set(this._element, this.constructor.DATA_KEY, this);
    		    }

    		    // Public
    		    dispose() {
    		      Data.remove(this._element, this.constructor.DATA_KEY);
    		      EventHandler.off(this._element, this.constructor.EVENT_KEY);
    		      for (const propertyName of Object.getOwnPropertyNames(this)) {
    		        this[propertyName] = null;
    		      }
    		    }
    		    _queueCallback(callback, element, isAnimated = true) {
    		      index_js.executeAfterTransition(callback, element, isAnimated);
    		    }
    		    _getConfig(config) {
    		      config = this._mergeConfigObj(config, this._element);
    		      config = this._configAfterMerge(config);
    		      this._typeCheckConfig(config);
    		      return config;
    		    }

    		    // Static
    		    static getInstance(element) {
    		      return Data.get(index_js.getElement(element), this.DATA_KEY);
    		    }
    		    static getOrCreateInstance(element, config = {}) {
    		      return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
    		    }
    		    static get VERSION() {
    		      return VERSION;
    		    }
    		    static get DATA_KEY() {
    		      return `bs.${this.NAME}`;
    		    }
    		    static get EVENT_KEY() {
    		      return `.${this.DATA_KEY}`;
    		    }
    		    static eventName(name) {
    		      return `${name}${this.EVENT_KEY}`;
    		    }
    		  }

    		  return BaseComponent;

    		}));
    		
    } (baseComponent));
    	return baseComponentExports;
    }

    var templateFactoryExports = {};
    var templateFactory = {
      get exports(){ return templateFactoryExports; },
      set exports(v){ templateFactoryExports = v; },
    };

    var selectorEngineExports = {};
    var selectorEngine = {
      get exports(){ return selectorEngineExports; },
      set exports(v){ selectorEngineExports = v; },
    };

    /*!
      * Bootstrap selector-engine.js v5.3.0-alpha1 (https://getbootstrap.com/)
      * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
      */

    var hasRequiredSelectorEngine;

    function requireSelectorEngine () {
    	if (hasRequiredSelectorEngine) return selectorEngineExports;
    	hasRequiredSelectorEngine = 1;
    	(function (module, exports) {
    		(function (global, factory) {
    		  module.exports = factory(requireUtil()) ;
    		})(commonjsGlobal, (function (index_js) {
    		  /**
    		   * --------------------------------------------------------------------------
    		   * Bootstrap (v5.3.0-alpha1): dom/selector-engine.js
    		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
    		   * --------------------------------------------------------------------------
    		   */
    		  const getSelector = element => {
    		    let selector = element.getAttribute('data-bs-target');
    		    if (!selector || selector === '#') {
    		      let hrefAttribute = element.getAttribute('href');

    		      // The only valid content that could double as a selector are IDs or classes,
    		      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
    		      // `document.querySelector` will rightfully complain it is invalid.
    		      // See https://github.com/twbs/bootstrap/issues/32273
    		      if (!hrefAttribute || !hrefAttribute.includes('#') && !hrefAttribute.startsWith('.')) {
    		        return null;
    		      }

    		      // Just in case some CMS puts out a full URL with the anchor appended
    		      if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
    		        hrefAttribute = `#${hrefAttribute.split('#')[1]}`;
    		      }
    		      selector = hrefAttribute && hrefAttribute !== '#' ? hrefAttribute.trim() : null;
    		    }
    		    return index_js.parseSelector(selector);
    		  };
    		  const SelectorEngine = {
    		    find(selector, element = document.documentElement) {
    		      return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
    		    },
    		    findOne(selector, element = document.documentElement) {
    		      return Element.prototype.querySelector.call(element, selector);
    		    },
    		    children(element, selector) {
    		      return [].concat(...element.children).filter(child => child.matches(selector));
    		    },
    		    parents(element, selector) {
    		      const parents = [];
    		      let ancestor = element.parentNode.closest(selector);
    		      while (ancestor) {
    		        parents.push(ancestor);
    		        ancestor = ancestor.parentNode.closest(selector);
    		      }
    		      return parents;
    		    },
    		    prev(element, selector) {
    		      let previous = element.previousElementSibling;
    		      while (previous) {
    		        if (previous.matches(selector)) {
    		          return [previous];
    		        }
    		        previous = previous.previousElementSibling;
    		      }
    		      return [];
    		    },
    		    // TODO: this is now unused; remove later along with prev()
    		    next(element, selector) {
    		      let next = element.nextElementSibling;
    		      while (next) {
    		        if (next.matches(selector)) {
    		          return [next];
    		        }
    		        next = next.nextElementSibling;
    		      }
    		      return [];
    		    },
    		    focusableChildren(element) {
    		      const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(',');
    		      return this.find(focusables, element).filter(el => !index_js.isDisabled(el) && index_js.isVisible(el));
    		    },
    		    getSelectorFromElement(element) {
    		      const selector = getSelector(element);
    		      if (selector) {
    		        return SelectorEngine.findOne(selector) ? selector : null;
    		      }
    		      return null;
    		    },
    		    getElementFromSelector(element) {
    		      const selector = getSelector(element);
    		      return selector ? SelectorEngine.findOne(selector) : null;
    		    },
    		    getMultipleElementsFromSelector(element) {
    		      const selector = getSelector(element);
    		      return selector ? SelectorEngine.find(selector) : [];
    		    }
    		  };

    		  return SelectorEngine;

    		}));
    		
    } (selectorEngine));
    	return selectorEngineExports;
    }

    /*!
      * Bootstrap template-factory.js v5.3.0-alpha1 (https://getbootstrap.com/)
      * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
      */

    var hasRequiredTemplateFactory;

    function requireTemplateFactory () {
    	if (hasRequiredTemplateFactory) return templateFactoryExports;
    	hasRequiredTemplateFactory = 1;
    	(function (module, exports) {
    		(function (global, factory) {
    		  module.exports = factory(requireSanitizer(), requireUtil(), requireSelectorEngine(), requireConfig()) ;
    		})(commonjsGlobal, (function (sanitizer_js, index_js, SelectorEngine, Config) {
    		  /**
    		   * --------------------------------------------------------------------------
    		   * Bootstrap (v5.3.0-alpha1): util/template-factory.js
    		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
    		   * --------------------------------------------------------------------------
    		   */

    		  /**
    		   * Constants
    		   */

    		  const NAME = 'TemplateFactory';
    		  const Default = {
    		    allowList: sanitizer_js.DefaultAllowlist,
    		    content: {},
    		    // { selector : text ,  selector2 : text2 , }
    		    extraClass: '',
    		    html: false,
    		    sanitize: true,
    		    sanitizeFn: null,
    		    template: '<div></div>'
    		  };
    		  const DefaultType = {
    		    allowList: 'object',
    		    content: 'object',
    		    extraClass: '(string|function)',
    		    html: 'boolean',
    		    sanitize: 'boolean',
    		    sanitizeFn: '(null|function)',
    		    template: 'string'
    		  };
    		  const DefaultContentType = {
    		    entry: '(string|element|function|null)',
    		    selector: '(string|element)'
    		  };

    		  /**
    		   * Class definition
    		   */

    		  class TemplateFactory extends Config {
    		    constructor(config) {
    		      super();
    		      this._config = this._getConfig(config);
    		    }

    		    // Getters
    		    static get Default() {
    		      return Default;
    		    }
    		    static get DefaultType() {
    		      return DefaultType;
    		    }
    		    static get NAME() {
    		      return NAME;
    		    }

    		    // Public
    		    getContent() {
    		      return Object.values(this._config.content).map(config => this._resolvePossibleFunction(config)).filter(Boolean);
    		    }
    		    hasContent() {
    		      return this.getContent().length > 0;
    		    }
    		    changeContent(content) {
    		      this._checkContent(content);
    		      this._config.content = {
    		        ...this._config.content,
    		        ...content
    		      };
    		      return this;
    		    }
    		    toHtml() {
    		      const templateWrapper = document.createElement('div');
    		      templateWrapper.innerHTML = this._maybeSanitize(this._config.template);
    		      for (const [selector, text] of Object.entries(this._config.content)) {
    		        this._setContent(templateWrapper, text, selector);
    		      }
    		      const template = templateWrapper.children[0];
    		      const extraClass = this._resolvePossibleFunction(this._config.extraClass);
    		      if (extraClass) {
    		        template.classList.add(...extraClass.split(' '));
    		      }
    		      return template;
    		    }

    		    // Private
    		    _typeCheckConfig(config) {
    		      super._typeCheckConfig(config);
    		      this._checkContent(config.content);
    		    }
    		    _checkContent(arg) {
    		      for (const [selector, content] of Object.entries(arg)) {
    		        super._typeCheckConfig({
    		          selector,
    		          entry: content
    		        }, DefaultContentType);
    		      }
    		    }
    		    _setContent(template, content, selector) {
    		      const templateElement = SelectorEngine.findOne(selector, template);
    		      if (!templateElement) {
    		        return;
    		      }
    		      content = this._resolvePossibleFunction(content);
    		      if (!content) {
    		        templateElement.remove();
    		        return;
    		      }
    		      if (index_js.isElement(content)) {
    		        this._putElementInTemplate(index_js.getElement(content), templateElement);
    		        return;
    		      }
    		      if (this._config.html) {
    		        templateElement.innerHTML = this._maybeSanitize(content);
    		        return;
    		      }
    		      templateElement.textContent = content;
    		    }
    		    _maybeSanitize(arg) {
    		      return this._config.sanitize ? sanitizer_js.sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg;
    		    }
    		    _resolvePossibleFunction(arg) {
    		      return index_js.execute(arg, [this]);
    		    }
    		    _putElementInTemplate(element, templateElement) {
    		      if (this._config.html) {
    		        templateElement.innerHTML = '';
    		        templateElement.append(element);
    		        return;
    		      }
    		      templateElement.textContent = element.textContent;
    		    }
    		  }

    		  return TemplateFactory;

    		}));
    		
    } (templateFactory));
    	return templateFactoryExports;
    }

    /*!
      * Bootstrap tooltip.js v5.3.0-alpha1 (https://getbootstrap.com/)
      * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
      */

    (function (module, exports) {
    	(function (global, factory) {
    	  module.exports = factory(require$$0, requireUtil(), requireSanitizer(), requireEventHandler(), requireManipulator(), requireBaseComponent(), requireTemplateFactory()) ;
    	})(commonjsGlobal, (function (Popper, index_js, sanitizer_js, EventHandler, Manipulator, BaseComponent, TemplateFactory) {
    	  function _interopNamespaceDefault(e) {
    	    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    	    if (e) {
    	      for (const k in e) {
    	        if (k !== 'default') {
    	          const d = Object.getOwnPropertyDescriptor(e, k);
    	          Object.defineProperty(n, k, d.get ? d : {
    	            enumerable: true,
    	            get: () => e[k]
    	          });
    	        }
    	      }
    	    }
    	    n.default = e;
    	    return Object.freeze(n);
    	  }

    	  const Popper__namespace = /*#__PURE__*/_interopNamespaceDefault(Popper);

    	  /**
    	   * --------------------------------------------------------------------------
    	   * Bootstrap (v5.3.0-alpha1): tooltip.js
    	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
    	   * --------------------------------------------------------------------------
    	   */

    	  /**
    	   * Constants
    	   */

    	  const NAME = 'tooltip';
    	  const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
    	  const CLASS_NAME_FADE = 'fade';
    	  const CLASS_NAME_MODAL = 'modal';
    	  const CLASS_NAME_SHOW = 'show';
    	  const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
    	  const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
    	  const EVENT_MODAL_HIDE = 'hide.bs.modal';
    	  const TRIGGER_HOVER = 'hover';
    	  const TRIGGER_FOCUS = 'focus';
    	  const TRIGGER_CLICK = 'click';
    	  const TRIGGER_MANUAL = 'manual';
    	  const EVENT_HIDE = 'hide';
    	  const EVENT_HIDDEN = 'hidden';
    	  const EVENT_SHOW = 'show';
    	  const EVENT_SHOWN = 'shown';
    	  const EVENT_INSERTED = 'inserted';
    	  const EVENT_CLICK = 'click';
    	  const EVENT_FOCUSIN = 'focusin';
    	  const EVENT_FOCUSOUT = 'focusout';
    	  const EVENT_MOUSEENTER = 'mouseenter';
    	  const EVENT_MOUSELEAVE = 'mouseleave';
    	  const AttachmentMap = {
    	    AUTO: 'auto',
    	    TOP: 'top',
    	    RIGHT: index_js.isRTL() ? 'left' : 'right',
    	    BOTTOM: 'bottom',
    	    LEFT: index_js.isRTL() ? 'right' : 'left'
    	  };
    	  const Default = {
    	    allowList: sanitizer_js.DefaultAllowlist,
    	    animation: true,
    	    boundary: 'clippingParents',
    	    container: false,
    	    customClass: '',
    	    delay: 0,
    	    fallbackPlacements: ['top', 'right', 'bottom', 'left'],
    	    html: false,
    	    offset: [0, 0],
    	    placement: 'top',
    	    popperConfig: null,
    	    sanitize: true,
    	    sanitizeFn: null,
    	    selector: false,
    	    template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
    	    title: '',
    	    trigger: 'hover focus'
    	  };
    	  const DefaultType = {
    	    allowList: 'object',
    	    animation: 'boolean',
    	    boundary: '(string|element)',
    	    container: '(string|element|boolean)',
    	    customClass: '(string|function)',
    	    delay: '(number|object)',
    	    fallbackPlacements: 'array',
    	    html: 'boolean',
    	    offset: '(array|string|function)',
    	    placement: '(string|function)',
    	    popperConfig: '(null|object|function)',
    	    sanitize: 'boolean',
    	    sanitizeFn: '(null|function)',
    	    selector: '(string|boolean)',
    	    template: 'string',
    	    title: '(string|element|function)',
    	    trigger: 'string'
    	  };

    	  /**
    	   * Class definition
    	   */

    	  class Tooltip extends BaseComponent {
    	    constructor(element, config) {
    	      if (typeof Popper__namespace === 'undefined') {
    	        throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
    	      }
    	      super(element, config);

    	      // Private
    	      this._isEnabled = true;
    	      this._timeout = 0;
    	      this._isHovered = null;
    	      this._activeTrigger = {};
    	      this._popper = null;
    	      this._templateFactory = null;
    	      this._newContent = null;

    	      // Protected
    	      this.tip = null;
    	      this._setListeners();
    	      if (!this._config.selector) {
    	        this._fixTitle();
    	      }
    	    }

    	    // Getters
    	    static get Default() {
    	      return Default;
    	    }
    	    static get DefaultType() {
    	      return DefaultType;
    	    }
    	    static get NAME() {
    	      return NAME;
    	    }

    	    // Public
    	    enable() {
    	      this._isEnabled = true;
    	    }
    	    disable() {
    	      this._isEnabled = false;
    	    }
    	    toggleEnabled() {
    	      this._isEnabled = !this._isEnabled;
    	    }
    	    toggle() {
    	      if (!this._isEnabled) {
    	        return;
    	      }
    	      this._activeTrigger.click = !this._activeTrigger.click;
    	      if (this._isShown()) {
    	        this._leave();
    	        return;
    	      }
    	      this._enter();
    	    }
    	    dispose() {
    	      clearTimeout(this._timeout);
    	      EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
    	      if (this._element.getAttribute('data-bs-original-title')) {
    	        this._element.setAttribute('title', this._element.getAttribute('data-bs-original-title'));
    	      }
    	      this._disposePopper();
    	      super.dispose();
    	    }
    	    show() {
    	      if (this._element.style.display === 'none') {
    	        throw new Error('Please use show on visible elements');
    	      }
    	      if (!(this._isWithContent() && this._isEnabled)) {
    	        return;
    	      }
    	      const showEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOW));
    	      const shadowRoot = index_js.findShadowRoot(this._element);
    	      const isInTheDom = (shadowRoot || this._element.ownerDocument.documentElement).contains(this._element);
    	      if (showEvent.defaultPrevented || !isInTheDom) {
    	        return;
    	      }

    	      // todo v6 remove this OR make it optional
    	      this._disposePopper();
    	      const tip = this._getTipElement();
    	      this._element.setAttribute('aria-describedby', tip.getAttribute('id'));
    	      const {
    	        container
    	      } = this._config;
    	      if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
    	        container.append(tip);
    	        EventHandler.trigger(this._element, this.constructor.eventName(EVENT_INSERTED));
    	      }
    	      this._popper = this._createPopper(tip);
    	      tip.classList.add(CLASS_NAME_SHOW);

    	      // If this is a touch-enabled device we add extra
    	      // empty mouseover listeners to the body's immediate children;
    	      // only needed because of broken event delegation on iOS
    	      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    	      if ('ontouchstart' in document.documentElement) {
    	        for (const element of [].concat(...document.body.children)) {
    	          EventHandler.on(element, 'mouseover', index_js.noop);
    	        }
    	      }
    	      const complete = () => {
    	        EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOWN));
    	        if (this._isHovered === false) {
    	          this._leave();
    	        }
    	        this._isHovered = false;
    	      };
    	      this._queueCallback(complete, this.tip, this._isAnimated());
    	    }
    	    hide() {
    	      if (!this._isShown()) {
    	        return;
    	      }
    	      const hideEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDE));
    	      if (hideEvent.defaultPrevented) {
    	        return;
    	      }
    	      const tip = this._getTipElement();
    	      tip.classList.remove(CLASS_NAME_SHOW);

    	      // If this is a touch-enabled device we remove the extra
    	      // empty mouseover listeners we added for iOS support
    	      if ('ontouchstart' in document.documentElement) {
    	        for (const element of [].concat(...document.body.children)) {
    	          EventHandler.off(element, 'mouseover', index_js.noop);
    	        }
    	      }
    	      this._activeTrigger[TRIGGER_CLICK] = false;
    	      this._activeTrigger[TRIGGER_FOCUS] = false;
    	      this._activeTrigger[TRIGGER_HOVER] = false;
    	      this._isHovered = null; // it is a trick to support manual triggering

    	      const complete = () => {
    	        if (this._isWithActiveTrigger()) {
    	          return;
    	        }
    	        if (!this._isHovered) {
    	          this._disposePopper();
    	        }
    	        this._element.removeAttribute('aria-describedby');
    	        EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDDEN));
    	      };
    	      this._queueCallback(complete, this.tip, this._isAnimated());
    	    }
    	    update() {
    	      if (this._popper) {
    	        this._popper.update();
    	      }
    	    }

    	    // Protected
    	    _isWithContent() {
    	      return Boolean(this._getTitle());
    	    }
    	    _getTipElement() {
    	      if (!this.tip) {
    	        this.tip = this._createTipElement(this._newContent || this._getContentForTemplate());
    	      }
    	      return this.tip;
    	    }
    	    _createTipElement(content) {
    	      const tip = this._getTemplateFactory(content).toHtml();

    	      // todo: remove this check on v6
    	      if (!tip) {
    	        return null;
    	      }
    	      tip.classList.remove(CLASS_NAME_FADE, CLASS_NAME_SHOW);
    	      // todo: on v6 the following can be achieved with CSS only
    	      tip.classList.add(`bs-${this.constructor.NAME}-auto`);
    	      const tipId = index_js.getUID(this.constructor.NAME).toString();
    	      tip.setAttribute('id', tipId);
    	      if (this._isAnimated()) {
    	        tip.classList.add(CLASS_NAME_FADE);
    	      }
    	      return tip;
    	    }
    	    setContent(content) {
    	      this._newContent = content;
    	      if (this._isShown()) {
    	        this._disposePopper();
    	        this.show();
    	      }
    	    }
    	    _getTemplateFactory(content) {
    	      if (this._templateFactory) {
    	        this._templateFactory.changeContent(content);
    	      } else {
    	        this._templateFactory = new TemplateFactory({
    	          ...this._config,
    	          // the `content` var has to be after `this._config`
    	          // to override config.content in case of popover
    	          content,
    	          extraClass: this._resolvePossibleFunction(this._config.customClass)
    	        });
    	      }
    	      return this._templateFactory;
    	    }
    	    _getContentForTemplate() {
    	      return {
    	        [SELECTOR_TOOLTIP_INNER]: this._getTitle()
    	      };
    	    }
    	    _getTitle() {
    	      return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute('data-bs-original-title');
    	    }

    	    // Private
    	    _initializeOnDelegatedTarget(event) {
    	      return this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
    	    }
    	    _isAnimated() {
    	      return this._config.animation || this.tip && this.tip.classList.contains(CLASS_NAME_FADE);
    	    }
    	    _isShown() {
    	      return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW);
    	    }
    	    _createPopper(tip) {
    	      const placement = index_js.execute(this._config.placement, [this, tip, this._element]);
    	      const attachment = AttachmentMap[placement.toUpperCase()];
    	      return Popper__namespace.createPopper(this._element, tip, this._getPopperConfig(attachment));
    	    }
    	    _getOffset() {
    	      const {
    	        offset
    	      } = this._config;
    	      if (typeof offset === 'string') {
    	        return offset.split(',').map(value => Number.parseInt(value, 10));
    	      }
    	      if (typeof offset === 'function') {
    	        return popperData => offset(popperData, this._element);
    	      }
    	      return offset;
    	    }
    	    _resolvePossibleFunction(arg) {
    	      return index_js.execute(arg, [this._element]);
    	    }
    	    _getPopperConfig(attachment) {
    	      const defaultBsPopperConfig = {
    	        placement: attachment,
    	        modifiers: [{
    	          name: 'flip',
    	          options: {
    	            fallbackPlacements: this._config.fallbackPlacements
    	          }
    	        }, {
    	          name: 'offset',
    	          options: {
    	            offset: this._getOffset()
    	          }
    	        }, {
    	          name: 'preventOverflow',
    	          options: {
    	            boundary: this._config.boundary
    	          }
    	        }, {
    	          name: 'arrow',
    	          options: {
    	            element: `.${this.constructor.NAME}-arrow`
    	          }
    	        }, {
    	          name: 'preSetPlacement',
    	          enabled: true,
    	          phase: 'beforeMain',
    	          fn: data => {
    	            // Pre-set Popper's placement attribute in order to read the arrow sizes properly.
    	            // Otherwise, Popper mixes up the width and height dimensions since the initial arrow style is for top placement
    	            this._getTipElement().setAttribute('data-popper-placement', data.state.placement);
    	          }
    	        }]
    	      };
    	      return {
    	        ...defaultBsPopperConfig,
    	        ...index_js.execute(this._config.popperConfig, [defaultBsPopperConfig])
    	      };
    	    }
    	    _setListeners() {
    	      const triggers = this._config.trigger.split(' ');
    	      for (const trigger of triggers) {
    	        if (trigger === 'click') {
    	          EventHandler.on(this._element, this.constructor.eventName(EVENT_CLICK), this._config.selector, event => {
    	            const context = this._initializeOnDelegatedTarget(event);
    	            context.toggle();
    	          });
    	        } else if (trigger !== TRIGGER_MANUAL) {
    	          const eventIn = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSEENTER) : this.constructor.eventName(EVENT_FOCUSIN);
    	          const eventOut = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSELEAVE) : this.constructor.eventName(EVENT_FOCUSOUT);
    	          EventHandler.on(this._element, eventIn, this._config.selector, event => {
    	            const context = this._initializeOnDelegatedTarget(event);
    	            context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
    	            context._enter();
    	          });
    	          EventHandler.on(this._element, eventOut, this._config.selector, event => {
    	            const context = this._initializeOnDelegatedTarget(event);
    	            context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
    	            context._leave();
    	          });
    	        }
    	      }
    	      this._hideModalHandler = () => {
    	        if (this._element) {
    	          this.hide();
    	        }
    	      };
    	      EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
    	    }
    	    _fixTitle() {
    	      const title = this._element.getAttribute('title');
    	      if (!title) {
    	        return;
    	      }
    	      if (!this._element.getAttribute('aria-label') && !this._element.textContent.trim()) {
    	        this._element.setAttribute('aria-label', title);
    	      }
    	      this._element.setAttribute('data-bs-original-title', title); // DO NOT USE IT. Is only for backwards compatibility
    	      this._element.removeAttribute('title');
    	    }
    	    _enter() {
    	      if (this._isShown() || this._isHovered) {
    	        this._isHovered = true;
    	        return;
    	      }
    	      this._isHovered = true;
    	      this._setTimeout(() => {
    	        if (this._isHovered) {
    	          this.show();
    	        }
    	      }, this._config.delay.show);
    	    }
    	    _leave() {
    	      if (this._isWithActiveTrigger()) {
    	        return;
    	      }
    	      this._isHovered = false;
    	      this._setTimeout(() => {
    	        if (!this._isHovered) {
    	          this.hide();
    	        }
    	      }, this._config.delay.hide);
    	    }
    	    _setTimeout(handler, timeout) {
    	      clearTimeout(this._timeout);
    	      this._timeout = setTimeout(handler, timeout);
    	    }
    	    _isWithActiveTrigger() {
    	      return Object.values(this._activeTrigger).includes(true);
    	    }
    	    _getConfig(config) {
    	      const dataAttributes = Manipulator.getDataAttributes(this._element);
    	      for (const dataAttribute of Object.keys(dataAttributes)) {
    	        if (DISALLOWED_ATTRIBUTES.has(dataAttribute)) {
    	          delete dataAttributes[dataAttribute];
    	        }
    	      }
    	      config = {
    	        ...dataAttributes,
    	        ...(typeof config === 'object' && config ? config : {})
    	      };
    	      config = this._mergeConfigObj(config);
    	      config = this._configAfterMerge(config);
    	      this._typeCheckConfig(config);
    	      return config;
    	    }
    	    _configAfterMerge(config) {
    	      config.container = config.container === false ? document.body : index_js.getElement(config.container);
    	      if (typeof config.delay === 'number') {
    	        config.delay = {
    	          show: config.delay,
    	          hide: config.delay
    	        };
    	      }
    	      if (typeof config.title === 'number') {
    	        config.title = config.title.toString();
    	      }
    	      if (typeof config.content === 'number') {
    	        config.content = config.content.toString();
    	      }
    	      return config;
    	    }
    	    _getDelegateConfig() {
    	      const config = {};
    	      for (const [key, value] of Object.entries(this._config)) {
    	        if (this.constructor.Default[key] !== value) {
    	          config[key] = value;
    	        }
    	      }
    	      config.selector = false;
    	      config.trigger = 'manual';

    	      // In the future can be replaced with:
    	      // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
    	      // `Object.fromEntries(keysWithDifferentValues)`
    	      return config;
    	    }
    	    _disposePopper() {
    	      if (this._popper) {
    	        this._popper.destroy();
    	        this._popper = null;
    	      }
    	      if (this.tip) {
    	        this.tip.remove();
    	        this.tip = null;
    	      }
    	    }

    	    // Static
    	    static jQueryInterface(config) {
    	      return this.each(function () {
    	        const data = Tooltip.getOrCreateInstance(this, config);
    	        if (typeof config !== 'string') {
    	          return;
    	        }
    	        if (typeof data[config] === 'undefined') {
    	          throw new TypeError(`No method named "${config}"`);
    	        }
    	        data[config]();
    	      });
    	    }
    	  }

    	  /**
    	   * jQuery
    	   */

    	  index_js.defineJQueryPlugin(Tooltip);

    	  return Tooltip;

    	}));
    	
    } (tooltip));

    var Tooltip = tooltipExports;

    function run(callback) {
        for (let e of document.querySelectorAll("[data-bs-toggle='tooltip']")) {
            callback(Tooltip.getInstance(e), e);
        }
    }
    const hideTooltips = () => {
        run((instance, e) => {
            if (instance) {
                instance.hide();
            }
        });
    };
    const createTooltips = () => {
        run((instance, e) => {
            if (!instance || (instance && e.hasAttribute("title"))) {
                new Tooltip(e);
            }
        });
    };

    var offcanvasExports = {};
    var offcanvas$1 = {
      get exports(){ return offcanvasExports; },
      set exports(v){ offcanvasExports = v; },
    };

    var scrollbarExports = {};
    var scrollbar = {
      get exports(){ return scrollbarExports; },
      set exports(v){ scrollbarExports = v; },
    };

    /*!
      * Bootstrap scrollbar.js v5.3.0-alpha1 (https://getbootstrap.com/)
      * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
      */

    var hasRequiredScrollbar;

    function requireScrollbar () {
    	if (hasRequiredScrollbar) return scrollbarExports;
    	hasRequiredScrollbar = 1;
    	(function (module, exports) {
    		(function (global, factory) {
    		  module.exports = factory(requireSelectorEngine(), requireManipulator(), requireUtil()) ;
    		})(commonjsGlobal, (function (SelectorEngine, Manipulator, index_js) {
    		  /**
    		   * --------------------------------------------------------------------------
    		   * Bootstrap (v5.3.0-alpha1): util/scrollBar.js
    		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
    		   * --------------------------------------------------------------------------
    		   */

    		  /**
    		   * Constants
    		   */

    		  const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
    		  const SELECTOR_STICKY_CONTENT = '.sticky-top';
    		  const PROPERTY_PADDING = 'padding-right';
    		  const PROPERTY_MARGIN = 'margin-right';

    		  /**
    		   * Class definition
    		   */

    		  class ScrollBarHelper {
    		    constructor() {
    		      this._element = document.body;
    		    }

    		    // Public
    		    getWidth() {
    		      // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
    		      const documentWidth = document.documentElement.clientWidth;
    		      return Math.abs(window.innerWidth - documentWidth);
    		    }
    		    hide() {
    		      const width = this.getWidth();
    		      this._disableOverFlow();
    		      // give padding to element to balance the hidden scrollbar width
    		      this._setElementAttributes(this._element, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
    		      // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth
    		      this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
    		      this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, calculatedValue => calculatedValue - width);
    		    }
    		    reset() {
    		      this._resetElementAttributes(this._element, 'overflow');
    		      this._resetElementAttributes(this._element, PROPERTY_PADDING);
    		      this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);
    		      this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
    		    }
    		    isOverflowing() {
    		      return this.getWidth() > 0;
    		    }

    		    // Private
    		    _disableOverFlow() {
    		      this._saveInitialAttribute(this._element, 'overflow');
    		      this._element.style.overflow = 'hidden';
    		    }
    		    _setElementAttributes(selector, styleProperty, callback) {
    		      const scrollbarWidth = this.getWidth();
    		      const manipulationCallBack = element => {
    		        if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
    		          return;
    		        }
    		        this._saveInitialAttribute(element, styleProperty);
    		        const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
    		        element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
    		      };
    		      this._applyManipulationCallback(selector, manipulationCallBack);
    		    }
    		    _saveInitialAttribute(element, styleProperty) {
    		      const actualValue = element.style.getPropertyValue(styleProperty);
    		      if (actualValue) {
    		        Manipulator.setDataAttribute(element, styleProperty, actualValue);
    		      }
    		    }
    		    _resetElementAttributes(selector, styleProperty) {
    		      const manipulationCallBack = element => {
    		        const value = Manipulator.getDataAttribute(element, styleProperty);
    		        // We only want to remove the property if the value is `null`; the value can also be zero
    		        if (value === null) {
    		          element.style.removeProperty(styleProperty);
    		          return;
    		        }
    		        Manipulator.removeDataAttribute(element, styleProperty);
    		        element.style.setProperty(styleProperty, value);
    		      };
    		      this._applyManipulationCallback(selector, manipulationCallBack);
    		    }
    		    _applyManipulationCallback(selector, callBack) {
    		      if (index_js.isElement(selector)) {
    		        callBack(selector);
    		        return;
    		      }
    		      for (const sel of SelectorEngine.find(selector, this._element)) {
    		        callBack(sel);
    		      }
    		    }
    		  }

    		  return ScrollBarHelper;

    		}));
    		
    } (scrollbar));
    	return scrollbarExports;
    }

    var backdropExports = {};
    var backdrop = {
      get exports(){ return backdropExports; },
      set exports(v){ backdropExports = v; },
    };

    /*!
      * Bootstrap backdrop.js v5.3.0-alpha1 (https://getbootstrap.com/)
      * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
      */

    var hasRequiredBackdrop;

    function requireBackdrop () {
    	if (hasRequiredBackdrop) return backdropExports;
    	hasRequiredBackdrop = 1;
    	(function (module, exports) {
    		(function (global, factory) {
    		  module.exports = factory(requireEventHandler(), requireUtil(), requireConfig()) ;
    		})(commonjsGlobal, (function (EventHandler, index_js, Config) {
    		  /**
    		   * --------------------------------------------------------------------------
    		   * Bootstrap (v5.3.0-alpha1): util/backdrop.js
    		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
    		   * --------------------------------------------------------------------------
    		   */

    		  /**
    		   * Constants
    		   */

    		  const NAME = 'backdrop';
    		  const CLASS_NAME_FADE = 'fade';
    		  const CLASS_NAME_SHOW = 'show';
    		  const EVENT_MOUSEDOWN = `mousedown.bs.${NAME}`;
    		  const Default = {
    		    className: 'modal-backdrop',
    		    clickCallback: null,
    		    isAnimated: false,
    		    isVisible: true,
    		    // if false, we use the backdrop helper without adding any element to the dom
    		    rootElement: 'body' // give the choice to place backdrop under different elements
    		  };

    		  const DefaultType = {
    		    className: 'string',
    		    clickCallback: '(function|null)',
    		    isAnimated: 'boolean',
    		    isVisible: 'boolean',
    		    rootElement: '(element|string)'
    		  };

    		  /**
    		   * Class definition
    		   */

    		  class Backdrop extends Config {
    		    constructor(config) {
    		      super();
    		      this._config = this._getConfig(config);
    		      this._isAppended = false;
    		      this._element = null;
    		    }

    		    // Getters
    		    static get Default() {
    		      return Default;
    		    }
    		    static get DefaultType() {
    		      return DefaultType;
    		    }
    		    static get NAME() {
    		      return NAME;
    		    }

    		    // Public
    		    show(callback) {
    		      if (!this._config.isVisible) {
    		        index_js.execute(callback);
    		        return;
    		      }
    		      this._append();
    		      const element = this._getElement();
    		      if (this._config.isAnimated) {
    		        index_js.reflow(element);
    		      }
    		      element.classList.add(CLASS_NAME_SHOW);
    		      this._emulateAnimation(() => {
    		        index_js.execute(callback);
    		      });
    		    }
    		    hide(callback) {
    		      if (!this._config.isVisible) {
    		        index_js.execute(callback);
    		        return;
    		      }
    		      this._getElement().classList.remove(CLASS_NAME_SHOW);
    		      this._emulateAnimation(() => {
    		        this.dispose();
    		        index_js.execute(callback);
    		      });
    		    }
    		    dispose() {
    		      if (!this._isAppended) {
    		        return;
    		      }
    		      EventHandler.off(this._element, EVENT_MOUSEDOWN);
    		      this._element.remove();
    		      this._isAppended = false;
    		    }

    		    // Private
    		    _getElement() {
    		      if (!this._element) {
    		        const backdrop = document.createElement('div');
    		        backdrop.className = this._config.className;
    		        if (this._config.isAnimated) {
    		          backdrop.classList.add(CLASS_NAME_FADE);
    		        }
    		        this._element = backdrop;
    		      }
    		      return this._element;
    		    }
    		    _configAfterMerge(config) {
    		      // use getElement() with the default "body" to get a fresh Element on each instantiation
    		      config.rootElement = index_js.getElement(config.rootElement);
    		      return config;
    		    }
    		    _append() {
    		      if (this._isAppended) {
    		        return;
    		      }
    		      const element = this._getElement();
    		      this._config.rootElement.append(element);
    		      EventHandler.on(element, EVENT_MOUSEDOWN, () => {
    		        index_js.execute(this._config.clickCallback);
    		      });
    		      this._isAppended = true;
    		    }
    		    _emulateAnimation(callback) {
    		      index_js.executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
    		    }
    		  }

    		  return Backdrop;

    		}));
    		
    } (backdrop));
    	return backdropExports;
    }

    var focustrapExports = {};
    var focustrap = {
      get exports(){ return focustrapExports; },
      set exports(v){ focustrapExports = v; },
    };

    /*!
      * Bootstrap focustrap.js v5.3.0-alpha1 (https://getbootstrap.com/)
      * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
      */

    var hasRequiredFocustrap;

    function requireFocustrap () {
    	if (hasRequiredFocustrap) return focustrapExports;
    	hasRequiredFocustrap = 1;
    	(function (module, exports) {
    		(function (global, factory) {
    		  module.exports = factory(requireEventHandler(), requireSelectorEngine(), requireConfig()) ;
    		})(commonjsGlobal, (function (EventHandler, SelectorEngine, Config) {
    		  /**
    		   * --------------------------------------------------------------------------
    		   * Bootstrap (v5.3.0-alpha1): util/focustrap.js
    		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
    		   * --------------------------------------------------------------------------
    		   */

    		  /**
    		   * Constants
    		   */

    		  const NAME = 'focustrap';
    		  const DATA_KEY = 'bs.focustrap';
    		  const EVENT_KEY = `.${DATA_KEY}`;
    		  const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
    		  const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY}`;
    		  const TAB_KEY = 'Tab';
    		  const TAB_NAV_FORWARD = 'forward';
    		  const TAB_NAV_BACKWARD = 'backward';
    		  const Default = {
    		    autofocus: true,
    		    trapElement: null // The element to trap focus inside of
    		  };

    		  const DefaultType = {
    		    autofocus: 'boolean',
    		    trapElement: 'element'
    		  };

    		  /**
    		   * Class definition
    		   */

    		  class FocusTrap extends Config {
    		    constructor(config) {
    		      super();
    		      this._config = this._getConfig(config);
    		      this._isActive = false;
    		      this._lastTabNavDirection = null;
    		    }

    		    // Getters
    		    static get Default() {
    		      return Default;
    		    }
    		    static get DefaultType() {
    		      return DefaultType;
    		    }
    		    static get NAME() {
    		      return NAME;
    		    }

    		    // Public
    		    activate() {
    		      if (this._isActive) {
    		        return;
    		      }
    		      if (this._config.autofocus) {
    		        this._config.trapElement.focus();
    		      }
    		      EventHandler.off(document, EVENT_KEY); // guard against infinite focus loop
    		      EventHandler.on(document, EVENT_FOCUSIN, event => this._handleFocusin(event));
    		      EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
    		      this._isActive = true;
    		    }
    		    deactivate() {
    		      if (!this._isActive) {
    		        return;
    		      }
    		      this._isActive = false;
    		      EventHandler.off(document, EVENT_KEY);
    		    }

    		    // Private
    		    _handleFocusin(event) {
    		      const {
    		        trapElement
    		      } = this._config;
    		      if (event.target === document || event.target === trapElement || trapElement.contains(event.target)) {
    		        return;
    		      }
    		      const elements = SelectorEngine.focusableChildren(trapElement);
    		      if (elements.length === 0) {
    		        trapElement.focus();
    		      } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
    		        elements[elements.length - 1].focus();
    		      } else {
    		        elements[0].focus();
    		      }
    		    }
    		    _handleKeydown(event) {
    		      if (event.key !== TAB_KEY) {
    		        return;
    		      }
    		      this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
    		    }
    		  }

    		  return FocusTrap;

    		}));
    		
    } (focustrap));
    	return focustrapExports;
    }

    var componentFunctionsExports = {};
    var componentFunctions = {
      get exports(){ return componentFunctionsExports; },
      set exports(v){ componentFunctionsExports = v; },
    };

    /*!
      * Bootstrap component-functions.js v5.3.0-alpha1 (https://getbootstrap.com/)
      * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
      */

    var hasRequiredComponentFunctions;

    function requireComponentFunctions () {
    	if (hasRequiredComponentFunctions) return componentFunctionsExports;
    	hasRequiredComponentFunctions = 1;
    	(function (module, exports) {
    		(function (global, factory) {
    		  factory(exports, requireEventHandler(), requireUtil(), requireSelectorEngine()) ;
    		})(commonjsGlobal, (function (exports, EventHandler, index_js, SelectorEngine) {
    		  /**
    		   * --------------------------------------------------------------------------
    		   * Bootstrap (v5.3.0-alpha1): util/component-functions.js
    		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
    		   * --------------------------------------------------------------------------
    		   */
    		  const enableDismissTrigger = (component, method = 'hide') => {
    		    const clickEvent = `click.dismiss${component.EVENT_KEY}`;
    		    const name = component.NAME;
    		    EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
    		      if (['A', 'AREA'].includes(this.tagName)) {
    		        event.preventDefault();
    		      }
    		      if (index_js.isDisabled(this)) {
    		        return;
    		      }
    		      const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}`);
    		      const instance = component.getOrCreateInstance(target);

    		      // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
    		      instance[method]();
    		    });
    		  };

    		  exports.enableDismissTrigger = enableDismissTrigger;

    		  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

    		}));
    		
    } (componentFunctions, componentFunctionsExports));
    	return componentFunctionsExports;
    }

    /*!
      * Bootstrap offcanvas.js v5.3.0-alpha1 (https://getbootstrap.com/)
      * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
      */

    (function (module, exports) {
    	(function (global, factory) {
    	  module.exports = factory(requireUtil(), requireScrollbar(), requireEventHandler(), requireBaseComponent(), requireSelectorEngine(), requireBackdrop(), requireFocustrap(), requireComponentFunctions()) ;
    	})(commonjsGlobal, (function (index_js, ScrollBarHelper, EventHandler, BaseComponent, SelectorEngine, Backdrop, FocusTrap, componentFunctions_js) {
    	  /**
    	   * --------------------------------------------------------------------------
    	   * Bootstrap (v5.3.0-alpha1): offcanvas.js
    	   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
    	   * --------------------------------------------------------------------------
    	   */

    	  /**
    	   * Constants
    	   */

    	  const NAME = 'offcanvas';
    	  const DATA_KEY = 'bs.offcanvas';
    	  const EVENT_KEY = `.${DATA_KEY}`;
    	  const DATA_API_KEY = '.data-api';
    	  const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
    	  const ESCAPE_KEY = 'Escape';
    	  const CLASS_NAME_SHOW = 'show';
    	  const CLASS_NAME_SHOWING = 'showing';
    	  const CLASS_NAME_HIDING = 'hiding';
    	  const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
    	  const OPEN_SELECTOR = '.offcanvas.show';
    	  const EVENT_SHOW = `show${EVENT_KEY}`;
    	  const EVENT_SHOWN = `shown${EVENT_KEY}`;
    	  const EVENT_HIDE = `hide${EVENT_KEY}`;
    	  const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`;
    	  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
    	  const EVENT_RESIZE = `resize${EVENT_KEY}`;
    	  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
    	  const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`;
    	  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="offcanvas"]';
    	  const Default = {
    	    backdrop: true,
    	    keyboard: true,
    	    scroll: false
    	  };
    	  const DefaultType = {
    	    backdrop: '(boolean|string)',
    	    keyboard: 'boolean',
    	    scroll: 'boolean'
    	  };

    	  /**
    	   * Class definition
    	   */

    	  class Offcanvas extends BaseComponent {
    	    constructor(element, config) {
    	      super(element, config);
    	      this._isShown = false;
    	      this._backdrop = this._initializeBackDrop();
    	      this._focustrap = this._initializeFocusTrap();
    	      this._addEventListeners();
    	    }

    	    // Getters
    	    static get Default() {
    	      return Default;
    	    }
    	    static get DefaultType() {
    	      return DefaultType;
    	    }
    	    static get NAME() {
    	      return NAME;
    	    }

    	    // Public
    	    toggle(relatedTarget) {
    	      return this._isShown ? this.hide() : this.show(relatedTarget);
    	    }
    	    show(relatedTarget) {
    	      if (this._isShown) {
    	        return;
    	      }
    	      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW, {
    	        relatedTarget
    	      });
    	      if (showEvent.defaultPrevented) {
    	        return;
    	      }
    	      this._isShown = true;
    	      this._backdrop.show();
    	      if (!this._config.scroll) {
    	        new ScrollBarHelper().hide();
    	      }
    	      this._element.setAttribute('aria-modal', true);
    	      this._element.setAttribute('role', 'dialog');
    	      this._element.classList.add(CLASS_NAME_SHOWING);
    	      const completeCallBack = () => {
    	        if (!this._config.scroll || this._config.backdrop) {
    	          this._focustrap.activate();
    	        }
    	        this._element.classList.add(CLASS_NAME_SHOW);
    	        this._element.classList.remove(CLASS_NAME_SHOWING);
    	        EventHandler.trigger(this._element, EVENT_SHOWN, {
    	          relatedTarget
    	        });
    	      };
    	      this._queueCallback(completeCallBack, this._element, true);
    	    }
    	    hide() {
    	      if (!this._isShown) {
    	        return;
    	      }
    	      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);
    	      if (hideEvent.defaultPrevented) {
    	        return;
    	      }
    	      this._focustrap.deactivate();
    	      this._element.blur();
    	      this._isShown = false;
    	      this._element.classList.add(CLASS_NAME_HIDING);
    	      this._backdrop.hide();
    	      const completeCallback = () => {
    	        this._element.classList.remove(CLASS_NAME_SHOW, CLASS_NAME_HIDING);
    	        this._element.removeAttribute('aria-modal');
    	        this._element.removeAttribute('role');
    	        if (!this._config.scroll) {
    	          new ScrollBarHelper().reset();
    	        }
    	        EventHandler.trigger(this._element, EVENT_HIDDEN);
    	      };
    	      this._queueCallback(completeCallback, this._element, true);
    	    }
    	    dispose() {
    	      this._backdrop.dispose();
    	      this._focustrap.deactivate();
    	      super.dispose();
    	    }

    	    // Private
    	    _initializeBackDrop() {
    	      const clickCallback = () => {
    	        if (this._config.backdrop === 'static') {
    	          EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
    	          return;
    	        }
    	        this.hide();
    	      };

    	      // 'static' option will be translated to true, and booleans will keep their value
    	      const isVisible = Boolean(this._config.backdrop);
    	      return new Backdrop({
    	        className: CLASS_NAME_BACKDROP,
    	        isVisible,
    	        isAnimated: true,
    	        rootElement: this._element.parentNode,
    	        clickCallback: isVisible ? clickCallback : null
    	      });
    	    }
    	    _initializeFocusTrap() {
    	      return new FocusTrap({
    	        trapElement: this._element
    	      });
    	    }
    	    _addEventListeners() {
    	      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
    	        if (event.key !== ESCAPE_KEY) {
    	          return;
    	        }
    	        if (!this._config.keyboard) {
    	          EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
    	          return;
    	        }
    	        this.hide();
    	      });
    	    }

    	    // Static
    	    static jQueryInterface(config) {
    	      return this.each(function () {
    	        const data = Offcanvas.getOrCreateInstance(this, config);
    	        if (typeof config !== 'string') {
    	          return;
    	        }
    	        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
    	          throw new TypeError(`No method named "${config}"`);
    	        }
    	        data[config](this);
    	      });
    	    }
    	  }

    	  /**
    	   * Data API implementation
    	   */

    	  EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    	    const target = SelectorEngine.getElementFromSelector(this);
    	    if (['A', 'AREA'].includes(this.tagName)) {
    	      event.preventDefault();
    	    }
    	    if (index_js.isDisabled(this)) {
    	      return;
    	    }
    	    EventHandler.one(target, EVENT_HIDDEN, () => {
    	      // focus on trigger when it is closed
    	      if (index_js.isVisible(this)) {
    	        this.focus();
    	      }
    	    });

    	    // avoid conflict when clicking a toggler of an offcanvas, while another is open
    	    const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
    	    if (alreadyOpen && alreadyOpen !== target) {
    	      Offcanvas.getInstance(alreadyOpen).hide();
    	    }
    	    const data = Offcanvas.getOrCreateInstance(target);
    	    data.toggle(this);
    	  });
    	  EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
    	    for (const selector of SelectorEngine.find(OPEN_SELECTOR)) {
    	      Offcanvas.getOrCreateInstance(selector).show();
    	    }
    	  });
    	  EventHandler.on(window, EVENT_RESIZE, () => {
    	    for (const element of SelectorEngine.find('[aria-modal][class*=show][class*=offcanvas-]')) {
    	      if (getComputedStyle(element).position !== 'fixed') {
    	        Offcanvas.getOrCreateInstance(element).hide();
    	      }
    	    }
    	  });
    	  componentFunctions_js.enableDismissTrigger(Offcanvas);

    	  /**
    	   * jQuery
    	   */

    	  index_js.defineJQueryPlugin(Offcanvas);

    	  return Offcanvas;

    	}));
    	
    } (offcanvas$1));

    var offcanvas = offcanvasExports;

    /* App\lib\offcanvas.svelte generated by Svelte v3.55.1 */
    const file$4 = "App\\lib\\offcanvas.svelte";
    const get_title_slot_changes = dirty => ({});
    const get_title_slot_context = ctx => ({});

    // (138:4) {#if title || titleCloseButton || $$slots.title}
    function create_if_block_3(ctx) {
    	let div;
    	let h5;
    	let t0;
    	let t1;
    	let current;
    	let if_block0 = /*title*/ ctx[3] && create_if_block_5(ctx);
    	const title_slot_template = /*#slots*/ ctx[19].title;
    	const title_slot = create_slot(title_slot_template, ctx, /*$$scope*/ ctx[18], get_title_slot_context);
    	let if_block1 = /*titleCloseButton*/ ctx[4] && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (title_slot) title_slot.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(h5, "class", "offcanvas-title");
    			add_location(h5, file$4, 139, 12, 4234);
    			attr_dev(div, "class", "offcanvas-header");
    			add_location(div, file$4, 138, 8, 4190);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    			if (if_block0) if_block0.m(h5, null);
    			append_dev(h5, t0);

    			if (title_slot) {
    				title_slot.m(h5, null);
    			}

    			append_dev(div, t1);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					if_block0.m(h5, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (title_slot) {
    				if (title_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						title_slot,
    						title_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(title_slot_template, /*$$scope*/ ctx[18], dirty, get_title_slot_changes),
    						get_title_slot_context
    					);
    				}
    			}

    			if (/*titleCloseButton*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (title_slot) title_slot.d(detaching);
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(138:4) {#if title || titleCloseButton || $$slots.title}",
    		ctx
    	});

    	return block;
    }

    // (141:16) {#if title}
    function create_if_block_5(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*title*/ ctx[3], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 8) html_tag.p(/*title*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(141:16) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (146:12) {#if titleCloseButton}
    function create_if_block_4(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn-close text-reset");
    			add_location(button, file$4, 146, 12, 4462);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*close*/ ctx[10], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(146:12) {#if titleCloseButton}",
    		ctx
    	});

    	return block;
    }

    // (152:8) {#if state.open}
    function create_if_block$3(ctx) {
    	let t0;
    	let t1;
    	let current;
    	let if_block0 = /*promise*/ ctx[5] && create_if_block_2$2(ctx);
    	let if_block1 = /*content*/ ctx[8] && create_if_block_1$2(ctx);
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*promise*/ ctx[5]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$2(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*content*/ ctx[8]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(152:8) {#if state.open}",
    		ctx
    	});

    	return block;
    }

    // (153:12) {#if promise}
    function create_if_block_2$2(ctx) {
    	let await_block_anchor;
    	let promise_1;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 8
    	};

    	handle_promise(promise_1 = /*promise*/ ctx[5](), info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*promise*/ 32 && promise_1 !== (promise_1 = /*promise*/ ctx[5]()) && handle_promise(promise_1, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(153:12) {#if promise}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script lang="ts">import { onDestroy, createEventDispatcher }
    function create_catch_block(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script lang=\\\"ts\\\">import { onDestroy, createEventDispatcher }",
    		ctx
    	});

    	return block;
    }

    // (158:16) {:then content}
    function create_then_block(ctx) {
    	let html_tag;
    	let raw_value = /*content*/ ctx[8] + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*promise*/ 32 && raw_value !== (raw_value = /*content*/ ctx[8] + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(158:16) {:then content}",
    		ctx
    	});

    	return block;
    }

    // (154:34)                       <div class="text-center">                          <i class="spinner-border" style="width: 3rem; height: 3rem;"></i>                      </div>                  {:then content}
    function create_pending_block(ctx) {
    	let div;
    	let i;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			attr_dev(i, "class", "spinner-border");
    			set_style(i, "width", "3rem");
    			set_style(i, "height", "3rem");
    			add_location(i, file$4, 155, 24, 4781);
    			attr_dev(div, "class", "text-center");
    			add_location(div, file$4, 154, 20, 4730);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(154:34)                       <div class=\\\"text-center\\\">                          <i class=\\\"spinner-border\\\" style=\\\"width: 3rem; height: 3rem;\\\"></i>                      </div>                  {:then content}",
    		ctx
    	});

    	return block;
    }

    // (162:12) {#if content}
    function create_if_block_1$2(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*content*/ ctx[8], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*content*/ 256) html_tag.p(/*content*/ ctx[8]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(162:12) {#if content}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div1;
    	let t;
    	let div0;
    	let div1_class_value;
    	let div1_style_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = (/*title*/ ctx[3] || /*titleCloseButton*/ ctx[4] || /*$$slots*/ ctx[11].title) && create_if_block_3(ctx);
    	let if_block1 = /*state*/ ctx[0].open && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			div0 = element("div");
    			if (if_block1) if_block1.c();
    			attr_dev(div0, "class", "offcanvas-body");
    			add_location(div0, file$4, 150, 4, 4591);

    			attr_dev(div1, "class", div1_class_value = "" + ((/*responsiveSize*/ ctx[2]
    			? `offcanvas-${/*responsiveSize*/ ctx[2]}`
    			: "offcanvas") + " offcanvas-" + /*orientation*/ ctx[1] + " " + (/*classes*/ ctx[6] || '')));

    			attr_dev(div1, "style", div1_style_value = /*styles*/ ctx[7] || '');
    			attr_dev(div1, "tabindex", "-1");
    			add_location(div1, file$4, 136, 0, 3958);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);
    			if (if_block1) if_block1.m(div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(/*useElement*/ ctx[9].call(null, div1));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[3] || /*titleCloseButton*/ ctx[4] || /*$$slots*/ ctx[11].title) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*title, titleCloseButton, $$slots*/ 2072) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div1, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*state*/ ctx[0].open) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*state*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div0, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*responsiveSize, orientation, classes*/ 70 && div1_class_value !== (div1_class_value = "" + ((/*responsiveSize*/ ctx[2]
    			? `offcanvas-${/*responsiveSize*/ ctx[2]}`
    			: "offcanvas") + " offcanvas-" + /*orientation*/ ctx[1] + " " + (/*classes*/ ctx[6] || '')))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty & /*styles*/ 128 && div1_style_value !== (div1_style_value = /*styles*/ ctx[7] || '')) {
    				attr_dev(div1, "style", div1_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance_1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Offcanvas', slots, ['title','default']);
    	const $$slots = compute_slots(slots);
    	let { backdrop = true } = $$props;
    	let { keyboard = true } = $$props;
    	let { scroll = true } = $$props;
    	let { state = { open: false } } = $$props;
    	let { orientation = "start" } = $$props;
    	let { responsiveSize = undefined } = $$props;
    	let { title = undefined } = $$props;
    	let { titleCloseButton = false } = $$props;
    	let { promise = undefined } = $$props;
    	let { content = undefined } = $$props;
    	let { use = undefined } = $$props;
    	let { class: classes = "" } = $$props;
    	let { style: styles = "" } = $$props;
    	const dispatch = createEventDispatcher();
    	const show = event => dispatch("show", event);
    	const shown = event => dispatch("shown", event);
    	const hide = event => dispatch("hide", event);

    	const hidden = event => {
    		$$invalidate(0, state.open = false, state);
    		dispatch("hidden", event);
    	};

    	let instance;
    	let element;

    	const destroy = () => {
    		if (instance) {
    			element.removeEventListener("show.bs.offcanvas", show, true);
    			element.removeEventListener("shown.bs.offcanvas", shown, true);
    			element.removeEventListener("hide.bs.offcanvas", hide, true);
    			element.removeEventListener("hidden.bs.offcanvas", hidden, true);
    			instance.dispose();
    			$$invalidate(16, instance = null);
    		}
    	};

    	onDestroy(destroy);

    	function useElement(e) {
    		$$invalidate(17, element = e);
    		$$invalidate(16, instance = new offcanvas(e, { backdrop, keyboard, scroll }));
    		element.addEventListener("show.bs.offcanvas", show, true);
    		element.addEventListener("shown.bs.offcanvas", shown, true);
    		element.addEventListener("hide.bs.offcanvas", hide, true);
    		element.addEventListener("hidden.bs.offcanvas", hidden, true);
    		let result;

    		if (use) {
    			result = use(e);
    		}

    		return {
    			destroy() {
    				destroy();

    				result === null || result === void 0
    				? void 0
    				: result.destroy();
    			},
    			update() {
    				result === null || result === void 0
    				? void 0
    				: result.update();
    			}
    		};
    	}

    	function close() {
    		$$invalidate(0, state.open = false, state);
    	}

    	const writable_props = [
    		'backdrop',
    		'keyboard',
    		'scroll',
    		'state',
    		'orientation',
    		'responsiveSize',
    		'title',
    		'titleCloseButton',
    		'promise',
    		'content',
    		'use',
    		'class',
    		'style'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Offcanvas> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('backdrop' in $$props) $$invalidate(12, backdrop = $$props.backdrop);
    		if ('keyboard' in $$props) $$invalidate(13, keyboard = $$props.keyboard);
    		if ('scroll' in $$props) $$invalidate(14, scroll = $$props.scroll);
    		if ('state' in $$props) $$invalidate(0, state = $$props.state);
    		if ('orientation' in $$props) $$invalidate(1, orientation = $$props.orientation);
    		if ('responsiveSize' in $$props) $$invalidate(2, responsiveSize = $$props.responsiveSize);
    		if ('title' in $$props) $$invalidate(3, title = $$props.title);
    		if ('titleCloseButton' in $$props) $$invalidate(4, titleCloseButton = $$props.titleCloseButton);
    		if ('promise' in $$props) $$invalidate(5, promise = $$props.promise);
    		if ('content' in $$props) $$invalidate(8, content = $$props.content);
    		if ('use' in $$props) $$invalidate(15, use = $$props.use);
    		if ('class' in $$props) $$invalidate(6, classes = $$props.class);
    		if ('style' in $$props) $$invalidate(7, styles = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(18, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		createEventDispatcher,
    		offcanvas,
    		backdrop,
    		keyboard,
    		scroll,
    		state,
    		orientation,
    		responsiveSize,
    		title,
    		titleCloseButton,
    		promise,
    		content,
    		use,
    		classes,
    		styles,
    		dispatch,
    		show,
    		shown,
    		hide,
    		hidden,
    		instance,
    		element,
    		destroy,
    		useElement,
    		close
    	});

    	$$self.$inject_state = $$props => {
    		if ('backdrop' in $$props) $$invalidate(12, backdrop = $$props.backdrop);
    		if ('keyboard' in $$props) $$invalidate(13, keyboard = $$props.keyboard);
    		if ('scroll' in $$props) $$invalidate(14, scroll = $$props.scroll);
    		if ('state' in $$props) $$invalidate(0, state = $$props.state);
    		if ('orientation' in $$props) $$invalidate(1, orientation = $$props.orientation);
    		if ('responsiveSize' in $$props) $$invalidate(2, responsiveSize = $$props.responsiveSize);
    		if ('title' in $$props) $$invalidate(3, title = $$props.title);
    		if ('titleCloseButton' in $$props) $$invalidate(4, titleCloseButton = $$props.titleCloseButton);
    		if ('promise' in $$props) $$invalidate(5, promise = $$props.promise);
    		if ('content' in $$props) $$invalidate(8, content = $$props.content);
    		if ('use' in $$props) $$invalidate(15, use = $$props.use);
    		if ('classes' in $$props) $$invalidate(6, classes = $$props.classes);
    		if ('styles' in $$props) $$invalidate(7, styles = $$props.styles);
    		if ('instance' in $$props) $$invalidate(16, instance = $$props.instance);
    		if ('element' in $$props) $$invalidate(17, element = $$props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*instance, state, element*/ 196609) {
    			{
    				if (instance) {
    					if (state.open) {
    						instance.show();
    						element.focus();
    					} else {
    						instance.hide();
    					}
    				}
    			}
    		}
    	};

    	return [
    		state,
    		orientation,
    		responsiveSize,
    		title,
    		titleCloseButton,
    		promise,
    		classes,
    		styles,
    		content,
    		useElement,
    		close,
    		$$slots,
    		backdrop,
    		keyboard,
    		scroll,
    		use,
    		instance,
    		element,
    		$$scope,
    		slots
    	];
    }

    class Offcanvas extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance_1, create_fragment$4, safe_not_equal, {
    			backdrop: 12,
    			keyboard: 13,
    			scroll: 14,
    			state: 0,
    			orientation: 1,
    			responsiveSize: 2,
    			title: 3,
    			titleCloseButton: 4,
    			promise: 5,
    			content: 8,
    			use: 15,
    			class: 6,
    			style: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Offcanvas",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get backdrop() {
    		throw new Error("<Offcanvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdrop(value) {
    		throw new Error("<Offcanvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get keyboard() {
    		throw new Error("<Offcanvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keyboard(value) {
    		throw new Error("<Offcanvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scroll() {
    		throw new Error("<Offcanvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scroll(value) {
    		throw new Error("<Offcanvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Offcanvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Offcanvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get orientation() {
    		throw new Error("<Offcanvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set orientation(value) {
    		throw new Error("<Offcanvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get responsiveSize() {
    		throw new Error("<Offcanvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set responsiveSize(value) {
    		throw new Error("<Offcanvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Offcanvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Offcanvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleCloseButton() {
    		throw new Error("<Offcanvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleCloseButton(value) {
    		throw new Error("<Offcanvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get promise() {
    		throw new Error("<Offcanvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set promise(value) {
    		throw new Error("<Offcanvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get content() {
    		throw new Error("<Offcanvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content(value) {
    		throw new Error("<Offcanvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get use() {
    		throw new Error("<Offcanvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Offcanvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Offcanvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Offcanvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Offcanvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Offcanvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*auto generated*/
    var urls = {
        authorizedUrl: "/authorized",
        signInGitHubUrl: "/signin-github",
        signInGoogleUrl: "/signin-google",
        signInLinkedInUrl: "/signin-linkedin",
        cardDemoUrl: "/carddemo",
        chartDemoUrl: "/chartdemo",
        errorUrl: "/error",
        indexUrl: "/",
        loginUrl: "/login",
        logoutUrl: "/logout",
        notFoundUrl: "/404",
        spaUrl: "/spa",
        unathorizedUrl: "/401",
        // endpoints
        chart1Url: "/api/chart/1",
        chart2Url: "/api/chart/2",
        chart3Url: "/api/chart/3",
    };

    /* App\shared\layout\link-list-items.svelte generated by Svelte v3.55.1 */
    const file$3 = "App\\shared\\layout\\link-list-items.svelte";

    function create_fragment$3(ctx) {
    	let t0;
    	let li0;
    	let a0;
    	let t1;
    	let t2;
    	let li1;
    	let a1;
    	let t3;
    	let t4;
    	let li2;
    	let a2;
    	let t5;
    	let t6;
    	let li3;
    	let a3;
    	let t7;
    	let t8;
    	let li4;
    	let a4;
    	let t9;

    	const block = {
    		c: function create() {
    			t0 = space();
    			li0 = element("li");
    			a0 = element("a");
    			t1 = text("Home");
    			t2 = space();
    			li1 = element("li");
    			a1 = element("a");
    			t3 = text("Authorized Access");
    			t4 = space();
    			li2 = element("li");
    			a2 = element("a");
    			t5 = text("Spa Example");
    			t6 = space();
    			li3 = element("li");
    			a3 = element("a");
    			t7 = text("CardDemo");
    			t8 = space();
    			li4 = element("li");
    			a4 = element("a");
    			t9 = text("ChartDemo");
    			attr_dev(a0, "class", "nav-link ");
    			attr_dev(a0, "href", urls.indexUrl);
    			toggle_class(a0, "active", document.location.pathname == urls.indexUrl);
    			add_location(a0, file$3, 4, 4, 93);
    			attr_dev(li0, "class", "nav-item py-0");
    			add_location(li0, file$3, 3, 0, 61);
    			attr_dev(a1, "class", "nav-link");
    			attr_dev(a1, "href", urls.authorizedUrl);
    			toggle_class(a1, "active", document.location.pathname == urls.authorizedUrl);
    			add_location(a1, file$3, 7, 4, 245);
    			attr_dev(li1, "class", "nav-item py-0");
    			add_location(li1, file$3, 6, 0, 213);
    			attr_dev(a2, "class", "nav-link");
    			attr_dev(a2, "href", urls.spaUrl);
    			toggle_class(a2, "active", document.location.pathname == urls.spaUrl);
    			add_location(a2, file$3, 10, 4, 419);
    			attr_dev(li2, "class", "nav-item py-0");
    			add_location(li2, file$3, 9, 0, 387);
    			attr_dev(a3, "class", "nav-link");
    			attr_dev(a3, "href", urls.cardDemoUrl);
    			toggle_class(a3, "active", document.location.pathname == urls.cardDemoUrl);
    			add_location(a3, file$3, 13, 4, 573);
    			attr_dev(li3, "class", "nav-item py-0");
    			add_location(li3, file$3, 12, 0, 541);
    			attr_dev(a4, "class", "nav-link");
    			attr_dev(a4, "href", urls.chartDemoUrl);
    			toggle_class(a4, "active", document.location.pathname == urls.chartDemoUrl);
    			add_location(a4, file$3, 16, 4, 734);
    			attr_dev(li4, "class", "nav-item py-0");
    			add_location(li4, file$3, 15, 0, 702);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, li0, anchor);
    			append_dev(li0, a0);
    			append_dev(a0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, a1);
    			append_dev(a1, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, li2, anchor);
    			append_dev(li2, a2);
    			append_dev(a2, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, li3, anchor);
    			append_dev(li3, a3);
    			append_dev(a3, t7);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, li4, anchor);
    			append_dev(li4, a4);
    			append_dev(a4, t9);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*document, urls*/ 0) {
    				toggle_class(a0, "active", document.location.pathname == urls.indexUrl);
    			}

    			if (dirty & /*document, urls*/ 0) {
    				toggle_class(a1, "active", document.location.pathname == urls.authorizedUrl);
    			}

    			if (dirty & /*document, urls*/ 0) {
    				toggle_class(a2, "active", document.location.pathname == urls.spaUrl);
    			}

    			if (dirty & /*document, urls*/ 0) {
    				toggle_class(a3, "active", document.location.pathname == urls.cardDemoUrl);
    			}

    			if (dirty & /*document, urls*/ 0) {
    				toggle_class(a4, "active", document.location.pathname == urls.chartDemoUrl);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(li1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(li2);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(li3);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(li4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link_list_items', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Link_list_items> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ urls });
    	return [];
    }

    class Link_list_items extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link_list_items",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    const getValue = (id) => {
        let e = document.querySelector(`input#${id}[type=hidden]`);
        if (!e) {
            return "";
        }
        let value = e.value;
        e.remove();
        return value;
    };
    const getValueFromJson = (id) => JSON.parse(getValue(id));
    let user = getValueFromJson("user");
    getValue("error-key");
    const themeKey = getValue("theme-key");
    const title = getValue("title");
    getValue("cache-version");

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const dark = "dark";
    const light = "light";
    const html = document.getElementsByTagName("html")[0];
    const defaultTheme = html === null || html === void 0 ? void 0 : html.dataset.bsTheme;
    const isDarkTheme = writable(defaultTheme == dark);
    if (html) {
        isDarkTheme.subscribe(isDark => {
            let d = new Date();
            d.setFullYear(d.getFullYear() + 10);
            if (!isDark) {
                html.dataset.bsTheme = light;
                document.cookie = `${themeKey}=${light}; expires=${d.toUTCString()}; path=/`;
            }
            else {
                html.dataset.bsTheme = dark;
                document.cookie = `${themeKey}=${dark}; expires=${d.toUTCString()}; path=/`;
            }
        });
    }

    /* App\shared\layout\offcanvas-layout.svelte generated by Svelte v3.55.1 */

    const { document: document_1 } = globals;
    const file$2 = "App\\shared\\layout\\offcanvas-layout.svelte";

    // (84:0) {#if !pinned}
    function create_if_block_1$1(ctx) {
    	let t;
    	let offcanvas_1;
    	let current;
    	let if_block = !/*offcanvas*/ ctx[2].open && create_if_block_2$1(ctx);

    	offcanvas_1 = new Offcanvas({
    			props: {
    				state: /*offcanvas*/ ctx[2],
    				class: "offcanvas-nav navbar-dark bg-primary",
    				use: /*useOffcanvas*/ ctx[4],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	offcanvas_1.$on("hidden", /*hidden_handler*/ ctx[11]);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			create_component(offcanvas_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(offcanvas_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!/*offcanvas*/ ctx[2].open) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const offcanvas_1_changes = {};
    			if (dirty & /*offcanvas*/ 4) offcanvas_1_changes.state = /*offcanvas*/ ctx[2];

    			if (dirty & /*$$scope*/ 16384) {
    				offcanvas_1_changes.$$scope = { dirty, ctx };
    			}

    			offcanvas_1.$set(offcanvas_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(offcanvas_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(offcanvas_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(offcanvas_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(84:0) {#if !pinned}",
    		ctx
    	});

    	return block;
    }

    // (87:4) {#if !offcanvas.open}
    function create_if_block_2$1(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "gutter svelte-34qebo");
    			add_location(div, file$2, 86, 25, 2454);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mouseover", /*gutterMouseover*/ ctx[6], false, false, false),
    					listen_dev(div, "click", /*click_handler*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(87:4) {#if !offcanvas.open}",
    		ctx
    	});

    	return block;
    }

    // (88:4) <Offcanvas state={offcanvas} class="offcanvas-nav navbar-dark bg-primary" on:hidden={() => toggleOffcanvas(false)} use={useOffcanvas}>
    function create_default_slot$1(ctx) {
    	let button;
    	let t;
    	let ul;
    	let links;
    	let current;
    	let mounted;
    	let dispose;
    	links = new Link_list_items({ $$inline: true });

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = space();
    			ul = element("ul");
    			create_component(links.$$.fragment);
    			attr_dev(button, "class", "btn btn-sm btn-primary pin bi-pin-angle svelte-34qebo");
    			attr_dev(button, "data-bs-toggle", "tooltip");
    			attr_dev(button, "title", "Pin sidebar");
    			add_location(button, file$2, 88, 8, 2705);
    			attr_dev(ul, "class", "navbar-nav navbar-dark flex-column mt-4");
    			add_location(ul, file$2, 89, 8, 2846);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, ul, anchor);
    			mount_component(links, ul, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*togglePin*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(links.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(links.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(ul);
    			destroy_component(links);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(88:4) <Offcanvas state={offcanvas} class=\\\"offcanvas-nav navbar-dark bg-primary\\\" on:hidden={() => toggleOffcanvas(false)} use={useOffcanvas}>",
    		ctx
    	});

    	return block;
    }

    // (115:16) {:else}
    function create_else_block(ctx) {
    	let a;
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			a = element("a");
    			i = element("i");
    			t = text("\r\n                        Login");
    			attr_dev(i, "class", "bi-person");
    			add_location(i, file$2, 116, 24, 4023);
    			attr_dev(a, "class", "btn btn-sm btn-primary");
    			attr_dev(a, "href", urls.loginUrl);
    			add_location(a, file$2, 115, 20, 3940);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, i);
    			append_dev(a, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(115:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (108:16) {#if user.isSigned}
    function create_if_block$2(ctx) {
    	let pre;
    	let t3;
    	let a;
    	let i;

    	const block = {
    		c: function create() {
    			pre = element("pre");

    			pre.textContent = `                        ${user.email}
                    `;

    			t3 = space();
    			a = element("a");
    			i = element("i");
    			attr_dev(pre, "class", "user-info text-nowrap svelte-34qebo");
    			attr_dev(pre, "data-bs-toggle", "tooltip");
    			attr_dev(pre, "title", "Current user");
    			add_location(pre, file$2, 108, 20, 3537);
    			attr_dev(i, "class", "bi bi-box-arrow-right");
    			add_location(i, file$2, 112, 24, 3830);
    			attr_dev(a, "class", "btn btn-sm btn-primary");
    			attr_dev(a, "href", urls.logoutUrl);
    			attr_dev(a, "data-bs-toggle", "tooltip");
    			attr_dev(a, "title", "Logout");
    			add_location(a, file$2, 111, 20, 3706);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, pre, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, a, anchor);
    			append_dev(a, i);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(pre);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(108:16) {#if user.isSigned}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let t0;
    	let t1;
    	let header;
    	let nav;
    	let div2;
    	let div0;
    	let button0;
    	let i0;
    	let i0_class_value;
    	let t2;
    	let span;
    	let t3;
    	let t4;
    	let div1;
    	let t5;
    	let button1;
    	let i1;
    	let i1_class_value;
    	let button1_title_value;
    	let t6;
    	let main;
    	let div4;
    	let div3;
    	let button2;
    	let t7;
    	let ul;
    	let links;
    	let t8;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = !/*pinned*/ ctx[1] && create_if_block_1$1(ctx);

    	function select_block_type(ctx, dirty) {
    		if (user.isSigned) return create_if_block$2;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type();
    	let if_block1 = current_block_type(ctx);
    	links = new Link_list_items({ $$inline: true });
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);

    	const block = {
    		c: function create() {
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			header = element("header");
    			nav = element("nav");
    			div2 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			i0 = element("i");
    			t2 = space();
    			span = element("span");
    			t3 = text(/*title*/ ctx[0]);
    			t4 = space();
    			div1 = element("div");
    			if_block1.c();
    			t5 = space();
    			button1 = element("button");
    			i1 = element("i");
    			t6 = space();
    			main = element("main");
    			div4 = element("div");
    			div3 = element("div");
    			button2 = element("button");
    			t7 = space();
    			ul = element("ul");
    			create_component(links.$$.fragment);
    			t8 = space();
    			if (default_slot) default_slot.c();

    			attr_dev(i0, "class", i0_class_value = /*offcanvas*/ ctx[2].open && !/*pinned*/ ctx[1]
    			? "bi-x"
    			: "bi-list");

    			add_location(i0, file$2, 101, 20, 3256);
    			attr_dev(span, "class", "font-monospace");
    			add_location(span, file$2, 102, 20, 3342);
    			attr_dev(button0, "class", "btn btn-primary");
    			add_location(button0, file$2, 100, 16, 3167);
    			attr_dev(div0, "class", "d-flex float-start");
    			add_location(div0, file$2, 99, 12, 3117);

    			attr_dev(i1, "class", i1_class_value = /*$isDarkTheme*/ ctx[3]
    			? "bi-lightbulb"
    			: "bi-lightbulb-off");

    			add_location(i1, file$2, 121, 20, 4335);
    			attr_dev(button1, "class", "btn btn-sm btn-primary mx-1");
    			attr_dev(button1, "data-bs-toggle", "tooltip");
    			attr_dev(button1, "title", button1_title_value = /*$isDarkTheme*/ ctx[3] ? "Lights On" : "Lights Off");
    			add_location(button1, file$2, 120, 16, 4146);
    			attr_dev(div1, "class", "d-flex float-end");
    			add_location(div1, file$2, 106, 12, 3448);
    			attr_dev(div2, "class", "container-fluid");
    			add_location(div2, file$2, 97, 8, 3072);
    			attr_dev(nav, "class", "navbar navbar-expand-md navbar-dark fixed-top bg-primary py-0 py-md-0");
    			add_location(nav, file$2, 96, 4, 2979);
    			attr_dev(header, "class", "svelte-34qebo");
    			add_location(header, file$2, 95, 0, 2965);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-sm btn-primary pin bi-pin svelte-34qebo");
    			attr_dev(button2, "data-bs-toggle", "tooltip");
    			attr_dev(button2, "title", "Unpin sidebar");
    			add_location(button2, file$2, 131, 12, 4668);
    			attr_dev(div3, "class", "position-fixed pin-wrap svelte-34qebo");
    			add_location(div3, file$2, 130, 8, 4617);
    			attr_dev(ul, "class", "navbar-nav navbar-dark flex-column mt-4 position-fixed");
    			add_location(ul, file$2, 133, 8, 4835);
    			attr_dev(div4, "class", "offcanvas-nav navbar-dark bg-primary svelte-34qebo");
    			toggle_class(div4, "d-none", !/*pinned*/ ctx[1]);
    			add_location(div4, file$2, 129, 4, 4534);
    			attr_dev(main, "class", "svelte-34qebo");
    			toggle_class(main, "pinned-layout", /*pinned*/ ctx[1]);
    			add_location(main, file$2, 128, 0, 4493);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, header, anchor);
    			append_dev(header, nav);
    			append_dev(nav, div2);
    			append_dev(div2, div0);
    			append_dev(div0, button0);
    			append_dev(button0, i0);
    			append_dev(button0, t2);
    			append_dev(button0, span);
    			append_dev(span, t3);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			if_block1.m(div1, null);
    			append_dev(div1, t5);
    			append_dev(div1, button1);
    			append_dev(button1, i1);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div4);
    			append_dev(div4, div3);
    			append_dev(div3, button2);
    			append_dev(div4, t7);
    			append_dev(div4, ul);
    			mount_component(links, ul, null);
    			append_dev(main, t8);

    			if (default_slot) {
    				default_slot.m(main, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(document_1.body, "mouseover", /*bodyMouseover*/ ctx[7], false, false, false),
    					listen_dev(button0, "click", /*click_handler_1*/ ctx[12], false, false, false),
    					listen_dev(button1, "click", /*click_handler_2*/ ctx[13], false, false, false),
    					listen_dev(button2, "click", /*togglePin*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*pinned*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*pinned*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*offcanvas, pinned*/ 6 && i0_class_value !== (i0_class_value = /*offcanvas*/ ctx[2].open && !/*pinned*/ ctx[1]
    			? "bi-x"
    			: "bi-list")) {
    				attr_dev(i0, "class", i0_class_value);
    			}

    			if (!current || dirty & /*title*/ 1) set_data_dev(t3, /*title*/ ctx[0]);
    			if_block1.p(ctx, dirty);

    			if (!current || dirty & /*$isDarkTheme*/ 8 && i1_class_value !== (i1_class_value = /*$isDarkTheme*/ ctx[3]
    			? "bi-lightbulb"
    			: "bi-lightbulb-off")) {
    				attr_dev(i1, "class", i1_class_value);
    			}

    			if (!current || dirty & /*$isDarkTheme*/ 8 && button1_title_value !== (button1_title_value = /*$isDarkTheme*/ ctx[3] ? "Lights On" : "Lights Off")) {
    				attr_dev(button1, "title", button1_title_value);
    			}

    			if (!current || dirty & /*pinned*/ 2) {
    				toggle_class(div4, "d-none", !/*pinned*/ ctx[1]);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*pinned*/ 2) {
    				toggle_class(main, "pinned-layout", /*pinned*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(links.$$.fragment, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(links.$$.fragment, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(header);
    			if_block1.d();
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(main);
    			destroy_component(links);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const pinnedKey = "sidebar-pinned";

    function instance$2($$self, $$props, $$invalidate) {
    	let $isDarkTheme;
    	validate_store(isDarkTheme, 'isDarkTheme');
    	component_subscribe($$self, isDarkTheme, $$value => $$invalidate(3, $isDarkTheme = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Offcanvas_layout', slots, ['default']);
    	let { title: title$1 = title } = $$props;

    	let pinned = localStorage.getItem(pinnedKey) == null
    	? true
    	: localStorage.getItem(pinnedKey) == "true";

    	let offcanvas = { open: false };
    	let offcanvasRef;

    	function useOffcanvas(e) {
    		offcanvasRef = e;
    	}

    	function toggleOffcanvas(state) {
    		if (pinned) {
    			$$invalidate(1, pinned = false);
    			return;
    		}

    		if (state == undefined) {
    			$$invalidate(2, offcanvas.open = !offcanvas.open, offcanvas);
    		} else {
    			$$invalidate(2, offcanvas.open = state, offcanvas);
    		}
    	}

    	let gutterTimeout;
    	let bodyTimeout;

    	function gutterMouseover() {
    		if (gutterTimeout) {
    			clearInterval(gutterTimeout);
    			gutterTimeout = null;
    		}

    		if (offcanvas.open) {
    			return;
    		}

    		gutterTimeout = setTimeout(
    			() => {
    				if (!offcanvas.open && document && document.querySelectorAll(".gutter:hover").length > 0) {
    					$$invalidate(2, offcanvas.open = true, offcanvas);
    				}

    				gutterTimeout = null;
    			},
    			500
    		);
    	}

    	function bodyMouseover() {
    		if (bodyTimeout) {
    			clearInterval(bodyTimeout);
    			bodyTimeout = null;
    		}

    		if (!offcanvas.open) {
    			return;
    		}

    		if (offcanvasRef.querySelectorAll(".offcanvas-body:hover").length) {
    			return;
    		}

    		bodyTimeout = setTimeout(
    			() => {
    				if (offcanvas.open && !offcanvasRef.querySelectorAll(".offcanvas-body:hover").length) {
    					$$invalidate(2, offcanvas.open = false, offcanvas);
    				}

    				bodyTimeout = null;
    			},
    			5000
    		);
    	}

    	function togglePin() {
    		$$invalidate(1, pinned = !pinned);
    	}

    	onDestroy(() => {
    		if (gutterTimeout) {
    			clearInterval(gutterTimeout);
    		}

    		if (bodyTimeout) {
    			clearInterval(bodyTimeout);
    		}
    	});

    	beforeUpdate(hideTooltips);
    	afterUpdate(createTooltips);
    	const writable_props = ['title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Offcanvas_layout> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => toggleOffcanvas(true);
    	const hidden_handler = () => toggleOffcanvas(false);
    	const click_handler_1 = () => toggleOffcanvas();
    	const click_handler_2 = () => set_store_value(isDarkTheme, $isDarkTheme = !$isDarkTheme, $isDarkTheme);

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title$1 = $$props.title);
    		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		afterUpdate,
    		beforeUpdate,
    		createTooltips,
    		hideTooltips,
    		Offcanvas,
    		Links: Link_list_items,
    		user,
    		configTitle: title,
    		urls,
    		isDarkTheme,
    		title: title$1,
    		pinnedKey,
    		pinned,
    		offcanvas,
    		offcanvasRef,
    		useOffcanvas,
    		toggleOffcanvas,
    		gutterTimeout,
    		bodyTimeout,
    		gutterMouseover,
    		bodyMouseover,
    		togglePin,
    		$isDarkTheme
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title$1 = $$props.title);
    		if ('pinned' in $$props) $$invalidate(1, pinned = $$props.pinned);
    		if ('offcanvas' in $$props) $$invalidate(2, offcanvas = $$props.offcanvas);
    		if ('offcanvasRef' in $$props) offcanvasRef = $$props.offcanvasRef;
    		if ('gutterTimeout' in $$props) gutterTimeout = $$props.gutterTimeout;
    		if ('bodyTimeout' in $$props) bodyTimeout = $$props.bodyTimeout;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*pinned, title*/ 3) {
    			{
    				localStorage.setItem(pinnedKey, pinned.toString());
    				document.title = title$1;
    			}
    		}
    	};

    	return [
    		title$1,
    		pinned,
    		offcanvas,
    		$isDarkTheme,
    		useOffcanvas,
    		toggleOffcanvas,
    		gutterMouseover,
    		bodyMouseover,
    		togglePin,
    		slots,
    		click_handler,
    		hidden_handler,
    		click_handler_1,
    		click_handler_2,
    		$$scope
    	];
    }

    class Offcanvas_layout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Offcanvas_layout",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get title() {
    		throw new Error("<Offcanvas_layout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Offcanvas_layout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* App\lib\card.svelte generated by Svelte v3.55.1 */

    const file$1 = "App\\lib\\card.svelte";
    const get_footer_slot_changes = dirty => ({});
    const get_footer_slot_context = ctx => ({});

    // (35:4) {#if label}
    function create_if_block_2(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*label*/ ctx[0]);
    			attr_dev(div, "class", "card-label");
    			add_location(div, file$1, 34, 15, 1314);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*label*/ 1) set_data_dev(t, /*label*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(35:4) {#if label}",
    		ctx
    	});

    	return block;
    }

    // (36:4) {#if title}
    function create_if_block_1(ctx) {
    	let h5;
    	let t;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			t = text(/*title*/ ctx[1]);
    			attr_dev(h5, "class", "card-title");
    			add_location(h5, file$1, 35, 15, 1373);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    			append_dev(h5, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(36:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (37:4) {#if subtitle}
    function create_if_block$1(ctx) {
    	let h6;
    	let t;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			t = text(/*subtitle*/ ctx[2]);
    			attr_dev(h6, "class", "card-subtitle mb-2 text-muted");
    			add_location(h6, file$1, 36, 18, 1433);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    			append_dev(h6, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*subtitle*/ 4) set_data_dev(t, /*subtitle*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(37:4) {#if subtitle}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let t2;
    	let p;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let div1_class_value;
    	let div1_style_value;
    	let current;
    	let if_block0 = /*label*/ ctx[0] && create_if_block_2(ctx);
    	let if_block1 = /*title*/ ctx[1] && create_if_block_1(ctx);
    	let if_block2 = /*subtitle*/ ctx[2] && create_if_block$1(ctx);
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);
    	const footer_slot_template = /*#slots*/ ctx[8].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[7], get_footer_slot_context);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			p = element("p");
    			t3 = text(/*text*/ ctx[3]);
    			t4 = space();
    			if (default_slot) default_slot.c();
    			t5 = space();
    			t6 = text(/*footer*/ ctx[4]);
    			t7 = space();
    			if (footer_slot) footer_slot.c();
    			attr_dev(p, "class", "card-text");
    			add_location(p, file$1, 37, 4, 1501);
    			attr_dev(div0, "class", "card-body");
    			add_location(div0, file$1, 33, 2, 1274);
    			attr_dev(div1, "class", div1_class_value = "card " + (/*classes*/ ctx[5] || ''));
    			attr_dev(div1, "style", div1_style_value = /*styles*/ ctx[6] || '');
    			add_location(div1, file$1, 32, 0, 1213);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t1);
    			if (if_block2) if_block2.m(div0, null);
    			append_dev(div0, t2);
    			append_dev(div0, p);
    			append_dev(p, t3);
    			append_dev(p, t4);

    			if (default_slot) {
    				default_slot.m(p, null);
    			}

    			append_dev(div0, t5);
    			append_dev(div0, t6);
    			append_dev(div0, t7);

    			if (footer_slot) {
    				footer_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*label*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*title*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					if_block1.m(div0, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*subtitle*/ ctx[2]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$1(ctx);
    					if_block2.c();
    					if_block2.m(div0, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (!current || dirty & /*text*/ 8) set_data_dev(t3, /*text*/ ctx[3]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*footer*/ 16) set_data_dev(t6, /*footer*/ ctx[4]);

    			if (footer_slot) {
    				if (footer_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						footer_slot,
    						footer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(footer_slot_template, /*$$scope*/ ctx[7], dirty, get_footer_slot_changes),
    						get_footer_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*classes*/ 32 && div1_class_value !== (div1_class_value = "card " + (/*classes*/ ctx[5] || ''))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty & /*styles*/ 64 && div1_style_value !== (div1_style_value = /*styles*/ ctx[6] || '')) {
    				attr_dev(div1, "style", div1_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(footer_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(footer_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (default_slot) default_slot.d(detaching);
    			if (footer_slot) footer_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, ['default','footer']);
    	let { label = "" } = $$props;
    	let { title = "" } = $$props;
    	let { subtitle = "" } = $$props;
    	let { text = "" } = $$props;
    	let { footer = "" } = $$props;
    	let { class: classes = "" } = $$props;
    	let { style: styles = "" } = $$props;
    	const writable_props = ['label', 'title', 'subtitle', 'text', 'footer', 'class', 'style'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('subtitle' in $$props) $$invalidate(2, subtitle = $$props.subtitle);
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    		if ('footer' in $$props) $$invalidate(4, footer = $$props.footer);
    		if ('class' in $$props) $$invalidate(5, classes = $$props.class);
    		if ('style' in $$props) $$invalidate(6, styles = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		label,
    		title,
    		subtitle,
    		text,
    		footer,
    		classes,
    		styles
    	});

    	$$self.$inject_state = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('subtitle' in $$props) $$invalidate(2, subtitle = $$props.subtitle);
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    		if ('footer' in $$props) $$invalidate(4, footer = $$props.footer);
    		if ('classes' in $$props) $$invalidate(5, classes = $$props.classes);
    		if ('styles' in $$props) $$invalidate(6, styles = $$props.styles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [label, title, subtitle, text, footer, classes, styles, $$scope, slots];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			label: 0,
    			title: 1,
    			subtitle: 2,
    			text: 3,
    			footer: 4,
    			class: 5,
    			style: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get label() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subtitle() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subtitle(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get footer() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set footer(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* App\index.svelte generated by Svelte v3.55.1 */
    const file = "App\\index.svelte";

    // (36:16) {#if selectionValue}
    function create_if_block(ctx) {
    	let a;
    	let t;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(/*selectedText*/ ctx[2]);
    			attr_dev(a, "class", "btn btn-primary");
    			attr_dev(a, "href", /*selectionValue*/ ctx[0]);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noreferrer");
    			add_location(a, file, 36, 16, 1786);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectedText*/ 4) set_data_dev(t, /*selectedText*/ ctx[2]);

    			if (dirty & /*selectionValue*/ 1) {
    				attr_dev(a, "href", /*selectionValue*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(36:16) {#if selectionValue}",
    		ctx
    	});

    	return block;
    }

    // (25:8) <Card class="shadow-lg card mt-3">
    function create_default_slot_1(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let option5;
    	let t8;
    	let mounted;
    	let dispose;
    	let if_block = /*selectionValue*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Select What Do You Want to Learn Today";
    			t1 = space();
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Open this select menu";
    			option1 = element("option");
    			option1.textContent = "Building Web apps with ASP.NET Core";
    			option2 = element("option");
    			option2.textContent = "SVELTE: CYBERNETICALLY ENHANCED WEB APPS";
    			option3 = element("option");
    			option3.textContent = "Svlete Tutorial";
    			option4 = element("option");
    			option4.textContent = "Bootstrap";
    			option5 = element("option");
    			option5.textContent = "SASS and SCSS Languague";
    			t8 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "card-title h5");
    			add_location(div0, file, 26, 16, 921);
    			option0.selected = true;
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file, 28, 20, 1137);
    			option1.__value = "https://docs.microsoft.com/aspnet/core";
    			option1.value = option1.__value;
    			add_location(option1, file, 29, 20, 1215);
    			option2.__value = "https://svelte.dev/";
    			option2.value = option2.__value;
    			add_location(option2, file, 30, 20, 1336);
    			option3.__value = "https://svelte.dev/tutorial/basics";
    			option3.value = option3.__value;
    			add_location(option3, file, 31, 20, 1443);
    			option4.__value = "https://getbootstrap.com/docs/";
    			option4.value = option4.__value;
    			add_location(option4, file, 32, 20, 1540);
    			option5.__value = "https://sass-lang.com/guide";
    			option5.value = option5.__value;
    			add_location(option5, file, 33, 20, 1627);
    			attr_dev(select, "class", "form-select form-select-lg mb-3");
    			if (/*selectionValue*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[3].call(select));
    			add_location(select, file, 27, 16, 1010);
    			attr_dev(div1, "class", "card-body");
    			add_location(div1, file, 25, 12, 880);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			append_dev(select, option4);
    			append_dev(select, option5);
    			select_option(select, /*selectionValue*/ ctx[0]);
    			/*select_binding*/ ctx[4](select);
    			append_dev(div1, t8);
    			if (if_block) if_block.m(div1, null);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[3]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectionValue*/ 1) {
    				select_option(select, /*selectionValue*/ ctx[0]);
    			}

    			if (/*selectionValue*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			/*select_binding*/ ctx[4](null);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(25:8) <Card class=\\\"shadow-lg card mt-3\\\">",
    		ctx
    	});

    	return block;
    }

    // (18:0) <Layout>
    function create_default_slot(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				class: "shadow-lg card mt-3",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Hello World from Svelte, Boostrap and Razor";
    			t1 = space();
    			create_component(card.$$.fragment);
    			attr_dev(h1, "class", "text-center text-primary");
    			add_location(h1, file, 20, 8, 711);
    			attr_dev(div, "class", "container pt-4");
    			add_location(div, file, 18, 4, 671);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			mount_component(card, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};

    			if (dirty & /*$$scope, selectionValue, selectedText, selectionElement*/ 39) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(card);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(18:0) <Layout>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let layout;
    	let current;

    	layout = new Offcanvas_layout({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(layout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(layout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const layout_changes = {};

    			if (dirty & /*$$scope, selectionValue, selectedText, selectionElement*/ 39) {
    				layout_changes.$$scope = { dirty, ctx };
    			}

    			layout.$set(layout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let selectedText;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let selectionValue = "";
    	let selectionElement;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		selectionValue = select_value(this);
    		$$invalidate(0, selectionValue);
    	}

    	function select_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			selectionElement = $$value;
    			$$invalidate(1, selectionElement);
    		});
    	}

    	$$self.$capture_state = () => ({
    		Layout: Offcanvas_layout,
    		Card,
    		selectionValue,
    		selectionElement,
    		selectedText
    	});

    	$$self.$inject_state = $$props => {
    		if ('selectionValue' in $$props) $$invalidate(0, selectionValue = $$props.selectionValue);
    		if ('selectionElement' in $$props) $$invalidate(1, selectionElement = $$props.selectionElement);
    		if ('selectedText' in $$props) $$invalidate(2, selectedText = $$props.selectedText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selectionValue, selectionElement*/ 3) {
    			$$invalidate(2, selectedText = selectionValue
    			? selectionElement.options[selectionElement.selectedIndex].innerText
    			: "");
    		}
    	};

    	return [
    		selectionValue,
    		selectionElement,
    		selectedText,
    		select_change_handler,
    		select_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /// <reference types="svelte" />
    var Index_entry = new App({ target: document.body });

    return Index_entry;

})();
//# sourceMappingURL=index.js.map
