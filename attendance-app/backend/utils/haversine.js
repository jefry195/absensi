/**
 * Haversine Formula for distance calculation between two GPS coordinates in meters.
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius of Earth in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
              
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Validates GPS accuracy requirement (<30 meters)
 */
function isGPSAccuracyValid(accuracyInMeters) {
    return accuracyInMeters !== undefined && accuracyInMeters <= 30;
}

module.exports = {
    calculateHaversineDistance,
    isGPSAccuracyValid
};
