m.board.events(_$ => {
    _$.act.get_game_record_id()
        .then(record => _$.act.get_categories(record))
        .then(data => console.log(data))
        .catch(error => console.error(error));
});
