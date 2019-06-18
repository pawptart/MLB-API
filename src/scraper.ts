import Axios = require('axios');
import { baseballUrl, date } from './helpers/url_helper';
import cheerio from 'cheerio';
import ballparks from './helpers/ballparks';
import { mongoConnect } from './helpers/mongo-helper';

// MongoDB URL
const mongoUrl = 'mongodb+srv://test:test@cluster0-9igoz.mongodb.net/test?retryWrites=true&w=majority';

// Scrape raw HTML from Baseball-Reference
Axios.default.get(baseballUrl)
.then( (response: any) => {
	scrapeHtml(response.data);
})
.catch( (error: any) => {
	console.log(error);
});

// Scrape data from raw HTML
function scrapeHtml(html: any) {

	let games: any = { 
		date: date,
		games: []
	};
	
	const $ = cheerio.load(html);

	// Pull data from each game summary 
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
		let possibleExtraInnings = $(elem).find('tr td.right').text().trim();

		// Extract saves from savePitcher
		const saveRegex = new RegExp(/\d\d?/g)
		const savePitcherSaves = savePitcher.match(saveRegex);
		let saves = ''
		if (savePitcherSaves) {
			saves = savePitcherSaves[0];
		}

		// Extract record as W / L from winningPitcher && losingPitcher
		const pitcherRecordRegex = new RegExp(/\d\d?\d?-\d\d?\d?/g);

		let winningPitcherRecord = winningPitcher.match(pitcherRecordRegex);
		let losingPitcherRecord = losingPitcher.match(pitcherRecordRegex);

		let winningPitcherWins = '';
		let winningPitcherLosses = '';
		let losingPitcherWins = '';
		let losingPitcherLosses = '';

		if (winningPitcherRecord) {
			winningPitcherWins = winningPitcherRecord[0].split('-')[0];
			winningPitcherLosses = winningPitcherRecord[0].split('-')[1];
		}

		if (losingPitcherRecord) {
			losingPitcherWins = losingPitcherRecord[0].split('-')[0];
			losingPitcherLosses = losingPitcherRecord[0].split('-')[1];
		}

		// Remove record from pitcher name
		winningPitcher = winningPitcher.slice(0,winningPitcher.indexOf('\(') - 1);
		losingPitcher = losingPitcher.slice(0,losingPitcher.indexOf('\(') - 1);
		savePitcher = savePitcher.slice(0,savePitcher.indexOf('\(') - 1);

		// Check for extra innings, else default to 9
		const extraInningsRegex = new RegExp(/\(\d\d?\)/g);
		let innings = possibleExtraInnings.match(extraInningsRegex);
		let finalInnings = '9';
		if (innings) {
			finalInnings = innings[0].slice(1, ( innings[0].length - 1 ) );
		}

		// Push game data to the games object
		games.games.push({
			game: {
				winning_team: { 
					name: winner,
					score: winningScore,
					winning_pitcher: winningPitcher,
					winning_pitcher_record: {
						wins: winningPitcherWins, 
						losses: winningPitcherLosses
					},
					save_pitcher: savePitcher,
					saves: saves
				},
				losing_team: {
					name: loser,
					score: losingScore,
					losing_pitcher: losingPitcher,
					losing_pitcher_record: {
						wins: losingPitcherWins,
						losses: losingPitcherLosses
					}
				},
				played_at: {
					home_team: homeTeam,
					away_team: awayTeam,
					location: ballparks[homeTeam]
				},
				total_innings: finalInnings
			}
		});
	});

	// Define postData to post to MongoDB
	let postData = async (req: any) => {
		const { mongoDb, mongoClient } = await mongoConnect(mongoUrl, 'game');
		try {
			await mongoDb.collection('games').insertOne(req);
		}
		catch (err) {
			console.log(err);
			return;
		}

		try {
			await mongoClient.close();
			console.log("Data posted successfully!");
			process.exit(0);
		}
		catch (err) {
			console.log(err);
			return;
		}
		
	};

	// Post the data
	postData(games);
}

