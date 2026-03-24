pub mod greet;
pub mod projects;
pub mod memory;
pub mod claude;
pub mod conversations;
pub mod terminal;
pub mod agents;

pub use greet::greet;
pub use projects::create_project;
pub use projects::get_projects;
pub use memory::save_memory;
pub use memory::get_memory;
pub use claude::{check_claude_cli, send_message_to_claude, stream_claude_response};
pub use conversations::{
    create_conversation,
    get_conversations,
    get_conversation_messages,
    add_message_to_conversation,
};
pub use terminal::{execute_terminal_command, list_directory, get_working_directory};
pub use agents::{
    get_all_agents,
    get_agent,
    save_agent_memory,
    get_agent_memories,
    get_project_memories,
    search_memories,
    delete_memory,
    switch_project_context,
};
