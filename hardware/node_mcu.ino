#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>

int isState = 0;

// Set these to run example.
#define FIREBASE_HOST "endsem-34719-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "i9QZadjF0KMozXHWcvH5M4uPGj6khCd1Yf1TIu2V"
#define WIFI_SSID "Mysterio_Guest"                
#define WIFI_PASSWORD "Mysterio_017"
#define STATE D8     

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
  pinMode(STATE, OUTPUT); // initialize pin as OUTPUT
}

int n = 0;

void loop() {

//  // handle error
//  if (Firebase.failed()) {
//      Serial.print("setting /number failed:");
//      Serial.println(Firebase.error());  
//      return;
//  }
  
  if(Firebase.getInt("0xE6707721ad79f4519f80D95ef4D961b60893CD76/switch_state")==1){
    isState = Firebase.getInt("0xE6707721ad79f4519f80D95ef4D961b60893CD76/switch_state");
    Serial.println("isState: ");
    Serial.println(isState);
    // turn relay on
    digitalWrite(STATE, HIGH);
    Serial.println("ELECTRICITY ON");
    // set value
    Firebase.setFloat("0xE6707721ad79f4519f80D95ef4D961b60893CD76/meter_reading", n);
    // Add 1 to n
    n++;
  }
  else{
    isState = Firebase.getInt("0xE6707721ad79f4519f80D95ef4D961b60893CD76/switch_state");
    Serial.println("isState: ");
    Serial.println(isState);
    // turn relay off
    digitalWrite(STATE, LOW); 
    Serial.println("ELECTRICITY OFF");
  }

  // get value 
  Serial.print("meter_reading: ");
  Serial.println(Firebase.getInt("0xE6707721ad79f4519f80D95ef4D961b60893CD76/meter_reading"));
  
  // get value
  Serial.print("switch_state: ");
  Serial.println(Firebase.getInt("0xE6707721ad79f4519f80D95ef4D961b60893CD76/switch_state"));

  delay(10000);
}
