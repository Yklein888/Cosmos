// Prevents additional console window on Windows in release builds
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod db;
mod services;
mod ipc;

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Initialize database on app startup
            let app_handle = app.handle().clone();

            #[cfg(debug_assertions)]
            {
                app.get_webview_window("main").unwrap().open_devtools();
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::greet,
            commands::create_project,
            commands::get_projects,
            commands::save_memory,
            commands::get_memory,
            commands::check_claude_cli,
            commands::send_message_to_claude,
            commands::stream_claude_response,
            commands::create_conversation,
            commands::get_conversations,
            commands::get_conversation_messages,
            commands::add_message_to_conversation,
            commands::execute_terminal_command,
            commands::list_directory,
            commands::get_working_directory,
            commands::get_all_agents,
            commands::get_agent,
            commands::save_agent_memory,
            commands::get_agent_memories,
            commands::get_project_memories,
            commands::search_memories,
            commands::delete_memory,
            commands::switch_project_context,
            commands::create_task,
            commands::get_project_tasks,
            commands::execute_task,
            commands::get_task_results,
            commands::toggle_task,
            commands::delete_task,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
