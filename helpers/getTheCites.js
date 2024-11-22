export function getCitiesByGovernorate(governorateName, data) {
    const governorate = data.find(item => item.arabicName === governorateName || item.englishName === governorateName);
    if (governorate) {
        return governorate.cities;
    } else {
        return [];
    }
}