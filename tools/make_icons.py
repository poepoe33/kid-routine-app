#!/usr/bin/env python3
"""由向量描述直接光柵化產生 PWA 圖示 PNG（唔需要任何第三方套件）。"""
import struct, zlib, os, math

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets')

MINT_TOP = (0x26, 0xB5, 0xAA)
MINT_BOT = (0x17, 0x81, 0x79)
FUR = (0xD9, 0xA0, 0x66)
FUR_D = (0xC9, 0x8A, 0x4B)
PINK = (0xF2, 0xB8, 0xA8)
EYE = (0x3F, 0xA3, 0x4D)
NOSE = (0xE8, 0x83, 0x6F)
ORANGE = (0xF0, 0x7A, 0x1F)
WHITE = (255, 255, 255)


def rounded_rect(x, y, w, h, r, px, py):
    if px < x or px > x + w or py < y or py > y + h:
        return False
    cx = min(max(px, x + r), x + w - r)
    cy = min(max(py, y + r), y + h - r)
    return (px - cx) ** 2 + (py - cy) ** 2 <= r * r


def ellipse(cx, cy, rx, ry, px, py):
    return ((px - cx) / rx) ** 2 + ((py - cy) / ry) ** 2 <= 1.0


def triangle(a, b, c, px, py):
    def sign(p1, p2, p3):
        return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1])
    d1, d2, d3 = sign((px, py), a, b), sign((px, py), b, c), sign((px, py), c, a)
    neg = (d1 < 0) or (d2 < 0) or (d3 < 0)
    pos = (d1 > 0) or (d2 > 0) or (d3 > 0)
    return not (neg and pos)


def star(cx, cy, outer, inner, px, py, rot=-math.pi / 2):
    pts = []
    for i in range(10):
        r = outer if i % 2 == 0 else inner
        a = rot + i * math.pi / 5
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    inside = False
    n = len(pts)
    for i in range(n):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % n]
        if (y1 > py) != (y2 > py):
            xi = x1 + (py - y1) / (y2 - y1) * (x2 - x1)
            if px < xi:
                inside = not inside
    return inside


def line_seg(x1, y1, x2, y2, thick, px, py):
    dx, dy = x2 - x1, y2 - y1
    L2 = dx * dx + dy * dy
    if L2 == 0:
        return False
    t = max(0.0, min(1.0, ((px - x1) * dx + (py - y1) * dy) / L2))
    cx, cy = x1 + t * dx, y1 + t * dy
    return (px - cx) ** 2 + (py - cy) ** 2 <= (thick / 2) ** 2


def blend(dst, src, alpha):
    return tuple(int(round(dst[i] * (1 - alpha) + src[i] * alpha)) for i in range(3))


def render(size, maskable=False):
    S = size / 512.0
    scale = 0.78 if maskable else 1.0
    pad = (1 - scale) / 2 * 512 * S

    def T(x, y):  # 512 空間 -> 輸出像素
        return (pad + x * S * scale, pad + y * S * scale)

    buf = bytearray()
    ss = 3  # supersample
    step = 1.0 / ss
    for oy in range(size):
        buf.append(0)  # filter type 0
        for ox in range(size):
            acc = [0, 0, 0]
            for sy in range(ss):
                for sx in range(ss):
                    px, py = ox + (sx + .5) * step, oy + (sy + .5) * step
                    # 背景
                    if maskable:
                        col = list(MINT_TOP)
                        t = py / size
                        col = [int(MINT_TOP[i] * (1 - t) + MINT_BOT[i] * t) for i in range(3)]
                    else:
                        if rounded_rect(0, 0, size, size, 112 * S, px, py):
                            t = py / size
                            col = [int(MINT_TOP[i] * (1 - t) + MINT_BOT[i] * t) for i in range(3)]
                        else:
                            col = [0, 0, 0]
                            continue
                    # 轉返 512 空間做測試
                    ux = (px - pad) / (S * scale)
                    uy = (py - pad) / (S * scale)

                    # 腳印
                    for (bx, by) in ((110, 404), (404, 150)):
                        if ellipse(bx, by, 34, 26, ux, uy):
                            col = blend(tuple(col), WHITE, .18)
                        for k in (-28, 0, 28):
                            if ellipse(bx + k, by - (36 if abs(k) == 28 else 48), 13, 13, ux, uy):
                                col = blend(tuple(col), WHITE, .18)

                    # 耳朵
                    if triangle((160, 166), (132, 86), (214, 128), ux, uy) or \
                       triangle((352, 166), (380, 86), (298, 128), ux, uy):
                        col = list(FUR)
                    # 頭
                    if ellipse(256, 262, 132, 132, ux, uy):
                        col = list(FUR)
                        if triangle((168, 166), (148, 116), (204, 144), ux, uy) or \
                           triangle((344, 166), (364, 116), (308, 144), ux, uy):
                            col = list(PINK)
                        # 眼
                        for ex in (208, 304):
                            if ellipse(ex, 260, 37, 42, ux, uy):
                                col = list(WHITE)
                            if ellipse(ex + 2, 265, 24, 24, ux, uy):
                                col = list(EYE)
                        if ellipse(201, 253, 9, 9, ux, uy) or ellipse(293, 253, 9, 9, ux, uy):
                            col = list(WHITE)
                        # 鼻
                        if triangle((239, 302), (273, 302), (256, 319), ux, uy):
                            col = list(NOSE)
                        # 嘴
                        if line_seg(250, 320, 232, 333, 7, ux, uy) or line_seg(262, 320, 280, 333, 7, ux, uy):
                            col = list(FUR_D)
                        # 鬍鬚
                        for a, b in (((148, 288), (70, 268)), ((148, 310), (70, 314)),
                                     ((364, 288), (442, 268)), ((364, 310), (442, 314))):
                            if line_seg(a[0], a[1], b[0], b[1], 6, ux, uy):
                                col = blend(tuple(col), FUR_D, .75)
                    # 頸巾
                    if rounded_rect(148, 354, 216, 62, 30, ux, uy):
                        col = list(ORANGE)
                    # 星星
                    if star(392, 400, 58, 24, ux, uy):
                        col = list(ORANGE)

                    for i in range(3):
                        acc[i] += col[i]
            n = ss * ss
            buf.extend(bytes(int(acc[i] / n) for i in range(3)))
            buf.append(255)
    return bytes(buf)


def write_png(path, size, data):
    def chunk(typ, payload):
        c = typ + payload
        return struct.pack('>I', len(payload)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)
    ihdr = struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)
    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + \
        chunk(b'IDAT', zlib.compress(data, 9)) + chunk(b'IEND', b'')
    with open(path, 'wb') as f:
        f.write(png)
    print('wrote', path, len(png), 'bytes')


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for sz in (192, 512):
        write_png(os.path.join(OUT, 'icon-%d.png' % sz), sz, render(sz))
    write_png(os.path.join(OUT, 'icon-maskable-512.png'), 512, render(512, maskable=True))
    write_png(os.path.join(OUT, 'icon-180.png'), 180, render(180))
