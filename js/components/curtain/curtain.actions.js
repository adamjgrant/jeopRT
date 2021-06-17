m.curtain.acts({
    hide(_$, args) {
        if (m.curtain.game_started) _$.me().style.display = "none";
    },

    show(_$, args) {
        _$.me().style.display = "flex";
    },

    set_game_started(_$, args) {
        m.curtain.game_started = true;
    },

    unset_game_started(_$, args) {
        m.curtain.game_started = false;
        _$.act.show();
    }
});

m.curtain.game_started = false;