m.score.acts({
  setup(_$, args) {
    const board = document.querySelector("[data-component~='board']")
    board.innerHTML += `
      <div id="scorebox"></div>
    `
    const players = _$.act.get_players(args);
    _$.act.add_score_boxes({ players: players });
    return args;
  },

  priv: {
    add_score_boxes(_$, args) {
        const scorebox = document.getElementById("scorebox");
        scorebox.innerHTML = "";
        args.players.forEach(player => {
            const markup = _$.act.generate_score_markup(player);
            scorebox.innerHTML += markup;
        })
    },

    generate_score_markup(_$, args) {
        return `
            <div data-component="score">
                <div class="amount">${args.score}</div>
                <div class="name">${args.name}</div>
            </div>
        `;
    },

    get_players(_$, args) {
        return args.players.map((name, index) => {
            return {
                name: name,
                score: args.scores[index]
            };
        })
    }
  }
});
