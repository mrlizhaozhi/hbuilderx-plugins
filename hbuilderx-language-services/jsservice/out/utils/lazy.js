"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.lazy=void 0;class LazyValue{constructor(e){this._getValue=e,this._hasValue=!1}get value(){return this._hasValue||(this._hasValue=!0,this._value=this._getValue()),this._value}get hasValue(){return this._hasValue}map(e){return new LazyValue((()=>e(this.value)))}}function lazy(e){return new LazyValue(e)}exports.lazy=lazy;