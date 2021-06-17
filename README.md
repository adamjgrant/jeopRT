# jeopRT
Use Airtable to play a game of Jeopardy

## About

This game is designed so the web front end does not require any user interaction.
The frontend will refresh from Airtable at a rate in seconds defined in `js/configuration.js`.
To hook this up to your Airtable instance, you'll also need to update the Base ID and API Key there.
Per Airtable's recommendations, you should create a new Airtable user that has access to just your Jeopardy base and use that user's API key.