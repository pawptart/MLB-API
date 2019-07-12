# MLB-scraper
[![NodeJS](https://img.shields.io/badge/Node-v10.15.3-green.svg)](https://nodejs.org/en/)
[![Maintenance](https://img.shields.io/badge/Maintained-Yes-green.svg)](https://nodejs.org/en/)
[![GitHub issues](https://img.shields.io/github/issues/pawptart/MLb-scraper.svg)](https://github.com/pawptart/MLB-scraper/issues/)

A web scraper for MLB game scores posted nightly to a MongoDB database. 

MLB-scraper pulls data from [Baseball-Reference](https://www.baseball-reference.com/) nightly and uploads what it finds to a publicly accessible database. If you would like to retrieve a day's game data, you can check out [my other repo for the API](https://github.com/pawptart/MLB-server) to view the documentation.

As with any scraper, it is very fragile with the possibility of breaking with any major changes to Baseball-Reference.com. If you notice strange or incomplete data, please [open a new issue](https://github.com/pawptart/MLB-scraper/issues) to help keep this repo up-to-date!

Here's an example of a section of the data uploaded nightly:

```https://mlb-api-server.herokuapp.com/api/games/7/2/2019```

```
{
    "_id": "5d1c7ccb3b787f001e45258f",
    "date": {
        "year": 2019,
        "month": 7,
        "day": 2
    },
    "games_played": true,
    "games": [
        {
            "game": {
                "winning_team": {
                    "name": "Milwaukee Brewers",
                    "runs": 8,
                    "winning_pitcher": {
                        "name": "Alex Claudio",
                        "record": {
                            "wins": 2,
                            "losses": 2
                        }
                    },
                    "save_pitcher": {
                        "name": "Jeremy Jeffress",
                        "saves": 1
                    }
                },
                "losing_team": {
                    "name": "Cincinnati Reds",
                    "runs": 6,
                    "losing_pitcher": {
                        "name": "David Hernandez",
                        "record": {
                            "wins": 2,
                            "losses": 4
                        }
                    }
                },
                "played_at": {
                    "home_team": "Cincinnati Reds",
                    "away_team": "Milwaukee Brewers",
                    "location": "Great American Ballpark"
                },
                "total_innings": 9
            }
        },
        . . .
    ]
}
```
