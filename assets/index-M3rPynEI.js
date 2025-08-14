import{h as D}from"./kaplay-CpR_OpMc.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))e(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&e(a)}).observe(document,{childList:!0,subtree:!0});function r(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function e(n){if(n.ep)return;n.ep=!0;const s=r(n);fetch(n.href,s)}})();function p(t){const o=document.querySelector("canvas"),r=window.innerWidth,e=window.innerHeight,n=Math.floor(r/t.width),s=Math.floor(e/t.height),a=Math.max(1,Math.min(n,s));o.style.width=t.width*a+"px",o.style.height=t.height*a+"px",o.style.imageRendering="pixelated",o.style.position="absolute",o.style.top="50%",o.style.left="50%",o.style.transform="translate(-50%, -50%)"}function b(){const t=document.querySelector("canvas");t.requestFullscreen?t.requestFullscreen():t.webkitRequestFullscreen&&t.webkitRequestFullscreen()}function C(t){window.addEventListener("resize",p(t)),window.addEventListener("load",p(t)),document.addEventListener("keydown",o=>{o.key==="f"&&b()})}const P=800,O=800,A={foreground:[237,242,226]},c={background:[34,42,61],foreground:[237,242,226]};function h(t){c.foreground=t,get("*").map(r=>{r.color&&(r.color=Color.fromArray(t)),r.outline&&(r.outline.color=Color.fromArray(t))})}const u={kaplayInstance:null,currentScene:null,init(t){this.kaplayInstance=t},addScene(t,o){if(!this.kaplayInstance){console.error("Kaplay instance не инициализирован");return}this.kaplayInstance.scene(t,o)},startScene(t){if(!this.kaplayInstance){console.error("Kaplay instance не инициализирован");return}this.currentScene=t,this.kaplayInstance.go(t)}};function m(t,o={}){const{bulletCount:r=12,bulletSpeed:e=150,damage:n=1,shootInterval:s=2,bulletColor:a=[c.foreground],size:i=24}=o,l=add([rect(i,i),pos(t),color(c.foreground),anchor("center"),"enemy",{bulletCount:r,bulletSpeed:e,damage:n,shootInterval:s}]);function x(){for(let d=0;d<l.bulletCount;d++){const f=d/l.bulletCount*Math.PI*2,S=vec2(Math.cos(f),Math.sin(f));add([circle(6),pos(l.pos),color(c.foreground),area(),"bullet",{dir:S,speed:l.bulletSpeed,damage:l.damage}])}}return loop(l.shootInterval,()=>{x()}),l}function M(t){onUpdate("bullet",o=>{o.move(o.dir.scale(o.speed)),t(o)}),onCollide("bullet","player",(o,r)=>{shake(4),destroy(o),r.hurt(o.damage)})}const L=async()=>{const t=add([rect(25,25),pos(center()),color(c.foreground),anchor("center"),"cursor"]);return console.log(t),t};function E(){onUpdate("cursor",t=>{t.pos=mousePos()})}const y=700,F=1.5;function H(t){const o=add([timer()]);let r=!1;return o.useDash=()=>{r!=!0&&(r=!0,o.wait(F,()=>{r=!1}),t.applyImpulse(vec2(y*t.lastDirection.x,y*t.lastDirection.y)))},onKeyPress("x",()=>{o.useDash(t)}),o}const g=5,v=250,I=7,K=async t=>{let o=vec2(12,2);loadSprite("hero","./sprites/all.png",{sliceX:o.x,sliceY:o.y,anims:{afk:0,idle:{from:0,to:7,loop:!0},walk:{from:12,to:23,loop:!0}}}),loadShader("tint",null,`
  precision mediump float;

  uniform float r;
  uniform float g;
  uniform float b;
  uniform float h;
  uniform vec2 texSize;
  uniform vec2 frameOffset;
  uniform vec2 frameSize;

  vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
      vec4 c = texture2D(tex, uv);

      if (c.a < 0.01) {
          return c;
      }

      vec2 offsetX = vec2(1.0 / texSize.x, 0.0);
      vec2 offsetY = vec2(0.0, 1.0 / texSize.y);

      float alphaUp    = texture2D(tex, uv + offsetY).a;
      float alphaDown  = texture2D(tex, uv - offsetY).a;
      float alphaLeft  = texture2D(tex, uv - offsetX).a;
      float alphaRight = texture2D(tex, uv + offsetX).a;

      if (alphaUp < 0.01 || alphaDown < 0.01 || alphaLeft < 0.01 || alphaRight < 0.01) {
          return vec4(r, g, b, c.a);
      }

      vec2 pixelCoord = uv * texSize;
      vec2 localPixel = pixelCoord - (frameOffset * texSize);
      vec2 localUV = localPixel / frameSize; // 0..1 по фрейму

      if (localUV.y <= h) {
          return vec4(1.0, 0.0, 0.0, 0.0);
      }

      return vec4(r, g, b, c.a);
      }
      `);const r=await getSprite("hero"),e=add([sprite(r),health(g,g),pos(t),color(c.foreground),area({shape:new Polygon([vec2(-18,12),vec2(10,12),vec2(10,-20),vec2(-18,-20)])}),body(),anchor(vec2(.2,.5)),timer(),"player"]);e.use(shader("tint",()=>({r:e.color.r/255,g:e.color.g/255,b:e.color.b/255,h:596+(1-e.hp()/e.maxHP())*1452,texSize:vec2(r.tex.width,r.tex.height),frameOffset:vec2(r.frames[e.frame].x,r.frames[e.frame].y),frameSize:vec2(r.frames[e.frame].w,r.frames[e.frame].h)}))),onKeyPress("space",()=>{e.hurt(1),console.log(e.maxHP(),e.hp()/e.maxHP())}),e.drag=I,e.canMove=!0,e.isMoving=!1,e.lastDirection=vec2(1,1);const n=()=>{if(!e.canMove)return;let s=0,a=0;isKeyDown("left")&&(s-=1),isKeyDown("right")&&(s+=1),isKeyDown("up")&&(a-=1),isKeyDown("down")&&(a+=1);let i=vec2(s,a);i.len()>0&&(i=i.unit(),e.lastDirection=i,e.move(i.x*v,i.y*v),e.flipX=i.x<0)};return H(e),e.onUpdate(()=>{if(n(),(isKeyDown("left")||isKeyDown("right")||isKeyDown("up")||isKeyDown("down"))&&e.canMove){if(e.isMoving=!0,e.curAnim()=="walk")return;e.play("walk")}else{if(e.isMoving=!1,e.curAnim()=="idle")return;e.play("afk")}}),e.onHurt(()=>{e.hp()<=0||(h([255,0,0]),e.wait(.3,()=>{h(A.foreground)}))}),e.onDeath(()=>{u.startScene("death")}),e},R=async()=>{const t=vec2(center().x,center().y*1.7),o=await K(t),r=vec2(width()/2,height()/2),e=width()/2-16,n=36;add([pos(r),circle(e,{fill:!1}),outline(2,Color.fromArray(c.foreground)),"border"]),o.onUpdate(()=>{if(o.pos.dist(r)>e-n){const a=o.pos.sub(r).unit();o.pos=r.add(a.scale(e-n))}}),add([text("x -> dash",{font:"Tiny"}),pos(20,20),layer("ui"),color(c.foreground)]),M(s=>{s.pos.dist(r)>e-s.radius/2&&destroy(s)}),m(vec2(center().x,150)),m(vec2(center().x,200),{bulletCount:24,bulletSpeed:200}),await L(),E(),setCursor("none")},k=async t=>{const o=vec2(width()/2,height()/2),r=width()/2-16;return add([pos(o),circle(r,{fill:!1}),outline(2,Color.fromArray(c.foreground))]),add([text(`You are dead!
Press space to restart`,{font:"Tiny",align:"center"}),color(c.foreground),pos(center()),anchor("center"),layer("ui")]),onKeyPress("space",()=>{u.startScene("test")}),t},w=D({background:[c.background],width:P,height:O,scale:1,pixelated:!0});C(w);loadFont("Tiny","./fonts/Tiny5-Regular.ttf");u.init(w);u.addScene("test",R);u.addScene("death",k);u.startScene("test");const z=document.querySelector("body");z.style.backgroundColor=rgb(c.background);
//# sourceMappingURL=index-M3rPynEI.js.map
