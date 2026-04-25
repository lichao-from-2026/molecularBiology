# 图片下载与整理脚本
# 功能：从 docs 文档中提取图片 URL，下载到 public/images 分类存储，并更新文档引用路径

$workingDir = "C:\DiskE\LY\molecularBiology"
Set-Location $workingDir

# 确保 public/images 目录存在
if (-not (Test-Path "public\images")) {
    New-Item -ItemType Directory -Path "public\images" -Force
}

# 图片分类目录
$categories = @("DNA", "RNA", "Protein", "Experiment", "Vector", "Cell")
foreach ($cat in $categories) {
    if (-not (Test-Path "public\images\$cat")) {
        New-Item -ItemType Directory -Path "public\images\$cat" -Force
    }
}

# 初始化计数器
$count = 0
$failedList = @()

# 创建清单文件（追加模式）
$reportPath = "public\images\image_manifest.csv"
if (-not (Test-Path $reportPath)) {
    "Original URL,Local Path,File Size (KB),Category,Alt Text,Source File,Status" | Out-File -FilePath $reportPath -Encoding UTF8
}

# 搜索所有 Markdown 文件
$mdFiles = Get-ChildItem -Path "docs" -Recurse -Filter "*.md*"

# 处理每个文件
foreach ($file in $mdFiles) {
    Write-Host "Processing file: $($file.FullName)"
    $content = Get-Content -Path $file.FullName -Raw
    $lines = $content -split "\r?\n"
    $newLines = @()

    foreach ($line in $lines) {
        # 匹配 Markdown 图片语法中的 URL
        if ($line -match "!\[(.*?)\]\((https://trae-api-cn\.mchost\.guru/api/ide/v1/text_to_image\?prompt=.*?)\)") {
            $altText = $matches[1]
            $url = $matches[2]

            # 根据文件路径确定分类
            $category = "Experiment"
            if ($file.FullName -like "*DNA*") { $category = "DNA" }
            elseif ($file.FullName -like "*RNA*") { $category = "RNA" }
            elseif ($file.FullName -like "*蛋白*") { $category = "Protein" }
            elseif ($file.FullName -like "*载体*" -or $file.FullName -like "*vector*") { $category = "Vector" }
            elseif ($file.FullName -like "*细胞*" -or $file.FullName -like "*转化*") { $category = "Cell" }

            # 生成文件名（使用描述性名称）
            $count++
            $safeName = ($altText -replace '[^\w\u4e00-\u9fa5]', '-' -replace '-+', '-').Substring(0, [Math]::Min(30, $altText.Length))
            $fileName = "$safeName.png"
            $savePath = "public\images\$category\$fileName"

            # 下载图片
            try {
                Invoke-WebRequest -Uri $url -OutFile $savePath -TimeoutSec 30
                $fileSize = (Get-Item $savePath).Length / 1KB
                $fileSize = [math]::Round($fileSize, 2)

                # 检查是否是有效图片（文件大小应大于 1KB）
                if ($fileSize -lt 1) {
                    Write-Host "  [WARNING] 图片可能无效: $altText (大小: $fileSize KB)" -ForegroundColor Yellow
                    Remove-Item $savePath -Force
                    "$url,$savePath,0,$category,$altText,$($file.FullName),INVALID" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
                    $failedList += [PSCustomObject]@{Url=$url; AltText=$altText; File=$file.FullName}
                } else {
                    Write-Host "  [OK] Downloaded: $altText -> $savePath ($fileSize KB)" -ForegroundColor Green
                    # 更新文档中的引用路径
                    $relativePath = "/images/$category/$fileName"
                    $newLine = $line -replace [regex]::Escape($url), $relativePath
                    $newLines += $newLine
                    "$url,$savePath,$fileSize,$category,$altText,$($file.FullName),DOWNLOADED" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
                }
            } catch {
                Write-Host "  [ERROR] Failed: $url" -ForegroundColor Red
                $newLines += $line
                $failedList += [PSCustomObject]@{Url=$url; AltText=$altText; File=$file.FullName}
            }
        } else {
            $newLines += $line
        }
    }

    # 保存更新后的文件
    $newContent = $newLines -join "`n"
    Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
}

# 输出汇总
Write-Host "`n========== 图片下载处理完成 =========="
Write-Host "总处理数量: $count"
Write-Host "成功下载: $($count - $failedList.Count)"
Write-Host "下载失败: $($failedList.Count)"
if ($failedList.Count -gt 0) {
    Write-Host "`n失败列表:"
    $failedList | ForEach-Object { Write-Host "  - $($_.AltText): $($_.Url)" }
}
Write-Host "清单文件: $reportPath"
