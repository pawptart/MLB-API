import date from './date_helper';

const baseballUrl = `https://www.baseball-reference.com/boxes/?month=${date.month}&day=${date.day}&year=${date.year}`;

export default baseballUrl;