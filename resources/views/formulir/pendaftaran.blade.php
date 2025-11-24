<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulir Pendaftaran PKBM Dabohaley</title>
    <style>
        @page {
            size: A4;
            margin: 20mm 25mm;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Times New Roman', serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #000;
            padding: 10mm 5mm 0 5mm;
        }

        .header {
            width: 100%;
            margin-bottom: 15px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
        }

        .header-table td {
            vertical-align: top;
            padding: 5px;
        }

        .logo-cell {
            width: 80px;
            text-align: center;
        }

        .logo-circle {
            width: 70px;
            height: 70px;
            border: 2px solid #000;
            border-radius: 50%;
            display: inline-block;
            text-align: center;
            line-height: 70px;
            font-size: 9pt;
            font-weight: bold;
        }

        .header-center {
            text-align: center;
            width: auto;
        }

        .header-center h1 {
            font-size: 13pt;
            font-weight: bold;
            margin: 0;
            line-height: 1.3;
            text-transform: uppercase;
        }

        .header-center p {
            font-size: 9pt;
            margin: 1px 0;
            line-height: 1.3;
        }

        .header-center strong {
            font-weight: bold;
        }

        .divider {
            border-top: 1px solid #000;
            margin: 10px 0;
        }

        .form-title {
            text-align: center;
            font-size: 14pt;
            font-weight: bold;
            margin: 15px 0 10px 0;
            text-decoration: underline;
        }

        .form-subtitle {
            text-align: center;
            font-size: 9pt;
            margin-bottom: 15px;
            line-height: 1.4;
        }

        .form-subtitle strong {
            font-weight: bold;
        }

        .form-section {
            margin-bottom: 10px;
        }

        .form-row {
            margin-bottom: 6px;
            display: table;
            width: 100%;
        }

        .form-label {
            display: table-cell;
            width: 220px;
            font-weight: normal;
            padding-right: 10px;
            vertical-align: top;
        }

        .form-value {
            display: table-cell;
            border-bottom: 1px solid #000;
            min-height: 20px;
            padding-bottom: 2px;
            vertical-align: bottom;
        }

        .form-value-empty {
            border-bottom: 1px solid #000;
            min-height: 20px;
            display: inline-block;
            width: 100%;
        }

        .checkbox-group {
            margin-top: 3px;
        }

        .checkbox-item {
            display: inline-block;
            margin-right: 20px;
        }

        .section-title {
            font-weight: bold;
            font-size: 11pt;
            margin: 15px 0 8px 0;
        }

        .signature-section {
            margin-top: 40px;
            width: 100%;
            text-align: right;
        }

        .signature-date {
            margin-top: 20px;
            margin-bottom: 8px;
        }

        .signature-date-label {
            display: inline-block;
            margin-right: 10px;
            font-size: 10pt;
        }

        .signature-date-field {
            display: inline-block;
            border-bottom: 1px solid #000;
            min-width: 150px;
            min-height: 20px;
            text-align: center;
        }

        .signature-label {
            font-size: 10pt;
            margin-bottom: 50px;
            display: block;
        }

        .signature-box {
            width: 250px;
            text-align: center;
            margin-left: auto;
        }

        .signature-line {
            border-top: 1px solid #000;
            margin-top: 5px;
            padding-top: 5px;
            font-size: 9pt;
        }

        .attachments {
            margin-top: 20px;
            padding: 8px;
            border: 1px solid #000;
        }

        .attachments h4 {
            font-size: 11pt;
            font-weight: bold;
            margin-bottom: 8px;
            text-decoration: underline;
        }

        .attachments ul {
            margin: 0;
            padding-left: 20px;
        }

        .attachments li {
            margin-bottom: 3px;
            font-size: 9pt;
            line-height: 1.3;
        }

        .vertical-text {
            position: absolute;
            right: 15mm;
            top: 50%;
            transform: rotate(90deg);
            transform-origin: center;
            font-size: 9pt;
            white-space: nowrap;
        }

        .currency {
            display: inline-block;
        }
    </style>
</head>

<body>
    <div class="header">
        <table class="header-table">
            <tr>
                <td class="logo-cell">
                    <div class="logo-circle">PKBM<br>DABOHALEY</div>
                </td>
                <td class="header-center">
                    <h1>YAYASAN BINA PENDIDIKAN DABOHALEY (YABINDIKDA)</h1>
                    <p><strong>SATUAN PENDIDIKAN NON FORMAL</strong></p>
                    <p><strong>PUSAT KEGIATAN BELAJAR MASYARAKAT (PKBM)</strong></p>
                    <p><strong>"DABOHALEY"</strong></p>
                    <p>NPSN P9926347 TERAKREDITASI B</p>
                    <p>Jl. Kalkhote RT 02 RW 03 Kampung Nolokla Distrik Sentani Timur<br>
                        Kabupaten Jayapura Propinsi Papua</p>
                    <p>Kode Pos 99359 Kontak Person HP Nomor: 0813 440 14926</p>
                </td>
                <td class="logo-cell">
                    <div class="logo-circle">TUT WURI<br>HANDAYANI</div>
                </td>
            </tr>
        </table>
    </div>

    {{-- <div class="divider"></div> --}}

    <div class="form-title">
        FORMULIR PENDAFTARAN
    </div>

    <div class="form-subtitle">
        CALON PESERTA DIDIK PENDIDIKAN KESETARAAN PAKET A SETARA SD/MI. PAKET B SETARA SMP/MTS<br>
        PAKET C SETARA SMA/MA, PENDIDIKAN ANAK USIA DINI (PAUD) DAN PROGRAM PENDIDIKAN<br>
        KEAKSARAAN DASAR (KD)<br>
        DISESUAIKAN DENGAN DAPODIKMAS ONLINE<br>
        <strong>TAHUN AJARAN 2025/2026</strong>
    </div>

    <div class="divider"></div>

    <div class="form-section">
        <div class="form-row">
            <div class="form-label">1. Nama</div>
            <div class="form-value-empty"></div>
        </div>
        <div class="form-row">
            <div class="form-label">2. Nama lengkap sesuai ijazah/Dokumen Syah</div>
            <div class="form-value-empty"></div>
        </div>
        <div class="form-row">
            <div class="form-label">3. Jenis Kelamin</div>
            <div class="form-value">
                <div class="checkbox-group">
                    <span class="checkbox-item">( ) Laki-laki</span>
                    <span class="checkbox-item">( ) Perempuan</span>
                </div>
            </div>
        </div>
        <div class="form-row">
            <div class="form-label">4. Nomor Induk Siswa Nasional (NISN)</div>
            <div class="form-value-empty"></div>
        </div>
        <div class="form-row">
            <div class="form-label">5. Nomor Induk Kependudukan (NIK)</div>
            <div class="form-value-empty"></div>
        </div>
        <div class="form-row">
            <div class="form-label">6. Tempat Lahir (Sesuai ijazah)</div>
            <div class="form-value-empty"></div>
        </div>
        <div class="form-row">
            <div class="form-label">7. Tanggal Lahir (sesuai ijazah)</div>
            <div class="form-value-empty"></div>
        </div>
        <div class="form-row">
            <div class="form-label">8. Agama</div>
            <div class="form-value-empty"></div>
        </div>
        <div class="form-row">
            <div class="form-label">9. Alamat</div>
            <div class="form-value-empty" style="min-height: 35px;"></div>
        </div>
        <div class="form-row">
            <div class="form-label">10. Kewarganegaraan</div>
            <div class="form-value">
                <div class="checkbox-group">
                    <span class="checkbox-item">( ) WNI</span>
                    <span class="checkbox-item">( ) WNA</span>
                </div>
            </div>
        </div>
        <div class="form-row">
            <div class="form-label">11. Penerimaan KPS</div>
            <div class="form-value">
                <div class="checkbox-group">
                    <span class="checkbox-item">1. Ya</span>
                    <span class="checkbox-item">2. Tidak (coret tidak perlu)</span>
                </div>
            </div>
        </div>
        <div class="form-row">
            <div class="form-label">12. Nomor KPS</div>
            <div class="form-value-empty"></div>
        </div>
        <div class="form-row">
            <div class="form-label">13. Nomor HP Peserta Didik</div>
            <div class="form-value-empty"></div>
        </div>
    </div>

    <div class="section-title">DATA ORANG TUA/WALI</div>

    <div class="form-section">
        <div class="form-row">
            <div class="form-label">14. Nama Ibu Kandung</div>
            <div class="form-value-empty"></div>
        </div>
        <div class="form-row">
            <div class="form-label">15. Pekerjaan Ibu Kandung</div>
            <div class="form-value-empty"></div>
        </div>
        <div class="form-row">
            <div class="form-label">16. Penghasilan Ibu Kandung</div>
            <div class="form-value">
                <span class="currency">Rp. </span>
                <div class="form-value-empty" style="display: inline-block; width: calc(100% - 30px);"></div>
            </div>
        </div>
        <div class="form-row">
            <div class="form-label">17. Tahun Lahir Ibu Kandung</div>
            <div class="form-value-empty"></div>
        </div>
        <div class="form-row">
            <div class="form-label">18. Nama Ayah Kandung</div>
            <div class="form-value-empty"></div>
        </div>
        <div class="form-row">
            <div class="form-label">19. Pekerjaan Ayah</div>
            <div class="form-value-empty"></div>
        </div>
        <div class="form-row">
            <div class="form-label">20. Penghasilan Ayah</div>
            <div class="form-value">
                <span class="currency">Rp. </span>
                <div class="form-value-empty" style="display: inline-block; width: calc(100% - 30px);"></div>
            </div>
        </div>
        <div class="form-row">
            <div class="form-label">21. Tahun Lahir Ayah</div>
            <div class="form-value-empty"></div>
        </div>
        <div class="form-row">
            <div class="form-label">22. Nama Wali</div>
            <div class="form-value-empty"></div>
        </div>
        <div class="form-row">
            <div class="form-label">23. Pekerjaan Wali</div>
            <div class="form-value-empty"></div>
        </div>
        <div class="form-row">
            <div class="form-label">24. Penghasilan Wali</div>
            <div class="form-value">
                <span class="currency">Rp. </span>
                <div class="form-value-empty" style="display: inline-block; width: calc(100% - 30px);"></div>
            </div>
        </div>
        <div class="form-row">
            <div class="form-label">25. Tahun Lahir Wali</div>
            <div class="form-value-empty"></div>
        </div>
        <div class="form-row">
            <div class="form-label">26. Nomor HP orangtua/Wali</div>
            <div class="form-value-empty"></div>
        </div>
    </div>

    <div class="section-title">PILIHAN PROGRAM</div>

    <div class="form-section">
        <div class="form-row">
            <div class="form-label">27. Pilihan Program Paket</div>
            <div class="form-value">
                <div style="margin-top: 5px;">
                    <div style="margin-bottom: 4px;">A. ( ) PAKET A SETARA SD/MI</div>
                    <div style="margin-bottom: 4px;">B. ( ) PAKET B SETARA SMP/MTS</div>
                    <div style="margin-bottom: 4px;">C. ( ) PAKET C SETARA SMA/MA</div>
                    <div style="margin-bottom: 4px;">D. ( ) PENDIDIKAN ANAK USIA DINI (PAUD)</div>
                    <div style="margin-bottom: 4px;">E. ( ) KEAKSARAAN DASAR (KD)</div>
                    <div style="margin-top: 5px; font-size: 9pt; font-style: italic;">
                        (LINGKARI JENJANG PAKET YANG DIMINATI)
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="signature-section">
        <div class="signature-date">
            <span class="signature-date-label">Tanggal:</span>
            <span class="signature-date-field"></span>
        </div>
        <div class="signature-box">
            <div class="signature-label">YANG MENDAFTAR,</div>
            <div class="signature-line">
                (Nama Lengkap)
            </div>
        </div>
    </div>

    <div class="attachments">
        <h4>LAMPIRAN</h4>
        <ul>
            <li>Akta Kelahiran/Surat Baptis (untuk Paket A)</li>
            <li>Ijazah/SKHU SD (untuk Paket B)</li>
            <li>Ijazah/SKHU SMP (untuk Paket C)</li>
            <li>Kartu Keluarga (KK) - 2 lembar</li>
            <li>Foto Pas 2x3 cm - 4 lembar</li>
            <li>Surat Pernyataan Kesediaan Mengikuti Pembelajaran</li>
            <li>Kartu Keluarga dan Foto Pas (untuk PAUD)</li>
            <li>Kartu Keluarga dan Foto Pas (untuk KD)</li>
        </ul>
    </div>
</body>

</html>
