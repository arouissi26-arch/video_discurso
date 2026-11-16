import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {CropMarks, GridBackdrop, Marquee, premium} from '../components/Primitives';
import {theme} from '../theme';
import type {Credits} from './Intro';

export const Outro: React.FC<Credits> = ({name='',course=''}) => {
  const frame=useCurrentFrame();
  const reveal=(start:number)=>interpolate(frame,[start,start+18],[100,0],{easing:premium,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const underline=interpolate(frame,[56,92],[0,theme.layout.width*0.16],{easing:premium,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const thanks=interpolate(frame,[68,88],[0,1],{easing:premium,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const wipe=interpolate(frame,[126,150],[0,100],{easing:Easing.in(Easing.quad),extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <AbsoluteFill style={{background:theme.color.ink,color:theme.color.paper,overflow:'hidden'}}>
    <GridBackdrop/><CropMarks/>
    <div style={{position:'absolute',left:'7%',top:'10%',fontFamily:theme.font.mono,fontSize:theme.size.label*theme.layout.height,color:theme.color.secondary,letterSpacing:'0.14em'}}>03 / DESENLLAÇ</div>
    <div style={{position:'absolute',left:'7%',top:'24%',right:'7%',fontFamily:theme.font.display,fontWeight:theme.font.displayWeight,fontSize:theme.size.display*theme.layout.height,lineHeight:0.9,letterSpacing:'-0.07em'}}>
      <div style={{overflow:'hidden',clipPath:`inset(0 0 ${reveal(6)}% 0)`}}><span style={{color:theme.color.blueText}}>SENTIT CRÍTIC</span></div>
      <div style={{overflow:'hidden',clipPath:`inset(0 0 ${reveal(22)}% 0)`}}>LA DECISIÓ SEGUIRÀ</div>
      <div style={{overflow:'hidden',clipPath:`inset(0 0 ${reveal(38)}% 0)`}}>SENT <em style={{fontFamily:theme.font.editorial,fontWeight:theme.font.editorialWeight,fontStyle:'italic'}}>humana.</em></div>
    </div>
    <div style={{position:'absolute',left:'23%',top:'57%',width:`${(underline/theme.layout.width)*100}%`,height:theme.widths.rule,background:theme.color.paper}}/>
    <div style={{position:'absolute',left:'7%',top:'65%',fontFamily:theme.font.display,fontWeight:theme.font.displayWeight,fontSize:theme.size.title*theme.layout.height,letterSpacing:'-0.04em',opacity:thanks,transform:`translateY(${(1-thanks)*18}px)`}}>Moltes gràcies</div>
    <div style={{position:'absolute',top:'78%',left:0,right:0}}><Marquee reverse/></div>
    {(name||course)&&<div style={{position:'absolute',left:'7%',bottom:'8%',fontFamily:theme.font.mono,fontSize:theme.size.label*theme.layout.height,color:theme.color.secondary}}>{[name,course].filter(Boolean).join('  ·  ')}</div>}
    <div style={{position:'absolute',right:'7%',bottom:'8%',fontFamily:theme.font.mono,fontSize:theme.size.label*theme.layout.height,color:theme.color.secondary}}>FI / PRESENT</div>
    <div style={{position:'absolute',zIndex:10,left:0,right:0,top:0,height:`${wipe}%`,background:theme.color.ink,transform:'translateY(-100%)'}}/>
  </AbsoluteFill>;
};
