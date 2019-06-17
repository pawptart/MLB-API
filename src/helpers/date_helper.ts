let yesterdaysDate = new Date;
yesterdaysDate.setDate(yesterdaysDate.getDate() - 2);
const date = {
	year: yesterdaysDate.getFullYear(),
	month: yesterdaysDate.getMonth() + 1,
	day: yesterdaysDate.getDate()
};

export default date;