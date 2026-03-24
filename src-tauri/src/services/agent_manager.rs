use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Agent {
    pub name: String,
    pub enabled: bool,
    pub system_prompt: String,
}

/// Global agent pool (5 agents available across all projects)
pub struct AgentManager {
    pub pm: Agent,
    pub architect: Agent,
    pub developer: Agent,
    pub designer: Agent,
    pub security: Agent,
}

impl Default for AgentManager {
    fn default() -> Self {
        Self {
            pm: Agent {
                name: "pm".to_string(),
                enabled: true,
                system_prompt: "You are a project manager...".to_string(),
            },
            architect: Agent {
                name: "architect".to_string(),
                enabled: true,
                system_prompt: "You are a system architect...".to_string(),
            },
            developer: Agent {
                name: "developer".to_string(),
                enabled: true,
                system_prompt: "You are a senior developer...".to_string(),
            },
            designer: Agent {
                name: "designer".to_string(),
                enabled: true,
                system_prompt: "You are a UI/UX designer...".to_string(),
            },
            security: Agent {
                name: "security".to_string(),
                enabled: true,
                system_prompt: "You are a security expert...".to_string(),
            },
        }
    }
}

impl AgentManager {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn switch_project(&mut self, _project_path: String) {
        // TODO: Load project-specific memories for each agent
    }
}
