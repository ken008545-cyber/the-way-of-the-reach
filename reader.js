/* The Way of the Reach — reader kit. Highlights, bookmarks, reading settings,
   verse of the day, continue reading, passage image cards.
   All reader state lives in the reader's own browser (localStorage). No accounts, no server. */
(function(){
"use strict";
var LS={get:function(k,d){try{var v=localStorage.getItem("reach."+k);return v?JSON.parse(v):d}catch(e){return d}},set:function(k,v){try{localStorage.setItem("reach."+k,JSON.stringify(v))}catch(e){}}};
var page=(location.pathname.split("/").pop()||"index.html");
var main=document.querySelector("main"); if(!main) return;
var root=main.querySelector(".tts")||main;
function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
/* ---------- reading settings ---------- */
var S=LS.get("settings",{fs:19,font:"serif",theme:"light"});
function applySettings(){document.documentElement.setAttribute("data-rfont",S.font);document.documentElement.setAttribute("data-rtheme",S.theme);main.style.fontSize=S.fs+"px";LS.set("settings",S);
  document.querySelectorAll("#rk-panel [data-set]").forEach(function(b){var kv=b.getAttribute("data-set").split(":");b.classList.toggle("on",String(S[kv[0]])===kv[1])});}
var tools=el("div");tools.id="rk-tools";
var bAa=el("button",null,"Aa  Reading settings");
var bBm=el("button",null,"☆  Bookmark");
var bSh=el("button",null,"Share this page");
tools.appendChild(bAa);tools.appendChild(bBm);tools.appendChild(bSh);
var h1=main.querySelector("h1"); (h1?h1.parentNode:main).insertBefore(tools,h1?h1.nextSibling:main.firstChild);
var panel=el("div");panel.id="rk-panel";
panel.innerHTML='<div class="rk-lab">Text size</div><div class="rk-row"><button data-act="fs-">A −</button><button data-act="fs+">A +</button></div>'
+'<div class="rk-lab">Font</div><div class="rk-row"><button data-set="font:serif">Serif</button><button data-set="font:sans">Clean sans</button></div>'
+'<div class="rk-lab">Page</div><div class="rk-row"><button data-set="theme:light">Light</button><button data-set="theme:sepia">Sepia</button><button data-set="theme:dark">Dark</button></div>';
tools.parentNode.insertBefore(panel,tools.nextSibling);
bAa.onclick=function(){panel.classList.toggle("open")};
panel.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;
  if(b.hasAttribute("data-set")){var kv=b.getAttribute("data-set").split(":");S[kv[0]]=kv[1];}
  if(b.getAttribute("data-act")==="fs-")S.fs=Math.max(15,S.fs-1);
  if(b.getAttribute("data-act")==="fs+")S.fs=Math.min(26,S.fs+1);
  applySettings();});
applySettings();
/* ---------- bookmarks ---------- */
var BM=LS.get("bookmarks",{});
function bmSync(){var on=!!BM[page];bBm.textContent=on?"★  Bookmarked":"☆  Bookmark";bBm.classList.toggle("on",on)}
bBm.onclick=function(){if(BM[page])delete BM[page];else BM[page]={t:(document.title||page).replace(/\s*[·|–-].*$/,""),ts:Date.now()};LS.set("bookmarks",BM);bmSync();};
bmSync();
bSh.onclick=function(){var d={title:document.title,url:location.href};if(navigator.share)navigator.share(d).catch(function(){});else if(navigator.clipboard)navigator.clipboard.writeText(location.href).then(function(){bSh.textContent="Link copied";setTimeout(function(){bSh.textContent="Share this page"},1600)});};
/* ---------- front-door cards ---------- */
var isDoor=(page==="index.html"||page==="start-here.html"||page==="");
if(isDoor){
  var VOTD=[["In the beginning God created the heaven and the earth.","Genesis 1:1","GEN.1.1"],["Thy word is a lamp unto my feet, and a light unto my path.","Psalm 119:105","PSA.119.105"],["Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.","Joshua 1:9","JOS.1.9"],["I can do all things through Christ which strengtheneth me.","Philippians 4:13","PHP.4.13"],["Trust in the LORD with all thine heart; and lean not unto thine own understanding.","Proverbs 3:5","PRO.3.5"],["For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.","John 3:16","JHN.3.16"],["The LORD is my shepherd; I shall not want.","Psalm 23:1","PSA.23.1"],["Let all your things be done with charity.","1 Corinthians 16:14","1CO.16.14"],["Rejoice in the Lord alway: and again I say, Rejoice.","Philippians 4:4","PHP.4.4"],["Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you.","Matthew 7:7","MAT.7.7"],["Blessed are the merciful: for they shall obtain mercy.","Matthew 5:7","MAT.5.7"],["Thy kingdom come. Thy will be done in earth, as it is in heaven.","Matthew 6:10","MAT.6.10"],["Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.","John 14:27","JHN.14.27"],["And we know that all things work together for good to them that love God, to them who are the called according to his purpose.","Romans 8:28","ROM.8.28"],["Create in me a clean heart, O God; and renew a right spirit within me.","Psalm 51:10","PSA.51.10"],["He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?","Micah 6:8","MIC.6.8"],["Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD.","Psalm 27:14","PSA.27.14"],["If ye love me, keep my commandments.","John 14:15","JHN.14.15"],["Let the words of my mouth, and the meditation of my heart, be acceptable in thy sight, O LORD, my strength, and my redeemer.","Psalm 19:14","PSA.19.14"],["This is the day which the LORD hath made; we will rejoice and be glad in it.","Psalm 118:24","PSA.118.24"]];
  var day=Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0))/864e5), v=VOTD[day%VOTD.length];
  var card=el("section","rk-card");var k=el("p","rk-k","Verse of the day");var vt=el("p","rk-v","“"+v[0]+"”");var vr=el("p","rk-r");
  var a=el("a",null,v[1]+" (KJV)");a.href="https://www.bible.com/bible/1/"+v[2];a.target="_blank";a.rel="noopener";vr.appendChild(a);vr.appendChild(document.createTextNode("  ·  read it in YouVersion"));
  card.appendChild(k);card.appendChild(vt);card.appendChild(vr);
  var anchor=main.querySelector(".hero")||tools; anchor.parentNode.insertBefore(card,anchor.nextSibling);
  var last=LS.get("lastread",null);
  if(last&&last.p!==page){var c2=el("section","rk-card");c2.appendChild(el("p","rk-k","Continue reading"));var l2=el("p","rk-r");var a2=el("a",null,last.t);a2.href=last.p;l2.appendChild(a2);c2.appendChild(l2);card.parentNode.insertBefore(c2,card.nextSibling);}
  var keys=Object.keys(BM); if(keys.length){var c3=el("section","rk-card");c3.appendChild(el("p","rk-k","Your bookmarks"));keys.sort(function(x,y){return BM[y].ts-BM[x].ts}).forEach(function(pg){var r=el("p","rk-r");var a3=el("a",null,BM[pg].t);a3.href=pg;r.appendChild(a3);c3.appendChild(r)});card.parentNode.insertBefore(c3,card.nextSibling);}
}else{
  LS.set("lastread",{p:page,t:(document.title||page).replace(/\s*[·|–-].*$/,""),ts:Date.now()});
}
/* ---------- highlights ---------- */
var HKEY="highlights."+page, HL=LS.get(HKEY,[]);
var menu=el("div");menu.id="rk-menu";document.body.appendChild(menu);
var selText="",selRange=null,activeMark=null;
function textNodes(){var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){return n.parentNode.closest("#rk-menu,#rk-tools,#rk-panel")?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});var out=[];while(w.nextNode())out.push(w.currentNode);return out}
function wrapSpan(start,end,color,hid){var nodes=textNodes(),off=0;nodes.forEach(function(n){var len=n.nodeValue.length,s=Math.max(start,off),e=Math.min(end,off+len);if(s<e){var mid=n;if(s>off)mid=mid.splitText(s-off);if(e<off+len)mid.splitText(e-s);var m=el("mark","hl hl-"+color);m.setAttribute("data-hid",hid);mid.parentNode.replaceChild(m,mid);m.appendChild(mid);}off+=len;});}
function saveHL(){LS.set(HKEY,HL)}
function restore(){HL.forEach(function(h){var full=root.textContent;var needle=h.before+h.text+h.after;var i=full.indexOf(needle);var start;if(i>=0)start=i+h.before.length;else{i=full.indexOf(h.text);if(i<0)return;start=i}wrapSpan(start,start+h.text.length,h.color,h.id);var mk=root.querySelector('mark[data-hid="'+h.id+'"]');if(mk&&h.note)mk.title=h.note;});}
restore();
function contextFor(text){var full=root.textContent;var i=full.indexOf(text);if(i<0)i=0;return{before:full.slice(Math.max(0,i-30),i),after:full.slice(i+text.length,i+text.length+30)}}
function showMenu(x,y,html){menu.innerHTML=html;menu.style.display="block";var r=menu.getBoundingClientRect();menu.style.left=Math.min(x,innerWidth-r.width-10)+"px";menu.style.top=Math.max(8,y)+"px";}
function hideMenu(){menu.style.display="none";activeMark=null}
var COLORS=["yellow","green","blue","pink","purple"];
function buildMenu(){var dots=COLORS.map(function(c){return '<button class="rk-dot" data-color="'+c+'" style="background:'+({yellow:"#ffec8a",green:"#bfe6ab",blue:"#aecbeb",pink:"#f6c3dc",purple:"#d8c6f5"})[c]+'" aria-label="Highlight '+c+'"></button>'}).join("");
  return '<div class="rk-row">'+dots+'<button data-act="note">Note</button><button data-act="image">Image</button><button data-act="copy">Copy</button><button data-act="close">✕</button></div>';}
function onSelect(){var sel=getSelection();if(!sel||sel.isCollapsed||!sel.rangeCount){return}
  var r=sel.getRangeAt(0);if(!root.contains(r.commonAncestorContainer))return;
  selText=sel.toString().trim();if(selText.length<2)return;selRange=r.cloneRange();
  var rect=r.getBoundingClientRect();showMenu(rect.left+scrollX,rect.top+scrollY-58,buildMenu());}
document.addEventListener("mouseup",function(){setTimeout(onSelect,10)});
document.addEventListener("touchend",function(){setTimeout(onSelect,60)});
document.addEventListener("mousedown",function(e){if(!menu.contains(e.target)&&!e.target.closest("mark.hl"))hideMenu();});
menu.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;var act=b.getAttribute("data-act"),col=b.getAttribute("data-color");
  if(act==="close"){hideMenu();return}
  if(act==="copy"){if(navigator.clipboard)navigator.clipboard.writeText(selText);hideMenu();return}
  if(act==="image"){makeImage(selText);hideMenu();return}
  if(act==="remove"&&activeMark){var hid=activeMark.getAttribute("data-hid");HL=HL.filter(function(h){return h.id!==hid});saveHL();root.querySelectorAll('mark[data-hid="'+hid+'"]').forEach(function(m){m.replaceWith.apply(m,[].slice.call(m.childNodes))});root.normalize();hideMenu();return}
  if(col||act==="note"){var note="";if(act==="note"){note=prompt("Your note for this highlight:","")||""}
    var full=root.textContent;var ctx=contextFor(selText);var start=full.indexOf(ctx.before+selText)>=0?full.indexOf(ctx.before+selText)+ctx.before.length:full.indexOf(selText);if(start<0)return;
    var h={id:"h"+Date.now(),color:col||"yellow",note:note,text:selText,before:ctx.before,after:ctx.after};HL.push(h);saveHL();wrapSpan(start,start+selText.length,h.color,h.id);getSelection().removeAllRanges();hideMenu();}});
root.addEventListener("click",function(e){var m=e.target.closest("mark.hl");if(!m)return;activeMark=m;var h=HL.filter(function(x){return x.id===m.getAttribute("data-hid")})[0];
  var r=m.getBoundingClientRect();showMenu(r.left+scrollX,r.top+scrollY-64,'<div class="rk-row">'+(h&&h.note?'<span style="color:#e8cc7a;font-size:12.5px;max-width:220px">'+h.note.replace(/</g,"&lt;")+'</span>':"")+'<button data-act="remove">Remove highlight</button><button data-act="close">✕</button></div>');});
/* ---------- passage image card ---------- */
function makeImage(text){var c=document.createElement("canvas");c.width=1200;c.height=1200;var x=c.getContext("2d");
  var g=x.createLinearGradient(0,0,0,1200);g.addColorStop(0,"#1d2a49");g.addColorStop(1,"#101b31");x.fillStyle=g;x.fillRect(0,0,1200,1200);
  x.strokeStyle="#c9a54a";x.lineWidth=3;x.strokeRect(46,46,1108,1108);x.lineWidth=1;x.strokeRect(62,62,1076,1076);
  x.fillStyle="#e8cc7a";x.font="600 30px Georgia";x.textAlign="center";x.fillText("✦",600,150);
  x.fillStyle="#fbf8f1";x.font="italic 44px Georgia";var words=text.split(/\s+/),lines=[],line="";words.forEach(function(wd){if((line+" "+wd).length>34){lines.push(line);line=wd}else line=line?line+" "+wd:wd});if(line)lines.push(line);
  var y=1200/2-(lines.length-1)*33;lines.slice(0,12).forEach(function(l){x.fillText("“"+(l===lines[0]?"":"")+l+(l===lines[lines.length-1]?"”":""),600,y);y+=66});
  x.fillStyle="#c9a54a";x.font="600 25px Georgia";x.fillText("T H E   W A Y   O F   T H E   R E A C H",600,1085);
  var a=el("a");a.download="passage.png";a.href=c.toDataURL("image/png");a.click();}
})();
