const REFRESH_RATE_IN_SECONDS = 5;

m.board.events(_$ => {
    _$.act.load_board_data()

    // setInterval(_$.act.load_board_data, REFRESH_RATE_IN_SECONDS * 1000);
});