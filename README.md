# jeopRT
Use Airtable to play a game of Jeopardy

## About

This game is designed so the web front end does not require any user interaction.
The frontend will refresh from Airtable at a rate in seconds defined in `js/configuration.js`.
To hook this up to your Airtable instance, you'll also need to update the Base ID and API Key there.
Per Airtable's recommendations, you should create a new Airtable user that has access to just your Jeopardy base and use that user's API key.

## Game Controls

1. First create a game and add some players.
2. Create categories and add answers to your categories. Remember that players are prompted with *answers* not *questions* in Jeopardy.
3. You'll have a nice splash page until the game starts, then you can use the checkbox on the game row to start the game. It should automatically go to the board (Wait for a refresh).
4. Wait for a player to select an answer, then click the "selected" checkbox to have it show full screen.
5. Move to the "Won by" cell for that answer and get ready to enter the winning player. Fastest way is just to start typing a few letters of their first name and hit enter when airtable finds it.
6. No need to uncheck "selected." This is by design to keep the game play zippy.

## Viewing the game
Visit the root of the site with `?game=` and the ID of the game you want to play.