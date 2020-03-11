/*
 * Copyright 2020 Atelier Disko. All rights reserved.
 *
 * Use of this source code is governed by the AD General Software
 * License v1 that can be found under https://atelierdisko.de/licenses
 *
 * This software is proprietary and confidential. Redistribution
 * not permitted. Unless required by applicable law or agreed to
 * in writing, software distributed on an "AS IS" BASIS, WITHOUT-
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 */
const storage = {
 hasConsent: (type) => {
  return localStorage.getItem(`adcm_consent_${type}`) == "true";
 },
 setConsent: (type, value) => {
  localStorage.setItem(`adcm_consent_${type}`, value);
  storage.updateDataLayer();

  if (storage.hasConsent("global")) {
   loadGTM(window.adcm.gtmId)
  }
 },
 updateDataLayer: () => {
  if (!window.adcm.intialized) {
   return
  }

  const data = [];

  for (let [key, value] of Object.entries(localStorage)) {
   if (key.startsWith("adcm_consent")) {
    data.push({
     id: key.split("_")[2],
     checked: value
    });
   }
  }

  window.dataLayer.push({consents: data});
 }
};

const snippetProvider = {
 iframe: (id) => {
  return `<iframe src="https://www.googletagmanager.com/ns.html?id=${id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;

 },
 script: (id) => {
  return `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer', "${id}");
    `;
 }
};

const tagProvider = {
 script: (id) => {
  const script = document.createElement('script')
  script.innerHTML = snippetProvider.script(id)

  return script
 },

 noScript: (id) => {
  const noscript = document.createElement('noscript')
  noscript.innerHTML = snippetProvider.iframe(id)

  return noscript
 },
};

const defaultConsents = {
 global: {
  id: "global",
  checked: false
 }
};

const loadGTM = (id) => {
 if (!window.adcm.intialized) {
  document.head.insertBefore(tagProvider.script(id), document.head.childNodes[0])
  document.body.insertBefore(tagProvider.noScript(id), document.body.childNodes[0])
  window.adcm.intialized = true;
  storage.updateDataLayer();
 }
}

const adcm = {
 gtmId: null,
 consents: {},
 intialized: false,
 init: (gtmId, consents) => {
  window.adcm.gtmId = gtmId;

  // load tagmanger if user has sent his consent
  if (storage.hasConsent("global")) {
   loadGTM(gtmId)
  }

  // else remove?

 },
 setConsent: storage.setConsent,
 hasConsent: storage.hasConsent
};

window.adcm = adcm;
