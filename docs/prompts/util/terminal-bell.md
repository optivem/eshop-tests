# Terminal Bell

Before every STOP, ring the terminal bell to notify the user:
```
powershell -command "[console]::beep(600, 200); Start-Sleep -Milliseconds 80; [console]::beep(800, 200); Start-Sleep -Milliseconds 80; [console]::beep(1000, 200); Start-Sleep -Milliseconds 80; [console]::beep(1200, 600)"
```
**Important:** The bell must be run by the **orchestrating agent** in the main conversation — not inside a subagent. If a subagent performs a STOP phase, the orchestrating agent must ring the bell itself after the subagent returns.
