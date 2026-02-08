$root = "C:\\Users\\Admin\\Documents\\ab"
$jsonPath = Join-Path $root "products.json"
$data = Get-Content $jsonPath -Raw | ConvertFrom-Json

$rows = @()
$line = 1001
foreach ($cat in $data.categories) {
  foreach ($prod in $cat.products) {
    $lineId = "line-$line"
    $imageFolder = "assets/products/$lineId"
    $rows += [pscustomobject]@{
      line_item = $lineId
      category = $cat.name
      title = $prod.name
      type = $prod.subtitle
      price = ""
      min_quantity = ""
      description = $prod.summary
      specs = ($prod.specs -join " | ")
      badge = $prod.badge
      image_folder = $imageFolder
      image_1 = ""
      image_2 = ""
      image_3 = ""
    }

    $destDir = Join-Path $root $imageFolder
    New-Item -ItemType Directory -Force -Path $destDir | Out-Null
    $images = $prod.images
    for ($i = 0; $i -lt 3; $i++) {
      if ($i -lt $images.Count) {
        $src = Join-Path $root $images[$i]
        $dest = Join-Path $destDir ("{0}.jpg" -f ($i + 1))
        if (Test-Path $src) {
          Copy-Item -Force -Path $src -Destination $dest
        }
      }
    }

    $line++
  }
}

function Get-ColumnName([int]$index) {
  $name = ""
  while ($index -gt 0) {
    $index--
    $name = [char](65 + ($index % 26)) + $name
    $index = [int]($index / 26)
  }
  return $name
}

function Escape-Xml([string]$text) {
  return [System.Security.SecurityElement]::Escape($text)
}

$headers = @(
  "line_item","category","title","type","price","min_quantity","description","specs","badge","image_folder","image_1","image_2","image_3"
)

$sheetRows = @()
$rowIndex = 1
$allRows = @()
$allRows += ,$headers
foreach ($row in $rows) {
  $rowValues = @()
  foreach ($h in $headers) { $rowValues += ($row.$h) }
  $allRows += ,$rowValues
}

foreach ($rowValues in $allRows) {
  $cells = @()
  for ($c = 0; $c -lt $rowValues.Count; $c++) {
    $colName = Get-ColumnName ($c + 1)
    $cellRef = "$colName$rowIndex"
    $value = Escape-Xml([string]$rowValues[$c])
    $cells += ('<c r="{0}" t="inlineStr"><is><t>{1}</t></is></c>' -f $cellRef, $value)
  }
  $sheetRows += ('<row r="{0}">{1}</row>' -f $rowIndex, ($cells -join ''))
  $rowIndex++
}

$sheetXml = @"
<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>
<worksheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\">
  <sheetData>
    $($sheetRows -join "\n    ")
  </sheetData>
</worksheet>
"@

$contentTypes = @"
<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>
<Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\">
  <Default Extension=\"rels\" ContentType=\"application/vnd.openxmlformats-package.relationships+xml\"/>
  <Default Extension=\"xml\" ContentType=\"application/xml\"/>
  <Override PartName=\"/xl/workbook.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml\"/>
  <Override PartName=\"/xl/worksheets/sheet1.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\"/>
</Types>
"@

$rels = @"
<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>
<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">
  <Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument\" Target=\"xl/workbook.xml\"/>
</Relationships>
"@

$workbookXml = @"
<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>
<workbook xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\">
  <sheets>
    <sheet name=\"Products\" sheetId=\"1\" r:id=\"rId1\"/>
  </sheets>
</workbook>
"@

$workbookRels = @"
<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>
<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">
  <Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\" Target=\"worksheets/sheet1.xml\"/>
</Relationships>
"@

$tmp = Join-Path $root "_xlsx_tmp"
if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp }
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $tmp "_rels") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $tmp "xl") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $tmp "xl\\_rels") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $tmp "xl\\worksheets") | Out-Null

[System.IO.File]::WriteAllText((Join-Path $tmp "[Content_Types].xml"), $contentTypes)
[System.IO.File]::WriteAllText((Join-Path $tmp "_rels\\.rels"), $rels)
[System.IO.File]::WriteAllText((Join-Path $tmp "xl\\workbook.xml"), $workbookXml)
[System.IO.File]::WriteAllText((Join-Path $tmp "xl\\_rels\\workbook.xml.rels"), $workbookRels)
[System.IO.File]::WriteAllText((Join-Path $tmp "xl\\worksheets\\sheet1.xml"), $sheetXml)

$zipPath = Join-Path $root "products.zip"
$xlsxPath = Join-Path $root "products.xlsx"
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }
if (Test-Path $xlsxPath) { Remove-Item -Force $xlsxPath }
Compress-Archive -Path (Join-Path $tmp "*") -DestinationPath $zipPath
Move-Item -Force $zipPath $xlsxPath
Remove-Item -Recurse -Force $tmp
