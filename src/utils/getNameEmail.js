export const getNameEmail = (value) => {
  if (!value) {return null;}

  const regex = /(?:"?([^"]*)"?\s)?(?:<?(.+@[^>]+)>?)/;
  let m, name, email;
  if ((m = regex.exec(value)) !== null) {
    email = m[2];
    name = m[1] || email.slice(0, email.indexOf("@"));
  }
  return { name, email };
}