"""Prépare les sons de batterie de l'appli à partir de Virtuosity Drums (CC0).

Pour chaque frappe : somme des micros grosse caisse + caisse claire + paire
d'overheads (le mélange « basic kit » de la banque), passage en mono, début
recalé sur l'attaque, fin raccourcie avec un fondu, niveaux équilibrés comme
dans un mixage (grosse caisse et caisse claire devant, cymbales en retrait),
puis encodage MP3 mono. Produit js/sons.js (données base64).

Utilisation :
    git clone --depth 1 https://github.com/sfzinstruments/virtuosity_drums
    pip install soundfile lameenc numpy scipy
    python outils/preparer_sons.py chemin/vers/virtuosity_drums
"""
import base64, json, os, sys
import numpy as np, soundfile as sf, lameenc
from scipy.signal import resample_poly

SRC = os.path.join(sys.argv[1] if len(sys.argv) > 1 else 'virtuosity_drums', 'Samples')
SORTIE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'js', 'sons.js')
SR = 44100
MICS = ['kickmic', 'snaremic', 'oh']

# instrument de l'appli : (dossier, [(fichier, couche)], durée max s, couche de référence, niveau visé dB, débit kb/s)
# Le niveau visé est celui de la couche de référence (la frappe « normale ») : il fixe
# l'équilibre du mélange — grosse caisse et caisse claire devant, cymbales en retrait.
KIT = {
  'GC':  ('kick',  [('kick_snon_vl2_rr1','doux'), ('kick_snon_vl3_rr1','moyen'), ('kick_snon_vl3_rr2','moyen'),
                    ('kick_snon_vl4_rr1','fort'), ('kick_snon_vl4_rr2','fort')], 0.75, 'fort', -12, 96),
  'CC':  ('snare', [('snare_center_vl10','ghost'), ('snare_center_vl13','ghost'), ('snare_center_vl28','moyen'),
                    ('snare_center_vl30','moyen'), ('snare_center_vl32','moyen'), ('snare_center_vl35','fort'),
                    ('snare_center_vl36','fort'), ('snare_flam_vl9','flam'), ('snare_flam_vl11','flam')], 0.85, 'moyen', -13, 112),
  'T1':  ('htom',  [('htom_center_vl8','doux'), ('htom_center_vl13','moyen'), ('htom_center_vl16','fort')], 1.3, 'moyen', -14, 96),
  'TB':  ('ltom',  [('ltom_center_vl8','doux'), ('ltom_center_vl13','moyen'), ('ltom_center_vl16','fort')], 1.6, 'moyen', -14, 96),
  'CH':  ('hh',    [('hh_closed_vl2_rr1','ghost'), ('hh_closed_vl2_rr2','ghost'), ('hh_closed_vl3_rr1','moyen'),
                    ('hh_closed_vl3_rr2','moyen'), ('hh_closed_vl3_rr3','moyen'), ('hh_closed_vl4_rr1','fort'),
                    ('hh_closed_vl4_rr2','fort')], 0.4, 'moyen', -22, 112),
  'CHO': ('hh',    [('hh_open_vl3_rr1','moyen'), ('hh_open_vl4_rr1','fort')], 1.6, 'moyen', -21, 112),
  'HP':  ('hh',    [('hh_pedal_vl2_rr1','moyen'), ('hh_pedal_vl3_rr1','fort')], 0.45, 'fort', -24, 96),
  'RD':  ('ride',  [('ride_ride_vl2_rr1','doux'), ('ride_ride_vl3_rr1','moyen'), ('ride_ride_vl3_rr2','moyen')], 2.6, 'moyen', -22, 112),
  'CR':  ('crash', [('crash_crash_vl2_rr1','moyen'), ('crash_crash_vl3_rr1','fort')], 3.4, 'fort', -17, 112),
}

def charger(dossier, nom):
    pistes = []
    for mic in MICS:
        x, sr = sf.read(f'{SRC}/{mic}/{dossier}/{mic}_{nom}.flac', dtype='float64', always_2d=True)
        x = x.mean(axis=1)                       # stéréo → mono
        if sr != SR: x = resample_poly(x, SR, sr)
        pistes.append(x)
    n = max(len(p) for p in pistes)
    return sum(np.pad(p, (0, n - len(p))) for p in pistes)

def recaler(x):
    """Coupe juste avant l'attaque : la frappe tombe pile au début du son."""
    seuil = np.max(np.abs(x)) * 0.06
    i = int(np.argmax(np.abs(x) > seuil))
    return x[max(0, i - int(0.0015 * SR)):]

def couper(x, duree):
    n = min(len(x), int(duree * SR))
    x = x[:n].copy()
    f = min(int(0.08 * SR), n // 3)                # fondu de sortie (cosinus)
    x[-f:] *= 0.5 * (1 + np.cos(np.linspace(0, np.pi, f)))
    return x

def rms_court(x):
    return 20 * np.log10(np.sqrt(np.mean(x[:int(0.15 * SR)] ** 2)) + 1e-12)

def mp3(x, debit):
    enc = lameenc.Encoder()
    enc.set_bit_rate(debit); enc.set_in_sample_rate(SR); enc.set_channels(1); enc.set_quality(2)
    pcm = (np.clip(x, -1, 1) * 32767).astype('<i2').tobytes()
    return enc.encode(pcm) + enc.flush()

sortie, rapport, total = {}, [], 0
SONS_BRUTS = {}
for inst, (dossier, frappes, duree, ref, cible, debit) in KIT.items():
    sons = [(cle, couper(recaler(charger(dossier, nom)), duree), nom) for nom, cle in frappes]
    # 1) un seul facteur par élément, pour que la frappe la plus forte culmine à -1 dBFS :
    #    les couches douces gardent leur écart naturel avec les fortes
    k = 0.89 / max(np.max(np.abs(x)) for _, x, _ in sons)
    sons = [(cle, x * k, nom) for cle, x, nom in sons]
    SONS_BRUTS[inst] = sons
    # 2) gain de lecture appliqué dans l'appli pour atteindre le niveau visé
    niv_ref = np.mean([rms_court(x) for cle, x, _ in sons if cle == ref])
    gain_lecture = round(10 ** ((cible - niv_ref) / 20), 3)
    sortie[inst] = { 'gain': gain_lecture, 'sons': [] }
    for cle, x, nom in sons:
        donnees = mp3(x, debit)
        total += len(donnees)
        sortie[inst]['sons'].append({ 'couche': cle, 'mp3': base64.b64encode(donnees).decode() })
        rapport.append(f'{inst:4} {cle:6} {nom:22} {len(x)/SR:4.2f} s  à la lecture {rms_court(x) + 20*np.log10(gain_lecture):6.1f} dB  {len(donnees)/1024:5.1f} Ko')

# 3) calage global : même équilibre, mais la frappe normale la plus « pointue » du kit
#    (en pratique la caisse claire) culmine à -1 dBFS ; seuls les accents passent
#    au-dessus et sont tenus par le limiteur de l'appli.
pics = {}
for inst, (dossier, frappes, duree, ref, cible, debit) in KIT.items():
    pics[inst] = max(np.max(np.abs(x)) for cle, x, _ in SONS_BRUTS[inst] if cle == ref) * sortie[inst]['gain']
calage = 0.89 / max(pics.values())
for inst in sortie: sortie[inst]['gain'] = round(sortie[inst]['gain'] * calage, 3)
print(f'calage global : {20*np.log10(calage):+.1f} dB (élément le plus pointu : {max(pics, key=pics.get)})')
for inst in sortie:
    print(f'  {inst:4} gain {sortie[inst]["gain"]:5.2f}   pic de la frappe normale {20*np.log10(pics[inst]*calage):6.1f} dBFS')

with open(SORTIE, 'w') as f:
    f.write('/* Sons de batterie acoustique — générés par preparer_sons.py, ne pas modifier à la main.\n')
    f.write(' * Source : Virtuosity Drums, Versilian Studios — licence CC0 1.0 (domaine public)\n')
    f.write(' * https://github.com/sfzinstruments/virtuosity_drums\n')
    f.write(' * Mélange des micros grosse caisse + caisse claire + overheads, en mono, MP3. */\n')
    f.write('export const SONS = ' + json.dumps(sortie, separators=(',', ':')) + ';\n')

print('\n'.join(rapport))
print(f'\nTOTAL : {len(rapport)} sons, {total/1024:.0f} Ko en MP3, {total*4/3/1024:.0f} Ko une fois intégrés')
