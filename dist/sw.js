self.sqliteWorker=function(e){"use strict";const{isArray:t}=Array;class n extends String{}const{defineProperty:r}=Object,o=(e,r)=>(o,...s)=>new Promise(((c,l)=>{if(o.some((e=>e.includes("?")))){const e=new Error("SQLITE_ERROR: SQL injection hazard");e.code="SQLITE_ERROR",l(e)}else{const[a,...i]=((e,...r)=>{const o=[e[0]],s=[o];for(let c=0;c<r.length;c++)r[c]instanceof n?o[o.length-1]+=r[c]+e[c+1]:(t(r[c])?(o.push(...r[c].slice(1).map((e=>","))),s.push(...r[c])):s.push(r[c]),o.push(e[c+1]));return s})(o,...s);e[r](a.join("?"),i,((e,t)=>{e?l(e):c(t)}))}}));function s(e){const t=o(e,"run");return{transaction(){let e=t(["BEGIN TRANSACTION"]);return r(((...n)=>{e=e.then((()=>t(...n)))}),"commit",{value:()=>e=e.then((()=>t(["COMMIT"])))})},all:o(e,"all"),get:o(e,"get"),raw:(e,...t)=>{return r=function(e){for(var t=e[0],n=1,r=arguments.length;n<r;n++)t+=arguments[n]+e[n];return t}(e,...t),new n(r);var r},close:()=>e.close(),query:t}}const{assign:c}=Object,l="function"==typeof importScripts,a=t=>new Promise(((n,r)=>{const o=()=>{const e=self.module.exports;delete self.exports,self.module=void 0,n(e)};if(self.exports={},self.module={exports:e},l)importScripts(t),o();else{const{head:e}=document;c(e.appendChild(document.createElement("script")),{onload(){e.removeChild(this),o()},onerror:r,src:t})}})),i="sqlite",u="buffer",d=(e,t=1)=>new Promise(((n,r)=>{c(indexedDB.open(e,t),{onupgradeneeded({target:{result:e,transaction:t}}){e.objectStoreNames.contains(i)||e.createObjectStore(i).createIndex(u,u,{unique:!0}),c(t,{oncomplete(){n(e)}})},onsuccess({target:{result:e}}){n(e)},onerror:r})}));function h({columns:e,values:t}){for(let{length:n}=t,r=0;r<n;r++){const n=t[r],o={};for(let{length:t}=e,r=0;r<t;r++)o[e[r]]=n[r];this.push(o)}}return(e={})=>new Promise(((t,n)=>{const r=e.dist||".";a(r+"/sql-wasm.js").then((({default:o})=>{Promise.all([d(e.name||"sqlite-worker"),o({locateFile:e=>r+"/"+e})]).then((([r,{Database:o}])=>{const l=e=>r.transaction([i],e).objectStore(i);c(l("readonly").get(u),{onsuccess(){let n=Promise.resolve();const{result:r}=this,a=new o(r||e.database||new Uint8Array(0)),i=()=>n=n.then((()=>new Promise(((t,n)=>{const r=a.export();c(l("readwrite").put(r,u).transaction,{oncomplete(){t(),e.update&&e.update(r)},onabort:n,onerror:n})}))));r||i();const{all:d,get:m,query:p,raw:f,transaction:g}=s({all(e,t,n){try{const r=a.exec(e,t),o=[];r.forEach(h,o),n(null,o)}catch(e){n(e)}},get(e,t,n){try{const r=a.exec(e+" LIMIT 1",t),o=[];r.forEach(h,o),n(null,o.shift()||null)}catch(e){n(e)}},run(e,t,n){try{n(null,a.run(e,t))}catch(e){n(e)}}});let w=0;t({all:d,get:m,raw:f,transaction:g,create_function:(e,t)=>a.create_function(e,t),close:()=>(clearTimeout(w),i().then((()=>a.close()))),query(t){return/\b(?:INSERT|DELETE|UPDATE)\b/i.test(t[0])&&(clearTimeout(w),w=setTimeout(i,e.timeout||250)),p.apply(this,arguments)}})},onerror:n})}),n)}))}))}({});