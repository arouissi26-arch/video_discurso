import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from './theme';
import type {Titles} from './config';

const Background: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{background:`radial-gradient(circle at 80% 15%, #1d3950 0%, ${theme.ink} 58%)`, color:theme.paper, fontFamily:theme.font, overflow:'hidden'}}>
 <svg width="1080" height="1920" style={{position:'absolute',opacity:.16}}><defs><pattern id="grid" width="90" height="90" patternUnits="userSpaceOnUse"><path d="M 90 0 L 0 0 0 90" fill="none" stroke={theme.accent} strokeWidth="1"/><circle cx="0" cy="0" r="3" fill={theme.accent}/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>
 <div style={{position:'absolute',left:80,top:125,bottom:125,width:3,background:theme.accent,opacity:.55}}/>{children}
</AbsoluteFill>;
export const Intro: React.FC<Titles> = ({name,subject,course}) => {
 const frame=useCurrentFrame(), {fps}=useVideoConfig(); const p=spring({frame,fps,config:{damping:200},durationInFrames:32});
 return <Background><div style={{position:'absolute',left:130,right:95,top:570,opacity:p,transform:`translateY(${interpolate(p,[0,1],[35,0])}px)`}}>
  <div style={{color:theme.accent,fontSize:30,fontWeight:700,letterSpacing:6,marginBottom:38}}>EXPOSICIÓ ORAL</div>
  <div style={{fontSize:104,fontWeight:700,lineHeight:1.08,letterSpacing:-4}}>Intel·ligència<br/>Artificial</div>
  <div style={{height:5,width:120,background:theme.accent,margin:'54px 0 38px'}}/>
  <div style={{fontSize:56,fontWeight:500,lineHeight:1.2}}>Oportunitat o amenaça?</div>
 </div><div style={{position:'absolute',left:130,bottom:185,color:theme.muted,fontSize:27,letterSpacing:1,opacity:p}}>{name} &nbsp;·&nbsp; {subject} &nbsp;·&nbsp; {course}</div></Background>;
};
export const Outro: React.FC<Titles> = ({name,course}) => {
 const frame=useCurrentFrame(),{fps}=useVideoConfig(); const p=spring({frame,fps,config:{damping:200},durationInFrames:34}); const fade=interpolate(frame,[125,149],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <AbsoluteFill style={{opacity:fade,background:theme.ink}}><Background><div style={{position:'absolute',left:130,right:100,top:630,opacity:p,transform:`translateY(${(1-p)*30}px)`}}><div style={{color:theme.accent,fontWeight:700,fontSize:30,letterSpacing:5,marginBottom:45}}>LA REFLEXIÓ FINAL</div><div style={{fontSize:75,lineHeight:1.17,fontWeight:700,letterSpacing:-2}}>Sentit crític:<br/>la decisió seguirà sent humana.</div><div style={{height:4,width:120,background:theme.accent,margin:'55px 0 45px'}}/><div style={{fontSize:49}}>Moltes gràcies</div></div><div style={{position:'absolute',bottom:185,left:130,color:theme.muted,fontSize:27}}>{name} &nbsp;·&nbsp; {course}</div></Background></AbsoluteFill>;
};
