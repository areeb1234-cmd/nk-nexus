/**
 * Market Status & Proximity Utility
 * Pure client-side calculation using device Date & time
 */

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Parses time string like "08:00" or "14:30" into minutes from midnight
 */
export function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.trim().split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

/**
 * Determines market operational status: 'open', 'soon', or 'closed'
 */
export function getMarketStatus(market, overrideDate = null) {
  const now = overrideDate || new Date();
  const currentDayName = DAYS_OF_WEEK[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (!market || !market.hours) {
    return {
      code: 'closed',
      label: 'Closed',
      detail: 'Hours unavailable',
      todayHours: 'Closed',
      dayName: currentDayName,
      lastChecked: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  const todaySchedule = market.hours[currentDayName];

  if (!todaySchedule || todaySchedule.toLowerCase().includes('closed')) {
    // Find next open day
    let nextOpen = null;
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (now.getDay() + i) % 7;
      const nextDay = DAYS_OF_WEEK[nextDayIndex];
      const nextSched = market.hours[nextDay];
      if (nextSched && !nextSched.toLowerCase().includes('closed')) {
        nextOpen = { day: nextDay, hours: nextSched };
        break;
      }
    }

    return {
      code: 'closed',
      label: 'Closed Today',
      detail: nextOpen ? `Opens ${nextOpen.day} (${nextOpen.hours})` : 'Closed',
      todayHours: 'Closed',
      dayName: currentDayName,
      lastChecked: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // Parse today's range, e.g. "08:00-14:00"
  const parts = todaySchedule.split('-');
  if (parts.length === 2) {
    const openMinutes = timeToMinutes(parts[0]);
    const closeMinutes = timeToMinutes(parts[1]);

    // Open right now
    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      const minsRemaining = closeMinutes - currentMinutes;
      const hoursRemaining = Math.floor(minsRemaining / 60);
      const remainingLabel = hoursRemaining > 0 
        ? `Closes in ${hoursRemaining}h ${minsRemaining % 60}m` 
        : `Closes in ${minsRemaining}m`;

      return {
        code: 'open',
        label: 'Open Now',
        detail: remainingLabel,
        todayHours: todaySchedule,
        dayName: currentDayName,
        lastChecked: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    // Opens soon (within 60 minutes)
    if (currentMinutes < openMinutes && openMinutes - currentMinutes <= 60) {
      const minsUntil = openMinutes - currentMinutes;
      return {
        code: 'soon',
        label: 'Opening Soon',
        detail: `Opens in ${minsUntil} mins (${parts[0].trim()})`,
        todayHours: todaySchedule,
        dayName: currentDayName,
        lastChecked: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    // Closed earlier today or opens later today
    if (currentMinutes < openMinutes) {
      return {
        code: 'closed',
        label: 'Opens Today',
        detail: `Opens at ${parts[0].trim()}`,
        todayHours: todaySchedule,
        dayName: currentDayName,
        lastChecked: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } else {
      return {
        code: 'closed',
        label: 'Closed for Today',
        detail: `Closed at ${parts[1].trim()}`,
        todayHours: todaySchedule,
        dayName: currentDayName,
        lastChecked: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }
  }

  return {
    code: 'closed',
    label: 'Closed',
    detail: 'Schedule pending',
    todayHours: todaySchedule || 'Closed',
    dayName: currentDayName,
    lastChecked: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

/**
 * Calculates Great-Circle distance using Haversine formula
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const km = R * c;
  return Number(km.toFixed(1));
}
