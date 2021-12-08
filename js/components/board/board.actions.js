m.board.acts({
    load_board_data(_$, args) {
        return new Promise((resolve, reject) => {
            _$.act.get_game_record_id()
                .then(record => _$.act.set_board_visibility(record))
                .then(record => m.score.act.setup(record))
                .then(record => _$.act.get_categories(record))
                .then(categories => _$.act.get_answers(categories))
                .then(categories_with_answers => {
                    categories_with_answers.forEach(category => {
                        const markup = m.column.act.generate_markup(category);
                        _$.act.append_column({ markup: markup, category: category });
                    });
                    resolve();
                })
                .catch(error => console.error(error));
        });
    },

    set_board_visibility(_$, args) {
        return new Promise((resolve, reject) => {
            if (args.started) m.curtain.act.set_game_started();
            else m.curtain.act.unset_game_started();
            return resolve(args);
        });
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
                done: (record) => resolve({
                    game_record_id: record.id,
                    game_id: game_id,
                    started: record.get("Started"),
                    players: record.get("Player Names"),
                    scores: record.get("Player Scores")
                })
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
                    const _categories = records.map(record => {
                        return {
                            id: record.id,
                            name: record.get("Name"),
                            answers: record.get("Answers")
                        }
                    });
                    const categories_sorted = _$.act.sort_columns({ columns: _categories });
                    resolve(_categories);
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
                            categories[index].answers = categories[index].answers.map((answer, i) => {
                                const record = records[i];
                                return {
                                    name: record.get("Answer"),
                                    price: record.get("Price"),
                                    selected: record.get("Selected"),
                                    answered: (!!record.get("Won by")) || (record.get("Wager") && !!record.get("Lost by"))
                                }
                            });

                            resolve(categories);
                        }
                    });
                }))
            });

            Promise.all(promises_array).then(data => {
                // Now we have all the data, need to turn it into markup now.
                m.board.data = categories;
                m.curtain.act.hide();
                const js_styles = document.getElementById("js-styles");
                js_styles.innerHTML = `html { --number-of-categories: ${categories.length} }`;
                console.log(categories);
                return resolve(categories)
            });
        })
    },

    append_column(_$, args) {
        if (!m.column.act.exists(args.category)) {
            _$.me().innerHTML += args.markup;
        }
        m.column.act.set_header_visibility(args.category);
        m.column.act.add_answers(args.category);
    },

    remove_column(_$, args) {
        return // TODO;
    },

    get_settings_value(_$, args) {
        return new Promise((resolve, reject) => {
            m.airtable.act.get_by_value({
                table: "Settings",
                column_name: "Key",
                value: args.setting,
                done: (record) => {
                    resolve(record.get("Value"));
                },
                handle_error: (error) => {
                    console.log(error);
                    reject(error);
                }
            })
        })
    },

    priv: {
        sort_columns(_$, args) {
            return args.columns.sort((p, n) => {
                return p.name > n.name ? 1 : -1;
            });
        }
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