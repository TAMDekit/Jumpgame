# 💖 Heart Jump - ศึกกระโดดคู่รัก (2-Player Jumping Battle)

<p align="center">
  <img src="https://img.shields.io/badge/Version-2.0.0-pink.svg?style=for-the-badge" alt="Version 2.0" />
  <img src="https://img.shields.io/badge/Made%20With-HTML5%20%7C%20Canvas%20%7C%20JS-rose.svg?style=for-the-badge" alt="Tech Stack" />
  <img src="https://img.shields.io/badge/Multiplayer-PeerJS%20WebRTC-blue.svg?style=for-the-badge" alt="WebRTC" />
  <img src="https://img.shields.io/badge/Design-Glassmorphism%20%26%20Kawaii-purple.svg?style=for-the-badge" alt="Style" />
</p>

<p align="center">
  <b>เกมกระโดดแข่งขันสุดน่ารักสำหรับคู่รักและเพื่อนสนิท แข่งกันไต่แท่นสู่จุดสูงสุด ใครแพ้ต้องโดนทำโทษตามสัญญาใจ! 🍲💆‍♂️✨</b>
</p>

---

## 🌟 จุดเด่นของเกม (Key Features)

### 1. 🎮 โหมดการเล่นที่หลากหลาย (Game Modes)
- 🖥️ **Local 2-Player (เล่น 2 คนบนจอเดียวกัน)**: แชร์คีย์บอร์ด หรือแบ่งหน้าจอมือถือ/แท็บเล็ต แข่งกันข้างๆ แบบเรียลไทม์
- 🌐 **Online Multiplayer (เล่นออนไลน์ข้ามเครื่อง)**: สร้างห้องด้วยรหัส (เช่น `LOVE-1234`) เชื่อมต่อกันแบบ P2P ผ่าน WebRTC โดยไม่ต้องลงแอป
- 🤖 **Solo VS Bot (โหมดฝึกซ้อม)**: ประลองฝีมือกับบอท AI ก่อนไปท้าแฟนตัวจริง

### 2. 🎨 ปรับแต่งตัวละครน่ารักสไตล์ Kawaii (Character Customization)
- **เลือกสัตว์เลี้ยงแสนน่ารัก**: 🐰 กระต่ายน้อย (Bunny), 🐱 ลูกแมวเหมียว (Cat), 🐻 หมีนุ่มนิ่ม (Bear), 🐶 ชิบะจอมซน (Shiba), 🐧 เพนกวินดุ๊กดิ๊ก (Penguin)
- **เครื่องประดับสุดเก๋**: 🎀 โบว์ชมพู, 👑 มงกุฎเจ้าหญิง/เจ้าชาย, 🕶️ แว่นตาสุดคูล, 🪽 ปีกนางฟ้า, 🌸 ดอกไม้น่ารัก
- **เลือกโทนสีตามใจชอบ**: ชมพูกุหลาบ, แดงสตรอว์เบอร์รี่, ฟ้าสดใส, ม่วงพาสเทล, ส้มอบอุ่น, เขียวมินต์ ฯลฯ
- **ระบบ Squash & Stretch Physics**: ตัวละครเด้งดึ๋ง เอียงตามทิศทาง และกะพริบตาอย่างมีชีวิตชีวา

### 3. 💌 ระบบเดิมพัน & บทลงโทษคู่รัก (Love Bet System)
- ตั้งบทลงโทษล่วงหน้าก่อนเริ่มแข่ง เช่น:
  - 🍲 *คนแพ้ต้องเลี้ยงชาบู!*
  - 💆‍♂️ *คนแพ้ต้องนวดให้ 15 นาที*
  - 🧼 *คนแพ้ต้องล้างจาน 3 วัน*
  - 📜 *คนแพ้ต้องทำตามสั่ง 1 ข้อ*
  - ✏️ *ตั้งข้อความเดิมพันเองได้ตามต้องการ!*
- มีระบบบันทึกแต้มคะแนนสะสมระหว่างคู่รัก (🏆 P1 vs P2)

### 4. 🚀 แท่นกระโดดและไอเทมสุดป่วน (Platforms & Power-ups)
- **ประเภทแท่นกระโดด**:
  - 🟩 **แท่นปกติ**: กระโดดเด้งระดับมาตรฐาน
  - 🟦 **แท่นเคลื่อนที่**: ขยับไปมา ซ้าย-ขวา ท้าทายความแม่นยำ
  - 🟫 **แท่นเปราะบาง**: เหยียบครั้งเดียวแตกสลายทันที!
  - ❄️ **แท่นน้ำแข็ง**: กระโดดเตี้ยลงและลื่นไถล
  - 🟡 **แท่นสปริง**: ส่งตัวพุ่งทะยานสู่ฟ้าอย่างแรง!
- **ไอเทมเพิ่มพลัง & กลั่นแกล้ง**:
  - 🚀 **Rocket**: จรวดขับดัน พุ่งทะลวงขึ้นฟ้าอย่างรวดเร็ว
  - 🛡️ **Shield**: เกราะป้องกันคุ้มกันการโจมตี
  - 🥾 **Spring Boots**: รองเท้าติดสปริง กระโดดสองเด้งกลางอากาศได้ต่อเนื่อง
  - ❄️ **Freeze**: แช่แข็งคู่ต่อสู้ไม่ให้ขยับชั่วขณะ!
  - 🔄 **Swap**: สลับตำแหน่งกับคู่ต่อสู้ทันที พลิกเกมเสี้ยววินาที!

### 5. 🎵 เสียงสังเคราะห์ & เอฟเฟกต์สดใส (Procedural Audio & FX)
- ระบบเสียง Procedural Sound ด้วย **Web Audio API** ปรับเปิด-ปิดเสียงได้
- เอฟเฟกต์อนุภาคหัวใจลอยฟุ้ง (Floating Hearts) และละอองดาวฉลองชัยชนะ (Confetti)

---

## ⌨️ การควบคุม (Controls)

| ผู้เล่น | การเคลื่อนที่ (Move) | กระโดดสองจังหวะ (Double Jump) | ใช้ไอเทม (Use Item) |
| :--- | :---: | :---: | :---: |
| **💖 Player 1 (ซ้าย)** | <kbd>A</kbd> / <kbd>D</kbd> | <kbd>W</kbd> | <kbd>Spacebar</kbd> |
| **💙 Player 2 (ขวา)** | <kbd>◀</kbd> / <kbd>▶</kbd> | <kbd>▲</kbd> | <kbd>Enter</kbd> |

> 📱 **สำหรับมือถือ / แท็บเล็ต / จอสัมผัส**: สามารถกดปุ่ม **Touch D-Pad** จำลองบนหน้าจอได้ทันทีทั้ง 2 ฝั่ง!

---

## 🛠️ โครงสร้างโปรเจกต์ (Project Structure)

```text
Game/
├── index.html          # หน้าเว็บหลัก, DOM Layout, โครงสร้าง UI Glassmorphism
├── css/
│   ├── style.css       # ดีไซน์โทนสีชมพูหวาน, การ์ดโปร่งแสง, เลย์เอาต์เรสปอนซีฟ
│   └── game.css        # สไตล์สำหรับ Game Canvas, HUD, และ Touch D-pad
├── js/
│   ├── app.js          # Controller หลัก จัดการ UI Flow, สลับหน้า, บันทึกคะแนน
│   ├── game.js         # Loop ของเกม, กฎการแพ้ชนะ, การสร้างแท่นและไอเทม
│   ├── character.js    # เรนเดอร์ตัวละครสัตว์ Kawaii, ฟิสิกส์ Squash & Stretch
│   ├── physics.js      # ระบบฟิสิกส์, การชนแท่น, กล้องติดตามตัวละคร
│   ├── particle.js     # Particle FX: หัวใจ, ฝุ่นควัน, ไอเทม และ Confetti
│   ├── audio.js        # ตัวสร้างเสียง Synthesizer ด้วย Web Audio API
│   └── network.js      # ระบบ P2P Real-time Sync ผ่าน PeerJS WebRTC
└── README.md           # เอกสารประกอบโปรเจกต์
```

---

## 🚀 วิธีการเปิดเล่น (How to Run)

### วิธีที่ 1: เปิดไฟล์ตรงผ่าน Browser
ดับเบิลคลิกไฟล์ `index.html` เพื่อเปิดเล่นบนเว็บเบราว์เซอร์สมัยใหม่ เช่น Google Chrome, Safari, Edge, หรือ Firefox ได้ทันที

### วิธีที่ 2: รันผ่าน Local Web Server (แนะนำสำหรับการเล่นออนไลน์ PeerJS)
ใช้โปรแกรมจำลอง Server เช่น:
- **VS Code Live Server**: คลิกขวาที่ `index.html` แล้วเลือก `Open with Live Server`
- **Node.js**:
  ```bash
  npx serve .
  ```
- **Python**:
  ```bash
  python -m http.server 8000
  ```

---

## 💖 ขอให้สนุกกับการเล่นกับคนที่คุณรัก! 
Made with ❤️ for couples & besties everywhere.
