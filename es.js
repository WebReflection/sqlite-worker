self.sqliteWorker=function(e){"use strict";const t=new WeakMap,r=(e,...r)=>{const{t:s,v:o}=((e,t)=>{const r=[e[0]],s=[];for(let o=0,c=0,l=0,{length:a}=t;c<a;c++)t[c]instanceof n?r[o]+=t[c].v+e[c+1]:(s[l++]=c,r[++o]=e[c+1]);return{t:r,v:s}})(e,r),c=t.get(e)||t.set(e,{}).get(e);return(c[s]||(c[s]=[s])).concat(o.map((e=>r[e])))};function n(e){this.v=e}const s=(e,t)=>(n,...s)=>new Promise(((c,a)=>{n.some(l)&&a(o(new Error("SQLITE_ERROR: SQL injection hazard")));const[u,...i]=r(n,...s);e[t](u.join("?"),i,((e,t)=>{e?a(e):c(t)}))})),o=e=>(e.code="SQLITE_ERROR",e),c=(e,...t)=>new n(function(e){for(var t=e[0],r=1,n=arguments.length;r<n;r++)t+=arguments[r]+e[r];return t}(e,...t)),l=e=>e.includes("?");function a(e){return{all:s(e,"all"),get:s(e,"get"),query:s(e,"run"),raw:c}}const u="sqlite",i="buffer",{assign:d}=Object,m=(e,t=1)=>new Promise(((r,n)=>{d(indexedDB.open(e,t),{onupgradeneeded({target:{result:e,transaction:t}}){e.objectStoreNames.contains(u)||e.createObjectStore(u).createIndex(i,i,{unique:!0}),d(t,{oncomplete(){r(e)}})},onsuccess({target:{result:e}}){r(e)},onerror:n})}));function p({columns:e,values:t}){for(let{length:r}=t,n=0;n<r;n++){const r=t[n],s={};for(let{length:t}=e,n=0;n<t;n++)s[e[n]]=r[n];this.push(s)}}const{assign:f}=Object,g=new Map;let h=0;return e.SQLiteWorker=function(e,t){const r=e=>(t,...r)=>n(e,{template:t,values:r}),n=(e,t)=>new Promise(((r,n)=>{const o=h++;g.set(o,{resolve:r,reject:n}),s.postMessage({id:o,action:e,options:t})})),s=f(new Worker(e),{onmessage({data:{id:e,result:t,error:r}}){const{resolve:n,reject:s}=g.get(e);g.delete(e),r?s(r):n(t)}}),o=document.currentScript&&document.currentScript.src||new URL("es.js",document.baseURI).href;return n("init",f({library:o},t)).then((()=>({all:r("all"),get:r("get"),query:r("query")})))},e.init=(t={})=>new Promise(((r,n)=>{const{url:s}={url:document.currentScript&&document.currentScript.src||new URL("es.js",document.baseURI).href},o=t.dir||s.slice(0,s.lastIndexOf("/"))+"/../sqlite";self.exports={},self.module={exports:e},import(o+"/sql-wasm.js").then((()=>{const e=self.module.exports;delete self.exports,Promise.all([m(t.name||"sqlite-worker"),e({locateFile:e=>o+"/"+e})]).then((([e,{Database:s}])=>{const o=t=>e.transaction([u],t).objectStore(u);d(o("readonly").get(i),{onsuccess(){let e=Promise.resolve();const{result:n}=this,c=new s(n||t.database||new Uint8Array(0)),l=()=>{e=e.then((()=>new Promise(((e,r)=>{const n=c.export();d(o("readwrite").put(n,i),{onsuccess(){e(),t.update&&t.update(n)},onerror:r})}))))};n||l();const{all:u,get:m,query:f,raw:g}=a({all(e,t,r){try{const n=c.exec(e,t),s=[];n.forEach(p,s),r(null,s)}catch(e){r(e)}},get(e,t,r){try{const n=c.exec(e+" LIMIT 1",t),s=[];n.forEach(p,s),r(null,s.shift()||null)}catch(e){r(e)}},run(e,t,r){try{r(null,c.run(e,t))}catch(e){r(e)}}});let h=0;r({all:u,get:m,raw:g,query(e){return/\b(?:INSERT|DELETE|UPDATE)\b/i.test(e[0])&&(clearTimeout(h),h=setTimeout(l,t.timeout||250)),f.apply(this,arguments)}})},onerror:n})}),n)}))})),e}({});
