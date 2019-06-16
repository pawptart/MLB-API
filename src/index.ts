import Axios = require('axios');
import baseballUrl from './helpers/url_helper';

Axios.default.get(baseballUrl)
	.then( (response: any) => {
		console.log(response);
	})
	.catch( (error: any) => {
		console.log(error);
	});