export const getValidEmails = (emailInput) => {
  let result = [];
  if (!emailInput || emailInput.trim() === '') {
    return result;
  }
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const emails = emailInput.trim().replace(/[;\s]/g, ',').split(',');

  for (let i = 0; i < emails.length; i++) {
    const e = emails[i];
    if (e === '') {continue;}

    if (regex.test(e)) {
      result.push(e);
    }
    else {
      result = [];
      break;
    }
  }

  return result;
}