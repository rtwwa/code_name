import{h as D}from"./kaplay-CpR_OpMc.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))e(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&e(a)}).observe(document,{childList:!0,subtree:!0});function r(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function e(n){if(n.ep)return;n.ep=!0;const s=r(n);fetch(n.href,s)}})();function p(o){const t=document.querySelector("canvas"),r=window.innerWidth,e=window.innerHeight,n=Math.floor(r/o.width),s=Math.floor(e/o.height),a=Math.max(1,Math.min(n,s));t.style.width=o.width*a+"px",t.style.height=o.height*a+"px",t.style.imageRendering="pixelated",t.style.position="absolute",t.style.top="50%",t.style.left="50%",t.style.transform="translate(-50%, -50%)"}function b(){const o=document.querySelector("canvas");o.requestFullscreen?o.requestFullscreen():o.webkitRequestFullscreen&&o.webkitRequestFullscreen()}function C(o){window.addEventListener("resize",p(o)),window.addEventListener("load",p(o)),document.addEventListener("keydown",t=>{t.key==="f"&&b()})}const P=640,M=640,l={background:[34,42,61],foreground:[237,242,226]},d={kaplayInstance:null,currentScene:null,init(o){this.kaplayInstance=o},addScene(o,t){if(!this.kaplayInstance){console.error("Kaplay instance не инициализирован");return}this.kaplayInstance.scene(o,t)},startScene(o){if(!this.kaplayInstance){console.error("Kaplay instance не инициализирован");return}this.currentScene=o,this.kaplayInstance.go(o)}};function m(o,t={}){const{bulletCount:r=12,bulletSpeed:e=150,damage:n=1,shootInterval:s=2,bulletColor:a=[l.foreground],size:i=24}=t,c=add([rect(i,i),pos(o),color(l.foreground),anchor("center"),"enemy",{bulletCount:r,bulletSpeed:e,damage:n,shootInterval:s}]);function x(){for(let u=0;u<c.bulletCount;u++){const h=u/c.bulletCount*Math.PI*2,S=vec2(Math.cos(h),Math.sin(h));add([circle(8),pos(c.pos),color(...a),area(),"bullet",{dir:S,speed:c.bulletSpeed,damage:c.damage}])}}return loop(c.shootInterval,()=>{x()}),c}function O(o){onUpdate("bullet",t=>{t.move(t.dir.scale(t.speed)),o(t)}),onCollide("bullet","player",(t,r)=>{shake(4),destroy(t),r.hurt(t.damage)})}const y=700,L=1.5;function A(o){const t=add([timer()]);let r=!1;return t.useDash=()=>{r!=!0&&(r=!0,t.wait(L,()=>{r=!1}),o.applyImpulse(vec2(y*o.lastDirection.x,y*o.lastDirection.y)))},onKeyPress("x",()=>{t.useDash(o)}),t}const v=5,g=250,f=l.foreground,R=7,E=async o=>{let t=vec2(12,2);loadSprite("hero","./sprites/all.png",{sliceX:t.x,sliceY:t.y,anims:{afk:0,idle:{from:0,to:7,loop:!0},walk:{from:12,to:23,loop:!0}}}),loadShader("tint",null,`
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
      `);const r=await getSprite("hero");console.log(r);const e=add([sprite(r),health(v,v),pos(o),area({shape:new Polygon([vec2(-18,12),vec2(10,12),vec2(10,-20),vec2(-18,-20)])}),body(),anchor(vec2(.2,.5)),"player"]);console.log(e.hp()),e.use(shader("tint",()=>({r:f.at(0)/255,g:f.at(1)/255,b:f.at(2)/255,h:596+(1-e.hp()/e.maxHP())*1452,texSize:vec2(r.tex.width,r.tex.height),frameOffset:vec2(r.frames[e.frame].x,r.frames[e.frame].y),frameSize:vec2(r.frames[e.frame].w,r.frames[e.frame].h)}))),onKeyPress("space",()=>{e.hurt(1),console.log(e.maxHP(),e.hp()/e.maxHP())}),e.drag=R,e.canMove=!0,e.isMoving=!1,e.lastDirection=vec2(1,1);const n=()=>{if(!e.canMove)return;let s=0,a=0;isKeyDown("left")&&(s-=1),isKeyDown("right")&&(s+=1),isKeyDown("up")&&(a-=1),isKeyDown("down")&&(a+=1);let i=vec2(s,a);i.len()>0&&(i=i.unit(),e.lastDirection=i,e.move(i.x*g,i.y*g),e.flipX=i.x<0)};return A(e),e.onUpdate(()=>{if(n(),(isKeyDown("left")||isKeyDown("right")||isKeyDown("up")||isKeyDown("down"))&&e.canMove){if(e.isMoving=!0,e.curAnim()=="walk")return;e.play("walk")}else{if(e.isMoving=!1,e.curAnim()=="idle")return;e.play("afk")}}),e},H=async()=>{const o=vec2(width()/6+50,height()-200),t=await E(o),r=vec2(width()/2,height()/2),e=width()/2-16,n=36;add([pos(r),circle(e,{fill:!1}),outline(2,Color.fromArray(l.foreground))]),t.onUpdate(()=>{if(t.pos.dist(r)>e-n){const a=t.pos.sub(r).unit();t.pos=r.add(a.scale(e-n))}}),add([text("x -> dash",{font:"Tiny"}),pos(20,20),layer("ui")]),O(s=>{s.pos.dist(r)>e-s.radius/2&&destroy(s)}),m(vec2(center().x,150)),m(vec2(center().x,200),{bulletCount:24,bulletSpeed:200})},w=D({background:[l.background],width:P,height:M,scale:1,pixelated:!0});C(w);loadFont("Tiny","./fonts/Tiny5-Regular.ttf");d.init(w);d.addScene("test",H);d.startScene("test");const I=document.querySelector("body");I.style.backgroundColor=rgb(l.background);
//# sourceMappingURL=index-D7Z8lV-L.js.map
