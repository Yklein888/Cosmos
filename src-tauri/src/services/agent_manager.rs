use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Agent {
    pub name: String,
    pub role: String,
    pub description: String,
    pub enabled: bool,
    pub system_prompt: String,
    pub model: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AgentMemory {
    pub decisions: Vec<String>,
    pub context: Vec<String>,
    pub warnings: Vec<String>,
    pub patterns: Vec<String>,
}

impl Default for AgentMemory {
    fn default() -> Self {
        Self {
            decisions: Vec::new(),
            context: Vec::new(),
            warnings: Vec::new(),
            patterns: Vec::new(),
        }
    }
}

/// Global agent pool (5 agents available across all projects)
/// Memory is project-specific but managed here
pub struct AgentManager {
    agents: HashMap<String, Agent>,
    memories: HashMap<String, AgentMemory>, // project_path -> agent_name -> memory
    current_project: Option<String>,
}

impl AgentManager {
    pub fn new() -> Self {
        let mut agents = HashMap::new();

        // Initialize 5 default agents
        agents.insert(
            "pm".to_string(),
            Agent {
                name: "pm".to_string(),
                role: "Project Manager".to_string(),
                description: "Oversees project scope, timeline, and resource allocation".to_string(),
                enabled: true,
                system_prompt: "You are a Project Manager for a software development project. Your role is to oversee project scope, timeline, and deliverables. Always think about risks, dependencies, and project health.".to_string(),
                model: "claude-3-5-sonnet-20241022".to_string(),
            },
        );

        agents.insert(
            "architect".to_string(),
            Agent {
                name: "architect".to_string(),
                role: "System Architect".to_string(),
                description: "Designs system architecture and technical decisions".to_string(),
                enabled: true,
                system_prompt: "You are a System Architect. Your role is to design scalable, maintainable system architectures. Consider modularity, performance, and future extensibility in all recommendations.".to_string(),
                model: "claude-3-5-sonnet-20241022".to_string(),
            },
        );

        agents.insert(
            "developer".to_string(),
            Agent {
                name: "developer".to_string(),
                role: "Senior Developer".to_string(),
                description: "Implements features and fixes bugs".to_string(),
                enabled: true,
                system_prompt: "You are a Senior Software Developer. Your role is to implement features, fix bugs, and write clean, maintainable code. Always consider code quality, testing, and performance.".to_string(),
                model: "claude-3-5-sonnet-20241022".to_string(),
            },
        );

        agents.insert(
            "designer".to_string(),
            Agent {
                name: "designer".to_string(),
                role: "UI/UX Designer".to_string(),
                description: "Creates UI/UX designs and improves user experience".to_string(),
                enabled: true,
                system_prompt: "You are a UI/UX Designer. Your role is to create beautiful, intuitive interfaces that delight users. Consider accessibility, consistency, and user research in all recommendations.".to_string(),
                model: "claude-3-5-sonnet-20241022".to_string(),
            },
        );

        agents.insert(
            "security".to_string(),
            Agent {
                name: "security".to_string(),
                role: "Security Expert".to_string(),
                description: "Reviews security concerns and hardens systems".to_string(),
                enabled: true,
                system_prompt: "You are a Security Expert. Your role is to identify vulnerabilities, ensure data protection, and implement security best practices. Always think about OWASP top 10 and threat models.".to_string(),
                model: "claude-3-5-sonnet-20241022".to_string(),
            },
        );

        Self {
            agents,
            memories: HashMap::new(),
            current_project: None,
        }
    }

    /// Get all agents
    pub fn get_agents(&self) -> Vec<Agent> {
        self.agents.values().cloned().collect()
    }

    /// Get a specific agent
    pub fn get_agent(&self, name: &str) -> Option<Agent> {
        self.agents.get(name).cloned()
    }

    /// Switch to a different project (loads memories)
    pub fn switch_project(&mut self, project_path: String) {
        self.current_project = Some(project_path);
        // TODO: Load memories from SQLite for this project
    }

    /// Add memory to an agent
    pub fn add_agent_memory(&mut self, agent_name: &str, memory: AgentMemory) {
        if let Some(project) = &self.current_project {
            let key = format!("{}:{}", project, agent_name);
            self.memories.insert(key, memory);
        }
    }

    /// Get agent memory
    pub fn get_agent_memory(&self, agent_name: &str) -> Option<AgentMemory> {
        if let Some(project) = &self.current_project {
            let key = format!("{}:{}", project, agent_name);
            self.memories.get(&key).cloned()
        } else {
            None
        }
    }
}

impl Default for AgentManager {
    fn default() -> Self {
        Self::new()
    }
}
