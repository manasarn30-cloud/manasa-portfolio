// Task 1 - ESP32 Web Server & HTML LED Control
// Board: ESP32 DevKit | Onboard LED on GPIO2 (active HIGH)
#include <WiFi.h>
#include <WebServer.h>

const char* ssid     = "YOUR_WIFI_SSID";      // 2.4 GHz network only
const char* password = "YOUR_WIFI_PASSWORD";

WebServer server(80);
const int ledPin = 2;
bool ledState = false;

// ---- HTML interface served by the ESP32 ----
const char PAGE[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>ESP32 LED Control</title>
<style>
  body{font-family:sans-serif;background:#09090b;color:#fafafa;text-align:center;padding-top:60px}
  #bulb{width:120px;height:120px;border-radius:50%;margin:0 auto 30px;background:#3f3f46;transition:all .3s}
  #bulb.on{background:#3b82f6;box-shadow:0 0 40px #3b82f6}
  button{font-size:1.1rem;padding:12px 32px;margin:6px;border:0;border-radius:999px;cursor:pointer}
</style></head><body>
<h1>ESP32 LED Control</h1>
<div id="bulb"></div>
<p>Status: <b id="state">...</b></p>
<button onclick="send('on')">Turn ON</button>
<button onclick="send('off')">Turn OFF</button>
<script>
  // The page talks to the ESP32 with plain HTTP requests (fetch -> /api/...)
  async function send(cmd){ await fetch('/api/' + cmd); refresh(); }
  async function refresh(){
    const s = (await (await fetch('/api/status')).text()).trim();
    document.getElementById('state').textContent = s;
    document.getElementById('bulb').className = (s === 'ON') ? 'on' : '';
  }
  refresh(); setInterval(refresh, 500);   // poll status every 500 ms
</script></body></html>
)rawliteral";

void handleRoot()   { server.send_P(200, "text/html", PAGE); }
void handleOn()     { digitalWrite(ledPin, HIGH); ledState = true;  server.send(200, "text/plain", "ON");  Serial.println("LED turned ON"); }
void handleOff()    { digitalWrite(ledPin, LOW);  ledState = false; server.send(200, "text/plain", "OFF"); Serial.println("LED turned OFF"); }
void handleStatus() { server.send(200, "text/plain", ledState ? "ON" : "OFF"); }

void setup() {
  Serial.begin(115200);
  delay(1000);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.on("/api/on", handleOn);
  server.on("/api/off", handleOff);
  server.on("/api/status", handleStatus);
  server.begin();
  Serial.println("Web server started on port 80");
}

void loop() {
  server.handleClient();
}
