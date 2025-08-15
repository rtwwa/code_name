import{h as M}from"./kaplay-CpR_OpMc.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function r(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerPolicy&&(s.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?s.credentials="include":e.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(e){if(e.ep)return;e.ep=!0;const s=r(e);fetch(e.href,s)}})();function x(o){const t=document.querySelector("canvas"),r=window.innerWidth,n=window.innerHeight,e=Math.floor(r/o.width),s=Math.floor(n/o.height),i=Math.max(1,Math.min(e,s));t.style.width=o.width*i+"px",t.style.height=o.height*i+"px",t.style.imageRendering="pixelated",t.style.position="absolute",t.style.top="50%",t.style.left="50%",t.style.transform="translate(-50%, -50%)"}function T(){const o=document.querySelector("canvas");o.requestFullscreen?o.requestFullscreen():o.webkitRequestFullscreen&&o.webkitRequestFullscreen()}function F(o){window.addEventListener("resize",x(o)),window.addEventListener("load",x(o)),document.addEventListener("keydown",t=>{t.key==="f"&&T()})}const I=800,L=800,O={foreground:[237,242,226]},d={background:[34,42,61],foreground:[237,242,226]};function w(o){d.foreground=o,get("*").map(r=>{r.color&&(r.color=Color.fromArray(o)),r.outline&&(r.outline.color=Color.fromArray(o))})}const p={kaplayInstance:null,currentScene:null,init(o){this.kaplayInstance=o},addScene(o,t){if(!this.kaplayInstance){console.error("Kaplay instance не инициализирован");return}this.kaplayInstance.scene(o,t)},startScene(o){if(!this.kaplayInstance){console.error("Kaplay instance не инициализирован");return}this.currentScene=o,this.kaplayInstance.go(o)}};function H(o,t,r,n={}){const{size:e=10,speed:s=200,moveInterval:i=1.5,damage:c=1,aggroRange:h=200,travelRange:a=200,hp:l=1}=n;let u=o;const f=add([circle(e),pos(o),color(d.foreground),area(),health(l),anchor("center"),"enemy","spider",{damage:c,speed:s,size:e}]);function C(){const m=get("player")[0];if(m){const y=f.pos.dist(m.pos);if(y<h&&y>10){u=vec2(m.pos.x,m.pos.y),f.moveTo(u,s);return}}u=P(),u.dist(t)>r-e&&(u=center())}function P(){return vec2(f.pos.x+rand(-a,a),f.pos.y+rand(-a,a))}function k(){f.moveTo(u,s)}return loop(i,()=>{C()}),f.onUpdate(()=>{k()}),f.onDeath(()=>{destroy(f)}),f}function R(){onCollide("spider","player",(o,t)=>{shake(4),console.log(o),t.hurt(o.damage)})}function S(o,t={}){const{bulletCount:r=12,bulletSpeed:n=150,damage:e=1,shootInterval:s=2,size:i=24}=t,c=add([rect(i,i),pos(o),color(d.foreground),anchor("center"),"enemy",{bulletCount:r,bulletSpeed:n,damage:e,shootInterval:s}]);function h(){for(let a=0;a<c.bulletCount;a++){const l=a/c.bulletCount*Math.PI*2,u=vec2(Math.cos(l),Math.sin(l));add([circle(6),pos(c.pos),color(d.foreground),area(),"bullet",{dir:u,speed:c.bulletSpeed,damage:c.damage}])}}return loop(c.shootInterval,()=>{h()}),c}function E(o){onUpdate("bullet",t=>{t.move(t.dir.scale(t.speed)),o(t)}),onCollide("bullet","player",(t,r)=>{destroy(t),r.hurt(t.damage)})}const D={c:null,async init(){await loadSprite("crosshair","./sprites/crosshair.png"),this.c=add([sprite("crosshair"),pos(center()),color(d.foreground),anchor("center"),"cursor"]),this.c.use(shader("newTint",()=>({r:d.foreground.at(0)/255,g:d.foreground.at(1)/255,b:d.foreground.at(2)/255}))),setCursor("none"),onUpdate("cursor",o=>{o.pos=mousePos()})},getCursorPos(){return this.c?vec2(this.c.pos):null}},z=1.5;async function _(o){const t=add([timer()]);t.damage=1,t.maxDist=150,t.speed=800;let r=!1,n=null,e=null;return t.Attack=()=>{r!=!0&&(r=!0,t.wait(z,()=>{r=!1}),e=t.getAttackDir(),n=t.getAttackPos())},t.getAttackDir=()=>{const s=o.pos;return D.getCursorPos().sub(s).unit()},t.getAttackPos=()=>vec2(o.pos.x+e.x*t.maxDist,o.pos.y+e.y*t.maxDist),onMousePress("left",()=>{console.log(t),t.Attack()}),t.onUpdate(()=>{n!=null&&(o.setInv(!1),o.canMove=!1,o.moveTo(n,t.speed),o.getCollisions()[0]&&o.getCollisions().map(i=>{if(i.target.tags.includes("enemy")){n=null,o.canMove=!0,i.target.hurt(),console.log(i.target.hp());return}}),o.setInvTime(.1),n!=null&&n.x.toFixed(0)==o.pos.x.toFixed(0)&&n.y.toFixed(0)==o.pos.y.toFixed(0)&&(n=null,o.canMove=!0))}),t}const g=5,v=250,b=.3,U=async o=>{let t=vec2(8,3),r=!0;loadSprite("hero","./sprites/all.png",{sliceX:t.x,sliceY:t.y,anims:{afk:0,idle:{from:0,to:7,loop:!0},walk:{from:8,to:14,loop:!0}}});const n=await getSprite("hero"),e=add([sprite(n),health(g,g),pos(o),color(d.foreground),area({shape:new Polygon([vec2(-18,12),vec2(10,12),vec2(10,-20),vec2(-18,-20)])}),body(),anchor(vec2(.2,.5)),timer(),{maxHeath:g,health:g,speed:v,invAfterHurt:b},"player"]);e.use(shader("playerShader",()=>({r:e.color.r/255,g:e.color.g/255,b:e.color.b/255,h:596+(1-e.hp()/e.maxHP())*1452,texSize:vec2(n.tex.width,n.tex.height),frameOffset:vec2(n.frames[e.frame].x,n.frames[e.frame].y),frameSize:vec2(n.frames[e.frame].w,n.frames[e.frame].h)}))),onKeyPress("space",()=>{get("bullet").map(l=>{console.log(l.radius),l.radius=l.radius*3})}),e.canMove=!0,e.isMoving=!1;const s={KeyW:"up",KeyA:"left",KeyS:"down",KeyD:"right"},i={};document.addEventListener("keydown",a=>{const l=s[a.code];l&&(i[l]=!0)}),document.addEventListener("keyup",a=>{const l=s[a.code];l&&(i[l]=!1)});function c(a){return!!i[a]}const h=()=>{if(!e.canMove)return;let a=0,l=0;c("left")&&(a-=1),c("right")&&(a+=1),c("up")&&(l-=1),c("down")&&(l+=1);let u=vec2(a,l);u.len()>0&&(u=u.unit(),e.lastDirection=u,e.move(u.x*v,u.y*v),e.flipX=u.x<0)};return _(e),e.onUpdate(()=>{if(h(),(c("left")||c("right")||c("up")||c("down"))&&e.canMove){if(e.isMoving=!0,e.curAnim()=="walk")return;e.play("walk")}else{if(e.isMoving=!1,e.curAnim()=="idle")return;e.play("afk")}}),e.hurt=a=>{r&&(e.setInvTime(b),e.setHP(e.hp()-a),e.trigger("hurt"))},e.setInvTime=a=>{r=!1,e.wait(a,()=>{r=!0})},e.setInv=a=>{r=a,console.log(r)},e.onHurt(()=>{e.hp()<=0||(shake(4),w([156,23,59]),e.wait(.3,()=>{w(O.foreground)}))}),e.onDeath(()=>{p.startScene("death")}),e},K=async()=>{const o=vec2(center().x,center().y*1.7),t=await U(o);await D.init();const r=vec2(width()/2,height()/2),n=width()/2-16,e=36;add([pos(r),circle(n,{fill:!1}),outline(2,Color.fromArray(d.foreground)),"border"]),t.onUpdate(()=>{if(t.pos.dist(r)>n-e){const i=t.pos.sub(r).unit();t.pos=r.add(i.scale(n-e))}}),add([text("try space",{font:"Tiny"}),pos(20,20),layer("ui"),color(d.foreground)]),E(s=>{s.pos.dist(r)>n-s.radius&&destroy(s)}),S(vec2(center().x,150)),S(vec2(center().x,200),{bulletCount:24,bulletSpeed:200}),R(),H(center(),r,n)},q=async o=>{const t=vec2(width()/2,height()/2),r=width()/2-16;add([pos(t),circle(r,{fill:!1}),outline(2,Color.fromArray(d.foreground))]);const n=add([text(`You are dead!
Press space to restart`,{font:"Tiny",align:"center"}),color(d.foreground),pos(center()),anchor("center"),layer("ui"),animate()]);return onKeyPress("space",()=>{p.startScene("test")}),n.animate("scale",[0,1],{duration:.5,loops:1}),o};function X(){loadShader("playerShader",null,`
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
    `)}const A=M({background:[d.background],width:I,height:L,scale:1,pixelated:!0});F(A);loadFont("Tiny","./fonts/Tiny5-Regular.ttf");X();p.init(A);p.addScene("test",K);p.addScene("death",q);p.startScene("test");const Y=document.querySelector("body");Y.style.backgroundColor=rgb(d.background);
//# sourceMappingURL=index-gUcC76eP.js.map
