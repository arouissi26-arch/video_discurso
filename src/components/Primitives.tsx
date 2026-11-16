import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {captionCues, type CaptionCue} from '../lib/transcript';
import {chapters, sectionAt} from '../timeline';
import {accentColor, theme, type Accent} from '../theme';

export const premium = Easing.bezier(...theme.motion.enter);

export const GridBackdrop: React.FC<{opacity?: number}> = ({opacity = theme.motion.gridOpacity}) => (
  <AbsoluteFill style={{pointerEvents:'none',opacity,backgroundImage:`linear-gradient(to right, ${theme.color.line} 1px, transparent 1px), linear-gradient(to bottom, ${theme.color.line} 1px, transparent 1px)`,backgroundSize:`${theme.layout.width / theme.layout.columns}px 100%, 100% 135px`}} />
);

export const FineGrain: React.FC = () => (
  <AbsoluteFill style={{pointerEvents:'none',opacity:theme.motion.textureOpacity,mixBlendMode:'soft-light'}}>
    <svg width="100%" height="100%" aria-hidden="true">
      <filter id="print-grain"><feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
      <rect width="100%" height="100%" filter="url(#print-grain)" opacity="0.7"/>
    </svg>
  </AbsoluteFill>
);

export const CropMarks: React.FC<{color?: string}> = ({color = theme.color.secondary}) => {
  const size = theme.motion.cropSize;
  const edge = theme.layout.sideSafe * theme.layout.width;
  const top = theme.layout.verticalSafe * theme.layout.height;
  const common: React.CSSProperties = {position:'absolute',width:size,height:size,borderColor:color,opacity:0.72};
  return <>
    <div style={{...common,left:edge,top,borderLeft:`${theme.widths.hairline}px solid`,borderTop:`${theme.widths.hairline}px solid`}}/>
    <div style={{...common,right:edge,top,borderRight:`${theme.widths.hairline}px solid`,borderTop:`${theme.widths.hairline}px solid`}}/>
    <div style={{...common,left:edge,bottom:top,borderLeft:`${theme.widths.hairline}px solid`,borderBottom:`${theme.widths.hairline}px solid`}}/>
    <div style={{...common,right:edge,bottom:top,borderRight:`${theme.widths.hairline}px solid`,borderBottom:`${theme.widths.hairline}px solid`}}/>
  </>;
};

export const ProgressLine: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return <div style={{position:'absolute',zIndex:30,top:0,left:0,width:`${Math.min(100,frame/durationInFrames*100)}%`,height:theme.motion.progressHeight,background:`linear-gradient(90deg, ${theme.color.lime} 0%, ${theme.color.red} 52%, ${theme.color.blueText} 100%)`}}/>;
};

export const ChapterChip: React.FC<{mediaSeconds:number}> = ({mediaSeconds}) => {
  const chapter = [...chapters].reverse().find((entry) => mediaSeconds >= entry.at && mediaSeconds < entry.at + 2.6);
  if (!chapter) return null;
  const color = accentColor(chapter.accent as Accent);
  return <div style={{position:'absolute',zIndex:15,left:theme.layout.sideSafe*theme.layout.width,top:theme.layout.verticalSafe*theme.layout.height,display:'flex',gap:14,alignItems:'center',padding:'8px 12px',border:`1px solid ${color}`,background:theme.color.ink,color,letterSpacing:'0.07em',fontFamily:theme.font.mono,fontWeight:theme.font.monoWeight,fontSize:theme.size.label*theme.layout.height}}>
    <span style={{width:7,height:7,background:color,display:'inline-block'}}/>{chapter.label}
  </div>;
};

export const Marquee: React.FC<{reverse?:boolean}> = ({reverse=false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const x = (frame/(fps*theme.motion.marqueeSeconds)*100)%100;
  const text = 'OPORTUNITAT  —  AMENAÇA  —  OPORTUNITAT  —  AMENAÇA  —  ';
  return <div style={{position:'absolute',left:0,right:0,overflow:'hidden',whiteSpace:'nowrap',borderTop:`1px solid ${theme.color.line}`,borderBottom:`1px solid ${theme.color.line}`,padding:'9px 0',fontFamily:theme.font.mono,fontSize:theme.size.label*theme.layout.height,color:theme.color.secondary,letterSpacing:'0.12em'}}>
    <div style={{transform:`translateX(${reverse ? x-100 : -x}%)`,width:'200%'}}>{text}{text}</div>
  </div>;
};

const keywordColor = (word: string): string | undefined => {
  const w = word.toLocaleUpperCase('ca').replace(/[.,:;?!“”«»()]/gu,'');
  if (['OPORTUNITAT','SALUT','EDUCACIÓ','VIDA','QUOTIDIANA','CARA','MÚSICA','CAMÍ'].includes(w)) return theme.color.lime;
  if (['AMENAÇA','FIABILITAT','DEEPFAKES','PRIVACITAT','FEINA','ÈTIC','ÈTICA'].includes(w)) return theme.color.red;
  if (['SENTIT','CRÍTIC','NOSALTRES'].includes(w)) return theme.color.blueText;
  return undefined;
};

export const CaptionOverlay: React.FC<{mediaSeconds:number}> = ({mediaSeconds}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = mediaSeconds;
  const cue = captionCues.find((item) => time >= item.start && time <= item.end + 0.16);
  const [opacity, translateY] = cue
    ? [interpolate(frame - Math.round(cue.start*fps),[0,7],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),interpolate(frame - Math.round(cue.start*fps),[0,7],[8,0],{easing:premium,extrapolateLeft:'clamp',extrapolateRight:'clamp'})]
    : [0,0];
  if (!cue) return null;
  const activeIndex = Math.max(0,cue.words.reduce((last,word,index)=>time>=word.start?index:last,-1));
  const active = cue.words[activeIndex] ?? cue.words[0];
  return <div style={{position:'absolute',zIndex:22,left:'7%',width:'86%',bottom:`${theme.layout.captionBottom*100}%`,display:'flex',justifyContent:'center',transform:`translateY(${translateY}px)`,opacity,fontFamily:theme.font.caption,fontWeight:theme.font.captionWeight,fontSize:theme.size.caption*theme.layout.height,lineHeight:1.12,textAlign:'center',textShadow:`-2px -2px 0 ${theme.color.ink}, 2px -2px 0 ${theme.color.ink}, -2px 2px 0 ${theme.color.ink}, 2px 2px 0 ${theme.color.ink}, 0 3px 8px ${theme.color.ink}`}}>
    <div style={{display:'inline-block',maxWidth:'100%',padding:'10px 18px',background:'rgba(10,10,11,0.88)',borderLeft:`3px solid ${accentColor(sectionAt(time))}`}}>
      {wrap(cue.words).map((line,lineIndex)=><div key={lineIndex} style={{whiteSpace:'nowrap'}}>{line.map((word,index)=>{
        const isActive = word === active;
        const keyword = keywordColor(word.text);
        return <React.Fragment key={`${lineIndex}-${index}`}><span style={{display:'inline-block',padding:isActive?'0 5px':'0 1px',margin:isActive?'0 1px':'0',background:isActive?accentColor(sectionAt(time)):'transparent',color:isActive?theme.color.black:(keyword??theme.color.paper),textShadow:isActive?'none':undefined}}>{word.text}</span>{index<line.length-1?' ':''}</React.Fragment>;
      })}</div>)}
    </div>
  </div>;
};

const wrap = (words:CaptionCue['words']):CaptionCue['words'][] => {
  const lines:CaptionCue['words'][]=[];let current:CaptionCue['words']=[];let length=0;
  for(const word of words){const next=length+(current.length?1:0)+word.text.length;if(current.length&&next>38){lines.push(current);current=[];length=0;}current.push(word);length+=(current.length>1?1:0)+word.text.length;}
  if(current.length)lines.push(current);
  if(lines.length<=2)return lines;
  return [lines.slice(0,-1).flat(),lines[lines.length-1]];
};
