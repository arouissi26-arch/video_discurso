import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {CropMarks, GridBackdrop, Marquee, premium} from '../components/Primitives';
import {theme} from '../theme';

export type Credits = {name?:string; subject?:string; course?:string};

const RevealLine: React.FC<{words:string[];frame:number;offset:number}> = ({words,frame,offset}) => (
  <div style={{display:'flex',gap:'0.22em',overflow:'hidden',lineHeight:0.88,whiteSpace:'nowrap'}}>
    {words.map((word,index)=>{
      const p=interpolate(frame-(offset+index*7),[0,18],[0,1],{easing:premium,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
      const y=interpolate(p,[0,1],[110,0]);
      return <span key={word} style={{display:'inline-block',clipPath:'inset(0 0 0 0)',transform:`translateY(${y}%)`,fontSize:theme.size.mega*theme.layout.height,fontFamily:theme.font.display,fontWeight:theme.font.displayWeight,letterSpacing:'-0.075em',color:theme.color.paper}}>{word}</span>;
    })}
  </div>
);

export const Intro: React.FC<Credits> = ({name='',subject='',course=''}) => {
  const frame=useCurrentFrame();
  const wipe=interpolate(frame,[92,120],[0,100],{easing:Easing.in(Easing.quad),extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const line=interpolate(frame,[62,104],[0,theme.layout.width*0.29],{easing:premium,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const labels=[name,subject,course].filter(Boolean);
  return <AbsoluteFill style={{background:theme.color.ink,color:theme.color.paper,fontFamily:theme.font.display,overflow:'hidden'}}>
    <GridBackdrop/><CropMarks/>
    <div style={{position:'absolute',left:'6%',right:'6%',top:'10%',fontFamily:theme.font.mono,fontSize:theme.size.label*theme.layout.height,color:theme.color.secondary,letterSpacing:'0.14em',display:'flex',justifyContent:'space-between'}}><span>ESTUDI / IA—01</span><span>BARCELONA · 2026</span></div>
    <div style={{position:'absolute',left:'7%',top:'26%',right:'5%'}}>
      <RevealLine words={['INTEL·LIGÈNCIA']} frame={frame} offset={7}/>
      <RevealLine words={['ARTIFICIAL']} frame={frame} offset={18}/>
    </div>
    <div style={{position:'absolute',left:'7%',right:'7%',top:'62%',height:2,background:theme.color.line}}>
      <div style={{height:'100%',width:line,background:theme.color.blueText}}/>
    </div>
    <div style={{position:'absolute',left:'7%',top:'64%',display:'flex',alignItems:'center',gap:20,fontSize:theme.size.title*theme.layout.height,fontWeight:theme.font.displayWeight,letterSpacing:'-0.055em'}}>
      <span style={{color:theme.color.lime}}>Oportunitat</span><span style={{fontFamily:theme.font.mono,color:theme.color.secondary,fontSize:theme.size.label*theme.layout.height}}>O</span><span style={{fontFamily:theme.font.editorial,fontStyle:'italic',fontWeight:theme.font.editorialWeight,color:theme.color.red}}>amenaça?</span>
    </div>
    <div style={{position:'absolute',top:'76%',left:0,right:0}}><Marquee/></div>
    <div style={{position:'absolute',left:'7%',bottom:'8%',fontFamily:theme.font.mono,fontSize:theme.size.label*theme.layout.height,color:theme.color.secondary,letterSpacing:'0.04em'}}>{labels.length ? labels.join('  ·  ') : ''}</div>
    <div style={{position:'absolute',right:'7%',bottom:'8%',fontFamily:theme.font.mono,fontSize:theme.size.label*theme.layout.height,color:theme.color.paper}}>01 / INTRODUCCIÓ</div>
    <div style={{position:'absolute',zIndex:10,left:0,right:0,top:0,height:`${wipe}%`,background:theme.color.lime,transform:'translateY(-100%)'}}/>
  </AbsoluteFill>;
};
