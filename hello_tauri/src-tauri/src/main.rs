#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::sync::{Arc, Mutex};
use tauri::{Manager, State, Window};

struct Payload(Arc<Mutex<u8>>);

#[tauri::command]
/// Temporary plug of data loading
async fn start_pct(pct: State<'_, Payload>) -> Result<(), ()> {
    for _i in 0..100 {
        let mut locked = pct.0.lock().unwrap();
        *locked += 1;
        std::mem::drop(locked);
        std::thread::sleep(std::time::Duration::from_millis(50));
    }
    Ok(())
}

#[tauri::command]
/// Get loading progress
fn get_pct(pct: State<'_, Payload>) -> Result<u8, ()> {
    let pct_local = *(pct.0.lock().unwrap());
    Ok(pct_local)
}

#[tauri::command]
/// Close splash
async fn close_splashscreen(window: Window) {
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }
    window.get_window("main").unwrap().show().unwrap();
}

fn main() {
    tauri::Builder::default()
        .manage(Payload(Default::default()))
        .setup(|app| {
            #[cfg(target_os = "windows")] {
                //app.eval("window.location.replace('https://google.com')");
            }
            let splashscreen_window = app.get_window("splashscreen").unwrap();
            splashscreen_window.center().unwrap();
            let main_window = app.get_window("main").unwrap();
            main_window.center().unwrap();
            #[cfg(debug_assertions)] {
                splashscreen_window.open_devtools();
                main_window.open_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![close_splashscreen, get_pct, start_pct])
        .run(tauri::generate_context!())
        .expect("failed to run app");
}
