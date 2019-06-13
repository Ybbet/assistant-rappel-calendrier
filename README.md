# assistant-rappel-calendrier

Ce plugin de [assistant-plugins](https://aymkdn.github.io/assistant-plugins/) permet de lire un fichier ics et de diffuser un rappel d'un événement sur les Google Home.

## Pré-requis

Avant toutes choses, il est nécessaire d'installer `assistant-plugins` et le plugin `assistant-notifier`. Vous devrez les configurer correctement pour profiter pleinement du présent plugin.

## Installation

Si vous n'avez pas installé [assistant-plugins](https://aymkdn.github.io/assistant-plugins/), alors il faut le faire, et sélectionner __rappel-calendrier__ comme plugin.

Si vous avez déjà installé [assistant-plugins](https://aymkdn.github.io/assistant-plugins/), et que vous souhaitez ajouter ce plugin, alors :

* Pour Windows, télécharger [install_rappel-calendrier.bat](https://github-proxy.kodono.info/?q=https://raw.githubusercontent.com/Ybbet/assistant-rappel-calendrier/master/install_rappel-calendrier.bat&download=install_rappel-calendrier.bat) dans le répertoire `assistant-plugins`, puis l'exécuter en double-cliquant dessus.
* Pour Linux/MacOS, ouvrir une console dans le répertoire `assistant-plugins` et taper :
`npm install assistant-rappel-calendrier@latest --save && npm run-script postinstall`

## Configuration

Éditer le fichier `configuration.json` du répertoire assistant-plugins et y indiquer l'url vers votre fichier ics en ligne. Exemple :

```
    "rappel-calendrier": {
      "ics": "https://calendar.google.com/calendar/ical/32ph4p3h4i23u29i4bvkbef%40group.calendar.google.com/private-23hpdfp240o04nl2nvp094jolzef/basic.ics"
    }
```

## Utilisation

Une fois configuré, le plugin lira toutes les minutes le fichier ICS indiqué. À chaque événement commençant le jour même à l'heure de sa lecture (cf. chaque minute), le plugin enverra une commande à `assistant-notifier` sour la forme :
```
notifier_{google_home_id} mon rappel-calendrier
```

Pour se faire, lorsque vous créez un nouvel événément dans le calendrier dédié à ce plugin, vous devez respecter les règles suivantes :
* (requis) __Le titre de l'événement__ sera le texte diffusé votre ou vos Google Home
* (optionnel) __Le descriptif__ _(ou les notes selon votre gestionnaire de calendrier)_ contiendra le ou les noms de Google Home désiré(s). Se référer à la documentation du plugin `assistant-notifier` pour plus de renseignement. Il ne faut pas mettre d'accolades dans le descriptif de l'événement. Il suffit de séparer les identifiants de Google Home par une virgule.

## Avantage

L'utilisation de ce plugin permet de ne plus passer par Pushbullet et IFTTT pour avoir une solution équivalente. De plus, avec l'utilisation des serveurs gratuits de Pushbullet et IFTTT, il est possible qu'il y ait un retard de retransmission du rappel-calendrier sur les Google Home.
De plus, vous pourrez utiliser toutes les fonctionnalités d'un calendrier :
* répétition d'un événement ;
* plusieurs événements dans la journée ;
* partage du calendrier avec d'autres personnes ;
* etc.

## Remarque

Ce plugin n'offre pas de `commande` utilisable par PushBullet car tout se fait de façon indépendante de la plateforme en local sur votre machine.
