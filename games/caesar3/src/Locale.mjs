import uk from './locales/uk.mjs';

const locales = {
  uk
};
const defaultLocale = 'uk';

export default 
class Locale {
  static t(str) {
    return locales[defaultLocale][str] || str;
  }
  
  static randomName() {
    const { names } = locales[defaultLocale];
    return names[Math.floor(Math.random() * names.length)];
  }
}
