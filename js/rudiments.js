/* Rudiments : les « gammes » de la batterie, d'après la liste des 40 rudiments
 * internationaux de la Percussive Arts Society (roulements, diddles, flams, drags).
 * D = main droite, G = main gauche. Tout se joue à la caisse claire.
 */

const rud = (o) => ({ beats:4, bars:1, style:'Rudiment', bpm:[40,60,160], ...o });

export const FAMILLES_RUDIMENTS = [
  { id:'roulements', nom:'Roulements' },
  { id:'diddles',    nom:'Diddles (paradiddles)' },
  { id:'flams',      nom:'Flams' },
  { id:'drags',      nom:'Drags' }
];

export const RUDIMENTS = [
/* ---- roulements ---- */
rud({ id:'r-simple', famille:'roulements', niveau:1, nom:'Roulement simple', res:4,
  tracks:{ CC:'XxxxXxxxXxxxXxxx' }, doigte:'DGDGDGDGDGDGDGDG',
  desc:"Mains alternées, régulières. Le rudiment n°1 : tout le reste en découle.",
  astuce:"Les deux mains doivent sonner pareil. Enregistre-toi : on entend tout de suite la main faible." }),
rud({ id:'r-quatre-simples', famille:'roulements', niveau:2, nom:'Quatre coups simples', res:3,
  tracks:{ CC:'xxxX--xxxX--' }, doigte:'DGDG--GDGD--',
  desc:"Trois notes en triolet puis une accentuée sur le temps suivant, en alternant la main de départ.",
  astuce:"Le 4e coup est accentué et tombe pile sur le temps : ne le précipite pas." }),
rud({ id:'r-double', famille:'roulements', niveau:2, nom:'Roulement double (« moulin »)', res:4,
  tracks:{ CC:'XxxxXxxxXxxxXxxx' }, doigte:'DDGGDDGGDDGGDDGG',
  desc:"Deux coups par main. Accéléré, il devient le roulement « papa-mama » continu.",
  astuce:"Le 2e coup vient du rebond de la baguette, pas d'un nouveau geste du bras." }),
rud({ id:'r-cinq', famille:'roulements', niveau:3, nom:'Roulement de 5', res:4,
  tracks:{ CC:'xxxxX---xxxxX---' }, doigte:'DDGGD---GGDDG---',
  desc:"Deux doubles puis un coup accentué. Très utilisé pour lancer un break.",
  astuce:"L'accent final est la note importante : les doubles le préparent sans bruit." }),
rud({ id:'r-six', famille:'roulements', niveau:4, nom:'Roulement de 6', res:4,
  tracks:{ CC:'XxxxxX--XxxxxX--' }, doigte:'DGGDDG--DGGDDG--',
  desc:"Un accent, deux doubles, un accent. La base de nombreux fills modernes.",
  astuce:"Joue les accents sur les toms et les doubles sur la caisse claire : instantanément un fill." }),
rud({ id:'r-sept', famille:'roulements', niveau:4, nom:'Roulement de 7', res:4,
  tracks:{ CC:'xxxxxxX-xxxxxxX-' }, doigte:'GGDDGGD-DDGGDDG-',
  desc:"Trois doubles qui débouchent sur un accent.",
  astuce:"Commence sur la main gauche : c'est la difficulté du rudiment." }),
rud({ id:'r-neuf', famille:'roulements', niveau:4, nom:'Roulement de 9', res:4,
  tracks:{ CC:'xxxxxxxxX-------' }, doigte:'DDGGDDGGD-------',
  desc:"Quatre doubles puis l'accent : deux temps de roulement fermé.",
  astuce:"Garde les doubles bien égaux, comme un roulement de tambour militaire." }),
rud({ id:'r-sept-simples', famille:'roulements', niveau:5, nom:'Sept coups simples (sextolets)', res:6,
  tracks:{ CC:'xxxxxxX-----xxxxxxX-----' }, doigte:'DGDGDGD-----GDGDGDG-----',
  desc:"Six doubles-croches en triolet puis un accent : une rafale très rapide.",
  astuce:"Écrit en sextolets (6 notes par temps) : pense « 1-2-3-4-5-6 PAM »." }),

/* ---- diddles ---- */
rud({ id:'r-paradiddle', famille:'diddles', niveau:2, nom:'Paradiddle simple', res:4,
  tracks:{ CC:'XxxxXxxxXxxxXxxx' }, doigte:'DGDDGDGGDGDDGDGG',
  desc:"D-G-D-D / G-D-G-G : le rudiment le plus utile de la batterie.",
  astuce:"Accentue seulement la 1re note de chaque groupe. Ensuite, joue les D au charleston : c'est un groove." }),
rud({ id:'r-double-paradiddle', famille:'diddles', niveau:3, nom:'Double paradiddle', res:3,
  tracks:{ CC:'XxxxxxXxxxxx' }, doigte:'DGDGDDGDGDGG',
  desc:"Six notes : D-G-D-G-D-D, puis l'inverse. Tombe naturellement en triolets.",
  astuce:"Compte « 1-la-li 2-la-li » : chaque groupe de six couvre deux temps." }),
rud({ id:'r-triple-paradiddle', famille:'diddles', niveau:4, nom:'Triple paradiddle', res:4,
  tracks:{ CC:'XxxxxxxxXxxxxxxx' }, doigte:'DGDGDGDDGDGDGDGG',
  desc:"Huit notes : trois alternances puis un double. Change de main à chaque demi-mesure.",
  astuce:"Très bon pour les fills sur deux temps." }),
rud({ id:'r-paradiddle-diddle', famille:'diddles', niveau:3, nom:'Paradiddle-diddle', res:3,
  tracks:{ CC:'XxxxxxXxxxxx' }, doigte:'DGDDGGDGDDGG',
  desc:"D-G-D-D-G-G : ne change jamais de main de départ. Idéal en triolets et en 6/8.",
  astuce:"Joue les D sur un tom et les G sur la caisse claire : effet garanti." }),

/* ---- flams ---- */
rud({ id:'r-flam', famille:'flams', niveau:2, nom:'Flam', res:2,
  tracks:{ CC:'f-f-f-f-' }, doigte:'D-G-D-G-',
  desc:"Une petite note d'agrément juste avant la note principale, par l'autre main.",
  astuce:"Main de la note principale haute, main d'agrément très basse : elles partent ensemble mais n'arrivent pas en même temps." }),
rud({ id:'r-flam-accent', famille:'flams', niveau:3, nom:'Flam accent', res:3,
  tracks:{ CC:'fxxfxxfxxfxx' }, doigte:'DGDGDGDGDGDG',
  desc:"Un flam puis deux notes simples, en triolets : la main du flam alterne à chaque temps.",
  astuce:"Parfait pour les shuffles et le 6/8." }),
rud({ id:'r-flam-tap', famille:'flams', niveau:3, nom:'Flam tap', res:4,
  tracks:{ CC:'fxfxfxfxfxfxfxfx' }, doigte:'DDGGDDGGDDGGDDGG',
  desc:"Un flam puis une note de la même main, en doubles-croches.",
  astuce:"C'est un roulement double avec une note d'agrément devant chaque paire." }),
rud({ id:'r-flamacue', famille:'flams', niveau:4, nom:'Flamacue', res:4,
  tracks:{ CC:'fXxxf---fXxxf---' }, doigte:'DGDGD---GDGDG---',
  desc:"Flam, accent sur la 2e note, deux notes, puis un flam sur le temps.",
  astuce:"L'accent n'est PAS sur le flam mais juste après : c'est tout le piège." }),
rud({ id:'r-flam-paradiddle', famille:'flams', niveau:4, nom:'Flam paradiddle', res:4,
  tracks:{ CC:'fxxxfxxxfxxxfxxx' }, doigte:'DGDDGDGGDGDDGDGG',
  desc:"Un paradiddle avec un flam sur la première note de chaque groupe.",
  astuce:"Maîtrise d'abord le paradiddle à 90 BPM avant d'ajouter les flams." }),
rud({ id:'r-swiss', famille:'flams', niveau:4, nom:'Triolet suisse (Swiss army)', res:3,
  tracks:{ CC:'fxxfxxfxxfxx' }, doigte:'DDGDDGDDGDDG',
  desc:"Flam, même main, autre main : un triolet qui ne change pas de main de départ.",
  astuce:"Sonne comme un flam accent, mais se joue D-D-G : beaucoup plus facile à grande vitesse." }),

/* ---- drags ---- */
rud({ id:'r-drag', famille:'drags', niveau:3, nom:'Drag', res:2,
  tracks:{ CC:'d-d-d-d-' }, doigte:'D-G-D-G-',
  desc:"Deux notes d'agrément rebondies (même main) avant la note principale.",
  astuce:"Les deux petites notes sont un seul geste rebondi, très près de la peau." }),
rud({ id:'r-drag-tap', famille:'drags', niveau:4, nom:'Drag tap simple', res:2,
  tracks:{ CC:'dxdxdxdx' }, doigte:'DGGDDGGD',
  desc:"Un drag puis une note simple de l'autre main.",
  astuce:"Garde les notes principales parfaitement en croches, les drags viennent se glisser devant." }),
rud({ id:'r-ratamacue', famille:'drags', niveau:5, nom:'Ratamacue simple', res:3,
  tracks:{ CC:'dxxX--dxxX--' }, doigte:'DGDG--GDGD--',
  desc:"Un drag sur un triolet, puis un accent sur le temps suivant : « ra-ta-ma-CUE ».",
  astuce:"Le rythme est celui des « quatre coups simples », avec un drag en plus." })
];
