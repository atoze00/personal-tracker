$ErrorActionPreference = 'Stop'
$taskRoot = $PSScriptRoot
$taskUrl = 'http://127.0.0.1:5173/'
$taskRunning = $false
try { $taskResponse = Invoke-WebRequest $taskUrl -UseBasicParsing -TimeoutSec 2; $taskRunning = $taskResponse.Content.Contains('개인 트래커') } catch {}
if (-not $taskRunning) {
  $taskNode = (Get-Command node -ErrorAction SilentlyContinue).Source
  if (-not $taskNode) { $taskNode = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' }
  if (-not (Test-Path -LiteralPath $taskNode)) { throw 'Node.js를 설치한 뒤 다시 실행해주세요.' }
  Start-Process -FilePath $taskNode -ArgumentList ('"' + (Join-Path $taskRoot 'serve.mjs') + '"') -WorkingDirectory $taskRoot -WindowStyle Hidden
  Start-Sleep -Seconds 1
}
$taskEdge = Join-Path ${env:ProgramFiles(x86)} 'Microsoft\Edge\Application\msedge.exe'
if (Test-Path -LiteralPath $taskEdge) { Start-Process -FilePath $taskEdge -ArgumentList @("--app=$taskUrl", '--window-size=820,700') } else { Start-Process $taskUrl }
