// Deterministic weather generation for demo reliability
export const generateWeather = (stormActive) => {
  if (stormActive) {
    // Guaranteed to trigger SEVERE thresholds (>120mm/24h or >250mm/72h)
    return {
      hz126: { rain24h: 150, rain72h: 280 },
      hz164: { rain24h: 160, rain72h: 290 },
      hz175: { rain24h: 180, rain72h: 310 }
    };
  } else {
    // Guaranteed to trigger LOW thresholds (<40mm/24h)
    return {
      hz126: { rain24h: 5, rain72h: 10 },
      hz164: { rain24h: 2, rain72h: 8 },
      hz175: { rain24h: 4, rain72h: 12 }
    };
  }
};