!function(){"use strict";const{assign:e}=Object,s="function"==typeof importScripts,t=t=>new Promise(((o,n)=>{const r=()=>{const e=self.module.exports;delete self.exports,self.module=void 0,o(e)};if(self.exports={},self.module={exports:exports},s)importScripts(t),r();else{const{head:s}=document;e(s.appendChild(document.createElement("script")),{onload(){s.removeChild(this),r()},onerror:n,src:t})}}));let o=null;addEventListener("message",(({data:{id:e,action:s,options:n}})=>{"init"===s?(o||(o=t(n.library).then((({init:e})=>e(n)))),o.then((()=>postMessage({id:e,result:"OK"})),(({message:s})=>postMessage({id:e,error:s})))):((e,s,t,{template:o,values:n})=>{e.then((e=>{e[s].apply(null,[o].concat(n)).then((e=>{postMessage({id:t,result:e})}),(({message:e})=>{postMessage({id:t,error:e})}))}))})(o,s,e,n)}))}();