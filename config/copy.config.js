// Custom copy to add the notification icon to the android resources.

var origin = require('@ionic/app-scripts/config/copy.config');

origin.copyAndroidAssets = {
  src: ['{{ROOT}}/resources/android/ic_notification/**/*'],
  dest: '{{ROOT}}/platforms/android/res'
};

module.exports = origin;
