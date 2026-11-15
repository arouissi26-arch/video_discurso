# Clips reales

`clip_1.mov` está dividido en partes para que cada archivo sea menor que el
límite de 100 MB de GitHub. `clip_2.mov` está guardado completo como archivo
normal.

Para reconstruir `clip_1.mov` desde la raíz del repositorio en Linux o macOS:

```sh
cat clips_reales/clip_1.mov.part-* > clips_reales/clip_1.mov
```

También se puede unir con Python desde cualquier plataforma:

```python
from pathlib import Path

parts = sorted(Path("clips_reales").glob("clip_1.mov.part-*"))
with open("clips_reales/clip_1.mov", "wb") as output:
    for part in parts:
        with part.open("rb") as source:
            while chunk := source.read(1024 * 1024):
                output.write(chunk)
```

Verifica el archivo reconstruido con SHA-256:

```sh
sha256sum clips_reales/clip_1.mov
```

El resultado esperado es:

```text
2f0d825199acea1ee0c50cf273a835d2555b636237c2efc489e49431b935e34d
```
