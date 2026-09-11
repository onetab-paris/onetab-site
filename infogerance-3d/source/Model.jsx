// Model geometry © 2026 Pulkit Saraf, MIT. Adapted for OneTab scroll storytelling.
import React, {useMemo, useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {Battery, BottomCover, Display, Fan, HeatSink, Hinge, IOBoard, Keyboard, LogicBoard, Processor, Speaker, TopCase, Trackpad} from './geometry';
import {transforms} from './transforms';
export const clamp=v=>Math.min(1,Math.max(0,v));
export const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
export const timing={display:[.025,.28],'top-case':[.025,.28],keyboard:[.055,.32],trackpad:[.055,.32],'bottom-cover':[.05,.3],'logic-board':[.2,.48],processor:[.29,.57],heatsink:[.25,.54],'left-fan':[.21,.47],'right-fan':[.21,.47],'battery-left':[.39,.64],'battery-center':[.39,.64],'battery-right':[.39,.64],'left-speaker':[.45,.73],'right-speaker':[.45,.73],'left-io':[.43,.7],'right-io':[.43,.7],magsafe:[.43,.7],'left-hinge':[.12,.42],'right-hinge':[.12,.42]};
export function positionFor(id,p){const {at,spread}=transforms[id],[a,b]=timing[id];const e=smooth(a,b,p)*(1-smooth(.81,1,p));return at.map((v,i)=>v+spread[i]*e)}
export default function Model({control}){
 const root=useRef();const refs=useRef({});
 const models=useMemo(()=>({'top-case':<TopCase/>,'bottom-cover':<BottomCover/>,display:<Display lid={1.945}/>,keyboard:<Keyboard/>,trackpad:<Trackpad/>,'logic-board':<LogicBoard/>,processor:<Processor/>,'left-fan':<group scale={[1,.65,1]}><Fan/></group>,'right-fan':<group scale={[1,.65,1]}><Fan flipped/></group>,heatsink:<HeatSink/>,'left-speaker':<Speaker/>,'right-speaker':<Speaker/>,'battery-left':<Battery/>,'battery-center':<Battery center/>,'battery-right':<Battery/>,'left-io':<IOBoard/>,'right-io':<IOBoard right/>,magsafe:<IOBoard magsafe/>,'left-hinge':<Hinge/>,'right-hinge':<Hinge/>}),[]);
 useFrame(()=>{const p=control.progress;Object.keys(transforms).forEach(id=>refs.current[id]?.position.set(...positionFor(id,p)));const spread=smooth(.025,.72,p)*(1-smooth(.81,1,p));if(root.current)root.current.rotation.y=-.16+spread*.10});
 return <group ref={root} name="Inside MacBook — 20 assemblies">{Object.entries(models).map(([id,mesh])=><group key={id} name={id} ref={g=>{refs.current[id]=g}} position={transforms[id].at}>{mesh}</group>)}</group>;
}
