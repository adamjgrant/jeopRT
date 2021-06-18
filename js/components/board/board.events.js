m.board.events(_$ => {
    _$.act.load_board_data();

    _$.act.get_settings_value({ setting: "Refresh rate in seconds" })
        .then(rate_in_seconds => {
            const repeat = () => {
                _$.act.load_board_data().then(x => {
                    if (rate_in_seconds > 0) {
                        setTimeout(repeat, rate_in_seconds * 1000);
                    }
                })
            };
            repeat();
        });
});