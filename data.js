// Estructura de Bases Curriculares 2019 - Educación Parvularia - Nivel Transición

const AMBITOS = {
    desarrollo: {
        nombre: "Desarrollo Personal y Social",
        nucleos: {
            identidad: {
                nombre: "Identidad y Autonomía",
                oa: [
                    { codigo: "OA1", texto: "Comunicar a los demás, emociones y sentimientos tales como: amor, miedo, alegría, ira, que le provocan diversas narraciones o situaciones observadas en forma directa o a través de TICs." },
                    { codigo: "OA2", texto: "Manifestar disposición y confianza para relacionarse con algunos adultos y pares que no son parte del grupo o curso." },
                    { codigo: "OA3", texto: "Reconocer emociones y sentimientos en otras personas, observadas en forma directa o a través de TICs." },
                    { codigo: "OA4", texto: "Expresar sus emociones y sentimientos autorregulándose en función de las necesidades propias, de los demás y las normas de funcionamiento grupal." },
                    { codigo: "OA5", texto: "Comunicar sus preferencias, opiniones, ideas, en diversas situaciones cotidianas y juegos." },
                    { codigo: "OA6", texto: "Planificar proyectos y juegos, en función de sus ideas e intereses, proponiendo actividades, organizando los recursos, incorporando los ajustes necesarios e iniciándose en la apreciación de sus resultados." },
                    { codigo: "OA7", texto: "Comunicar rasgos de su identidad de género, roles (nieta/o, vecino/a, entre otros), sentido de pertenencia y cualidades personales." },
                    { codigo: "OA8", texto: "Comunicar sus características identitarias, fortalezas, habilidades y desafíos personales." },
                    { codigo: "OA9", texto: "Cuidar su bienestar personal, llevando a cabo sus prácticas de higiene, alimentación y vestuario, con independencia y progresiva responsabilidad." },
                    { codigo: "OA10", texto: "Comunicar a otras personas desafíos alcanzados, identificando acciones que aportaron a su logro y definiendo nuevas metas." },
                    { codigo: "OA11", texto: "Distinguir parámetros establecidos para la regulación de alimentos, tales como: etiquetado de sellos, fechas de vencimiento, entre otros." },
                    { codigo: "OA12", texto: "Anticipar acciones y prever algunas situaciones o desafíos que se pueden presentar, en juegos, proyectos, sucesos que experimenta o que observa a través de TICs." }
                ]
            },
            convivencia: {
                nombre: "Convivencia y Ciudadanía",
                oa: [
                    { codigo: "OA1", texto: "Participar en actividades y juegos colaborativos, planificando, acordando estrategias para un propósito común y asumiendo progresivamente responsabilidades en ellos." },
                    { codigo: "OA2", texto: "Participar en actividades solidarias, que integran a las familias, la comunidad educativa y local." },
                    { codigo: "OA3", texto: "Manifestar empatía y solidaridad frente a situaciones que vivencian sus pares, o que observa en textos o TICs, practicando acciones de escucha, apoyo y colaboración." },
                    { codigo: "OA4", texto: "Apreciar el significado que tienen para las personas y las comunidades, diversas manifestaciones culturales que se desarrollan en su entorno." },
                    { codigo: "OA5", texto: "Aplicar estrategias pacíficas frente a la resolución de conflictos cotidianos con otros niños y niñas." },
                    { codigo: "OA6", texto: "Respetar normas y acuerdos creados colaborativamente con pares y adultos, para el bienestar del grupo." },
                    { codigo: "OA7", texto: "Identificar objetos, comportamientos y situaciones de riesgo que pueden atentar contra su bienestar y seguridad, o la de los demás, proponiendo alternativas para enfrentarlas." },
                    { codigo: "OA8", texto: "Comprender que algunas de sus acciones y decisiones respecto al desarrollo de juegos y proyectos colectivos, influyen en las de sus pares." },
                    { codigo: "OA9", texto: "Reconocer, y progresivamente hacer respetar el derecho a expresarse libremente, a ser escuchado y a que su opinión sea tomada en cuenta." },
                    { codigo: "OA10", texto: "Reconocer progresivamente requerimientos esenciales de las prácticas de convivencia democrática, tales como: escucha de opiniones divergentes, el respeto por los demás, de los turnos, de los acuerdos de las mayorías." }
                ]
            },
            corporalidad: {
                nombre: "Corporalidad y Movimiento",
                oa: [
                    { codigo: "OA1", texto: "Manifestar iniciativa para resguardar el autocuidado de su cuerpo y su confortabilidad, en función de su propio bienestar." },
                    { codigo: "OA2", texto: "Apreciar sus características corporales, manifestando interés y cuidado por su bienestar y apariencia personal." },
                    { codigo: "OA3", texto: "Tomar conciencia de su cuerpo, de algunas de sus características internas (tales como: ritmo cardíaco, de respiración), de su esquema y progresivamente de su tono corporal y lateralidad, por medio de juegos." },
                    { codigo: "OA4", texto: "Comunicar nuevas posibilidades de acción logradas a través de su cuerpo en situaciones cotidianas y de juego, empleando vocabulario preciso." },
                    { codigo: "OA5", texto: "Comunicar el bienestar que le produce el movimiento, al ejercitar y recrear su cuerpo en forma habitual, con y sin implementos u obstáculos." },
                    { codigo: "OA6", texto: "Coordinar con precisión y eficiencia sus habilidades psicomotrices finas en función de sus intereses de exploración y juego." },
                    { codigo: "OA7", texto: "Resolver desafíos prácticos manteniendo control, equilibrio y coordinación al combinar diversos movimientos, posturas y desplazamientos tales como: lanzar y recibir, desplazarse en planos inclinados, seguir ritmos, en una variedad de juegos." },
                    { codigo: "OA8", texto: "Coordinar sus habilidades psicomotoras practicando posturas y movimientos de fuerza, resistencia y tracción tales como: tirar la cuerda, transportar objetos, utilizar implementos, en situaciones cotidianas y de juego." },
                    { codigo: "OA9", texto: "Utilizar categorías de ubicación espacial y temporal, tales como: adelante/atrás/al lado/entre, día/noche, hoy/mañana, antes/durante/después, en situaciones cotidianas y lúdicas." }
                ]
            }
        }
    },
    comunicacion: {
        nombre: "Comunicación Integral",
        nucleos: {
            lenguaje_verbal: {
                nombre: "Lenguaje Verbal",
                oa: [
                    { codigo: "OA1", texto: "Expresarse oralmente en forma clara y comprensible, empleando estructuras oracionales completas, conjugaciones verbales adecuadas y precisas con los tiempos, personas e intenciones comunicativas." },
                    { codigo: "OA2", texto: "Comprender textos orales como preguntas, explicaciones, relatos, instrucciones y algunos conceptos abstractos en distintas situaciones comunicativas, identificando la intencionalidad comunicativa de diversos interlocutores." },
                    { codigo: "OA3", texto: "Descubrir en contextos lúdicos, atributos fonológicos de palabras conocidas, tales como conteo de palabras, segmentación y conteo de sílabas, identificación de sonidos finales e iniciales." },
                    { codigo: "OA4", texto: "Comunicar oralmente temas de su interés, empleando un vocabulario variado e incorporando palabras nuevas y pertinentes a las distintas situaciones comunicativas e interlocutores." },
                    { codigo: "OA5", texto: "Manifestar interés por descubrir el contenido y algunos propósitos de diferentes textos escritos (manipulando, explorando, realizando descripciones y conjeturas) a través del contacto cotidiano con algunos de ellos, o del uso de TICs." },
                    { codigo: "OA6", texto: "Comprender contenidos explícitos de textos literarios y no literarios, a partir de la escucha atenta, describiendo información y realizando progresivamente inferencias y predicciones." },
                    { codigo: "OA7", texto: "Reconocer palabras que se encuentran en diversos soportes asociando algunos fonemas a sus correspondientes grafemas." },
                    { codigo: "OA8", texto: "Representar gráficamente algunos trazos, letras, signos, palabras significativas y mensajes simples legibles, utilizando diferentes recursos y soportes en situaciones auténticas." },
                    { codigo: "OA9", texto: "Comunicar mensajes simples en la lengua indígena pertinente a la comunidad donde habita." },
                    { codigo: "OA10", texto: "Reconocer algunas palabras o mensajes sencillos de lenguas maternas de sus pares, distintas al castellano." },
                    { codigo: "OA11", texto: "Iniciar progresivamente la conciencia fonológica (sonidos de las palabras habladas) a través del reconocimiento y la producción de: sílabas iniciales y finales, sonidos iniciales y finales de las palabras, rimas y aliteraciones." }
                ]
            },
            lenguajes_artisticos: {
                nombre: "Lenguajes Artísticos",
                oa: [
                    { codigo: "OA1", texto: "Apreciar producciones artísticas de diversos contextos (en forma directa o a través de medios tecnológicos), describiendo y comparando algunas características visuales, musicales o escénicas (desplazamiento, ritmo, carácter expresivo, colorido, formas, diseño, entre otros)." },
                    { codigo: "OA2", texto: "Comunicar sus impresiones, emociones e ideas respecto de diversas obras de arte, producciones propias y de sus pares (artesanías, piezas musicales, obras plásticas y escénicas, entre otras)." },
                    { codigo: "OA3", texto: "Interpretar canciones y juegos musicales, utilizando de manera integrada diversos recursos tales como, la voz, el cuerpo, instrumentos musicales y objetos." },
                    { codigo: "OA4", texto: "Expresar corporalmente sensaciones, emociones e ideas a partir de la improvisación de escenas dramáticas, juegos teatrales, mímica, danza, bailes y otros, utilizando diversos recursos del lenguaje corporal y escénico." },
                    { codigo: "OA5", texto: "Representar a través del dibujo, sus ideas, intereses y experiencias, incorporando detalles a las figuras humanas y a objetos de su entorno, ubicándolas en parámetros básicos de organización espacial (arriba/abajo, dentro/fuera)." },
                    { codigo: "OA6", texto: "Experimentar diversas combinaciones de expresión plástica, incorporando elementos tales como: línea, forma, color y textura en el espacio, sobre una superficie y en volumen, a partir de sus proyectos creativos." },
                    { codigo: "OA7", texto: "Representar a través de la plástica, sus ideas, intereses y experiencias, utilizando diversos recursos expresivos que le permitan ampliar sus posibilidades de comunicación." }
                ]
            }
        }
    },
    interaccion: {
        nombre: "Interacción y Comprensión del Entorno",
        nucleos: {
            exploracion: {
                nombre: "Exploración del Entorno Natural",
                oa: [
                    { codigo: "OA1", texto: "Manifestar interés y asombro al ampliar información sobre cambios que ocurren en el entorno natural, a las personas, animales, plantas, lugares y cuerpos celestes, utilizando diversas fuentes y procedimientos." },
                    { codigo: "OA2", texto: "Formular conjeturas y predicciones acerca de las causas o consecuencias de fenómenos naturales que observa, a partir de sus conocimientos y experiencias previas." },
                    { codigo: "OA3", texto: "Reconocer la importancia del agua y la energía solar para la vida humana, los animales y las plantas, a partir de experiencias directas o TICs." },
                    { codigo: "OA4", texto: "Comunicar propiedades básicas de los objetos y elementos naturales que explora, tales como: transparencia/opacidad, flexibilidad/rigidez, rugosidad/lisura, relacionándolas con posibles usos." },
                    { codigo: "OA5", texto: "Explorar los cambios o efectos que se producen en los materiales al aplicarles fuerza, calor o agua." },
                    { codigo: "OA6", texto: "Establecer relaciones de semejanzas y diferencias de animales y plantas, a partir de algunas características (tamaño, color, textura y morfología), sus necesidades básicas (formas de alimentación y abrigo), y los lugares que habitan, al observarlos en forma directa, en libros ilustrados o en TICs." },
                    { codigo: "OA7", texto: "Describir semejanzas y diferencias respecto a características, necesidades básicas y cambios que ocurren en el proceso de crecimiento, en personas, animales y plantas." },
                    { codigo: "OA8", texto: "Practicar algunas acciones cotidianas, que contribuyen al cuidado de ambientes sostenibles, tales como manejo de desechos en paseos al aire libre, separación de residuos, utilización de envases reutilizables, entre otros." },
                    { codigo: "OA9", texto: "Comunicar sus observaciones, los instrumentos utilizados y los hallazgos obtenidos, mediante relatos, representaciones gráficas o fotografías, entre otros." },
                    { codigo: "OA10", texto: "Identificar las condiciones que caracterizan los ambientes saludables, tales como: aire y agua limpia, combustión natural, reciclaje, reutilización y reducción de basura, tomando conciencia progresiva de cómo estas contribuyen a su salud." }
                ]
            },
            comprension_sociocultural: {
                nombre: "Comprensión del Entorno Sociocultural",
                oa: [
                    { codigo: "OA1", texto: "Comprender los roles que desarrollan miembros de su familia y de su comunidad, y su aporte para el bienestar común." },
                    { codigo: "OA2", texto: "Apreciar diversas formas de vida de comunidades, del país y del mundo, en el pasado y en el presente, tales como: viviendas, paisajes, alimentación, costumbres, identificando mediante diversas fuentes de documentación gráfica y audiovisual, sus características relevantes." },
                    { codigo: "OA3", texto: "Reconocer la importancia del servicio que prestan instituciones, organizaciones, lugares y obras de interés patrimonial, tales como: escuelas, transporte, empresas, iglesias, museos, bibliotecas, entre otros." },
                    { codigo: "OA4", texto: "Comunicar sus observaciones sobre las características de los lugares en que se desarrolla la vida cotidiana, mediante el empleo de distintos medios y recursos tales como: fotografías, videos, TICs, entre otros." },
                    { codigo: "OA5", texto: "Aplicar prácticas sostenibles para el cuidado del medioambiente, en sus experiencias cotidianas, a partir de la comprensión de la interrelación entre el bienestar humano y la naturaleza." },
                    { codigo: "OA6", texto: "Distinguir emociones y sentimientos en distintas obras de arte, a partir de su propia experiencia." },
                    { codigo: "OA7", texto: "Representar en juegos sociodramáticos, sus pensamientos y experiencias atribuyendo significados a objetos, personas y situaciones." }
                ]
            },
            pensamiento_matematico: {
                nombre: "Pensamiento Matemático",
                oa: [
                    { codigo: "OA1", texto: "Crear patrones sonoros, visuales, gestuales, corporales u otros, de dos o tres elementos." },
                    { codigo: "OA2", texto: "Experimentar con diversos objetos estableciendo relaciones al clasificar por dos o tres atributos a la vez (forma, color, tamaño, función, masa, materialidad, entre otros) y seriar por altura, ancho, longitud o capacidad para contener." },
                    { codigo: "OA3", texto: "Comunicar la posición de objetos y personas respecto de un punto u objeto de referencia, empleando conceptos de ubicación (dentro/fuera; encima/debajo/entre; al frente de/detrás de); distancia (cerca/lejos) y dirección (adelante/atrás/hacia el lado), en situaciones lúdicas." },
                    { codigo: "OA4", texto: "Orientarse temporalmente en situaciones cotidianas, empleando nociones y relaciones de secuencia (antes/ahora/después/al mismo tiempo, día/noche), frecuencia (siempre/a veces/ nunca) y duración (larga/corta)." },
                    { codigo: "OA5", texto: "Emplear cuantificadores, tales como: \"más que\", \"menos que\", \"igual que\", al comparar cantidades de objetos en situaciones cotidianas." },
                    { codigo: "OA6", texto: "Emplear los números para contar, identificar, cuantificar y comparar cantidades hasta el 20 e indicar orden o posición de algunos elementos en situaciones cotidianas o juegos." },
                    { codigo: "OA7", texto: "Representar números y cantidades hasta el 10, en forma concreta, pictórica y simbólica." },
                    { codigo: "OA8", texto: "Resolver progresivamente problemas simples de manera concreta y pictórica, agregando o quitando hasta 10 elementos." },
                    { codigo: "OA9", texto: "Representar objetos desde arriba, del nivel del suelo, de forma horizontal o vertical." },
                    { codigo: "OA10", texto: "Identificar atributos estables y variables de sencillos problemas matemáticos." },
                    { codigo: "OA11", texto: "Emplear medidas no estandarizadas para determinar longitud de objetos, cuantificar el peso de objetos, estimar la capacidad para contener y el paso del tiempo." }
                ]
            }
        }
    }
};

// Objetivos de Aprendizaje Transversales (OAT)
const OAT = [
    { codigo: "OAT1", texto: "Participar en actividades y juegos colaborativos con actitud propositiva, respetando normas y en función de un propósito común." },
    { codigo: "OAT2", texto: "Manifestar empatía y solidaridad frente a situaciones que vivencian sus pares." },
    { codigo: "OAT3", texto: "Manifestar disposición y confianza al separarse de los adultos significativos." },
    { codigo: "OAT4", texto: "Apreciar el significado que tienen para las personas y las comunidades, diversas manifestaciones culturales." },
    { codigo: "OAT5", texto: "Aplicar estrategias pacíficas frente a la resolución de conflictos cotidianos." },
    { codigo: "OAT6", texto: "Respetar normas y acuerdos creados colaborativamente con pares y adultos." },
    { codigo: "OAT7", texto: "Manifestar disposición para regular sus emociones y sentimientos en función de las necesidades propias, de los demás y de algunos acuerdos para el funcionamiento grupal." },
    { codigo: "OAT8", texto: "Manifestar disposición para practicar acuerdos de convivencia básica que regulan situaciones cotidianas y juegos." },
    { codigo: "OAT9", texto: "Manifestar interés por conocer, integrarse y participar progresivamente en prácticas culturales de su familia y comunidad." },
    { codigo: "OAT10", texto: "Reconocer, y progresivamente hacer respetar, el derecho a expresarse libremente, a ser escuchado y a que su opinión sea tomada en cuenta." }
];

// Banco de Experiencias de Aprendizaje (una por cada núcleo)
const BANCO_EXPERIENCIAS = [
    {
        nucleo: "identidad",
        titulo: "Mi caja de emociones",
        inicio: "Los niños y niñas se sientan en círculo. La educadora muestra imágenes de diferentes emociones y pregunta: ¿Cómo se siente esta persona? ¿Cuándo te has sentido así? Se invita a compartir experiencias personales relacionadas con las emociones mostradas.",
        desarrollo: "Cada niño/a recibe una caja pequeña (puede ser de zapatos decorada). Dentro de ella, colocarán dibujos, recortes o materiales que representen situaciones que les provocan diferentes emociones. Luego, crean un 'medidor de emociones' con un plato de cartón dividido en secciones de colores, donde pueden indicar cómo se sienten durante el día. Trabajan en identificar qué les ayuda cuando sienten emociones difíciles.",
        cierre: "En círculo, cada niño/a muestra un elemento de su caja y comparte por qué lo eligió. Se reflexiona: ¿Qué aprendimos sobre nuestras emociones? ¿Cómo podemos ayudar a un amigo cuando está triste? Se canta una canción sobre las emociones."
    },
    {
        nucleo: "convivencia",
        titulo: "Proyecto: Cuidemos nuestro jardín",
        inicio: "La educadora presenta fotografías del patio y pregunta: ¿Qué les gusta de nuestro patio? ¿Qué podríamos mejorar? Se realiza un recorrido por el espacio exterior identificando áreas que necesitan cuidado. Los niños/as votan democráticamente qué área mejorar primero.",
        desarrollo: "En grupos pequeños, planifican acciones para cuidar el espacio seleccionado. Algunos grupos recolectan basura y clasifican residuos, otros plantan flores o pintan piedras decorativas. Crean carteles con normas para mantener el espacio limpio. Distribuyen roles y responsabilidades: algunos serán 'guardianes del jardín' cada semana. Se documenta el proceso con fotografías.",
        cierre: "Se realiza una 'inauguración' del espacio mejorado, invitando a otras salas. Los niños/as explican qué hicieron y por qué es importante cuidar los espacios comunes. Se establece un calendario de responsabilidades rotativas. Se reflexiona sobre cómo el trabajo en equipo logró el objetivo."
    },
    {
        nucleo: "corporalidad",
        titulo: "Circuito de desafíos motrices",
        inicio: "Calentamiento con música: los niños/as mueven diferentes partes del cuerpo siguiendo instrucciones. Se sientan y conversan sobre qué actividades físicas les gustan hacer. La educadora muestra el circuito preparado y explica cada estación.",
        desarrollo: "Los niños/as rotan por estaciones del circuito: 1) Caminar sobre líneas onduladas manteniendo equilibrio, 2) Lanzar pelotas a diferentes distancias hacia un objetivo, 3) Saltar en un pie dentro de aros, 4) Pasar por debajo de obstáculos (túnel), 5) Transportar objetos de diferentes pesos. En cada estación, toman conciencia de su respiración, latidos del corazón. Se promueve que verbalicen las sensaciones corporales.",
        cierre: "Ejercicios de respiración y relajación acostados en colchonetas. Se conversa: ¿Qué fue lo más difícil? ¿Qué parte del cuerpo trabajó más? ¿Cómo se siente tu cuerpo ahora? Los niños/as dibujan la actividad que más disfrutaron realizando."
    },
    {
        nucleo: "lenguaje_verbal",
        titulo: "Creadores de cuentos",
        inicio: "La educadora lee un cuento sin mostrar las ilustraciones. Los niños/as imaginan cómo son los personajes y lugares. Luego muestran las imágenes reales y comparan con lo imaginado. Se pregunta: ¿Qué pasaría si cambiamos el final?",
        desarrollo: "En grupos pequeños, los niños/as crean su propio cuento. Eligen personajes, lugar y problema a resolver. Dictan a la educadora la historia que van creando colaborativamente. Realizan dibujos para ilustrar las escenas principales. Practican la narración de su historia, trabajando en pronunciación clara, secuencia temporal (inicio-desarrollo-final), uso de conectores (entonces, después, finalmente).",
        cierre: "Cada grupo presenta su cuento al resto del curso usando sus ilustraciones. Los oyentes hacen preguntas sobre la historia. Se exhiben los cuentos en la biblioteca de aula. Se reflexiona sobre cómo crearon las historias: ¿Qué fue lo más difícil? ¿Cómo se pusieron de acuerdo?"
    },
    {
        nucleo: "lenguajes_artisticos",
        titulo: "Taller de expresión multimodal",
        inicio: "Se presentan diferentes obras de arte visual y musical (pinturas, esculturas, piezas musicales variadas). Los niños/as comparten qué sienten al observarlas o escucharlas: ¿Qué colores ves? ¿Cómo te hace sentir esta música? ¿A qué te recuerda?",
        desarrollo: "Los niños/as eligen una emoción o idea que quieran expresar (alegría, movimiento del mar, el crecimiento de una planta, etc.). La expresan de tres formas: 1) Plástica: pintura, collage o escultura con materiales diversos (témpera, acuarela, papel, arcilla), 2) Corporal: creación de una pequeña danza o secuencia de movimientos con telas o cintas, 3) Musical: composición de sonidos con instrumentos o elementos sonoros. Trabajan en integrar las tres expresiones.",
        cierre: "Presentación de 'galerías vivientes': cada niño/a muestra su obra plástica, realiza su secuencia de movimiento y sus sonidos. Los compañeros adivinan qué emoción o idea representa. Se conversa sobre las diferentes formas de expresar ideas sin usar palabras. Las obras se exhiben en la sala."
    },
    {
        nucleo: "exploracion",
        titulo: "Investigadores del agua",
        inicio: "La educadora plantea el desafío: ¿Qué pasará si ponemos diferentes objetos en el agua? Se muestran diversos materiales (piedras, madera, plástico, metal, esponja, corcho). Los niños/as hacen predicciones: ¿Flotará o se hundirá? ¿Por qué?",
        desarrollo: "Experimentación en grupos pequeños con contenedores de agua. Prueban cada objeto y registran con dibujos o marcas lo observado (flota/se hunde). Descubren propiedades: transparencia del agua, objetos que absorben agua (esponja), cambios al aplicar fuerza (hundir objetos que flotan). Investigan qué pasa con objetos huecos vs sólidos. Exploran con lupas elementos naturales en el agua. Registran con tablets o dibujos sus descubrimientos.",
        cierre: "Puesta en común de hallazgos. Comparan predicciones iniciales con resultados. Crean un cuadro clasificatorio con dibujos de objetos que flotan y se hunden. Se introduce vocabulario: flotación, hundimiento, absorción. Reflexionan: ¿Por qué algunos objetos pesados flotan? ¿Dónde vemos esto en la vida real? (barcos, patos en el agua)"
    },
    {
        nucleo: "comprension_sociocultural",
        titulo: "Oficios de mi comunidad",
        inicio: "Los niños/as conversan sobre los trabajos de sus familias. Se pregunta: ¿Qué hace un doctor? ¿Un panadero? ¿Un profesor? Se muestran imágenes de diversos oficios y profesiones de la comunidad local. Se propone investigar más sobre ellos.",
        desarrollo: "Se organizan en grupos de investigación para diferentes oficios. Cada grupo: 1) Observa videos o imágenes sobre el oficio, 2) Prepara preguntas para entrevistar a una persona de la comunidad (puede ser presencial o por videollamada), 3) Realiza la entrevista con ayuda de la educadora, 4) Crea afiches informativos con dibujos sobre lo aprendido, 5) Prepara un juego de roles con implementos que representen el oficio.",
        cierre: "Cada grupo presenta su investigación y organiza un rincón temático en la sala. Se realiza un día de 'juego de roles' donde todos pueden experimentar diferentes oficios. Reflexionan sobre cómo cada persona aporta al bienestar de la comunidad. Crean un mural colectivo: 'Los trabajos de nuestra comunidad'."
    },
    {
        nucleo: "pensamiento_matematico",
        titulo: "La tienda matemática",
        inicio: "La educadora presenta el proyecto: crear una tienda en la sala. Pregunta: ¿Qué necesitamos para una tienda? ¿Qué podemos vender? Se muestran diferentes envases y productos. Se conversa sobre las tiendas que conocen y qué se hace allí.",
        desarrollo: "Los niños/as organizan la tienda: 1) Clasifican productos por tipo, color, tamaño, función (aplicando atributos múltiples), 2) Crean precios usando números hasta el 20, 3) Diseñan dinero de juguete con diferentes valores, 4) Organizan productos en estantes usando conceptos de ubicación espacial (arriba/abajo, adelante/atrás), 5) Crean ofertas: '3 productos por $10', 6) Juegan a comprar y vender, contando dinero, comparando cantidades, resolviendo problemas simples de agregar y quitar. Registran ventas con marcas o números.",
        cierre: "Analizan el juego: ¿Qué productos se vendieron más? ¿Menos? Crean un gráfico simple con dibujos. Reflexionan sobre el uso de los números en la vida cotidiana: ¿Para qué sirven los números en una tienda? ¿Qué números vemos en otros lugares? La tienda permanece como rincón de juego, rotando roles de vendedor y comprador."
    }
];

// Estudiantes Demo (25 estudiantes)
const ESTUDIANTES = [
    { id: 1, nombre: "Sofía González", rut: "25.123.456-7" },
    { id: 2, nombre: "Mateo Fernández", rut: "25.234.567-8" },
    { id: 3, nombre: "Valentina Martínez", rut: "25.345.678-9" },
    { id: 4, nombre: "Benjamín López", rut: "25.456.789-0" },
    { id: 5, nombre: "Emilia Rodríguez", rut: "25.567.890-1" },
    { id: 6, nombre: "Lucas Pérez", rut: "25.678.901-2" },
    { id: 7, nombre: "Isidora García", rut: "25.789.012-3" },
    { id: 8, nombre: "Joaquín Silva", rut: "25.890.123-4" },
    { id: 9, nombre: "Martina Muñoz", rut: "25.901.234-5" },
    { id: 10, nombre: "Diego Torres", rut: "25.012.345-6" },
    { id: 11, nombre: "Antonia Flores", rut: "25.123.456-8" },
    { id: 12, nombre: "Tomás Vargas", rut: "25.234.567-9" },
    { id: 13, nombre: "Catalina Rojas", rut: "25.345.678-0" },
    { id: 14, nombre: "Agustín Herrera", rut: "25.456.789-1" },
    { id: 15, nombre: "Amanda Soto", rut: "25.567.890-2" },
    { id: 16, nombre: "Vicente Contreras", rut: "25.678.901-3" },
    { id: 17, nombre: "Florencia Parra", rut: "25.789.012-4" },
    { id: 18, nombre: "Maximiliano Reyes", rut: "25.890.123-5" },
    { id: 19, nombre: "Josefa Navarro", rut: "25.901.234-6" },
    { id: 20, nombre: "Sebastián Espinoza", rut: "25.012.345-7" },
    { id: 21, nombre: "Isabella Morales", rut: "25.123.456-9" },
    { id: 22, nombre: "Gabriel Castro", rut: "25.234.567-0" },
    { id: 23, nombre: "Renata Jiménez", rut: "25.345.678-1" },
    { id: 24, nombre: "Cristóbal Vega", rut: "25.456.789-2" },
    { id: 25, nombre: "Maite Ortiz", rut: "25.567.890-3" }
];

// Función auxiliar para generar indicadores sugeridos
function generarIndicadoresSugeridos(nucleo, oa) {
    const indicadoresPorNucleo = {
        identidad: [
            "Identifica y nombra al menos 4 emociones básicas en sí mismo y en otros.",
            "Comunica sus preferencias y opiniones de manera clara.",
            "Participa activamente en la planificación de actividades grupales.",
            "Demuestra autonomía en actividades de autocuidado.",
            "Reconoce y comunica sus características personales positivas."
        ],
        convivencia: [
            "Participa en actividades colaborativas respetando turnos y acuerdos.",
            "Manifiesta empatía ante situaciones de sus compañeros.",
            "Propone soluciones pacíficas ante conflictos con pares.",
            "Respeta y contribuye a crear normas de convivencia.",
            "Reconoce y valora aportes de diferentes personas de la comunidad."
        ],
        corporalidad: [
            "Coordina movimientos finos con precisión (recortar, enhebrar, dibujar).",
            "Mantiene equilibrio en diferentes desafíos motrices.",
            "Identifica cambios en su cuerpo al realizar actividad física.",
            "Utiliza conceptos espaciales y temporales correctamente en situaciones concretas.",
            "Participa activamente en juegos que involucran movimiento corporal."
        ],
        lenguaje_verbal: [
            "Se expresa oralmente con oraciones completas y vocabulario variado.",
            "Comprende instrucciones de dos o más pasos.",
            "Identifica sonidos iniciales y finales en palabras.",
            "Muestra interés por explorar textos escritos.",
            "Realiza predicciones e inferencias a partir de textos escuchados."
        ],
        lenguajes_artisticos: [
            "Crea producciones artísticas incorporando diversos elementos visuales.",
            "Interpreta canciones y juegos musicales con expresividad.",
            "Representa ideas y experiencias a través del dibujo con detalles.",
            "Expresa emociones mediante el lenguaje corporal y dramático.",
            "Aprecia y comenta obras de arte describiendo características."
        ],
        exploracion: [
            "Formula preguntas y conjeturas sobre fenómenos naturales observados.",
            "Identifica propiedades de objetos mediante exploración.",
            "Establece relaciones de semejanza y diferencia entre seres vivos.",
            "Comunica sus observaciones y descubrimientos de manera clara.",
            "Practica acciones de cuidado del medioambiente."
        ],
        comprension_sociocultural: [
            "Reconoce roles y aportes de miembros de su familia y comunidad.",
            "Aprecia y respeta manifestaciones culturales diversas.",
            "Identifica instituciones y servicios de su entorno.",
            "Representa experiencias sociales en juegos dramáticos.",
            "Comprende la importancia del cuidado de espacios patrimoniales."
        ],
        pensamiento_matematico: [
            "Crea y continúa patrones de al menos 2 elementos.",
            "Clasifica objetos usando dos o más atributos simultáneamente.",
            "Utiliza números hasta el 20 para contar y cuantificar.",
            "Resuelve problemas simples de agregar y quitar en forma concreta.",
            "Emplea conceptos de ubicación espacial y temporal correctamente."
        ]
    };

    return indicadoresPorNucleo[nucleo] || [
        "Demuestra comprensión del objetivo de aprendizaje.",
        "Participa activamente en las experiencias propuestas.",
        "Aplica lo aprendido en situaciones cotidianas."
    ];
}
