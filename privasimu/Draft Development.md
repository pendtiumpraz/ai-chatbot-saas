Pemetaan Kebutuhan 


Improvement untuk memudahkan : 
Bisa upload struktur organisasi dan dipetakan untuk pemetaan akses/role.

Prioritas : 
Consent Management
Problem Statement : 
Salah satu Problem statement utama adalah pertanyaan bagaimana jika organisasi partner mengembangkan sendiri consent managementnya?
Jawaban : 
Privasimu sesuai best practice dan berdasarkan pada UU PDP, POJK 22 tahun 2023
Privasimu core businessnya terkait PDP. Partner mendapat update berkala 

Requirement :
Functional : 
No.
Poin
Detail


Implementasi consent management dengan aplikasi yang sudah ada serta demo dengan menggunakan real data;


2.
Implementasi input consent melalui CS (customer service)
Gambaran Flow : 
Pengisian form dilakukan di cabang bank
Customer Service officer yang mengisi form tersebut
Customer tinggal menyetujui dan memberikan ttd digital


3.
Pemetaan agregasi data consent berdasarkan kebutuhan user. 
Bukan berdasarkan consent-nya, tapi dari user memiliki consent apa saja dan aplikasi apa saja;


4.
Memenuhi kebutuhan untuk Riset dengan consent oleh pihak ketiga (orang tua dan wali penyandang disability people)
Bisa digunakan sebagai bahan untuk unique value campaign




Non Functional : 
Fokus ke implementasi Consent Management, Integrasi API ke CRM. (Odoo, Salesforce, )
Input dari berbagai sumber dan channel, output ke CRM, dashboard, dll
Cyber Drill : Simulasi checking, penanganan seperti apa, kemudian dievaluasi. Analyticsnya seperti apa. 
Whitelabeling LMS, untuk modul awareness UU PDP : (Mitra : Justicia Learning Center)
Tahun : 2025 10 Milyar, dari konsultasi : habis dikonsultan, margin gross cuma 25-30%.
On Prem : Tidak ada aktivasi
Gross margin bisa 70% kalau teknologi.





Data Breach Management
Functional : 
No.
Poin
Detail


Membuat arsitektur dan flow data breach management; 
Modul data breach management adalah layanan untuk organisasi mengumpulkan informasi, penanganan dan pelaporan data breach management.
Sistem dikembangkan dari 0
2.
Implementasi dan pengembangan modules ini
Dalam UU No. 27, setiap insiden siber wajib dilaporkan kepada data subjek maupun otoritas pelindungan data pribadi. Pasal 46 berbunyi seperti ini;
Pasal 46
(1) Dalam hal terjadi kegagalan Pelindungan Data Pribadi, Pengendali Data Pribadi wajib pemberitahuan secara tertulis paling lambat 3 x 24 (tiga kali dua puluh empat) jam kepada:
a. Subjek Data Pribadi; dan
b. lembaga.
(2) Pemberitahuan tertulis sebagaimana dimaksud pada ayat (1) minimal memuat:
Data Pribadi yang terungkap;
kapan dan bagaimana Data Pribadi terungkap; dan
upaya penanganan dan pemulihan atas terungkapnya Data Pribadi oleh Pengendali Data Pribadi.
(3) Dalam hal tertentu, Pengendali Data Pribadi wajib memberitahukan kepada masyarakat mengenai kegagalan Pelindungan Data Pribadi.
Dalam modul ini, setidaknya kita bisa membaca layanan yang dibutuhkan adalah (1) otomatisasi template pemberitahuan kegagalan pelindungan data pribadi dan (2) template upaya penanganan dan pemulihan atas terungkapnya Data Pribadi, serta (3) alarm 3 x 24 jam;
Koneksitas dengan aplikasi SIEM, SOAR dan whistleblowing system, dan proses mulai dari deteksi, identifikasi, perbaikan, perlindungan, dan respon terhadap insiden siber;


Non Functional : 
Bebas propose fitur-fitur.
Target awal Q3, bisa dipropose ke Q2 kalau hasil dev AI sudah akomodatif.



===>> Prioritas : 
Modul Data Breach Management : Rencana Q3.



Temuan : 
W4 Maret 2026
No
Modul
Penjelasan
1
User Management masih belum bisa CRUD masih error di superadmin
2.
Consent management belum sesuai
Belum ada form isian yang memuat ttd digital customer.

Belum terintegrasi dengan CRM (Odoo)


3.
Data breach management
Belum ada PICAPA secara spesifik



4
DPIA
Isian organisasi dibuat ada pilihan dropdown [nama, divisi, departemen saling dll].

Ada fitur untuk isi struktur organisasi, kemudian generate otomatis master data usernya.

Fitur Export excel untuk penambahan user sebagai PIC di DPIA



5
Gap Assessment
TFK-FR belum lengkap untuk informasi undang-undang yang relevan. Belum sama dengan yang ada di Privasimu Existing

Belum ada attachment evidence yg mendukung point assessment



6
Dashboard
Belum ada statistik detail risk untuk ROPA

Belum ada statistik detail risk untuk DPIA




7
Data Discovery
Owner masih belum muncul

Dropdown owner berdasarkan Departemen

Belum ada fitur scanning


8
DSR
Buat DSR dengan AI masih tidak bisa tersimpan




Consent Management; (problem statement, bagaimana jika organisasi ngembangin sendiri consent management. Jawaban kita punya library consent dan sudah kajian kesesuaian dengan UU PDP, POJK 22 tahun 2023, dst)
Implementasi consent management dengan aplikasi yang sudah ada serta demo riil data;
Implementasi input consent melalui CS (customer service)
Penggunaan hasil consent management ini dengan CRM contohnya Odoo (* Prioritas);
Agregasi data consent berdasarkan user. Bukan berdasarkan consent-nya tapi dari usernya punya consent apa saja dan aplikasi apa saja;
Riset consent pihak ketiga (orang tua dan wali penyandang disability people)
Data Breach Management; (0-1 (scratch )
Membuat arsitektur dan flow data breach management;
Implementasi dan pengembangan modules ini

Data Discovery;
Scanning unstructured data. Tidak hanya scan link tetapi juga bisa milih folders dan path.
Uji coba scanning unstructured data dengan data dummy besar.
Connector ke berbagai sumber data base
Uji coba connector database 
Bisa memilih column dan raw sendiri
Bisa disambungkan ke DSAR, memasuki masa retensi, dan lihat-melaporkan data pribadi yang harusnya terenkripsi. 
Ketersambungan dengan DSAR bisa mempermudah dalam implementasi pemenuhan hak subjek data saat ada yang Request. Organisasi bisa langsung mencarinya melalui data Mapping yang dihasilkan data Discovery. (Case Bank Mandiri).
Ketersambungan antara data Discovery dan RoPA perlu dikembangkan. Ketersambungan satu tabel/ data ke beberapa RoPA bisa menggambarkan seberapa sering dan pentingnya tabel/ data tersebut.
PRIVA;
On prem PRIVA
Review RoPA dan DPIA
Review kontrak privasi
Explore Qwen dan bedrock


Sekilas tentang Data Breach Management
Modul data breach management adalah layanan untuk organisasi mengumpulkan informasi, penanganan dan pelaporan data breach management.
Dalam UU No. 27, setiap insiden siber wajib dilaporkan kepada data subjek maupun otoritas pelindungan data pribadi. Pasal 46 berbunyi seperti ini;
Pasal 46
(1) Dalam hal terjadi kegagalan Pelindungan Data Pribadi, Pengendali Data Pribadi wajib pemberitahuan secara tertulis paling lambat 3 x 24 (tiga kali dua puluh empat) jam kepada:
a. Subjek Data Pribadi; dan
b. lembaga.
(2) Pemberitahuan tertulis sebagaimana dimaksud pada ayat (1) minimal memuat:
Data Pribadi yang terungkap;
kapan dan bagaimana Data Pribadi terungkap; dan
upaya penanganan dan pemulihan atas terungkapnya Data Pribadi oleh Pengendali Data Pribadi.
(3) Dalam hal tertentu, Pengendali Data Pribadi wajib memberitahukan kepada masyarakat mengenai kegagalan Pelindungan Data Pribadi.
Dalam modul ini, setidaknya kita bisa membaca layanan yang dibutuhkan adalah (1) otomatisasi template pemberitahuan kegagalan pelindungan data pribadi dan (2) template upaya penanganan dan pemulihan atas terungkapnya Data Pribadi, serta (3) alarm 3 x 24 jam;
Koneksitas dengan aplikasi SIEM, SOAR dan whistleblowing system, dan proses mulai dari deteksi, identifikasi, perbaikan, perlindungan, dan respon terhadap insiden siber;
Referensi Data Breach Management
UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi, https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022 
NIST Cybersecurity Framework 2.0, https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf 
ISO 27701: 2025, https://www.iso.org/standard/27701?utm_source=google&utm_medium=ppc_paid_social&utm_campaign=ISO27701&utm_content=gads01&gad_source=1&gad_campaignid=23119986168&gbraid=0AAAAABtQACH5dv8ZGbDMqFAzwZS4dTi1f&gclid=Cj0KCQjwmunNBhDbARIsAOndKpnWLXWXZq0EHc-ecZjUnfTjnzDbL37FWOWuaXdZ63vQ5qk_g2CkxqgaAjmxEALw_wcB
Data Breach Notification EU, https://www.edpb.europa.eu/system/files/2022-01/edpb_guidelines_012021_pdbnotification_adopted_en.pdf
Data Breach Notification Singapore, https://www.pdpc.gov.sg/-/media/files/pdpc/pdf-files/other-guides/guide-on-managing-and-notifying-data-breaches-under-the-pdpa-15-mar-2021.pdf
Data Breach Notification Singapre framework https://www.pdpc.gov.sg/-/media/Files/PDPC/PDF-Files/Other-Guides/Data-Breach-Management/Introduction-to-Managing-Data-Breaches-2-0.pdf
Assessment Data Breach OWASP, Tidak semua data breach perlu dilaporkan, harus ada asesmennya https://mas.owasp.org/MASVS/12-MASVS-PRIVACY/
Assessment Data Breach EU, Tidak semua data breach perlu dilaporkan, harus ada asesmennya https://ico.org.uk/for-organisations/report-a-breach/personal-data-breach-assessment/

















Koordinasi Internal 
29 Maret 2026


Kita update mempelajari privasimu
Beberapa fitur berkaitan kita benchmark, DPIA ROPA Data Discovery - in progress dipelajari
Secara field sudah disesuaikan, tinggal alignment sama konfirmasi beberapa hal. Backend in progress
Perbedaan/Rekomendasi yang kita lakukan
AI Rekomendasi/Insight
User Flow/UX [Menu sidebar]
AI Agent - Privasimu Agent
AI Credit [Enhancement - Insight-nya perlu disimpan]
Dokumentasi
Consent Management & Data Breach Management [Prioritas]
Digital License Management
Konfirmasi & QNA
Data Discovery - Sampai level scanning database/tabel?



Informasi Tambahan : 
Estimasi progress 60-70% 
Form Consent Management 
Data Breach Security Drill -> Digital War Room - Via Telegram (Biar update keseluruhan progress): 

Revisi :
1. Fire drill itu ada di dalam data breach
2. Hasil AI analisis harus disimpan dan agar ketika setelah masuk lagi ke detail ropa atau DPIA atau fitur lain yang telah di analisis, user gak perlu generate analisis ulang bro
3. di Ropa atau DPIA atau fitur lain apabila ada penunjukan dpo maka tinggal ambil user dalam tenant tersebut dengan role dpo di langsung di autofill di ropa atau dpia atau fitur lain yg butuh itu, sesuai dengna email, jabatan, nomor telponnya dan namannya misal, jadi user gak perlu ketik ulang

lalu jabatan itu dibuat jangan free teks, tinggal dropdown aja, buat aja master data jabatan, agar nanti tinggal pilih aja, dan bisa di update juga master data jabatan setiap tenant punya master data jabatan masing2 gitu (karena ga etis kalau master data jabatan itu super admin karena saas, ada masing2 jabatan yang gak sama di banyak company)

4. untuk consent itu nanti dipasang di web orang kan? dan web kita tinggal pantau aja dari sekian user berapa yg setuju berapa yg tidak, gitu kan? harusnya sih hmmm hayo lo gimana tuh

5. lalu ada data discovery itu juga harusnya pakai APi bisa scanning database aplikasi client karena aplikasi ini nanti akan bersifat on prime di client, jadi bisa scanning database client, dan bisa juga scanning folder dan file di client

6. consent itu juga ada consent itemnya apa aja bro gitu lho, bener2 jauh dari kata lengkap dan jauh dari sempurna, bingung juga aku nih

7. PAHAMI semua summary draft development ini! agar client puas