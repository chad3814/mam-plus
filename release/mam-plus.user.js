// ==UserScript==
// @name         mam-plus
// @namespace    https://github.com/GardenShade
// @version      4.1.0
// @description  Tweaks and features for MAM
// @author       GardenShade
// @run-at       document-start
// @include      https://myanonamouse.net/*
// @include      https://www.myanonamouse.net/*
// @icon         https://i.imgur.com/dX44pSv.png
// @resource     MP_CSS https://raw.githubusercontent.com/gardenshade/mam-plus/master/release/main.css
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM_getResourceText
// ==/UserScript==
"use strict";var SettingGroup,MP,__awaiter=this&&this.__awaiter||function(t,e,s,i){return new(s||(s=Promise))((function(o,r){function n(t){try{a(i.next(t))}catch(t){r(t)}}function l(t){try{a(i.throw(t))}catch(t){r(t)}}function a(t){var e;t.done?o(t.value):(e=t.value,e instanceof s?e:new s((function(t){t(e)}))).then(n,l)}a((i=i.apply(t,e||[])).next())}))};!function(t){t[t.Global=0]="Global",t[t["Browse & Search"]=1]="Browse & Search",t[t.Requests=2]="Requests",t[t["Torrent Page"]=3]="Torrent Page",t[t.Shoutbox=4]="Shoutbox",t[t.Vault=5]="Vault",t[t["User Pages"]=6]="User Pages",t[t.Other=7]="Other"}(SettingGroup||(SettingGroup={}));class Util{static afTimer(){return new Promise(t=>{requestAnimationFrame(t)})}static setAttr(t,e){return new Promise(s=>{for(const s in e)t.setAttribute(s,e[s]);s()})}static objectLength(t){return Object.keys(t).length}static purgeSettings(){for(let t of GM_listValues())GM_deleteValue(t)}static reportCount(t,e,s){1!==e&&(s+="s"),MP.DEBUG&&console.log(`> ${t} ${e} ${s}`)}static startFeature(t,e,s){return __awaiter(this,void 0,void 0,(function*(){function i(){return __awaiter(this,void 0,void 0,(function*(){return yield Check.elemLoad(e),!0}))}if(MP.settingsGlob.push(t),GM_getValue(t.title)){if(s&&s.length>0){let t=[];return yield s.forEach(e=>{Check.page(e).then(e=>{t.push(e)})}),!0===t.includes(!0)&&i()}return i()}return!1}))}static trimString(t,e){return t.length>e&&(t=(t=t.substring(0,e+1)).substring(0,Math.min(t.length,t.lastIndexOf(" ")))),t}static bracketRemover(t){return t.replace(/{+.*?}+/g,"").replace(/\[\[|\]\]/g,"").replace(/<.*?>/g,"").replace(/\(.*?\)/g,"").trim()}static stringToArray(t,e){return null!=e&&"ws"!==e?t.split(e):t.match(/\S+/g)||[]}static csvToArray(t,e=","){let s=[];return t.split(e).forEach(t=>{s.push(t.trim())}),s}static arrayToString(t,e){let s="";return t.forEach((i,o)=>{s+=i,e&&o+1!==t.length&&(s+=" ")}),s}static nodeToElem(t){if(null!==t.firstChild)return t.firstChild.parentElement;{console.warn("🔥 Node-to-elem without childnode is untested");let e=t;t.appendChild(e);let s=t.firstChild.parentElement;return t.removeChild(e),s}}static caselessStringMatch(t,e){return 0===t.localeCompare(e,"en",{sensitivity:"base"})}static addTorDetailsRow(t,e,s){return __awaiter(this,void 0,void 0,(function*(){if(null===t||null===t.parentElement)throw new Error(`Add Tor Details Row: empty node or parent node @ ${t}`);return t.parentElement.insertAdjacentHTML("afterend",`<div class="torDetRow"><div class="torDetLeft">${e}</div><div class="torDetRight ${s}"><span class="flex"></span></div></div>`),document.querySelector(`.${s} .flex`)}))}static createLinkButton(t,e="none",s,i=0){let o=document.createElement("a");o.classList.add("mp_button_clone"),"none"!==e&&(o.setAttribute("href",e),o.setAttribute("target","_blank")),o.innerText=s,o.style.order=`${i}`,t.insertBefore(o,t.firstChild)}static createButton(t,e,s="h1",i,o="afterend",r="mp_btn"){return new Promise((n,l)=>{const a=document.querySelector(i),c=document.createElement(s);null===a&&l(`${i} is null!`),a.insertAdjacentElement(o,c),Util.setAttr(c,{id:`mp_${t}`,class:r,role:"button"}),c.innerHTML=e,n(c)})}static clipboardifyBtn(t,e){t.style.cursor="pointer",t.addEventListener("click",()=>{let s=navigator;if(void 0===s)throw alert("Failed to copy text, likely due to missing browser support."),new Error("browser doesn't support 'navigator'?");s.clipboard.writeText(e),t.style.color="green",console.log("[M+] Copied to your clipboard!")})}}class Check{static elemLoad(t){return __awaiter(this,void 0,void 0,(function*(){const e=document.querySelector(t);if(MP.DEBUG&&console.log(`%c Looking for ${t}: ${e}`,"background: #222; color: #555"),void 0===e)throw`${t} is undefined!`;return null===e?(yield Util.afTimer(),yield this.elemLoad(t)):e}))}static elemObserver(t,e,s={childList:!0,attributes:!0}){return __awaiter(this,void 0,void 0,(function*(){let i=null;if("string"==typeof t&&(i=document.querySelector(t),null===i))throw new Error(`Couldn't find '${t}'`);MP.DEBUG&&console.log(`%c Setting observer on ${t}: ${i}`,"background: #222; color: #5d8aa8");let o=new MutationObserver(e);return o.observe(i,s),o}))}static updated(){return MP.DEBUG&&(console.group("Check.updated()"),console.log(`PREV VER = ${this.prevVer}`),console.log(`NEW VER = ${this.newVer}`)),new Promise(t=>{this.newVer!==this.prevVer?(MP.DEBUG&&console.log("Script is new or updated"),GM_setValue("mp_version",this.newVer),this.prevVer?(MP.DEBUG&&(console.log("Script has run before"),console.groupEnd()),t("updated")):(MP.DEBUG&&(console.log("Script has never run"),console.groupEnd()),GM_setValue("goodreadsBtn",!0),GM_setValue("alerts",!0),t("firstRun"))):(MP.DEBUG&&(console.log("Script not updated"),console.groupEnd()),t(!1))})}static page(t){MP.DEBUG&&console.group("Check.page()");let e=GM_getValue("mp_currentPage");return MP.DEBUG&&console.log(`Stored Page: ${e}`),new Promise(s=>{if(void 0!==e)s(t?t===e:e);else{const e=window.location.pathname,i=e.split("/")[1],o=e.split("/")[2];let r;const n={"":"home","index.php":"home",shoutbox:"shoutbox",t:"torrent",preferences:"settings",u:"user",tor:o,millionaires:"vault"};MP.DEBUG&&console.log(`Page @ ${i}\nSubpage @ ${o}`),n[i]?(r=n[i]===o?o.split(".")[0].replace(/[0-9]/g,""):n[i],MP.DEBUG&&console.log(`Currently on ${r} page`),GM_setValue("mp_currentPage",r),s(t?t===r:r)):MP.DEBUG&&console.warn(`pageStr case returns '${n[i]}'`)}MP.DEBUG&&console.groupEnd()})}}Check.newVer=GM_info.script.version,Check.prevVer=GM_getValue("mp_version");class Style{constructor(){this._theme="light",this._prevTheme=this._getPrevTheme(),void 0!==this._prevTheme?this._theme=this._prevTheme:MP.DEBUG&&console.warn("no previous theme"),this._cssData=GM_getResourceText("MP_CSS")}get theme(){return this._theme}set theme(t){this._theme=t}alignToSiteTheme(){return __awaiter(this,void 0,void 0,(function*(){const t=yield this._getSiteCSS();this._theme=t.indexOf("dark")>0?"dark":"light",this._prevTheme!==this._theme&&this._setPrevTheme(),Check.elemLoad("body").then(()=>{const t=document.querySelector("body");t?t.classList.add(`mp_${this._theme}`):MP.DEBUG&&console.warn(`Body is ${t}`)})}))}injectLink(){const t="mp_css";if(document.getElementById(t))MP.DEBUG&&console.warn(`an element with the id "${t}" already exists`);else{const e=document.createElement("style");e.id=t,e.innerText=void 0!==this._cssData?this._cssData:"",document.querySelector("head").appendChild(e)}}_getPrevTheme(){return GM_getValue("style_theme")}_setPrevTheme(){GM_setValue("style_theme",this._theme)}_getSiteCSS(){return new Promise(t=>{const e=document.querySelector('head link[href*="ICGstation"]').getAttribute("href");"string"==typeof e?t(e):MP.DEBUG&&console.warn(`themeUrl is not a string: ${e}`)})}}class Alerts{constructor(){this._settings={scope:SettingGroup.Other,type:"checkbox",title:"alerts",desc:"Enable the MAM+ Alert panel for update information, etc."},MP.settingsGlob.push(this._settings)}notify(t,e){return MP.DEBUG&&console.group(`Alerts.notify( ${t} )`),new Promise(s=>{if(t)if(GM_getValue("alerts")){const i=(t,e)=>{if(MP.DEBUG&&console.log(`buildMsg( ${e} )`),t.length>0&&""!==t[0]){let s=`<h4>${e}:</h4><ul>`;return t.forEach(t=>{s+=`<li>${t}</li>`},s),s+="</ul>",s}return""},o=t=>{MP.DEBUG&&console.log(`buildPanel( ${t} )`),Check.elemLoad("body").then(()=>{document.body.innerHTML+=`<div class='mp_notification'>${t}<span>X</span></div>`;const e=document.querySelector(".mp_notification"),s=e.querySelector("span");try{s&&s.addEventListener("click",()=>{e&&e.remove()},!1)}catch(t){MP.DEBUG&&console.log(t)}})};let r="";"updated"===t?(MP.DEBUG&&console.log("Building update message"),r=`<strong>MAM+ has been updated!</strong> You are now using v${MP.VERSION}, created on ${MP.TIMESTAMP}. Discuss it on <a href='forums.php?action=viewtopic&topicid=41863'>the forums</a>.<hr>`,r+=i(e.UPDATE_LIST,"Changes"),r+=i(e.BUG_LIST,"Known Bugs")):"firstRun"===t?(r='<h4>Welcome to MAM+!</h4>Please head over to your <a href="/preferences/index.php">preferences</a> to enable the MAM+ settings.<br>Any bug reports, feature requests, etc. can be made on <a href="https://github.com/gardenshade/mam-plus/issues">Github</a>, <a href="/forums.php?action=viewtopic&topicid=41863">the forums</a>, or <a href="/sendmessage.php?receiver=108303">through private message</a>.',MP.DEBUG&&console.log("Building first run message")):MP.DEBUG&&console.warn(`Received msg kind: ${t}`),o(r),MP.DEBUG&&console.groupEnd(),s(!0)}else MP.DEBUG&&(console.log("Notifications are disabled."),console.groupEnd()),s(!1)})}get settings(){return this._settings}}class Debug{constructor(){this._settings={scope:SettingGroup.Other,type:"checkbox",title:"debug",desc:"Error log (<em>Click this checkbox to enable verbose logging to the console</em>)"},MP.settingsGlob.push(this._settings)}get settings(){return this._settings}}class HideHome{constructor(){this._settings={scope:SettingGroup.Global,type:"dropdown",title:"hideHome",tag:"Remove banner/home",options:{default:"Do not remove either",hideBanner:"Hide the banner",hideHome:"Hide the home button"},desc:"Remove the header image or Home button, because both link to the homepage"},this._tar="#mainmenu",Util.startFeature(this._settings,this._tar).then(t=>{t&&this._init()})}_init(){const t=GM_getValue(this._settings.title);"hideHome"===t?(document.body.classList.add("mp_hide_home"),console.log("[M+] Hid the home button!")):"hideBanner"===t&&(document.body.classList.add("mp_hide_banner"),console.log("[M+] Hid the banner!"))}get settings(){return this._settings}}class HideBrowse{constructor(){this._settings={scope:SettingGroup.Global,type:"checkbox",title:"hideBrowse",desc:"Remove the Browse button, because Browse &amp; Search are practically the same"},this._tar="#mainmenu",Util.startFeature(this._settings,this._tar).then(t=>{t&&this._init()})}_init(){document.body.classList.add("mp_hide_browse"),console.log("[M+] Hid the browse button!")}get settings(){return this._settings}}class VaultLink{constructor(){this._settings={scope:SettingGroup.Global,type:"checkbox",title:"vaultLink",desc:"Make the Vault link bypass the Vault Info page"},this._tar="#millionInfo",Util.startFeature(this._settings,this._tar).then(t=>{t&&this._init()})}_init(){document.querySelector(this._tar).setAttribute("href","/millionaires/donate.php"),console.log("[M+] Made the vault text link to the donate page!")}get settings(){return this._settings}}class MiniVaultInfo{constructor(){this._settings={scope:SettingGroup.Global,type:"checkbox",title:"miniVaultInfo",desc:"Shorten the Vault link & ratio text"},this._tar="#millionInfo",Util.startFeature(this._settings,this._tar).then(t=>{t&&this._init()})}_init(){const t=document.querySelector(this._tar),e=document.querySelector("#tmR");e.innerHTML=`${parseFloat(e.innerText).toFixed(2)} <img src="/pic/updownBig.png" alt="ratio">`;let s=parseInt(t.textContent.split(":")[1].split(" ")[1].replace(/,/g,""));s=Number((s/1e6).toFixed(3)),t.textContent=`Vault: ${s} million`,console.log("[M+] Shortened the vault & ratio numbers!")}get settings(){return this._settings}}class BonusPointDelta{constructor(){this._settings={scope:SettingGroup.Global,type:"checkbox",title:"bonusPointDelta",desc:"Display how many bonus points you've gained since last pageload"},this._tar="#tmBP",this._prevBP=0,this._currentBP=0,this._delta=0,this._displayBP=t=>{const e=document.querySelector(this._tar);let s="";s=t>0?`+${t}`:`${t}`,null!==e&&(e.innerHTML+=`<span class='mp_bpDelta'> (${s})</span>`)},this._setBP=t=>{GM_setValue(`${this._settings.title}Val`,`${t}`)},this._getBP=()=>{const t=GM_getValue(`${this._settings.title}Val`);return void 0===t?0:parseInt(t)},Util.startFeature(this._settings,this._tar).then(t=>{t&&this._init()})}_init(){const t=document.querySelector(this._tar);if(this._prevBP=this._getBP(),null!==t){const e=t.textContent.match(/\d+/g);this._currentBP=parseInt(e[0]),this._setBP(this._currentBP),this._delta=this._currentBP-this._prevBP,0===this._delta||isNaN(this._delta)||this._displayBP(this._delta)}}get settings(){return this._settings}}class Shared{constructor(){this.fillGiftBox=(t,e)=>(MP.DEBUG&&console.log(`Shared.fillGiftBox( ${t}, ${e} )`),new Promise(s=>{Check.elemLoad(t).then(()=>{const i=document.querySelector(t);if(i){const t=parseInt(GM_getValue(`${e}_val`));let o=parseInt(i.getAttribute("max"));NaN!==t&&t<=o&&(o=t),i.value=o.toFixed(0),s(o)}else s(void 0)})})),this.getSearchList=()=>(MP.DEBUG&&console.log("Shared.getSearchList( )"),new Promise((t,e)=>__awaiter(this,void 0,void 0,(function*(){yield Check.elemLoad('#ssr tr[id ^= "tdr"] td');const s=document.querySelectorAll('#ssr tr[id ^= "tdr"]');null===s||null==s?e(`snatchList is ${s}`):t(s)}))))}}class TorGiftDefault{constructor(){this._settings={scope:SettingGroup["Torrent Page"],type:"textbox",title:"torGiftDefault",tag:"Default Gift",placeholder:"ex. 5000, max",desc:"Autofills the Gift box with a specified number of points. (<em>Or the max allowable value, whichever is lower</em>)"},this._tar="#thanksArea input[name=points]",Util.startFeature(this._settings,this._tar,["torrent"]).then(t=>{t&&this._init()})}_init(){(new Shared).fillGiftBox(this._tar,this._settings.title).then(t=>console.log(`[M+] Set the default gift amount to ${t}`))}get settings(){return this._settings}}class GoodreadsButton{constructor(){this._settings={scope:SettingGroup["Torrent Page"],type:"checkbox",title:"goodreadsButton",desc:"Enable the MAM-to-Goodreads buttons"},this._tar="#submitInfo",Util.startFeature(this._settings,this._tar,["torrent"]).then(t=>{t&&this._init()})}_init(){return __awaiter(this,void 0,void 0,(function*(){console.log("[M+] Adding the MAM-to-Goodreads buttons...");let t,e,s=document.querySelectorAll("#torDetMainCon .torAuthors a"),i=document.querySelector("#torDetMainCon .TorrentTitle"),o=document.querySelectorAll("#Series a"),r=document.querySelector(this._tar);Util.addTorDetailsRow(r,"Search Goodreads","mp_grRow"),yield Promise.all([t=this._extractData("series",o),e=this._extractData("author",s)]),yield Check.elemLoad(".mp_grRow .flex");let n=document.querySelector(".mp_grRow .flex");if(null===n)throw new Error("Button row cannot be targeted!");t.then(t=>{if(""!==t.extracted){let e=this._buildGrSearchURL("series",t.extracted);Util.createLinkButton(n,e,t.desc,4)}}),yield e.then(t=>{if(""!==t.extracted){let e=this._buildGrSearchURL("author",t.extracted);Util.createLinkButton(n,e,t.desc,3)}else MP.DEBUG&&console.warn("No author data detected!");return{auth:t,book:this._extractData("book",i,t.extracted)}}).then(t=>__awaiter(this,void 0,void 0,(function*(){let e=t.auth,s=yield t.book,i=this._buildGrSearchURL("book",s.extracted);if(Util.createLinkButton(n,i,s.desc,2),""!==e.extracted&&""!==s.extracted){let t=this._buildGrSearchURL("on",`${s.extracted} ${e.extracted}`);Util.createLinkButton(n,t,"Title + Author",1)}else MP.DEBUG&&console.log(`Book+Author failed.\nBook: ${s.extracted}\nAuthor: ${e.extracted}`)}))),console.log("[M+] Added the MAM-to-Goodreads buttons!")}))}_extractData(t,e,s){return void 0===s&&(s=""),new Promise(i=>{if(null===e)throw new Error(`${t} data is null`);{let o="",r="",n={author:()=>{r="Author";let t=e,s=t.length,i="";for(let e=0;e<s&&e<3;e++)i+=`${t[e].innerText} `;o=this._smartAuth(i)},book:()=>{o=e.innerText,r="Title",o=Util.trimString(Util.bracketRemover(o),50),o=this._checkDashes(o,s)},series:()=>{r="Series",e.forEach(t=>{o+=`${t.innerText} `})}};n[t]&&n[t](),i({extracted:o,desc:r})}})}_checkDashes(t,e){if(MP.DEBUG&&console.log(`GoodreadsButton._checkDashes( ${t}, ${e} ): Count ${t.indexOf(" - ")}`),-1!==t.indexOf(" - ")){MP.DEBUG&&console.log("> Book title contains a dash");let s=t.split(" - ");return s[0]===e?(MP.DEBUG&&console.log("> String before dash is author; using string behind dash"),s[1]):s[0]}return t}_smartAuth(t){let e="",s=Util.stringToArray(t);return s.forEach((t,i)=>{if(t.length<2){let o=s[i+1].length;e+=o<2?t:`${t} `}else e+=`${t} `}),e.trim()}_buildGrSearchURL(t,e){MP.DEBUG&&console.log(`GoodreadsButton._buildURL( ${t}, ${e} )`);let s=t,i={book:()=>{s="title"},series:()=>{s="on",e+=", #"}};return i[t]&&i[t](),`http://www.dereferer.org/?https://www.goodreads.com/search?q=${encodeURIComponent(e).replace("'","%27")}&search_type=books&search%5Bfield%5D=${s}`}get settings(){return this._settings}}class CurrentlyReading{constructor(){this._settings={type:"checkbox",scope:SettingGroup["Torrent Page"],title:"currentlyReading",desc:'Add a button to generate a "Currently Reading" forum snippet'},this._tar="#torDetMainCon .TorrentTitle",Util.startFeature(this._settings,this._tar,["torrent"]).then(t=>{t&&this._init()})}_init(){return __awaiter(this,void 0,void 0,(function*(){const t=document.querySelector("#torDetMainCon .TorrentTitle").textContent,e=document.querySelectorAll("#torDetMainCon .torAuthors a"),s=window.location.pathname.split("/")[2],i=document.querySelector("#fInfo");if(null===t)throw new Error("Title field was null");const o=yield Util.addTorDetailsRow(i,"Currently Reading","mp_crRow"),r=yield this._generateSnippet(s,t,e),n=yield this._buildButton(o,r);Util.clipboardifyBtn(n,r)}))}_generateSnippet(t,e,s){let i="";return s.forEach(t=>{i+=`[i]${t.textContent}[/i], `}),`[url=/t/${t}]${e}[/url] by ${i.slice(0,-2)}`}_buildButton(t,e){return t.innerHTML=`<textarea rows="1" cols="80" style='margin-right:5px'>${e}</textarea>`,Util.createLinkButton(t,"none","Copy",2),document.querySelector(".mp_crRow .mp_button_clone").classList.add("mp_reading"),document.querySelector(".mp_reading")}get settings(){return this._settings}}class PriorityUsers{constructor(){this._settings={scope:SettingGroup.Shoutbox,type:"textbox",title:"priorityUsers",tag:"Emphasize Users",placeholder:"ex. system, 25420, 77618",desc:"Emphasizes messages from the listed users in the shoutbox. (<em>This accepts user IDs and usernames. It is not case sensitive.</em>)"},this._tar="#sbf",this._priorityUsers=[],this._userType="priority",Util.startFeature(this._settings,this._tar,["shoutbox","home"]).then(t=>{t&&this._init()})}_init(){return __awaiter(this,void 0,void 0,(function*(){let t=GM_getValue(`${this.settings.title}_val`);if(void 0===t)throw new Error("Userlist is not defined!");this._priorityUsers=yield Util.csvToArray(t),ProcessShouts.watchShoutbox(this._tar,this._priorityUsers,this._userType),console.log("[M+] Highlighting users in the shoutbox...")}))}get settings(){return this._settings}}class PriorityStyle{constructor(){this._settings={scope:SettingGroup.Shoutbox,type:"textbox",title:"priorityStyle",tag:"Emphasis Style",placeholder:"default: 0, 0%, 50%, 0.3",desc:"Change the color/opacity of the highlighting rule for emphasized users' posts. (<em>This is formatted as Hue,Saturation,Lightness,Opacity. H is 0-360, SL are 0-100%, and O is 0-1</em>)"},this._tar="#sbf",Util.startFeature(this._settings,this._tar,["shoutbox","home"]).then(t=>{t&&this._init()})}_init(){return __awaiter(this,void 0,void 0,(function*(){console.log("[M+] Setting custom highlight for priority users...")}))}get settings(){return this._settings}}class MutedUsers{constructor(){this._settings={scope:SettingGroup.Shoutbox,type:"textbox",title:"mutedUsers",tag:"Mute users",placeholder:"ex. 1234, gardenshade",desc:"Obscures messages from the listed users in the shoutbox until hovered. (<em>This accepts user IDs and usernames. It is not case sensitive.</em>)"},this._tar="#sbf",this._mutedUsers=[],this._userType="mute",Util.startFeature(this._settings,this._tar,["shoutbox","home"]).then(t=>{t&&this._init()})}_init(){return __awaiter(this,void 0,void 0,(function*(){let t=GM_getValue(`${this.settings.title}_val`);if(void 0===t)throw new Error("Userlist is not defined!");this._mutedUsers=yield Util.csvToArray(t),ProcessShouts.watchShoutbox(this._tar,this._mutedUsers,this._userType),console.log("[M+] Obscuring muted users...")}))}get settings(){return this._settings}}class ProcessShouts{static watchShoutbox(t,e,s){Check.elemObserver(t,t=>{t.forEach(t=>{t.addedNodes.forEach(t=>{if(void 0!==e&&e.length>0){if(void 0===s)throw new Error("Usertype must be defined if filtering names!");let i=this.extractFromShout(t,'a[href^="/u/"]',"href"),o=this.extractFromShout(t,"a > span","text");e.forEach(e=>{(`/u/${e}`===i||Util.caselessStringMatch(e,o))&&this.styleShout(t,s)})}})})},{childList:!0})}static extractFromShout(t,e,s){if(null!==t){let i=Util.nodeToElem(t).querySelector(e);if(null!==i){let t;if(t="text"!==s?i.getAttribute(s):i.textContent,null!==t)return t;throw new Error("Could not extract shout! Attribute was null")}throw new Error("Could not extract shout! Element was null")}throw new Error("Could not extract shout! Node was null")}static styleShout(t,e){let s=Util.nodeToElem(t);if("priority"===e){let t=GM_getValue("priorityStyle_val");s.style.background=t?`hsla(${t})`:"hsla(0,0%,50%,0.3)"}else"mute"===e&&s.classList.add("mp_muted")}}class ToggleSnatched{constructor(){this._settings={scope:SettingGroup["Browse & Search"],type:"checkbox",title:"toggleSnatched",desc:"Add a button to hide/show results that you've snatched"},this._tar="#ssr",this._isVisible=!0,this._snatchedHook='td div[class^="browse"]',this._share=new Shared,Util.startFeature(this._settings,this._tar,["browse"]).then(t=>{t&&this._init()})}_init(){return __awaiter(this,void 0,void 0,(function*(){let t,e,s;"false"===GM_getValue(`${this._settings.title}State`)&&!0===GM_getValue("stickySnatchedToggle")?this._setVisState(!1):this._setVisState(!0);const i=this._isVisible?"Hide Snatched":"Show Snatched";yield Promise.all([t=Util.createButton("snatchedToggle",i,"h1","#resetNewIcon","beforebegin","torFormButton"),e=this._share.getSearchList()]),t.then(t=>{t.addEventListener("click",()=>{!0===this._isVisible?(t.innerHTML="Show Snatched",this._setVisState(!1)):(t.innerHTML="Hide Snatched",this._setVisState(!0)),this._filterResults(s,this._snatchedHook)},!1)}).catch(t=>{throw new Error(t)}),e.then(t=>__awaiter(this,void 0,void 0,(function*(){s=t,this._searchList=t,this._filterResults(s,this._snatchedHook),console.log("[M+] Added the Toggle Snatched button!")}))).then(()=>{Check.elemObserver("#ssr",()=>{e=this._share.getSearchList(),e.then(t=>__awaiter(this,void 0,void 0,(function*(){s=t,this._searchList=t,yield this._filterResults(s,this._snatchedHook)})))})})}))}_filterResults(t,e){t.forEach(t=>{const s=document.querySelector("#mp_snatchedToggle");null!==t.querySelector(e)&&(!1===this._isVisible?(s.innerHTML="Show Snatched",t.style.display="none"):(s.innerHTML="Hide Snatched",t.style.display="table-row"))})}_setVisState(t){MP.DEBUG&&console.log("Snatch vis state:",this._isVisible,"\nval:",t),GM_setValue(`${this._settings.title}State`,`${t}`),this._isVisible=t}get settings(){return this._settings}get searchList(){if(void 0===this._searchList)throw new Error("searchlist is undefined");return this._searchList}get visible(){return this._isVisible}set visible(t){this._setVisState(t)}}class StickySnatchedToggle{constructor(){this._settings={scope:SettingGroup["Browse & Search"],type:"checkbox",title:"stickySnatchedToggle",desc:"Make toggle state persist between page loads"},this._tar="#ssr",Util.startFeature(this._settings,this._tar,["browse"]).then(t=>{t&&this._init()})}_init(){console.log("[M+] Remembered snatch visibility state!")}get settings(){return this._settings}}class PlaintextSearch{constructor(){this._settings={scope:SettingGroup["Browse & Search"],type:"checkbox",title:"plaintextSearch",desc:"Insert plaintext search results at top of page"},this._tar="#ssr h1",this._isOpen=GM_getValue(`${this._settings.title}State`),this._share=new Shared,this._plainText="",Util.startFeature(this._settings,this._tar,["browse"]).then(t=>{t&&this._init()})}_init(){return __awaiter(this,void 0,void 0,(function*(){let t,e,s;yield Promise.all([t=Util.createButton("plainToggle","Show Plaintext","div","#ssr","beforebegin","mp_toggle mp_plainBtn"),s=this._share.getSearchList()]),s.then(t=>__awaiter(this,void 0,void 0,(function*(){e=yield Util.createButton("plainCopy","Copy Plaintext","div","#mp_plainToggle","afterend","mp_copy mp_plainBtn"),e.insertAdjacentHTML("afterend","<br><textarea class='mp_plaintextSearch' style='display: none'></textarea>"),this._plainText=yield this._processResults(t),document.querySelector(".mp_plaintextSearch").innerHTML=this._plainText,Util.clipboardifyBtn(e,this._plainText)}))).then(()=>{Check.elemObserver("#ssr",()=>{document.querySelector(".mp_plaintextSearch").innerHTML="",s=this._share.getSearchList(),s.then(t=>__awaiter(this,void 0,void 0,(function*(){this._plainText=yield this._processResults(t),document.querySelector(".mp_plaintextSearch").innerHTML=this._plainText})))})}),this._setOpenState(this._isOpen),t.then(t=>{t.addEventListener("click",()=>{const e=document.querySelector(".mp_plaintextSearch");if(null===e)throw new Error("textbox doesn't exist!");"false"===this._isOpen?(this._setOpenState("true"),e.style.display="block",t.innerText="Hide Plaintext"):(this._setOpenState("false"),e.style.display="none",t.innerText="Show Plaintext")},!1)}).catch(t=>{throw new Error(t)}),console.log("[M+] Inserted plaintext search results!")}))}_setOpenState(t){void 0===t&&(t="false"),GM_setValue("toggleSnatchedState",t),this._isOpen=t}_processResults(t){return __awaiter(this,void 0,void 0,(function*(){let e="";return t.forEach(t=>{let s="",i="",o="",r="",n=t.querySelector(".torTitle"),l=t.querySelectorAll(".series"),a=t.querySelectorAll(".author"),c=t.querySelectorAll(".narrator");if(null===n)throw console.warn("Error Node:",t),new Error("Result title should not be null");s=n.textContent.trim(),null!==l&&l.length>0&&(l.forEach(t=>{i+=`${t.textContent} / `}),i=i.substring(0,i.length-3),i=` (${i})`),null!==a&&a.length>0&&(o="BY ",a.forEach(t=>{o+=`${t.textContent} AND `}),o=o.substring(0,o.length-5)),null!==c&&c.length>0&&(r="FT ",c.forEach(t=>{r+=`${t.textContent} AND `}),r=r.substring(0,r.length-5)),e+=`${s}${i} ${o} ${r}\n`}),e}))}get settings(){return this._settings}get isOpen(){return this._isOpen}set isOpen(t){this._setOpenState(t)}}class ToggleHiddenRequesters{constructor(){this._settings={scope:SettingGroup.Requests,type:"checkbox",title:"toggleHiddenRequesters",desc:"Hide hidden requesters"},this._tar="#torRows",Util.startFeature(this._settings,this._tar,["requests"]).then(t=>{t&&this._init()})}_init(){return __awaiter(this,void 0,void 0,(function*(){this._searchList=yield this._getRequestList(),this._filterResults(this._searchList),Check.elemObserver(this._tar,()=>__awaiter(this,void 0,void 0,(function*(){this._searchList=yield this._getRequestList(),this._filterResults(this._searchList)})))}))}_getRequestList(){return new Promise((t,e)=>__awaiter(this,void 0,void 0,(function*(){yield Check.elemLoad("#torRows .torRow .torRight");const s=document.querySelectorAll("#torRows .torRow");null==s?e(`reqList is ${s}`):t(s)})))}_filterResults(t){t.forEach(t=>{null===t.querySelector(".torRight a")&&(t.style.display="none")})}get settings(){return this._settings}}class SimpleVault{constructor(){this._settings={scope:SettingGroup.Vault,type:"checkbox",title:"simpleVault",desc:"Simplify the Vault pages. (<em>This removes everything except the donate button &amp; list of recent donations</em>)"},this._tar="#mainBody",Util.startFeature(this._settings,this._tar,["vault"]).then(t=>{t&&this._init()})}_init(){return __awaiter(this,void 0,void 0,(function*(){const t=GM_getValue("mp_currentPage"),e=document.querySelector(this._tar);console.group(`Applying Vault (${t}) settings...`);const s=e.querySelector("form"),i=e.querySelector("table:last-of-type");if(e.innerHTML="",null!=s){const t=s.cloneNode(!0);e.appendChild(t),t.classList.add("mp_vaultClone")}else e.innerHTML="<h1>Come back tomorrow!</h1>";if(null!=i){const t=i.cloneNode(!0);e.appendChild(t),t.classList.add("mp_vaultClone")}else e.style.paddingBottom="25px";console.log("[M+] Simplified the vault page!")}))}get settings(){return this._settings}}class UserGiftDefault{constructor(){this._settings={scope:SettingGroup["User Pages"],type:"textbox",title:"userGiftDefault",tag:"Default Gift",placeholder:"ex. 1000, max",desc:"Autofills the Gift box with a specified number of points. (<em>Or the max allowable value, whichever is lower</em>)"},this._tar="#bonusgift",Util.startFeature(this._settings,this._tar,["user"]).then(t=>{t&&this._init()})}_init(){(new Shared).fillGiftBox(this._tar,this._settings.title).then(t=>console.log(`[M+] Set the default gift amount to ${t}`))}get settings(){return this._settings}}class InitFeatures{constructor(){new HideHome,new HideBrowse,new VaultLink,new MiniVaultInfo,new BonusPointDelta,new ToggleSnatched,new StickySnatchedToggle,new PlaintextSearch,new ToggleHiddenRequesters,new GoodreadsButton,new CurrentlyReading,new TorGiftDefault,new PriorityUsers,new PriorityStyle,new MutedUsers,new SimpleVault,new UserGiftDefault}}class Settings{static _getScopes(t){return MP.DEBUG&&console.log("_getScopes(",t,")"),new Promise(e=>{let s={};for(let e of t){let t=Number(e.scope);s[t]?s[t].push(e):s[t]=[e]}e(s)})}static _buildTable(t){return MP.DEBUG&&console.log("_buildTable(",t,")"),new Promise(e=>{let s='<tbody><tr><td class="row1" colspan="2"><br>Here you can enable &amp; disable any feature from the <a href="/forums.php?action=viewtopic&topicid=41863&page=p376355#376355">MAM+ userscript</a>! However, these settings are <strong>NOT</strong> stored on MAM; they are stored within the Tampermonkey/Greasemonkey extension in your browser, and must be customized on each of your browsers/devices separately.<br><br></td></tr>';Object.keys(t).forEach(e=>{let i=Number(e);s+=`<tr><td class='row2'>${SettingGroup[i]}</td><td class='row1'>`,Object.keys(t[i]).forEach(e=>{let o=Number(e),r=t[i][o];const n={checkbox:()=>{s+=`<input type='checkbox' id='${r.title}' value='true'>${r.desc}<br>`},textbox:()=>{s+=`<span class='mp_setTag'>${r.tag}:</span> <input type='text' id='${r.title}' placeholder='${r.placeholder}' class='mp_textInput' size='25'>${r.desc}<br>`},dropdown:()=>{s+=`<span class='mp_setTag'>${r.tag}:</span> <select id='${r.title}' class='mp_dropInput'>`,r.options&&Object.keys(r.options).forEach(t=>{s+=`<option value='${t}'>${r.options[t]}</option>`}),s+=`</select>${r.desc}<br>`}};r.type&&n[r.type]()}),s+="</td></tr>"}),s+='<tr><td class="row1" colspan="2"><div id="mp_submit">Save M+ Settings</div><span class="mp_savestate" style="opacity:0">Saved!</span></td></tr></tbody>',e(s)})}static _getSettings(t){let e=GM_listValues();MP.DEBUG&&console.log("_getSettings(",t,")\nStored GM keys:",e),Object.keys(t).forEach(e=>{Object.keys(t[Number(e)]).forEach(s=>{let i=t[Number(e)][Number(s)];if(MP.DEBUG&&console.log("Pref:",i.title,"| Set:",GM_getValue(`${i.title}`),"| Value:",GM_getValue(`${i.title}_val`)),null!==i&&"object"==typeof i){let t=document.getElementById(i.title);const e={checkbox:()=>{t.setAttribute("checked","checked")},textbox:()=>{t.value=GM_getValue(`${i.title}_val`)},dropdown:()=>{t.value=GM_getValue(i.title)}};e[i.type]&&GM_getValue(i.title)&&e[i.type]()}})})}static _setSettings(t){MP.DEBUG&&console.log("_setSettings(",t,")"),Object.keys(t).forEach(e=>{Object.keys(t[Number(e)]).forEach(s=>{let i=t[Number(e)][Number(s)];if(null!==i&&"object"==typeof i){let t=document.getElementById(i.title);const e={checkbox:()=>{t.checked&&GM_setValue(i.title,!0)},textbox:()=>{const e=t.value;""!==e&&(GM_setValue(i.title,!0),GM_setValue(`${i.title}_val`,e))},dropdown:()=>{GM_setValue(i.title,t.value)}};e[i.type]&&e[i.type]()}})}),console.log("[M+] Saved!")}static _saveSettings(t,e){MP.DEBUG&&console.group("_saveSettings()");const s=document.querySelector("span.mp_savestate"),i=GM_listValues();s.style.opacity="0",window.clearTimeout(t),console.log("[M+] Saving...");for(let t in i)"function"!=typeof i[t]&&(["mp_version","style_theme"].includes(i[t])||GM_setValue(i[t],!1));this._setSettings(e),s.style.opacity="1";try{t=window.setTimeout(()=>{s.style.opacity="0"},2345)}catch(t){MP.DEBUG&&console.warn(t)}MP.DEBUG&&console.groupEnd()}static init(t,e){return __awaiter(this,void 0,void 0,(function*(){!0===t&&(MP.DEBUG&&console.group("new Settings()"),yield Check.elemLoad("#mainBody > table").then(t=>{MP.DEBUG&&console.log("[M+] Starting to build Settings table...");const s=document.querySelector("#mainBody > table"),i=document.createElement("h1"),o=document.createElement("table");let r;s.insertAdjacentElement("afterend",i),i.insertAdjacentElement("afterend",o),Util.setAttr(o,{class:"coltable",cellspacing:"1",style:"width:100%;min-width:100%;max-width:100%;"}),i.innerHTML="MAM+ Settings",this._getScopes(e).then(t=>(r=t,this._buildTable(t))).then(t=>(o.innerHTML=t,console.log("[M+] Added the MAM+ Settings table!"),r)).then(t=>(this._getSettings(t),t)).then(t=>{const e=document.querySelector("#mp_submit");try{e.addEventListener("click",()=>{this._saveSettings(void 0,t)},!1)}catch(t){MP.DEBUG&&console.warn(t)}MP.DEBUG&&console.groupEnd()})}))}))}}!function(t){t.DEBUG=!!GM_getValue("debug"),t.CHANGELOG={UPDATE_LIST:['🐞: Displayed point change would sometimes return "NaN"'],BUG_LIST:[]},t.TIMESTAMP="Feb 5",t.VERSION=Check.newVer,t.PREV_VER=Check.prevVer,t.errorLog=[],t.pagePath=window.location.pathname,t.mpCss=new Style,t.settingsGlob=[],t.run=()=>__awaiter(this,void 0,void 0,(function*(){console.group(`Welcome to MAM+ v${t.VERSION}!!!`),GM_deleteValue("mp_currentPage"),Check.page(),document.cookie="mp_enabled=1;domain=myanonamouse.net;path=/";const e=new Alerts;new Debug,Check.updated().then(s=>{s&&e.notify(s,t.CHANGELOG)}),new InitFeatures,Check.page("settings").then(e=>{let s=window.location.search;!0!==e||""!==s&&"?view=general"!==s||Settings.init(e,t.settingsGlob)}),Check.elemLoad('head link[href*="ICGstation"]').then(()=>{t.mpCss.injectLink(),t.mpCss.alignToSiteTheme()}),console.groupEnd()}))}(MP||(MP={})),MP.run();