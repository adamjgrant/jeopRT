m.board.events(_$ => {
    _$.act.load_board_data()

    if (REFRESH_RATE_IN_SECONDS > 0) {
        setInterval(_$.act.load_board_data, REFRESH_RATE_IN_SECONDS * 1000);
    }
});