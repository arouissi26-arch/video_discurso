"""Build reviewable captions from Catalan Whisper word timestamps and the supplied script.
The corrected phrases below follow the recording, not omitted parts of the script.
Unmatched words are interpolated between Whisper's nearest anchors and need review.
"""
import json,re,unicodedata,difflib
from pathlib import Path
phrases = [
(1,.6,5.9,"T'imagines un món on el mòbil sàpiga que estàs malalt abans que tu?"),
(1,7,9.7,'Pot semblar ciència-ficció, però no ho és tant.'),
(1,10,16.1,'Alguns rellotges intel·ligents ja detecten canvis en el pols que avisen que alguna cosa no va bé.'),
(1,16.8,20.5,'I al darrere hi ha la intel·ligència artificial.'),
(1,21.3,23.4,'Però, què és exactament la IA?'),
(1,23.8,30.1,'És la capacitat de les màquines de fer tasques que normalment necessiten intel·ligència humana:'),
(1,30.6,35.2,'reconèixer una cara, entendre el que diem, o recomanar-nos una sèrie.'),
(1,36,41.9,'No pensa com una persona: analitza moltes dades, hi troba patrons i fa prediccions.'),
(1,42.2,48.8,'Per reconèixer un gat, per exemple, ha de veure milers de fotos fins que aprèn quins trets el defineixen.'),
(1,50.1,55.3,'I ja la fem servir cada dia, moltes vegades sense adonar-nos-en:'),
(1,56,64,'quan desbloquegem el mòbil amb la cara, quan Spotify ens recomana música, o quan el GPS ens busca el camí més ràpid.'),
(1,64.5,79,'Una notícia ho demostra: el 2024, el Premi Nobel de Química va reconèixer AlphaFold, una IA de Google DeepMind que prediu la forma de les proteïnes, una feina que als científics els podia costar anys.'),
(1,80,83.4,'Aquest és només un exemple. La pregunta és més gran:'),
(1,84,88.2,'la intel·ligència artificial és una OPORTUNITAT o una AMENAÇA?'),
(1,89,91,'Començo pels arguments a favor.'),
(1,91.8,104.4,'El primer és la SALUT. La IA ajuda a analitzar radiografies, a detectar malalties abans i a accelerar la recerca de medicaments. Un diagnòstic ràpid pot salvar vides.'),
(1,105.7,118.7,"El segon és l'EDUCACIÓ. Cada alumne aprèn a un ritme diferent, i la IA pot adaptar els exercicis a cadascun i resoldre dubtes a qualsevol hora, fins i tot la nit abans d'un examen."),
(1,120.3,133.4,'El tercer és la VIDA QUOTIDIANA. Els traductors ens permeten entendre idiomes que no coneixem, els mapes ens estalvien temps i els assistents virtuals ens ajuden a organitzar-nos.'),
(1,135.5,137.6,'Ara, els arguments en contra.'),
(1,138.1,144.7,'El primer és la FIABILITAT. La IA es pot equivocar i donar informació falsa amb molta seguretat.'),
(1,145,152.6,'A més, permet crear fotos i vídeos falsos que semblen reals, els anomenats DEEPFAKES.'),
(1,153.14,158.88,'Abans pensàvem que, si ho havíem vist en un vídeo, era veritat. Ara ja no n’estem tan segurs.'),
(1,160.2,169.2,'El segon és la PRIVACITAT. Aquests sistemes funcionen amb dades, i molts cops no sabem qui les recull ni què en fa.'),
(1,169.82,173.34,'Si el mòbil sap que estàs malalt, qui més ho sap?'),
(1,174.38,185.7,"El tercer és la FEINA I L'ÚS ÈTIC. Algunes professions canviaran, i a classe, si fem servir la IA per fer un treball sense entendre'l, no aprenem res, només copiem."),
(1,186.42,193.14,'Per tant, els beneficis són enormes, però els riscos també. Per això calen normes i un ús responsable.'),
(1,194.6,198.14,'Tornem al principi: un mòbil que sap que estàs malalt abans que tu.'),
(2,0,2.92,'Ara ja no sembla tan estrany, oi?'),
(2,3.36,7.92,'La IA ja és als nostres mòbils, a les aules i als hospitals.'),
(2,8.46,10.72,'No és una cosa del futur: és del present.'),
(2,11.26,16.14,'Per això no hem de tenir ni por ni confiança cega, sinó SENTIT CRÍTIC.'),
(2,16.76,22.6,'La pregunta important no és què pot fer la IA, sinó què decidim fer NOSALTRES amb ella.'),
(2,23.08,28.72,'La tecnologia avançarà igualment, però la decisió de com utilitzar-la seguirà sent humana.'),
(2,28.72,29.84,'Moltes gràcies.'),
]
raw={i:[w for s in json.load(open(f'.cache/transcript{i}.json')) for w in s['words']] for i in (1,2)}
def norm(s):
 return ''.join(c for c in unicodedata.normalize('NFKD',s.lower()) if c.isalnum())
words=[]
for clip,start,end,text in phrases:
 tokens=text.split(); spoken=[w for w in raw[clip] if start-.08<=w['start']<end and w['end']<=end+.3]
 a=[norm(x) for x in tokens]; b=[norm(x['word']) for x in spoken]
 matches=difflib.SequenceMatcher(None,a,b,autojunk=False).get_matching_blocks(); anchors={}
 for m in matches:
  for j in range(m.size): anchors[m.a+j]=(max(start,spoken[m.b+j]['start']),min(end,spoken[m.b+j]['end']))
 # Fill unmatched runs between recognized anchors without moving any phrase beyond its bounds.
 times=[anchors.get(i) for i in range(len(tokens))]; k=0
 while k<len(tokens):
  if times[k] is not None: k+=1;continue
  j=k
  while j<len(tokens) and times[j] is None: j+=1
  lo=times[k-1][1] if k else start; hi=times[j][0] if j<len(tokens) else end
  if hi<=lo: lo=start+(end-start)*k/len(tokens); hi=start+(end-start)*j/len(tokens)
  for z in range(k,j): times[z]=(lo+(hi-lo)*(z-k)/(j-k),lo+(hi-lo)*(z-k+1)/(j-k))
  k=j
 # Repair overlapping or reversed estimated timestamps while retaining phrase boundaries.
 times=[list(t) for t in times]
 for z in range(1,len(times)):
  if times[z][0] < times[z-1][1]:
   boundary=max(times[z-1][0], min(times[z][1], (times[z-1][1]+times[z][0])/2))
   times[z-1][1]=boundary; times[z][0]=boundary
 if any(t[1] < t[0] for t in times):
  # When no room remains between matched anchors, interpolate the entire phrase.
  times=[[start+(end-start)*z/len(tokens),start+(end-start)*(z+1)/len(tokens)] for z in range(len(tokens))]
 offset=3.6 if clip==1 else 201.9
 for token,(s,e) in zip(tokens,times): words.append({'text':token,'startMs':round((s+offset)*1000),'endMs':round((e+offset)*1000),'timestampMs':None,'confidence':None})
# Natural phrase chunks capped at 2 lines and about 72 characters.
pages=[]; page=[]
for w in words:
 if page and (len(' '.join(x['text'] for x in page+[w]))>66 or w['startMs']-page[-1]['endMs']>800 or re.search(r'[.!?:]$',page[-1]['text'])):
  pages.append(page); page=[]
 page.append(w)
if page: pages.append(page)
Path('src/captions.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2)+'\n')
def stamp(ms):
 ms=max(0,ms);h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);s,ms=divmod(ms,1000);return f'{h:02}:{m:02}:{s:02},{ms:03}'
with open('out/subtitols.srt','w') as f:
 for i,p in enumerate(pages,1): f.write(f"{i}\n{stamp(p[0]['startMs'])} --> {stamp(max(p[-1]['endMs'],p[0]['startMs']+100))}\n{' '.join(x['text'] for x in p)}\n\n")
print(len(words),'words,',len(pages),'caption pages')
