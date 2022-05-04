import Numeral from 'numeral';

export default function toCurrency(price) {
  let num = Numeral(price);
  var currency = num.format(`0,0`);
  return currency;
}
