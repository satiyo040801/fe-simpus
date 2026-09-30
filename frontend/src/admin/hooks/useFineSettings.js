import { useEffect, useState } from "react";

export function useFineSettings() {
  const [finePerDay, setFinePerDay] = useState(1000);

  useEffect(() => {
    const loadFineSettings = () => {
      try {
        const savedFine = localStorage.getItem("perpustakaan_fine_settings");
        if (savedFine) {
          const fineData = JSON.parse(savedFine);
          setFinePerDay(Number(fineData.finePerDay) || 1000);
        } else {
          setFinePerDay(1000);
        }
      } catch (error) {
        setFinePerDay(1000);
      }
    };
    
    loadFineSettings();
    window.addEventListener("profileUpdated", loadFineSettings);
    
    return () => window.removeEventListener("profileUpdated", loadFineSettings);
  }, []);

  return finePerDay;
}
