import os
import re

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update footer email icon, add spans for icons to allow gap spacing
    # Current:
    # <p>📞 <a href="tel:+86051981660808">+86 0519-81660808</a></p>
    # <p>✉️ <a href="mailto:info@jindrich.com.cn">info@jindrich.com.cn</a></p>
    # <p>📍 <span data-i18n="contact.address">Sanjing Industrial Park...
    
    content = re.sub(
        r'<p>📞\s*<a href="tel:\+86051981660808">\+86 0519-81660808</a></p>',
        r'<p><span>📞</span> <a href="tel:+86051981660808">+86 0519-81660808</a></p>',
        content
    )
    content = re.sub(
        r'<p>✉️?\s*<a href="mailto:info@jindrich\.com\.cn">info@jindrich\.com\.cn</a></p>',
        r'<p><span style="color: var(--color-accent); font-style: normal; font-size: 1.1em; line-height: 1;">✉</span> <a href="mailto:info@jindrich.com.cn">info@jindrich.com.cn</a></p>',
        content
    )
    content = re.sub(
        r'<p>📍\s*<span data-i18n="contact\.address">',
        r'<p><span>📍</span> <span data-i18n="contact.address">',
        content
    )

    # 2. If it's a service page, swap Gallery and Categories, and change page-hero to hero
    filename = os.path.basename(filepath)
    if filename in ['food.html', 'beverage.html', 'dairy.html', 'biopharma.html']:
        # Replace page-hero with hero
        hero_pattern = re.compile(
            r'<!-- ═══ PAGE HERO ═══ -->\s*<section class="page-hero">\s*<div class="hero-bg">\s*(.*?)\s*</div>\s*<div class="hero-overlay"></div>\s*<div class="page-hero-content">\s*(.*?)\s*</div>\s*</section>',
            re.DOTALL
        )
        def hero_repl(m):
            img_tag = m.group(1)
            content_tags = m.group(2)
            return f'''<!-- ═══ HERO ═══ -->
    <section class="hero" id="hero">
        <div class="hero-bg">
            {img_tag}
        </div>
        <div class="hero-overlay"></div>
        <div class="container">
            <div class="hero-content">
                {content_tags}
            </div>
        </div>
    </section>'''
        content = hero_pattern.sub(hero_repl, content)

        # Remove "scrolled" from navbar so it behaves like index.html
        content = content.replace('<nav class="navbar scrolled" id="navbar">', '<nav class="navbar" id="navbar">')

        # Swap Categories and Gallery
        categories_pattern = re.compile(
            r'<!-- ═══ SERVICE CATEGORIES ═══ -->\s*<section class="section section-alt">\s*<div class="container">\s*<div class="service-categories">.*?</div>\s*</div>\s*</section>',
            re.DOTALL
        )
        gallery_pattern = re.compile(
            r'<!-- ═══ GALLERY ═══ -->\s*<section class="section">\s*<div class="container">\s*<div class="section-header fade-in">.*?</section>',
            re.DOTALL
        )
        
        cat_match = categories_pattern.search(content)
        gal_match = gallery_pattern.search(content)
        
        if cat_match and gal_match:
            cat_str = cat_match.group(0)
            gal_str = gal_match.group(0)
            
            # Since gallery doesn't have section-alt and categories does, we might want to swap the section-alt class too?
            # Actually, let's keep the classes on the respective sections, but swap their positions in the file.
            
            # Remove them from their original positions
            content = content.replace(cat_str, '___CAT___')
            content = content.replace(gal_str, '___GAL___')
            
            # Reinsert them in swapped order: Gallery then Categories
            content = content.replace('___CAT___', gal_str)
            content = content.replace('___GAL___', cat_str)

    # Note: Contact page also has a page hero, maybe we only change service pages as requested?
    # User said: "四个 services 页面，top banner 也采用 Hero Section, 和首页一样的效果。"
    # So I only change the 4 service pages.

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base_dir = r"d:\n8n skill\jindrich"
files_to_update = [
    os.path.join(base_dir, "index.html"),
    os.path.join(base_dir, "about.html"),
    os.path.join(base_dir, "contact.html"),
    os.path.join(base_dir, "services", "food.html"),
    os.path.join(base_dir, "services", "beverage.html"),
    os.path.join(base_dir, "services", "dairy.html"),
    os.path.join(base_dir, "services", "biopharma.html"),
]

for fp in files_to_update:
    if os.path.exists(fp):
        update_file(fp)
        print(f"Updated {fp}")
