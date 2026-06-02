#[derive(serde::Serialize)]
struct HealthCheck {
    ok: bool,
    app: &'static str,
}

#[tauri::command]
fn health_check() -> HealthCheck {
    HealthCheck {
        ok: true,
        app: "agent-demo",
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![health_check])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
