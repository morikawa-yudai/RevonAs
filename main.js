(function(){
  "use strict";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = !!window.gsap;
  var root = document.documentElement;

  function hideLoader(){var l=document.getElementById("loader");if(l){l.classList.add("done");setTimeout(function(){l.style.display="none";},900);}}
  window.addEventListener("load",function(){setTimeout(hideLoader, reduce?200:1700);});
  setTimeout(hideLoader,4500);

  var header=document.querySelector("header");
  var prog=document.getElementById("progress");
  function onScroll(y){header.classList.toggle("scrolled",y>40);
    if(prog){var h=document.documentElement.scrollHeight-innerHeight;prog.style.transform="scaleX("+(h>0?Math.min(1,Math.max(0,y/h)):0)+")";}}

  var lenis=null;
  if(window.Lenis && !reduce){
    lenis=new Lenis({duration:1.15,easing:function(t){return Math.min(1,1.001-Math.pow(2,-10*t));},smoothWheel:true});
    root.classList.add("lenis");
    (function raf(t){lenis.raf(t);requestAnimationFrame(raf);})();
    lenis.on("scroll",function(e){onScroll(e.scroll);if(hasGSAP&&window.ScrollTrigger)ScrollTrigger.update();});
  } else { window.addEventListener("scroll",function(){onScroll(window.scrollY);},{passive:true}); }

  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener("click",function(e){
      var id=a.getAttribute("href"); if(id.length<2)return;
      var el=document.querySelector(id); if(!el)return; e.preventDefault();
      if(lenis)lenis.scrollTo(el,{offset:-10}); else el.scrollIntoView({behavior:reduce?"auto":"smooth"});
    });
  });

  /* custom cursor + dark-section inversion */
  (function(){
    if(matchMedia("(hover:none),(pointer:coarse)").matches||reduce)return;
    var ring=document.querySelector(".cursor"),dot=document.querySelector(".cursor-dot");
    if(!ring||!dot)return;
    var mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
    window.addEventListener("mousemove",function(e){mx=e.clientX;my=e.clientY;dot.style.transform="translate("+mx+"px,"+my+"px) translate(-50%,-50%)";
      var el=document.elementFromPoint(mx,my); ring.classList.toggle("inv",!!(el&&el.closest(".dark,footer")));});
    (function loop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.transform="translate("+rx+"px,"+ry+"px) translate(-50%,-50%)";requestAnimationFrame(loop);})();
    document.querySelectorAll("a,button,.biz-row,.str,input,textarea,select").forEach(function(el){
      el.addEventListener("mouseenter",function(){ring.classList.add("big");});
      el.addEventListener("mouseleave",function(){ring.classList.remove("big");});
    });
  })();

  /* magnetic buttons */
  if(!reduce && !matchMedia("(hover:none)").matches){
    document.querySelectorAll(".btn").forEach(function(b){
      b.addEventListener("mousemove",function(e){var r=b.getBoundingClientRect();
        b.style.transform="translate("+((e.clientX-r.left-r.width/2)*.18)+"px,"+((e.clientY-r.top-r.height/2)*.28)+"px)";});
      b.addEventListener("mouseleave",function(){b.style.transform="";});
    });
  }

  /* STRENGTH spotlight */
  (function(){
    var grid=document.querySelector(".str-grid"); if(!grid||matchMedia("(hover:none)").matches)return;
    grid.addEventListener("mousemove",function(e){var r=grid.getBoundingClientRect();
      grid.style.setProperty("--sx",((e.clientX-r.left)/r.width*100)+"%");
      grid.style.setProperty("--sy",((e.clientY-r.top)/r.height*100)+"%");});
    grid.addEventListener("mouseenter",function(){grid.classList.add("spot");});
    grid.addEventListener("mouseleave",function(){grid.classList.remove("spot");});
  })();

  /* BUSINESS cursor-follow label */
  (function(){
    var list=document.querySelector(".biz-list"),lbl=document.querySelector(".biz-cursor");
    if(!list||!lbl||matchMedia("(hover:none)").matches||reduce)return;
    list.addEventListener("mousemove",function(e){lbl.style.left=e.clientX+"px";lbl.style.top=e.clientY+"px";
      var row=e.target.closest(".biz-row"),en=row&&row.querySelector(".en");lbl.textContent=(en?en.textContent:"View");});
    list.addEventListener("mouseenter",function(){lbl.classList.add("on");});
    list.addEventListener("mouseleave",function(){lbl.classList.remove("on");});
  })();

  /* COMPANY panel tilt */
  (function(){
    var el=document.querySelector(".co-visual"); if(!el||matchMedia("(hover:none)").matches||reduce)return;
    el.addEventListener("mousemove",function(e){var r=el.getBoundingClientRect();
      var rx=((e.clientY-r.top)/r.height-.5)*-8,ry=((e.clientX-r.left)/r.width-.5)*8;
      el.style.transform="perspective(800px) rotateX("+rx+"deg) rotateY("+ry+"deg)";});
    el.addEventListener("mouseleave",function(){el.style.transform="";});
  })();

  /* ambient tech network (faint, behind empty areas) */
  (function(){
    var c=document.getElementById("ambient"); if(!c) return;
    var ctx=c.getContext("2d"),W,H,dpr=Math.min(window.devicePixelRatio||1,2),pts=[],raf;
    function resize(){
      W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
      var target=reduce?0:Math.min(52,Math.floor(W*H/26000));pts=[];
      for(var i=0;i<target;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.2});
    }
    function draw(){
      ctx.clearRect(0,0,W,H);
      for(var i=0;i<pts.length;i++){
        var p=pts[i];p.x+=p.vx;p.y+=p.vy;
        if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
        for(var j=i+1;j<pts.length;j++){
          var q=pts[j],dx=p.x-q.x,dy=p.y-q.y,d=dx*dx+dy*dy;
          if(d<24000){var o=(1-d/24000)*.16;ctx.strokeStyle="rgba(46,99,232,"+o+")";ctx.lineWidth=.6;
            ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
        }
        ctx.fillStyle="rgba(46,99,232,.22)";ctx.beginPath();ctx.arc(p.x,p.y,1.1,0,6.283);ctx.fill();
      }
      raf=requestAnimationFrame(draw);
    }
    resize();window.addEventListener("resize",resize);
    if(!reduce)draw();
    document.addEventListener("visibilitychange",function(){if(document.hidden)cancelAnimationFrame(raf);else if(!reduce)draw();});
  })();

  if(hasGSAP && !reduce){
    root.classList.add("has-gsap");
    gsap.registerPlugin(ScrollTrigger);

    /* hero pre-scroll timeline */
    gsap.set(".hero h1 .line",{yPercent:112});
    gsap.set(".hero-eyebrow,.hero-sub,.hero-actions",{y:26});
    gsap.set(".hero-ghost",{opacity:0});
    gsap.set(".hero-mark",{xPercent:6,opacity:0});
    var tl=gsap.timeline({delay:1.55});
    tl.to(".hero-mark",{xPercent:0,opacity:.9,duration:1.5,ease:"power3.out"},0)
      .to(".hero-ghost",{opacity:1,duration:2,ease:"power2.out"},0)
      .to(".hero h1 .line",{yPercent:0,duration:1.15,stagger:.12,ease:"power4.out"},.15)
      .to(".hero-eyebrow,.hero-sub,.hero-actions",{opacity:1,y:0,duration:.9,stagger:.1,ease:"power3.out"},"-=.75");

    /* reveals */
    gsap.utils.toArray(".reveal").forEach(function(el){
      if(el.closest("#hero"))return;
      gsap.fromTo(el,{y:34,opacity:0},{y:0,opacity:1,duration:1,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 88%"}});
    });

    /* splittype word reveals */
    if(window.SplitType){
      gsap.utils.toArray(".reveal-line").forEach(function(el){
        var s=new SplitType(el,{types:"words"});
        s.words.forEach(function(w){w.classList.add("rl-w");});
        gsap.fromTo(s.words,{opacity:0,y:26},{opacity:1,y:0,duration:.7,stagger:.045,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 82%"}});
      });
    }

    /* ABOUT — scroll-scrubbed word illumination */
    if(window.SplitType){
      document.querySelectorAll(".illum").forEach(function(el){
        var s=new SplitType(el,{types:"words"});
        gsap.fromTo(s.words,{opacity:.24},{opacity:1,stagger:.35,ease:"none",
          scrollTrigger:{trigger:el,start:"top 82%",end:"bottom 60%",scrub:true}});
      });
    }

    gsap.to(".hero-mark",{yPercent:8,ease:"none",scrollTrigger:{trigger:"#hero",start:"top top",end:"bottom top",scrub:true}});
    gsap.to(".hero-ghost",{xPercent:-6,ease:"none",scrollTrigger:{trigger:"#hero",start:"top top",end:"bottom top",scrub:true}});

    /* count up + metric line */
    gsap.utils.toArray("[data-count]").forEach(function(el){
      var end=+el.getAttribute("data-count"),o={v:0};
      ScrollTrigger.create({trigger:el,start:"top 92%",once:true,onEnter:function(){
        gsap.to(o,{v:end,duration:1.8,ease:"power2.out",onUpdate:function(){el.textContent=end>=1000?Math.floor(o.v).toLocaleString():Math.floor(o.v);}});
      }});
    });
    gsap.utils.toArray(".metric .ln i").forEach(function(el){
      gsap.fromTo(el,{width:"0%"},{width:"100%",duration:1.4,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 92%"}});
    });

    /* flow line + nodes */
    var fill=document.querySelector(".flow-line i");
    if(fill){
      gsap.to(fill,{height:"100%",ease:"none",scrollTrigger:{trigger:".flow-wrap",start:"top 58%",end:"bottom 78%",scrub:.6}});
      gsap.utils.toArray(".flow-step").forEach(function(s){
        ScrollTrigger.create({trigger:s,start:"top 60%",onEnter:function(){s.classList.add("on");},onLeaveBack:function(){s.classList.remove("on");}});
      });
    }
    ScrollTrigger.refresh();
  } else {
    root.classList.remove("has-gsap");
    document.querySelectorAll("[data-count]").forEach(function(el){var e=+el.getAttribute("data-count");el.textContent=e>=1000?e.toLocaleString():e;});
    document.querySelectorAll(".metric .ln i").forEach(function(el){el.style.width="100%";});
  }

  var burger=document.querySelector(".burger");
  if(burger)burger.addEventListener("click",function(){
    alert("メニュー：About / Business / Strength / Flow / Recruit / Company / Contact\n(モバイルナビはWordPress実装時にドロワーで実装します)");
  });
})();
