import React, { useEffect, useMemo, useRef, useState } from 'react';
import './forge.css';

const GOAL_KG = 70;
const DAYS = [
 {k:'chest1',t:'Chest',sub:'Chest & triceps · cardio finisher',ex:[['Barbell Bench Press',4,'6–8',120],['Incline DB Press',3,'8–10',90],['Weighted Dips',3,'8–10',90],['Cable Fly (high-to-low)',3,'12',45],['Close-Grip Bench Press',3,'8',75],['Rope Triceps Pushdown',3,'12–15',45],['Cardio Finisher',1,'20–25 min',0],['Cable Crunch',3,'15',45]]},
 {k:'shoulder1',t:'Shoulders',sub:'Shoulders · cardio finisher',ex:[['Seated DB Shoulder Press',4,'8',90],['Lateral Raise',3,'15',45],['Front Raise',3,'12',45],['Face Pull',3,'15',45],['Upright Row',3,'10',60],['Barbell Shrugs',3,'12',45],['Cardio Finisher',1,'20–25 min',0],['Plank',3,'45 sec',30]]},
 {k:'legs1',t:'Legs',sub:'Full leg session · cardio finisher',ex:[['Back Squat',4,'6–8',120],['Romanian Deadlift',3,'8–10',90],['Walking Lunges',3,'12/leg',75],['Leg Press',3,'12',75],['Leg Curl',3,'12',60],['Standing Calf Raise',3,'15',45],['Cardio Finisher',1,'20–25 min',0],['Hanging Leg Raise',3,'12',45]]},
 {k:'rest1',t:'Recovery',sub:'Rest · optional easy walk',ex:[['Optional easy walk / stretch',1,'20 min easy',0]]},
 {k:'chest2',t:'Chest II',sub:'Chest & triceps · volume',ex:[['Incline Barbell Press',4,'10',75],['Flat DB Press',3,'12',60],['Cable Crossover',3,'15',45],['Diamond Push-ups',3,'AMRAP',45],['Bench Dips',3,'15',45],['Skull Crushers',3,'12',45],['Cardio Finisher',1,'20–25 min',0],['Cable Crunch',3,'15',45]]},
 {k:'back1',t:'Back',sub:'Back & biceps · cardio finisher',ex:[['Lat Pulldown / Pull-ups',4,'6–8',120],['Barbell Bent-over Row',3,'8–10',90],['Seated Cable Row',3,'10',75],['Single-arm DB Row',3,'10/side',60],['Barbell / EZ Curl',3,'10',60],['Hammer Curl',3,'12',45],['Preacher Curl',2,'12',45],['Cardio Finisher',1,'20–25 min',0],['Hanging Leg Raise',3,'12',45]]},
 {k:'shoulder2',t:'Shoulders II',sub:'Shoulders · volume',ex:[['Arnold Press',4,'10',75],['Cable Lateral Raise',3,'15',45],['Bent-over Rear Delt Fly',3,'15',45],['Face Pull',3,'15',45],['Cardio Finisher',1,'20–25 min',0],['Russian Twist',3,'20',30]]},
 {k:'rest2',t:'Recovery',sub:'Full recovery · optional light walk',ex:[['Optional easy walk / stretch',1,'20 min easy',0]]}
];
const today = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const cues = 'Use controlled reps, keep a stable position, and stop if you feel sharp pain. Record the load and reps you actually complete.';

export default function ForgeApp(){
 const [tab,setTab]=useState('Home');
 const [dayIndex,setDayIndex]=useState(0);
 const [photos,setPhotos]=useState(()=>read('forge_photos',{}));
 const [logs,setLogs]=useState(()=>read('forge_logs',{}));
 const [checkins,setCheckins]=useState(()=>read('forge_checkins',[]));
 const [food,setFood]=useState(()=>read('forge_food',[]));
 const [weight,setWeight]=useState(''); const [foodName,setFoodName]=useState(''); const [cal,setCal]=useState(''); const [protein,setProtein]=useState('');
 const [energy,setEnergy]=useState(''); const [trained,setTrained]=useState(''); const [musicUrl,setMusicUrl]=useState(''); const [playing,setPlaying]=useState(false);
 const audio=useRef(null); const photoInput=useRef(null); const audioInput=useRef(null);
 const day=DAYS[dayIndex]; const date=today();
 useEffect(()=>localStorage.setItem('forge_photos',JSON.stringify(photos)),[photos]);
 useEffect(()=>localStorage.setItem('forge_logs',JSON.stringify(logs)),[logs]);
 useEffect(()=>localStorage.setItem('forge_checkins',JSON.stringify(checkins)),[checkins]);
 useEffect(()=>localStorage.setItem('forge_food',JSON.stringify(food)),[food]);
 const currentPhotos=photos[day.k]||[];
 const allSets=day.ex.reduce((s,e)=>s+e[1],0); const completed=day.ex.reduce((s,e,i)=>s+(logs[`${day.k}-${i}`]||[]).filter(x=>x.done).length,0);
 const latest=checkins.filter(x=>x.weight).slice(-1)[0]?.weight;
 const todayFood=food.filter(x=>x.date===date); const totals=todayFood.reduce((a,x)=>({cal:a.cal+Number(x.cal||0),protein:a.protein+Number(x.protein||0)}),{cal:0,protein:0});
 const trend=useMemo(()=>checkins.filter(x=>x.weight).slice(-7),[checkins]);
 const addPhotos=e=>{const files=[...e.target.files]; files.forEach(file=>{const r=new FileReader();r.onload=()=>setPhotos(p=>({...p,[day.k]:[...(p[day.k]||[]),r.result]}));r.readAsDataURL(file)});e.target.value='';};
 const updateSet=(key,idx,field,value)=>setLogs(old=>{const arr=[...(old[key]||[])];arr[idx]={...(arr[idx]||{}),[field]:value};return {...old,[key]:arr}});
 const addCheckin=()=>{if(!weight&&!energy&&!trained)return;setCheckins(old=>[...old.filter(x=>x.date!==date),{date,weight:weight?Number(weight):null,energy:energy?Number(energy):null,trained}].sort((a,b)=>a.date.localeCompare(b.date)));setWeight('');setEnergy('');setTrained('');};
 const addFood=()=>{if(!foodName.trim())return;setFood(old=>[...old,{id:Date.now(),date,name:foodName,cal:Number(cal)||0,protein:Number(protein)||0}]);setFoodName('');setCal('');setProtein('');};
 const exportData=()=>{const blob=new Blob([JSON.stringify({photos,logs,checkins,food},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='forge-backup.json';a.click();URL.revokeObjectURL(a.href)};
 const chooseAudio=e=>{const f=e.target.files?.[0];if(!f)return;const url=URL.createObjectURL(f);setMusicUrl(url);if(audio.current){audio.current.src=url;audio.current.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false));}};
 const toggleMusic=()=>{if(!audio.current)return;if(playing){audio.current.pause();setPlaying(false)}else audio.current.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false))};
 return <div className="forge">
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap');`}</style>
  <div className="cinema" style={{backgroundImage:currentPhotos.length?`url(${currentPhotos[0]})`:undefined}} />
  <div className="shade" />
  <header className="top"><div className="brand">F<span>O</span>RGE</div><div className="micro">YOUR TRAINING LOG · 8-DAY CYCLE</div></header>
  <nav className="nav">{['Home','Train','Nutrition','Progress','Profile'].map(t=><button className={tab===t?'selected':''} onClick={()=>setTab(t)} key={t}>{t}</button>)}</nav>
  {tab==='Home'&&<main className="home">
   <div className="heroCopy"><div className="eyebrow">DAY {String(dayIndex+1).padStart(2,'0')} / 08 · {date}</div><h1>{day.t.toUpperCase()}<br/><i>DAY</i></h1><p>{day.sub}</p><div className="heroActions"><button className="gold" onClick={()=>setTab('Train')}>ENTER SESSION ↗</button><button className="glass" onClick={()=>photoInput.current?.click()}>＋ ADD YOUR PHOTOS</button></div></div>
   <div className="heroBottom"><div><small>TODAY'S SESSION</small><strong>{completed}/{allSets} SETS</strong><div className="progressLine"><span style={{width:`${allSets?completed/allSets*100:0}%`}}/></div></div><div className="daySwitch"><button onClick={()=>setDayIndex(i=>(i+7)%8)}>‹</button><span>{dayIndex+1} / 8</span><button onClick={()=>setDayIndex(i=>(i+1)%8)}>›</button></div></div>
   {currentPhotos.length>0&&<div className="photoDots">{currentPhotos.length} cinematic frame{currentPhotos.length===1?'':'s'} · first frame shown</div>}
  </main>}
  {tab==='Train'&&<main className="content"><div className="sectionHead"><div className="eyebrow">THE WORK</div><h2>{day.t} <span>SESSION</span></h2><p>{day.sub}</p><div className="cycle">{DAYS.map((d,i)=><button key={d.k} className={i===dayIndex?'on':''} onClick={()=>setDayIndex(i)}>{i+1}</button>)}</div></div>
   {day.ex.map((e,i)=>{const key=`${day.k}-${i}`;const arr=logs[key]||[];return <section className="exercise" key={key}><div className="exTitle"><div><small>EXERCISE {String(i+1).padStart(2,'0')}</small><h3>{e[0]}</h3><p>{e[1]} sets · {e[2]} reps · {e[3]?`${e[3]}s rest`:'no rest'}</p></div><span className="badge">{arr.filter(x=>x?.done).length}/{e[1]}</span></div><div className="setHead"><span>SET</span><span>KG</span><span>REPS</span><span>DONE</span></div>{Array.from({length:e[1]},(_,s)=><div className="setRow" key={s}><b>{s+1}</b><input aria-label="Weight kg" type="number" placeholder="—" value={arr[s]?.kg??''} onChange={ev=>updateSet(key,s,'kg',ev.target.value)}/><input aria-label="Reps" type="number" placeholder="—" value={arr[s]?.reps??''} onChange={ev=>updateSet(key,s,'reps',ev.target.value)}/><input aria-label="Set complete" type="checkbox" checked={!!arr[s]?.done} onChange={ev=>updateSet(key,s,'done',ev.target.checked)}/></div>)}<div className="cue">FORM NOTE · {cues}</div></section>})}
  </main>}
  {tab==='Nutrition'&&<main className="content"><div className="eyebrow">FUEL WITH INTENTION</div><h2>NUTRITION <span>LOG</span></h2><div className="macroGrid"><div><small>CALORIES</small><b>{totals.cal}</b><em>kcal logged today</em></div><div><small>PROTEIN</small><b>{totals.protein}g</b><em>logged today</em></div></div><section className="panel"><h3>ADD FOOD</h3><input value={foodName} onChange={e=>setFoodName(e.target.value)} placeholder="Food / meal"/><div className="two"><input type="number" value={cal} onChange={e=>setCal(e.target.value)} placeholder="Calories"/><input type="number" value={protein} onChange={e=>setProtein(e.target.value)} placeholder="Protein (g)"/></div><button className="gold full" onClick={addFood}>ADD TO TODAY</button></section><h3 className="subheading">TODAY'S INTAKE</h3>{todayFood.length===0?<p className="muted">No food logged yet. Add meals above.</p>:todayFood.map(x=><div className="foodRow" key={x.id}><div><b>{x.name}</b><small>{x.cal} kcal · {x.protein}g protein</small></div><button onClick={()=>setFood(f=>f.filter(y=>y.id!==x.id))}>×</button></div>)}</main>}
  {tab==='Progress'&&<main className="content"><div className="eyebrow">THE LONG GAME</div><h2>PROGRESS <span>REPORT</span></h2><section className="macroGrid"><div><small>LATEST WEIGHT</small><b>{latest?`${latest}kg`:'—'}</b><em>Goal: {GOAL_KG} kg</em></div><div><small>TO GO</small><b>{latest?`${Math.max(0,latest-GOAL_KG).toFixed(1)}kg`:'—'}</b><em>based on latest log</em></div></section><section className="panel"><h3>WEIGH-IN</h3><div className="two"><input type="number" step="0.1" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="Weight in kg"/><button className="gold" onClick={()=>{if(weight){setCheckins(c=>[...c.filter(x=>x.date!==date),{...(c.find(x=>x.date===date)||{}),date,weight:Number(weight)}]);setWeight('')}}}>SAVE</button></div><div className="trend">{trend.map(x=><div key={x.date}><span>{x.date.slice(5)}</span><b>{x.weight}kg</b></div>)}</div></section><section className="panel"><h3>DAILY CHECK-IN</h3><label>Training status</label><select value={trained} onChange={e=>setTrained(e.target.value)}><option value="">Choose status</option><option>Completed</option><option>Rest day</option><option>Skipped</option></select><label>Energy (1–5)</label><select value={energy} onChange={e=>setEnergy(e.target.value)}><option value="">Choose</option>{[1,2,3,4,5].map(n=><option key={n}>{n}</option>)}</select><button className="gold full" onClick={addCheckin}>SAVE CHECK-IN</button></section></main>}
  {tab==='Profile'&&<main className="content"><div className="eyebrow">MAKE IT YOURS</div><h2>YOUR <span>SETUP</span></h2><section className="panel"><h3>CINEMATIC PHOTO WALL</h3><p className="muted">Choose photos for each training day. They fill the entire screen behind the overlay. Portrait photos work especially well; your browser stores them on this device.</p><label>Assign photos to</label><select value={dayIndex} onChange={e=>setDayIndex(Number(e.target.value))}>{DAYS.map((d,i)=><option value={i} key={d.k}>{d.t} · Day {i+1}</option>)}</select><button className="gold full" onClick={()=>photoInput.current?.click()}>＋ UPLOAD PHOTOS</button><div className="thumbs">{(photos[day.k]||[]).map((src,i)=><div key={i}><img src={src}/><button onClick={()=>setPhotos(p=>({...p,[day.k]:p[day.k].filter((_,j)=>j!==i)}))}>REMOVE</button></div>)}</div></section><section className="panel"><h3>SOUNDTRACK</h3><p className="muted">Add an audio file you own or have permission to use. Playback starts only after you press play; phones may block autoplay.</p><button className="glass full" onClick={()=>audioInput.current?.click()}>CHOOSE AUDIO FILE</button><button className="gold full" disabled={!musicUrl} onClick={toggleMusic}>{playing?'Ⅱ PAUSE SOUNDTRACK':'▶ PLAY SOUNDTRACK'}</button></section><section className="panel"><h3>BACKUP</h3><p className="muted">Export your logs and photo data as a backup JSON.</p><button className="glass full" onClick={exportData}>EXPORT MY DATA</button></section></main>}
  <input ref={photoInput} type="file" accept="image/*" multiple hidden onChange={addPhotos}/><input ref={audioInput} type="file" accept="audio/*" hidden onChange={chooseAudio}/><audio ref={audio} loop />
  <footer><span>FORGE / BUILD YOURSELF</span><span>LOCAL · PRIVATE</span></footer>
 </div>
}
