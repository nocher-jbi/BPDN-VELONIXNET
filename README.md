# BPDN-VELONIXNET — Panduan MikroTik, Huawei & Aplikasi e-monev

Situs dokumentasi **offline** untuk kerja NOC harian: panduan praktis berbahasa
Indonesia untuk **MikroTik RouterOS** dan **switch Huawei**, panduan aplikasi
**e-monev PUPR**, plus salinan lengkap manual resmi **RouterOS 7.26**.

Situs statis murni (HTML/CSS/JS) — tanpa server, tanpa build tool. Buka
`index.html` di browser, semuanya jalan tanpa internet.

## Isi

- **`panduan/`** — 10 bab panduan praktis (Bahasa Indonesia):
  dasar RouterOS & akses, IP & routing, firewall & keamanan, DHCP/DNS/NAT,
  bridge & VLAN, PPPoE server/client, queue & bandwidth, routing (statis/OSPF/BGP),
  VPN (WireGuard/IPsec/L2TP), maintenance & monitoring.
- **`huawei/`** — 14 bab panduan konfigurasi switch **Huawei** (Bahasa Indonesia),
  disusun mengikuti struktur manual MikroTik: Getting Started, Management Plane,
  Hardware & Diagnostics, Wired Switching, Network Services, Routing, MPLS & VPN,
  Reliability, QoS, Security, WLAN AC, Developer Guides, CLI Reference, Appendices.
  Mencakup seri campus (S220/S310/S530/S620, S5700/S6700) dan data center (CloudEngine).
- **`manual/`** — salinan lengkap manual resmi RouterOS 7.26 (23 bab) dalam
  bahasa Inggris, dari *Overview* sampai *CLI Reference* dan *Hardware Guides*.

Total **261 halaman HTML**.

## Fitur

- Pencarian instan (tekan `/`) dengan sorot hasil
- Mode terang / gelap (tombol di kanan atas)
- Sidebar navigasi, breadcrumb, dan tombol Sebelumnya/Berikutnya
- Blok kode dengan tombol **Copy**
- Responsif penuh (HP, tablet, desktop) — sidebar jadi laci geser di layar kecil
- 100% offline — tanpa dependensi eksternal

## Cara pakai

Buka `index.html` langsung di browser, atau sajikan lewat web server statis:

```bash
python3 -m http.server 8080
# lalu buka http://localhost:8080
```

### GitHub Pages

Karena semua file ada di root repo, situs bisa langsung dipublikasikan:

1. **Settings → Pages**
2. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`
3. Situs akan tersedia di `https://nocher-jbi.github.io/BPDN-VELONIXNET/`

## Sumber

- Manual: <https://manual.mikrotik.com> (RouterOS 7.26)
- Panduan praktis disusun dari manual resmi tersebut.

## Catatan versi

Konten manual mengikuti **RouterOS 7.26**. RouterOS v6 memiliki perbedaan pada
beberapa menu (mis. Bridge VLAN filtering, `/routing`, paket Wi-Fi).
