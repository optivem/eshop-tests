# Terminal Bell

Before every STOP, ring the terminal bell to notify the user:
```
powershell -command "[console]::beep(300, 150); Start-Sleep -Milliseconds 80; [console]::beep(380, 150); Start-Sleep -Milliseconds 80; [console]::beep(460, 150); Start-Sleep -Milliseconds 80; [console]::beep(520, 400)"
```
**Important:** The bell must be run by the **orchestrating agent** in the main conversation — not inside a subagent. If a subagent performs a STOP phase, the orchestrating agent must ring the bell itself after the subagent returns.
