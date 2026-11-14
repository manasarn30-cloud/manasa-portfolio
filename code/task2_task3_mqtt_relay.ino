// Tasks 2 & 3 - ESP32 subscribes to an Adafruit IO feed (MQTT) and drives a relay.
// Task 2: the feed is changed from the Adafruit IO dashboard toggle.
// Task 3: the same feed is changed by an IFTTT webhook (Google Assistant voice command).
// The ESP32 code is identical for both - only the publisher changes.
// Library: "Adafruit IO Arduino" (+ Adafruit MQTT Library)
#include <AdafruitIO_WiFi.h>

#define IO_USERNAME "YOUR_ADAFRUIT_USERNAME"
#define IO_KEY      "YOUR_ADAFRUIT_IO_KEY"      // never commit your real key
#define WIFI_SSID   "YOUR_WIFI_SSID"
#define WIFI_PASS   "YOUR_WIFI_PASSWORD"

AdafruitIO_WiFi io(IO_USERNAME, IO_KEY, WIFI_SSID, WIFI_PASS);
AdafruitIO_Feed *bulb = io.feed("bulb");        // MQTT topic: <username>/feeds/bulb

#define RELAY_PIN 26
#define RELAY_ON  LOW      // relay module is ACTIVE-LOW: LOW energises the coil
#define RELAY_OFF HIGH

void handleBulbCommand(AdafruitIO_Data *data) {
  String command = data->toString();
  command.trim();
  command.toUpperCase();

  if (command == "ON" || command == "1") {
    digitalWrite(RELAY_PIN, RELAY_ON);
    Serial.println("RELAY: ON -> bulb powered");
  } else if (command == "OFF" || command == "0") {
    digitalWrite(RELAY_PIN, RELAY_OFF);
    Serial.println("RELAY: OFF -> bulb disconnected");
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, RELAY_OFF);           // start with the bulb OFF (fail-safe)

  bulb->onMessage(handleBulbCommand);           // callback for incoming MQTT messages
  io.connect();
  while (io.status() < AIO_CONNECTED) { Serial.print("."); delay(500); }
  Serial.println("\nAdafruit IO connected! Listening for commands...");

  bulb->get();                                  // fetch the last stored value on start-up
}

void loop() {
  io.run();                                     // keeps the MQTT connection alive
}
