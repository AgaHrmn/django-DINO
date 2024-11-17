# Route Planner Application

## Project Overview
The **Route Planner Application** is a cloud-based tool designed to help users generate biking, walking, or running routes tailored to their preferences. Leveraging OpenStreetMap (OSM) data, the application offers flexible route customization and exports results in KML format, compatible with Google Maps.

---

## Features and Functionality

### 1. Route Wizard
- **Route Parameters**:
  - Select activity type: **Bike**, **Walk**, or **Run**.
  - Define route length: **5 km**, **10 km**, **15 km**, or custom distances.
  - Choose surface type: **Asphalt**, **Forest Paths**, or **Mixed**.
  - Specify starting (and optionally ending) locations via address or map selection.
- **Points of Interest (POI)**:
  - Mark POIs along the route such as parks, lakes, and monuments.

### 2. Integration with OpenStreetMap
- Utilizes **OSM** data for route generation.
- Considers attributes like pavement type and route accessibility.
- Processes data through **Overpass API** for optimized querying and route calculations.

### 3. Route Export
- Generates route files in **KML format**.
- Provides simple instructions for importing KML files into Google Maps.

### 4. User Interface
- **Intuitive Design**:
  - Large buttons and fonts for ease of use, especially for elderly users.
  - Step-by-step instructions in **Polish**.
- **Route Preview**:
  - Interactive map view of the generated route.

### 5. Application Availability
- **Cross-Platform Support**:
  - Browser-based version for desktops and tablets.
  - Mobile-friendly version optimized for smartphones.

### 6. No Registration Required
- Fully accessible without user accounts.
- Option to save routes locally.

---

## Technical Stack
- **Frontend**: Responsive web design tailored for accessibility.
- **Backend**: Integration with OpenStreetMap and Overpass API for route computation.
- **Export**: KML file generation for seamless use in Google Maps.

---

## How to Use the Application
1. Open the application in your web browser on any device.
2. Use the **Route Wizard** to set your preferences:
   - Select activity, distance, and surface type.
   - Choose start and end points or select on the map.
3. (Optional) Add Points of Interest to your route.
4. Generate the route and preview it on the map.
5. Export the route as a **KML file** and follow the provided instructions to import it into Google Maps.

---

## Accessibility and Localization
- Designed for users of all ages with an emphasis on simplicity and readability.
- Available in **Polish** for localized instructions and user guidance.

---

## Contribution
This project welcomes contributions! Please submit issues or pull requests via the repository. Ensure code quality and include documentation for any new features.

---
