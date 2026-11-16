import {mkdirSync, rmSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import chromium, {inflate, setupLambdaEnvironment} from '@sparticuz/chromium';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const run=(command,args)=>{
  const result=spawnSync(command,args,{cwd:root,stdio:'inherit',env:process.env});
  if(result.error) throw result.error;
  if(result.status!==0) throw new Error(`${command} exited with ${result.status}`);
};
mkdirSync(path.join(root,'out'),{recursive:true});
run(process.execPath,['scripts/prepare-media.mjs']);
run(process.execPath,['node_modules/tsx/dist/cli.mjs','scripts/export-srt.ts']);
const browserExecutable=await chromium.executablePath();
const availableCores=os.availableParallelism?.()??os.cpus().length;
const requestedConcurrency=process.env.REMOTION_CONCURRENCY?Number(process.env.REMOTION_CONCURRENCY):availableCores;
if(!Number.isInteger(requestedConcurrency)||requestedConcurrency<1||requestedConcurrency>availableCores) {
  throw new Error(`REMOTION_CONCURRENCY must be an integer from 1 to ${availableCores} (available CPU cores).`);
}
const browserLibs=await inflate(path.resolve(root,'node_modules/@sparticuz/chromium/bin/al2023.tar.br'));
setupLambdaEnvironment(path.join(browserLibs,'lib'));
const temporary='out/.encoded.mp4';
rmSync(path.join(root,temporary),{force:true});
const renderArgs=['node_modules/@remotion/cli/remotion-cli.js','render','src/index.ts','Main',temporary,'--codec=h264','--crf=18','--audio-bitrate=192k',`--concurrency=${requestedConcurrency}`,'--hardware-acceleration=if-possible','--pixel-format=yuv420p',`--browser-executable=${browserExecutable}`];
if(process.env.REMOTION_PROPS) {
  const props=JSON.parse(process.env.REMOTION_PROPS);
  renderArgs.push(`--props=${JSON.stringify(props)}`);
}
run(process.execPath,renderArgs);
const ffmpeg=path.resolve(root,'node_modules/@ffmpeg-installer/linux-x64/ffmpeg');
run(ffmpeg,['-hide_banner','-y','-i',temporary,'-map','0:v:0','-map','0:a:0','-c:v','copy','-af','loudnorm=I=-16:TP=-1.5:LRA=7','-c:a','aac','-b:a','192k','-movflags','+faststart','out/final.mp4']);
rmSync(path.join(root,temporary),{force:true});
console.log('Done: out/final.mp4 and out/subtitles.srt');
