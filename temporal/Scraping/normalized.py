import os
import json
import cloudinary.uploader
import cloudinary.api
import cloudinary

# CONFIGURAR CLOUDINARY
cloudinary.config(
    cloud_name="djibfrqyb",
    api_key="127998486394698",
    api_secret="5MFzBYHf4QbAa_HVMBOC5iev8ZQ",
    secure=True
)

# RUTA A LA CARPETA DE SPRITES
sprites_folder = "isaac_quizz/sprites"

# CARGAR LOS DATOS SCRAPEADOS
with open("isaac_quizz/isaac_quizz.json", "r", encoding="utf-8") as f:
    data_scrapeada = json.load(f)

archivos_sprites = os.listdir(sprites_folder)

# Función para encontrar el archivo por ID (dejamos nombre tal cual)
def encontrar_sprite(item_id):
    for archivo in archivos_sprites:
        if archivo.startswith(f"{item_id}_") and archivo.endswith(".png"):
            return archivo
    return None

elementos_normalizados = []

for item in data_scrapeada:
    item_id = item["item_id"]
    item_title = item["item_title"]
    archivo = encontrar_sprite(item_id)

    if not archivo:
        print(f"❌ Sprite no encontrado para: {item_id} - {item_title}")
        continue

    ruta_local = os.path.join(sprites_folder, archivo)

    try:
        print(f"⬆️ Subiendo {archivo}...")
        resultado = cloudinary.uploader.upload(
            ruta_local,
            folder="quizzer/items/isaac",
            public_id=archivo.replace(".png", ""),
            resource_type="image",
            format="webp"
        )
        image_url = resultado["secure_url"]
    except Exception as e:
        print(f"❌ Error subiendo {archivo}: {e}")
        continue

    elemento = {
        "element_id": item_id,
        "element_name": item_title,
        "metadata": {
            "hint": item.get("item_hint", ""),
            "image": image_url,
            "extra": {
                "expansion": item.get("item_expantion", ""),
                "quality": int(item.get("item_quality", 0)) if item.get("item_quality", "0").isdigit() else 0,
                "type": item.get("item_type", []) if isinstance(item.get("item_type", []), list) else [item.get("item_type")] if item.get("item_type") not in [None, "", "?"] else [],
                "pool": item.get("item_pool", []) if isinstance(item.get("item_pool", []), list) else [item.get("item_pool")] if item.get("item_pool") not in [None, "", "?"] else [],

            }
        },
        "tags": item.get("item_tags", [])
    }

    elementos_normalizados.append(elemento)

# Estructura completa del quizz
quiz_data = {
    "quiz": {
        "name": "The Binding of Isaac: Items",
        "slug": "isaac-items",
        "category": "Videojuegos",
        "background_image": "",
        "fonts": {
            "primary": "",
            "secondary": ""
        }
    },
    "elements": elementos_normalizados
}

# Guardar JSON final
with open("quiz_data.json", "w", encoding="utf-8") as f:
    json.dump(quiz_data, f, indent=2, ensure_ascii=False)

print("✅ ¡Listo! `quiz_data.json` generado con imágenes subidas sin modificar nombre.")