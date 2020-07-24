param($Env = "prd", $InstallPath = (Get-Location))

$zipFileName = "proofable-cli_windows_amd64.zip"
$downloadLink = "https://storage.googleapis.com/provendb-$Env/proofable-cli/$zipFileName"
$zipFilePath = Join-Path -Path $InstallPath -ChildPath $zipFileName

Write-Host "Installing from ``$zipFileName`` to ``$InstallPath``..."
(new-object net.webclient).DownloadFile($downloadLink, $zipFilePath)
Expand-Archive -Path $zipFilePath -DestinationPath $InstallPath -Force
Remove-Item -Path $zipFilePath
