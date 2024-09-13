# PollenSense API URL Documentation

## URL:

```
https://pollen-feed-hx2ki92mv-ncompass-tvs-projects.vercel.app/
```

## Description:

This URL fetches and displays data from the **PollenSense API** for a specified date and set of category codes. The data includes real-time levels of various particulate matters such as pollen, mold, weed, and grass. The results are visualized using gauges that show `PPM (Parts Per Million)` and `Misery` levels.

---

## URL Parameters:

1. **`date`** (optional)

    - **Type**: `string` (format: `YYYY-MM-DD`)
    - **Description**: Specifies the date for which the data should be fetched.
        - If no `date` is provided, the current date will be used.
    - **Example**: `date=2024-09-12`

2. **`categoryCodes`** (required)
    - **Type**: `string` (comma-separated category codes)
    - **Description**: A list of category codes that determine the types of data to be fetched. Each code corresponds to a specific particulate matter.
    - **Example**: `categoryCodes=POL,MOL,WEE,GRA`
        - `POL`: Pollen
        - `MOL`: Mold
        - `WEE`: Weed/Shrub
        - `GRA`: Grass

### List of Category Codes:

| Category Code | Description              |
| ------------- | ------------------------ |
| POL           | Pollen                   |
| MOL           | Mold                     |
| WEE           | Weed/Shrub               |
| GRA           | Grass                    |
| TRE           | Tree                     |
| OTHPAR        | Other Particulate (Dust) |
| AMB-IVA       | Ambrosia / Iva           |
| ART           | Artemisia                |
| CHE-AMA       | Chenopodium / Amaranthus |
| PLA           | Plantago                 |
| ACE           | Acer                     |
| ALN           | Alnus                    |
| BET           | Betula                   |
| CAR           | Carya                    |
| CUP           | Cupressaceae             |
| FRA           | Fraxinus                 |
| MOR           | Morus                    |
| OLE           | Olea                     |
| PIN           | Pinus                    |
| POP           | Populus                  |
| QUE           | Quercus                  |
| SAL           | Salix                    |
| ULM           | Ulmus                    |
| LOL           | Lolium                   |
| POA           | Poaceae                  |

---

## Example Usage:

### Fetch data for September 12, 2024, for categories: Pollen, Mold, Weed, and Grass

```
https://pollen-feed-hx2ki92mv-ncompass-tvs-projects.vercel.app/?date=2024-09-12&categoryCodes=POL,MOL,WEE,GRA
```

-   **`date=2024-09-12`**: Fetches data for September 12, 2024.
-   **`categoryCodes=POL,MOL,WEE,GRA`**: Fetches data for Pollen, Mold, Weed, and Grass.

### Fetch data for today's date for categories: Pollen and Grass

```
https://pollen-feed-hx2ki92mv-ncompass-tvs-projects.vercel.app/?categoryCodes=POL,GRA
```

-   **`date`**: Defaults to the current date (if omitted).
-   **`categoryCodes=POL,GRA`**: Fetches data for Pollen and Grass.

---

## Notes:

-   If no `date` is provided, the current date will automatically be used.
-   The `categoryCodes` parameter is required and must include at least one valid category code.
-   Data is displayed in the form of gauges for each category, showing the current PPM and Misery levels based on the API response.

This URL is used to visualize environmental particulate data for specific dates and categories based on real-time information from the **PollenSense API**.
