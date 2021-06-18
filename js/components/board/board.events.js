m.board.events(_$ => {
    _$.act.load_board_data();

    _$.act.get_settings_value({ setting: "Refresh rate in seconds" })
        .then(rate_in_seconds => {
            if (rate_in_seconds > 0) {
                setInterval(_$.act.load_board_data, rate_in_seconds * 1000);
            }
        });
});