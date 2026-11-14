// Tasks 4 & 5 - ESP32 environmental monitor (DHT11 + LDR) with Firebase RTDB logging,
// manual/automatic relay control and fail-safe behaviour.
// Libraries: "Firebase ESP Client" (Mobizt), "DHT sensor library" (Adafruit)
#include <WiFi.h>
#include <DHT.h>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>

#define WIFI_SSID      "YOUR_WIFI_SSID"
#define WIFI_PASSWORD  "YOUR_WIFI_PASSWORD"
#define API_KEY        "YOUR_FIREBASE_WEB_API_KEY"
#define DATABASE_URL   "https://YOUR-PROJECT-default-rtdb.firebaseio.com"
#define DEVICE_EMAIL   "device@example.com"     // a dedicated Firebase Auth user for the ESP32
#define DEVICE_PASS    "YOUR_DEVICE_PASSWORD"

#define DHT_PIN   4
#define LDR_PIN   34            // input-only ADC1 pin
#define RELAY_PIN 26
#define RELAY_ON  LOW           // active-LOW relay module
#define RELAY_OFF HIGH
#define SENSOR_INTERVAL 2000UL
#define OFFLINE_TIMEOUT 30000UL // relay forced OFF if Wi-Fi is down this long

DHT dht(DHT_PIN, DHT11);
FirebaseData fbWrite, fbSettings, fbBulb;   // one object per stream / one for writes
FirebaseAuth auth;
FirebaseConfig config;

int ldrThreshold = 2500;        // 0-4095 (12-bit ADC); higher value = darker room
bool relayState = false;
String mode = "manual";
unsigned long lastPush = 0, lastOnline = 0;

// 15-sample average (8 ms apart) to smooth LDR noise
int readLDR() {
  long sum = 0;
  for (int i = 0; i < 15; i++) { sum += analogRead(LDR_PIN); delay(8); }
  return sum / 15;
}

void applyRelay(bool on) {
  relayState = on;
  digitalWrite(RELAY_PIN, on ? RELAY_ON : RELAY_OFF);
  Serial.println(on ? "Relay: ON" : "Relay: OFF");
}

void handleStreams() {
  // /appliances/bulbState  (manual command from the dashboard)
  if (Firebase.RTDB.readStream(&fbBulb) && fbBulb.streamAvailable() && fbBulb.dataType() == "boolean") {
    bool wanted = fbBulb.boolData();
    if (mode == "manual" && wanted != relayState) applyRelay(wanted);
  }
  // /settings  (mode + ldrThreshold)
  if (Firebase.RTDB.readStream(&fbSettings) && fbSettings.streamAvailable()) {
    String p = fbSettings.dataPath();
    if (fbSettings.dataType() == "json") {                 // first event delivers the whole node
      FirebaseJson &j = fbSettings.jsonObject();
      FirebaseJsonData d;
      if (j.get(d, "mode")) mode = d.stringValue;
      if (j.get(d, "ldrThreshold")) ldrThreshold = d.intValue;
    } else if (p == "/mode") {
      mode = fbSettings.stringData();
    } else if (p == "/ldrThreshold") {
      ldrThreshold = fbSettings.intData();
    }
    Serial.printf("Settings -> mode=%s threshold=%d\n", mode.c_str(), ldrThreshold);
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, RELAY_OFF);           // always boot with the relay OFF
  dht.begin();

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println("\nWiFi connected");

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  auth.user.email = DEVICE_EMAIL;
  auth.user.password = DEVICE_PASS;
  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  Firebase.RTDB.beginStream(&fbBulb, "/appliances/bulbState");
  Firebase.RTDB.beginStream(&fbSettings, "/settings");
  lastOnline = millis();
  Serial.println("System initialised");
}

void loop() {
  // Fail-safe: no Wi-Fi for too long -> relay OFF
  if (WiFi.status() == WL_CONNECTED) lastOnline = millis();
  else if (relayState && millis() - lastOnline > OFFLINE_TIMEOUT) applyRelay(false);

  if (Firebase.ready()) handleStreams();

  if (millis() - lastPush >= SENSOR_INTERVAL) {
    lastPush = millis();

    float t = dht.readTemperature();
    float h = dht.readHumidity();
    int ldr = readLDR();
    if (isnan(t) || isnan(h)) { Serial.println("DHT read failed - skipping"); return; }

    // Automatic mode: dark room (high LDR value) -> bulb ON
    if (mode == "automatic") {
      bool shouldBeOn = (ldr > ldrThreshold);
      if (shouldBeOn != relayState) {
        applyRelay(shouldBeOn);
        Firebase.RTDB.setBool(&fbWrite, "/appliances/bulbState", relayState);
      }
    }

    // Log one timestamped record per reading under /sensorData/<pushId>
    FirebaseJson json;
    json.set("temperature", t);
    json.set("humidity", h);
    json.set("ldr", ldr);
    json.set("bulbState", relayState);
    json.set("mode", mode);
    json.set("timestamp/.sv", "timestamp");     // server-side timestamp (ms)
    if (Firebase.ready()) Firebase.RTDB.pushJSON(&fbWrite, "/sensorData", &json);

    Serial.printf("Temp: %.1fC | Humidity: %.0f%% | LDR: %d\n", t, h, ldr);
  }
}
