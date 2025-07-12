import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
import cloudinary
import cloudinary.uploader

cloudinary.config(
  cloud_name='djibfrqyb',
  api_key='735783865241769',
  api_secret='dzd8FzLvWmFWNUFno5gACSz44Fo',
  secure=True
)

champs = []
url = "https://leagueoflegends.fandom.com/wiki/List_of_champions"
response = requests.get(url)
soup = BeautifulSoup(response.content, "html.parser")
slug = "campeones-league-of-legends"
x = 1

filas = soup.find_all("tr")[1:]

for fila in filas:
    champ_rows = fila.find_all("td")
    if len(champ_rows) < 2:
        continue

    name = champ_rows[0].get("data-sort-value")
    hint = champ_rows[1].get("data-sort-value")
    year = champ_rows[3].get("data-sort-value")
    image_div = champ_rows[0].find("img")
    if image_div:
        image = image_div.get("data-src")
        image = image.split('/revision')[0]
        res= cloudinary.uploader.upload(
            image, 
            public_id=f"{slug}_element_{x}", 
            folder="Quizzer/campeones-league-of-legends/elements",
            format="webp"
        )
        print("imagen subida correctamente")
        imagenUrl = res["secure_url"]
            
    print(name,hint,imagenUrl)
    
    champs.append({
        "element_name" : name,
        "metadata" :{ 
            "hint" : hint,
            "image" : imagenUrl,
            "extra":{
                "lanzamiento" : year
            }
        },
        "tags": [hint.lower(),year.lower()],
        "element_id" : x
    }) 
    x+=1


quiz_data = {
    "quiz": {
        "name": "Campeones de League of Legends",
        "slug": f"{slug}",
        "category": "Videojuegos",
        "background_image": "https://res.cloudinary.com/djibfrqyb/image/upload/v1752355072/campeones-league-of-legends_background_001_yw34fy.webp",
        "fonts": {
            "primary": {
                "name": "Primaria",
                "import" : "https://res.cloudinary.com/djibfrqyb/raw/upload/v1752355365/campeones-league-of-legends_font_001_muhqww.ttf"
            },
            "secondary": {
                "name": "Secundaria",
                "import": "https://res.cloudinary.com/djibfrqyb/raw/upload/v1752355368/campeones-league-of-legends_font_002_qcbqsn.ttf"
            }
        }
    },
    "elements": champs
}

with open(f"quiz_data_{slug}.json", "w", encoding="utf-8") as f:
    json.dump(quiz_data, f, indent=2, ensure_ascii=False)

print("✅ Archivo quiz_data.json generado con éxito.")