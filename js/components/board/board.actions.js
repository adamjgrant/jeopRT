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
                done: (record) => resolve({ game_record_id: record.id })
            });
        });
    },

    get_categories(_$, args) {
        console.log(args);
    }
});
