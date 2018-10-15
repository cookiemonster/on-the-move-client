# OnTheMove 
## Een applicatie in opdracht van het Ministerie van Justitie en Veiligheid

[![BCH compliance](https://bettercodehub.com/edge/badge/cookiemonster/on-the-move-client?branch=master)](https://bettercodehub.com/)


## Table of Contents

1. Installatie
2. Starten van de applicatie
3. Pagina's
4. Providers

## Installatie

`npm install` in de rootfolder
Hernoem `/app-config.example.ts` naar `/app-config.ts` en pas de variabelen aan.

### Push notificaties
#### Android
Login op firebase. Onder projectinstellingen -> algemeen, `google-services.json` downloaden.
Plaatsen in `onthemove-master/platforms/android`. Wanneer deze folder niet bestaat eerst `ionic cordova build android` draaien.

In `app-config.ts` `senderId` invullen. Deze is te vinden onder projectinstellingen -> cloud message.


## Starten van de applicatie
### Browser

Navigeer naar de applicatiefolder en voor uit vanuit de terminal:

```ionic serve```

### Android
Om de applicatie te testen op een android telefoon:

Download en installeer Android Studio. Maak een emulator aan met de naam `Nexus 5X API 26`.
Draai `npm run emulator:android`. Hiermee start je de emulator.
Draai vervolgens `npm run serve:android` hiermee wordt de applicatie op de emulator geinstalleerd. Dit gebeurd met live reloading.


### IPhone
Om de applicatie op een iPhone te testen voor allereerst het volgende commando uit:

```ionic cordova build ios --device```

Merk op dat er een foutmelding getoond wordt. Dit komt omdat de applicatie ondertekend moet worden. In de [/platforms/ios/]() folder is wel een xcode project gegenereerd. Binnen Xcode kan het project ondertekend worden, waarna, tevens in Xcode, de applicatie gepushed kan worden naar de iPhone. Voor meer informatie zie de volgende link: [http://ionicframework.com/docs/intro/deploying/](http://ionicframework.com/docs/intro/deploying/)


## Ontwerp
### config
In deze folder staan de custom config van de `ion-app-scripts`. Deze worden ingeladin in `paackage.json` onder `config`.

### src
#### pages
Alle pagina's (Activities voor Android) staan in `src/app/pages` 
Hierin staan niet de componenten die tussen pagina's gedeeld worden.

#### models
Alle models die voor de app gebruikt worden (MVC).

#### providers
Hierin staan alle `injectable services`. Services die data van een `api` teruggeven worden `providers genoemd`.

#### shared
Hierin staan alle componenten die gebruikt kunnen worden in meerdere pages.




