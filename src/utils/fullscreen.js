function resizeGame(kaplay) {
  const gameCanvas = document.querySelector("canvas");

  const winWidth = window.innerWidth;
  const winHeight = window.innerHeight;

  const scaleX = Math.floor(winWidth / kaplay.width);
  const scaleY = Math.floor(winHeight / kaplay.height);
  const scale = Math.max(1, Math.min(scaleX, scaleY));

  gameCanvas.style.width = kaplay.width * scale + "px";
  gameCanvas.style.height = kaplay.height * scale + "px";
  gameCanvas.style.imageRendering = "pixelated";
  gameCanvas.style.position = "absolute";
  gameCanvas.style.top = "50%";
  gameCanvas.style.left = "50%";
  gameCanvas.style.transform = "translate(-50%, -50%)";
}

function goFullscreen() {
  const canvas = document.querySelector("canvas");
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  } else if (canvas.webkitRequestFullscreen) {
    canvas.webkitRequestFullscreen();
  }
}

export function fullscreenHandler(kaplay) {
  window.addEventListener("resize", resizeGame(kaplay));
  window.addEventListener("load", resizeGame(kaplay));

  document.addEventListener("keydown", (e) => {
    if (e.key === "f") {
      goFullscreen();
    }
  });
}
