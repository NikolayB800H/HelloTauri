const appWindow = window.__TAURI__.appWindow;
const invoke = window.__TAURI__.invoke;

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

const kDelay = 500;
const outerCircMax = 32*3.14*2;
const innerCircMax = 23*3.14*2;
const atrErase = {
  opacity: 0,
};
const timErase = {
  duration: kDelay,
  iterations: 1,
};
const loading = document.getElementById("loading");
const outerCirc = document.getElementById("outerCirc");
const innerCirc = document.getElementById("innerCirc");
const toErase = document.getElementById("toErase");
let pct = 0;
let prevPct = 0;

function animate() {
  outerCirc.setAttribute("stroke-dasharray", `${outerCircMax * pct / 100.0},${outerCircMax}`);
  innerCirc.setAttribute("stroke-dasharray", `${innerCircMax * pct / 100.0},${innerCircMax}`);
};

invoke('start_pct');
while (pct < 100) {
  prevPct = pct
  invoke('get_pct')
    .then((response) => {
      pct = response;
      console.log("Pct:");
      console.log(pct);
    })
    .catch((error) => {
      console.log("Error:");
      console.log(error);
    });
  animate();
  loading.innerHTML = String(prevPct)+"%";
  await delay(500);
}
animate();
loading.innerHTML = "100%";
toErase.animate(atrErase, timErase);
await delay(kDelay);
invoke('close_splashscreen');
