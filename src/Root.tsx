import React from 'react';
import {Composition} from 'remotion';
import {Main, mainDurationInFrames} from './scenes/Main';
import {Intro} from './scenes/Intro';
import {Outro} from './scenes/Outro';
import {theme} from './theme';
import type {Credits} from './scenes/Intro';

const defaultCredits:Credits={name:'',subject:'',course:''};

export const Root:React.FC = () => <>
  <Composition id="Main" component={Main} durationInFrames={mainDurationInFrames} fps={theme.timing.fps} width={theme.layout.width} height={theme.layout.height} defaultProps={defaultCredits}/>
  <Composition id="Intro" component={Intro} durationInFrames={theme.timing.introSeconds*theme.timing.fps} fps={theme.timing.fps} width={theme.layout.width} height={theme.layout.height} defaultProps={defaultCredits}/>
  <Composition id="Outro" component={Outro} durationInFrames={theme.timing.outroSeconds*theme.timing.fps} fps={theme.timing.fps} width={theme.layout.width} height={theme.layout.height} defaultProps={defaultCredits}/>
</>;
