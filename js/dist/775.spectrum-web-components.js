"use strict";(globalThis.webpackChunk_adobe_helix_importer_ui=globalThis.webpackChunk_adobe_helix_importer_ui||[]).push([[775],{415:(a,r,t)=>{t.d(r,{I:()=>i,L:()=>e});var n=t(367);const i=a=>a.querySelector(n.x),e=a=>a.assignedElements().find((a=>a.matches(n.x)))},775:(a,r,t)=>{var n=t(463),i=t(618),e=t(352);const o=i.AH`
    :host{pointer-events:none;visibility:hidden;opacity:0;transition:transform var(--mod-overlay-animation-duration,var(--spectrum-animation-duration-100,.13s))ease-in-out,opacity var(--mod-overlay-animation-duration,var(--spectrum-animation-duration-100,.13s))ease-in-out,visibility 0s linear var(--mod-overlay-animation-duration,var(--spectrum-animation-duration-100,.13s))}:host([open]){pointer-events:auto;visibility:visible;opacity:1;transition-delay:var(--mod-overlay-animation-duration-opened,var(--spectrum-animation-duration-0,0s))}:host{--spectrum-underlay-background-entry-animation-delay:var(--spectrum-animation-duration-0);--spectrum-underlay-background-exit-animation-ease:var(--spectrum-animation-ease-in);--spectrum-underlay-background-entry-animation-ease:var(--spectrum-animation-ease-out);--spectrum-underlay-background-exit-animation-duration:var(--spectrum-animation-duration-100);--spectrum-underlay-background-entry-animation-duration:var(--spectrum-animation-duration-600);--spectrum-underlay-background-exit-animation-duration:var(--spectrum-animation-duration-300);--spectrum-underlay-background-exit-animation-delay:var(--spectrum-animation-duration-200);--spectrum-underlay-background-color:rgba(var(--spectrum-black-rgb),var(--spectrum-overlay-opacity));background-color:var(--mod-underlay-background-color,var(--spectrum-underlay-background-color));z-index:1;transition:opacity var(--mod-underlay-background-exit-animation-duration,var(--spectrum-underlay-background-exit-animation-duration))var(--mod-underlay-background-exit-animation-ease,var(--spectrum-underlay-background-exit-animation-ease))var(--mod-underlay-background-exit-animation-delay,var(--spectrum-underlay-background-exit-animation-delay)),visibility 0s linear calc(var(--mod-underlay-background-exit-animation-delay,var(--spectrum-underlay-background-exit-animation-delay)) + var(--mod-underlay-background-exit-animation-duration,var(--spectrum-underlay-background-exit-animation-duration)));position:fixed;inset-block:0;inset-inline:0;overflow:hidden}:host([open]){transition:opacity var(--mod-underlay-background-entry-animation-duration,var(--spectrum-underlay-background-entry-animation-duration))var(--mod-underlay-background-entry-animation-ease,var(--spectrum-underlay-background-entry-animation-ease))var(--mod-underlay-background-entry-animation-delay,var(--spectrum-underlay-background-entry-animation-delay))}
`;var s=Object.defineProperty;Object.getOwnPropertyDescriptor;class d extends n.w{constructor(){super(...arguments),this.canClick=!1,this.open=!1}static get styles(){return[o]}click(){this.dispatchEvent(new Event("close"))}handlePointerdown(){this.canClick=!0}handlePointerup(){this.canClick&&this.click(),this.canClick=!1}render(){return i.qy``}firstUpdated(){this.addEventListener("pointerdown",this.handlePointerdown),this.addEventListener("pointerup",this.handlePointerup)}}((a,r,t)=>{for(var n,i=void 0,e=a.length-1;e>=0;e--)(n=a[e])&&(i=n(r,t,i)||i);i&&s(r,t,i)})([(0,e.MZ)({type:Boolean,reflect:!0})],d.prototype,"open");var m=t(308);(0,m.e)("sp-underlay",d);var c=t(415),u=t(239);const l=i.AH`
    .modal{pointer-events:none;visibility:hidden;opacity:0;transition:transform var(--mod-overlay-animation-duration,var(--spectrum-animation-duration-100,.13s))ease-in-out,opacity var(--mod-overlay-animation-duration,var(--spectrum-animation-duration-100,.13s))ease-in-out,visibility 0s linear var(--mod-overlay-animation-duration,var(--spectrum-animation-duration-100,.13s))}:host([open]) .modal{pointer-events:auto;visibility:visible;opacity:1;transition-delay:var(--mod-overlay-animation-duration-opened,var(--spectrum-animation-duration-0,0s))}:host{--spectrum-modal-confirm-exit-animation-delay:var(--spectrum-animation-duration-0);--spectrum-modal-fullscreen-margin:32px;--spectrum-modal-max-height:90vh;--spectrum-modal-max-width:90%;--spectrum-modal-background-color:var(--spectrum-gray-100);--spectrum-modal-confirm-border-radius:var(--spectrum-corner-radius-100);--spectrum-modal-confirm-exit-animation-duration:var(--spectrum-animation-duration-100);--spectrum-modal-confirm-entry-animation-duration:var(--spectrum-animation-duration-500);--spectrum-modal-confirm-entry-animation-delay:var(--spectrum-animation-duration-200);--spectrum-modal-transition-animation-duration:var(--spectrum-animation-duration-100)}.modal{transform:translateY(var(--mod-modal-confirm-entry-animation-distance,var(--spectrum-modal-confirm-entry-animation-distance)));z-index:1;max-block-size:var(--mod-modal-max-height,var(--spectrum-modal-max-height));max-inline-size:var(--mod-modal-max-width,var(--spectrum-modal-max-width));background:var(--mod-modal-background-color,var(--spectrum-modal-background-color));border-radius:var(--mod-modal-confirm-border-radius,var(--spectrum-modal-confirm-border-radius));pointer-events:auto;transition:opacity var(--mod-modal-confirm-exit-animation-duration,var(--spectrum-modal-confirm-exit-animation-duration))var(--spectrum-animation-ease-in)var(--mod-modal-confirm-exit-animation-delay,var(--spectrum-modal-confirm-exit-animation-delay)),visibility 0s linear calc(var(--mod-modal-confirm-exit-animation-delay,var(--spectrum-modal-confirm-exit-animation-delay)) + var(--mod-modal-confirm-exit-animation-duration,var(--spectrum-modal-confirm-exit-animation-duration))),transform 0s linear calc(var(--mod-modal-confirm-exit-animation-delay,var(--spectrum-modal-confirm-exit-animation-delay)) + var(--mod-modal-confirm-exit-animation-duration,var(--spectrum-modal-confirm-exit-animation-duration)));outline:none;overflow:hidden}:host([open]) .modal{transition:transform var(--mod-modal-confirm-entry-animation-duration,var(--spectrum-modal-confirm-entry-animation-duration))var(--spectrum-animation-ease-out)var(--mod-modal-confirm-entry-animation-delay,var(--spectrum-modal-confirm-entry-animation-delay)),opacity var(--mod-modal-confirm-entry-animation-duration,var(--spectrum-modal-confirm-entry-animation-duration))var(--spectrum-animation-ease-out)var(--mod-modal-confirm-entry-animation-delay,var(--spectrum-modal-confirm-entry-animation-delay));transform:translateY(0)}@media only screen and (device-height<=350px),only screen and (device-width<=400px){:host([responsive]) .modal{inline-size:100%;block-size:100%;max-inline-size:100%;max-block-size:100%;border-radius:0}}.fullscreen{max-inline-size:none;max-block-size:none;position:fixed;inset-block-start:var(--mod-modal-fullscreen-margin,var(--spectrum-modal-fullscreen-margin));inset-block-end:var(--mod-modal-fullscreen-margin,var(--spectrum-modal-fullscreen-margin));inset-inline-start:var(--mod-modal-fullscreen-margin,var(--spectrum-modal-fullscreen-margin));inset-inline-end:var(--mod-modal-fullscreen-margin,var(--spectrum-modal-fullscreen-margin))}.fullscreenTakeover{max-inline-size:none;max-block-size:none;box-sizing:border-box;border:none;border-radius:0;position:fixed;inset:0}.fullscreenTakeover,:host([open]) .fullscreenTakeover{transform:none}:host{--spectrum-dialog-confirm-exit-animation-duration:var(--swc-test-duration);--spectrum-dialog-confirm-entry-animation-duration:var(--swc-test-duration);--spectrum-modal-confirm-entry-animation-distance:var(--spectrum-dialog-confirm-entry-animation-distance);height:100dvh}.modal{overflow:visible}
`,p=i.AH`
    :host{inline-size:100%;justify-content:center;display:flex;position:fixed;inset-block-end:0;inset-inline-start:0}:host{--spectrum-tray-exit-animation-delay:0s;--spectrum-tray-entry-animation-delay:.16s;--spectrum-tray-max-inline-size:375px;--spectrum-tray-spacing-edge-to-tray-safe-zone:64px;--spectrum-tray-entry-animation-duration:var(--spectrum-animation-duration-500);--spectrum-tray-exit-animation-duration:var(--spectrum-animation-duration-100);--spectrum-tray-corner-radius:var(--spectrum-corner-radius-100);--spectrum-tray-background-color:var(--spectrum-background-layer-2-color)}.tray{inline-size:100%;--mod-modal-max-width:100%;max-inline-size:100%;max-block-size:calc(100vh - var(--mod-tray-spacing-edge-to-tray-safe-zone,var(--spectrum-tray-spacing-edge-to-tray-safe-zone)));box-sizing:border-box;border-radius:var(--mod-tray-corner-radius-portrait,0)var(--mod-tray-corner-radius-portrait,0)0 0;transition:opacity var(--mod-tray-exit-animation-duration,var(--spectrum-tray-exit-animation-duration))cubic-bezier(.5,0,1,1)var(--mod-tray-exit-animation-delay,var(--spectrum-tray-exit-animation-delay)),visibility var(--mod-tray-exit-animation-duration,var(--spectrum-tray-exit-animation-duration))linear calc(var(--mod-tray-exit-animation-delay,var(--spectrum-tray-exit-animation-delay)) + var(--mod-tray-exit-animation-duration,var(--spectrum-tray-exit-animation-duration))),transform var(--mod-tray-exit-animation-duration,var(--spectrum-tray-exit-animation-duration))cubic-bezier(.5,0,1,1)var(--mod-tray-exit-animation-delay,var(--spectrum-tray-exit-animation-delay));background-color:var(--highcontrast-tray-background-color,var(--mod-tray-background-color,var(--spectrum-tray-background-color)));outline:none;margin-block-start:var(--mod-tray-spacing-edge-to-tray-safe-zone,var(--spectrum-tray-spacing-edge-to-tray-safe-zone));padding-block-start:var(--mod-tray-top-to-content-area,var(--spectrum-tray-top-to-content-area));padding-block-end:var(--mod-tray-bottom-to-content-area,var(--spectrum-tray-top-to-content-area));overflow:auto;transform:translateY(100%)}:host([open]) .tray{transition:transform var(--mod-tray-entry-animation-duration,var(--spectrum-tray-entry-animation-duration))cubic-bezier(0,0,.4,1)var(--mod-tray-entry-animation-delay,var(--spectrum-tray-entry-animation-delay)),opacity var(--spectrum-tray-entry-animation-duration,var(--mod-tray-entry-animation-duration))cubic-bezier(0,0,.4,1)var(--mod-tray-entry-animation-delay,var(--spectrum-tray-entry-animation-delay));transform:translateY(0)}@media screen and (orientation:landscape){.tray{max-inline-size:var(--mod-tray-max-inline-size,var(--spectrum-tray-max-inline-size));border-start-start-radius:var(--mod-tray-corner-radius,var(--spectrum-tray-corner-radius));border-start-end-radius:var(--mod-tray-corner-radius,var(--spectrum-tray-corner-radius))}}@media (forced-colors:active){.tray{--highcontrast-tray-background-color:Canvas;border:solid}.tray ::slotted(*){border:none}}:host{max-height:100vh;max-height:100dvh;align-items:flex-end;position:fixed!important}sp-underlay{touch-action:none}.tray{overscroll-behavior:contain;display:inline-flex}::slotted(.visually-hidden){clip:rect(0,0,0,0);clip-path:inset(50%);height:1px;width:1px;white-space:nowrap;border:0;margin:0 -1px -1px 0;padding:0;position:absolute;overflow:hidden}
`;var y=Object.defineProperty,v=Object.getOwnPropertyDescriptor,h=(a,r,t,n)=>{for(var i,e=n>1?void 0:n?v(r,t):r,o=a.length-1;o>=0;o--)(i=a[o])&&(e=(n?i(r,t,e):i(e))||e);return n&&e&&y(r,t,e),e};class b extends n.w{constructor(){super(...arguments),this.open=!1,this.prefersMotion=new u._9(this,"(prefers-reduced-motion: no-preference)"),this.transitionPromise=Promise.resolve(),this.animating=!1}static get styles(){return[l,p]}focus(){const a=(0,c.I)(this);a?a.focus():1===this.children.length?this.tray.focus():super.focus()}overlayWillCloseCallback(){return this.open?(this.close(),!0):this.animating}close(){this.open=!1,this.prefersMotion.matches||this.dispatchClosed()}dispatchClosed(){this.dispatchEvent(new Event("close",{bubbles:!0}))}handleUnderlayTransitionend(){this.open||(this.resolveTransitionPromise(),this.dispatchClosed())}handleTrayTransitionend(){this.open&&this.resolveTransitionPromise()}update(a){a.has("open")&&void 0!==a.get("open")&&this.prefersMotion.matches&&(this.animating=!0,this.transitionPromise=new Promise((a=>{this.resolveTransitionPromise=()=>{this.animating=!1,a()}}))),super.update(a)}render(){return i.qy`
            <sp-underlay
                ?open=${this.open}
                @close=${this.close}
                @transitionend=${this.handleUnderlayTransitionend}
            ></sp-underlay>
            <div
                class="tray modal"
                tabindex="-1"
                @transitionend=${this.handleTrayTransitionend}
            >
                <slot></slot>
            </div>
        `}async getUpdateComplete(){const a=await super.getUpdateComplete();return await this.transitionPromise,a}}h([(0,e.MZ)({type:Boolean,reflect:!0})],b.prototype,"open",2),h([(0,e.P)(".tray")],b.prototype,"tray",2),(0,m.e)("sp-tray",b)}}]);