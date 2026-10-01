import React, {useEffect,useMemo,useRef,useState} from 'react';
import './forge.css';
const SECTIONS=[
{id:'chest-1',label:'CHEST + TRICEPS 01',title:'CHEST + TRICEPS',round:'01',folder:'chest-1'},
{id:'back-1',label:'BACK + BICEPS 01',title:'BACK + BICEPS',round:'01',folder:'back-1'},
{id:'legs-1',label:'LEGS + SHOULDERS 01',title:'LEGS + SHOULDERS',round:'01',folder:'legs-1'},
{id:'rest-1',label:'REST 01',title:'RECOVERY',round:'01',folder:'rest-1'},
{id:'chest-2',label:'CHEST + TRICEPS 02',title:'CHEST + TRICEPS',round:'02',folder:'chest-2'},
{id:'back-2',label:'BACK + BICEPS 02',title:'BACK + BICEPS',round:'02',folder:'back-2'},
{id:'legs-2',label:'LEGS + SHOULDERS 02',title:'LEGS + SHOULDERS',round:'02',folder:'legs-2'},
{id:'rest-2',label:'REST 02',title:'RECOVERY',round:'02',folder:'rest-2'}];
const MEDIA=Object.fromEntries(SECTIONS.map(s=>[s.id,Array.from({length:10},(_,i)=>`/media/${s.folder}/${String(i+1).padStart(2,'0')}.jpg`)]));
const TRACKS=Object.fromEntries(SECTIONS.map(s=>[s.id,`/audio/${s.folder}.mp3`]));
const isVideo=s=>/\.(mp4|webm|ogg)(\?.*)?$/i.test(s);
export default function ForgeApp(){
const [activeId,setActiveId]=useState(SECTIONS[0].id),[frame,setFrame]=useState(0),[playing,setPlaying]=useState(false),[failed,setFailed]=useState({});
const audioRef=useRef(null);
const active=useMemo(()=>SECTIONS.find(s=>s.id===activeId)||SECTIONS[0],[activeId]);
const playlist=(MEDIA[activeId]||[]).filter(src=>!failed[src]),current=playlist.length?playlist[frame%playlist.length]:null,track=TRACKS[activeId];
useEffect(()=>{setFrame(0);setFailed({});setPlaying(false)},[activeId]);
useEffect(()=>{if(!current||isVideo(current))return;const id=window.setInterval(()=>setFrame(n=>(n+1)%Math.max(playlist.length,1)),6500);return()=>window.clearInterval(id)},[activeId,current,playlist.length]);
useEffect(()=>{const a=audioRef.current;if(!a)return;a.pause();a.src=track;a.load();setPlaying(false)},[track]);
const toggle=async()=>{const a=audioRef.current;if(!a)return;try{if(playing){a.pause();setPlaying(false)}else{await a.play();setPlaying(true)}}catch{setPlaying(false)}};
const next=()=>setFrame(n=>(n+1)%Math.max(playlist.length,1));
return <main className="forge-wall"><div className="wall-media" aria-hidden="true">{current&&(isVideo(current)?<video key={current} className="wall-visual" src={current} autoPlay muted playsInline onEnded={next} onError={()=>setFailed(old=>({...old,[current]:true}))}/>:<img key={current} className="wall-visual" src={current} alt="" onError={()=>setFailed(old=>({...old,[current]:true}))}/>)}</div><div className="wall-vignette"/>
<header className="wall-header"><a className="wordmark" href="/" aria-label="FORGE home">F<span>O</span>RGE</a><nav className="workout-nav" aria-label="Choose workout">{SECTIONS.map(s=><button key={s.id} className={activeId===s.id?'workout-tab active':'workout-tab'} aria-current={activeId===s.id?'page':undefined} onClick={()=>setActiveId(s.id)}>{s.label}</button>)}</nav></header>
<section className="wall-title" aria-live="polite"><div className="wall-kicker">FORGE <span>—</span> SESSION {active.round}</div><h1>{active.title}</h1><div className="title-rule"/>{playlist.length===0&&<p className="media-hint">Add your visuals to the project media folder.</p>}</section>
<div className="sound-control"><span className="sound-label">SOUNDTRACK</span><span className={playing?'sound-wave playing':'sound-wave'} aria-hidden="true">{Array.from({length:12},(_,i)=><i key={i}/>)}</span><button className="sound-toggle" onClick={toggle} aria-label={playing?'Pause soundtrack':'Play soundtrack'}>{playing?'Ⅱ':'▶'}</button></div><audio ref={audioRef} loop preload="none"/></main>}
