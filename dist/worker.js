!function(){"use strict";const{assign:e}=Object,t="function"==typeof importScripts,s=s=>new Promise(((r,o)=>{const n=()=>{const e=self.module.exports;delete self.exports,self.module=void 0,r(e)};if(self.exports={},self.module={exports:exports},t)importScripts(s),n();else{const{head:t}=document;e(t.appendChild(document.createElement("script")),{onload(){t.removeChild(this),n()},onerror:o,src:s})}}));let r=null;const o=(e,t,s,{template:r,values:o})=>{e.then((e=>{e[t].apply(null,[r].concat(o)).then((e=>{postMessage({id:s,result:e})}),(({message:e})=>{postMessage({id:s,error:e})}))}))};addEventListener("message",(({data:{id:e,action:t,options:n}})=>{switch(t){case"init":return r||(r=s(n.library).then((({init:e})=>e(n)))),r.then((()=>postMessage({id:e,result:"OK"})),(({message:t})=>postMessage({id:e,error:t})));case"all":return o(r,"all",e,n);case"get":return o(r,"get",e,n);case"query":return o(r,"query",e,n)}}))}();