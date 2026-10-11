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
Santa Fe|Argentina|-31.6333|-60.7000|America/Argentina/Cordoba
Paraná|Argentina|-31.7319|-60.5238|America/Argentina/Cordoba
Corrientes|Argentina|-27.4692|-58.8306|America/Argentina/Cordoba
Resistencia|Argentina|-27.4514|-58.9867|America/Argentina/Cordoba
Posadas|Argentina|-27.3671|-55.8961|America/Argentina/Cordoba
Formosa|Argentina|-26.1775|-58.1781|America/Argentina/Cordoba
Santiago del Estero|Argentina|-27.7834|-64.2642|America/Argentina/Cordoba
San Salvador de Jujuy|Argentina|-24.1858|-65.2995|America/Argentina/Jujuy
San Fernando del Valle de Catamarca|Argentina|-28.4696|-65.7852|America/Argentina/Catamarca
La Rioja|Argentina|-29.4131|-66.8558|America/Argentina/La_Rioja
San Juan|Argentina|-31.5375|-68.5364|America/Argentina/San_Juan
San Luis|Argentina|-33.2950|-66.3356|America/Argentina/San_Luis
Santa Rosa|Argentina|-36.6167|-64.2833|America/Argentina/Salta
Bahía Blanca|Argentina|-38.7196|-62.2724|America/Argentina/Buenos_Aires
Tandil|Argentina|-37.3217|-59.1332|America/Argentina/Buenos_Aires
Río Cuarto|Argentina|-33.1232|-64.3493|America/Argentina/Cordoba
Villa María|Argentina|-32.4075|-63.2402|America/Argentina/Cordoba
San Carlos de Bariloche|Argentina|-41.1335|-71.3103|America/Argentina/Salta
Viedma|Argentina|-40.8135|-62.9967|America/Argentina/Salta
General Roca|Argentina|-39.0333|-67.5833|America/Argentina/Salta
Rawson|Argentina|-43.3002|-65.1023|America/Argentina/Rio_Gallegos
Trelew|Argentina|-43.2490|-65.3051|America/Argentina/Rio_Gallegos
Puerto Madryn|Argentina|-42.7692|-65.0385|America/Argentina/Rio_Gallegos
Comodoro Rivadavia|Argentina|-45.8641|-67.4966|America/Argentina/Rio_Gallegos
Río Gallegos|Argentina|-51.6230|-69.2168|America/Argentina/Rio_Gallegos
El Calafate|Argentina|-50.3379|-72.2648|America/Argentina/Rio_Gallegos
Ushuaia|Argentina|-54.8019|-68.3030|America/Argentina/Ushuaia
Río Grande|Argentina|-53.7877|-67.7095|America/Argentina/Ushuaia
San Nicolás de los Arroyos|Argentina|-33.3342|-60.2108|America/Argentina/Buenos_Aires
Quilmes|Argentina|-34.7206|-58.2546|America/Argentina/Buenos_Aires
Lomas de Zamora|Argentina|-34.7609|-58.4064|America/Argentina/Buenos_Aires
Morón|Argentina|-34.6534|-58.6198|America/Argentina/Buenos_Aires
San Isidro|Argentina|-34.4708|-58.5286|America/Argentina/Buenos_Aires
Pergamino|Argentina|-33.8895|-60.5736|America/Argentina/Buenos_Aires
Junín|Argentina|-34.5850|-60.9589|America/Argentina/Buenos_Aires
Olavarría|Argentina|-36.8927|-60.3225|America/Argentina/Buenos_Aires
Necochea|Argentina|-38.5545|-58.7396|America/Argentina/Buenos_Aires
Concordia|Argentina|-31.3929|-58.0209|America/Argentina/Cordoba
Gualeguaychú|Argentina|-33.0094|-58.5172|America/Argentina/Cordoba
Rafaela|Argentina|-31.2503|-61.4867|America/Argentina/Cordoba
San Rafael|Argentina|-34.6177|-68.3301|America/Argentina/Mendoza
Oberá|Argentina|-27.4871|-55.1199|America/Argentina/Cordoba
Puerto Iguazú|Argentina|-25.5991|-54.5736|America/Argentina/Cordoba
Arica|Chile|-18.4783|-70.3126|America/Santiago
Iquique|Chile|-20.2307|-70.1357|America/Santiago
Calama|Chile|-22.4544|-68.9294|America/Santiago
Copiapó|Chile|-27.3668|-70.3323|America/Santiago
Coquimbo|Chile|-29.9533|-71.3436|America/Santiago
Viña del Mar|Chile|-33.0245|-71.5518|America/Santiago
Puente Alto|Chile|-33.6117|-70.5758|America/Santiago
San Antonio|Chile|-33.5933|-71.6217|America/Santiago
Rancagua|Chile|-34.1708|-70.7444|America/Santiago
Talca|Chile|-35.4264|-71.6554|America/Santiago
Chillán|Chile|-36.6066|-72.1034|America/Santiago
Los Ángeles|Chile|-37.4697|-72.3537|America/Santiago
Valdivia|Chile|-39.8142|-73.2459|America/Santiago
Osorno|Chile|-40.5739|-73.1336|America/Santiago
Puerto Montt|Chile|-41.4693|-72.9424|America/Santiago
Coyhaique|Chile|-45.5712|-72.0685|America/Santiago
Punta Arenas|Chile|-53.1638|-70.9171|America/Punta_Arenas
Hanga Roa (Isla de Pascua)|Chile|-27.1500|-109.4333|Pacific/Easter
Cúcuta|Colombia|7.8939|-72.5078|America/Bogota
Ibagué|Colombia|4.4389|-75.2322|America/Bogota
Santa Marta|Colombia|11.2408|-74.1990|America/Bogota
Villavicencio|Colombia|4.1420|-73.6266|America/Bogota
Manizales|Colombia|5.0703|-75.5138|America/Bogota
Pasto|Colombia|1.2136|-77.2811|America/Bogota
Neiva|Colombia|2.9273|-75.2819|America/Bogota
Armenia|Colombia|4.5339|-75.6811|America/Bogota
Montería|Colombia|8.7479|-75.8814|America/Bogota
Valledupar|Colombia|10.4631|-73.2532|America/Bogota
Popayán|Colombia|2.4448|-76.6147|America/Bogota
Sincelejo|Colombia|9.3047|-75.3978|America/Bogota
Tunja|Colombia|5.5446|-73.3576|America/Bogota
Riohacha|Colombia|11.5444|-72.9072|America/Bogota
Florencia|Colombia|1.6144|-75.6062|America/Bogota
Quibdó|Colombia|5.6947|-76.6611|America/Bogota
Leticia|Colombia|-4.2153|-69.9406|America/Bogota
Yopal|Colombia|5.3378|-72.3959|America/Bogota
Soacha|Colombia|4.5794|-74.2168|America/Bogota
Bello|Colombia|6.3373|-75.5580|America/Bogota
Envigado|Colombia|6.1759|-75.5917|America/Bogota
Palmira|Colombia|3.5394|-76.3036|America/Bogota
Buenaventura|Colombia|3.8801|-77.0312|America/Bogota
Barrancabermeja|Colombia|7.0653|-73.8547|America/Bogota
San Andrés|Colombia|12.5847|-81.7006|America/Bogota
Callao|Perú|-12.0566|-77.1181|America/Lima
Chiclayo|Perú|-6.7714|-79.8409|America/Lima
Iquitos|Perú|-3.7437|-73.2516|America/Lima
Huancayo|Perú|-12.0651|-75.2049|America/Lima
Tacna|Perú|-18.0066|-70.2463|America/Lima
Puno|Perú|-15.8402|-70.0219|America/Lima
Juliaca|Perú|-15.5000|-70.1333|America/Lima
Ica|Perú|-14.0678|-75.7286|America/Lima
Cajamarca|Perú|-7.1638|-78.5003|America/Lima
Ayacucho|Perú|-13.1588|-74.2236|America/Lima
Huánuco|Perú|-9.9306|-76.2422|America/Lima
Pucallpa|Perú|-8.3791|-74.5539|America/Lima
Chimbote|Perú|-9.0745|-78.5936|America/Lima
Tumbes|Perú|-3.5669|-80.4515|America/Lima
Puerto Maldonado|Perú|-12.5933|-69.1891|America/Lima
Huaraz|Perú|-9.5278|-77.5278|America/Lima
Moquegua|Perú|-17.1956|-70.9353|America/Lima
Tarapoto|Perú|-6.4882|-76.3605|America/Lima
Chachapoyas|Perú|-6.2317|-77.8690|America/Lima
Maracay|Venezuela|10.2469|-67.5958|America/Caracas
Ciudad Guayana|Venezuela|8.3533|-62.6528|America/Caracas
Barcelona|Venezuela|10.1363|-64.6862|America/Caracas
Puerto La Cruz|Venezuela|10.2133|-64.6328|America/Caracas
Maturín|Venezuela|9.7457|-63.1832|America/Caracas
Cumaná|Venezuela|10.4635|-64.1775|America/Caracas
Mérida|Venezuela|8.5897|-71.1561|America/Caracas
San Cristóbal|Venezuela|7.7669|-72.2250|America/Caracas
Ciudad Bolívar|Venezuela|8.1292|-63.5409|America/Caracas
Barinas|Venezuela|8.6226|-70.2075|America/Caracas
Cabimas|Venezuela|10.4017|-71.4461|America/Caracas
Coro|Venezuela|11.4045|-69.6734|America/Caracas
Los Teques|Venezuela|10.3442|-67.0433|America/Caracas
Valera|Venezuela|9.3178|-70.6036|America/Caracas
Porlamar|Venezuela|10.9577|-63.8697|America/Caracas
Acarigua|Venezuela|9.5545|-69.1956|America/Caracas
San Fernando de Apure|Venezuela|7.8878|-67.4724|America/Caracas
Puerto Ayacucho|Venezuela|5.6639|-67.6236|America/Caracas
Santo Domingo de los Tsáchilas|Ecuador|-0.2530|-79.1754|America/Guayaquil
Machala|Ecuador|-3.2581|-79.9554|America/Guayaquil
Manta|Ecuador|-0.9677|-80.7089|America/Guayaquil
Portoviejo|Ecuador|-1.0546|-80.4545|America/Guayaquil
Ambato|Ecuador|-1.2491|-78.6168|America/Guayaquil
Riobamba|Ecuador|-1.6636|-78.6546|America/Guayaquil
Loja|Ecuador|-3.9931|-79.2042|America/Guayaquil
Esmeraldas|Ecuador|0.9592|-79.6539|America/Guayaquil
Ibarra|Ecuador|0.3517|-78.1223|America/Guayaquil
Latacunga|Ecuador|-0.9352|-78.6155|America/Guayaquil
Quevedo|Ecuador|-1.0286|-79.4635|America/Guayaquil
Milagro|Ecuador|-2.1347|-79.5874|America/Guayaquil
Babahoyo|Ecuador|-1.8022|-79.5344|America/Guayaquil
Tulcán|Ecuador|0.8119|-77.7173|America/Guayaquil
Nueva Loja|Ecuador|0.0847|-76.8828|America/Guayaquil
Puyo|Ecuador|-1.4924|-77.9993|America/Guayaquil
Puerto Ayora (Galápagos)|Ecuador|-0.7432|-90.3157|Pacific/Galapagos
El Alto|Bolivia|-16.5000|-68.1500|America/La_Paz
Oruro|Bolivia|-17.9833|-67.1250|America/La_Paz
Potosí|Bolivia|-19.5836|-65.7531|America/La_Paz
Tarija|Bolivia|-21.5355|-64.7296|America/La_Paz
Trinidad|Bolivia|-14.8333|-64.9000|America/La_Paz
Cobija|Bolivia|-11.0267|-68.7692|America/La_Paz
Montero|Bolivia|-17.3422|-63.2558|America/La_Paz
Riberalta|Bolivia|-11.0083|-66.0714|America/La_Paz
Yacuiba|Bolivia|-22.0153|-63.6775|America/La_Paz
Ciudad del Este|Paraguay|-25.5097|-54.6111|America/Asuncion
Encarnación|Paraguay|-27.3306|-55.8667|America/Asuncion
San Lorenzo|Paraguay|-25.3397|-57.5089|America/Asuncion
Luque|Paraguay|-25.2700|-57.4872|America/Asuncion
Capiatá|Paraguay|-25.3552|-57.4454|America/Asuncion
Lambaré|Paraguay|-25.3468|-57.6065|America/Asuncion
Fernando de la Mora|Paraguay|-25.3200|-57.5400|America/Asuncion
Pedro Juan Caballero|Paraguay|-22.5472|-55.7333|America/Asuncion
Concepción|Paraguay|-23.4064|-57.4344|America/Asuncion
Coronel Oviedo|Paraguay|-25.4500|-56.4400|America/Asuncion
Villarrica|Paraguay|-25.7500|-56.4333|America/Asuncion
Caaguazú|Paraguay|-25.4667|-56.0167|America/Asuncion
Pilar|Paraguay|-26.8667|-58.3000|America/Asuncion
Salto|Uruguay|-31.3833|-57.9667|America/Montevideo
Paysandú|Uruguay|-32.3214|-58.0756|America/Montevideo
Las Piedras|Uruguay|-34.7302|-56.2192|America/Montevideo
Rivera|Uruguay|-30.9053|-55.5508|America/Montevideo
Maldonado|Uruguay|-34.9000|-54.9500|America/Montevideo
Punta del Este|Uruguay|-34.9620|-54.9450|America/Montevideo
Tacuarembó|Uruguay|-31.7333|-55.9833|America/Montevideo
Melo|Uruguay|-32.3667|-54.1833|America/Montevideo
Mercedes|Uruguay|-33.2524|-58.0305|America/Montevideo
Artigas|Uruguay|-30.4000|-56.4667|America/Montevideo
Minas|Uruguay|-34.3759|-55.2377|America/Montevideo
Colonia del Sacramento|Uruguay|-34.4626|-57.8400|America/Montevideo
San José de Mayo|Uruguay|-34.3375|-56.7136|America/Montevideo
Durazno|Uruguay|-33.3806|-56.5236|America/Montevideo
Florida|Uruguay|-34.0956|-56.2142|America/Montevideo
Treinta y Tres|Uruguay|-33.2333|-54.3833|America/Montevideo
Rocha|Uruguay|-34.4833|-54.3333|America/Montevideo
Fray Bentos|Uruguay|-33.1165|-58.3107|America/Montevideo
Canelones|Uruguay|-34.5228|-56.2778|America/Montevideo
Salvador|Brasil|-12.9714|-38.5014|America/Bahia
Fortaleza|Brasil|-3.7319|-38.5267|America/Fortaleza
Belo Horizonte|Brasil|-19.9167|-43.9345|America/Sao_Paulo
Manaos|Brasil|-3.1190|-60.0217|America/Manaus
Curitiba|Brasil|-25.4284|-49.2733|America/Sao_Paulo
Recife|Brasil|-8.0476|-34.8770|America/Recife
Porto Alegre|Brasil|-30.0346|-51.2177|America/Sao_Paulo
Belém|Brasil|-1.4558|-48.4902|America/Belem
Goiânia|Brasil|-16.6869|-49.2648|America/Sao_Paulo
Campinas|Brasil|-22.9099|-47.0626|America/Sao_Paulo
São Luís|Brasil|-2.5307|-44.3068|America/Fortaleza
Maceió|Brasil|-9.6658|-35.7353|America/Maceio
Natal|Brasil|-5.7945|-35.2110|America/Fortaleza
Teresina|Brasil|-5.0892|-42.8019|America/Fortaleza
João Pessoa|Brasil|-7.1195|-34.8450|America/Fortaleza
Campo Grande|Brasil|-20.4697|-54.6201|America/Campo_Grande
Cuiabá|Brasil|-15.6014|-56.0979|America/Cuiaba
Florianópolis|Brasil|-27.5954|-48.5480|America/Sao_Paulo
Aracaju|Brasil|-10.9472|-37.0731|America/Maceio
Vitória|Brasil|-20.3155|-40.3128|America/Sao_Paulo
Porto Velho|Brasil|-8.7612|-63.9004|America/Porto_Velho
Macapá|Brasil|0.0349|-51.0694|America/Belem
Rio Branco|Brasil|-9.9754|-67.8249|America/Rio_Branco
Boa Vista|Brasil|2.8235|-60.6758|America/Boa_Vista
Palmas|Brasil|-10.1844|-48.3336|America/Araguaina
Santos|Brasil|-23.9608|-46.3336|America/Sao_Paulo
Ribeirão Preto|Brasil|-21.1704|-47.8103|America/Sao_Paulo
Sorocaba|Brasil|-23.5015|-47.4526|America/Sao_Paulo
Londrina|Brasil|-23.3045|-51.1696|America/Sao_Paulo
Joinville|Brasil|-26.3045|-48.8487|America/Sao_Paulo
Foz do Iguaçu|Brasil|-25.5163|-54.5854|America/Sao_Paulo
Santarém|Brasil|-2.4385|-54.6996|America/Santarem
Uberlândia|Brasil|-18.9186|-48.2772|America/Sao_Paulo
Juiz de Fora|Brasil|-21.7642|-43.3496|America/Sao_Paulo
Niterói|Brasil|-22.8832|-43.1034|America/Sao_Paulo
Pelotas|Brasil|-31.7654|-52.3376|America/Sao_Paulo
Caxias do Sul|Brasil|-29.1678|-51.1794|America/Sao_Paulo
Feira de Santana|Brasil|-12.2664|-38.9663|America/Bahia
Georgetown|Guyana|6.8013|-58.1551|America/Guyana
Paramaribo|Surinam|5.8520|-55.2038|America/Paramaribo
Cayena|Guayana Francesa|4.9224|-52.3135|America/Cayenne
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
