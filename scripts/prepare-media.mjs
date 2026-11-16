import {createHash} from 'node:crypto';
import {createReadStream, createWriteStream, existsSync, linkSync, lstatSync, readdirSync, statSync, unlinkSync} from 'node:fs';
import {once} from 'node:events';
import {join} from 'node:path';

const dir='clips_reales';
const output=join(dir,'clip_1.mov');
const expected='2f0d825199acea1ee0c50cf273a835d2555b636237c2efc489e49431b935e34d';
if (!existsSync(output)) {
  const parts=readdirSync(dir).filter((name)=>/^clip_1\.mov\.part-\d+$/.test(name)).sort();
  if(parts.length!==4) throw new Error(`Expected 4 clip_1 parts, found ${parts.length}`);
  const destination=createWriteStream(output);
  for(const part of parts) {
    for await(const chunk of createReadStream(join(dir,part))) {
      if(!destination.write(chunk)) await once(destination,'drain');
    }
  }
  destination.end();
  await once(destination,'finish');
}
const hash=createHash('sha256');
for await (const chunk of createReadStream(output)) hash.update(chunk);
const actual=hash.digest('hex');
if(actual!==expected) throw new Error(`clip_1 SHA-256 mismatch: ${actual}`);
for(const [source,target] of [[output,'public/clip_1.mov'],[join(dir,'clip_2.mov'),'public/clip_2.mov']]) {
  if(existsSync(target)&&lstatSync(target).isSymbolicLink()) unlinkSync(target);
  if(!existsSync(target)) linkSync(source,target);
}
console.log(`clip_1.mov ready (${(statSync(output).size/1024/1024).toFixed(1)} MiB, SHA-256 verified); public media links prepared.`);
