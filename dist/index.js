const e=new WeakMap,t=(t,...n)=>{const{t:s,v:o}=((e,t)=>{const n=[e[0]],s=[];for(let o=0,l=0,a=0,{length:c}=t;l<c;l++)t[l]instanceof r?n[o]+=t[l].v+e[l+1]:(s[a++]=l,n[++o]=e[l+1]);return{t:n,v:s}})(t,n),l=e.get(t)||e.set(t,{}).get(t);return(l[s]||(l[s]=[s])).concat(o.map((e=>n[e])))};function r(e){this.v=e}const n=(e,r)=>(n,...o)=>new Promise(((a,c)=>{n.some(l)&&c(s(new Error("SQLITE_ERROR: SQL injection hazard")));const[i,...u]=t(n,...o);e[r](i.join("?"),u,((e,t)=>{e?c(e):a(t)}))})),s=e=>(e.code="SQLITE_ERROR",e),o=(e,...t)=>new r(function(e){for(var t=e[0],r=1,n=arguments.length;r<n;r++)t+=arguments[r]+e[r];return t}(e,...t)),l=e=>e.includes("?");function a(e){return{all:n(e,"all"),get:n(e,"get"),query:n(e,"run"),raw:o}}const{assign:c}=Object,i=(e,t=1)=>new Promise(((r,n)=>{c(indexedDB.open(e,t),{onupgradeneeded({target:{result:e,transaction:t}}){e.objectStoreNames.contains("sqlite")||e.createObjectStore("sqlite").createIndex("buffer","buffer",{unique:!0}),c(t,{oncomplete(){r(e)}})},onsuccess({target:{result:e}}){r(e)},onerror:n})})),u=(e={})=>new Promise(((t,r)=>{const{url:n}=import.meta,s=e.dir||n.slice(0,n.lastIndexOf("/"))+"/../dist";self.exports={},self.module={exports:exports},import(s+"/sql-wasm.js").then((()=>{const n=self.module.exports;delete self.exports,Promise.all([i(e.name||"sqlite-worker"),n({locateFile:e=>s+"/"+e})]).then((([n,{Database:s}])=>{const o=e=>n.transaction(["sqlite"],e).objectStore("sqlite");c(o("readonly").get("buffer"),{onsuccess(){let r=Promise.resolve();const{result:n}=this,l=new s(n||e.database||new Uint8Array(0)),i=()=>{r=r.then((()=>new Promise(((t,r)=>{const n=l.export();c(o("readwrite").put(n,"buffer"),{onsuccess(){t(),e.update&&e.update(n)},onerror:r})}))))};n||i();const{all:u,get:m,query:d,raw:p}=a({all(e,t,r){try{const n=l.exec(e,t),s=[];n.forEach(f,s),r(null,s)}catch(e){r(e)}},get(e,t,r){try{const n=l.exec(e+" LIMIT 1",t),s=[];n.forEach(f,s),r(null,s.shift()||null)}catch(e){r(e)}},run(e,t,r){try{r(null,l.run(e,t))}catch(e){r(e)}}});let g=0;t({all:u,get:m,raw:p,query(t){return/\b(?:INSERT|DELETE|UPDATE)\b/i.test(t[0])&&(clearTimeout(g),g=setTimeout(i,e.timeout||250)),d.apply(this,arguments)}})},onerror:r})}),r)}))}));function f({columns:e,values:t}){for(let{length:r}=t,n=0;n<r;n++){const r=t[n],s={};for(let{length:t}=e,n=0;n<t;n++)s[e[n]]=r[n];this.push(s)}}const{assign:m}=Object,d=new Map;let p=0;function g(e){const t=import.meta.url,r=e=>(t,...r)=>n(e,{template:t,values:r}),n=(e,t)=>new Promise(((r,n)=>{const o=p++;d.set(o,{resolve:r,reject:n}),s.postMessage({id:o,action:e,options:t})})),s=m(new Worker(e.worker||t.slice(0,t.lastIndexOf("/"))+"/worker.js"),{onmessage({data:{id:e,result:t,error:r}}){const{resolve:n,reject:s}=d.get(e);d.delete(e),r?s(r):n(t)}});return n("init",m({library:t},e)).then((()=>({all:r("all"),get:r("get"),query:r("query")})))}export{g as SQLiteWorker,u as init};
