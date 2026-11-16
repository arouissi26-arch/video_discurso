from faster_whisper import WhisperModel
import json
model = WhisperModel('.cache/model', device='cpu', compute_type='int8', cpu_threads=2)
for i in (1,2):
    segments, info = model.transcribe(f'public/clip_{i}.mov', language='ca', word_timestamps=True, beam_size=3, vad_filter=False)
    result=[]
    for s in segments:
        print(i, round(s.start,2), round(s.end,2), s.text, flush=True)
        result.append({'start':s.start,'end':s.end,'text':s.text,'words':[{'word':w.word,'start':w.start,'end':w.end} for w in (s.words or [])]})
    with open(f'.cache/transcript{i}.json','w') as f: json.dump(result,f,ensure_ascii=False,indent=2)
