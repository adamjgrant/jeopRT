m.board.events(_$ => {
    _$.act.get_game_record_id()
        .then(record => _$.act.get_categories(record))
        .catch(error => console.error(error));
});
