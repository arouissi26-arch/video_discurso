import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {Intro, Outro} from './Cards';
import {CLIP1_DURATION, CLIP1_END, CLIP1_START, CLIP2_DURATION, INTRO, OUTRO, OVERLAP, TOTAL, type Titles} from './config';
import {theme} from './theme';
import captions from './captions.json';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/700.css';

const Captions: React.FC = () => {
 const frame=useCurrentFrame(),{fps}=useVideoConfig(); const ms=frame*1000/fps;
 const page=captions.find(p=>ms>=p[0].startMs && ms<=p[p.length-1].endMs);
 if(!page)return null;
 return <div style={{position:'absolute',bottom:155,left:65,right:65,textAlign:'center',fontFamily:theme.font,fontSize:45,lineHeight:1.24,fontWeight:700,color:'white',textShadow:'0 3px 8px #000, 2px 2px 2px #000, -2px -2px 2px #000'}}><span style={{background:'rgba(5,14,25,.70)',boxDecorationBreak:'clone',padding:'8px 15px',borderRadius:12}}>{page.map((w,i)=><React.Fragment key={i}><span style={{color:ms>=w.startMs&&ms<w.endMs||/^(OPORTUNITAT|AMENAÇA|SALUT|EDUCACIÓ|VIDA|QUOTIDIANA|FIABILITAT|DEEPFAKES|PRIVACITAT|FEINA|ÚS|ÈTIC|SENTIT|CRÍTIC|NOSALTRES)[.,!?;:]?$/.test(w.text)?theme.accent:'white'}}>{w.text}</span>{' '}</React.Fragment>)}</span></div>;
};
export const Main: React.FC<Titles> = (props) => {
 const frame=useCurrentFrame();
 return <AbsoluteFill style={{backgroundColor:theme.ink}}>
  <Sequence durationInFrames={INTRO}><Intro {...props}/></Sequence>
  <Sequence from={INTRO} durationInFrames={CLIP1_DURATION+CLIP2_DURATION-OVERLAP}>
   <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={CLIP1_DURATION}><OffthreadVideo src={staticFile('clip_1.mov')} startFrom={CLIP1_START} endAt={CLIP1_END} style={{width:'100%',height:'100%',objectFit:'contain'}} volume={f=>interpolate(f,[0,8,CLIP1_DURATION-OVERLAP,CLIP1_DURATION],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}/></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:OVERLAP})}/>
    <TransitionSeries.Sequence durationInFrames={CLIP2_DURATION}><OffthreadVideo src={staticFile('clip_2.mov')} endAt={CLIP2_DURATION} style={{width:'100%',height:'100%',objectFit:'contain'}} volume={f=>0.944*interpolate(f,[0,OVERLAP,CLIP2_DURATION-15,CLIP2_DURATION],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}/></TransitionSeries.Sequence>
   </TransitionSeries>
  </Sequence>
  <Sequence from={TOTAL-OUTRO} durationInFrames={OUTRO}><Outro {...props}/></Sequence>
  <Captions/>
  {frame>=INTRO && frame<TOTAL-OUTRO && <div style={{position:'absolute',top:0,left:0,width:`${100*(frame-INTRO)/(TOTAL-OUTRO-INTRO)}%`,height:5,background:theme.accent,opacity:.8}}/>}
 </AbsoluteFill>;
};
