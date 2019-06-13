var ical = require('node-ical');

/**
 * Transformer la date (de l'event) en timestamp SANS secondes car l'event ne prend pas en compte les secondes (toujours égal à 00)
 * @param date
 * @returns {string}
 */
function event_totimestamp(date) {
  var month = date.getMonth()+1;
  if (month < 10) month="0"+month;
  var day = date.getDate()+1;
  if (day < 10) day="0"+day;
  var hours = date.getHours();
  if (hours < 10) hours = hours="0"+hours;
  var minutes = date.getMinutes();
  if (minutes < 10) minutes = minutes="0"+minutes;
  return date.getFullYear()+'-'+month+'-'+day+' '+hours+':'+minutes+':00';
}

/**
 * Avoir un timestamp pour les logs
 *
 * @returns {string}
 */
function timestamp() {
  var now = new Date();
  var month = now.getMonth()+1;
  if (month < 10) month="0"+month;
  var day = now.getDate()+1;
  if (day < 10) day="0"+day;
  var hours = now.getHours();
  if (hours < 10) hours = hours="0"+hours;
  var minutes = now.getMinutes();
  if (minutes < 10) minutes = minutes="0"+minutes;
  var seconds = now.getSeconds();
  if (seconds < 10) seconds = seconds="0"+seconds;
  return now.getFullYear()+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
}

/**
 * on crée une fonction `AssistantRappelCalendrier`
 * @param {Object} configuration L'objet `configuration` qui vient du fichier configuration.json
 */
var AssistantRappelCalendrier = function(configuration) {
  // par exemple configuration.key si on a `{ "key": "XXX" }` dans le fichier configuration.json
  // exemple: this.key = configuration.key;
  this.ics = configuration.ics;
}

/**
 * Initialisation du plugin AssistantRappelCalendrier
 *
 * @param {Object} plugins Un objet représentant les autres plugins chargés
 * @returns {*}
 */
AssistantRappelCalendrier.prototype.init = function(plugins) {
  // On stocke this et plugins
  var _this=this;
  _this.plugins = plugins;
  // Il faut avoir renseigner l'adresse du fichier ics
  if (!this.ics) return Promise.reject("[assistant-rappel-calendrier] Erreur : vous devez configurer ce plugin !");

  console.log("[assistant-rappel-calendrier] Lancement du cron.");
  // Maintenant que tous les plugins ont été chargéq, on peut lancer l'interval du cron.
  setInterval(function(){
    ical.fromURL(_this.ics, {}, function (err, data) {
      for (let k in data) {
        if (data.hasOwnProperty(k)) {
          var ev = data[k];
          var date = event_totimestamp(new Date());
          if (data[k].type === 'VEVENT') {
            var date_ev = event_totimestamp(ev.start);
            if (date_ev === date && _this.plugins.notifier) {
              console.log("[assistant-rappel-calendrier] (" + timestamp() + ") Un rappel du calendrier à diffuser.");
              if (ev.description.length > 0) {
                // On a indiqué dans la description de l'événement les Google Home désirés
                _this.plugins.notifier.action("{"+ev.description+"} "+ev.summary);
              } else {
                // Il n'y a pas de descriptif, donc, on ne passe pas d'info à notifier.
                _this.plugins.notifier.action(ev.summary);
              }
            }
          }
        }
      }
    });
  }, 60000); // On vérifie toutes les minutes

  return Promise.resolve(this);
};

/**
 * Fonction appelée par le système central
 *
 * @param {String} commande La commande envoyée depuis IFTTT par Pushbullet
 * @return {Promise}
 */
AssistantRappelCalendrier.prototype.action = function(commande) {
  // faire quelque chose avec `commande`
  // votre code sera ici principalement

  // on peut également appeler d'autres plugins, par exemple `notifier`
  // if (this.plugins.notifier) this.plugins.notifier.action("Message à lire sur le Google Home");
};


/**
 * Initialisation du plugin
 *
 * @param  {Object} configuration La configuration
 * @param  {Object} plugins Un objet qui contient tous les plugins chargés
 * @return {Promise} resolve(this)
 */
exports.init=function(configuration, plugins) {
  return new AssistantRappelCalendrier(configuration).init(plugins)
  .then(function(resource) {
    console.log("[assistant-rappel-calendrier] Plugin chargé et prêt.");
    return resource;
  })
}

/**
 * À noter qu'il est également possible de sauvegarder des informations supplémentaires dans le fichier configuration.json général
 * Pour cela on appellera this.plugins.assistant.saveConfig('nom-du-plugin', {configuration_en_json_complète}); (exemple dans le plugin freebox)
 */

