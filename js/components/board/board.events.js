m.board.events(_$ => {
    _$.act.get_game_record_id()
        .then(record => _$.act.get_categories(record))
        .then(categories => _$.act.get_answers(categories))
        .catch(error => console.error(error));
});
