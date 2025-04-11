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

def sanitize_filename(name):
    reemplazos = {
        '?': '[q]',
        '/': '[slash]',
        '\\': '[bslash]',
        ':': '[colon]',
        '*': '[star]',
        '<': '[lt]',
        '>': '[gt]',
        '"': '[quote]',
        '|': '[pipe]'
    }
    
    for char, replacement in reemplazos.items():
        name = name.replace(char, replacement)
    
    return name


def extract_css_properties(clases_css, css_text):
    class_name2 = next((i for i in clases_css if re.search(r'\d', i)), None)
    class_name1 = next((i for i in reversed(clases_css) if i != 'item' and i != class_name2), None)

    # Buscar bloque con background:url y height
    start_address = css_text.find(f".{class_name1}{{")
    if start_address == -1:
        return None, None, None, None
    
    end_address = css_text.find("}", start_address)
    css_block_address = css_text[start_address:end_address]

    # Buscar bloque con background-position y width
    start_position = css_text.find(f".{class_name2}{{")
    if start_position == -1:
        return None, None, None, None
    
    end_position = css_text.find("}", start_position)
    css_block_position = css_text[start_position:end_position]
    
    # Extraer background-position
    bg_pos = None
    if "background-position:" in css_block_position:
        bp_start = css_block_position.find("background-position:") + len("background-position:")
        bp_end = css_block_position.find(";", bp_start)
        bg_pos = css_block_position[bp_start:bp_end].strip() if bp_end != -1 else css_block_position[bp_start:].strip()
        bg_pos = [int(valor.replace('px', '')) for valor in bg_pos.split()]

    # Extraer background-url
    bg_url = None
    if "background:url(" in css_block_address:
        url_start = css_block_address.find("background:url(") + len("background:url(")
        url_end = css_block_address.find(")", url_start)
        bg_url = css_block_address[url_start:url_end].strip('"\'') if url_end != -1 else None

    # Extraer width (de bloque de posición)
    width = None
    if "width:" in css_block_position:
        w_start = css_block_position.find("width:") + len("width:")
        w_end = css_block_position.find(";", w_start)
        width_str = css_block_position[w_start:w_end].strip() if w_end != -1 else css_block_position[w_start:].strip()
        try:
            width = int(width_str.replace("px", ""))
        except ValueError:
            width = 50
    else:
        width = 50  # Valor por defecto

    # Extraer height (de bloque de url)
    height = None
    if "height:" in css_block_address:
        h_start = css_block_address.find("height:") + len("height:")
        h_end = css_block_address.find(";", h_start)
        height_str = css_block_address[h_start:h_end].strip() if h_end != -1 else css_block_address[h_start:].strip()
        try:
            height = int(height_str.replace("px", ""))
        except ValueError:
            height = 50
    else:
        height = 50

    return bg_pos, bg_url, width, height

    

def download_crop_sprite(url, current_url, x, y, width, height, item_title, item_id):
    x = abs(x)
    y = abs(y)

    sprite_title = sanitize_filename(item_title)
    sprite_id = sanitize_filename(item_id)
    
    os.makedirs("Quizzer/scraping/isaac_quizz/sprites", exist_ok=True)

    if f"{sprite_id}_{sprite_title}_sprite.png" in os.listdir(r"C:\Users\Gonza\Desktop\Github\Quizzer\scraping\isaac_quizz\sprites"):
        return (f"Sprite guardado en: {os.path.abspath(f"{sprite_id}_{sprite_title}.png")}")
    else:
        sprite_sheet_filename = "sprite_sheet_crudo.png"

    if current_url != url:
        if os.path.exists(sprite_sheet_filename):
            os.remove(sprite_sheet_filename)

        sprite_sheet_crudo = requests.get(url)
        if sprite_sheet_crudo.status_code == 200:
            with open(sprite_sheet_filename, "wb") as f:
                f.write(sprite_sheet_crudo.content)
            current_url = url
            print(f"Sprite {sprite_id} {sprite_title} guardado correctamente ✅")
        else:
            print("Error al descargar el sprite sheet:", sprite_sheet_crudo.status_code)
            return

    try:
        sprite_sheet = Image.open(sprite_sheet_filename)
    except Exception as e:
        print("Error al abrir el sprite sheet:", e)
        return

    x2 = x + width
    y2 = y + height
    sprite = sprite_sheet.crop((x, y, x2, y2))


    sprite_filename = os.path.join("Quizzer/scraping/isaac_quizz/sprites", f"{sprite_id}_{sprite_title}.png")
    sprite.save(sprite_filename)
    return (f"Sprite guardado en: {os.path.abspath(sprite_filename)}")

    

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

    extra_url = soup_items.find("link", rel="stylesheet")["href"]
    base_url = "https://tboi.com/"
    sprites_items_css_url = base_url + extra_url
    css_text = requests.get(sprites_items_css_url).text

    current_url_sprites = ""

    for i in items:

        item_id = clean_text(i.find('p', class_='r-itemid'))
        item_title = clean_text(i.find('p', class_='item-title'), split_by=":", index=0)

        i_sprite_position,i_sprite_url, sprite_width, sprite_height = extract_css_properties(i.find('div', class_=True)['class'] if i.find('div', class_=True) else "?",css_text)
        print(i_sprite_position)
        if i_sprite_url == None:
            continue
        i_sprite_url = base_url + i_sprite_url[3:]
        #print(f"url modificado= {i_sprite_url}")

        sprite_path = download_crop_sprite(i_sprite_url, current_url_sprites, i_sprite_position[0], i_sprite_position[1], sprite_width, sprite_height, item_title, item_id)

        
        item = {
            "item_id": item_id,
            "item_title": item_title,
            "item_expantion": get_item_expansion(i.find('div', class_=True)['class']) if i.find('div', class_=True) else "?",
            "item_quality": clean_text(i.find('p', class_='quality')),
            "item_pool": clean_list(i, "Item Pool:"),
            "item_type": clean_list(i, "Type:"),
            "item_tags": [tag.strip() for tag in i.find('p', class_='tags').text.strip().split("*")[1].split(",")] if i.find('p', class_='tags') else [],
            "item_hint": clean_text(i.find('p', class_=False), split_by=":", index=0),
            "item_image_path" : sprite_path
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

with open("Quizzer/scraping/isaac_quizz/isaac_quizz.json", "w", encoding="utf-8") as archivo:
    json.dump(isaac_quizz, archivo, indent=4, ensure_ascii=False)