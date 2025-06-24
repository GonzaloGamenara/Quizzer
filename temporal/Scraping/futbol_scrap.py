import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json

ofset = 0
clubes = []

while True:
    url = f"https://es.soccerwiki.org/country.php?countryId=ARG&action=clubs&offset={ofset}"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")

    filas = soup.find_all("tr")[1:]

    for fila in filas:
        tds = fila.find_all("td")
        if len(tds) < 2:
            continue
        name = tds[1].find("a").get_text(strip=True) if tds[1].find("a") else ""
        ciudad = tds[5].get_text(strip=True) if len(tds) > 5 else ""
        division = tds[3].find("a").get_text(strip=True) if len(tds) > 3 and tds[3].find("a") else ""
        imagen = ""
        img_tag = tds[0].find("img")
        if img_tag:
            data_src = img_tag.get("data-src", "")
            imagen = urljoin(url, data_src)
        print(name, ciudad, division, imagen)

        clubes.append({
            "element_name": name,
            "metadata": {
                "hint": ciudad,
                "image": imagen,
                "extra": {
                    "division": division,
                    "ciudad": ciudad
                }
            },
            "tags": [division.lower(), ciudad.lower()]
        })

    print(f"Se extrajeron {len(clubes)} clubes hasta el offset {ofset}")

    if ofset >= 150:
        break
    ofset += 50

for idx, club in enumerate(clubes, start=1):
    club["element_id"] = str(idx).zfill(3) 

quiz_data = {
    "quiz": {
        "name": "Clubes de Fútbol Argentinos",
        "slug": "clubes-argentinos",
        "category": "Deportes",
        "background_image": "https://res.cloudinary.com/djibfrqyb/image/upload/v1750722868/vecteezy_football-stadium-inside-at-night-with-lights-post-production_31689975_bcx1r6.webp",
        "fonts": {
            "primary": {
                "name": "Futbol",
                "import" : "https://res.cloudinary.com/djibfrqyb/raw/upload/v1750722996/football_font_w85g3l.ttf"
            },
            "secondary": {
                "name": "Roboto",
                "import": "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
            }
        }
    },
    "elements": clubes
}

with open("quiz_data.json", "w", encoding="utf-8") as f:
    json.dump(quiz_data, f, indent=2, ensure_ascii=False)

print("✅ Archivo quiz_data.json generado con éxito.")