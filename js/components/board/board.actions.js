m.board.acts({
    get_game_record_id(_$, args) {
        const url_params = new URLSearchParams(window.location.search);
        const game_id = url_params.get("game") || url_params.get("game_id") || url_params.get("game-id");

        return new Promise((resolve, reject) => {
            m.airtable.act.get_by_value({
                table: "Games",
                column_name: "Game ID",
                value: game_id,
                handle_error: (error) => reject(error),
                done: (record) => resolve({ game_record_id: record.id, game_id: game_id })
            });
        });
    },

    get_categories(_$, args) {
        console.log("Requesting categories...");
        let records = [];

        return new Promise((resolve, reject) => {
            m.airtable.act.list({
                table: "Game-Categories",
                params: { filterByFormula: `Game=${args.game_id}` },
                handle_records: (record_page) => { records = records.concat(record_page) },
                handle_error: (error) => { 
                    console.error(error) 
                    return reject(error);
                },
                done: () => { 
                    console.log(`Found categories: ${records.map(r => r.get("Name"))}`)
                    resolve(records.map(record => {
                        return {
                            name: record.get("Name"),
                            answers: record.get("Answers")
                        }
                    }));
                }
            })
        });
    },


    get_answers(_$, categories) {
        console.log("Requesting Category-Answers...");
        let promise_array = [];

        categories.forEach((category, index) => {
            console.log(`Requesting Answers for Category ${category.name}...`);
            let records = [];
            promise_array.push(new Promise((resolve, reject) => {
                m.airtable.act.find_all({
                    table: "Category-Answers",
                    record_ids: category.answers,
                    handle_records: (record_page) => { records = records.concat(record_page) },
                    handle_error: (error) => { console.error(error) },
                    done: (records) => { 
                        console.log(`Found answers for Category ${category.name}: ${records.map(r => r.get("Answer"))}`)
                        categories[index].answers = records.map(r => r.get("Answer"));
                    }
                })
            }));

            Promise.allSettled(promise_array).then(data => {

            });
        });
    }
});

/*
[
    {
        "name": "My category name",
        "answers": [
            {
                "record_id": "rec29302349230",
                "name": "Answer in category",
                "price": 400,
                "answered": false
            }
        ]
    }
]
*/