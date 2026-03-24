/// Detects Claude CLI installation and validates it
pub struct CliChecker;

impl CliChecker {
    pub fn is_claude_installed() -> bool {
        // TODO: Check for Claude CLI in PATH
        false
    }

    pub fn get_claude_version() -> Option<String> {
        // TODO: Run `claude --version`
        None
    }
}
