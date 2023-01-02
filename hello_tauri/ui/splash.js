//import { appWindow } from '@tauri-apps/api/window';
//import { invoke } from '@tauri-apps/api/tauri';
//import tauriapi from '@tauri-apps/api';
//const { invoke } = tauriapi.tauri;
//const { appWindow } = tauriapi.tauri;
//console.log("Init")
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

const appWindow = window.__TAURI__.appWindow;
const invoke = window.__TAURI__.invoke;
let pct = 0;
//({event, payload}) => document.getElementById("loading").innerHTML = "Loading..."+String(payload)+"%"
/*const unlistenProgress = await appWindow.listen('PROGRESS',
({event, payload}) => { pct = payload }
);*/
console.log("pre Started(js)")
invoke('start_pct');
console.log("Started(js)")
while (pct < 100) {
  console.log("pre Sending(js)")
  invoke('get_pct')
    .then((response) => {
      pct = parseInt(response, 10);
      console.log("Pct:");
      console.log(pct);
    })
    .catch((error) => {
      console.log("Error:");
      console.log(error);
    });
  console.log("Sending(js)")
  console.log(`Pct = ${pct}`)
  document.getElementById("loading").innerHTML = "Loading..."+String(pct)+"%";
  await delay(1000);
}
//await new Promise(resolve => setTimeout(resolve, 1000));
await delay(1000);
invoke('close_splashscreen');
/*document.addEventListener('DOMContentLoaded', () => {
  // This will wait for the window to load, but you could
  // run this function on whatever trigger you want
  invoke('close_splashscreen')
})*/
