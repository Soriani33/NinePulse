const MAP={A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8};
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z]/g,'');
const sumDigits=n=>n.toString().split('').reduce((a,b)=>a+ +b,0);
function reduceNum(n,keep=true){while(n>9){if(keep&&(n===11||n===22||n===33))return n;n=sumDigits(n);}return n;}
const sumLetters=s=>[...normalize(s)].reduce((a,ch)=>a+MAP[ch],0);
const onlyV=s=>normalize(s).replace(/[^AEIOUY]/g,'');
const onlyC=s=>normalize(s).replace(/[AEIOUY]/g,'');
function lifePath(b,keep=true){const[y,m,d]=b.split('-').map(Number);return reduceNum(sumDigits(y)+sumDigits(m)+sumDigits(d),keep)}
function guideDigit(b){const[y,m,d]=b.split('-').map(Number);return reduceNum(sumDigits(y)+sumDigits(m)+sumDigits(d),false)}
function expressionNum(f,keep=true){return reduceNum(sumLetters(f),keep)}
function soulUrgeNum(f,keep=true){return reduceNum(sumLetters(onlyV(f)),keep)}
function personalityNum(f,keep=true){return reduceNum(sumLetters(onlyC(f)),keep)}
function maturityNum(b,f,keep=true){return reduceNum(lifePath(b,keep)+expressionNum(f,keep),keep)}
function personalYear(b, date=new Date()){
  const[y,m,d]=b.split('-').map(Number);
  const current=reduceNum(sumDigits(date.getFullYear()),false);
  return reduceNum(sumDigits(d)+sumDigits(m)+current,false);
}
function monthNumber(b,date=new Date()){
  const py=personalYear(b,date); const mRed=reduceNum(date.getMonth()+1,false);
  return reduceNum(py+mRed,false);
}
function dayNumber(b,date=new Date(),birthTime=null){
  const g=guideDigit(b);
  const d=reduceNum(date.getDate(),false);
  const m=reduceNum(date.getMonth()+1,false);
  let dn=reduceNum(d+m+g,false);
  if(birthTime){const[h]=birthTime.split(':').map(Number);if(!isNaN(h)&&h>=18)dn=((dn+8)%9)+1;}
  return dn;
}
const PLANET={1:"Soleil",2:"Lune",3:"Jupiter",4:"Saturne",5:"Mercure",6:"Vénus",7:"Neptune",8:"Saturne",9:"Mars"};
const COLOR={1:"Rouge",2:"Orange",3:"Jaune",4:"Vert",5:"Turquoise",6:"Bleu",7:"Violet/Rose/Fuchsia/Marroc/Beige",8:"Blanc/Pastel",9:"Noir"};
const DAY_TEXT={1:"Initier et décider avec simplicité.",2:"Écouter, collaborer et harmoniser.",3:"Exprimer, créer, partager.",4:"Structurer et poser des bases solides.",5:"Bouger, explorer, changer d’air.",6:"Soigner, embellir, relier.",7:"Lire, méditer, approfondir.",8:"Mesurer, cadrer, assumer.",9:"Accomplir, transmettre, donner."};
const DAY_LONG={
1:"Votre chiffre du jour est le 1. Une journée d'action et de but. Un nouveau départ est souhaitable à ce jour. Les questions juridiques, les partenariats formés, les affaires et les contrats peuvent être prometteurs dans cette période vibratoire. Mise en garde: Les choses se réaliseront que si elles sont simples à se mettre en place.",
2:"Votre chiffre du jour est le 2. Une journée d'équilibre, les décisions à peser et la planification. Cette période est avant tout d'harmoniser et de ne pas agir trop vite. Cette journée peut commencer avec des présages désastreux, mais se prolongera bien, et se terminera très bien.",
3:"Votre chiffre du jour est le 3. Une journée d'accomplissement. Vous trouverez la coopération là où vous en avez besoin en matière de nouveaux projets. Les problèmes sont rapidement mis à mal. C'est une bonne journée pour rencontrer des gens, les voyages et une journée d'amusements.",
4:"Votre chiffre du jour est le 4. Une journée de rattrapage pour les interrogations qui sont passées à la trappe. Traiter les questions de routine, et faire face aux tâches en conséquence. Cela peut sembler ennuyeux ou redondant, mais faire face à des questions pratiques sera la base pour assurer l'ordre et la stabilité dans votre avenir.",
5:"Votre chiffre du jour est le 5. Une journée d'attente et d'inattendu. C'est le joker des jours vibratoires. Évitez de prendre des risques inutiles car ils peuvent se retourner contre vous. Les projets de voyage et de nouvelles démarches ou envies peuvent être entrepris, mais ces décisions ne doivent être prises que si elles impliquent un but bien précis.",
6:"Votre chiffre du jour est le 6. Une journée pour les choses faciles, être à l'aise et le repos. Ce n'est pas une journée d'action, la précipitation, ce qui est rapide ou toute nouvelle entreprise. Éviter les contacts. C'est un jour de point culminant, pour se rassembler autour de la famille ou entre amis pour profiter du moment présent.",
7:"Votre chiffre du jour est le 7. Une journée de signification profonde, d'étude et de recherche. Méditer, et travailler sur des sujets artistiques. Développez votre créativité et vos capacités intuitives. C'est un jour psychiquement puissant: profitez-en. Vous pouvez jouer avec votre immagination en ce jour.",
8:"Votre chiffre du jour est le 8. Un jour de grands changements, de balayage, qui apporte de grands résultats. Il est maintenant temps de s'attaquer à des problèmes complexes et vaincre les difficultés. Le chiffre d'aujourd'hui promet une bonne journée pour les entreprises commerciales, financières, présageant l'ascencion et les fusions.",
9:"Votre chiffre du jour est le 9. Une journée pour annoncer des projets importants, et établir des contacts prometteurs. Cette journée promet réalisation dans la plupart des domaines de la vie. Croissance personnelle, le triomphe et le succès dans les compétitions sont à portée de main ce jour."
};
const DAY_NOTE="Le chiffre du jour peut vous guider. Il suffit de suivre l'intuition, la résonnance de cette journée et sur les possibilités que ce jour a en réserve pour vous. Attention ce chiffre vous est totalement personnel, car il est en vibration avec votre date de naissance et la journée présente, une autre personne aura donc un autre chiffre...";
const YEAR_TEXT={1:"Année d’amorçage et de cap clair.",2:"Année d’harmonie et de collaborations.",3:"Année d’expression créative et sociale.",4:"Année de structure et de constance utile.",5:"Année d’expériences et de changements maîtrisés.",6:"Année de beauté, responsabilités, maison.",7:"Année de recherche et d’intuition.",8:"Année d’ambition mesurée et de gestion.",9:"Année d’aboutissement, de partage et de transmission."};
function zodiacSign(b){
  const d=new Date(b+"T12:00:00"); const day=d.getUTCDate(), m=d.getUTCMonth()+1;
  const z=[["Capricorne",12,22,1,19],["Verseau",1,20,2,18],["Poissons",2,19,3,20],["Bélier",3,21,4,19],["Taureau",4,20,5,20],["Gémeaux",5,21,6,20],["Cancer",6,21,7,22],["Lion",7,23,8,22],["Vierge",8,23,9,22],["Balance",9,23,10,22],["Scorpion",10,23,11,21],["Sagittaire",11,22,12,21]];
  for(const[n,m1,d1,m2,d2]of z){if((m==m1&&day>=d1)||(m==m2&&day<=d2))return n;}return "—";
}
function approxAsc(t){
  if(!t)return "—"; const[h,mm]=t.split(':').map(Number); if(isNaN(h))return "—";
  const total=h+(mm||0)/60; const s=["Bélier","Taureau","Gémeaux","Cancer","Lion","Vierge","Balance","Scorpion","Sagittaire","Capricorne","Verseau","Poissons"];
  let idx=Math.floor(((total-6)/2)%12); if(idx<0)idx+=12; return s[idx];
}
function nameTableData(f){return [...normalize(f)].map(ch=>({ch,val:MAP[ch]||0}))}
function numberFrequencies(f){const r={1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};for(const ch of normalize(f)){const v=MAP[ch];if(v)r[v]++;}return r}
window.NCore={reduceNum,sumDigits,lifePath,guideDigit,expressionNum,soulUrgeNum,personalityNum,maturityNum,personalYear,monthNumber,dayNumber,PLANET,COLOR,DAY_TEXT,DAY_LONG,DAY_NOTE,YEAR_TEXT,zodiacSign,approxAsc,nameTableData,numberFrequencies};
