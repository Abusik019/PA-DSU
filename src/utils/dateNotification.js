export function handleIsTrueDate(apiDate) {
    const dateFromApi = new Date(apiDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isToday = dateFromApi >= today && dateFromApi < new Date(today).setDate(today.getDate() + 1);

    const isYesterday = dateFromApi >= yesterday && dateFromApi < today;

    return {
        isToday,
        isYesterday
    };
}