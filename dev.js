!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("quill")):"function"==typeof define&&define.amd?define(["exports","quill"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).bundle={},e.Quill)}(this,(function(e,t){"use strict";const n=(e,t)=>{const n=`${e}-`;return{b:()=>`${n}${t}`,be:e=>e?`${n}${t}__${e}`:"",bm:e=>e?`${n}${t}--${e}`:"",bem:(e,i)=>e&&i?`${n}${t}__${e}--${i}`:"",ns:e=>e?`${n}${e}`:"",bs:e=>e?`${n}${t}-${e}`:"",cv:e=>e?`--${n}${e}`:"",is:e=>`is-${e}`}},i=n("qsf","menu"),s=e=>{const t=document.createElement("div");t.classList.add(i.b());for(const[n,o]of e.entries()){const{type:e,classes:r=[]}=o,l=document.createElement("div");if(l.classList.add(i.be("item"),...r),l.dataset.index=n.toString(),"break"===e)l.classList.add(i.is("break"));else{if("item"!==e)continue;{const{icon:e,text:t,content:r,children:a=[],onHover:d,onClick:c}=o;if(!e&&!t&&!r)continue;if(r)l.appendChild(r());else{if(e){const t=document.createElement("span");t.classList.add(i.be("icon")),t.innerHTML=e,l.appendChild(t)}if(t){const e=document.createElement("span");e.textContent=t,l.appendChild(e)}}if(a.length>0){l.dataset.hasChildren="true";const e=document.createElement("span");e.classList.add(i.be("icon"),i.is("arrow")),e.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>',l.appendChild(e);const t=s(a);let o;t.classList.add(i.is("transparent"));const r=()=>{t.remove()},d=()=>{if(l.contains(t))return;o&&(clearTimeout(o),o=void 0),l.classList.add(i.is("active")),t.dataset.parent=n.toString(),t.removeEventListener("transitionend",r);const e=l.getBoundingClientRect();Object.assign(t.style,{position:"fixed",width:`${e.width}px`,top:`${e.top}px`,left:`${e.right}px`}),l.appendChild(t),requestAnimationFrame((()=>{t.classList.remove(i.is("transparent"));const n=t.getBoundingClientRect();n.right>window.innerWidth&&Object.assign(t.style,{left:e.left-n.width+"px"}),n.bottom>window.innerHeight&&Object.assign(t.style,{top:e.bottom-n.height+"px"})}))},c=()=>{o&&(clearTimeout(o),o=void 0),l.classList.add(i.is("active")),o=setTimeout((()=>{t.addEventListener("transitionend",r,{once:!0}),t.classList.add(i.is("transparent"))}),150)};l.addEventListener("click",d);for(const e of[l,t])e.addEventListener("mouseenter",d),e.addEventListener("mouseleave",c)}d&&l.addEventListener("mouseenter",(()=>d(o,n))),c&&l.addEventListener("click",(()=>c(o,n)))}}t.appendChild(l)}return t},o=t.import("ui/icons");o.header[1]='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h8m-8 6V6m8 12V6m5 6l3-2v8"/></svg>',o.header[2]='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h8m-8 6V6m8 12V6m9 12h-4c0-4 4-3 4-6c0-1.5-2-2.5-4-1"/></svg>',o.header[3]='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h8m-8 6V6m8 12V6m5.5 4.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2m-2 3.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"/></svg>',o.header[4]='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18V6m5 4v3a1 1 0 0 0 1 1h3m0-4v8M4 12h8m-8 6V6"/></svg>',o.header[5]='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h8m-8 6V6m8 12V6m5 7v-3h4m-4 7.7c.4.2.8.3 1.3.3c1.5 0 2.7-1.1 2.7-2.5S19.8 13 18.3 13H17"/></svg>',o.header[6]='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 12h8m-8 6V6m8 12V6"/><circle cx="19" cy="16" r="2"/><path d="M20 10c-2 2-3 3.5-3 6"/></g></svg>',console.log(o);const r={h1:"标题1",h2:"标题2",h3:"标题3",h4:"标题4",h5:"标题5",h6:"标题6",blockquote:"引用",codeblock:"代码块",code:"行内代码",link:"链接",image:"图片",video:"视频",formula:"公式",list:"列表",listBullet:"无序列表",listOrdered:"有序列表",listCheck:"任务列表"},l=(e,t)=>{if(!e)return;const n=e.controls.find((e=>e[0]===t));n&&n[1].click()},a=[...new Array(6).fill(0).map(((e,n)=>({type:"item",name:`h${n+1}`,alias:["header",`head${n+1}`],icon:o.header[n+1],title:r[`h${n+1}`],handler(e,i){i&&this.formatLine(i.index,i.index,"header",n+1,t.sources.USER)}}))),{type:"item",name:"bq",alias:["blockquote"],icon:o.blockquote,title:r.blockquote,descriptions:"插入引用格式",handler(e,n){n&&this.formatLine(n.index,n.index,"blockquote",!0,t.sources.USER)}},{type:"item",name:"cb",alias:["code","codeblock"],icon:o["code-block"],title:r.codeblock,handler(e,n){n&&this.formatLine(n.index,n.index,"code-block",!0,t.sources.USER)}},{type:"item",name:"lk",alias:["link"],icon:o.link,title:r.link,handler(e,n){if(!n)return;const i=this.getModule("toolbar");i&&(this.insertText(n.index,"link",t.sources.USER),this.setSelection({index:n.index,length:n.index+4}),l(i,"link"))}},{type:"item",name:"img",alias:["image","pic","picture"],icon:o.image,title:r.image,handler(e,t){t&&l(this.getModule("toolbar"),"image")}},{type:"item",name:"vd",alias:["video"],icon:o.video,title:r.video,handler(e,t){t&&l(this.getModule("toolbar"),"video")}},{type:"item",name:"fm",alias:["formula"],icon:o.formula,title:r.formula,handler(e,t){t&&l(this.getModule("toolbar"),"formula")}},{type:"group",icon:o.list.bullet,title:r.list,children:[{type:"item",name:"bl",alias:["list","bullet"],icon:o.list.bullet,title:r.listBullet,handler(e,n){n&&this.formatLine(n.index,n.length,"list","bullet",t.sources.USER)}},{type:"item",name:"od",alias:["list","ordered"],icon:o.list.ordered,title:r.listOrdered,handler(e,n){n&&this.formatLine(n.index,n.length,"list","ordered",t.sources.USER)}},{type:"item",name:"ck",alias:["list","check"],icon:o.list.check,title:r.listCheck,handler(e,n){n&&this.formatLine(n.index,n.length,"list","unchecked",t.sources.USER)}}]}],d=(e=>{const n=Object.keys(e),i={};for(const s of n){const[n,o]=s.split(" "),r=void 0===o;i[s]={handler(e,i){this.quill.format(n,r?!i.format[n]:o,t.sources.USER)},...e[s]}}return i})({"align ":{key:"l",altKey:!0},"align center":{key:"c",altKey:!0},"align right":{key:"r",altKey:!0},"align justify":{key:"j",altKey:!0},"indent +1":{key:"]",shortKey:!0},"indent -1":{key:"[",shortKey:!0},"script sub":{key:".",shortKey:!0},"script super":{key:",",shortKey:!0},code:{key:"e",shortKey:!0},"direction rtl":{key:"r",shortKey:!0},"direction ":{key:"l",shortKey:!0}});class c{index=new Map;items=[];SCORE_THRESHOLD=20;constructor(e){this.items=e,this.buildIndex()}buildIndex(){for(const e of this.items){this.addToIndex(e.name.toLowerCase(),e);for(const t of e.alias)this.addToIndex(t.toLowerCase(),e)}}addToIndex(e,t){this.addTermToIndex(e,t);for(let n=0;n<e.length-1;n++)for(let i=n+2;i<=Math.min(e.length,n+5);i++)this.addTermToIndex(e.slice(n,i),t)}addTermToIndex(e,t){this.index.has(e)||this.index.set(e,new Set),this.index.get(e).add(t)}getQuickSimilarity(e,t){const n=new Map;for(const t of e)n.set(t,(n.get(t)||0)+1);let i=0;for(const e of t){const t=n.get(e);t&&t>0&&(i++,n.set(e,t-1))}return 2*i/(e.length+t.length)*50}search(e){e=e.toLowerCase();const t=new Map,n=new Set,i=this.index.get(e)||new Set;for(const e of i)t.set(e,100),n.add(e);for(const i of this.items){if(n.has(i))continue;const s=[i.name.toLowerCase(),...i.alias.map((e=>e.toLowerCase()))];let o=0;for(const t of s)t.includes(e)?o=Math.max(o,80):e.includes(t)&&(o=Math.max(o,60));o>0&&(t.set(i,o),n.add(i))}if(e.length>1)for(const i of this.items)if(!n.has(i)){const n=[i.name.toLowerCase(),...i.alias.map((e=>e.toLowerCase()))],s=Math.max(...n.map((t=>this.getQuickSimilarity(e,t))));s>=this.SCORE_THRESHOLD&&t.set(i,s)}return console.log(t),[...t.entries()].filter((([e,t])=>t>=this.SCORE_THRESHOLD)).sort(((e,t)=>t[1]-e[1])).map((([e])=>e))}}const h=t.import("parchment");class m{quill;bem=n("qsf","menu");options;menuSorter;currentMenu;menuContainer;menuKeyboardControlsCleanup;constructor(e,n){this.quill=e,this.options=this.resolveOptions(n),this.currentMenu=this.options.menuItems,this.menuSorter=this.createMenuItemsSorter(this.options.menuItems),this.quill.on(t.events.TEXT_CHANGE,(()=>{const e=this.quill.getSelection();if(e){const[t,n]=this.quill.getLine(e.index);if(t){const i=e.index-n,s=i+t.length(),o=this.quill.getText(i,s),r=this.quill.getFormat(i,s),l=Object.keys(r).some((e=>this.quill.scroll.registry.query(e,h.Scope.BLOCK_BLOT)));if(o.startsWith("/")&&!l){const e=o.match(/^\/(.+)/);if(e){const t=this.menuSorter(e[1]);this.currentMenu=t}else this.currentMenu=this.options.menuItems;return void this.generateMenuList(t,r)}}}this.destroyMenuList()}))}resolveOptions(e){const t=Object.assign({menuItems:[]},e);return t.menuItems=t.menuItems.map((e=>(e.type||(e.type="item"),e))),t}createMenuItemsSorter(e){const t=[];for(const n of e)"group"===n.type?t.push(...n.children):t.push(n);const n=new c(t);return e=>n.search(e)}generateMenuItem(e,t){return{type:"item",children:(t.children||[]).map((t=>this.generateMenuItem(e,t))),content:()=>{const e=document.createElement("div");e.classList.add(this.bem.be("item-container"));const n=document.createElement("div");n.classList.add(this.bem.be("item-icon"));const i=document.createElement("div");i.classList.add(this.bem.be("icon")),i.innerHTML=t.icon,n.appendChild(i);const s=document.createElement("div");s.classList.add(this.bem.be("item-content"));const o=document.createElement("div");o.classList.add(this.bem.be("item-title"));const r=document.createElement("span");if(r.textContent=t.title,o.appendChild(r),"item"===t.type){const e=document.createElement("span");e.classList.add(this.bem.be("item-hint")),e.textContent=`/${t.name}`,o.appendChild(e)}if(s.appendChild(o),t.descriptions){const e=document.createElement("div");e.classList.add(this.bem.be("item-descriptions")),e.textContent=t.descriptions,s.appendChild(e)}return e.appendChild(n),e.appendChild(s),e},onClick:()=>{if("item"===t.type){e.domNode.innerHTML="";const n=this.quill.getSelection();t.handler.call(this.quill,t,n),this.destroyMenuList()}}}}generateMenuList(e,t){const n=s(this.currentMenu.map((t=>this.generateMenuItem(e,t))));this.menuKeyboardControlsCleanup=((e,t)=>{let n=e,s=null,o=-1;const r=e=>{const t=Array.from(n.querySelectorAll(`.${i.be("item")}`));for(const[s,o]of t.entries())if(s===e){o.classList.add(i.is("selected"));const e=n.getBoundingClientRect(),t=o.getBoundingClientRect(),s=t.bottom>e.bottom,r=t.top<e.top;s?n.scrollTop=o.offsetTop-n.clientHeight+t.height:r&&(n.scrollTop=o.offsetTop)}else o.classList.remove(i.is("selected"));o=e},l=e=>{const t=n.querySelectorAll(`.${i.be("item")}`);if(0!==t.length)switch(e.key){case"ArrowUp":e.preventDefault(),r((o-1+t.length)%t.length);break;case"ArrowDown":e.preventDefault(),r((o+1)%t.length);break;case"ArrowRight":{e.preventDefault();const l=t[o];if("true"===l.dataset.hasChildren){l.click();const e=l.querySelector(`.${i.b()}`);e&&(s=n,n=e,r(0))}break}case"ArrowLeft":if(e.preventDefault(),s){const e=Number.parseInt(n.dataset.parent||"0",10);n.remove(),n=s,s=null,o=e,r(o)}break;case"Enter":e.preventDefault(),t[o].click()}};return t.addEventListener("keydown",l,!0),()=>{t.removeEventListener("keydown",l,!0)}})(n,this.quill.root),this.menuContainer?this.menuContainer.innerHTML="":(this.menuContainer=document.createElement("div"),this.menuContainer.classList.add(this.bem.be("container")),this.quill.root.addEventListener("click",this.destroyMenuList),this.quill.container.appendChild(this.menuContainer));const o=this.quill.root.getBoundingClientRect(),r=e.domNode.getBoundingClientRect(),l=r.left-o.left+("right"===t.align?r.width:0),a=r.bottom-o.top;Object.assign(this.menuContainer.style,{left:`${l}px`,top:`${a}px`}),this.menuContainer.appendChild(n),requestAnimationFrame((()=>{if(!this.menuContainer)return;const e=this.menuContainer.getBoundingClientRect();window.innerWidth<e.right&&(this.menuContainer.style.left=l-e.width+"px"),window.innerHeight<e.bottom&&(this.menuContainer.style.top=a-r.height-e.height+"px")}))}destroyMenuList=()=>{this.quill.root.removeEventListener("click",this.destroyMenuList),this.menuKeyboardControlsCleanup&&this.menuKeyboardControlsCleanup(),this.menuContainer&&(this.menuContainer.remove(),this.menuContainer=void 0)}}e.QuillQuickInsert=m,e.default=m,e.defaultMenuItems=a,e.defaultShortKey=d,Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=dev.js.map
