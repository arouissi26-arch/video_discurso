import {mkdirSync, writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {installWhisperCpp, downloadWhisperModel, getModelPath, transcribe, toCaptions} from '@remotion/install-whisper-cpp';

const run=(command,args)=>{
  const result=spawnSync(command,args,{stdio:'inherit'});
  if(result.error) throw result.error;
  if(result.status!==0) throw new Error(`${command} exited with ${result.status}`);
};
const ffmpeg=requireFfmpeg();
function requireFfmpeg(){return new URL('../node_modules/@ffmpeg-installer/linux-x64/ffmpeg',import.meta.url).pathname;}
mkdirSync('out',{recursive:true});
mkdirSync('.cache/whisper',{recursive:true});
await installWhisperCpp({version:'1.7.4',to:'whisper.cpp',printOutput:true});
await downloadWhisperModel({model:'small',folder:'.cache/whisper',printOutput:true});
for(const [clip,input] of [['clip_1','public/clip_1.mov'],['clip_2','public/clip_2.mov']]){
  const wav=`out/${clip}_16khz.wav`;
  run(ffmpeg,['-hide_banner','-y','-i',input,'-map','0:a:0','-ac','1','-ar','16000','-c:a','pcm_s16le',wav]);
  const output=await transcribe({inputPath:wav,whisperPath:'whisper.cpp',whisperCppVersion:'1.7.4',model:'small',modelFolder:'.cache/whisper',language:'ca',tokenLevelTimestamps:true,printOutput:true});
  const words=toCaptions({whisperCppOutput:output}).captions;
  writeFileSync(`out/${clip}_whisper.json`,JSON.stringify(words,null,2),'utf8');
  console.log(`Wrote word timestamps for ${clip} to out/${clip}_whisper.json`);
}
console.log(`Model cache: ${getModelPath('.cache/whisper','small')}`);
