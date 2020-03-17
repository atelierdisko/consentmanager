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

const createElement = (tag, extend) => {
  const target = document.createElement(tag);
  let { children = [], ...others} = extend;
  children = Array.isArray(children) ? children : [children];
  Object.entries(others).forEach(([k, v]) => {
    if (typeof v === 'object') {
      Object.assign(target[k], v);
    } else {
      target[k] = v;
    }
  });
  children.forEach((child) => {
    let [[k, v]] = Object.entries(child);
    target.append(createElement(k, v));
  });
  return target;
};

const provideSnippets = (id) => {
 const snippets = [
  {
   insert: 'head',
   insertFn: 'prepend',
   element: createElement('script', {
    innerHTML:
      `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer', "${id}");
      `
   }),
  }, {
   insert: 'body',
   insertFn: 'append',
   element: createElement('noscript', {
    children: {
     iframe: {
      src: `https://www.googletagmanager.com/ns.html?id=${id}`,
      height: '0',
      width: '0',
      style: { 'display':'none', 'visibility': 'hidden' },
     }
    }
   })
  },
 ];
 snippets.forEach((snippet) => {
  const apply = () => {
   document[snippet.insert][snippet.insertFn](snippet.element);
  }
  try {
   apply();
  } catch (err) {
   document.addEventListener('DOMContentLoaded', apply);
  }
 });
};

const defaultConsents = {
 global: {
  id: "global",
  checked: false
 }
};

const loadGTM = (id) => {
 if (!window.adcm.intialized) {
  provideSnippets(id);
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

export default adcm;
