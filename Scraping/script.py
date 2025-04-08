import requests
import json
from bs4 import BeautifulSoup
from PIL import Image
import os
import re

def get_soup(url):
    response = requests.get(url)
    return BeautifulSoup(response.text,"html.parser") if response.status_code == 200 else "Error: " + str(response.status_code)


def clean_text(elem, split_by=":", index=1, default="?"):
    return elem.text.strip().split(split_by)[index].strip() if elem else default

def clean_list(i, keyword, split_by=":", default=[]):
    elem = i.find('p', string=lambda x: x and keyword in x)
    if elem:
        parts = elem.text.strip().split(split_by, 1)
        if len(parts) > 1:
            return [x.strip() for x in parts[1].split(",")]
    return default

def get_item_expansion(classes):
    if not classes:
        return "?"
    cls = " ".join(classes)
    if "reb" in cls: return "Rebirth"
    if "ab" in cls: return "Afterbirth"
    if "ap" in cls: return "Afterbirth+"
    if "rep" in cls: return "Repentance"
    return cls

def extract_css_properties(clases_css, css_text):
    class_name2 = next((i for i in clases_css if re.search(r'\d', i)), None)
    class_name1 = next((i for i in clases_css if i != 'item' and i != class_name2), None)

    start_address = css_text.find(f".{class_name1}{{")
    if start_address == -1:
        return None, None
    
    end_address = css_text.find("}", start_address)
    css_block_address = css_text[start_address:end_address]

    start_position = css_text.find(f".{class_name2}{{")
    if start_position == -1:
        return None, None
    
    end_position = css_text.find("}", start_position)
    css_block_position = css_text[start_position:end_position]
    
    bg_pos = None
    if "background-position:" in css_block_position:
        bp_start = css_block_position.find("background-position:") + len("background-position:")
        bp_end = css_block_position.find(";", bp_start)
        bg_pos = css_block_position[bp_start:bp_end].strip() if bp_end != -1 else css_block_position[bp_start:].strip()
    
    bg_url = None
    if "background:url(" in css_block_address:
        url_start = css_block_address.find("background:url(") + len("background:url(")
        url_end = css_block_address.find(")", url_start)
        bg_url = css_block_address[url_start:url_end].strip('"\'') if url_end != -1 else None
    
    return bg_pos, bg_url

'''def obtain_image(url,position,width,height):
    response=requests.get(url)
    if response.status_code == 200:
        with open("sprite_sheet.png", 'wb') as f:
            f.write(response.content)
        print("✅ Sprite descargado correctamente")
    else:
        print("❌ Error al descargar el archivo")
    
    sprite_img = Image.open("sprite_sheet.png")
    os.makedirs("sprites_recortados", exist_ok=True)

    cropped = sprite_img.crop((position[0], position[1], position[0] + width, position[1] + height))
    terminado = f"sprites_recortados/{idx}_{nombre.replace(" "."_")}.png"
    cropped.save(terminado)'''


urls = {
    "items": "https://tboi.com/all-items",
    "transformations": "https://tboi.com/transformations",
    "characters": "https://bindingofisaac.fandom.com/es/wiki/Personajes",
}

soup_items = get_soup(urls["items"])
soup_transformations = get_soup(urls["transformations"])
soup_characters = get_soup(urls["characters"])

isaac_quizz = []

#Items

if soup_items:
    items = soup_items.find_all("li", class_="textbox")


    #Esto es lo que no puedo meter en la funcion extract_css_properties 😥
    extra_url = soup_items.find("link", rel="stylesheet")["href"]
    base_url = "https://tboi.com/"
    sprites_items_css_url = base_url + extra_url
    css_text = requests.get(sprites_items_css_url).text


    for i in items:

        item = {
            "item_id": clean_text(i.find('p', class_='r-itemid')),
            "item_title": clean_text(i.find('p', class_='item-title'), split_by=":", index=0),
            "item_expantion": get_item_expansion(i.find('div', class_=True)['class']) if i.find('div', class_=True) else "?",
            "item_quality": clean_text(i.find('p', class_='quality')),
            "item_pool": clean_list(i, "Item Pool:"),
            "item_type": clean_list(i, "Type:"),
            "item_tags": [tag.strip() for tag in i.find('p', class_='tags').text.strip().split("*")[1].split(",")] if i.find('p', class_='tags') else [],
            "item_hint": clean_text(i.find('p', class_=False), split_by=":", index=0),
            "item_image_source": [extract_css_properties(i.find('div', class_=True)['class'] if i.find('div', class_=True) else "?",css_text),"50","50"],
            "item_image_path" : ""
        }
        isaac_quizz.append(item)
else:
    print(f"Error al acceder a los items: {urls['items']}")

#Trransformaciones

if soup_transformations:
    transformations = soup_transformations.find_all("div", class_="trans-box")
    for t in transformations:
        transformation = {
            "transformation_name": t.find("h2").text.strip(),
            "transformation_hint": t.find("p", style=False).text.strip(),
            "transformation_image": "path/to/image.png"
        }
        isaac_quizz.append(transformation)
else:
    print(f"Error al acceder a las transformaciones: {urls['transformations']}")

#Personajes

if soup_characters:
    characters = soup_characters.find_all("a", {"data-tracking": "custom-level-3"})
    for c in characters:
        character = {
            "character_name": clean_text(c.find("span"), split_by=":", index=0),
            "character_image": "path/to/image.png"
        }
        isaac_quizz.append(character)
else:
    print(f"Error al acceder a los personajes: {urls['characters']}")

with open("isaac_quiz.json", "w", encoding='utf-8') as file:
    json.dump(isaac_quizz, file, indent=4, ensure_ascii=False)
    