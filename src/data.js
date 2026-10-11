/* ── Ciudades: nombre|país|lat|lon|zona ─────────────────────────────── */
const CITY_DATA = `Madrid|España|40.4168|-3.7038|Europe/Madrid
Barcelona|España|41.3874|2.1686|Europe/Madrid
Valencia|España|39.4699|-0.3763|Europe/Madrid
Sevilla|España|37.3891|-5.9845|Europe/Madrid
Zaragoza|España|41.6488|-0.8891|Europe/Madrid
Málaga|España|36.7213|-4.4214|Europe/Madrid
Murcia|España|37.9922|-1.1307|Europe/Madrid
Palma|España|39.5696|2.6502|Europe/Madrid
Bilbao|España|43.2630|-2.9350|Europe/Madrid
Alicante|España|38.3452|-0.4810|Europe/Madrid
Córdoba|España|37.8882|-4.7794|Europe/Madrid
Valladolid|España|41.6523|-4.7245|Europe/Madrid
Vigo|España|42.2406|-8.7207|Europe/Madrid
Gijón|España|43.5322|-5.6611|Europe/Madrid
A Coruña|España|43.3623|-8.4115|Europe/Madrid
Granada|España|37.1773|-3.5986|Europe/Madrid
Oviedo|España|43.3619|-5.8494|Europe/Madrid
Pamplona|España|42.8125|-1.6458|Europe/Madrid
San Sebastián|España|43.3183|-1.9812|Europe/Madrid
Santander|España|43.4623|-3.8100|Europe/Madrid
Salamanca|España|40.9701|-5.6635|Europe/Madrid
Toledo|España|39.8628|-4.0273|Europe/Madrid
Cádiz|España|36.5271|-6.2886|Europe/Madrid
Almería|España|36.8340|-2.4637|Europe/Madrid
Badajoz|España|38.8794|-6.9707|Europe/Madrid
León|España|42.5987|-5.5671|Europe/Madrid
Logroño|España|42.4627|-2.4450|Europe/Madrid
Santiago de Compostela|España|42.8782|-8.5448|Europe/Madrid
Las Palmas de Gran Canaria|España|28.1235|-15.4363|Atlantic/Canary
Santa Cruz de Tenerife|España|28.4636|-16.2518|Atlantic/Canary
Ciudad de México|México|19.4326|-99.1332|America/Mexico_City
Guadalajara|México|20.6597|-103.3496|America/Mexico_City
Monterrey|México|25.6866|-100.3161|America/Monterrey
Puebla|México|19.0414|-98.2063|America/Mexico_City
Tijuana|México|32.5149|-117.0382|America/Tijuana
León|México|21.1250|-101.6860|America/Mexico_City
Mérida|México|20.9674|-89.5926|America/Merida
Cancún|México|21.1619|-86.8515|America/Cancun
Querétaro|México|20.5888|-100.3899|America/Mexico_City
Oaxaca|México|17.0732|-96.7266|America/Mexico_City
Veracruz|México|19.1738|-96.1342|America/Mexico_City
Chihuahua|México|28.6320|-106.0691|America/Chihuahua
Hermosillo|México|29.0729|-110.9559|America/Hermosillo
Culiacán|México|24.8091|-107.3940|America/Mazatlan
Morelia|México|19.7060|-101.1950|America/Mexico_City
Toluca|México|19.2826|-99.6557|America/Mexico_City
San Luis Potosí|México|22.1565|-100.9855|America/Mexico_City
Aguascalientes|México|21.8853|-102.2916|America/Mexico_City
Acapulco|México|16.8531|-99.8237|America/Mexico_City
Buenos Aires|Argentina|-34.6037|-58.3816|America/Argentina/Buenos_Aires
Córdoba|Argentina|-31.4201|-64.1888|America/Argentina/Cordoba
Rosario|Argentina|-32.9442|-60.6505|America/Argentina/Cordoba
Mendoza|Argentina|-32.8895|-68.8458|America/Argentina/Mendoza
La Plata|Argentina|-34.9205|-57.9536|America/Argentina/Buenos_Aires
Mar del Plata|Argentina|-38.0055|-57.5426|America/Argentina/Buenos_Aires
San Miguel de Tucumán|Argentina|-26.8083|-65.2176|America/Argentina/Tucuman
Salta|Argentina|-24.7821|-65.4232|America/Argentina/Salta
Neuquén|Argentina|-38.9516|-68.0591|America/Argentina/Salta
Santiago|Chile|-33.4489|-70.6693|America/Santiago
Valparaíso|Chile|-33.0472|-71.6127|America/Santiago
Concepción|Chile|-36.8201|-73.0444|America/Santiago
Antofagasta|Chile|-23.6509|-70.3975|America/Santiago
La Serena|Chile|-29.9027|-71.2519|America/Santiago
Temuco|Chile|-38.7359|-72.5904|America/Santiago
Bogotá|Colombia|4.7110|-74.0721|America/Bogota
Medellín|Colombia|6.2442|-75.5812|America/Bogota
Cali|Colombia|3.4516|-76.5320|America/Bogota
Barranquilla|Colombia|10.9685|-74.7813|America/Bogota
Cartagena|Colombia|10.3910|-75.4794|America/Bogota
Bucaramanga|Colombia|7.1193|-73.1227|America/Bogota
Pereira|Colombia|4.8133|-75.6961|America/Bogota
Lima|Perú|-12.0464|-77.0428|America/Lima
Arequipa|Perú|-16.4090|-71.5375|America/Lima
Cusco|Perú|-13.5320|-71.9675|America/Lima
Trujillo|Perú|-8.1091|-79.0215|America/Lima
Piura|Perú|-5.1945|-80.6328|America/Lima
Caracas|Venezuela|10.4806|-66.9036|America/Caracas
Maracaibo|Venezuela|10.6427|-71.6125|America/Caracas
Valencia|Venezuela|10.1620|-68.0077|America/Caracas
Barquisimeto|Venezuela|10.0678|-69.3474|America/Caracas
Quito|Ecuador|-0.1807|-78.4678|America/Guayaquil
Guayaquil|Ecuador|-2.1709|-79.9224|America/Guayaquil
Cuenca|Ecuador|-2.9001|-79.0059|America/Guayaquil
La Paz|Bolivia|-16.4897|-68.1193|America/La_Paz
Santa Cruz de la Sierra|Bolivia|-17.8146|-63.1561|America/La_Paz
Cochabamba|Bolivia|-17.4139|-66.1653|America/La_Paz
Sucre|Bolivia|-19.0196|-65.2619|America/La_Paz
Asunción|Paraguay|-25.2637|-57.5759|America/Asuncion
Montevideo|Uruguay|-34.9011|-56.1645|America/Montevideo
La Habana|Cuba|23.1136|-82.3666|America/Havana
Santiago de Cuba|Cuba|20.0247|-75.8219|America/Havana
Santo Domingo|República Dominicana|18.4861|-69.9312|America/Santo_Domingo
Santiago de los Caballeros|República Dominicana|19.4517|-70.6970|America/Santo_Domingo
San Juan|Puerto Rico|18.4655|-66.1057|America/Puerto_Rico
Ciudad de Guatemala|Guatemala|14.6349|-90.5069|America/Guatemala
San Salvador|El Salvador|13.6929|-89.2182|America/El_Salvador
Tegucigalpa|Honduras|14.0723|-87.1921|America/Tegucigalpa
San Pedro Sula|Honduras|15.5050|-88.0250|America/Tegucigalpa
Managua|Nicaragua|12.1150|-86.2362|America/Managua
San José|Costa Rica|9.9281|-84.0907|America/Costa_Rica
Ciudad de Panamá|Panamá|8.9824|-79.5199|America/Panama
Malabo|Guinea Ecuatorial|3.7504|8.7371|Africa/Malabo
Nueva York|Estados Unidos|40.7128|-74.0060|America/New_York
Los Ángeles|Estados Unidos|34.0522|-118.2437|America/Los_Angeles
Chicago|Estados Unidos|41.8781|-87.6298|America/Chicago
Miami|Estados Unidos|25.7617|-80.1918|America/New_York
Houston|Estados Unidos|29.7604|-95.3698|America/Chicago
San Antonio|Estados Unidos|29.4241|-98.4936|America/Chicago
Dallas|Estados Unidos|32.7767|-96.7970|America/Chicago
Phoenix|Estados Unidos|33.4484|-112.0740|America/Phoenix
San Francisco|Estados Unidos|37.7749|-122.4194|America/Los_Angeles
San Diego|Estados Unidos|32.7157|-117.1611|America/Los_Angeles
Seattle|Estados Unidos|47.6062|-122.3321|America/Los_Angeles
Denver|Estados Unidos|39.7392|-104.9903|America/Denver
Washington D. C.|Estados Unidos|38.9072|-77.0369|America/New_York
Boston|Estados Unidos|42.3601|-71.0589|America/New_York
Atlanta|Estados Unidos|33.7490|-84.3880|America/New_York
Las Vegas|Estados Unidos|36.1699|-115.1398|America/Los_Angeles
El Paso|Estados Unidos|31.7619|-106.4850|America/Denver
Toronto|Canadá|43.6532|-79.3832|America/Toronto
Montreal|Canadá|45.5019|-73.5674|America/Toronto
Vancouver|Canadá|49.2827|-123.1207|America/Vancouver
São Paulo|Brasil|-23.5505|-46.6333|America/Sao_Paulo
Río de Janeiro|Brasil|-22.9068|-43.1729|America/Sao_Paulo
Brasilia|Brasil|-15.7939|-47.8828|America/Sao_Paulo
Lisboa|Portugal|38.7223|-9.1393|Europe/Lisbon
Oporto|Portugal|41.1579|-8.6291|Europe/Lisbon
Andorra la Vella|Andorra|42.5063|1.5218|Europe/Andorra
Londres|Reino Unido|51.5074|-0.1278|Europe/London
Mánchester|Reino Unido|53.4808|-2.2426|Europe/London
Dublín|Irlanda|53.3498|-6.2603|Europe/Dublin
París|Francia|48.8566|2.3522|Europe/Paris
Marsella|Francia|43.2965|5.3698|Europe/Paris
Lyon|Francia|45.7640|4.8357|Europe/Paris
Toulouse|Francia|43.6047|1.4442|Europe/Paris
Burdeos|Francia|44.8378|-0.5792|Europe/Paris
Bruselas|Bélgica|50.8503|4.3517|Europe/Brussels
Ámsterdam|Países Bajos|52.3676|4.9041|Europe/Amsterdam
Berlín|Alemania|52.5200|13.4050|Europe/Berlin
Múnich|Alemania|48.1351|11.5820|Europe/Berlin
Fráncfort|Alemania|50.1109|8.6821|Europe/Berlin
Hamburgo|Alemania|53.5511|9.9937|Europe/Berlin
Zúrich|Suiza|47.3769|8.5417|Europe/Zurich
Ginebra|Suiza|46.2044|6.1432|Europe/Zurich
Viena|Austria|48.2082|16.3738|Europe/Vienna
Roma|Italia|41.9028|12.4964|Europe/Rome
Milán|Italia|45.4642|9.1900|Europe/Rome
Nápoles|Italia|40.8518|14.2681|Europe/Rome
Atenas|Grecia|37.9838|23.7275|Europe/Athens
Estocolmo|Suecia|59.3293|18.0686|Europe/Stockholm
Oslo|Noruega|59.9139|10.7522|Europe/Oslo
Copenhague|Dinamarca|55.6761|12.5683|Europe/Copenhagen
Helsinki|Finlandia|60.1699|24.9384|Europe/Helsinki
Varsovia|Polonia|52.2297|21.0122|Europe/Warsaw
Praga|Chequia|50.0755|14.4378|Europe/Prague
Budapest|Hungría|47.4979|19.0402|Europe/Budapest
Bucarest|Rumanía|44.4268|26.1025|Europe/Bucharest
Kiev|Ucrania|50.4501|30.5234|Europe/Kyiv
Moscú|Rusia|55.7558|37.6173|Europe/Moscow
Estambul|Turquía|41.0082|28.9784|Europe/Istanbul
Tel Aviv|Israel|32.0853|34.7818|Asia/Jerusalem
El Cairo|Egipto|30.0444|31.2357|Africa/Cairo
Casablanca|Marruecos|33.5731|-7.5898|Africa/Casablanca
Lagos|Nigeria|6.5244|3.3792|Africa/Lagos
Nairobi|Kenia|-1.2921|36.8219|Africa/Nairobi
Johannesburgo|Sudáfrica|-26.2041|28.0473|Africa/Johannesburg
Dubái|Emiratos Árabes Unidos|25.2048|55.2708|Asia/Dubai
Bombay|India|19.0760|72.8777|Asia/Kolkata
Nueva Delhi|India|28.6139|77.2090|Asia/Kolkata
Bangkok|Tailandia|13.7563|100.5018|Asia/Bangkok
Singapur|Singapur|1.3521|103.8198|Asia/Singapore
Yakarta|Indonesia|-6.2088|106.8456|Asia/Jakarta
Manila|Filipinas|14.5995|120.9842|Asia/Manila
Hong Kong|China|22.3193|114.1694|Asia/Hong_Kong
Shanghái|China|31.2304|121.4737|Asia/Shanghai
Pekín|China|39.9042|116.4074|Asia/Shanghai
Seúl|Corea del Sur|37.5665|126.9780|Asia/Seoul
Tokio|Japón|35.6762|139.6503|Asia/Tokyo
Sídney|Australia|-33.8688|151.2093|Australia/Sydney
Melbourne|Australia|-37.8136|144.9631|Australia/Melbourne
Perth|Australia|-31.9505|115.8605|Australia/Perth
Auckland|Nueva Zelanda|-36.8485|174.7633|Pacific/Auckland`;
const CITIES = CITY_DATA.split('\n').map((l) => {
  const [name, country, lat, lon, tz] = l.split('|');
  return { name, country, lat: +lat, lon: +lon, tz };
});

/* ── Textos de interpretación ─────────────────────────────────────── */
const SIGN_TEXT = {
  aries: { kw: 'impulso, coraje, franqueza', style: 'con iniciativa, valentía y algo de impaciencia', strong: 'Arranca proyectos, defiende lo suyo y contagia energía.', challenge: 'Sostener lo que empieza y escuchar antes de reaccionar.' },
  tauro: { kw: 'constancia, sensualidad, calma', style: 'de forma estable, sensual y paciente', strong: 'Construye a largo plazo, da seguridad y disfruta de lo concreto.', challenge: 'Soltar la resistencia al cambio y la posesividad.' },
  geminis: { kw: 'curiosidad, ingenio, versatilidad', style: 'con curiosidad, agilidad mental y ganas de conversar', strong: 'Conecta ideas y personas, aprende rápido y comunica con gracia.', challenge: 'Profundizar y comprometerse sin dispersarse.' },
  cancer: { kw: 'sensibilidad, cuidado, memoria', style: 'de forma protectora, emotiva e intuitiva', strong: 'Cuida, crea hogar y percibe lo que sienten los demás.', challenge: 'No encerrarse por miedo a sufrir ni vivir anclado en el pasado.' },
  leo: { kw: 'creatividad, orgullo, generosidad', style: 'con calidez, teatralidad y deseo de brillar', strong: 'Inspira, lidera con el corazón y celebra la vida.', challenge: 'No depender del aplauso y dejar brillar a los demás.' },
  virgo: { kw: 'análisis, servicio, precisión', style: 'con método, sentido práctico y atención al detalle', strong: 'Mejora lo que toca, organiza y ayuda de forma útil.', challenge: 'Soltar la autocrítica y el perfeccionismo.' },
  libra: { kw: 'armonía, diplomacia, estética', style: 'con elegancia, tacto y búsqueda de equilibrio', strong: 'Media en conflictos, crea belleza y tiene en cuenta al otro.', challenge: 'Decidir sin depender de la aprobación ajena.' },
  escorpio: { kw: 'intensidad, profundidad, poder', style: 'con intensidad, reserva y pasión', strong: 'Va al fondo de las cosas, se regenera y es leal hasta el final.', challenge: 'Confiar y soltar el control, los celos o el rencor.' },
  sagitario: { kw: 'expansión, fe, aventura', style: 'con entusiasmo, optimismo y sed de sentido', strong: 'Abre horizontes, enseña y contagia esperanza.', challenge: 'Cumplir lo prometido y no huir de los límites.' },
  capricornio: { kw: 'ambición, disciplina, responsabilidad', style: 'con seriedad, estrategia y perseverancia', strong: 'Alcanza metas difíciles, es fiable y administra bien el tiempo.', challenge: 'Permitirse disfrutar y mostrar vulnerabilidad.' },
  acuario: { kw: 'libertad, originalidad, comunidad', style: 'de forma independiente, original y algo distante', strong: 'Innova, piensa en el colectivo y respeta la diferencia.', challenge: 'Conectar con sus propias emociones y no rebelarse por sistema.' },
  piscis: { kw: 'empatía, imaginación, entrega', style: 'con sensibilidad, compasión y fantasía', strong: 'Comprende sin juzgar, crea y conecta con lo sutil.', challenge: 'Poner límites y no evadirse de la realidad.' },
};

const PLANET_MEANING = {
  sun: 'tu identidad y propósito vital', moon: 'tus emociones y necesidades íntimas', mercury: 'tu forma de pensar y comunicar',
  venus: 'tu manera de amar y lo que valoras', mars: 'tu impulso, tu deseo y tu forma de actuar', jupiter: 'tu fe y tu manera de crecer',
  saturn: 'tus responsabilidades y lecciones de madurez', uranus: 'tu necesidad de libertad y cambio', neptune: 'tu sensibilidad, tus ideales y tu inspiración',
  pluto: 'tu capacidad de transformación profunda', node: 'la dirección de crecimiento que te reta', lilith: 'lo que reprimes o reclamas con fuerza',
  asc: 'la imagen que proyectas', mc: 'tu vocación y tu meta pública',
};
const PLANET_SHORT = {
  sun: 'identidad', moon: 'emociones', mercury: 'mente', venus: 'afecto', mars: 'deseo', jupiter: 'expansión', saturn: 'compromiso',
  uranus: 'libertad', neptune: 'idealismo', pluto: 'intensidad', node: 'destino', lilith: 'instinto', asc: 'presencia', mc: 'proyección',
};

const HOUSE_NAME = ['Identidad', 'Recursos', 'Comunicación', 'Hogar', 'Creatividad', 'Rutina y salud', 'Pareja', 'Transformación', 'Horizontes', 'Vocación', 'Amistades', 'Inconsciente'];
const HOUSE_THEME = [
  'la identidad, el cuerpo y la forma de presentarte', 'el dinero, los recursos y la autoestima', 'la comunicación, los hermanos y el entorno cercano',
  'el hogar, la familia y las raíces', 'la creatividad, el romance, el juego y los hijos', 'el trabajo diario, la salud y los hábitos',
  'la pareja, los socios y los acuerdos', 'la intimidad, las crisis y los recursos compartidos', 'los viajes, los estudios superiores y las creencias',
  'la carrera, la vocación y la imagen pública', 'las amistades, los grupos y los proyectos de futuro', 'el inconsciente, el retiro y la vida espiritual',
];

const ASPECT_VERB = {
  conj: 'se funden en una sola fuerza', tri: 'fluyen juntas con naturalidad', sex: 'colaboran cuando les das ocasión',
  sq: 'chocan y te empujan a actuar', opp: 'tiran en direcciones opuestas y piden equilibrio', qx: 'necesitan ajustes constantes', ssx: 'se rozan de forma sutil',
};

const PILLAR_INTRO = {
  sun: (s) => `Tu Sol en ${s} describe tu esencia y aquello que vienes a desarrollar.`,
  moon: (s) => `Tu Luna en ${s} muestra cómo sientes, qué necesitas para estar en calma y cómo te cuidas.`,
  asc: (s) => `Tu Ascendente en ${s} es la primera impresión que das y la forma en que te lanzas a la vida.`,
};

const DIGNITY = {
  sun: { dom: ['leo'], exa: ['aries'] }, moon: { dom: ['cancer'], exa: ['tauro'] }, mercury: { dom: ['geminis', 'virgo'], exa: ['virgo'] },
  venus: { dom: ['tauro', 'libra'], exa: ['piscis'] }, mars: { dom: ['aries', 'escorpio'], exa: ['capricornio'] },
  jupiter: { dom: ['sagitario', 'piscis'], exa: ['cancer'] }, saturn: { dom: ['capricornio', 'acuario'], exa: ['libra'] },
  uranus: { dom: ['acuario'], exa: [] }, neptune: { dom: ['piscis'], exa: [] }, pluto: { dom: ['escorpio'], exa: [] },
};

const ELEMENT_TEXT = {
  fuego: 'Fuego: entusiasmo, acción y confianza. Te mueves por la inspiración.',
  tierra: 'Tierra: sentido práctico, constancia y apego a lo tangible.',
  aire: 'Aire: ideas, palabras y relaciones. Necesitas comprender y compartir.',
  agua: 'Agua: emoción, intuición y vínculo. Sientes antes de pensar.',
};
const ELEMENT_LACK = {
  fuego: 'Con poco fuego puede costarte arrancar o confiar en ti sin pruebas.',
  tierra: 'Con poca tierra lo concreto (dinero, horarios, cuerpo) pide atención consciente.',
  aire: 'Con poco aire cuesta tomar distancia y poner en palabras lo que vives.',
  agua: 'Con poca agua las emociones pueden quedar en segundo plano o resultar ajenas.',
};
const MODE_TEXT = {
  cardinal: 'Cardinal: tomas la iniciativa y abres caminos.',
  fijo: 'Fijo: sostienes, profundizas y resistes el cambio.',
  mutable: 'Mutable: te adaptas, conectas y te transformas con facilidad.',
};

const SYN_PAIR = {
  'sun-moon': 'la identidad de una persona y el mundo emocional de la otra', 'venus-mars': 'la atracción y el deseo',
  'moon-moon': 'los ritmos emocionales y los hábitos', 'mercury-mercury': 'la forma de pensar y de hablar',
  'venus-venus': 'los gustos y la forma de dar cariño', 'sun-sun': 'los propósitos y el orgullo', 'moon-venus': 'la ternura y el afecto',
  'mars-mars': 'la energía y la manera de discutir', 'sun-venus': 'la admiración y el afecto', 'sun-mars': 'el empuje y el liderazgo',
  'moon-mars': 'la emoción y el deseo', 'mercury-moon': 'la escucha y la comprensión mutua', 'mercury-sun': 'la comprensión de quién es el otro',
  'mercury-venus': 'la conversación amable y el humor', 'sun-asc': 'el reconocimiento inmediato', 'moon-asc': 'la sensación de familiaridad',
  'venus-asc': 'el gusto por cómo se ve el otro', 'mars-asc': 'la química física',
};
const SYN_PLANET = {
  saturn: 'el compromiso, los límites y la estabilidad', jupiter: 'el crecimiento y la generosidad', pluto: 'la intensidad y la transformación mutua',
  uranus: 'la sorpresa, la libertad y la chispa', neptune: 'el idealismo, la inspiración y la confusión posible', node: 'la sensación de encuentro destinado',
  lilith: 'la fascinación y lo no dicho',
};
const SYN_NATURE = {
  armónico: 'facilita', tenso: 'genera roces y también chispa en', mixto: 'intensifica', menor: 'matiza',
};

const CATEGORIES = [
  { key: 'atraccion', name: 'Atracción', desc: 'Química entre Venus, Marte, el Sol y el Ascendente.' },
  { key: 'emocion', name: 'Emociones', desc: 'Sintonía de la Luna: sentirse en casa con el otro.' },
  { key: 'comunicacion', name: 'Comunicación', desc: 'Contactos de Mercurio: entenderse al hablar.' },
  { key: 'compromiso', name: 'Compromiso', desc: 'Saturno y los luminares: estabilidad y lealtad.' },
  { key: 'crecimiento', name: 'Crecimiento', desc: 'Júpiter y los nodos: lo que la relación os ayuda a ampliar.' },
];
