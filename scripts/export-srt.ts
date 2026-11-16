import {mkdirSync, writeFileSync} from 'node:fs';
import {exportSrt} from '../src/lib/transcript';
mkdirSync('out',{recursive:true});
writeFileSync('out/subtitles.srt',exportSrt(),'utf8');
console.log('Wrote out/subtitles.srt');
