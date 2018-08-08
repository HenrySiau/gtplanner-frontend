import {isEmailFormatOK, strip} from '../components/utility/Validator';

describe('test email format validator', () => {
    it('without @', () => {
      expect(isEmailFormatOK('henry.com')).toBe(false);
      expect(isEmailFormatOK('henry@gmail.com')).toBe(true);
  
    });
    it('without .', () => {
        expect(isEmailFormatOK('henry@gmailcom')).toBe(false);
        expect(isEmailFormatOK('henry@k.co')).toBe(true);
      });
      it('without prefix', () => {
        expect(isEmailFormatOK('@gmail.com')).toBe(false);
        expect(isEmailFormatOK('gmail@.com')).toBe(false);
      });
  });

  describe('test strip function', () => {
    it('trilling space in the front', () => {
      expect(strip(' abc')).toBe('abc');
      expect(strip('  abc')).toBe('abc');
    });
    it('trilling space at the end', () => {
        expect(strip('abc ')).toBe('abc');
        expect(strip('abc  ')).toBe('abc');
      });
      it('trilling space at both ends', () => {
        expect(strip(' abc  ')).toBe('abc');
        expect(strip('  abc ')).toBe('abc');
      });
  });