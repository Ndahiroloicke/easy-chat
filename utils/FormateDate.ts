 export const formatDate = (inputDate: string): string => {
    const date = new Date(inputDate);
  
    if (isNaN(date.getTime())) {
      throw new Error('Invalid Date');
    }
  
    const months: string[] = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
  
    const day: number = date.getDate();
    const month: string = months[date.getMonth()];
    const year: number = date.getFullYear();
  
    let hours: number = date.getHours();
    const minutes: number = date.getMinutes();
    const ampm: string = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
  
    const minutesStr: string = minutes < 10 ? `0${minutes}` : minutes.toString();
  
    return `${day} ${month} ${year} - ${hours}:${minutesStr} ${ampm}`;
  };