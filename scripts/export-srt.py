"""Export the edited caption data (absolute timeline milliseconds) as SRT."""
import json, textwrap
from pathlib import Path
pages=json.loads(Path('src/captions.json').read_text())
def stamp(ms):
 h,ms=divmod(max(0,ms),3600000); m,ms=divmod(ms,60000); s,ms=divmod(ms,1000)
 return f'{h:02}:{m:02}:{s:02},{ms:03}'
lines=[]
for i,page in enumerate(pages,1):
 text=' '.join(w['text'] for w in page)
 lines.append(f"{i}\n{stamp(page[0]['startMs'])} --> {stamp(max(page[-1]['endMs'],page[0]['startMs']+100))}\n"+'\n'.join(textwrap.wrap(text,42,break_long_words=False,break_on_hyphens=False))+'\n')
Path('subtitols.srt').write_text('\n'.join(lines),encoding='utf-8')
