param(
    [switch]$Watch
)

$assets = "D:\.exp\IDE-WEBDEV-PAGES\website-main\assets"
$base = "D:\.exp\IDE-WEBDEV-PAGES\website-main\assets\backgrounds"
$validExtensions = @(".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".mp4", ".webm", ".mov", ".m4v", ".ogv")

# Copy base anime wallpapers to their folders if empty
$map = @{
    "projetos" = "bg-gosick.jpg"
    "contato" = "bg-kon.jpg"
    "blog" = "bg-abyss.jpg"
    "contrate-me" = "bg-contrate.jpg"
}

foreach ($entry in $map.GetEnumerator()) {
    $p = $entry.Key
    $file = $entry.Value
    $src = Join-Path $assets $file
    $deskDir = Join-Path (Join-Path $base $p) "desktop"
    if (Test-Path $src) {
        if (-not (Test-Path $deskDir)) {
            New-Item -ItemType Directory -Path $deskDir -Force | Out-Null
        }
        $existing = Get-ChildItem -Path $deskDir -File
        if ($existing.Count -eq 0) {
            Copy-Item -Path $src -Destination (Join-Path $deskDir $file)
        }
    }
}

function Update-Manifest {
    $pages = Get-ChildItem -Path $base -Directory
    $manifest = @{}

    foreach ($p in $pages) {
        $pageName = $p.Name
        $manifest[$pageName] = @{
            "desktop" = @()
            "mobile" = @()
        }

        $deskDir = Join-Path $p.FullName "desktop"
        if (Test-Path $deskDir) {
            $files = Get-ChildItem -Path $deskDir -File | Where-Object { 
                $_.Name -ne "manifest.json" -and ($validExtensions -contains $_.Extension.ToLower())
            }
            foreach ($f in $files) {
                $manifest[$pageName]["desktop"] += $f.Name
            }
        }

        $mobDir = Join-Path $p.FullName "mobile"
        if (Test-Path $mobDir) {
            $files = Get-ChildItem -Path $mobDir -File | Where-Object {
                $validExtensions -contains $_.Extension.ToLower()
            }
            foreach ($f in $files) {
                $manifest[$pageName]["mobile"] += $f.Name
            }
        }
    }

    $json = $manifest | ConvertTo-Json -Depth 4
    $targetManifest = Join-Path $base "manifest.json"
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($targetManifest, $json, $utf8NoBom)
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Output "[$timestamp] MANIFEST ATUALIZADO DINAMICAMENTE"
}

# Run once initially
Update-Manifest

if ($Watch) {
    Write-Output "Observador ativo: qualquer arquivo adicionado ou removido em $base atualizara o manifest automaticamente."
    $fsw = New-Object System.IO.FileSystemWatcher $base
    $fsw.IncludeSubdirectories = $true
    $fsw.EnableRaisingEvents = $true

    while ($true) {
        $change = $fsw.WaitForChanged([System.IO.WatcherChangeTypes]::All, 1000)
        if (-not $change.TimedOut) {
            Start-Sleep -Milliseconds 250
            # Drain trailing events
            while (-not $fsw.WaitForChanged([System.IO.WatcherChangeTypes]::All, 100).TimedOut) {}
            Update-Manifest
        }
    }
}
