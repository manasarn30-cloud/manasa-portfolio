# Manasa RN — ECE Portfolio

Live site: https://manasarn30-cloud.github.io/manasa-portfolio/

A static portfolio (plain HTML/CSS/JS, hosted on GitHub Pages) with a five-task IoT series built on an ESP32.

| Page | Content |
|---|---|
| `index.html` | Home, about, skills, projects, experience, ProtoSem journal, contact |
| `task1.html` | ESP32 web server & HTML LED control |
| `task2.html` | Adafruit IO dashboard & MQTT (relay + 230 V bulb) |
| `task3.html` | IFTTT + Adafruit IO voice automation |
| `task4.html` | Firebase IoT monitoring dashboard (auth, database, rules). Live: https://manasa-easports.web.app/ |
| `task5.html` | Firebase logging, automation & CSV export |
| `iot-works.html` | IoT Works log: debugging time log, entries, open questions |
| `CHECKLIST.md` | Every assignment checklist item mapped to the page that covers it |

## File structure

```
manasa-portfolio/
├── index.html, task1.html … task5.html, iot-works.html
├── assets/
│   ├── style.css, site.js
│   └── media/          photos, screenshots, videos (see README.md inside)
├── code/
│   ├── task1_web_led.ino              Task 1 sketch + HTML page
│   ├── task2_task3_mqtt_relay.ino     Tasks 2 & 3 ESP32 sketch (Adafruit IO / MQTT / relay)
│   ├── task5_smart_monitor.ino        Tasks 4 & 5 ESP32 firmware (DHT11, LDR, Firebase)
│   ├── task4_dashboard.html           Login + live dashboard + CSV export
│   ├── task4_landing.html             Optional landing page
│   ├── firebase_functions_index.js    Optional Cloud Functions
│   └── database.rules.json            Realtime Database security rules
├── CHECKLIST.md
└── README.md
```

## Setup

### Libraries (Arduino IDE, ESP32 board package installed)
- Task 1: `WiFi`, `WebServer` (included with the ESP32 core)
- Tasks 2 & 3: *Adafruit IO Arduino* and *Adafruit MQTT Library*
- Tasks 4 & 5: *Firebase ESP Client* (Mobizt) and *DHT sensor library* (Adafruit)

### Credentials to configure (placeholders only — never commit real values)

```
WIFI_SSID / WIFI_PASSWORD        2.4 GHz Wi-Fi network
IO_USERNAME / IO_KEY             Adafruit IO username and AIO key (feed name: bulb)
FIREBASE API_KEY, DATABASE_URL   Firebase console > Project settings
DEVICE_EMAIL / DEVICE_PASS       a dedicated Firebase Auth user for the ESP32
firebaseConfig (dashboard)       Firebase console > Project settings > Your apps
IFTTT webhook URL                https://io.adafruit.com/api/v2/<username>/feeds/bulb/data (+ AIO key header)
```

If a key or password was ever pushed to GitHub, regenerate it.

### Useful commands

```bash
# Deploy Firebase (rules / hosting / functions)
firebase deploy
firebase functions:log

# Watch MQTT messages on the Adafruit IO feed
mosquitto_sub -h io.adafruit.com -u <username> -P <aio-key> -t <username>/feeds/bulb

# ESP32 serial output (Linux/macOS); on Windows use the Arduino Serial Monitor at 115200 baud
screen /dev/ttyUSB0 115200
```

## Deployment checklist

**Before deploying**
- [ ] Firebase, Adafruit IO and IFTTT credentials configured and kept out of the repository
- [ ] IFTTT applets tested
- [ ] Database rules published (`code/database.rules.json`)
- [ ] Open sign-ups disabled in Firebase if the dashboard is personal

**Hardware safety (mains)**
- [ ] Relay logic verified at low voltage first (active-LOW)
- [ ] Only the live wire goes through the relay; neutral is not switched
- [ ] Relay boots in the OFF state

**Frontend**
- [ ] Dashboard works in Chrome, Firefox and Safari, on desktop and phone
- [ ] Login/sign-up tested; Google sign-in domain authorised
- [ ] Real-time updates arrive in under about 2 s; CSV export gives a valid file

**Backend**
- [ ] ESP32 connects to Wi-Fi reliably and recovers after a drop
- [ ] DHT11 readings stable; LDR averaging working
- [ ] Firebase receives sensor data; security rules tested with a signed-out browser

**Documentation**
- [ ] Photos, screenshots and videos added to `assets/media/`
- [ ] All checklist items in `CHECKLIST.md` marked done

## Adding media
Copy files into `assets/media/` using the names listed in `assets/media/README.md`. Missing files are hidden automatically, so there are no empty placeholders on the site.
