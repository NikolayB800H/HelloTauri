function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

const appWindow = window.__TAURI__.appWindow;
const invoke = window.__TAURI__.invoke;
let pct = 0;
console.log("Started js");
invoke('start_pct');
console.log("Continued js");
while (pct < 100) {
  console.log("Before get_pct")
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
  console.log("After get_pct:");
  console.log(`Pct = ${pct}`);
  document.getElementById("loading").innerHTML = "Loading..."+String(pct)+"%";
  await delay(1000);
}
await delay(1000);
invoke('close_splashscreen');
