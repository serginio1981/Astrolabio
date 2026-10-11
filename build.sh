#!/usr/bin/env sh
# Une las piezas de src/ en un único index.html autocontenido.
set -e
cd "$(dirname "$0")"
{
  printf '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<style>body{margin:0}img{max-width:100%%}[hidden]{display:none!important}</style>\n'
  cat src/head.html
  printf '</head>\n<body>\n'
  cat src/body.html
  printf '<script>\n'
  cat src/data.js src/engine.js src/app.js
  printf '</script>\n</body>\n</html>\n'
} > index.html
