use std::process::Command;

/// Detects Claude CLI installation and validates it
pub struct CliChecker;

impl CliChecker {
    /// Check if Claude CLI is installed in PATH
    pub fn is_claude_installed() -> bool {
        Command::new("which")
            .arg("claude")
            .output()
            .map(|output| output.status.success())
            .unwrap_or(false)
    }

    /// Get Claude CLI version
    pub fn get_claude_version() -> Option<String> {
        Command::new("claude")
            .arg("--version")
            .output()
            .ok()
            .and_then(|output| {
                if output.status.success() {
                    String::from_utf8(output.stdout).ok()
                } else {
                    None
                }
            })
            .map(|v| v.trim().to_string())
    }

    /// Validate that Claude CLI works
    pub fn validate_claude() -> Result<String, String> {
        if !Self::is_claude_installed() {
            return Err("Claude CLI not found in PATH".to_string());
        }

        Self::get_claude_version()
            .ok_or_else(|| "Could not get Claude version".to_string())
    }
}
