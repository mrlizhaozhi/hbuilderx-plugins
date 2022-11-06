"use strict";function getType(e,i,t,n){let l=t.getSymbolsInScope(i,n.SymbolFlags.Type).find((i=>i.escapedName===e));if(l)return t.getDeclaredTypeOfSymbol(l)}function asCallExpression(e,i){return e.kind==i.SyntaxKind.CallExpression?e:void 0}function createVueRefTypeChecker(e){return{checkExpression(i,t,n,l,a,r){var o,s,d,c;if(l.kind===e.ts.SyntaxKind.Identifier){let i=l,t=n.getResolvedSymbol(i);if((null===(o=null==t?void 0:t.valueDeclaration)||void 0===o?void 0:o.kind)==e.ts.SyntaxKind.VariableDeclaration){let i=t.valueDeclaration,l=i.initializer?null===(s=asCallExpression(i.initializer,e.ts))||void 0===s?void 0:s.expression:void 0;if(l&&l.kind==e.ts.SyntaxKind.Identifier){let i=n.getResolvedSymbol(l);const a=n.getTypeOfSymbol(i).symbol;if(a.valueDeclaration&&"ref"==a.escapedName){let i=null===(d=a.valueDeclaration.jsDoc)||void 0===d?void 0:d[0],l=i&&"vue.3.reactivity.ref"==i.comment;if(!l&&(null===(c=a.valueDeclaration)||void 0===c?void 0:c.parent.kind)==e.ts.SyntaxKind.SourceFile){l=a.valueDeclaration.parent.fileName.indexOf("/@vue/reactivity/")>0}if(l){let e=n.getTypeOfSymbol(t);if(e.typeArguments)return e.typeArguments[0]}}}}}}}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.createVueRefTypeChecker=void 0,exports.createVueRefTypeChecker=createVueRefTypeChecker;