var Index = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
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

    // Track which nodes are claimed during hydration. Unclaimed nodes can then be removed from the DOM
    // at the end of hydration without touching the remaining nodes.
    let is_hydrating = false;
    function start_hydrating() {
        is_hydrating = true;
    }
    function end_hydrating() {
        is_hydrating = false;
    }
    function upper_bound(low, high, key, value) {
        // Return first index of value larger than input value in the range [low, high)
        while (low < high) {
            const mid = low + ((high - low) >> 1);
            if (key(mid) <= value) {
                low = mid + 1;
            }
            else {
                high = mid;
            }
        }
        return low;
    }
    function init_hydrate(target) {
        if (target.hydrate_init)
            return;
        target.hydrate_init = true;
        // We know that all children have claim_order values since the unclaimed have been detached
        const children = target.childNodes;
        /*
        * Reorder claimed children optimally.
        * We can reorder claimed children optimally by finding the longest subsequence of
        * nodes that are already claimed in order and only moving the rest. The longest
        * subsequence subsequence of nodes that are claimed in order can be found by
        * computing the longest increasing subsequence of .claim_order values.
        *
        * This algorithm is optimal in generating the least amount of reorder operations
        * possible.
        *
        * Proof:
        * We know that, given a set of reordering operations, the nodes that do not move
        * always form an increasing subsequence, since they do not move among each other
        * meaning that they must be already ordered among each other. Thus, the maximal
        * set of nodes that do not move form a longest increasing subsequence.
        */
        // Compute longest increasing subsequence
        // m: subsequence length j => index k of smallest value that ends an increasing subsequence of length j
        const m = new Int32Array(children.length + 1);
        // Predecessor indices + 1
        const p = new Int32Array(children.length);
        m[0] = -1;
        let longest = 0;
        for (let i = 0; i < children.length; i++) {
            const current = children[i].claim_order;
            // Find the largest subsequence length such that it ends in a value less than our current value
            // upper_bound returns first greater value, so we subtract one
            const seqLen = upper_bound(1, longest + 1, idx => children[m[idx]].claim_order, current) - 1;
            p[i] = m[seqLen] + 1;
            const newLen = seqLen + 1;
            // We can guarantee that current is the smallest value. Otherwise, we would have generated a longer sequence.
            m[newLen] = i;
            longest = Math.max(newLen, longest);
        }
        // The longest increasing subsequence of nodes (initially reversed)
        const lis = [];
        // The rest of the nodes, nodes that will be moved
        const toMove = [];
        let last = children.length - 1;
        for (let cur = m[longest] + 1; cur != 0; cur = p[cur - 1]) {
            lis.push(children[cur - 1]);
            for (; last >= cur; last--) {
                toMove.push(children[last]);
            }
            last--;
        }
        for (; last >= 0; last--) {
            toMove.push(children[last]);
        }
        lis.reverse();
        // We sort the nodes being moved to guarantee that their insertion order matches the claim order
        toMove.sort((a, b) => a.claim_order - b.claim_order);
        // Finally, we move the nodes
        for (let i = 0, j = 0; i < toMove.length; i++) {
            while (j < lis.length && toMove[i].claim_order >= lis[j].claim_order) {
                j++;
            }
            const anchor = j < lis.length ? lis[j] : null;
            target.insertBefore(toMove[i], anchor);
        }
    }
    function append(target, node) {
        if (is_hydrating) {
            init_hydrate(target);
            if ((target.actual_end_child === undefined) || ((target.actual_end_child !== null) && (target.actual_end_child.parentElement !== target))) {
                target.actual_end_child = target.firstChild;
            }
            if (node !== target.actual_end_child) {
                target.insertBefore(node, target.actual_end_child);
            }
            else {
                target.actual_end_child = node.nextSibling;
            }
        }
        else if (node.parentNode !== target) {
            target.appendChild(node);
        }
    }
    function insert(target, node, anchor) {
        if (is_hydrating && !anchor) {
            append(target, node);
        }
        else if (node.parentNode !== target || (anchor && node.nextSibling !== anchor)) {
            target.insertBefore(node, anchor || null);
        }
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
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
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
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
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
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
        flushing = false;
        seen_callbacks.clear();
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
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
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
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
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
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
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
                start_hydrating();
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
            end_hydrating();
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.3' }, detail)));
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

    /* Pages\Index\Index.cshtml.svelte generated by Svelte v3.38.3 */

    const file = "Pages\\Index\\Index.cshtml.svelte";

    function create_fragment(ctx) {
    	let div;
    	let h1;
    	let t0;
    	let t1;
    	let t2;
    	let p0;
    	let t3;
    	let a0;
    	let t5;
    	let t6;
    	let p1;
    	let t7;
    	let a1;
    	let t9;
    	let t10;
    	let p2;
    	let t11;
    	let a2;
    	let t13;
    	let t14;
    	let p3;
    	let t15;
    	let a3;
    	let t17;
    	let t18;
    	let p4;
    	let t19;
    	let a4;
    	let t21;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text("Welcome ");
    			t1 = text(/*name*/ ctx[0]);
    			t2 = space();
    			p0 = element("p");
    			t3 = text("Learn about ");
    			a0 = element("a");
    			a0.textContent = "building Web apps with ASP.NET Core";
    			t5 = text(".");
    			t6 = space();
    			p1 = element("p");
    			t7 = text("Learn about ");
    			a1 = element("a");
    			a1.textContent = "svelte";
    			t9 = text(".");
    			t10 = space();
    			p2 = element("p");
    			t11 = text("Check out awesome ");
    			a2 = element("a");
    			a2.textContent = "svelte tutorial";
    			t13 = text(".");
    			t14 = space();
    			p3 = element("p");
    			t15 = text("See also ");
    			a3 = element("a");
    			a3.textContent = "bootstrap documentation";
    			t17 = text(".");
    			t18 = space();
    			p4 = element("p");
    			t19 = text("And, for better and easier css, you might also want to catch up on ");
    			a4 = element("a");
    			a4.textContent = "scss and sass language";
    			t21 = text(".");
    			attr_dev(h1, "class", "display-4 svelte-1hyzzcm");
    			add_location(h1, file, 4, 4, 80);
    			attr_dev(a0, "href", "https://docs.microsoft.com/aspnet/core");
    			attr_dev(a0, "class", "svelte-1hyzzcm");
    			add_location(a0, file, 9, 20, 170);
    			attr_dev(p0, "class", "svelte-1hyzzcm");
    			add_location(p0, file, 8, 4, 145);
    			attr_dev(a1, "href", "https://svelte.dev/");
    			attr_dev(a1, "class", "svelte-1hyzzcm");
    			add_location(a1, file, 12, 20, 300);
    			attr_dev(p1, "class", "svelte-1hyzzcm");
    			add_location(p1, file, 11, 4, 275);
    			attr_dev(a2, "href", "https://svelte.dev/tutorial/basics");
    			attr_dev(a2, "class", "svelte-1hyzzcm");
    			add_location(a2, file, 15, 26, 388);
    			attr_dev(p2, "class", "svelte-1hyzzcm");
    			add_location(p2, file, 14, 4, 357);
    			attr_dev(a3, "href", "https://getbootstrap.com/docs/5.0/getting-started/introduction/");
    			attr_dev(a3, "class", "svelte-1hyzzcm");
    			add_location(a3, file, 18, 17, 491);
    			attr_dev(p3, "class", "svelte-1hyzzcm");
    			add_location(p3, file, 17, 4, 469);
    			attr_dev(a4, "href", "https://sass-lang.com/guide");
    			attr_dev(a4, "class", "svelte-1hyzzcm");
    			add_location(a4, file, 21, 75, 689);
    			attr_dev(p4, "class", "svelte-1hyzzcm");
    			add_location(p4, file, 20, 4, 609);
    			attr_dev(div, "class", "text-center");
    			add_location(div, file, 3, 0, 49);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(div, t2);
    			append_dev(div, p0);
    			append_dev(p0, t3);
    			append_dev(p0, a0);
    			append_dev(p0, t5);
    			append_dev(div, t6);
    			append_dev(div, p1);
    			append_dev(p1, t7);
    			append_dev(p1, a1);
    			append_dev(p1, t9);
    			append_dev(div, t10);
    			append_dev(div, p2);
    			append_dev(p2, t11);
    			append_dev(p2, a2);
    			append_dev(p2, t13);
    			append_dev(div, t14);
    			append_dev(div, p3);
    			append_dev(p3, t15);
    			append_dev(p3, a3);
    			append_dev(p3, t17);
    			append_dev(div, t18);
    			append_dev(div, p4);
    			append_dev(p4, t19);
    			append_dev(p4, a4);
    			append_dev(p4, t21);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1) set_data_dev(t1, /*name*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Index_cshtml", slots, []);
    	let { name } = $$props;
    	const writable_props = ["name"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Index_cshtml> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ name });

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class Index_cshtml extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index_cshtml",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !("name" in props)) {
    			console.warn("<Index_cshtml> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<Index_cshtml>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Index_cshtml>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.0.2): dom/selector-engine.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    const NODE_TEXT = 3;

    const SelectorEngine = {
      find(selector, element = document.documentElement) {
        return [].concat(...Element.prototype.querySelectorAll.call(element, selector))
      },

      findOne(selector, element = document.documentElement) {
        return Element.prototype.querySelector.call(element, selector)
      },

      children(element, selector) {
        return [].concat(...element.children)
          .filter(child => child.matches(selector))
      },

      parents(element, selector) {
        const parents = [];

        let ancestor = element.parentNode;

        while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
          if (ancestor.matches(selector)) {
            parents.push(ancestor);
          }

          ancestor = ancestor.parentNode;
        }

        return parents
      },

      prev(element, selector) {
        let previous = element.previousElementSibling;

        while (previous) {
          if (previous.matches(selector)) {
            return [previous]
          }

          previous = previous.previousElementSibling;
        }

        return []
      },

      next(element, selector) {
        let next = element.nextElementSibling;

        while (next) {
          if (next.matches(selector)) {
            return [next]
          }

          next = next.nextElementSibling;
        }

        return []
      }
    };

    const MILLISECONDS_MULTIPLIER = 1000;
    const TRANSITION_END = 'transitionend';

    // Shoutout AngusCroll (https://goo.gl/pxwQGp)
    const toType = obj => {
      if (obj === null || obj === undefined) {
        return `${obj}`
      }

      return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase()
    };

    const getSelector = element => {
      let selector = element.getAttribute('data-bs-target');

      if (!selector || selector === '#') {
        let hrefAttr = element.getAttribute('href');

        // The only valid content that could double as a selector are IDs or classes,
        // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
        // `document.querySelector` will rightfully complain it is invalid.
        // See https://github.com/twbs/bootstrap/issues/32273
        if (!hrefAttr || (!hrefAttr.includes('#') && !hrefAttr.startsWith('.'))) {
          return null
        }

        // Just in case some CMS puts out a full URL with the anchor appended
        if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
          hrefAttr = `#${hrefAttr.split('#')[1]}`;
        }

        selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
      }

      return selector
    };

    const getSelectorFromElement = element => {
      const selector = getSelector(element);

      if (selector) {
        return document.querySelector(selector) ? selector : null
      }

      return null
    };

    const getElementFromSelector = element => {
      const selector = getSelector(element);

      return selector ? document.querySelector(selector) : null
    };

    const getTransitionDurationFromElement = element => {
      if (!element) {
        return 0
      }

      // Get transition-duration of the element
      let { transitionDuration, transitionDelay } = window.getComputedStyle(element);

      const floatTransitionDuration = Number.parseFloat(transitionDuration);
      const floatTransitionDelay = Number.parseFloat(transitionDelay);

      // Return 0 if element or transition duration is not found
      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0
      }

      // If multiple durations are defined, take the first
      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];

      return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER
    };

    const triggerTransitionEnd = element => {
      element.dispatchEvent(new Event(TRANSITION_END));
    };

    const isElement = obj => {
      if (!obj || typeof obj !== 'object') {
        return false
      }

      if (typeof obj.jquery !== 'undefined') {
        obj = obj[0];
      }

      return typeof obj.nodeType !== 'undefined'
    };

    const getElement = obj => {
      if (isElement(obj)) { // it's a jQuery object or a node element
        return obj.jquery ? obj[0] : obj
      }

      if (typeof obj === 'string' && obj.length > 0) {
        return SelectorEngine.findOne(obj)
      }

      return null
    };

    const typeCheckConfig = (componentName, config, configTypes) => {
      Object.keys(configTypes).forEach(property => {
        const expectedTypes = configTypes[property];
        const value = config[property];
        const valueType = value && isElement(value) ? 'element' : toType(value);

        if (!new RegExp(expectedTypes).test(valueType)) {
          throw new TypeError(
            `${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`
          )
        }
      });
    };

    const reflow = element => element.offsetHeight;

    const getjQuery = () => {
      const { jQuery } = window;

      if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
        return jQuery
      }

      return null
    };

    const DOMContentLoadedCallbacks = [];

    const onDOMContentLoaded = callback => {
      if (document.readyState === 'loading') {
        // add listener on the first call when the document is in loading state
        if (!DOMContentLoadedCallbacks.length) {
          document.addEventListener('DOMContentLoaded', () => {
            DOMContentLoadedCallbacks.forEach(callback => callback());
          });
        }

        DOMContentLoadedCallbacks.push(callback);
      } else {
        callback();
      }
    };

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
            return plugin.jQueryInterface
          };
        }
      });
    };

    const execute = callback => {
      if (typeof callback === 'function') {
        callback();
      }
    };

    const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
      if (!waitForTransition) {
        execute(callback);
        return
      }

      const durationPadding = 5;
      const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;

      let called = false;

      const handler = ({ target }) => {
        if (target !== transitionElement) {
          return
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
     * --------------------------------------------------------------------------
     * Bootstrap (v5.0.2): dom/data.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    const elementMap = new Map();

    var Data = {
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
          return
        }

        instanceMap.set(key, instance);
      },

      get(element, key) {
        if (elementMap.has(element)) {
          return elementMap.get(element).get(key) || null
        }

        return null
      },

      remove(element, key) {
        if (!elementMap.has(element)) {
          return
        }

        const instanceMap = elementMap.get(element);

        instanceMap.delete(key);

        // free up element references if there are no instances left for an element
        if (instanceMap.size === 0) {
          elementMap.delete(element);
        }
      }
    };

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.0.2): dom/event-handler.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
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
    const customEventsRegex = /^(mouseenter|mouseleave)/i;
    const nativeEvents = new Set([
      'click',
      'dblclick',
      'mouseup',
      'mousedown',
      'contextmenu',
      'mousewheel',
      'DOMMouseScroll',
      'mouseover',
      'mouseout',
      'mousemove',
      'selectstart',
      'selectend',
      'keydown',
      'keypress',
      'keyup',
      'orientationchange',
      'touchstart',
      'touchmove',
      'touchend',
      'touchcancel',
      'pointerdown',
      'pointermove',
      'pointerup',
      'pointerleave',
      'pointercancel',
      'gesturestart',
      'gesturechange',
      'gestureend',
      'focus',
      'blur',
      'change',
      'reset',
      'select',
      'submit',
      'focusin',
      'focusout',
      'load',
      'unload',
      'beforeunload',
      'resize',
      'move',
      'DOMContentLoaded',
      'readystatechange',
      'error',
      'abort',
      'scroll'
    ]);

    /**
     * ------------------------------------------------------------------------
     * Private methods
     * ------------------------------------------------------------------------
     */

    function getUidEvent(element, uid) {
      return (uid && `${uid}::${uidEvent++}`) || element.uidEvent || uidEvent++
    }

    function getEvent(element) {
      const uid = getUidEvent(element);

      element.uidEvent = uid;
      eventRegistry[uid] = eventRegistry[uid] || {};

      return eventRegistry[uid]
    }

    function bootstrapHandler(element, fn) {
      return function handler(event) {
        event.delegateTarget = element;

        if (handler.oneOff) {
          EventHandler.off(element, event.type, fn);
        }

        return fn.apply(element, [event])
      }
    }

    function bootstrapDelegationHandler(element, selector, fn) {
      return function handler(event) {
        const domElements = element.querySelectorAll(selector);

        for (let { target } = event; target && target !== this; target = target.parentNode) {
          for (let i = domElements.length; i--;) {
            if (domElements[i] === target) {
              event.delegateTarget = target;

              if (handler.oneOff) {
                // eslint-disable-next-line unicorn/consistent-destructuring
                EventHandler.off(element, event.type, selector, fn);
              }

              return fn.apply(target, [event])
            }
          }
        }

        // To please ESLint
        return null
      }
    }

    function findHandler(events, handler, delegationSelector = null) {
      const uidEventList = Object.keys(events);

      for (let i = 0, len = uidEventList.length; i < len; i++) {
        const event = events[uidEventList[i]];

        if (event.originalHandler === handler && event.delegationSelector === delegationSelector) {
          return event
        }
      }

      return null
    }

    function normalizeParams(originalTypeEvent, handler, delegationFn) {
      const delegation = typeof handler === 'string';
      const originalHandler = delegation ? delegationFn : handler;

      let typeEvent = getTypeEvent(originalTypeEvent);
      const isNative = nativeEvents.has(typeEvent);

      if (!isNative) {
        typeEvent = originalTypeEvent;
      }

      return [delegation, originalHandler, typeEvent]
    }

    function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
      if (typeof originalTypeEvent !== 'string' || !element) {
        return
      }

      if (!handler) {
        handler = delegationFn;
        delegationFn = null;
      }

      // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
      // this prevents the handler from being dispatched the same way as mouseover or mouseout does
      if (customEventsRegex.test(originalTypeEvent)) {
        const wrapFn = fn => {
          return function (event) {
            if (!event.relatedTarget || (event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget))) {
              return fn.call(this, event)
            }
          }
        };

        if (delegationFn) {
          delegationFn = wrapFn(delegationFn);
        } else {
          handler = wrapFn(handler);
        }
      }

      const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
      const events = getEvent(element);
      const handlers = events[typeEvent] || (events[typeEvent] = {});
      const previousFn = findHandler(handlers, originalHandler, delegation ? handler : null);

      if (previousFn) {
        previousFn.oneOff = previousFn.oneOff && oneOff;

        return
      }

      const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ''));
      const fn = delegation ?
        bootstrapDelegationHandler(element, handler, delegationFn) :
        bootstrapHandler(element, handler);

      fn.delegationSelector = delegation ? handler : null;
      fn.originalHandler = originalHandler;
      fn.oneOff = oneOff;
      fn.uidEvent = uid;
      handlers[uid] = fn;

      element.addEventListener(typeEvent, fn, delegation);
    }

    function removeHandler(element, events, typeEvent, handler, delegationSelector) {
      const fn = findHandler(events[typeEvent], handler, delegationSelector);

      if (!fn) {
        return
      }

      element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
      delete events[typeEvent][fn.uidEvent];
    }

    function removeNamespacedHandlers(element, events, typeEvent, namespace) {
      const storeElementEvent = events[typeEvent] || {};

      Object.keys(storeElementEvent).forEach(handlerKey => {
        if (handlerKey.includes(namespace)) {
          const event = storeElementEvent[handlerKey];

          removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
        }
      });
    }

    function getTypeEvent(event) {
      // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
      event = event.replace(stripNameRegex, '');
      return customEvents[event] || event
    }

    const EventHandler = {
      on(element, event, handler, delegationFn) {
        addHandler(element, event, handler, delegationFn, false);
      },

      one(element, event, handler, delegationFn) {
        addHandler(element, event, handler, delegationFn, true);
      },

      off(element, originalTypeEvent, handler, delegationFn) {
        if (typeof originalTypeEvent !== 'string' || !element) {
          return
        }

        const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
        const inNamespace = typeEvent !== originalTypeEvent;
        const events = getEvent(element);
        const isNamespace = originalTypeEvent.startsWith('.');

        if (typeof originalHandler !== 'undefined') {
          // Simplest case: handler is passed, remove that listener ONLY.
          if (!events || !events[typeEvent]) {
            return
          }

          removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
          return
        }

        if (isNamespace) {
          Object.keys(events).forEach(elementEvent => {
            removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
          });
        }

        const storeElementEvent = events[typeEvent] || {};
        Object.keys(storeElementEvent).forEach(keyHandlers => {
          const handlerKey = keyHandlers.replace(stripUidRegex, '');

          if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
            const event = storeElementEvent[keyHandlers];

            removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
          }
        });
      },

      trigger(element, event, args) {
        if (typeof event !== 'string' || !element) {
          return null
        }

        const $ = getjQuery();
        const typeEvent = getTypeEvent(event);
        const inNamespace = event !== typeEvent;
        const isNative = nativeEvents.has(typeEvent);

        let jQueryEvent;
        let bubbles = true;
        let nativeDispatch = true;
        let defaultPrevented = false;
        let evt = null;

        if (inNamespace && $) {
          jQueryEvent = $.Event(event, args);

          $(element).trigger(jQueryEvent);
          bubbles = !jQueryEvent.isPropagationStopped();
          nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
          defaultPrevented = jQueryEvent.isDefaultPrevented();
        }

        if (isNative) {
          evt = document.createEvent('HTMLEvents');
          evt.initEvent(typeEvent, bubbles, true);
        } else {
          evt = new CustomEvent(event, {
            bubbles,
            cancelable: true
          });
        }

        // merge custom information in our event
        if (typeof args !== 'undefined') {
          Object.keys(args).forEach(key => {
            Object.defineProperty(evt, key, {
              get() {
                return args[key]
              }
            });
          });
        }

        if (defaultPrevented) {
          evt.preventDefault();
        }

        if (nativeDispatch) {
          element.dispatchEvent(evt);
        }

        if (evt.defaultPrevented && typeof jQueryEvent !== 'undefined') {
          jQueryEvent.preventDefault();
        }

        return evt
      }
    };

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.0.2): dom/manipulator.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */

    function normalizeData(val) {
      if (val === 'true') {
        return true
      }

      if (val === 'false') {
        return false
      }

      if (val === Number(val).toString()) {
        return Number(val)
      }

      if (val === '' || val === 'null') {
        return null
      }

      return val
    }

    function normalizeDataKey(key) {
      return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`)
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
          return {}
        }

        const attributes = {};

        Object.keys(element.dataset)
          .filter(key => key.startsWith('bs'))
          .forEach(key => {
            let pureKey = key.replace(/^bs/, '');
            pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
            attributes[pureKey] = normalizeData(element.dataset[key]);
          });

        return attributes
      },

      getDataAttribute(element, key) {
        return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`))
      },

      offset(element) {
        const rect = element.getBoundingClientRect();

        return {
          top: rect.top + document.body.scrollTop,
          left: rect.left + document.body.scrollLeft
        }
      },

      position(element) {
        return {
          top: element.offsetTop,
          left: element.offsetLeft
        }
      }
    };

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.0.2): base-component.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    const VERSION = '5.0.2';

    class BaseComponent {
      constructor(element) {
        element = getElement(element);

        if (!element) {
          return
        }

        this._element = element;
        Data.set(this._element, this.constructor.DATA_KEY, this);
      }

      dispose() {
        Data.remove(this._element, this.constructor.DATA_KEY);
        EventHandler.off(this._element, this.constructor.EVENT_KEY);

        Object.getOwnPropertyNames(this).forEach(propertyName => {
          this[propertyName] = null;
        });
      }

      _queueCallback(callback, element, isAnimated = true) {
        executeAfterTransition(callback, element, isAnimated);
      }

      /** Static */

      static getInstance(element) {
        return Data.get(element, this.DATA_KEY)
      }

      static getOrCreateInstance(element, config = {}) {
        return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null)
      }

      static get VERSION() {
        return VERSION
      }

      static get NAME() {
        throw new Error('You have to implement the static method "NAME", for each component!')
      }

      static get DATA_KEY() {
        return `bs.${this.NAME}`
      }

      static get EVENT_KEY() {
        return `.${this.DATA_KEY}`
      }
    }

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.0.2): collapse.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    const NAME = 'collapse';
    const DATA_KEY = 'bs.collapse';
    const EVENT_KEY = `.${DATA_KEY}`;
    const DATA_API_KEY = '.data-api';

    const Default = {
      toggle: true,
      parent: ''
    };

    const DefaultType = {
      toggle: 'boolean',
      parent: '(string|element)'
    };

    const EVENT_SHOW = `show${EVENT_KEY}`;
    const EVENT_SHOWN = `shown${EVENT_KEY}`;
    const EVENT_HIDE = `hide${EVENT_KEY}`;
    const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
    const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;

    const CLASS_NAME_SHOW = 'show';
    const CLASS_NAME_COLLAPSE = 'collapse';
    const CLASS_NAME_COLLAPSING = 'collapsing';
    const CLASS_NAME_COLLAPSED = 'collapsed';

    const WIDTH = 'width';
    const HEIGHT = 'height';

    const SELECTOR_ACTIVES = '.show, .collapsing';
    const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="collapse"]';

    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    class Collapse extends BaseComponent {
      constructor(element, config) {
        super(element);

        this._isTransitioning = false;
        this._config = this._getConfig(config);
        this._triggerArray = SelectorEngine.find(
          `${SELECTOR_DATA_TOGGLE}[href="#${this._element.id}"],` +
          `${SELECTOR_DATA_TOGGLE}[data-bs-target="#${this._element.id}"]`
        );

        const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE);

        for (let i = 0, len = toggleList.length; i < len; i++) {
          const elem = toggleList[i];
          const selector = getSelectorFromElement(elem);
          const filterElement = SelectorEngine.find(selector)
            .filter(foundElem => foundElem === this._element);

          if (selector !== null && filterElement.length) {
            this._selector = selector;
            this._triggerArray.push(elem);
          }
        }

        this._parent = this._config.parent ? this._getParent() : null;

        if (!this._config.parent) {
          this._addAriaAndCollapsedClass(this._element, this._triggerArray);
        }

        if (this._config.toggle) {
          this.toggle();
        }
      }

      // Getters

      static get Default() {
        return Default
      }

      static get NAME() {
        return NAME
      }

      // Public

      toggle() {
        if (this._element.classList.contains(CLASS_NAME_SHOW)) {
          this.hide();
        } else {
          this.show();
        }
      }

      show() {
        if (this._isTransitioning || this._element.classList.contains(CLASS_NAME_SHOW)) {
          return
        }

        let actives;
        let activesData;

        if (this._parent) {
          actives = SelectorEngine.find(SELECTOR_ACTIVES, this._parent)
            .filter(elem => {
              if (typeof this._config.parent === 'string') {
                return elem.getAttribute('data-bs-parent') === this._config.parent
              }

              return elem.classList.contains(CLASS_NAME_COLLAPSE)
            });

          if (actives.length === 0) {
            actives = null;
          }
        }

        const container = SelectorEngine.findOne(this._selector);
        if (actives) {
          const tempActiveData = actives.find(elem => container !== elem);
          activesData = tempActiveData ? Collapse.getInstance(tempActiveData) : null;

          if (activesData && activesData._isTransitioning) {
            return
          }
        }

        const startEvent = EventHandler.trigger(this._element, EVENT_SHOW);
        if (startEvent.defaultPrevented) {
          return
        }

        if (actives) {
          actives.forEach(elemActive => {
            if (container !== elemActive) {
              Collapse.collapseInterface(elemActive, 'hide');
            }

            if (!activesData) {
              Data.set(elemActive, DATA_KEY, null);
            }
          });
        }

        const dimension = this._getDimension();

        this._element.classList.remove(CLASS_NAME_COLLAPSE);
        this._element.classList.add(CLASS_NAME_COLLAPSING);

        this._element.style[dimension] = 0;

        if (this._triggerArray.length) {
          this._triggerArray.forEach(element => {
            element.classList.remove(CLASS_NAME_COLLAPSED);
            element.setAttribute('aria-expanded', true);
          });
        }

        this.setTransitioning(true);

        const complete = () => {
          this._element.classList.remove(CLASS_NAME_COLLAPSING);
          this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);

          this._element.style[dimension] = '';

          this.setTransitioning(false);

          EventHandler.trigger(this._element, EVENT_SHOWN);
        };

        const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
        const scrollSize = `scroll${capitalizedDimension}`;

        this._queueCallback(complete, this._element, true);
        this._element.style[dimension] = `${this._element[scrollSize]}px`;
      }

      hide() {
        if (this._isTransitioning || !this._element.classList.contains(CLASS_NAME_SHOW)) {
          return
        }

        const startEvent = EventHandler.trigger(this._element, EVENT_HIDE);
        if (startEvent.defaultPrevented) {
          return
        }

        const dimension = this._getDimension();

        this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;

        reflow(this._element);

        this._element.classList.add(CLASS_NAME_COLLAPSING);
        this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);

        const triggerArrayLength = this._triggerArray.length;
        if (triggerArrayLength > 0) {
          for (let i = 0; i < triggerArrayLength; i++) {
            const trigger = this._triggerArray[i];
            const elem = getElementFromSelector(trigger);

            if (elem && !elem.classList.contains(CLASS_NAME_SHOW)) {
              trigger.classList.add(CLASS_NAME_COLLAPSED);
              trigger.setAttribute('aria-expanded', false);
            }
          }
        }

        this.setTransitioning(true);

        const complete = () => {
          this.setTransitioning(false);
          this._element.classList.remove(CLASS_NAME_COLLAPSING);
          this._element.classList.add(CLASS_NAME_COLLAPSE);
          EventHandler.trigger(this._element, EVENT_HIDDEN);
        };

        this._element.style[dimension] = '';

        this._queueCallback(complete, this._element, true);
      }

      setTransitioning(isTransitioning) {
        this._isTransitioning = isTransitioning;
      }

      // Private

      _getConfig(config) {
        config = {
          ...Default,
          ...config
        };
        config.toggle = Boolean(config.toggle); // Coerce string values
        typeCheckConfig(NAME, config, DefaultType);
        return config
      }

      _getDimension() {
        return this._element.classList.contains(WIDTH) ? WIDTH : HEIGHT
      }

      _getParent() {
        let { parent } = this._config;

        parent = getElement(parent);

        const selector = `${SELECTOR_DATA_TOGGLE}[data-bs-parent="${parent}"]`;

        SelectorEngine.find(selector, parent)
          .forEach(element => {
            const selected = getElementFromSelector(element);

            this._addAriaAndCollapsedClass(
              selected,
              [element]
            );
          });

        return parent
      }

      _addAriaAndCollapsedClass(element, triggerArray) {
        if (!element || !triggerArray.length) {
          return
        }

        const isOpen = element.classList.contains(CLASS_NAME_SHOW);

        triggerArray.forEach(elem => {
          if (isOpen) {
            elem.classList.remove(CLASS_NAME_COLLAPSED);
          } else {
            elem.classList.add(CLASS_NAME_COLLAPSED);
          }

          elem.setAttribute('aria-expanded', isOpen);
        });
      }

      // Static

      static collapseInterface(element, config) {
        let data = Collapse.getInstance(element);
        const _config = {
          ...Default,
          ...Manipulator.getDataAttributes(element),
          ...(typeof config === 'object' && config ? config : {})
        };

        if (!data && _config.toggle && typeof config === 'string' && /show|hide/.test(config)) {
          _config.toggle = false;
        }

        if (!data) {
          data = new Collapse(element, _config);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`)
          }

          data[config]();
        }
      }

      static jQueryInterface(config) {
        return this.each(function () {
          Collapse.collapseInterface(this, config);
        })
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */

    EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
      // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
      if (event.target.tagName === 'A' || (event.delegateTarget && event.delegateTarget.tagName === 'A')) {
        event.preventDefault();
      }

      const triggerData = Manipulator.getDataAttributes(this);
      const selector = getSelectorFromElement(this);
      const selectorElements = SelectorEngine.find(selector);

      selectorElements.forEach(element => {
        const data = Collapse.getInstance(element);
        let config;
        if (data) {
          // update parent attribute
          if (data._parent === null && typeof triggerData.parent === 'string') {
            data._config.parent = triggerData.parent;
            data._parent = data._getParent();
          }

          config = 'toggle';
        } else {
          config = triggerData;
        }

        Collapse.collapseInterface(element, config);
      });
    });

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Collapse to jQuery only if jQuery is present
     */

    defineJQueryPlugin(Collapse);

    /// <reference types="svelte" />
    const index = new Index_cshtml({
        target: document.getElementsByClassName("index")[0],
        props: {
            name: "world from svelte"
        }
    });

    return index;

}());
//# sourceMappingURL=Index.js.map
