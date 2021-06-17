m.board.acts({
    load_board_data(_$, args) {
        _$.act.get_game_record_id()
            .then(record => _$.act.get_categories(record))
            .then(categories => _$.act.get_answers(categories))
            .then(categories_with_answers => console.log())
            .catch(error => console.error(error));
    },

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
        return new Promise((resolve, reject) => {
            console.log("Requesting Category-Answers...");
            let promises_array = [];

            categories.forEach((category, index) => {
                promises_array.push(new Promise((resolve, reject) => {
                    console.log(`Requesting Answers for Category ${category.name}...`);
                    let records = [];
                    m.airtable.act.find_all({
                        table: "Category-Answers",
                        record_ids: category.answers,
                        handle_records: (record_page) => { records = records.concat(record_page) },
                        handle_error: (error) => { console.error(error) },
                        done: (records) => { 
                            console.log(`Found answers for Category ${category.name}: ${records.map(r => r.get("Answer"))}`);
                            categories[index].answers = categories[index].answers.map((answer, i) => {
                                const record = records[i];
                                return {
                                    name: record.get("Answer"),
                                    price: record.get("Price"),
                                    answered: !!record.get("Won by")
                                }
                            });

                            resolve(categories);
                        }
                    });
                }))
            });

            Promise.allSettled(promises_array).then(data => {
                // Now we have all the data, need to turn it into markup now.
                m.board.data = categories;
                return resolve(categories)
            });
        })
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