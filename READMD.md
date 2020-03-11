# Atelier Disko Consent Manager

### Setup 

``` html
<head>
    // load adcm
    <script src="http://develop.disko/assets/js/ad-cm.js"></script>
</head>

<body>

<script>
 // configure consents
 const consents = {
  marketing: {
   id: "marketing",
   checked: false
  },
  statistics: {
   id: "statistics",
   checked: false
  },
  external: {
   id: "external",
   checked: false
  }
 };
 // init with gtm id and consent object
 window.adcm.init("gtmid-xxx", consents);
</script>
```

### The layer


``` html
<div>
        <ul>
            <li>
                <input id="global"
                       type="checkbox"
                       onclick="window.adcm.setConsent('global', this.checked)"/>

                <label for="global">Allow global</label>
            </li>

            <li>
                <input id="marketing"
                       type="checkbox"
                       onclick="window.adcm.setConsent('marketing', this.checked)"/>

                <label for="marketing">Allow marketing</label>
            </li>

            <li>
                <input id="statistics"
                       type="checkbox"
                       onclick="window.adcm.setConsent('statistics', this.checked)"/>

                <label for="statistics">Allow statistics</label>
            </li>

            <li>
                <input id="external"
                       type="checkbox"
                       onclick="window.adcm.setConsent('external', this.checked)"/>

                <label for="external">Allow external</label>
            </li>
        </ul>

        <script>
         document.getElementById("global").checked = window.adcm.hasConsent('global');
         document.getElementById("marketing").checked = window.adcm.hasConsent('marketing');
         document.getElementById("statistics").checked = window.adcm.hasConsent('statistics');
         document.getElementById("external").checked = window.adcm.hasConsent('external');
        </script>
    </div>
```