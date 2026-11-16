import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import {Intro,Outro} from './Cards';
import {defaultTitles,FPS,INTRO,OUTRO,TOTAL} from './config';
export const RemotionRoot: React.FC = () => <>
 <Composition id="Main" component={Main} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL} defaultProps={defaultTitles}/>
 <Composition id="Intro" component={Intro} width={1080} height={1920} fps={FPS} durationInFrames={INTRO} defaultProps={defaultTitles}/>
 <Composition id="Outro" component={Outro} width={1080} height={1920} fps={FPS} durationInFrames={OUTRO} defaultProps={defaultTitles}/>
</>;
