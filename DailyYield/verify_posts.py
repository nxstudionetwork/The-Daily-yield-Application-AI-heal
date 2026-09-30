with open(r'C:\Users\AICOE 5\Downloads\The Daily Yield\DailyYield\data\postsData.js', 'r', encoding='utf-8') as f:
    c = f.read()
t = c.count("type: 'text'")
p = c.count("type: 'poll'")
l = c.count("type: 'link'")
ids = c.count("id: 'p")
print(f"Text: {t}, Poll: {p}, Link: {l}, Total: {t+p+l}")
print(f"Post IDs found: {ids}")
import os
sz = os.path.getsize(r'C:\Users\AICOE 5\Downloads\The Daily Yield\DailyYield\data\postsData.js')
print(f"File size: {sz:,} bytes ({sz/1024:.0f} KB)")
