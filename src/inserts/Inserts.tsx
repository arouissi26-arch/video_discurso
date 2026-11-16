import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Cue} from '../timeline';
import {accentColor, theme} from '../theme';
import {CropMarks, GridBackdrop, premium} from '../components/Primitives';

const enter=(frame:number,from=0,to=18)=>interpolate(frame,[from,to],[0,1],{easing:premium,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const formatTimecode=(seconds:number)=>`00:${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
const Mono:React.FC<{children:React.ReactNode;color?:string;size?:number}> = ({children,color=theme.color.secondary,size=theme.size.label*theme.layout.height}) => <div style={{fontFamily:theme.font.mono,fontWeight:theme.font.monoWeight,fontSize:size,color,letterSpacing:'0.08em'}}>{children}</div>;

const Ecg:React.FC<{frame:number;accent:string;anomaly?:boolean}> = ({frame,accent,anomaly=false}) => {
  const path=anomaly?'M0 75 L55 75 L68 68 L82 78 L103 72 L121 75 L145 75 L163 26 L181 116 L200 54 L218 76 L267 75 L295 75 L317 73 L336 77 L355 75 L372 27 L390 114 L408 55 L426 75 L480 75':'M0 75 L90 75 L110 72 L126 78 L145 75 L170 75 L190 26 L210 116 L228 53 L247 75 L330 75 L350 72 L365 78 L385 75 L410 75 L430 26 L450 116 L468 53 L486 75 L560 75';
  const length=anomaly?1180:1120;
  const dash=interpolate(frame,[4,36],[length,0],{easing:premium,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const pulse=frame%30<8?1.08:1;
  return <svg width="100%" height="130" viewBox="0 0 560 150" preserveAspectRatio="none" style={{overflow:'visible'}}>
    <path d={path} fill="none" stroke={theme.color.line} strokeWidth="2"/>
    <path d={path} fill="none" stroke={accent} strokeWidth="4" strokeDasharray={length} strokeDashoffset={dash} strokeLinecap="square"/>
    {anomaly&&<text x="447" y="43" fill={theme.color.red} fontFamily={theme.font.display} fontSize="66" fontWeight="800" transform={`scale(${pulse})`}>!</text>}
  </svg>;
};

const Rows:React.FC<{frame:number;rows:string[];accent:string}> = ({frame,rows,accent}) => <div style={{display:'grid',gap:10,marginTop:18}}>{rows.map((row,index)=>{
  const p=enter(frame,6+index*5,20+index*5);
  return <div key={row} style={{display:'flex',alignItems:'center',gap:15,borderTop:`1px solid ${theme.color.line}`,padding:'12px 0',opacity:p,transform:`translateX(${(1-p)*22}px)`}}><Mono color={accent}>0{index+1}</Mono><div style={{fontFamily:theme.font.display,fontWeight:theme.font.displayWeight,fontSize:theme.size.subtitle*theme.layout.height,color:theme.color.paper,letterSpacing:'-0.04em'}}>{row}</div></div>;
})}</div>;

const DataViz:React.FC<{cue:Cue;frame:number;accent:string}> = ({cue,frame,accent}) => {
  switch(cue.kind){
    case 'ecg':case 'ecg-anomaly':case 'ecg-callback':
      return <div style={{marginTop:25}}><Ecg frame={frame} accent={accent} anomaly={cue.kind==='ecg-anomaly'}/><div style={{display:'flex',justifyContent:'space-between',marginTop:2}}><Mono color={accent}>{cue.kind==='ecg-anomaly'?'PULS · ANOMALIA':'PULS · SENYAL'}</Mono><Mono>ECG / 01</Mono></div></div>;
    case 'three-examples':return <div style={{display:'grid',gap:6,marginTop:14}}>{['RECONÈIXER UNA CARA','ENTENDRE EL QUE DIEM','RECOMANAR UNA SÈRIE'].map((row,index)=>{const p=enter(frame,5+index*5,20+index*5);return <div key={row} style={{display:'flex',alignItems:'center',gap:12,borderTop:`1px solid ${theme.color.line}`,padding:'8px 0',opacity:p,transform:`translateX(${(1-p)*18}px)`}}><Mono color={accent}>0{index+1}</Mono><svg width="54" height="42" viewBox="0 0 54 42" fill="none" stroke={accent} strokeWidth="2">{index===0?<><circle cx="27" cy="14" r="8"/><path d="M12 38 Q27 20 42 38 M21 14h1 M32 14h1"/><circle cx="21" cy="14" r="1.5" fill={accent}/><circle cx="33" cy="14" r="1.5" fill={accent}/></>:index===1?<><path d="M2 22h5l4-11 5 22 5-17 5 12 5-7 5 1 4-8 4 16 4-8h6"/><path d="M33 7h18v28H33z" strokeDasharray="3 3" opacity="0.6"/></>:<><rect x="5" y="5" width="28" height="29"/><rect x="13" y="9" width="28" height="29"/><rect x="21" y="13" width="28" height="25"/><path d="M26 22h17M26 28h13"/></>}</svg><div style={{fontFamily:theme.font.display,fontWeight:theme.font.displayWeight,fontSize:theme.size.label*2*theme.layout.height,color:theme.color.paper,letterSpacing:'-0.03em'}}>{row}</div></div>})}</div>;
    case 'reliability':return <div style={{marginTop:22,borderTop:`1px solid ${theme.color.line}`,paddingTop:18,position:'relative',fontFamily:theme.font.mono,fontSize:theme.size.label*theme.layout.height,color:theme.color.paper,letterSpacing:'0.08em'}}>INFORMACIÓ <span style={{color:accent}}>—</span> RESPOSTA<div style={{height:2,width:`${interpolate(frame,[0,28],[0,86],{easing:premium,extrapolateLeft:'clamp',extrapolateRight:'clamp'})}%`,background:accent,marginTop:18}}/><div style={{position:'absolute',left:'53%',top:16,width:'26%',height:2,background:theme.color.ink,transform:'rotate(-12deg)'}}/></div>;
    case 'ethics-opening':return <Rows frame={frame} accent={accent} rows={['PROFESSIONS','ÚS ÈTIC']}/>;
    case 'balance':return <div style={{marginTop:22,display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
      <div style={{height:80,background:theme.color.lime,color:theme.color.black,display:'grid',placeItems:'center',fontFamily:theme.font.mono,fontSize:theme.size.label*theme.layout.height,letterSpacing:'0.08em'}}>BENEFICIS</div>
      <div style={{height:80,background:theme.color.red,color:theme.color.black,display:'grid',placeItems:'center',fontFamily:theme.font.mono,fontSize:theme.size.label*theme.layout.height,letterSpacing:'0.08em'}}>RISCOS</div>
      <div style={{gridColumn:'1 / -1',borderTop:`1px solid ${theme.color.line}`,paddingTop:10,color:theme.color.blueText,fontFamily:theme.font.mono,fontSize:theme.size.label*theme.layout.height,letterSpacing:'0.08em'}}>NORMES · ÚS RESPONSABLE</div>
    </div>;
    case 'cat-learning':return <div style={{marginTop:20}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(6, 1fr)',gap:5}}>{Array.from({length:24},(_,i)=>{const on=frame>i*1.5;return <div key={i} style={{height:31,border:`1px solid ${on?accent:theme.color.line}`,background:on&&i===17?accent:'transparent',opacity:on?1:0.4,transform:`scale(${on?1:0.72})`}}/>;})}</div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:14}}><Mono>EXEMPLES</Mono><Mono color={accent}>{frame>48?'GAT':'PATRONS / ...'}</Mono></div>
    </div>;
    case 'daily-tools':return <div style={{marginTop:24}}>
      {['CARA','MÚSICA','CAMÍ'].map((label,index)=>{const on=frame>=10+index*9;return <div key={label} style={{display:'flex',alignItems:'center',gap:13,padding:'10px 0',borderTop:`1px solid ${theme.color.line}`,color:on?accent:theme.color.secondary,fontFamily:theme.font.mono,fontSize:theme.size.label*theme.layout.height,letterSpacing:'0.12em'}}><span style={{width:9,height:9,background:on?accent:theme.color.line}}/>{label}<span style={{marginLeft:'auto',width:`${on?70:0}px`,height:2,background:accent,transition:'none'}}/></div>})}
      <svg width="100%" height="64" viewBox="0 0 480 64"><path d="M18 42 C90 5 130 58 210 24 S355 5 455 33" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="520" strokeDashoffset={interpolate(frame,[0,45],[520,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}/></svg>
    </div>;
    case 'alphafold':return <div style={{marginTop:4}}>
      <svg width="100%" height="105" viewBox="0 0 480 105"><path d="M10 55 C54 4 90 95 132 42 S204 20 224 57 S287 96 318 40 S383 12 420 52 S453 86 475 37" fill="none" stroke={accent} strokeWidth="3" strokeDasharray="650" strokeDashoffset={interpolate(frame,[3,38],[650,0],{easing:premium,extrapolateLeft:'clamp',extrapolateRight:'clamp'})}/></svg>
      <div style={{display:'flex',justifyContent:'space-between',borderTop:`1px solid ${theme.color.line}`,paddingTop:8}}><Mono>ANYS</Mono><span style={{color:accent}}>→</span><Mono>ANYS</Mono></div>
    </div>;
    case 'health':return <div style={{marginTop:10,position:'relative',height:180,border:`1px solid ${theme.color.line}`,overflow:'hidden'}}>
      <svg width="100%" height="100%" viewBox="0 0 480 180"><path d="M180 20 Q240 0 300 20 L330 65 L305 85 L294 53 L285 164 L195 164 L185 53 L172 85 L150 65 Z" fill="none" stroke={theme.color.secondary} strokeWidth="2"/><circle cx="240" cy="75" r="11" fill="none" stroke={accent} strokeWidth="3"/><circle cx="215" cy="111" r="7" fill="none" stroke={accent} strokeWidth="2"/><circle cx="269" cy="130" r="8" fill="none" stroke={accent} strokeWidth="2"/><path d={`M0 ${interpolate(frame,[0,42],[4,174],{easing:premium,extrapolateLeft:'clamp',extrapolateRight:'clamp'})} H480`} stroke={accent} strokeWidth="2" opacity="0.9"/></svg>
      <Mono color={accent} size={theme.size.tiny*theme.layout.height}>SENYAL / ANÀLISI</Mono>
    </div>;
    case 'education':return <div style={{marginTop:15}}>{[0,1,2].map((i)=><div key={i} style={{height:16,background:theme.color.line,margin:'12px 0',position:'relative'}}><div style={{height:'100%',background:accent,width:`${interpolate(frame,[0,40],[22+i*18,78-i*11],{easing:premium,extrapolateLeft:'clamp',extrapolateRight:'clamp'})}%`}}/></div>)}<div style={{borderTop:`1px solid ${theme.color.line}`,paddingTop:10,display:'flex',justifyContent:'space-between'}}><Mono>NIT ABANS D’UN EXAMEN</Mono><Mono color={accent}>NIT</Mono></div></div>;
    case 'everyday':return <div style={{display:'grid',gap:6,marginTop:14}}>{['TRADUCTORS','MAPES','ASSISTENTS'].map((row,index)=>{const p=enter(frame,5+index*5,20+index*5);return <div key={row} style={{display:'flex',alignItems:'center',gap:12,borderTop:`1px solid ${theme.color.line}`,padding:'8px 0',opacity:p,transform:`translateX(${(1-p)*18}px)`}}><Mono color={accent}>0{index+1}</Mono><svg width="54" height="42" viewBox="0 0 54 42" fill="none" stroke={accent} strokeWidth="2">{index===0?<><path d="M4 5h26v19H17l-8 7v-7H4z"/><path d="M24 16h25v17H36l-7 6v-6h-5"/><path d="M10 12h14M31 23h12"/></>:index===1?<><path d="M8 34c0-9 6-10 8-16s-1-12 5-12 5 8 3 14-1 14 7 14 8-7 15-11"/><circle cx="21" cy="7" r="2" fill={accent}/><circle cx="46" cy="23" r="2" fill={accent}/></>:<><path d="M8 7h38v26H24l-9 7v-7H8z"/><path d="M17 20h2M26 20h2M35 20h2" strokeLinecap="round"/></>}</svg><div style={{fontFamily:theme.font.display,fontWeight:theme.font.displayWeight,fontSize:theme.size.label*2*theme.layout.height,color:theme.color.paper,letterSpacing:'-0.03em'}}>{row}</div></div>})}</div>;
    case 'deepfake':return <div style={{marginTop:22,display:'grid',gridTemplateColumns:'1fr 1fr',gap:2,position:'relative'}}>
      {['REAL','FALS'].map((word,index)=><div key={word} style={{height:132,background:index===0?theme.color.graphite:theme.color.ink,border:`1px solid ${index===0?theme.color.secondary:theme.color.red}`,display:'grid',placeItems:'center',fontFamily:theme.font.display,fontWeight:theme.font.displayWeight,fontSize:theme.size.title*theme.layout.height,color:index===0?theme.color.paper:theme.color.red,letterSpacing:'-0.06em',transform:frame%13<2&&index===1?'translateX(4px)':'none',textShadow:frame%13<2&&index===1?`-3px 0 ${theme.color.blueText}`:undefined}}>{word}</div>)}
      <div style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%) rotate(-9deg)',border:`2px solid ${theme.color.red}`,padding:'5px 12px',background:theme.color.ink,color:theme.color.red,fontFamily:theme.font.mono,fontSize:theme.size.label*theme.layout.height,letterSpacing:'0.1em'}}>VERITAT?</div>
      <div style={{position:'absolute',left:'47%',top:'50%',width:'10%',height:3,background:theme.color.red,transform:'rotate(-18deg)'}}/>
    </div>;
    case 'privacy':return <div style={{marginTop:18,display:'flex',alignItems:'center',gap:22}}>
      <div style={{width:70,height:112,border:`2px solid ${theme.color.paper}`,position:'relative',display:'grid',placeItems:'center'}}><div style={{width:27,height:27,border:`1px solid ${theme.color.secondary}`,borderRadius:'50%'}}/><div style={{position:'absolute',bottom:7,width:19,height:3,background:theme.color.secondary}}/></div>
      <svg width="105" height="95" viewBox="0 0 105 95"><path d="M2 48 H92 M68 27 L92 48 L68 69" fill="none" stroke={accent} strokeWidth="3" strokeDasharray="130" strokeDashoffset={interpolate(frame,[4,26],[130,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}/>{[15,30,60].map((x,i)=><circle key={x} cx={x} cy={20+i*24} r="4" fill={theme.color.red} opacity={frame>8+i*4?1:0}/>)}</svg>
      <div style={{fontFamily:theme.font.mono,color:theme.color.paper,fontSize:theme.size.label*theme.layout.height,lineHeight:2.1}}>DADES · ?<br/>RECULL · ?<br/><span style={{color:theme.color.red}}>QUI MÉS HO SAP?</span></div>
    </div>;
    case 'critical':case 'ours':return <div style={{fontFamily:theme.font.mono,fontSize:theme.size.label*theme.layout.height,color:accent,letterSpacing:'0.15em',marginTop:15}}>DECISIÓ / HUMANA&nbsp;&nbsp;—&nbsp;&nbsp;01</div>;
    default:return <div style={{marginTop:18}}><Mono color={accent}>{cue.detail??'IA · PERSONES · DECISIÓ'}</Mono></div>;
  }
};

export const CueLayer:React.FC<{cue:Cue}> = ({cue}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const accent=accentColor(cue.accent);
  const p=enter(frame,0,14);
  const full=cue.layout==='C';
  const split=cue.layout==='E';
  const section=cue.kind==='section-pro'||cue.kind==='section-con';
  const fullBg=section?accent:(cue.kind==='definition'?theme.color.blue:theme.color.ink);
  const titleColor=section?theme.color.black:(cue.accent==='blue'?theme.color.blueText:theme.color.paper);
  if(full){
    const title=cue.headline??'';
    return <AbsoluteFill style={{zIndex:13,background:fullBg,color:titleColor,overflow:'hidden',opacity:interpolate(frame,[0,5],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>
      {!section&&<><GridBackdrop opacity={0.16}/><CropMarks color={accent}/></>}
      <div style={{position:'absolute',right:'7%',top:'8%',fontFamily:theme.font.mono,fontSize:theme.size.label*theme.layout.height,color:section?theme.color.black:theme.color.secondary,letterSpacing:'0.1em'}}>T+ {formatTimecode(cue.at+frame/fps)}</div>
      <div style={{position:'absolute',left:'7%',top:section?'28%':'30%',right:'6%',fontFamily:theme.font.display,fontWeight:theme.font.displayWeight,fontSize:(title.length>18?theme.size.display:theme.size.mega)*theme.layout.height,lineHeight:0.88,letterSpacing:'-0.075em',clipPath:`inset(${(1-p)*100}% 0 0 0)`}}>{cue.kind==='ethics'?<><span>COPIAR </span><span style={{color:theme.color.red}}>≠</span><span> APRENDRE</span></>:title}</div>
      <div style={{position:'absolute',left:'7%',bottom:'13%',fontFamily:theme.font.mono,fontWeight:theme.font.monoWeight,fontSize:theme.size.label*theme.layout.height,letterSpacing:'0.12em',color:section?theme.color.black:theme.color.secondary}}>{cue.label} {cue.detail?` / ${cue.detail}`:''}</div>
    </AbsoluteFill>;
  }
  if(split){
    const slide=interpolate(frame,[0,17],[100,0],{easing:premium,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
    const deepfake=cue.kind==='deepfake';
    const leftBg=deepfake?theme.color.ink:theme.color.lime;
    const leftText=deepfake?theme.color.paper:theme.color.black;
    const rightText=theme.color.black;
    const sideWidth='27%';
    const titleSize=theme.size.subtitle*theme.layout.height;
    const time=Math.floor(cue.at+frame/fps);
    const timecode=`00:${String(Math.floor(time/60)).padStart(2,'0')}:${String(time%60).padStart(2,'0')}`;
    return <AbsoluteFill style={{zIndex:12,pointerEvents:'none'}}>
      <div style={{position:'absolute',left:0,top:'9%',height:'82%',width:sideWidth,background:leftBg,display:'flex',alignItems:'center',justifyContent:'center',boxSizing:'border-box',transform:`translateX(${-slide}%)`}}><span style={{fontFamily:deepfake?theme.font.display:theme.font.display,fontWeight:theme.font.displayWeight,fontSize:titleSize,color:leftText,letterSpacing:'-0.065em',lineHeight:0.9,textAlign:'center',padding:'0 20px'}}>{deepfake?'REAL':'OPORTUNITAT'}</span></div>
      <div style={{position:'absolute',right:0,top:'9%',height:'82%',width:sideWidth,background:theme.color.red,display:'flex',alignItems:'center',justifyContent:'center',boxSizing:'border-box',transform:`translateX(${slide}%)`}}><span style={{fontFamily:deepfake?theme.font.display:theme.font.editorial,fontStyle:deepfake?'normal':'italic',fontWeight:theme.font.displayWeight,fontSize:titleSize,color:rightText,letterSpacing:'-0.06em',lineHeight:0.9,textAlign:'center',padding:'0 20px',textShadow:deepfake&&frame%13<2?`-3px 0 ${theme.color.blueText}`:'none',transform:deepfake&&frame%13<2?'translateX(4px)':'none'}}>{deepfake?'FALS':'AMENAÇA?'}</span></div>
      <div style={{position:'absolute',left:0,top:'9%',height:'82%',width:2,background:theme.color.ink,transform:`translateX(${(27*theme.layout.width/100)-1}px)`}}/>
      <div style={{position:'absolute',right:0,top:'9%',height:'82%',width:2,background:theme.color.ink}}/>
      <div style={{position:'absolute',left:'6%',top:'11%',fontFamily:theme.font.mono,fontSize:theme.size.label*theme.layout.height,color:deepfake?theme.color.secondary:theme.color.black,letterSpacing:'0.12em'}}>{deepfake?'EN CONTRA · FIABILITAT':'LA PREGUNTA · DUES LECTURES'}</div>
      {deepfake&&<div style={{position:'absolute',right:'5%',bottom:'13%',fontFamily:theme.font.mono,fontSize:theme.size.label*theme.layout.height,color:theme.color.black,textDecoration:'line-through',textDecorationColor:theme.color.black,textDecorationThickness:2}}>VERITAT?</div>}
      <div style={{position:'absolute',right:'6%',top:'11%',fontFamily:theme.font.mono,fontSize:theme.size.label*theme.layout.height,color:deepfake?theme.color.paper:theme.color.black,letterSpacing:'0.08em'}}>{timecode}</div>
    </AbsoluteFill>;
  }
  const title=cue.headline??'';
  if(cue.layout==='D') return <AbsoluteFill style={{zIndex:12,pointerEvents:'none'}}>
    <div style={{position:'absolute',right:'7%',top:'14%',borderTop:`2px solid ${accent}`,paddingTop:8,opacity:p,fontFamily:theme.font.mono,fontSize:theme.size.label*theme.layout.height,color:accent,letterSpacing:'0.1em'}}>{cue.label} · T+ {formatTimecode(cue.at+frame/fps)}</div>
  </AbsoluteFill>;
  return <AbsoluteFill style={{zIndex:12,pointerEvents:'none'}}>
    <div style={{position:'absolute',left:'67%',top:'14%',width:'28%',height:'72%',boxSizing:'border-box',padding:'22px 20px',background:theme.color.ink,borderLeft:`2px solid ${accent}`,borderTop:`1px solid ${theme.color.line}`,borderBottom:`1px solid ${theme.color.line}`,opacity:p,transform:`translateX(${(1-p)*36}px)`}}>
      <Mono color={accent}>{cue.label}</Mono>
      <div style={{fontFamily:theme.font.display,fontWeight:theme.font.displayWeight,fontSize:(title.length>8?theme.size.subtitle:theme.size.display)*theme.layout.height,lineHeight:0.94,letterSpacing:'-0.065em',color:cue.accent==='lime'?theme.color.lime:cue.accent==='red'?theme.color.red:theme.color.blueText,marginTop:17,overflowWrap:'anywhere'}}>{title}</div>
      {cue.detail&&<div style={{marginTop:12,fontFamily:theme.font.mono,fontSize:theme.size.tiny*theme.layout.height,color:theme.color.secondary,lineHeight:1.6}}>{cue.detail}</div>}
      <DataViz cue={cue} frame={frame} accent={accent}/>
      <div style={{position:'absolute',left:20,right:20,bottom:16,borderTop:`1px solid ${theme.color.line}`,paddingTop:8,display:'flex',justifyContent:'space-between'}}><Mono size={theme.size.tiny*theme.layout.height}>IA / {cue.id.toUpperCase().replaceAll('-',' ')}</Mono><Mono size={theme.size.tiny*theme.layout.height}>T+ {formatTimecode(cue.at+frame/fps)}</Mono></div>
    </div>
  </AbsoluteFill>;
};
