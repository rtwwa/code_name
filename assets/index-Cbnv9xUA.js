import{h as P}from"./kaplay-CpR_OpMc.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function o(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(e){if(e.ep)return;e.ep=!0;const n=o(e);fetch(e.href,n)}})();function h(r){const t=document.querySelector("canvas"),o=window.innerWidth,s=window.innerHeight,e=Math.floor(o/r.width),n=Math.floor(s/r.height),a=Math.max(1,Math.min(e,n));t.style.width=r.width*a+"px",t.style.height=r.height*a+"px",t.style.imageRendering="pixelated",t.style.position="absolute",t.style.top="50%",t.style.left="50%",t.style.transform="translate(-50%, -50%)"}function C(){const r=document.querySelector("canvas");r.requestFullscreen?r.requestFullscreen():r.webkitRequestFullscreen&&r.webkitRequestFullscreen()}function D(r){window.addEventListener("resize",h(r)),window.addEventListener("load",h(r)),document.addEventListener("keydown",t=>{t.key==="f"&&C()})}const A=800,M=800,O={foreground:[237,242,226]},i={background:[34,42,61],foreground:[237,242,226]};function m(r){i.foreground=r,get("*").map(o=>{o.color&&(o.color=Color.fromArray(r)),o.outline&&(o.outline.color=Color.fromArray(r))})}const p={kaplayInstance:null,currentScene:null,init(r){this.kaplayInstance=r},addScene(r,t){if(!this.kaplayInstance){console.error("Kaplay instance не инициализирован");return}this.kaplayInstance.scene(r,t)},startScene(r){if(!this.kaplayInstance){console.error("Kaplay instance не инициализирован");return}this.currentScene=r,this.kaplayInstance.go(r)}};function g(r,t={}){const{bulletCount:o=12,bulletSpeed:s=150,damage:e=1,shootInterval:n=2,bulletColor:a=[i.foreground],size:u=24}=t,f=add([rect(u,u),pos(r),color(i.foreground),anchor("center"),"enemy",{bulletCount:o,bulletSpeed:s,damage:e,shootInterval:n}]);function c(){for(let l=0;l<f.bulletCount;l++){const d=l/f.bulletCount*Math.PI*2,b=vec2(Math.cos(d),Math.sin(d));add([circle(6),pos(f.pos),color(i.foreground),area(),"bullet",{dir:b,speed:f.bulletSpeed,damage:f.damage}])}}return loop(f.shootInterval,()=>{c()}),f}function L(r){onUpdate("bullet",t=>{t.move(t.dir.scale(t.speed)),r(t)}),onCollide("bullet","player",(t,o)=>{shake(4),destroy(t),o.hurt(t.damage)})}const x={c:null,async init(){await loadSprite("crosshair","./sprites/crosshair.png"),this.c=add([sprite("crosshair"),pos(center()),color(i.foreground),anchor("center"),"cursor"]),this.c.use(shader("newTint",()=>({r:i.foreground.at(0)/255,g:i.foreground.at(1)/255,b:i.foreground.at(2)/255}))),setCursor("none"),onUpdate("cursor",r=>{r.pos=mousePos()})},getCursorPos(){return this.c?vec2(this.c.pos):null}},y=700,k=1.5;function E(r){const t=add([timer()]);let o=!1;return t.useDash=()=>{if(o==!0)return;o=!0,t.wait(k,()=>{o=!1});const s=r.pos,n=x.getCursorPos().sub(s).unit();r.applyImpulse(vec2(y*n.x,y*n.y))},onMousePress("left",()=>{t.useDash(r)}),t}const v=5,w=250,H=7,R=.3,F=async r=>{let t=vec2(12,2),o=!0;loadSprite("hero","./sprites/all.png",{sliceX:t.x,sliceY:t.y,anims:{afk:0,idle:{from:0,to:7,loop:!0},walk:{from:12,to:23,loop:!0}}});const s=await getSprite("hero"),e=add([sprite(s),health(v,v),pos(r),color(i.foreground),area({shape:new Polygon([vec2(-18,12),vec2(10,12),vec2(10,-20),vec2(-18,-20)])}),body(),anchor(vec2(.2,.5)),timer(),"player"]);e.use(shader("playerShader",()=>({r:e.color.r/255,g:e.color.g/255,b:e.color.b/255,h:596+(1-e.hp()/e.maxHP())*1452,texSize:vec2(s.tex.width,s.tex.height),frameOffset:vec2(s.frames[e.frame].x,s.frames[e.frame].y),frameSize:vec2(s.frames[e.frame].w,s.frames[e.frame].h)}))),onKeyPress("space",()=>{e.hurt(1),console.log(e.maxHP(),e.hp()/e.maxHP())}),e.drag=H,e.canMove=!0,e.isMoving=!1,e.lastDirection=vec2(1,1);const n={KeyW:"up",KeyA:"left",KeyS:"down",KeyD:"right"},a={};document.addEventListener("keydown",c=>{const l=n[c.code];l&&(a[l]=!0)}),document.addEventListener("keyup",c=>{const l=n[c.code];l&&(a[l]=!1)});function u(c){return!!a[c]}const f=()=>{if(!e.canMove)return;let c=0,l=0;u("left")&&(c-=1),u("right")&&(c+=1),u("up")&&(l-=1),u("down")&&(l+=1);let d=vec2(c,l);d.len()>0&&(d=d.unit(),e.lastDirection=d,e.move(d.x*w,d.y*w),e.flipX=d.x<0)};return E(e),e.onUpdate(()=>{if(f(),(u("left")||u("right")||u("up")||u("down"))&&e.canMove){if(e.isMoving=!0,e.curAnim()=="walk")return;e.play("walk")}else{if(e.isMoving=!1,e.curAnim()=="idle")return;e.play("afk")}}),e.hurt=c=>{o&&(o=!1,e.wait(R,()=>{o=!0}),e.setHP(e.hp()-c),e.trigger("hurt"))},e.onHurt(c=>{e.hp()<=0||(m([255,0,0]),e.wait(.3,()=>{m(O.foreground)}))}),e.onDeath(()=>{p.startScene("death")}),e},I=async()=>{const r=vec2(center().x,center().y*1.7),t=await F(r);await x.init();const o=vec2(width()/2,height()/2),s=width()/2-16,e=36;add([pos(o),circle(s,{fill:!1}),outline(2,Color.fromArray(i.foreground)),"border"]),t.onUpdate(()=>{if(t.pos.dist(o)>s-e){const a=t.pos.sub(o).unit();t.pos=o.add(a.scale(s-e))}}),L(n=>{n.pos.dist(o)>s-n.radius/2&&destroy(n)}),g(vec2(center().x,150)),g(vec2(center().x,200),{bulletCount:24,bulletSpeed:200})},T=async r=>{const t=vec2(width()/2,height()/2),o=width()/2-16;add([pos(t),circle(o,{fill:!1}),outline(2,Color.fromArray(i.foreground))]);const s=add([text(`You are dead!
Press space to restart`,{font:"Tiny",align:"center"}),color(i.foreground),pos(center()),anchor("center"),layer("ui"),animate()]);return onKeyPress("space",()=>{p.startScene("test")}),s.animate("scale",[0,1],{duration:.5,loops:1}),r};function _(){loadShader("playerShader",null,`
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
      `),loadShader("newTint",null,`
    precision mediump float;

    uniform float r;
    uniform float g;
    uniform float b;

    vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
      vec4 c = def_frag();

      return vec4(r, g, b, c.a);
    }
    `)}const S=P({background:[i.background],width:A,height:M,scale:1,pixelated:!0});D(S);loadFont("Tiny","./fonts/Tiny5-Regular.ttf");_();p.init(S);p.addScene("test",I);p.addScene("death",T);p.startScene("test");const z=document.querySelector("body");z.style.backgroundColor=rgb(i.background);
//# sourceMappingURL=index-Cbnv9xUA.js.map
