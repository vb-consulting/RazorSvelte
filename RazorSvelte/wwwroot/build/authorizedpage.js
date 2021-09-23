var authorizedpage=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function r(t){t.forEach(e)}function s(t){return"function"==typeof t}function o(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function i(t,e,n,r){return t[1]&&r?function(t,e){for(const n in e)t[n]=e[n];return t}(n.ctx.slice(),t[1](r(e))):n.ctx}function l(t,e){t.appendChild(e)}function a(t,e,n){t.insertBefore(e,n||null)}function c(t){t.parentNode.removeChild(t)}function u(t){return document.createElement(t)}function d(t){return document.createTextNode(t)}function f(){return d(" ")}function g(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}let h;function p(t){h=t}const m=[],b=[],v=[],y=[],_=Promise.resolve();let $=!1;function E(t){v.push(t)}let A=!1;const w=new Set;function x(){if(!A){A=!0;do{for(let t=0;t<m.length;t+=1){const e=m[t];p(e),C(e.$$)}for(p(null),m.length=0;b.length;)b.pop()();for(let t=0;t<v.length;t+=1){const e=v[t];w.has(e)||(w.add(e),e())}v.length=0}while(m.length);for(;y.length;)y.pop()();$=!1,A=!1,w.clear()}}function C(t){if(null!==t.fragment){t.update(),r(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(E)}}const T=new Set;function S(t,e){t&&t.i&&(T.delete(t),t.i(e))}function O(t,e,n,r){if(t&&t.o){if(T.has(t))return;T.add(t),undefined.c.push((()=>{T.delete(t),r&&(n&&t.d(1),r())})),t.o(e)}}function N(t){t&&t.c()}function L(t,n,o,i){const{fragment:l,on_mount:a,on_destroy:c,after_update:u}=t.$$;l&&l.m(n,o),i||E((()=>{const n=a.map(e).filter(s);c?c.push(...n):r(n),t.$$.on_mount=[]})),u.forEach(E)}function k(t,e){const n=t.$$;null!==n.fragment&&(r(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function D(t,e){-1===t.$$.dirty[0]&&(m.push(t),$||($=!0,_.then(x)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function j(e,s,o,i,l,a,u,d=[-1]){const f=h;p(e);const g=e.$$={fragment:null,ctx:null,props:a,update:t,not_equal:l,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(s.context||(f?f.$$.context:[])),callbacks:n(),dirty:d,skip_bound:!1,root:s.target||f.$$.root};u&&u(g.root);let m=!1;if(g.ctx=o?o(e,s.props||{},((t,n,...r)=>{const s=r.length?r[0]:n;return g.ctx&&l(g.ctx[t],g.ctx[t]=s)&&(!g.skip_bound&&g.bound[t]&&g.bound[t](s),m&&D(e,t)),n})):[],g.update(),m=!0,r(g.before_update),g.fragment=!!i&&i(g.ctx),s.target){if(s.hydrate){const t=function(t){return Array.from(t.childNodes)}(s.target);g.fragment&&g.fragment.l(t),t.forEach(c)}else g.fragment&&g.fragment.c();s.intro&&S(e.$$.fragment),L(e,s.target,s.anchor,s.customElement),x()}p(f)}class M{$destroy(){k(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const z=t=>JSON.parse((t=>{let e=document.querySelector(`input#${t}[type=hidden]`);if(!e)return null;let n=e.value;return e.remove(),n})(t)),q=z("urls");function P(e){let n,r;return{c(){n=u("a"),r=d("Login"),g(n,"class","btn btn-outline-success"),g(n,"href",q.loginUrl)},m(t,e){a(t,n,e),l(n,r)},p:t,d(t){t&&c(n)}}}function I(e){let n,r,s,o,i;return{c(){n=u("div"),r=u("div"),r.textContent=`${e[0].email}`,s=f(),o=u("a"),i=d("Logout"),g(r,"class","nav-item p-2"),g(o,"class","btn btn-outline-success"),g(o,"href",q.logoutUrl),g(n,"class","navbar-nav")},m(t,e){a(t,n,e),l(n,r),l(n,s),l(n,o),l(o,i)},p:t,d(t){t&&c(n)}}}function U(e){let n,r,s,o,i,h,p,m,b,v,y,_,$,E,A,w,x,C,T,S,O,N,L,k,D,j,M,z;let U=function(t,e){return t[0].isSigned?I:P}(e),Y=U(e);return{c(){n=f(),r=u("header"),s=u("nav"),o=u("div"),i=u("a"),h=d("RazorSvelte"),p=f(),m=u("button"),m.innerHTML='<span class="navbar-toggler-icon"></span>',b=f(),v=u("div"),y=u("ul"),_=u("li"),$=u("a"),E=d("Home"),A=f(),w=u("li"),x=u("a"),C=d("Privacy"),T=f(),S=u("li"),O=u("a"),N=d("Authorized Access"),L=f(),k=u("li"),D=u("a"),j=d("Spa Example"),M=f(),z=u("div"),Y.c(),g(i,"class","navbar-brand"),g(i,"href",q.indexUrl),g(m,"class","navbar-toggler"),g(m,"type","button"),g(m,"data-bs-toggle","collapse"),g(m,"data-bs-target","#navbarCollapse"),g(m,"aria-controls","navbarCollapse"),g(m,"aria-expanded","false"),g(m,"aria-label","Toggle navigation"),g($,"class","nav-link active"),g($,"href",q.indexUrl),g(_,"class","nav-item"),g(x,"class","nav-link"),g(x,"href",q.privacyUrl),g(w,"class","nav-item"),g(O,"class","nav-link"),g(O,"href",q.authorizedUrl),g(S,"class","nav-item"),g(D,"class","nav-link"),g(D,"href",q.spaUrl),g(k,"class","nav-item"),g(y,"class","navbar-nav me-auto mb-2 mb-md-0"),g(z,"class","d-flex"),g(v,"class","collapse navbar-collapse"),g(v,"id","navbarCollapse"),g(o,"class","container-fluid"),g(s,"class","navbar navbar-expand-md navbar-light fixed-top bg-light")},m(t,e){a(t,n,e),a(t,r,e),l(r,s),l(s,o),l(o,i),l(i,h),l(o,p),l(o,m),l(o,b),l(o,v),l(v,y),l(y,_),l(_,$),l($,E),l(y,A),l(y,w),l(w,x),l(x,C),l(y,T),l(y,S),l(S,O),l(O,N),l(y,L),l(y,k),l(k,D),l(D,j),l(v,M),l(v,z),Y.m(z,null)},p(t,[e]){Y.p(t,e)},i:t,o:t,d(t){t&&c(n),t&&c(r),Y.d()}}}function Y(t){return[(()=>{const t={},e=[];for(let n of document.getElementsByTagName("input"))"hidden"==n.type&&(n.id.startsWith("is")?t[n.id]="true"==n.value.toLowerCase():t[n.id]=n.value,e.push(n));for(let t of e)t.remove();return t})()]}class B extends M{constructor(t){super(),j(this,t,Y,U,o,{})}}function H(e){let n,r,s,o,i,h,p;return{c(){n=f(),r=u("footer"),s=u("div"),o=u("span"),i=d("© 2021 - RazorSvelte - "),h=u("a"),p=d("Privacy"),g(h,"href",q.privacyUrl),g(o,"class","text-muted"),g(s,"class","container py-5"),g(r,"class","footer mt-auto py-3 bg-light")},m(t,e){a(t,n,e),a(t,r,e),l(r,s),l(s,o),l(o,i),l(o,h),l(h,p)},p:t,i:t,o:t,d(t){t&&c(n),t&&c(r)}}}class K extends M{constructor(t){super(),j(this,t,null,H,o,{})}}function R(t){let e,n,r,s,o,l;e=new B({});const d=t[1].default,g=function(t,e,n,r){if(t){const s=i(t,e,n,r);return t[0](s)}}(d,t,t[0],null);return o=new K({}),{c(){N(e.$$.fragment),n=f(),r=u("main"),g&&g.c(),s=f(),N(o.$$.fragment)},m(t,i){L(e,t,i),a(t,n,i),a(t,r,i),g&&g.m(r,null),a(t,s,i),L(o,t,i),l=!0},p(t,[e]){g&&g.p&&(!l||1&e)&&function(t,e,n,r,s,o){if(s){const l=i(e,n,r,o);t.p(l,s)}}(g,d,t,t[0],l?function(t,e,n,r){if(t[2]&&r){const s=t[2](r(n));if(void 0===e.dirty)return s;if("object"==typeof s){const t=[],n=Math.max(e.dirty.length,s.length);for(let r=0;r<n;r+=1)t[r]=e.dirty[r]|s[r];return t}return e.dirty|s}return e.dirty}(d,t[0],e,null):function(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let t=0;t<n;t++)e[t]=-1;return e}return-1}(t[0]),null)},i(t){l||(S(e.$$.fragment,t),S(g,t),S(o.$$.fragment,t),l=!0)},o(t){O(e.$$.fragment,t),O(g,t),O(o.$$.fragment,t),l=!1},d(t){k(e,t),t&&c(n),t&&c(r),g&&g.d(t),t&&c(s),k(o,t)}}}function W(t,e,n){let{$$slots:r={},$$scope:s}=e;return t.$$set=t=>{"$$scope"in t&&n(0,s=t.$$scope)},[s,r]}class F extends M{constructor(t){super(),j(this,t,W,R,o,{})}}function Q(e){let n,r,s,o,i,d,h,p,m,b,v;return{c(){n=u("div"),r=u("h1"),r.textContent="Authorized Access Page",s=f(),o=u("ul"),i=u("li"),i.textContent=`Name: ${e[0].name}`,d=f(),h=u("li"),h.textContent=`Email: ${e[0].email}`,p=f(),m=u("li"),m.textContent=`Timezone: ${e[0].timezone}`,b=f(),v=u("li"),v.textContent=`Timestamp: ${e[0].timestamp}`,g(i,"class","list-group-item"),g(h,"class","list-group-item"),g(m,"class","list-group-item"),g(v,"class","list-group-item"),g(o,"class","list-group list-group-flush"),g(n,"class","container text-center m-5")},m(t,e){a(t,n,e),l(n,r),l(n,s),l(n,o),l(o,i),l(o,d),l(o,h),l(o,p),l(o,m),l(o,b),l(o,v)},p:t,d(t){t&&c(n)}}}function V(t){let e,n;return e=new F({props:{$$slots:{default:[Q]},$$scope:{ctx:t}}}),{c(){N(e.$$.fragment)},m(t,r){L(e,t,r),n=!0},p(t,[n]){const r={};2&n&&(r.$$scope={dirty:n,ctx:t}),e.$set(r)},i(t){n||(S(e.$$.fragment,t),n=!0)},o(t){O(e.$$.fragment,t),n=!1},d(t){k(e,t)}}}function J(t){return[z("user")]}const X="transitionend",Z=t=>{let e=t.getAttribute("data-bs-target");if(!e||"#"===e){let n=t.getAttribute("href");if(!n||!n.includes("#")&&!n.startsWith("."))return null;n.includes("#")&&!n.startsWith("#")&&(n=`#${n.split("#")[1]}`),e=n&&"#"!==n?n.trim():null}return e},G=t=>{const e=Z(t);return e&&document.querySelector(e)?e:null},tt=t=>{const e=Z(t);return e?document.querySelector(e):null},et=t=>!(!t||"object"!=typeof t)&&(void 0!==t.jquery&&(t=t[0]),void 0!==t.nodeType),nt=t=>et(t)?t.jquery?t[0]:t:"string"==typeof t&&t.length>0?document.querySelector(t):null,rt=()=>{const{jQuery:t}=window;return t&&!document.body.hasAttribute("data-bs-no-jquery")?t:null},st=[],ot=t=>{"function"==typeof t&&t()},it=(t,e,n=!0)=>{if(!n)return void ot(t);const r=(t=>{if(!t)return 0;let{transitionDuration:e,transitionDelay:n}=window.getComputedStyle(t);const r=Number.parseFloat(e),s=Number.parseFloat(n);return r||s?(e=e.split(",")[0],n=n.split(",")[0],1e3*(Number.parseFloat(e)+Number.parseFloat(n))):0})(e)+5;let s=!1;const o=({target:n})=>{n===e&&(s=!0,e.removeEventListener(X,o),ot(t))};e.addEventListener(X,o),setTimeout((()=>{s||(t=>{t.dispatchEvent(new Event(X))})(e)}),r)},lt=new Map;var at={set(t,e,n){lt.has(t)||lt.set(t,new Map);const r=lt.get(t);r.has(e)||0===r.size?r.set(e,n):console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(r.keys())[0]}.`)},get:(t,e)=>lt.has(t)&&lt.get(t).get(e)||null,remove(t,e){if(!lt.has(t))return;const n=lt.get(t);n.delete(e),0===n.size&&lt.delete(t)}};const ct=/[^.]*(?=\..*)\.|.*/,ut=/\..*/,dt=/::\d+$/,ft={};let gt=1;const ht={mouseenter:"mouseover",mouseleave:"mouseout"},pt=/^(mouseenter|mouseleave)/i,mt=new Set(["click","dblclick","mouseup","mousedown","contextmenu","mousewheel","DOMMouseScroll","mouseover","mouseout","mousemove","selectstart","selectend","keydown","keypress","keyup","orientationchange","touchstart","touchmove","touchend","touchcancel","pointerdown","pointermove","pointerup","pointerleave","pointercancel","gesturestart","gesturechange","gestureend","focus","blur","change","reset","select","submit","focusin","focusout","load","unload","beforeunload","resize","move","DOMContentLoaded","readystatechange","error","abort","scroll"]);function bt(t,e){return e&&`${e}::${gt++}`||t.uidEvent||gt++}function vt(t){const e=bt(t);return t.uidEvent=e,ft[e]=ft[e]||{},ft[e]}function yt(t,e,n=null){const r=Object.keys(t);for(let s=0,o=r.length;s<o;s++){const o=t[r[s]];if(o.originalHandler===e&&o.delegationSelector===n)return o}return null}function _t(t,e,n){const r="string"==typeof e,s=r?n:e;let o=At(t);return mt.has(o)||(o=t),[r,s,o]}function $t(t,e,n,r,s){if("string"!=typeof e||!t)return;if(n||(n=r,r=null),pt.test(e)){const t=t=>function(e){if(!e.relatedTarget||e.relatedTarget!==e.delegateTarget&&!e.delegateTarget.contains(e.relatedTarget))return t.call(this,e)};r?r=t(r):n=t(n)}const[o,i,l]=_t(e,n,r),a=vt(t),c=a[l]||(a[l]={}),u=yt(c,i,o?n:null);if(u)return void(u.oneOff=u.oneOff&&s);const d=bt(i,e.replace(ct,"")),f=o?function(t,e,n){return function r(s){const o=t.querySelectorAll(e);for(let{target:i}=s;i&&i!==this;i=i.parentNode)for(let l=o.length;l--;)if(o[l]===i)return s.delegateTarget=i,r.oneOff&&wt.off(t,s.type,e,n),n.apply(i,[s]);return null}}(t,n,r):function(t,e){return function n(r){return r.delegateTarget=t,n.oneOff&&wt.off(t,r.type,e),e.apply(t,[r])}}(t,n);f.delegationSelector=o?n:null,f.originalHandler=i,f.oneOff=s,f.uidEvent=d,c[d]=f,t.addEventListener(l,f,o)}function Et(t,e,n,r,s){const o=yt(e[n],r,s);o&&(t.removeEventListener(n,o,Boolean(s)),delete e[n][o.uidEvent])}function At(t){return t=t.replace(ut,""),ht[t]||t}const wt={on(t,e,n,r){$t(t,e,n,r,!1)},one(t,e,n,r){$t(t,e,n,r,!0)},off(t,e,n,r){if("string"!=typeof e||!t)return;const[s,o,i]=_t(e,n,r),l=i!==e,a=vt(t),c=e.startsWith(".");if(void 0!==o){if(!a||!a[i])return;return void Et(t,a,i,o,s?n:null)}c&&Object.keys(a).forEach((n=>{!function(t,e,n,r){const s=e[n]||{};Object.keys(s).forEach((o=>{if(o.includes(r)){const r=s[o];Et(t,e,n,r.originalHandler,r.delegationSelector)}}))}(t,a,n,e.slice(1))}));const u=a[i]||{};Object.keys(u).forEach((n=>{const r=n.replace(dt,"");if(!l||e.includes(r)){const e=u[n];Et(t,a,i,e.originalHandler,e.delegationSelector)}}))},trigger(t,e,n){if("string"!=typeof e||!t)return null;const r=rt(),s=At(e),o=e!==s,i=mt.has(s);let l,a=!0,c=!0,u=!1,d=null;return o&&r&&(l=r.Event(e,n),r(t).trigger(l),a=!l.isPropagationStopped(),c=!l.isImmediatePropagationStopped(),u=l.isDefaultPrevented()),i?(d=document.createEvent("HTMLEvents"),d.initEvent(s,a,!0)):d=new CustomEvent(e,{bubbles:a,cancelable:!0}),void 0!==n&&Object.keys(n).forEach((t=>{Object.defineProperty(d,t,{get:()=>n[t]})})),u&&d.preventDefault(),c&&t.dispatchEvent(d),d.defaultPrevented&&void 0!==l&&l.preventDefault(),d}};function xt(t){return"true"===t||"false"!==t&&(t===Number(t).toString()?Number(t):""===t||"null"===t?null:t)}function Ct(t){return t.replace(/[A-Z]/g,(t=>`-${t.toLowerCase()}`))}const Tt={setDataAttribute(t,e,n){t.setAttribute(`data-bs-${Ct(e)}`,n)},removeDataAttribute(t,e){t.removeAttribute(`data-bs-${Ct(e)}`)},getDataAttributes(t){if(!t)return{};const e={};return Object.keys(t.dataset).filter((t=>t.startsWith("bs"))).forEach((n=>{let r=n.replace(/^bs/,"");r=r.charAt(0).toLowerCase()+r.slice(1,r.length),e[r]=xt(t.dataset[n])})),e},getDataAttribute:(t,e)=>xt(t.getAttribute(`data-bs-${Ct(e)}`)),offset(t){const e=t.getBoundingClientRect();return{top:e.top+window.pageYOffset,left:e.left+window.pageXOffset}},position:t=>({top:t.offsetTop,left:t.offsetLeft})},St={find:(t,e=document.documentElement)=>[].concat(...Element.prototype.querySelectorAll.call(e,t)),findOne:(t,e=document.documentElement)=>Element.prototype.querySelector.call(e,t),children:(t,e)=>[].concat(...t.children).filter((t=>t.matches(e))),parents(t,e){const n=[];let r=t.parentNode;for(;r&&r.nodeType===Node.ELEMENT_NODE&&3!==r.nodeType;)r.matches(e)&&n.push(r),r=r.parentNode;return n},prev(t,e){let n=t.previousElementSibling;for(;n;){if(n.matches(e))return[n];n=n.previousElementSibling}return[]},next(t,e){let n=t.nextElementSibling;for(;n;){if(n.matches(e))return[n];n=n.nextElementSibling}return[]},focusableChildren(t){const e=["a","button","input","textarea","select","details","[tabindex]",'[contenteditable="true"]'].map((t=>`${t}:not([tabindex^="-"])`)).join(", ");return this.find(e,t).filter((t=>!(t=>!t||t.nodeType!==Node.ELEMENT_NODE||!!t.classList.contains("disabled")||(void 0!==t.disabled?t.disabled:t.hasAttribute("disabled")&&"false"!==t.getAttribute("disabled")))(t)&&(t=>!(!et(t)||0===t.getClientRects().length)&&"visible"===getComputedStyle(t).getPropertyValue("visibility"))(t)))}};const Ot="collapse",Nt="bs.collapse",Lt={toggle:!0,parent:null},kt={toggle:"boolean",parent:"(null|element)"},Dt="show",jt="collapse",Mt="collapsing",zt="collapsed",qt='[data-bs-toggle="collapse"]';class Pt extends class{constructor(t){(t=nt(t))&&(this._element=t,at.set(this._element,this.constructor.DATA_KEY,this))}dispose(){at.remove(this._element,this.constructor.DATA_KEY),wt.off(this._element,this.constructor.EVENT_KEY),Object.getOwnPropertyNames(this).forEach((t=>{this[t]=null}))}_queueCallback(t,e,n=!0){it(t,e,n)}static getInstance(t){return at.get(nt(t),this.DATA_KEY)}static getOrCreateInstance(t,e={}){return this.getInstance(t)||new this(t,"object"==typeof e?e:null)}static get VERSION(){return"5.1.1"}static get NAME(){throw new Error('You have to implement the static method "NAME", for each component!')}static get DATA_KEY(){return`bs.${this.NAME}`}static get EVENT_KEY(){return`.${this.DATA_KEY}`}}{constructor(t,e){super(t),this._isTransitioning=!1,this._config=this._getConfig(e),this._triggerArray=[];const n=St.find(qt);for(let t=0,e=n.length;t<e;t++){const e=n[t],r=G(e),s=St.find(r).filter((t=>t===this._element));null!==r&&s.length&&(this._selector=r,this._triggerArray.push(e))}this._initializeChildren(),this._config.parent||this._addAriaAndCollapsedClass(this._triggerArray,this._isShown()),this._config.toggle&&this.toggle()}static get Default(){return Lt}static get NAME(){return Ot}toggle(){this._isShown()?this.hide():this.show()}show(){if(this._isTransitioning||this._isShown())return;let t,e=[];if(this._config.parent){const t=St.find(".collapse .collapse",this._config.parent);e=St.find(".collapse.show, .collapse.collapsing",this._config.parent).filter((e=>!t.includes(e)))}const n=St.findOne(this._selector);if(e.length){const r=e.find((t=>n!==t));if(t=r?Pt.getInstance(r):null,t&&t._isTransitioning)return}if(wt.trigger(this._element,"show.bs.collapse").defaultPrevented)return;e.forEach((e=>{n!==e&&Pt.getOrCreateInstance(e,{toggle:!1}).hide(),t||at.set(e,Nt,null)}));const r=this._getDimension();this._element.classList.remove(jt),this._element.classList.add(Mt),this._element.style[r]=0,this._addAriaAndCollapsedClass(this._triggerArray,!0),this._isTransitioning=!0;const s=`scroll${r[0].toUpperCase()+r.slice(1)}`;this._queueCallback((()=>{this._isTransitioning=!1,this._element.classList.remove(Mt),this._element.classList.add(jt,Dt),this._element.style[r]="",wt.trigger(this._element,"shown.bs.collapse")}),this._element,!0),this._element.style[r]=`${this._element[s]}px`}hide(){if(this._isTransitioning||!this._isShown())return;if(wt.trigger(this._element,"hide.bs.collapse").defaultPrevented)return;const t=this._getDimension();this._element.style[t]=`${this._element.getBoundingClientRect()[t]}px`,(t=>{t.offsetHeight})(this._element),this._element.classList.add(Mt),this._element.classList.remove(jt,Dt);const e=this._triggerArray.length;for(let t=0;t<e;t++){const e=this._triggerArray[t],n=tt(e);n&&!this._isShown(n)&&this._addAriaAndCollapsedClass([e],!1)}this._isTransitioning=!0;this._element.style[t]="",this._queueCallback((()=>{this._isTransitioning=!1,this._element.classList.remove(Mt),this._element.classList.add(jt),wt.trigger(this._element,"hidden.bs.collapse")}),this._element,!0)}_isShown(t=this._element){return t.classList.contains(Dt)}_getConfig(t){return(t={...Lt,...Tt.getDataAttributes(this._element),...t}).toggle=Boolean(t.toggle),t.parent=nt(t.parent),((t,e,n)=>{Object.keys(n).forEach((r=>{const s=n[r],o=e[r],i=o&&et(o)?"element":null==(l=o)?`${l}`:{}.toString.call(l).match(/\s([a-z]+)/i)[1].toLowerCase();var l;if(!new RegExp(s).test(i))throw new TypeError(`${t.toUpperCase()}: Option "${r}" provided type "${i}" but expected type "${s}".`)}))})(Ot,t,kt),t}_getDimension(){return this._element.classList.contains("collapse-horizontal")?"width":"height"}_initializeChildren(){if(!this._config.parent)return;const t=St.find(".collapse .collapse",this._config.parent);St.find(qt,this._config.parent).filter((e=>!t.includes(e))).forEach((t=>{const e=tt(t);e&&this._addAriaAndCollapsedClass([t],this._isShown(e))}))}_addAriaAndCollapsedClass(t,e){t.length&&t.forEach((t=>{e?t.classList.remove(zt):t.classList.add(zt),t.setAttribute("aria-expanded",e)}))}static jQueryInterface(t){return this.each((function(){const e={};"string"==typeof t&&/show|hide/.test(t)&&(e.toggle=!1);const n=Pt.getOrCreateInstance(this,e);if("string"==typeof t){if(void 0===n[t])throw new TypeError(`No method named "${t}"`);n[t]()}}))}}var It,Ut;return wt.on(document,"click.bs.collapse.data-api",qt,(function(t){("A"===t.target.tagName||t.delegateTarget&&"A"===t.delegateTarget.tagName)&&t.preventDefault();const e=G(this);St.find(e).forEach((t=>{Pt.getOrCreateInstance(t,{toggle:!1}).toggle()}))})),It=Pt,Ut=()=>{const t=rt();if(t){const e=It.NAME,n=t.fn[e];t.fn[e]=It.jQueryInterface,t.fn[e].Constructor=It,t.fn[e].noConflict=()=>(t.fn[e]=n,It.jQueryInterface)}},"loading"===document.readyState?(st.length||document.addEventListener("DOMContentLoaded",(()=>{st.forEach((t=>t()))})),st.push(Ut)):Ut(),new class extends M{constructor(t){super(),j(this,t,J,V,o,{})}}({target:document.body})}();
