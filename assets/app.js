(function () {
  var ROOT = window.ROOT || "";
  var NAV = window.NAV || { panduan: [], manual: [] };
  var SEARCH = window.SEARCH || [];

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  function abs(u){return ROOT + u;}
  function urlEncode(u){return u.split('/').map(encodeURIComponent).join('/');}
  function here(){return decodeURIComponent(location.pathname);}
  function isActive(u){var h=here();return h.endsWith('/'+u)||h.endsWith(u);}
  function isMobile(){return window.matchMedia('(max-width:960px)').matches;}

  // flatten for pager + lookup
  var flat = [], lookup = {};
  NAV.panduan.forEach(function(p){ flat.push(p); lookup[p.u]={kind:'panduan',title:p.t}; });
  NAV.manual.forEach(function(s){
    s.items.forEach(function(i){ flat.push(i); lookup[i.u]={kind:'manual',section:s.section,title:i.t}; });
  });
  function currentIndex(){ var h=here(); for(var i=0;i<flat.length;i++){ if(h.endsWith('/'+flat[i].u)||h.endsWith(flat[i].u)) return i; } return -1; }

  // ---------- sidebar ----------
  function buildSidebar(){
    var sb=document.getElementById('sidebar'); if(!sb) return;
    var h='<a class="nav-home'+(isActive('index.html')?' active':'')+'" href="'+urlEncode(abs('index.html'))+'">&#127968; Beranda</a>';
    h+='<div class="nav-group"><div class="nav-title">Panduan Praktis (ID)</div><ul>';
    NAV.panduan.forEach(function(p){ h+='<li><a class="'+(isActive(p.u)?'active':'')+'" href="'+urlEncode(abs(p.u))+'">'+esc(p.t)+'</a></li>'; });
    h+='</ul></div>';
    h+='<div class="nav-group"><div class="nav-title">Manual Lengkap 7.26</div>';
    NAV.manual.forEach(function(sec){
      var open=sec.items.some(function(i){return isActive(i.u);});
      h+='<details class="nav-sec"'+(open?' open':'')+'><summary>'+esc(sec.section)+'</summary><ul>';
      sec.items.forEach(function(i){ h+='<li><a class="'+(isActive(i.u)?'active':'')+'" href="'+urlEncode(abs(i.u))+'">'+esc(i.t)+'</a></li>'; });
      h+='</ul></details>';
    });
    h+='</div>';
    sb.innerHTML=h;
  }

  // ---------- breadcrumbs ----------
  function buildBreadcrumbs(){
    var el=document.getElementById('breadcrumbs'); if(!el) return;
    var idx=currentIndex();
    var h=['<a href="'+urlEncode(abs('index.html'))+'">Beranda</a>'];
    if(idx>=0){
      var info=lookup[flat[idx].u];
      if(info.kind==='panduan'){ h.push('<span class="sep">/</span><span>Panduan Praktis</span>'); }
      else { h.push('<span class="sep">/</span><span>Manual</span>'); h.push('<span class="sep">/</span><span>'+esc(info.section)+'</span>'); }
      h.push('<span class="sep">/</span><span>'+esc(info.title)+'</span>');
    }
    el.innerHTML=h.join(' ');
  }

  // ---------- pager ----------
  function buildPager(){
    var el=document.getElementById('pager'); if(!el) return;
    var idx=currentIndex(); if(idx<0){ el.innerHTML=''; return; }
    var prev=idx>0?flat[idx-1]:null, next=idx<flat.length-1?flat[idx+1]:null;
    var h='';
    if(prev) h+='<a href="'+urlEncode(abs(prev.u))+'"><div class="dir">&larr; Sebelumnya</div><div class="ttl">'+esc(prev.t)+'</div></a>'; else h+='<span class="spacer"></span>';
    if(next) h+='<a class="next" href="'+urlEncode(abs(next.u))+'"><div class="dir">Berikutnya &rarr;</div><div class="ttl">'+esc(next.t)+'</div></a>'; else h+='<span class="spacer"></span>';
    el.innerHTML=h;
  }

  // ---------- code + tables ----------
  function buildCode(){
    document.querySelectorAll('.doc pre').forEach(function(pre){
      if(pre.parentElement && pre.parentElement.classList.contains('codewrap')) return;
      var code=pre.querySelector('code');
      var lang='';
      if(code && code.className){ var m=code.className.match(/language-([\w-]+)/); if(m) lang=m[1]; }
      var wrap=document.createElement('div'); wrap.className='codewrap';
      var head=document.createElement('div'); head.className='codehead';
      head.innerHTML='<span>'+(lang?esc(lang):'terminal')+'</span>';
      var btn=document.createElement('button'); btn.className='copybtn'; btn.type='button'; btn.textContent='Copy';
      btn.addEventListener('click',function(){
        var t=code?code.innerText:pre.innerText;
        function done(){ btn.textContent='Tersalin'; btn.classList.add('done');
          setTimeout(function(){ btn.textContent='Copy'; btn.classList.remove('done'); },1400); }
        if(navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(t).then(done,function(){ fallbackCopy(t,done); });
        } else { fallbackCopy(t,done); }
      });
      head.appendChild(btn);
      pre.parentNode.insertBefore(wrap,pre); wrap.appendChild(head); wrap.appendChild(pre);
    });
  }
  function fallbackCopy(t,cb){ try{ var ta=document.createElement('textarea'); ta.value=t; ta.style.position='fixed'; ta.style.opacity='0';
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); cb(); }catch(e){} }
  function buildTables(){
    document.querySelectorAll('.doc table').forEach(function(t){
      if(t.parentElement && t.parentElement.classList.contains('table-scroll')) return;
      var w=document.createElement('div'); w.className='table-scroll';
      t.parentNode.insertBefore(w,t); w.appendChild(t);
    });
  }

  // ---------- theme ----------
  function initTheme(){
    var btn=document.getElementById('theme-toggle'); if(!btn) return;
    function cur(){return document.documentElement.getAttribute('data-theme')||'light';}
    function set(t){document.documentElement.setAttribute('data-theme',t);btn.innerHTML=t==='dark'?'&#9728;':'&#9789;';
      btn.setAttribute('aria-label',t==='dark'?'Mode terang':'Mode gelap');
      try{localStorage.setItem('theme',t);}catch(e){}}
    set(cur());
    btn.addEventListener('click',function(){set(cur()==='dark'?'light':'dark');});
  }

  // ---------- search ----------
  var box, input, sel=-1, cur=[];
  function hl(text,q){ if(!q) return esc(text); var i=text.toLowerCase().indexOf(q); if(i<0) return esc(text);
    return esc(text.slice(0,i))+'<mark>'+esc(text.slice(i,i+q.length))+'</mark>'+esc(text.slice(i+q.length)); }
  function run(q){
    q=q.trim().toLowerCase(); if(!q){hide();return;}
    var arr=[];
    for(var i=0;i<SEARCH.length;i++){ var e=SEARCH[i],t=(e.t||'').toLowerCase(),x=(e.x||'').toLowerCase(),s=(e.s||'').toLowerCase(),r=-1;
      if(t.indexOf(q)===0)r=0; else if(t.indexOf(q)>=0)r=1; else if(x.indexOf(q)>=0)r=2; else if(s.indexOf(q)>=0)r=3;
      if(r>=0)arr.push({r:r,e:e}); }
    arr.sort(function(a,b){return a.r-b.r;});
    cur=arr.slice(0,40).map(function(o){return o.e;});
    render(q,arr.length);
  }
  function render(q,total){
    if(!box) return;
    if(!cur.length){ box.innerHTML='<div class="sr-empty">Tidak ada hasil untuk &ldquo;'+esc(q)+'&rdquo;.</div>'; box.hidden=false; return; }
    var h='<div class="sr-head">'+total+' hasil &middot; Enter buka, Esc tutup</div>';
    h+=cur.map(function(e,i){ return '<a class="sr-item'+(i===sel?' sel':'')+'" href="'+urlEncode(abs(e.u))+'">'
      +'<div class="sr-sec">'+esc(e.s)+'</div><div class="sr-title">'+hl(e.t,q)+'</div>'
      +(e.x?'<div class="sr-x">'+hl(e.x,q)+'</div>':'')+'</a>'; }).join('');
    box.innerHTML=h; box.hidden=false;
  }
  function hide(){ if(box){box.hidden=true;box.innerHTML='';} sel=-1; cur=[]; }
  function initSearch(){
    input=document.getElementById('search'); box=document.getElementById('search-results'); if(!input) return;
    input.addEventListener('input',function(){sel=-1;run(input.value);});
    input.addEventListener('keydown',function(ev){
      if(ev.key==='Escape'){input.blur();hide();}
      else if(ev.key==='ArrowDown'){ev.preventDefault();sel=Math.min(sel+1,cur.length-1);render(input.value.trim().toLowerCase(),cur.length);}
      else if(ev.key==='ArrowUp'){ev.preventDefault();sel=Math.max(sel-1,0);render(input.value.trim().toLowerCase(),cur.length);}
      else if(ev.key==='Enter'){ if(sel>=0&&cur[sel]) location.href=abs(cur[sel].u); }
    });
    document.addEventListener('click',function(e){ if(box&&!box.contains(e.target)&&e.target!==input) hide(); });
    document.addEventListener('keydown',function(e){
      if(e.key==='/'&&document.activeElement!==input&&!/input|textarea/i.test(document.activeElement.tagName)){e.preventDefault();input.focus();}
    });
  }

  // ---------- mobile drawer ----------
  function initMenu(){
    var t=document.getElementById('menu-toggle'), sb=document.getElementById('sidebar');
    if(!t||!sb) return;
    var bd=document.querySelector('.backdrop');
    if(!bd){ bd=document.createElement('div'); bd.className='backdrop'; document.body.appendChild(bd); }
    function open(){ sb.classList.add('open'); bd.classList.add('show'); t.setAttribute('aria-expanded','true'); }
    function close(){ sb.classList.remove('open'); bd.classList.remove('show'); t.setAttribute('aria-expanded','false'); }
    t.setAttribute('aria-expanded','false');
    t.addEventListener('click',function(){ sb.classList.contains('open')?close():open(); });
    bd.addEventListener('click',close);
    sb.addEventListener('click',function(e){ if(e.target.closest('a')) close(); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') close(); });
    window.addEventListener('resize',function(){ if(!isMobile()) close(); });
  }

  function initTop(){ var b=document.getElementById('to-top'); if(!b) return;
    window.addEventListener('scroll',function(){ b.hidden = window.scrollY<400; },{passive:true});
    b.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});}); }

  document.addEventListener('DOMContentLoaded',function(){
    buildSidebar(); buildBreadcrumbs(); buildPager(); buildCode(); buildTables();
    initTheme(); initSearch(); initMenu(); initTop();
  });
})();
