import os, re
fp = r'C:\Users\AICOE 5\Downloads\The Daily Yield\DailyYield\data\videosData.js'
size = os.path.getsize(fp)
print(f"File size: {size:,} bytes ({size/1024:.1f} KB)")
content = open(fp, encoding='utf-8').read()
print(f"Total lines: {len(content.splitlines())}")
ids = re.findall(r"id:\s*'([^']+)'", content)
print(f"Total videos: {len(ids)}")
cats = {}
for c in re.findall(r"category:\s*'([^']+)'", content):
    cats[c] = cats.get(c, 0) + 1
for c in sorted(cats):
    print(f"  {c}: {cats[c]}")
shorts = len(re.findall(r'isShort: true', content))
live = len(re.findall(r'isLive: true', content))
prem = len(re.findall(r'isPremium: true', content))
reg = len(ids) - shorts - live - prem
print(f"Regular: {reg}, Shorts: {shorts}, Live: {live}, Premium: {prem}")
