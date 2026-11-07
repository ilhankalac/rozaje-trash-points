# Očistimo Rožaje — trash points map

A civic monitoring tool for illegal dumpsites around Rožaje, Montenegro, built together with local ecological volunteers.

Anyone can report a dumpsite with a photo and a pin on the map. Volunteers clean it on the ground and flip its status from **unresolved** to **cleaned**.

**Live:** https://prod-rozaje-trash-points.web.app/

## Features
- Interactive map console with status filters and search by settlement
- Reporting with photo and geolocation
- Community dashboard tracking cleanup progress over time
- Volunteer accounts for managing dumpsite status

## Tech stack
Vue · Vuetify · Leaflet · Firebase (Firestore, Authentication, Storage, Hosting)

## Run locally
```bash
npm install
npm run serve
```

Build for production with `npm run build`.
