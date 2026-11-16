import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {CaptionOverlay, ChapterChip, ProgressLine} from '../components/Primitives';
import {cues, currentCue, FPS, INTRO_FRAMES, CLIP_1_FRAMES, CLIP_2_FRAMES, CLIP_1_SECONDS, CLIP_2_SECONDS, MAIN_FRAMES, OUTRO_FRAMES, XFADE_FRAMES} from '../timeline';
import {CueLayer} from '../inserts/Inserts';
import {Intro, type Credits} from './Intro';
import {Outro} from './Outro';

const ClipShot:React.FC<{src:string;duration:number;sourceOffset:number;fadeIn?:boolean;clipOne?:boolean;includeAudio?:boolean}> = ({src,duration,sourceOffset,fadeIn=false,clipOne=false,includeAudio=true}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const mediaSeconds=sourceOffset+frame/fps;
  const cue=currentCue(mediaSeconds);
  const layout=cue?.layout??'A';
  const p=cue?interpolate(mediaSeconds-cue.at,[0,0.48],[0,1],{easing:Easing.bezier(...theme.motion.enter),extrapolateLeft:'clamp',extrapolateRight:'clamp'}):1;
  let left=0,top=0,width=100,height=100,zoom=1;
  if(layout==='B') {left=6*p;width=100-40*p;height=100-40*p;top=20*p;}
  if(layout==='E') {left=27*p;width=100-54*p;height=100-18*p;top=9*p;}
  if(layout==='D') zoom=1+0.28*p;
  const opacity=fadeIn?interpolate(frame,[0,XFADE_FRAMES],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}):1;
  const style:React.CSSProperties={position:'absolute',left:`${left}%`,top:`${top}%`,width:`${width}%`,height:`${height}%`,overflow:'hidden',background:theme.color.ink,border:layout==='B'&&p>0.9?`${theme.widths.hairline}px solid ${theme.color.line}`:'none',boxSizing:'border-box',transform:`scale(${zoom})`,transformOrigin:'50% 25%',opacity,zIndex:1};
  return <>
    <div style={style}><OffthreadVideo src={staticFile(src)} muted startFrom={0} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'50% 35%',filter:'saturate(0.84) contrast(1.07) brightness(0.96)'}}/></div>
    {includeAudio&&<Audio src={staticFile(src)} audioStreamIndex={0} volume={(f)=>{
      let v=1;
      if(clipOne && f>=duration-XFADE_FRAMES) v=Math.max(0,(duration-f)/XFADE_FRAMES);
      if(fadeIn && f<XFADE_FRAMES) v=Math.min(1,f/XFADE_FRAMES);
      if(!clipOne && f>=duration-theme.timing.finalAudioFadeFrames) v*=Math.max(0,(duration-f)/theme.timing.finalAudioFadeFrames);
      return v;
    }}/>
    }
  </>
};

export const Main:React.FC<Credits> = (props) => {
  const {fps}=useVideoConfig();
  const framesForMedia=CLIP_1_FRAMES+CLIP_2_FRAMES;
  const outroFrom=INTRO_FRAMES+framesForMedia;
  const mediaDuration=CLIP_1_SECONDS+CLIP_2_SECONDS;
  return <AbsoluteFill style={{background:theme.color.ink,color:theme.color.paper,fontFamily:theme.font.display,overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,background:theme.color.ink,zIndex:0}}/>
    <Sequence from={0} durationInFrames={INTRO_FRAMES} name="Intro editorial"><Intro {...props}/></Sequence>
    <Sequence from={INTRO_FRAMES} durationInFrames={framesForMedia} name="Clips / veu contínua">
      <AbsoluteFill style={{background:theme.color.ink}}>
        <Sequence from={0} durationInFrames={CLIP_1_FRAMES} premountFor={FPS} name="Clip 1">
          <ClipShot src="clip_1.mov" duration={CLIP_1_FRAMES} sourceOffset={0} clipOne/>
        </Sequence>
        <Sequence from={CLIP_1_FRAMES} durationInFrames={CLIP_2_FRAMES} premountFor={FPS} name="Clip 2">
          <ClipShot src="clip_2.mov" duration={CLIP_2_FRAMES} sourceOffset={CLIP_1_SECONDS} includeAudio={false}/>
        </Sequence>
        <Sequence from={CLIP_1_FRAMES-XFADE_FRAMES} durationInFrames={XFADE_FRAMES+CLIP_2_FRAMES} premountFor={FPS} name="Clip 2 audio crossfade">
          <Audio src={staticFile('clip_2.mov')} audioStreamIndex={0} volume={(f)=>{
            const clipFrame=Math.max(0,f-XFADE_FRAMES);
            const fadeIn=Math.min(1,f/XFADE_FRAMES);
            const fadeOut=clipFrame>=CLIP_2_FRAMES-theme.timing.finalAudioFadeFrames?Math.max(0,(CLIP_2_FRAMES-clipFrame)/theme.timing.finalAudioFadeFrames):1;
            return fadeIn*fadeOut;
          }}/>
        </Sequence>
        <CaptionClock fps={fps} mediaDuration={mediaDuration}/>
        {cues.map((cue)=>{
          const from=Math.round(cue.at*fps);
          const duration=Math.max(1,Math.round(cue.duration*fps));
          return <Sequence key={cue.id} from={from} durationInFrames={duration} premountFor={FPS} name={`Insert · ${cue.id}`}>
            <CueLayer cue={cue}/>
          </Sequence>;
        })}
        <ChapterClock fps={fps}/>
      </AbsoluteFill>
    </Sequence>
    <Sequence from={outroFrom} durationInFrames={OUTRO_FRAMES} name="Outro editorial"><Outro {...props}/></Sequence>
    <ProgressLine/>
  </AbsoluteFill>;
};

const CaptionClock:React.FC<{fps:number;mediaDuration:number}> = ({fps,mediaDuration}) => {
  const frame=useCurrentFrame();
  const mediaSeconds=frame/fps;
  if(mediaSeconds>mediaDuration)return null;
  return <CaptionOverlay mediaSeconds={mediaSeconds}/>;
};
const ChapterClock:React.FC<{fps:number}> = ({fps}) => {
  const frame=useCurrentFrame();
  return <ChapterChip mediaSeconds={frame/fps}/>;
};

export const mainDurationInFrames=MAIN_FRAMES;
