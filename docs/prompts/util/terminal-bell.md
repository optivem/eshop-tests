# Terminal Bell

Before every STOP, ring the terminal bell to notify the user:
```
powershell -command "[console]::beep(100, 40); Start-Sleep -Milliseconds 30; [console]::beep(120, 40); Start-Sleep -Milliseconds 30; [console]::beep(140, 40); Start-Sleep -Milliseconds 30; [console]::beep(160, 100)"
```
**Important:** The bell must be run by the **orchestrating agent** in the main conversation — not inside a subagent. If a subagent performs a STOP phase, the orchestrating agent must ring the bell itself after the subagent returns.
