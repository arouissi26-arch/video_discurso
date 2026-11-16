# Exposició: Intel·ligència Artificial

Plantilla Remotion vertical 1080 × 1920, 30 fps. `Main` contiene portada, los clips en orden, transición de 6 fotogramas, subtítulos y cierre. `Intro` y `Outro` también son composiciones independientes. No hay música añadida. Las fuentes Space Grotesk están empaquetadas localmente para que el render no dependa de Google Fonts en tiempo de ejecución.

## Recuperar los originales y renderizar

Requisitos: Node.js, npm, Python 3, Git y Chromium o Chrome compatible con Remotion (Remotion puede descargar su navegador con `npx remotion browser ensure`). Se necesitan varios GB libres. Los archivos MOV originales permanecen intactos y las copias de `public/` no se versionan.

```sh
npm ci
./scripts/recover-clips.sh
mkdir -p out
npm run check
npm run render
```

El resultado es `out/final.mp4` (H.264 CRF 18, AAC 192 kb/s). Para usar un Chromium ya instalado, pasar su ruta:

```sh
npm run render -- --browser-executable=/ruta/a/chromium
```

`recover-clips.sh` descarga de Git el commit fuente exacto indicado en el README de `clips_reales`, concatena las cuatro partes en `public/clip_1.mov`, copia `clip_2.mov` y verifica ambos SHA-256. No cambia de rama. Alternativamente, copiar manualmente los originales verificados a `public/` con esos nombres.

## Personalización y subtítulos

- Editar `[NOM]`, `[ASSIGNATURA]` y `[CURS]` en `src/config.ts` (`defaultTitles`). También se pueden pasar props desde Remotion.
- Editar los textos de portada/cierre en `src/Cards.tsx`, la paleta y familia en `src/theme.ts`. La fuente se importa en `src/Main.tsx`; instalar/importar la fuente local deseada y actualizar `theme.font` para cambiarla.
- `src/captions.json` contiene páginas con una palabra por objeto y tiempos **absolutos** en milisegundos, con el desplazamiento de la intro y transición incluido. Para editar el SRT después de cambiar los datos:

```sh
python3 scripts/export-srt.py
```

El SRT exportado se llama `subtitols.srt`. El texto se ha corregido con el guion suministrado y el reconocimiento, pero **debe revisarse escuchando la grabación**: Whisper small cometió errores y las palabras corregidas sin correspondencia se han interpolado. No se debe dar por verificada la sincronización fina ni asumir que todas las palabras del guion se pronunciaron literalmente. La generación inicial empleó `faster-whisper` local (modelo small int8, catalán y tiempos por palabra), no Whisper.cpp, debido a restricciones de descarga; `scripts/transcribe.py` y `scripts/captions.py` documentan el proceso, pero requieren archivos de modelo y transcripción en `.cache/`, que no se incluyen.

## Decisiones y mejoras

- Audio original AAC estéreo 48 kHz: niveles medios −38,0 y −37,5 dBFS. Atenuación conservadora de ~0,5 dB del segundo clip y fundidos; no se ha aplicado reducción de ruido o EQ destructiva. Se conserva la pausa antes del enlace.
- La corrección de transcripción y tiempos es la mejora prioritaria: revisar oído y ajustar `src/captions.json`, especialmente las frases corregidas y la transición. Se recomienda comprobar tanto los subtítulos incrustados como el SRT.
- Después: revisar cortes y ritmo con escucha completa, limpiar ruido y ecualizar con escucha crítica, y ajustar color con referencias reales. Los punch-ins y las tarjetas son opcionales: pueden tapar al orador o distraer.
- Accesibilidad: SRT externo editable, alto contraste y ubicación bajo el rostro; el recuadro ocupa parte de las piernas por el encuadre vertical de cuerpo entero. Revisar también visualización en móvil y lectura en dos líneas.
- Render: concurrencia 1 para entornos con poca memoria; aumentarla con `npm run render -- --concurrency 2` si el equipo lo permite. Remotion reutiliza el bundle en caché. Props y tema facilitan la reutilización.

Si el render completo agota la memoria, `./scripts/render-chunks.sh` renderiza tres rangos continuos con una caché limitada y los une usando `ffmpeg` instalado en el sistema. Este método recodifica el audio AAC una vez adicionalmente; es necesario verificar los empalmes. Si se modifica la duración total en `src/config.ts`, actualizar también los rangos del script.
