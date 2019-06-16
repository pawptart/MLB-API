import Axios = require('axios');
import baseballUrl from './helpers/url_helper';
import cheerio from 'cheerio';
import ballparks from './helpers/ballparks';

Axios.default.get(baseballUrl)
.then( (response: any) => {
	scrapeHtml(response.data);
})
.catch( (error: any) => {
	console.log(error);
});

function scrapeHtml(html: any) {
	let games: any = [];
	const $ = cheerio.load(html);

	$('div.game_summary').each((i, elem) => {
		let winner = $(elem).find('tr.winner td:not([class]) a').text();
		let loser = $(elem).find('tr.loser td:not([class]) a').text();
		let winningScore = $(elem).find('tr.winner td.right').first().text();
		let losingScore = $(elem).find('tr.loser td.right').first().text();
		let winningPitcher = $(elem).find('table:not([class]) tbody tr td').eq(1).text();
		let losingPitcher = $(elem).find('table:not([class]) tbody tr td').eq(3).text();
		let savePitcher = $(elem).find('table:not([class]) tbody tr td').eq(5).text();
		let homeTeam = $(elem).find('table.teams tbody tr td a').eq(2).text();
		let awayTeam = $(elem).find('table.teams tbody tr td a').eq(0).text();

		games.push({
			game: {
				winning_team: { 
					name: winner,
					score: winningScore,
					winning_pitcher: winningPitcher,
					save_pitcher: savePitcher
				},
				losing_team: {
					name: loser,
					score: losingScore,
					losing_pitcher: losingPitcher
				},
				played_at: {
					home_team: homeTeam,
					away_team: awayTeam,
					location: ballparks[homeTeam]
				}
			}
		});

	});	
}
