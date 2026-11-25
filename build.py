#!/usr/bin/env python3
"""Pack the site into one self-contained HTML file (fonts, film and all).
Usage: python3 build.py            -> dist/<department-name>.html
Handy for emailing a preview. The live site should use the normal files."""
import base64, json, os, re, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
MIME = {'.svg': 'image/svg+xml', '.woff': 'font/woff', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp'}


def read(path):
    with open(os.path.join(ROOT, path), encoding='utf-8') as f:
        return f.read()


def data_uri(path):
    full = os.path.join(ROOT, path)
    with open(full, 'rb') as f:
        return 'data:%s;base64,%s' % (MIME[os.path.splitext(full)[1].lower()], base64.b64encode(f.read()).decode())


def main():
    html = read('index.html')
    fonts = re.sub(r'url\("\.\./(fonts/[^"]+)"\)', lambda m: 'url("%s")' % data_uri(m.group(1)), read('css/fonts.css'))
    data = read('data/site.js')
    # inline each local media or image file once, and point the data at it
    assets = {}
    for path in sorted(set(re.findall(r'"((?:media|images)/[^"]+\.(?:mp4|jpe?g|png|webp|svg))"', data))):
        if os.path.exists(os.path.join(ROOT, path)):
            assets[path] = data_uri(path)
            data = data.replace('"%s"' % path, '__ASSET["%s"]' % path)
    scripts = ['window.__ASSET=' + json.dumps(assets) + ';\n' + data, read('js/art.js'), read('js/fx.js'), read('js/site.js')]
    for chunk in scripts:
        assert '</script' not in chunk.lower()
    html = re.sub(r'<link rel="(?:icon|apple-touch-icon)"[^>]*>\n', '', html)   # the single file travels without its icon files
    html = re.sub(r'<!--FONTS-->.*?<!--/FONTS-->', lambda m: '<style>' + fonts + '</style>', html, flags=re.S)
    html = re.sub(r'<!--CSS-->.*?<!--/CSS-->', lambda m: '<style>' + read('css/site.css') + '</style>', html, flags=re.S)
    html = re.sub(r'<!--JS-->.*?<!--/JS-->', lambda m: ''.join('<script>%s</script>\n' % chunk for chunk in scripts), html, flags=re.S)
    town = re.search(r'town:\s*"([^"]+)"', data).group(1)
    company = re.search(r'companyTemplate:\s*"([^"]+)"', data).group(1).replace('{town}', town)
    name = re.sub(r'[^a-z0-9]+', '-', company.lower()).strip('-') + '.html'
    os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
    out = os.path.join(ROOT, 'dist', name)
    with open(out, 'w', encoding='utf-8') as f:
        f.write(html)
    print(out, '%.1f MB' % (os.path.getsize(out) / 1e6))


if __name__ == '__main__':
    sys.exit(main())
