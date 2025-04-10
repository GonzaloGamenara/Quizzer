import requests
import json
from bs4 import BeautifulSoup
from PIL import Image
import os
import re



def prueba():
    img = Image.open("imagenes_descargadas/ap-cards2.png")
    img.show()

from PIL import Image
import os

def recortar_y_guardar_desde_css(path_imagen, x, y, width, height, nombre_salida):
    x = abs(x)
    y = abs(y)

    imagen = Image.open(path_imagen)
    os.makedirs("recortes", exist_ok=True)

    x2 = x + width
    y2 = y + height

    recorte = imagen.crop((x, y, x2, y2))

    if not isinstance(nombre_salida, str):
        nombre_salida = str(nombre_salida)
    if not nombre_salida.endswith(".png"):
        nombre_salida += ".png"

    ruta_salida = os.path.join("recortes", nombre_salida)
    recorte.save(ruta_salida)

    print(f"✅ Recorte guardado como {ruta_salida}")



recortar_y_guardar_desde_css("imagenes_descargadas/ap-cards2.png",-50,0,39,50,"holacomoestas")
recortar_y_guardar_desde_css("imagenes_descargadas/ap-cards2.png",-89,0,39,50,"holacomoesta2s")