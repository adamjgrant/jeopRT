m.column.acts({
    /*
    Expects {
        category: <category array item>
    }
    */
    add_to_board(_$, args) {
        const existing = _$.act.find_existing_markup(args);
        if (existing) m.board.act.remove_column(args)
        const markup = _$.act.generate_markup(args);
        m.board.act.append_column({ markup: markup })
    },

    find_existing_markup(_$, args) {
        return // TODO;
    },

    priv: {
        generate_markup(_$, args) {
           return `
             <div data-component="column" data-column="${args.name}">
               <div class="header">${args.name}</div>
             </div>
           ` 
        }
    }
});
