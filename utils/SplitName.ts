 export const splitFullName = (fullName: string) => {
    const nameParts = fullName.trim().split(' ');
  
    if (nameParts.length === 1) {
      return { firstName: nameParts[0], lastName: '' };
    }
  
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
  
    return { firstName, lastName };
  };