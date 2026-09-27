param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]] $JekyllArgs
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# Keep gems on the project drive. This avoids Windows globbing issues when
# Ruby is installed under a hidden user profile directory.
$env:BUNDLE_PATH = Join-Path $projectRoot "vendor\bundle"
$env:BUNDLE_SYSTEM_BINDIR = Join-Path $env:BUNDLE_PATH "bin"

$jekyllExecutable = & bundle exec ruby -e "print Gem.bin_path('jekyll', 'jekyll')"
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($jekyllExecutable)) {
  throw "Jekyll is not installed. Run: bundle install"
}

& bundle exec ruby $jekyllExecutable @JekyllArgs
exit $LASTEXITCODE
