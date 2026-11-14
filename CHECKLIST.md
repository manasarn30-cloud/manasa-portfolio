# Assignment checklist coverage

Legend: ✅ done on the site · 🟡 written part done, **needs your own photo/screenshot/video** · ⬜ not available / not implemented

Media goes in `assets/media/` (exact file names in `assets/media/README.md`).

## Progress at a glance

| Task | Done | Percentage | Still missing |
|---|---|---|---|
| Task 1 | 14 / 15 | **93%** | video of the LED switching from the page |
| Task 2 | 17 / 19 | **89%** | hardware photographs, Adafruit IO dashboard screenshots |
| Task 3 | 18 / 20 | **90%** | IFTTT screenshots, Adafruit IO feed screenshots |
| Task 4 | 16 / 20 | **80%** | login, Firebase database and working-dashboard screenshots, workflow video |
| Task 5 | 17 / 18 | **94%** | graph of the recorded data (optional) |
| **All tasks** | **82 / 92** | **89%** | |

How it is counted: each line of your five checklist images is one item. An item counts as done when the site covers it in writing, code, a photo or a video you sent. Screenshot, photo and video items count as done only when the file is on the site, so the percentages go up as you send files.

## Task 1 — ESP32 Web Server & HTML LED Control ([task1.html](task1.html)) — 93% (14 of 15)
- ✅ Objective of the assignment and the problem being addressed
- ✅ Basic concept of an ESP32 web server
- ✅ How the ESP32 and browser communicate over Wi-Fi
- ✅ Hardware components used
- ✅ Circuit/wiring diagram
- ✅ ESP32 pin connections
- ✅ Complete Arduino/ESP32 source code (`code/task1_web_led.ino` — **replace with your own `ParachutePanic.ino`**)
- ✅ HTML interface developed for controlling the LED
- ✅ How the webpage sends a command to the ESP32
- ✅ Photographs of the physical setup
- ✅ Screenshots of the web interface
- 🟡 Video demonstrating LED ON/OFF control from the webpage (`task1-demo.mp4`)
- ✅ Problems encountered and how they were solved
- ✅ Brief reflection on what you learned
- ✅ All required files/code available in the repository

## Task 2 — Adafruit IO Dashboard & MQTT ([task2.html](task2.html)) — 89% (17 of 19)
- ✅ Purpose of Adafruit IO in an IoT system
- ✅ Basic concept of MQTT
- ✅ MQTT publisher, subscriber and broker identified
- ✅ Role of an MQTT topic/feed
- ✅ Hardware and software used
- ✅ Adafruit IO account created and documented
- ✅ Dashboard and feed configuration documented
- ✅ Communication flow between ESP32, MQTT and Adafruit IO
- ✅ MQTT topic/feed structure used
- ✅ Complete ESP32 source code
- ✅ Explanation of important code sections
- 🟡 Photographs of the hardware setup (`task2-hardware.jpg`, `task2-relay-closeup.jpg`, `task2-bulb-on.jpg`, `task2-bulb-off.jpg`)
- 🟡 Screenshots of the Adafruit IO dashboard (`task2-adafruit-dashboard.png`, `task2-adafruit-feed.png`, `task2-serial.png`)
- ✅ LED/bulb control through the cloud dashboard demonstrated (video)
- ✅ Working demonstration video
- ✅ Problems encountered during MQTT/cloud setup
- ✅ Solutions implemented
- ✅ Brief learning reflection
- ✅ All required files available in the repository

## Task 3 — IFTTT + Adafruit IO IoT Automation ([task3.html](task3.html)) — 90% (18 of 20)
- ✅ Objective · ✅ Basic concept of IoT automation · ✅ What IFTTT is and why it is used
- ✅ Trigger → Action concept · ✅ Role of Adafruit IO · ✅ Hardware and software used
- ✅ IFTTT applet/workflow created and documented · ✅ Trigger used · ✅ Action performed
- ✅ How the trigger reaches the IoT system · ✅ Communication/data-flow diagram · ✅ ESP32 source code
- 🟡 Screenshots of the IFTTT configuration (`task3-ifttt-applet.png`, `task3-ifttt-activity.png`)
- 🟡 Screenshots of the Adafruit IO dashboard/feed (`task3-adafruit-feed.png`, `task3-serial.png`)
- ✅ Photographs of the working prototype
- ✅ Video demonstrating the complete automation
- ✅ Automation tested under different conditions
- ✅ Problems and their solutions · ✅ What you learned about cloud-based automation · ✅ Brief reflection

## Task 4 — Firebase IoT Monitoring Dashboard ([task4.html](task4.html)) — 80% (16 of 20)
Live dashboard: https://manasa-easports.web.app/
- ✅ Objective · ✅ Cloud computing · ✅ IaaS, PaaS, SaaS and BaaS · ✅ Cloud platform · ✅ Database
- ✅ Firebase Realtime Database · ✅ Cloud-based dashboard · ✅ Authentication and login · ✅ Authentication vs Authorization
- ✅ Firebase project setup · ✅ Firebase Authentication configuration · ✅ Realtime Database structure
- ✅ Database/data-flow architecture · ✅ Complete dashboard source code
- ⬜ Screenshots of the login page — not available (live dashboard linked instead: https://manasa-easports.web.app/)
- ⬜ Screenshots of the Firebase database — not available
- ⬜ Screenshots of the working dashboard — not available (the live dashboard link is on the Task 4 page, but it is not a screenshot)
- ⬜ Video demonstrating the webpage workflow — not available
- ✅ Problems encountered and their solutions · ✅ Brief reflection

## Task 5 — Firebase Logging, Automation & Data Export ([task5.html](task5.html)) — 94% (17 of 18)
- ✅ Objective of the complete IoT system · ✅ Final system architecture documented
- ✅ DHT11 temperature and humidity monitoring · ✅ LDR-based light level monitoring
- ✅ Manual bulb control · ✅ Automatic bulb control using LDR · ✅ Manual/Automatic mode · ✅ Logic for automatic lighting
- ✅ LDR threshold/calibration method · ✅ Historical data logging in Firebase · ✅ Database structure for logs
- ✅ Timestamped sensor readings · ✅ Temperature and humidity values · ✅ LDR/light-level values · ✅ Bulb status and mode recorded
- ✅ Historical data displayed on the dashboard (code, description and the live dashboard link; no screenshot available)
- ⬜ Graph/chart for recorded sensor data — *not implemented* (the checklist marks it "if implemented"; the table and CSV export are in place)
- ✅ CSV data download implemented (code and description; no screenshot available)
- ⬜ Hardware photos and demo video — not available

## Things only you can confirm
- That `code/*.ino` matches the sketches you actually flashed. The versions here were assembled from the project documents; compile and test them on your board.
- That every screenshot hides API keys, AIO keys and passwords.
