#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>

int relayInput = 2;

// Set these to run example.
#define FIREBASE_HOST "minor-aa5fb-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "DatZHXIVe5TmI1YSj7pFq6pdC1EHs1Lim3Ob0fVD"
#define WIFI_SSID "Mysterio_Guest"
#define WIFI_PASSWORD "Mysterio_017"

void setup() {
  Serial.begin(9600);

  // connect to wifi.
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());
  
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);

  // Relay Setup
  pinMode(relayInput, OUTPUT); // initialize pin as OUTPUT
}

int n = 0;

void loop() {
  // set value
  Firebase.setFloat("0xE6707721ad79f4519f80D95ef4D961b60893CD76/meter_reading", n);
  // handle error
  if (Firebase.failed()) {
      Serial.print("setting /number failed:");
      Serial.println(Firebase.error());  
      return;
  }

  // get value 
  Serial.print("meter_reading: ");
  Serial.println(Firebase.getFloat("0xE6707721ad79f4519f80D95ef4D961b60893CD76/meter_reading"));

  // Add 1 to n
  n++;
  
  // get value
  Serial.print("switch_state: ");
  Serial.println(Firebase.getInt("0xE6707721ad79f4519f80D95ef4D961b60893CD76/switch_state"));

  // Relay Setup

  if(Firebase.getInt("0xE6707721ad79f4519f80D95ef4D961b60893CD76/switch_state")==0){
    digitalWrite(relayInput, LOW); // turn relay off
    Serial.println("OFF");
  }
  else if(Firebase.getInt("0xE6707721ad79f4519f80D95ef4D961b60893CD76/switch_state")==1){
    digitalWrite(relayInput, HIGH); // turn relay on
    Serial.println("ON"); 
  }

  delay(1000);
}
