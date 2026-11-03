# Konu 9 / 1.2.1 için şekiller (SVG). Metinler özgündür; kaynaklar yalnızca başvuru içindir.

def model(ad, govde, w=150, h=150):
    return f'<svg viewBox="0 0 {w} {h}" class="ka-svg" role="img" aria-label="{ad}">{govde}</svg>'

DALTON = model('Dalton atom modeli', '''
<defs><radialGradient id="dg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#cfd6e6"/><stop offset="1" stop-color="#5d6b8a"/></radialGradient></defs>
<circle cx="75" cy="75" r="55" fill="url(#dg)"/>''')

THOMSON = model('Thomson atom modeli', '''
<defs><radialGradient id="tg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffd3c2"/><stop offset="1" stop-color="#f08a65"/></radialGradient></defs>
<circle cx="75" cy="75" r="58" fill="url(#tg)"/>
<g fill="#2b3a67" font-family="Arial" font-size="15" font-weight="700" text-anchor="middle">
<circle cx="52" cy="50" r="9"/><circle cx="96" cy="44" r="9"/><circle cx="74" cy="78" r="9"/><circle cx="46" cy="98" r="9"/><circle cx="102" cy="96" r="9"/><circle cx="76" cy="116" r="9"/></g>
<g fill="#fff" font-family="Arial" font-size="14" font-weight="700" text-anchor="middle">
<text x="52" y="55">−</text><text x="96" y="49">−</text><text x="74" y="83">−</text><text x="46" y="103">−</text><text x="102" y="101">−</text><text x="76" y="121">−</text></g>
<g fill="#b3401b" font-family="Arial" font-size="14" font-weight="700"><text x="68" y="40">+</text><text x="34" y="78">+</text><text x="110" y="70">+</text><text x="90" y="128">+</text><text x="58" y="122">+</text></g>''')

RUTHERFORD = model('Rutherford atom modeli', '''
<g fill="none" stroke="#7a86b8" stroke-width="1.6" stroke-dasharray="3 4">
<ellipse cx="75" cy="75" rx="62" ry="24" transform="rotate(25 75 75)"/>
<ellipse cx="75" cy="75" rx="62" ry="24" transform="rotate(-35 75 75)"/>
<ellipse cx="75" cy="75" rx="62" ry="24" transform="rotate(85 75 75)"/></g>
<circle cx="75" cy="75" r="9" fill="#e5484d"/><text x="75" y="80" fill="#fff" font-family="Arial" font-size="12" font-weight="700" text-anchor="middle">+</text>
<circle cx="128" cy="98" r="6" fill="#2b6cf0"/><circle cx="40" cy="38" r="6" fill="#2b6cf0"/><circle cx="62" cy="134" r="6" fill="#2b6cf0"/>''')

BOHR = model('Bohr atom modeli', '''
<g fill="none" stroke="#7a86b8" stroke-width="1.6"><circle cx="75" cy="75" r="26"/><circle cx="75" cy="75" r="44"/><circle cx="75" cy="75" r="62"/></g>
<circle cx="75" cy="75" r="10" fill="#e5484d"/>
<circle cx="101" cy="75" r="6" fill="#2b6cf0"/><circle cx="44" cy="44" r="6" fill="#2b6cf0"/><circle cx="75" cy="137" r="6" fill="#2b6cf0"/>
<g font-family="Arial" font-size="11" fill="#4a5480" font-weight="700"><text x="96" y="58">K</text><text x="112" y="40">L</text><text x="126" y="24">M</text></g>''')

MODERN = model('Modern atom modeli', '''
<defs><radialGradient id="mg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#6f8cff" stop-opacity=".95"/><stop offset=".55" stop-color="#9fb2ff" stop-opacity=".45"/><stop offset="1" stop-color="#c9d4ff" stop-opacity="0"/></radialGradient></defs>
<circle cx="75" cy="75" r="66" fill="url(#mg)"/>
<g fill="#2b3a9e">''' + ''.join(f'<circle cx="{75+x}" cy="{75+y}" r="1.6"/>' for x, y in [(-30,-12),(22,-30),(35,18),(-18,32),(8,-48),(-44,8),(46,-8),(-8,12),(14,26),(-26,-36),(30,42),(-40,-20),(4,-18),(-14,-6),(52,26),(-52,30),(18,4),(-4,44)]) + '''</g>
<circle cx="75" cy="75" r="7" fill="#e5484d"/>''')

ZAMAN_SERIDI = '''
<figure class="ka-fig ka-zaman">
<div class="ka-zaman-serit">
''' + ''.join(f'''<div class="ka-zaman-adim"><div class="ka-zaman-model">{svg}</div><b>{ad}</b><span>{yil}</span><small>{ozet}</small></div>''' for svg, ad, yil, ozet in [
    (DALTON, 'Dalton', '1803', 'İçi dolu, bölünemez küre'),
    (THOMSON, 'Thomson', '1897', 'Elektronlar (+) kürenin içinde'),
    (RUTHERFORD, 'Rutherford', '1911', 'Küçük, (+) yüklü çekirdek; çevresi boşluk'),
    (BOHR, 'Bohr', '1913', 'Elektronlar belirli enerji katmanlarında'),
    (MODERN, 'Modern', '1926', 'Elektron bulutu: orbital'),
]) + '''
</div>
<figcaption>Atom modelleri, yeni deney sonuçları geldikçe değişti.</figcaption>
</figure>'''

GOSTERIM = '''
<figure class="ka-fig">
<svg viewBox="0 0 520 190" class="ka-svg ka-genis" role="img" aria-label="Atom gösterimi">
<rect x="170" y="30" width="180" height="130" rx="18" fill="#f3f1ff" stroke="#6d4dff" stroke-width="3"/>
<text x="262" y="128" font-family="Arial" font-size="84" font-weight="800" fill="#2b1f7a" text-anchor="middle">Na</text>
<text x="196" y="72" font-family="Arial" font-size="34" font-weight="800" fill="#e5484d" text-anchor="middle">23</text>
<text x="196" y="150" font-family="Arial" font-size="34" font-weight="800" fill="#2b6cf0" text-anchor="middle">11</text>
<path d="M150 62 H30" stroke="#e5484d" stroke-width="3" marker-end="url(#ok1)"/>
<path d="M150 140 H30" stroke="#2b6cf0" stroke-width="3" marker-end="url(#ok2)"/>
<defs><marker id="ok1" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#e5484d"/></marker>
<marker id="ok2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2b6cf0"/></marker></defs>
<text x="20" y="50" font-family="Arial" font-size="16" font-weight="700" fill="#e5484d">Kütle numarası (A)</text>
<text x="20" y="128" font-family="Arial" font-size="16" font-weight="700" fill="#2b6cf0">Atom numarası (Z)</text>
<text x="370" y="70" font-family="Arial" font-size="17" fill="#333">p = Z = <tspan font-weight="700">11</tspan></text>
<text x="370" y="100" font-family="Arial" font-size="17" fill="#333">n = A − Z = <tspan font-weight="700">12</tspan></text>
<text x="370" y="130" font-family="Arial" font-size="17" fill="#333">e = p = <tspan font-weight="700">11</tspan></text>
<text x="370" y="152" font-family="Arial" font-size="12" fill="#777">(nötr atomda)</text>
</svg>
<figcaption>Sodyum atomunun gösterimi: üstte kütle numarası, altta atom numarası.</figcaption>
</figure>'''

RUTHERFORD_DENEY = '''
<figure class="ka-fig">
<svg viewBox="0 0 560 260" class="ka-svg ka-genis" role="img" aria-label="Rutherford altın levha deneyi">
<defs><marker id="ra" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#e58a00"/></marker></defs>
<rect x="20" y="105" width="70" height="50" rx="8" fill="#5d6b8a"/><text x="55" y="135" font-family="Arial" font-size="12" fill="#fff" text-anchor="middle">α kaynağı</text>
<path d="M90 130 H240" stroke="#e58a00" stroke-width="5" marker-end="url(#ra)"/>
<rect x="248" y="40" width="10" height="180" fill="#f2c94c" stroke="#b8901a"/>
<text x="253" y="32" font-family="Arial" font-size="13" font-weight="700" fill="#8a6a0a" text-anchor="middle">Altın levha</text>
<path d="M440 40 A190 190 0 0 1 440 220" fill="none" stroke="#3aa17e" stroke-width="10" opacity=".6"/>
<text x="470" y="132" font-family="Arial" font-size="12" fill="#2a7a5e">ZnS</text><text x="470" y="147" font-family="Arial" font-size="12" fill="#2a7a5e">ekran</text>
<g stroke="#e58a00" stroke-width="2.5" fill="none" marker-end="url(#ra)">
<path d="M258 110 H420"/><path d="M258 125 H425"/><path d="M258 138 H425"/><path d="M258 150 H420"/>
<path d="M258 98 L410 72"/><path d="M258 162 L405 196"/>
<path d="M253 118 Q 200 100 150 70"/></g>
<g font-family="Arial" font-size="12" fill="#333">
<text x="300" y="104">çoğu sapmadan geçer</text>
<text x="330" y="68">azı sapar</text>
<text x="120" y="62">çok azı geri döner</text></g>
</svg>
<figcaption>Altın levha deneyi: Parçacıkların çoğu geçti, çok azı geri döndü.</figcaption>
</figure>'''

BOHR_ENERJI = '''
<figure class="ka-fig">
<svg viewBox="0 0 560 250" class="ka-svg ka-genis" role="img" aria-label="Absorbsiyon ve emisyon">
<defs><marker id="ba" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#2b6cf0"/></marker>
<marker id="be" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#e5484d"/></marker></defs>
<g font-family="Arial" font-size="13" fill="#333">
<g stroke="#9aa3c7" stroke-width="2"><path d="M60 200 H250"/><path d="M60 140 H250"/><path d="M60 95 H250"/><path d="M60 62 H250"/>
<path d="M310 200 H500"/><path d="M310 140 H500"/><path d="M310 95 H500"/><path d="M310 62 H500"/></g>
<text x="30" y="204">n=1</text><text x="30" y="144">n=2</text><text x="30" y="99">n=3</text><text x="30" y="66">n=4</text>
<text x="280" y="204">n=1</text><text x="280" y="144">n=2</text><text x="280" y="99">n=3</text><text x="280" y="66">n=4</text>
<circle cx="120" cy="200" r="7" fill="#2b6cf0" opacity=".35"/><circle cx="120" cy="95" r="7" fill="#2b6cf0"/>
<path d="M135 192 L135 108" stroke="#2b6cf0" stroke-width="4" marker-end="url(#ba)"/>
<text x="150" y="160" fill="#2b6cf0" font-weight="700">enerji alır</text>
<circle cx="380" cy="95" r="7" fill="#e5484d" opacity=".35"/><circle cx="380" cy="200" r="7" fill="#e5484d"/>
<path d="M395 103 L395 186" stroke="#e5484d" stroke-width="4" marker-end="url(#be)"/>
<path d="M420 150 q10 -10 20 0 t20 0 t20 0" stroke="#f2a33a" stroke-width="3" fill="none"/>
<text x="410" y="178" fill="#e5484d" font-weight="700">ışık yayar</text>
<text x="155" y="236" font-size="15" font-weight="700" text-anchor="middle" fill="#2b6cf0">Absorbsiyon (soğurma)</text>
<text x="405" y="236" font-size="15" font-weight="700" text-anchor="middle" fill="#e5484d">Emisyon (yayma)</text>
<text x="155" y="30" text-anchor="middle">Temel hâl → uyarılmış hâl</text>
<text x="405" y="30" text-anchor="middle">Uyarılmış hâl → temel hâl</text></g>
</svg>
<figcaption>Bohr modeli: Elektron enerji alınca üst katmana çıkar, inerken aradaki enerji farkını ışık olarak yayar.</figcaption>
</figure>'''

SPEKTRUM = '''
<figure class="ka-fig">
<svg viewBox="0 0 560 120" class="ka-svg ka-genis" role="img" aria-label="Hidrojen emisyon spektrumu">
<rect x="20" y="20" width="520" height="56" rx="6" fill="#111"/>
''' + ''.join(f'<rect x="{20 + (nm-380)/(750-380)*520:.0f}" y="20" width="5" height="56" fill="{c}"/><text x="{22 + (nm-380)/(750-380)*520:.0f}" y="96" font-family="Arial" font-size="12" fill="#333" text-anchor="middle">{nm}</text>' for nm, c in [(410,'#7d3cff'),(434,'#4b4bff'),(486,'#26c6da'),(656,'#ff3b30')]) + '''
<text x="280" y="114" font-family="Arial" font-size="12" fill="#666" text-anchor="middle">dalga boyu (nm)</text>
</svg>
<figcaption>Hidrojenin emisyon spektrumu: Sürekli bir renk şeridi yerine yalnızca belirli renkte çizgiler var. Bohr bunu "belirli enerji düzeyleri" ile açıkladı.</figcaption>
</figure>'''

IZOTOP = '''
<figure class="ka-fig">
<svg viewBox="0 0 540 170" class="ka-svg ka-genis" role="img" aria-label="Hidrojen izotopları">
''' + ''.join(f'''<g transform="translate({x} 0)">
<circle cx="80" cy="80" r="56" fill="none" stroke="#9aa3c7" stroke-width="2" stroke-dasharray="4 4"/>
<circle cx="{80 - 8*(n>0)}" cy="80" r="11" fill="#e5484d"/>
{''.join(f'<circle cx="{80 + 8 + 10*i}" cy="{80 + (i%2)*10 - 4}" r="11" fill="#9aa3c7"/>' for i in range(n))}
<circle cx="136" cy="80" r="6" fill="#2b6cf0"/>
<text x="80" y="160" font-family="Arial" font-size="15" font-weight="700" text-anchor="middle" fill="#2b1f7a">{ad}</text>
<text x="80" y="18" font-family="Arial" font-size="13" text-anchor="middle" fill="#555">1p · {n}n · 1e</text></g>''' for x, n, ad in [(0,0,'¹H (protiyum)'),(180,1,'²H (döteryum)'),(360,2,'³H (trityum)')]) + '''
</svg>
<figcaption>Hidrojenin izotopları: Proton sayıları aynı (1), nötron sayıları farklı.</figcaption>
</figure>'''

ORBITAL = '''
<figure class="ka-fig">
<svg viewBox="0 0 520 170" class="ka-svg ka-genis" role="img" aria-label="Bohr yörüngesi ile orbital karşılaştırması">
<defs><radialGradient id="og" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#6f8cff" stop-opacity=".9"/><stop offset=".6" stop-color="#9fb2ff" stop-opacity=".35"/><stop offset="1" stop-color="#c9d4ff" stop-opacity="0"/></radialGradient></defs>
<circle cx="130" cy="80" r="56" fill="none" stroke="#7a86b8" stroke-width="2.5"/><circle cx="130" cy="80" r="9" fill="#e5484d"/><circle cx="186" cy="80" r="6" fill="#2b6cf0"/>
<text x="130" y="160" font-family="Arial" font-size="14" font-weight="700" text-anchor="middle">Bohr: belirli bir çizgi (yörünge)</text>
<circle cx="390" cy="80" r="70" fill="url(#og)"/><circle cx="390" cy="80" r="9" fill="#e5484d"/>
<text x="390" y="160" font-family="Arial" font-size="14" font-weight="700" text-anchor="middle">Modern: olasılık bulutu (orbital)</text>
</svg>
<figcaption>Elektronun yeri ve hızı aynı anda kesin bilinemez (Heisenberg); bu yüzden "bulunma olasılığı yüksek bölge" kavramı kullanılır.</figcaption>
</figure>'''
